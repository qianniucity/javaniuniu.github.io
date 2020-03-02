---
title: WebMvcConfigurer讲解
permalink: /SpringBoot/WebMvcConfigurer
tags: SpringBoot 拦截器
sidebar:
  nav: docs-en-Spring
---
##### 一句话简介     
WebMvcConfigurer配置类其实是Spring内部的一种配置方式，采用JavaBean的形式来代替传统的xml配置文件形式进行针对框架个性化定制，可以自定义一些Handler，Interceptor，ViewResolver，MessageConverter。基于java-based方式的spring mvc配置，需要创建一个配置类并实现WebMvcConfigurer 接口

##### 主要讲解
通过ViewController将一个请求转到一个页面     
通过ResourceHandlers实现静态资源的地址映射     
通过MessageConverter实现将@ResponseBody实体转Fastjson字符串返回，可以返回实体进行重写     
通过addCorsMappings实现ajax跨域请求     
通过addInterceptors添加拦截器      

SpringBoot2.0（官方推荐）
```java
@Configuration    
public class WebMvcConfg implements WebMvcConfigurer {
}
```

SpringBoot2.0以前版本

```java
@Configuration    
public class WebMvcConfig extends WebMvcConfigurerAdapter {
｝
```
##### 配置ResourceHandlers      
此方法用来专门注册一个`Handler`，来处理静态资源的，例如：图片，js，css等。举例：
```java
 @Override
 public void addResourceHandlers(ResourceHandlerRegistry registry) {
     //可以通过http://127.0.0.1:8080/web/home.html访问resources/web/home.html页面
     registry.addResourceHandler("/web/**").addResourceLocations("classpath:/web/");
 }
```
当你请求http://127.0.0.1:8080/web/home.html时，会把resources/web/home.html返回。注意：这里的静态资源是放置在WEB-INF目录下的

##### 配置ViewController    
此方法可以很方便的实现一个请求到视图的映射，而无需书写`controller`，例如：
```java
@Override
public void addViewControllers(ViewControllerRegistry registry){
	registry.addViewController("/login").setViewName("web/login.html");
}
```
|这是访问http://127.0.0.1:8080/login时，会直接返回login.html页面。

##### 配置MessageConverter      
这个配置一般针对于`Api`接口服务程序，配置在请求返回时内容采用什么转换器进行转换，我们最常用到的就是`fastJson`的转换，配置如下所示
```java
    /**
     * 消息内容转换配置
     * 配置fastJson返回json转换
     * @param converters
     */
    @Override
    public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
        //创建fastJson消息转换器
        FastJsonHttpMessageConverter fastConverter = new FastJsonHttpMessageConverter(){
            protected void writeInternal(Object obj, HttpOutputMessage outputMessage){
                try {
                    if(obj instanceof PreUser){
                        Map<String,Object> map = new HashMap<>();
                        map.put("preUser",obj);
                        map.put("result","success");
                        super.writeInternal( map, outputMessage);
                    }else{
                        super.writeInternal( obj, outputMessage);
                    }
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        };
      //  FastJsonHttpMessageConverter fastConverter = new FastJsonHttpMessageConverter();
        List<MediaType> supportedMediaTypes = new ArrayList<>();
        supportedMediaTypes.add(MediaType.APPLICATION_JSON);
        supportedMediaTypes.add(MediaType.APPLICATION_JSON_UTF8);
        fastConverter.setSupportedMediaTypes(supportedMediaTypes);

        //创建配置类
        FastJsonConfig fastJsonConfig = new FastJsonConfig();
        fastJsonConfig.setCharset(Charset.forName("UTF-8"));
        fastJsonConfig.setDateFormat("YYYY-MM-dd");

        //修改配置返回内容的过滤
        fastJsonConfig.setSerializerFeatures(
                SerializerFeature.DisableCircularReferenceDetect,
                SerializerFeature.WriteMapNullValue,
                SerializerFeature.WriteNullStringAsEmpty,
                SerializerFeature.PrettyFormat
        );
        fastConverter.setFastJsonConfig(fastJsonConfig);
        //将fastjson添加到视图消息转换器列表内
        converters.add(fastConverter);
    }
```
```
FastJson SerializerFeatures
WriteNullListAsEmpty ：List字段如果为null,输出为[],而非null    
WriteNullStringAsEmpty ： 字符类型字段如果为null,输出为"",而非null   
DisableCircularReferenceDetect ：消除对同一对象循环引用的问题，默认为false（如果不配置有可能会进入死循环）   
WriteNullBooleanAsFalse：Boolean字段如果为null,输出为false,而非null    
WriteMapNullValue：是否输出值为null的字段,默认为false。   
WriteNullNumberAsZero: 数值字段如果为null，则输出为0    
```
```
重写writeInternal方法，可以重新构造返回对象，达到统一的返回值   
setDateFormat(“YYYY-MM-dd”);设置日期类型的返回格式       
```

httpmessageconvert在自动配置jackson，默认使用用jackson 。所以如果返回类型为application/json的数据使用jackson 。所以去除jackson的依赖。
```xml
       <dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-web</artifactId>
			<exclusions>
				<exclusion>
					<artifactId>jackson-databind</artifactId>
					<groupId>com.fasterxml.jackson.core</groupId>
				</exclusion>
			</exclusions>
		</dependency>
```

