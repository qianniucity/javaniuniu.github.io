---
title: 详述 Spring MVC 框架中拦截器 Interceptor 的使用方法
permalink: /mianshi/spring/0706/01
tags: 面试题
key: mianshi-2020-07-06-01
---

#### 1 前言

网络上关于Interceptor的文章，但感觉内容都大同小异，而且知识点零零散散，不太方便阅读。

因此，整理一篇关于拦截器的文章，在此分享给大家，以供大家参考阅读。

#### 2 拦截器

##### 2.1 概念

Java 里的拦截器是动态拦截action调用的对象。它提供了一种机制可以使开发者可以定义在一个action执行的前后执行的代码，也可以在一个action执行前阻止其执行，同时也提供了一种可以提取action中可重用部分的方式。在 AOP（Aspect-Oriented Programming，面向切面编程）中拦截器用于在某个方法（包括构造器）或字段被访问之前进行拦截，然后在之前或之后加入某些操作。特别地，现阶段 Spring 自身仅支持基于方法的拦截操作！如果基于方法的拦截操作不能满足需求，可以使用 AspectJ 与 Spring 进行集成，以实现更细粒度或更多方面的拦截操作。

##### 2.2 原理

拦截器Interceptor的拦截功能是基于 Java 的动态代理来实现的，具体可以参考博文「用 Java 实现拦截器 Interceptor 的拦截功能 」，也可以通过阅读 Spring 源代码来了解更为权威的实现细节。

#### 3 实现方法

在 Spring 框架之中，我们要想实现拦截器的功能，主要通过两种途径，第一种是实现HandlerInterceptor接口，第二种是实现`WebRequestInterceptor`接口。接下来，我们分别详细的介绍两者的实现方法。

##### 3.1 HandlerInterceptor 接口

在`HandlerInterceptor`接口中，定义了 3 个方法，分别为`preHandle()`、`postHandle()`和`afterCompletion()`，我们就是通过复写这 3 个方法来对用户的请求进行拦截处理的。因此，我们可以通过直接实现HandlerInterceptor接口来实现拦截器的功能。不过在 Spring 框架之中，其还提供了另外一个接口和一个抽象类，实现了对HandlerInterceptor接口的功能扩展，分别为：`AsyncHandlerIntercepto`r和`HandlerInterceptorAdapter`.

对于`AsyncHandlerInterceptor`接口，其在继承HandlerInterceptor接口的同时，又声明了一个新的方法afterConcurrentHandlingStarted()；而HandlerInterceptorAdapter抽象类，则是更进一步，在其继承`AsyncHandlerInterceptor`接口的同时，又复写了preHandle方法。因此，AsyncHandlerInterceptor更像是一个过渡的接口。

在实际应用中，我们一般都是通过实现`HandlerInterceptor`接口或者继承`HandlerInterceptorAdapter`抽象类，复写preHandle()、postHandle()和afterCompletion()这 3 个方法来对用户的请求进行拦截处理的。下面，我们就详细介绍这个 3 个方法。

