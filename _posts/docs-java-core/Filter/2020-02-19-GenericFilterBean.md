---
title: GenericFilterBean类方法说明
permalink: /Filter/GenericFilterBean/explanation
tags: Filter拦截器 类解释
key: Filter-GenericFilterBean-explanation
---

| 修饰符和类型|	方法和说明|描述|
| :-----| :---- | :---- |
protected void	addRequiredProperty(String property)
子类可以调用此方法以指定此属性（必须与它们公开的JavaBean属性匹配）是强制性的，并且必须作为配置参数提供。
void	afterPropertiesSet()
调用initFilterBean()可能包含子类的自定义初始化的方法。
protected Environment	createEnvironment()
创建并返回一个新的StandardServletEnvironment。
void	destroy()
子类可以重写此方法以执行自定义过滤器关闭。
Environment	getEnvironment()
返回Environment与此过滤器关联的。
FilterConfig	getFilterConfig()
使此过滤器的FilterConfig可用（如果有）。
protected String	getFilterName()
使此过滤器的名称可用于子类。
protected ServletContext	getServletContext()
使此过滤器的ServletContext可用于子类。
void	init(FilterConfig filterConfig)
初始化此过滤器的标准方法。
protected void	initBeanWrapper(BeanWrapper bw)
可能使用自定义编辑器为此GenericFilterBean初始化BeanWrapper。
protected void	initFilterBean()
子类可以重写此方法以执行自定义初始化。
void	setBeanName(String beanName)
存储在Spring bean工厂中定义的bean名称。
void	setEnvironment(Environment environment)
设置Environment此过滤器运行的位置。
void	setServletContext(ServletContext servletContext)
存储运行bean工厂的ServletContext。
