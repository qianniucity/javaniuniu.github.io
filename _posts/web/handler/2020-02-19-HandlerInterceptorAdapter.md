---
title: HandlerInterceptorAdapter解析器说明
permalink: /Handler/HandlerInterceptorAdapter/explanation
tags: Handler解析器
pageview: true
show_date: true
sidebar:
  nav: docs-en-web
---
#### 简介

ThreadLocal是用来处理多线程并发问题的一种解决方案。ThreadLocal是的作用是提供线程的局部变量，在多线程并发环境下，提供了与其他线程隔离的局部变量。通常这样的设计的情况是因为这个局部变量是不适合放在全局变量进行同步处理的。
#### 应用场景

在Service中，怎么获取当前登录用户信息？
最简单的将用户信息存到session中，controller层将session中存的用户信息取出，再作为方法参数传到service层。但是这样做的话，太low了。
#### 分析

ThreadLocal类，它是在当前线程（Thread.currentThread()）的ThreadLocalMap对象中添加值，key为ThreadLocal对象，也就是说ThreadLocal类用来提供线程内部的局部变量。我们都知道Http请求就是一个线程，只要我们在这个线程中，添加了我们想要的request、session对象，那么响应服务器请求的Controller、Service、Dao等这些层面的代码不就都可以通过当前线程（Thread.currentThread()）取出request、session对象了！但是我们怎么在请求到Controller等Control控制器之前，添加这些信息呢？很容易我们想到了Filter过滤器或者Interceptor拦截器，因为Http请求会调用Filter的doFilter或者Interceptor的preHandle进行处理，是在同一个线程中，可以在Filter或者Interceptor中用ThreadLocal来实现！
ThreadLocal的核心get方法：
```java
    public T get() {
        Thread t = Thread.currentThread();
        ThreadLocalMap map = getMap(t);
        if (map != null) {
            ThreadLocalMap.Entry e = map.getEntry(this);
            if (e != null) {
                @SuppressWarnings("unchecked")
                T result = (T)e.value;
                return result;
            }
        }
        return setInitialValue();
    }
```
#### 实战（Interceptor实现方案）

##### 1.自定义BaseContextHandler类：

```java
package io.fredia.femicro.common.context;

import static org.junit.Assert.assertEquals;

import java.util.HashMap;
import java.util.Map;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.runners.MockitoJUnitRunner;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.fredia.femicro.common.constant.CommonConstants;
import io.fredia.femicro.common.util.StringHelper;

/**
 * 上下文处理基类
 *
 * @author : Fredia
 * @since : 2018年6月1日
 * @version : v1.0.0
 */
public class BaseContextHandler {
    public static ThreadLocal<Map<String, Object>> threadLocal = new ThreadLocal<Map<String, Object>>();

    public static void set(String key, Object value) {
        Map<String, Object> map = threadLocal.get();
        if (map == null) {
            map = new HashMap<String, Object>();
            threadLocal.set(map);
        }
        map.put(key, value);
    }

    public static Object get(String key){
        Map<String, Object> map = threadLocal.get();
        if (map == null) {
            map = new HashMap<String, Object>();
            threadLocal.set(map);
        }
        return map.get(key);
    }

    public static String getUserID(){
        Object value = get(CommonConstants.CONTEXT_KEY_USER_ID);
        return returnObjectValue(value);
    }

    public static String getUsername(){
        Object value = get(CommonConstants.CONTEXT_KEY_USERNAME);
        return returnObjectValue(value);
    }


    public static String getName(){
        Object value = get(CommonConstants.CONTEXT_KEY_USER_NAME);
        return StringHelper.getObjectValue(value);
    }

    public static String getToken(){
        Object value = get(CommonConstants.CONTEXT_KEY_USER_TOKEN);
        return StringHelper.getObjectValue(value);
    }
    public static void setToken(String token){set(CommonConstants.CONTEXT_KEY_USER_TOKEN,token);}

    public static void setName(String name){set(CommonConstants.CONTEXT_KEY_USER_NAME,name);}

    public static void setUserID(String userID){
        set(CommonConstants.CONTEXT_KEY_USER_ID,userID);
    }

    public static void setUsername(String username){
        set(CommonConstants.CONTEXT_KEY_USERNAME,username);
    }

    private static String returnObjectValue(Object value) {
        return value==null?null:value.toString();
    }

    public static void remove(){
        threadLocal.remove();
    }

}
```

