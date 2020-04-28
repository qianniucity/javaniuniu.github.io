---
title: HandlerMethodArgumentResolver解析器说明
permalink: /Handler/HandlerMethodArgumentResolver/explanation
tags: Handler解析器
key: Handler-HandlerMethodArgumentResolver-explanation
---
前面已经讲了很多关于 **过滤器** 相关内容，接下来会陆续讲到对拦截的数据，我们还能做些啥？   
1. SpringMVC解析器用于解析`request`请求参数并将绑定数据到Controller的入参上。
2. 自定义一个参数解析器需要实现`HandlerMethodArgumentResolver接口`，`重写supportsParameter和resolveArgument方法`，配置文件中加入resolver配置。
3. 如果需要多个解析器同时生效需要在一个解析器中对其他解析器做兼容

### 为什么要自定义一个解析器呢？
源于需要对前端请求参数进行手动URLDecode，也即除了Web容器自动decode一次，代码内还需要再decode一次。   
针对这种需求，首先想到的是`filter`或者`interceptor`实现，但是由于HttpServletRequest对象本身是不提供setParameter()方法的，因此想要修改request中的参数值为decode后的值是不易达到的。    
SpringMVC的HandlerMethodArgumentResolver，解析器；其功能就是解析request请求参数并绑定数据到Controller的入参上。因此自定义解析器加入URLDecode逻辑即可完全满足需求。

下面，就一步一步的完成一个解析器由简到繁的实现过程。

#### 实现一个极其简单的参数解析器
实现HandlerMethodArgumentResolver接口，重写supportsParameter和resolveArgument方法，配置文件中加入resolver配置。

示例代码如下：

- 自定义解析器实现

```java
public class MyArgumentsResolver implements HandlerMethodArgumentResolver {
    /**
     * 解析器是否支持当前参数
     */
    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        // 指定参数如果被应用MyParam注解，则使用该解析器。
        // 如果直接返回true，则代表将此解析器用于所有参数
        return parameter.hasParameterAnnotation(MyParam.class);
    }

    /**
     * 将request中的请求参数解析到当前Controller参数上
     * @param parameter 需要被解析的Controller参数，此参数必须首先传给{@link #supportsParameter}并返回true
     * @param mavContainer 当前request的ModelAndViewContainer
     * @param webRequest 当前request
     * @param binderFactory 生成{@link WebDataBinder}实例的工厂
     * @return 解析后的Controller参数
     */
    @Override
    public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer,
                                  NativeWebRequest webRequest, WebDataBinderFactory binderFactory) throws Exception {

        return null;
    }
}
```
- 自定义注解

```java
@Target({ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface MyParam {
}
```
- 在springmvc配置文件中注册解析器

```xml
<mvc:annotation-driven>
        <!--MyArgumentsResolver-->
        <mvc:argument-resolvers>
            <bean class="xxx.xxx.xxx.MyArgumentsResolver"/>
        </mvc:argument-resolvers>
</mvc:annotation-driven>
```

好了，现在解析器会把所有应用了@MyParam注解的参数都赋值为null。

#### 实现一个解析原始类型的参数解析器
对于如何解析原始类型参数，SpringMVC已经有了一个内置的实现——`RequestParamMethodArgumentResolver`，因此完全可以参考这个实现来自定义我们自己的解析器。

如上所述，解析器逻辑的主要部分都在resolveArgument方法内，这里就说说自定义该方法的实现。

```java
@Override
public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer,
                              NativeWebRequest webRequest, WebDataBinderFactory binderFactory) throws Exception {

    // 解析器中的自定义逻辑——urldecode
    Object arg = URLDecoder.decode(webRequest.getParameter(parameter.getParameterName()), "UTF-8");

    // 将解析后的值绑定到对应的Controller参数上，利用DataBinder提供的方法便捷的实现类型转换
    if (binderFactory != null) {

        // 生成参数绑定器，第一个参数为request请求对象，第二个参数为需要绑定的目标对象，第三个参数为需要绑定的目标对象名
        WebDataBinder binder = binderFactory.createBinder(webRequest, null, parameter.getParameterName());

        try {

            // 将参数转到预期类型，第一个参数为解析后的值，第二个参数为绑定Controller参数的类型，第三个参数为绑定的Controller参数
            arg = binder.convertIfNecessary(arg, parameter.getParameterType(), parameter);

        } catch (ConversionNotSupportedException ex) {
            throw new MethodArgumentConversionNotSupportedException(arg, ex.getRequiredType(),
                    parameter.getParameterName(), parameter, ex.getCause());
        } catch (TypeMismatchException ex) {
            throw new MethodArgumentTypeMismatchException(arg, ex.getRequiredType(),
                    parameter.getParameterName(), parameter, ex.getCause());
        }
    }
    return arg;
}
```
#### 添加解析对象类型参数的功能
对于如何解析对象类型参数，SpringMVC内也有了一个内置的实现——`ModelAttributeMethodProcessor`，我们也是参考这个实现来自定义我们自己的解析器。

