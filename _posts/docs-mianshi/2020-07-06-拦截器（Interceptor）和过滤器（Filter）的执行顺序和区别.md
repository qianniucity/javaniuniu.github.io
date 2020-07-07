---
title: 拦截器（Interceptor）和过滤器（Filter）的执行顺序和区别
permalink: /mianshi/spring/0706/02
tags: 面试题
key: mianshi-2020-07-06-02
---

#### 一、引言

本来想记录一下关于用户登陆和登陆之后的权限管理、菜单管理的问题，想到解决这个问题用到Interceptor，但想到了Interceptor，就想到了Filter，于是就想说一下它们的执行顺序和区别。关于Interceptor解决权限和菜单管理的问题，在放在下一篇写吧，就酱紫。

#### 二、区别

##### 1、过滤器（Filter）

首先说一下Filter的使用地方，我们在配置web.xml时，总会配置下面一段设置字符编码，不然会导致乱码问题：

```xml
<filter>
    <filter-name>encoding</filter-name>
    <filter-class>org.springframework.web.filter.CharacterEncodingFilter</filter-class>
    <init-param>
        <param-name>encoding</param-name>
        <param-value>UTF-8</param-value>
    </init-param>
    <init-param>
        <param-name>forceEncoding</param-name>
        <param-value>true</param-value>
    </init-param>
</filter>

<filter-mapping>
    <filter-name>encoding</filter-name>
    <servlet-name>/*</servlet-name>
</filter-mapping>
```


配置这个地方的目的，是让所有的请求都需要进行字符编码的设置，下面来介绍一下Filter。

__（1）过滤器(Filter)：__ 它依赖于servlet容器。在实现上，基于函数回调，它可以对几乎所有请求进行过滤，但是缺点是一个过滤器实例只能在容器初始化时调用一次。使用过滤器的目的，是用来做一些过滤操作，获取我们想要获取的数据，比如：在Javaweb中，对传入的request、response提前过滤掉一些信息，或者提前设置一些参数，然后再传入servlet或者Controller进行业务逻辑操作。通常用的场景是：在过滤器中修改字符编码（CharacterEncodingFilter）、在过滤器中修改HttpServletRequest的一些参数（XSSFilter(自定义过滤器)），如：过滤低俗文字、危险字符等。

##### 2、拦截器（Interceptor）

拦截器的配置一般在SpringMVC的配置文件中，使用Interceptors标签，具体配置如下：

```xml
<mvc:interceptors>
    <mvc:interceptor>
        <mvc:mapping path="/**" />
        <bean class="com.scorpios.atcrowdfunding.web.LoginInterceptor"></bean>
    </mvc:interceptor>
    <mvc:interceptor>
        <mvc:mapping path="/**" />
        <bean class="com.scorpios.atcrowdfunding.web.AuthInterceptor"></bean>
    </mvc:interceptor>
</mvc:interceptors>
```


__（2）拦截器（Interceptor）：__ 它依赖于web框架，在SpringMVC中就是依赖于SpringMVC框架。在实现上,基于Java的反射机制，属于面向切面编程（AOP）的一种运用，就是在service或者一个方法前，调用一个方法，或者在方法后，调用一个方法，比如动态代理就是拦截器的简单实现，在调用方法前打印出字符串（或者做其它业务逻辑的操作），也可以在调用方法后打印出字符串，甚至在抛出异常的时候做业务逻辑的操作。由于拦截器是基于web框架的调用，因此可以使用Spring的依赖注入（DI）进行一些业务操作，同时一个拦截器实例在一个controller生命周期之内可以多次调用。但是缺点是只能对controller请求进行拦截，对其他的一些比如直接访问静态资源的请求则没办法进行拦截处理。

#### 三、代码

下面在一个项目中我们使用既有多个过滤器，又有多个拦截器，并观察它们的执行顺序：

##### （1）第一个过滤器：

```java
public class TestFilter1 implements Filter {  

		@Override

  	    protected void doFilter(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {  
        //在DispatcherServlet之前执行  
		System.out.println("############TestFilter1 doFilterInternal executed############");  
        filterChain.doFilter(request, response);  
        //在视图页面返回给客户端之前执行，但是执行顺序在Interceptor之后  
        System.out.println("############TestFilter1 doFilter after############");  
    }  
}  
```



##### （2）第二个过滤器：

```java
public class TestFilter2 implements Filter {  

	@Override
	protected void doFilter(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {  
	    //在DispatcherServlet之前执行  
	    System.out.println("############TestFilter2 doFilterInternal executed############");  
	    filterChain.doFilter(request, response);  
	    //在视图页面返回给客户端之前执行，但是执行顺序在Interceptor之后
	    System.out.println("############TestFilter2 doFilter after############");  
	}  

}
```



##### （3）在web.xml中注册这两个过滤器：