##### 2.自定义UserAuthRestInterceptor拦截器

```java
package io.fredia.femicro.auth.client.interceptor;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import io.fredia.femicro.auth.client.annotation.IgnoreUserToken;
import io.fredia.femicro.auth.client.config.UserAuthConfig;
import io.fredia.femicro.auth.client.jwt.UserAuthUtil;
import io.fredia.femicro.auth.common.util.jwt.IJWTInfo;
import io.fredia.femicro.common.context.BaseContextHandler;

/**
 * 用户授权拦截器
 *
 * @author : Fredia
 * @since : 2018年3月16日
 * @version : v1.0.0
 */
public class UserAuthRestInterceptor extends HandlerInterceptorAdapter {
    private Logger logger = LoggerFactory.getLogger(UserAuthRestInterceptor.class);

    @Autowired
    private UserAuthUtil userAuthUtil;

    @Autowired
    private UserAuthConfig userAuthConfig;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        HandlerMethod handlerMethod = (HandlerMethod) handler;
        //此处为业务代码，可以忽略
        String token = request.getHeader(userAuthConfig.getTokenHeader());
        if (StringUtils.isEmpty(token)) {
            if (request.getCookies() != null) {
                for (Cookie cookie : request.getCookies()) {
                    if (cookie.getName().equals(userAuthConfig.getTokenHeader())) {
                        token = cookie.getValue();
                    }
                }
            }
        }
        IJWTInfo infoFromToken = userAuthUtil.getInfoFromToken(token);
        //上下文属性保存
        BaseContextHandler.setUsername(infoFromToken.getUniqueName());
        BaseContextHandler.setName(infoFromToken.getName());
        BaseContextHandler.setUserID(infoFromToken.getId());
        return super.preHandle(request, response, handler);
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        //上下文属性值清除，防止内存泄漏
        BaseContextHandler.remove();
        super.afterCompletion(request, response, handler, ex);
    }
}
```
回顾一下基础知识：

**preHandle**：预处理回调方法，实现处理器的预处理（如登录检查），第三个参数为响应的处理器；    
  - 返回值：    
  true表示继续流程（如调用下一个拦截器或处理器）；    
  false表示流程中断（如登录检查失败），不会继续调用其他的拦截器或处理器，此时我们需要通过response来产生响应；    

**postHandle**：后处理回调方法，实现处理器的后处理（但在渲染视图之前），此时我们可以通过`modelAndView`（模型和视图对象）对模型数据进行处理或对视图进行处理，`modelAndView`也可能为null。   
**afterCompletion**：整个请求处理完毕回调方法，即在视图渲染完毕时回调，如性能监控中我们可以在此记录结束时间并输出消耗时间，还可以进行一些资源清理，类似于`try-catch-finally`中的`finally`，但仅调用处理器执行链中preHandle返回true的拦截器的afterCompletion。

##### 3.Controller使用ThreadLocal工具

```java
package io.fredia.femicro.common.rest;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import io.fredia.femicro.common.biz.BaseBiz;
import io.fredia.femicro.common.context.BaseContextHandler;
import io.fredia.femicro.common.msg.ObjectRestResponse;
import io.fredia.femicro.common.msg.TableResultResponse;
import io.fredia.femicro.common.util.Query;
import lombok.extern.slf4j.Slf4j;

/**
 * controller基类
 *
 * @author : Fredia
 * @since : 2018年6月1日
 * @version : v1.0.0
 */
@Slf4j
public class BaseController<Biz extends BaseBiz,Entity> {

    public String getCurrentUserName(){
        return BaseContextHandler.getUsername();
    }
}
```
##### 4.总结

实现一个功能有N种方案，我们可以选择低耦合的方法去实现，在保证效率的情况下，也要考虑性能问题。threadlocal实现简单，但是它和io很像，如果数据量大，它所占用的内存空间无法释放会导致内存泄漏，毕竟不自带内存生命周期管理的一切都要慎重使用。