同样，resolveArgument方法示例如下
```java
@Override
public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer,
                              NativeWebRequest webRequest, WebDataBinderFactory binderFactory) throws Exception {

    String name = parameter.getParameterName();

    // 查找是否已有名为name的参数值的映射，如果没有则创建一个
    Object attribute = mavContainer.containsAttribute(name)
        ? mavContainer.getModel().get(name)
        : this.createAttribute(name, parameter, binderFactory, webRequest);

    if (binderFactory != null) {
        WebDataBinder binder = binderFactory.createBinder(webRequest, attribute, name);

        if (binder.getTarget() != null) {
            // 进行参数绑定
            this.bindRequestParameters(binder, webRequest);
        }

        // 将参数转到预期类型，第一个参数为解析后的值，第二个参数为绑定Controller参数的类型，第三个参数为绑定的Controller参数
        attribute = binder.convertIfNecessary(binder.getTarget(), parameter.getParameterType(), parameter);
    }

    return attribute;
}

protected void bindRequestParameters(WebDataBinder binder, NativeWebRequest request) throws UnsupportedEncodingException {
    // 将key-value封装为map，传给bind方法进行参数值绑定
    Map<String, String> map = new HashMap<>();
    Map<String, String[]> params = request.getParameterMap();

    for (Map.Entry<String, String[]> entry : params.entrySet()) {
        String name = entry.getKey();
        // 执行urldecode
        String value = URLDecoder.decode(entry.getValue()[0], "UTF-8");
        map.put(name, value);
    }

    PropertyValues propertyValues = new MutablePropertyValues(map);

    // 将K-V绑定到binder.target属性上
    binder.bind(propertyValues);
}
```
#### 同时支持多个参数解析器生效
到目前为止，不论对于原始类型或者对象类型的参数，我们都可以自定义一个参数解析器了，但是还有一个很严重的问题存在——无法让自定义解析器和现有解析器同时生效。

举个例子，public String myController(@Valid @MyParam param, BindingResult result){}，这个方法在执行时是会报错的。他会提示类似如下报错：

An Errors/BindingResult argument is expected to be declared immediately after the model attribute, the @RequestBody or the @RequestPart arguments

是SpringMVC不支持同时使用两个解析器吗？public String myController(@Valid @ModelAttribute param, BindingResult result){}，也是两个内置解析器，没有任何问题。

再去看ModelAttributeMethodProcessor的实现，原来是对@Valid做了兼容处理。

因此， **如果需要多个解析器同时生效需要在一个解析器中对其他解析器做兼容。**

这里仅以对@Valid进行兼容处理为例，在解析对象类型的解析器实现中进行修改
```java
@Override
public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer,
                              NativeWebRequest webRequest, WebDataBinderFactory binderFactory) throws Exception {

    String name = parameter.getParameterName();

    // 查找是否已有名为name的参数值的映射，如果没有则创建一个
    Object attribute = mavContainer.containsAttribute(name)
        ? mavContainer.getModel().get(name)
        : this.createAttribute(name, parameter, binderFactory, webRequest);

    if (binderFactory != null) {
        WebDataBinder binder = binderFactory.createBinder(webRequest, attribute, name);

        if (binder.getTarget() != null) {
            // 进行参数绑定，此方法实现不再赘述，可到上节查看
            this.bindRequestParameters(binder, webRequest);

// -----------------------------------对@Valid做兼容----------------------------------------------------

            // 如果使用了validation校验, 则进行相应校验
            if (parameter.hasParameterAnnotation(Valid.class)) {
                // 如果有校验报错，会将结果放在binder.bindingResult属性中
                binder.validate();
            }

            // 如果参数中不包含BindingResult参数，直接抛出异常
            if (binder.getBindingResult().hasErrors() && this.isBindExceptionRequired(binder, parameter)) {
                throw new BindException(binder.getBindingResult());
            }
        }

        // 关键,使Controller中接下来的BindingResult参数可以接收异常
        Map bindingResultModel = binder.getBindingResult().getModel();
        mavContainer.removeAttributes(bindingResultModel);
        mavContainer.addAllAttributes(bindingResultModel);

// -----------------------------------对@Valid做兼容----------------------------------------------------

        // 将参数转到预期类型，第一个参数为解析后的值，第二个参数为绑定Controller参数的类型，第三个参数为绑定的Controller参数
        attribute = binder.convertIfNecessary(binder.getTarget(), parameter.getParameterType(), parameter);
    }

    return attribute;
}

/**
 * 检查参数中是否包含BindingResult参数
 */
protected boolean isBindExceptionRequired(WebDataBinder binder, MethodParameter methodParam) {
    int i = methodParam.getParameterIndex();
    Class[] paramTypes = methodParam.getMethod().getParameterTypes();
    boolean hasBindingResult = paramTypes.length > i + 1 && Errors.class.isAssignableFrom(paramTypes[i + 1]);
    return !hasBindingResult;
}
```
OK，到这里，我们自定义的解析器已经可以算是一个完善的参数解析器了，如果有对其他解析器做兼容的需要，只要参照此类方法稍作修改即可。