`preHandle(HttpServletRequest request, HttpServletResponse response, Object handle)` 方法，该方法在请求处理之前进行调用。Spring MVC 中的Interceptor是链式调用的，在一个应用中或者说是在一个请求中可以同时存在多个`Interceptor`。每个Interceptor的调用会依据它的声明顺序依次执行，而且最先执行的都是`Interceptor`中的preHandle方法，所以可以在这个方法中进行一些前置初始化操作或者是对当前请求做一个预处理，也可以在这个方法中进行一些判断来决定请求是否要继续进行下去。该方法的返回值是布尔（Boolean）类型的，当它返回为false时，表示请求结束，后续的`Interceptor`和控制器（Controller）都不会再执行；当返回值为true时，就会继续调用下一个Interceptor的preHandle方法，如果已经是最后一个`Interceptor`的时候，就会是调用当前请求的控制器中的方法。
`postHandle(HttpServletRequest request, HttpServletResponse response, Object handle, ModelAndView modelAndView)`方法，通过preHandle方法的解释，我们知道这个方法包括后面要说到的afterCompletion方法都只能在当前所属的`Interceptor`的preHandle方法的返回值为true的时候，才能被调用。postHandle方法在当前请求进行处理之后，也就是在控制器中的方法调用之后执行，但是它会在`DispatcherServlet`进行视图返回渲染之前被调用，所以我们可以在这个方法中对控制器处理之后的ModelAndView对象进行操作。postHandle方法被调用的方向跟`preHandle`是相反的，也就是说，先声明的Interceptor的postHandle方法反而会后执行。这和 Struts2 里面的Interceptor的执行过程有点类似，Struts2 里面的Interceptor的执行过程也是链式的，只是在 Struts2 里面需要手动调用ActionInvocation的invoke方法来触发对下一个`Interceptor`或者是action的调用，然后每一个Interceptor中在invoke方法调用之前的内容都是按照声明顺序执行的，而invoke方法之后的内容就是反向的。
`afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handle, Exception ex)`方法，也是需要当前对应的Interceptor的preHandle方法的返回值为true时才会执行。因此，该方法将在整个请求结束之后，也就是在`DispatcherServlet`渲染了对应的视图之后执行，这个方法的主要作用是用于进行资源清理的工作。
接下来，我们在看看以上接口和抽象类的具体代码：

HandlerInterceptor 接口：

```java
package org.springframework.web.servlet;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public interface HandlerInterceptor {

	boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
	    throws Exception;

	void postHandle(
			HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView)
			throws Exception;

	void afterCompletion(
			HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex)
			throws Exception;

}
```


AsyncHandlerInterceptor 接口：

```java
package org.springframework.web.servlet;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public interface AsyncHandlerInterceptor extends HandlerInterceptor {

	void afterConcurrentHandlingStarted(
			HttpServletRequest request, HttpServletResponse response, Object handler)
			throws Exception;

}
```


HandlerInterceptorAdapter 抽象类：

```java
package org.springframework.web.servlet.handler;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.AsyncHandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

/**

 * Abstract adapter class for the HandlerInterceptor interface,

 * for simplified implementation of pre-only/post-only interceptors.
   *

 * @author Juergen Hoeller

 * @since 05.12.2003
   */
   public abstract class HandlerInterceptorAdapter implements AsyncHandlerInterceptor {

   /**

    * This implementation always returns {@code true}.
      */
      public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
      throws Exception {
      return true;
      }

   /**

    * This implementation is empty.
      */
      public void postHandle(
      	HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView)
      	throws Exception {
      }

   /**

    * This implementation is empty.
      */
      public void afterCompletion(
      	HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex)
      	throws Exception {
      }

   /**

    * This implementation is empty.
      */
      public void afterConcurrentHandlingStarted(
      	HttpServletRequest request, HttpServletResponse response, Object handler)
      	throws Exception {
      }
      }
```


如上面的代码所示，其实在HandlerInterceptor和AsyncHandlerInterceptor中还有很多的代码注释，只是博主感觉太多了，就将其全部删除了。如果大家对这些注释感兴趣的话，可以自行查看源代码。下面，我们以继承HandlerInterceptorAdapter抽象类为例进行演示：

```java
package com.hit.interceptor;

import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**

 * @author 维C果糖

 * @create 2017-03-31
   */
   public class WrongCodeInterceptor extends HandlerInterceptorAdapter {

   @Override
   public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
           throws Exception {
       System.out.println("WrongCodeInterceptor, preHandle......");
       return true;
   }

   @Override
   public void postHandle(
           HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView)
           throws Exception {
       System.out.println("WrongCodeInterceptor, postHandle......");
   }

   @Override
   public void afterCompletion(
           HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex)
           throws Exception {
       System.out.println("WrongCodeInterceptor, afterCompletion......");
   }

   @Override
   public void afterConcurrentHandlingStarted(
           HttpServletRequest request, HttpServletResponse response, Object handler)
           throws Exception {
       System.out.println("WrongCodeInterceptor, afterConcurrentHandlingStarted......");
   }
}
```



