---
title: DefaultServletHandlerConfigurer解析器说明
permalink: /Handler/DefaultServletHandlerConfigurer/explanation
tags: Handler解析器
pageview: true
show_date: true
sidebar:
  nav: docs-en-web
---
#### 简介
通过将请求转发到Servlet容器的“默认” Servlet，配置用于处理静态资源的请求处理程序。当Spring MVC DispatcherServlet映射到“ /” 时，将使用此方法，从而覆盖Servlet容器对静态资源的默认处理。
由于此处理程序的配置优先级最低，因此它实际上允许所有其他处理程序映射处理该请求，并且如果没有一个处理，则此处理程序可以将其转发到“默认” Servlet。

#### 方法说明

| 修饰符和类型|	方法和说明|描述|
| :-----| :---- | :---- |
| protected SimpleUrlHandlerMapping	| buildHandlerMapping()| 返回一个处理程序映射实例，Ordered.LOWEST_PRECEDENCE 该DefaultServletHttpRequestHandler实例的排序顺序为：包含映射到的实例"/**"；或者null如果未启用默认servlet处理。|
| void| 	enable()| 启用转发到“默认” Servlet的功能。|
| void| 	enable(String defaultServletName)| 启用转发到由给定名称标识的“默认” Servlet的功能。|
