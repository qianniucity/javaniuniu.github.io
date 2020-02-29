---
title: FilterRegistrationBean示例
permalink: /Filter/FilterRegistrationBean/example
tags: Filter拦截器 示例
pageview: true
show_date: true
sidebar:
  nav: docs-en-web
---
#### 拦截器与过滤器的区别
过滤器可以简单理解为 **“取你所想取”**，忽视掉那些你不想要的东西；拦截器可以简单理解为 **“拒你所想拒”**，关心你想要拒绝掉哪些东西，比如一个BBS论坛上拦截掉敏感词汇。      
1.拦截器是基于java反射机制的，而过滤器是基于函数回调的。   
2.过滤器依赖于servlet容器，而拦截器不依赖于servlet容器。    
3.拦截器只对action起作用，而过滤器几乎可以对所有请求起作用。    
4.拦截器可以访问action上下文、值栈里的对象，而过滤器不能。   
5.在action的生命周期里，拦截器可以多起调用，而过滤器只能在容器初始化时调用一次。    

- addInitParameter 方法使示例1

```java
/**
 * 注册一个StatViewServlet
 * @return
 */
@Bean
public ServletRegistrationBean DruidStatViewServle() {
	// org.springframework.boot.context.embedded.ServletRegistrationBean提供类的进行注册.
	ServletRegistrationBean servletRegistrationBean = new ServletRegistrationBean(new StatViewServlet(),
			"/druid/*");
	// 添加初始化参数：initParams
	// 白名单：
	servletRegistrationBean.addInitParameter("allow", "127.0.0.1");
	// IP黑名单 (存在共同时，deny优先于allow) : 如果满足deny的话提示:Sorry, you are not
	// permitted to view this page.
	servletRegistrationBean.addInitParameter("deny", "192.168.1.73");
	// 登录查看信息的账号密码.
	servletRegistrationBean.addInitParameter("loginUsername", "admin");
	servletRegistrationBean.addInitParameter("loginPassword", "123456");
	// 是否能够重置数据.
	servletRegistrationBean.addInitParameter("resetEnable", "true");
	return servletRegistrationBean;
}
```
- addInitParameter 方法使示例2

```java
/**
 * 注册一个：filterRegistrationBean
 * @return
 */
@Bean
public FilterRegistrationBean druidStatFilter() {
	FilterRegistrationBean filterRegistrationBean = new FilterRegistrationBean(new WebStatFilter());
	// 添加过滤规则.
	filterRegistrationBean.addUrlPatterns("/*");
	// 添加忽略的格式信息.
	filterRegistrationBean.addInitParameter("exclusions", "*.js,*.gif,*.jpg,*.png,*.css,*.ico,/druid/*");
	return filterRegistrationBean;
}
```
- addUrlPatterns 方法使示例1

```java
registration.addUrlPatterns("/*");过滤应用程序中所有资源,当前应用程序根下的所有文件包括多级子目录下的所有文件，注意这里*前有“/”
  registration.addUrlPatterns(".html");过滤指定的类型文件资源, 当前应用程序根目录下的所有html文件，注意：*.html前没有“/”,否则错误
  registration.addUrlPatterns("/folder_name/*");过滤指定的目录下的所有文件,当前应用程序根目录下的folder_name子目录（可以是多级子目录）下所有文件
  registration.addUrlPatterns("/index.html");过滤指定文件
```