##### 3.2 WebRequestInterceptor 接口

在`WebRequestInterceptor`接口中也定义了 3 个方法，同HandlerInterceptor接口完全相同，我们也是通过复写这 3 个方法来对用户的请求进行拦截处理的。而且这 3 个方法都传递了同一个参数WebRequest，那么这个WebRequest到底是什么呢？其实这个WebRequest是 Spring 中定义的一个接口，它里面的方法定义跟HttpServletRequest类似，在`WebRequestInterceptor`中对WebRequest进行的所有操作都将同步到HttpServletRequest中，然后在当前请求中依次传递。

在 Spring 框架之中，还提供了一个和`WebRequestInterceptor`接口长的很像的抽象类，那就是：`WebRequestInterceptorAdapter`，其实现了`AsyncHandlerInterceptor`接口，并在内部调用了WebRequestInterceptor接口。

接下来，我们主要讲一下`WebRequestInterceptor`接口的 3 个函数：

`preHandle(WebRequest request)`方法，该方法在请求处理之前进行调用，也就是说，其会在控制器中的方法调用之前被调用。这个方法跟`HandlerInterceptor`中的preHandle不同，主要区别在于该方法的返回值是void类型的，也就是没有返回值，因此我们主要用它来进行资源的准备工作，比如我们在使用 Hibernate 的时候，可以在这个方法中准备一个 Hibernate 的Session对象，然后利用WebRequest的`setAttribute(name, value, scope)`把它放到WebRequest的属性中。在这里，进一步说说setAttribute方法的第三个参数scope，该参数是一个Integer类型的。在WebRequest的父层接口RequestAttributes中对它定义了三个常量，分别为：
SCOPE_REQUEST，它的值是0，表示只有在request中可以访问。
SCOPE_SESSION，它的值是1，如果环境允许的话，它表示的是一个局部的隔离的session，否则就代表普通的session，并且在该session范围内可以访问。
SCOPE_GLOBAL_SESSION，它的值是2，如果环境允许的话，它表示的是一个全局共享的session，否则就代表普通的session，并且在该session范围内可以访问。
`postHandle(WebRequest request, ModelMap model)`方法，该方法在请求处理之后，也就是在控制器中的方法调用之后被调用，但是会在视图返回被渲染之前被调用，所以可以在这个方法里面通过改变数据模型ModelMap来改变数据的展示。该方法有两个参数，WebRequest对象是用于传递整个请求数据的，比如在preHandle中准备的数据都可以通过WebRequest来传递和访问；ModelMap就是控制器处理之后返回的Model对象，我们可以通过改变它的属性来改变返回的Model模型。
`afterCompletion(WebRequest request, Exception ex)`方法，该方法会在整个请求处理完成，也就是在视图返回并被渲染之后执行。因此可以在该方法中进行资源的释放操作。而WebRequest参数就可以把我们在preHandle中准备的资源传递到这里进行释放。Exception参数表示的是当前请求的异常对象，如果在控制器中抛出的异常已经被 Spring 的异常处理器给处理了的话，那么这个异常对象就是是null。
接下来，我们在看看以上接口和抽象类的具体代码：

WebRequestInterceptor 接口：

```java
package org.springframework.web.context.request;

import org.springframework.ui.ModelMap;

public interface WebRequestInterceptor {

	void preHandle(WebRequest request) throws Exception;

	void postHandle(WebRequest request, ModelMap model) throws Exception;

	void afterCompletion(WebRequest request, Exception ex) throws Exception;

}
```


WebRequestInterceptorAdapter 抽象类：