```xml
<!-- 自定义过滤器：testFilter1 -->   
   <filter>  
        <filter-name>testFilter1</filter-name>  
        <filter-class>com.scorpios.filter.TestFilter1</filter-class>  
    </filter>  
    <filter-mapping>  
        <filter-name>testFilter1</filter-name>  
        <url-pattern>/*</url-pattern>  
    </filter-mapping>  
    <!-- 自定义过滤器：testFilter2 -->   
   <filter>  
        <filter-name>testFilter2</filter-name>  
        <filter-class>com.scorpios.filter.TestFilter2</filter-class>  
    </filter>  
    <filter-mapping>  
        <filter-name>testFilter2</filter-name>  
        <url-pattern>/*</url-pattern>  
    </filter-mapping>  
```

再定义两个拦截器：

##### （4）第一个拦截器：

```java
public class BaseInterceptor implements HandlerInterceptor{  


    /**
     * 在DispatcherServlet之前执行
     * */  
    public boolean preHandle(HttpServletRequest arg0, HttpServletResponse arg1, Object arg2) throws Exception {  
        System.out.println("************BaseInterceptor preHandle executed**********");  
        return true;  
    }  

    /**
     * 在controller执行之后的DispatcherServlet之后执行
     * */  
    public void postHandle(HttpServletRequest arg0, HttpServletResponse arg1, Object arg2, ModelAndView arg3) throws Exception {  
        System.out.println("************BaseInterceptor postHandle executed**********");  
    }  

    /**
     * 在页面渲染完成返回给客户端之前执行
     * */  
    public void afterCompletion(HttpServletRequest arg0, HttpServletResponse arg1, Object arg2, Exception arg3)  
            throws Exception {  
        System.out.println("************BaseInterceptor afterCompletion executed**********");  
    }  

}  
```



##### （5）第二个拦截器：

```java
public class TestInterceptor implements HandlerInterceptor {  

    public boolean preHandle(HttpServletRequest arg0, HttpServletResponse arg1, Object arg2) throws Exception {  
        System.out.println("************TestInterceptor preHandle executed**********");  
        return true;  
    }  

    public void postHandle(HttpServletRequest arg0, HttpServletResponse arg1, Object arg2, ModelAndView arg3) throws Exception {  
        System.out.println("************TestInterceptor postHandle executed**********");  
    }  

    public void afterCompletion(HttpServletRequest arg0, HttpServletResponse arg1, Object arg2, Exception arg3) throws Exception {  
        System.out.println("************TestInterceptor afterCompletion executed**********");  
    }  

}  
```



##### （6）、在SpringMVC的配置文件中，加上拦截器的配置：

```xml
<!-- 拦截器 -->  
<mvc:interceptors>  
    <!-- 对所有请求都拦截，公共拦截器可以有多个 -->  
    <bean name="baseInterceptor" class="com.scorpios.interceptor.BaseInterceptor" />  

	<mvc:interceptor>
	    <!-- 对/test.html进行拦截 -->       
        <mvc:mapping path="/test.html"/>  
        <!-- 特定请求的拦截器只能有一个 -->  
        <bean class="com.scorpios.interceptor.TestInterceptor" />  
    </mvc:interceptor>  
</mvc:interceptors>  
```


##### （7）、定义一个Controller控制器：

```java
package com.scorpios.controller;  
import org.springframework.stereotype.Controller;  
import org.springframework.web.bind.annotation.RequestMapping;  
import org.springframework.web.servlet.ModelAndView;  

@Controller  
public class TestController {  
    @RequestMapping("/test")  
    public ModelAndView handleRequest(){  
        System.out.println("---------TestController executed--------");  
        return new ModelAndView("test");  
    }  
}
```





##### （8）、测试结果：

![1](/assets/images/mianshiti/0706/20180603132319702.png)

启动测试项目，地址如下：http://www.localhost:8080/demo，可以看到控制台中输出如下：

这就说明了过滤器的运行是依赖于servlet容器，跟springmvc等框架并没有关系。并且，多个过滤器的执行顺序跟xml文件中定义的先后关系有关。

接着清空控制台，并访问：http://www.localhost:8080/demo/test，再次看控制台的输出：

![2](/assets/images/mianshiti/0706/20180603132536413.png)

从这个控制台打印输出，就可以很清晰地看到有多个拦截器和过滤器存在时的整个执行顺序了。当然，对于多个拦截器它们之间的执行顺序跟在SpringMVC的配置文件中定义的先后顺序有关。

四、总结
对于上述过滤器和拦截器的测试，可以得到如下结论：
（1）、Filter需要在web.xml中配置，依赖于Servlet；
（2）、Interceptor需要在SpringMVC中配置，依赖于框架；
（3）、Filter的执行顺序在Interceptor之前，具体的流程见下图；

![3](/assets/images/mianshiti/0706/20180603133007923.png)

（4）、两者的本质区别：拦截器（Interceptor）是基于Java的反射机制，而过滤器（Filter）是基于函数回调。从灵活性上说拦截器功能更强大些，Filter能做的事情，都能做，而且可以在请求前，请求后执行，比较灵活。Filter主要是针对URL地址做一个编码的事情、过滤掉没用的参数、安全校验（比较泛的，比如登录不登录之类），太细的话，还是建议用interceptor。不过还是根据不同情况选择合适的。
