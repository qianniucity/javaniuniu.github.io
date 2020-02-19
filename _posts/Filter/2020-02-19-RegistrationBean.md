---
title: RegistrationBean类方法说明
permalink: /Filter/RegistrationBean/explanation
tags: Filter拦截器 类解释
pageview: true
show_date: true
sidebar:
  nav: docs-en-web
---

| 修饰符和类型| 	方法和说明| 描述 |
| :-----| :---- | :---- |
| void| 	addInitParameter(String name, String value)| 添加一个init参数，将所有现有参数替换为相同的名称.|
| protected void	| configure(Registration.Dynamic registration)| 配置注册基础设置.|
| Map<String,String>| 	getInitParameters()| 返回注册初始化参数的可变映射.|
| protected String| 	getOrDeduceName(Object value)| 推导此注册的名称.|
| int	| getOrder()||
| boolean	| isAsyncSupported()|返回异步操作是否支持此注册.|
| boolean	| isEnabled()|启用的标志（默认为true）|
| void| setAsyncSupported(boolean asyncSupported)|设置异步操作是否支持此注册.|
| void| 	setEnabled(boolean enabled)|指示已启用注册的标志.|
| void| 	setInitParameters(Map<String,String> initParameters)|设置此注册的初始化参数.|
| void| 	setName(String name)|设置此注册的名称.|
| void| 	setOrder(int order)|设置执行顺序，值越小，越先执行。｜