```java
package org.springframework.web.servlet.handler;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.util.Assert;
import org.springframework.web.context.request.AsyncWebRequestInterceptor;
import org.springframework.web.context.request.WebRequestInterceptor;
import org.springframework.web.servlet.AsyncHandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

/**

 * Adapter that implements the Servlet HandlerInterceptor interface

 * and wraps an underlying WebRequestInterceptor.
   *

 * @author Juergen Hoeller

 * @since 2.0

 * @see org.springframework.web.context.request.WebRequestInterceptor

 * @see org.springframework.web.servlet.HandlerInterceptor
   */
   public class WebRequestHandlerInterceptorAdapter implements AsyncHandlerInterceptor {

   private final WebRequestInterceptor requestInterceptor;

   /**

    * Create a new WebRequestHandlerInterceptorAdapter for the given WebRequestInterceptor.
    * @param requestInterceptor the WebRequestInterceptor to wrap
      */
      public WebRequestHandlerInterceptorAdapter(WebRequestInterceptor requestInterceptor) {
      Assert.notNull(requestInterceptor, "WebRequestInterceptor must not be null");
      this.requestInterceptor = requestInterceptor;
      }


	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
			throws Exception {

		this.requestInterceptor.preHandle(new DispatcherServletWebRequest(request, response));
		return true;
	}

	public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView)
			throws Exception {

		this.requestInterceptor.postHandle(new DispatcherServletWebRequest(request, response),
				(modelAndView != null && !modelAndView.wasCleared() ? modelAndView.getModelMap() : null));
	}

	public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex)
			throws Exception {

		this.requestInterceptor.afterCompletion(new DispatcherServletWebRequest(request, response), ex);
	}

	public void afterConcurrentHandlingStarted(HttpServletRequest request, HttpServletResponse response, Object handler) {
		if (this.requestInterceptor instanceof AsyncWebRequestInterceptor) {
			AsyncWebRequestInterceptor asyncInterceptor = (AsyncWebRequestInterceptor) this.requestInterceptor;
			DispatcherServletWebRequest webRequest = new DispatcherServletWebRequest(request, response);
			asyncInterceptor.afterConcurrentHandlingStarted(webRequest);
		}
	}

}
```


如上面的代码所示，展示了WebRequestInterceptor接口和WebRequestInterceptorAdapter抽象类的源码。下面，我们以实现WebRequestInterceptor接口为例进行演示：

```java
package com.hit.interceptor;

import org.springframework.ui.ModelMap;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.context.request.WebRequestInterceptor;

/**

 * @author 维C果糖

 * @create 2017-03-31
   */
   public class WrongCodeInterceptor implements WebRequestInterceptor {

   @Override
   public void preHandle(WebRequest request) throws Exception {
       System.out.println("WrongCodeInterceptor, preHandle......");
   }

   @Override
   public void postHandle(WebRequest request, ModelMap model) throws Exception {
       System.out.println("WrongCodeInterceptor, postHandle......");
   }

   @Override
   public void afterCompletion(WebRequest request, Exception ex) throws Exception {
       System.out.println("WrongCodeInterceptor, afterCompletion......");
   }
}
```



##### 3.3 AbstractInterceptor 抽象类

除了上面3.2 和3.3所讲的内容，我们还可以通过继承 Struts2 框架提供的`AbstractInterceptor`抽象类来实现拦截的功能。如果我们在深入一点研究，会发现AbstractInterceptor实现了Interceptor接口，而Interceptor接口又继承了Serializable接口。

在Interceptor接口中，提供了 3 个方法供我们使用，分别为`init()、destroy()和intercept()`，由于AbstractInterceptor实现了Interceptor接口，因此我们就可以直接继承AbstractInterceptor，然后复写方法就可以啦！至于为什么继承AbstractInterceptor而不是直接实现Interceptor接口，是因为AbstractInterceptor已经帮我们实现了空的init()和destroy()方法，不需要我们自己去复写了，我们直接复写intercept()方法就可以了。现在，我们大致了解一下这 3 个方法的作用：

init()方法，一般用来进行初始化操作；
destroy()方法，一般用来进行释放资源的操作；
intercept()方法，该方法是实现拦截功能的主要方法，我们就在该方法中编写拦截的逻辑。
接下来，我们再看看以上接口和抽象类的具体代码：