不去依赖的写法
```java
    @Configuration
    @ConditionalOnClass({FastJsonHttpMessageConverter.class}) //1
    @ConditionalOnProperty(//2
            name = {"spring.http.converters.preferred-json-mapper"},
            havingValue = "fastjson",
            matchIfMissing = true
    )
    protected static class FastJson2HttpMessageConverterConfiguration {
        protected FastJson2HttpMessageConverterConfiguration() {
        }
        @Bean
        @ConditionalOnMissingBean({FastJsonHttpMessageConverter.class})//3
        public FastJsonHttpMessageConverter fastJsonHttpMessageConverter() {
            //创建fastJson消息转换器
            FastJsonHttpMessageConverter fastConverter = new FastJsonHttpMessageConverter(){
                protected void writeInternal(Object obj, HttpOutputMessage outputMessage){
                    try {
                        if(obj instanceof PreUser){
                            Map<String,Object> map = new HashMap<>();
                            map.put("result","success");
                            map.put("preUser",obj);
                            super.writeInternal( map, outputMessage);
                        }else{
                            super.writeInternal( obj, outputMessage);
                        }
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            };
            //  FastJsonHttpMessageConverter fastConverter = new FastJsonHttpMessageConverter();
            List<MediaType> supportedMediaTypes = new ArrayList<>();
            supportedMediaTypes.add(MediaType.APPLICATION_JSON);
            supportedMediaTypes.add(MediaType.APPLICATION_JSON_UTF8);
            fastConverter.setSupportedMediaTypes(supportedMediaTypes);

            //创建配置类
            FastJsonConfig fastJsonConfig = new FastJsonConfig();
            fastJsonConfig.setCharset(Charset.forName("UTF-8"));
            fastJsonConfig.setDateFormat("YYYY-MM-dd");

            //修改配置返回内容的过滤
            fastJsonConfig.setSerializerFeatures(
                    SerializerFeature.DisableCircularReferenceDetect,
                    SerializerFeature.WriteMapNullValue,
                    SerializerFeature.WriteNullStringAsEmpty,
                    SerializerFeature.PrettyFormat
            );
            fastConverter.setFastJsonConfig(fastJsonConfig);
            //将fastjson添加到视图消息转换器列表内
           // converters.add(fastConverter);
            return fastConverter;
        }
    }
```

application.yml添加配置
```xml
spring:
  http:
    converters:
      preferred-json-mapper: fastjson
```

以上代码判断返回类型PreUser的对象，进行重写。返回数据为
```FastJson
{
	"result":"success",
	"preUser":{
		"address":"广东广州天河",
		"age":29,
		"date":"2018-09-20",
		"desc":"tom is 29 years old",
		"hobby":[
			"打球",
			"写代码"
		],
		"name":"tom",
		"phone":""
	}
}
```

##### 配置CORS跨域

`Spring`既然为了集成了`CROS`，那就证明了一点，以后前后端分离是一个开发趋势
```java

   /**
     * 跨域CORS配置
     * @param registry
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        super.addCorsMappings(registry);
        registry.addMapping("/cors/**")
                .allowedHeaders("*")
                .allowedMethods("POST","GET")
                .allowedOrigins("*");
    }  
```

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8">
		<title></title>
		<script src="js/jquery.min.js"></script>
		<script>
            $.ajax({
                type:"GET",
                url: "http://localhost:8080/preUser",
                dataType:"json",
                success:function(data, status, xhr){
                    console.log(data);
                    console.log(xhr.getAllResponseHeaders());
                },
                error:function(jqXHR){
                    console.log("Error: "+jqXHR.status);
                }
            });
		</script>
	</head>
	<body>
		cores.html
	</body>
</html>
```

验证访问：http://127.0.0.1:8080/web/cors.html,没设置addCorsMappings()报跨域异常。

##### 配置拦截器   
在之前`Xml`配置形式天下的时候，我们都是在`spring-mvc.xml`配置文件内添加`<mvc:interceptor>`标签配置拦截器。
```java
    /**
     * 拦截器配置
     * @param registry
     */
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new CustomHandlerInterceptor()).addPathPatterns("/**");
    }
```

`InterceptorRegistry`内的`addInterceptor`需要一个实现`HandlerInterceptor`接口的拦截器实例，`addPathPatterns`方法用于设置拦截器的过滤路径规则·。`excludePathPatterns` 表示不拦截。
```java
@Slf4j
public class CustomHandlerInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request,
                             HttpServletResponse response, Object handler)
            throws Exception {
        log.info("preHandle:请求前调用");
        //返回 false 则请求中断
        return true;
    }

    @Override
    public void postHandle(HttpServletRequest request,
                           HttpServletResponse response, Object handler,
                           ModelAndView modelAndView) throws Exception {
        log.info("postHandle:请求后调用");
    }

    @Override
    public void afterCompletion(HttpServletRequest request,
                                HttpServletResponse response, Object handler, Exception ex)
            throws Exception {
        log.info("afterCompletion:请求调用完成后回调方法，即在视图渲染完成后回调");
    }
}
```

每次请求时打印
```
2018-12-24 22:21:34.434  INFO 2156 --- [io-8080-exec-10]  : preHandle:请求前调用
2018-12-24 22:21:34.436  INFO 2156 --- [io-8080-exec-10]  : postHandle:请求后调用
2018-12-24 22:21:34.436  INFO 2156 --- [io-8080-exec-10]  : afterCompletion:请求调用完成后回调方法，即在视图渲染完成后回调
```

参考代码
- [WebMvcConfigurer](https://github.com/javaniuniu/sc-whorl/blob/master/sc-whorl-web/src/main/java/sc/whorl/system/config/GlobalConfig.java)

参考链接
- [Springboot2(5)WebMvcConfigurer讲解](https://blog.csdn.net/cowbin2012/article/details/85194353)
- [SpringBoot---WebMvcConfigurer详解](https://blog.csdn.net/zhangpower1993/article/details/89016503)