Interceptor 接口：

```java


package com.opensymphony.xwork2.interceptor;

import com.opensymphony.xwork2.ActionInvocation;

import java.io.Serializable;

public interface Interceptor extends Serializable {

    /**
     * Called to let an interceptor clean up any resources it has allocated.
     */
    void destroy();

    /**
     * Called after an interceptor is created, but before any requests are processed using
     * {@link #intercept(com.opensymphony.xwork2.ActionInvocation) intercept} , giving
     * the Interceptor a chance to initialize any needed resources.
     */
    void init();

    /**
     * Allows the Interceptor to do some processing on the request before and/or after the rest of the processing of the
     * request by the {@link ActionInvocation} or to short-circuit the processing and just return a String return code.
     *
     * @param invocation the action invocation
     * @return the return code, either returned from {@link ActionInvocation#invoke()}, or from the interceptor itself.
     * @throws Exception any system-level error, as defined in {@link com.opensymphony.xwork2.Action#execute()}.
     */
    String intercept(ActionInvocation invocation) throws Exception;

}
```


AbstractInterceptor 接口：

```java


package com.opensymphony.xwork2.interceptor;

import com.opensymphony.xwork2.ActionInvocation;

/**

 * Provides default implementations of optional lifecycle methods
   */
   public abstract class AbstractInterceptor implements Interceptor {

   /**

    * Does nothing
      */
      public void init() {
      }

   /**

    * Does nothing
      */
      public void destroy() {
      }

   /**

    * Override to handle interception
      */
      public abstract String intercept(ActionInvocation invocation) throws Exception;
}
```


如上面的代码所示，展示了Interceptor接口和AbstractInterceptor抽象类的源码。下面，我们以继承AbstractInterceptor抽象类为例进行演示：

```java
package com.hit.interceptor;

import com.opensymphony.xwork2.ActionInvocation;
import com.opensymphony.xwork2.interceptor.AbstractInterceptor;
import org.apache.struts2.ServletActionContext;


/**

 * @author 维C果糖

 * @create 2017-03-31
   */
   public class WrongCodeInterceptor  extends AbstractInterceptor {

   /**

    * 通过拦截功能，验证用户是否登录
      */
      public String intercept(ActionInvocation invocation) throws Exception {

      UserInfo info = (UserInfo) ServletActionContext.getRequest().getSession().getAttribute("user");

      if(info != null && !info.getName().equals("") && !info.getPwd().equals("")) {
          return invocation.invoke();
      }
      return "login";
      }
}
```


UserInfo 类文件：

```java
/**

 * @author 维C果糖

 * @create 2017-03-31
   */
   public class UserInfo {
   String name;
   String pwd;

   public String getName() {
       return name;
   }

   public void setName(String name) {
       this.name = name;
   }

   public String getPwd() {
       return pwd;
   }

   public void setPwd(String pwd) {
       this.pwd = pwd;
   }
}
```



#### 4 配置拦截器

在前面，我们用了很大篇幅的内容讲述了拦截器如何实现，因此，我相信大家对于如何实现拦截器已经没有问题啦！接下来，我们在看看，如何在 XML 文件中配置拦截器，以使我们的拦截器生效。

在配置拦截器之前，有 4 个名称的概念需要大家先了解一下，分别为：Join Point、Pointcut、Advice和Advisor：

Join Point，表示“连接点”，它是程序运行中的某个阶段点，比如方法的调用、异常的抛出等；
Advice，表示“通知”，它是某个连接点所采用的处理逻辑，也就是向连接点注入的代码；
Pointcut，表示“切入点”，它是“连接点”的集合，是程序中需要注入Advice的位置的集合，指明Advice要在什么样的条件下才能被触发；
Advisor，它是Pointcut和Advice的配置器，包括Pointcut和Advice，是将Advice注入程序中Pointcut位置的代码。
接下来，给出 XML 配置文件的声明：

```xml
<beans xmlns="http://www.springframework.org/schema/beans"  
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:context="http://www.springframework.org/schema/context"  
    xmlns:mvc="http://www.springframework.org/schema/mvc"  
    xsi:schemaLocation="http://www.springframework.org/schema/beans  
     http://www.springframework.org/schema/beans/spring-beans-3.0.xsd  
     http://www.springframework.org/schema/context  
     http://www.springframework.org/schema/context/spring-context-3.0.xsd  
     http://www.springframework.org/schema/mvc  
     http://www.springframework.org/schema/mvc/spring-mvc-3.0.xsd">  

```


在 XML 文件的头部声明完成之后，我们就可以在 Spring 的配置文件中使用mvc标签啦！而在mvc标签中有一个名为mvc:interceptors的标签，该标签就是用于声明 Spring 拦截器的。下面，给出一个配置示例：

```xml
<mvc:interceptors>  
    <!-- 使用 bean 定义一个 Interceptor，直接定义在 mvc:interceptors 下面的 Interceptor 将拦截所有的请求 -->  
    <bean class="com.hit.interceptor.WrongCodeInterceptor"/>  
    <mvc:interceptor>  
        <mvc:mapping path="/demo/hello.do"/>  
        <!-- 定义在 mvc:interceptor 下面的 Interceptor，表示对特定的请求进行拦截 -->  
        <bean class="com.hit.interceptor.LoginInterceptor"/>  
    </mvc:interceptor>  
</mvc:interceptors>  

```


在 Spring 的XML 配置文件中，我们可以通过mvc:interceptors标签声明一系列的拦截器，例如：

```xml
<mvc:interceptors>
    <bean class="com.hit.interceptor.ContextInterceptor"/>
    <bean class="com.hit.interceptor.LoginInterceptor"/>
    <bean class="com.hit.interceptor.WrongCodeInterceptor"/>
</mvc:interceptors>
```


如上所示，这些拦截器就构成了一个拦截器链，或者称之为拦截器栈。这些拦截器的执行顺序是按声明的先后顺序执行的，即：先声明的拦截器先执行，后声明的拦截器后执行。在mvc:interceptors标签下声明interceptor标签主要有两种方式：

直接定义一个Interceptor实现类的bean对象，使用这种方式声明的Interceptor拦截器将会对所有的请求进行拦截；
使用mvc:interceptor标签进行声明，使用这种方式进行声明的Interceptor可以通过mvc:mapping子标签来定义需要进行拦截的请求路径。
此外，由于拦截器是 AOP 编程思想的典型应用，也就意味着我们可以“切”到具体的“面”进行某些操作。例如，

```xml
<bean id="WrongCodeInterceptor" class="com.hit.interceptor.WrongCodeInterceptor">
		<property name="userName" value="user-module"></property>
</bean>

<bean id="loginInterceptor" class="com.hit.interceptor.LoginInterceptor">
	<property name="excludePackages">
	   <list>
		  <value>com.hit.user.exception</value>
		  <value>com.hit.order.exception</value>
	   </list>
	</property>
</bean>

<aop:config>
	<aop:advisor advice-ref="WrongCodeInterceptor" pointcut="execution(* com.hit.*.demo..*.*(..)) " />
	<aop:advisor advice-ref="loginInterceptor" pointcut="execution(* com.hit.*.demo..*.*(..))" />
</aop:config>
```


如上所示，我们实现了切入到“面”进行特定的拦截功能，其中pointcut表示“切入点”，advisor表示要注入到pointcut的代码。实际上，如果在多个拦截器配置中，pointcut表达式都相同，我们可以将其抽取出来，单独声明，然后通过pointcut-ref标签进行引用，这样可以稍微简化一些配置！

除此之外，大家可能会对pointcut中的*符号有所疑惑，它是“通配符”，表示可以匹配该位置上的任何名称。当然，如果我们要想使用aop标签，就得先在配置文件中进行声明啦！最后，如果大家想进一步了解切入点pointcut表达式的话，可以参考博文「Spring 框架中切入点 pointcut 表达式的常用写法 」。
