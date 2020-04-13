---
title: CharacterEncodingFilter类方法说明
permalink: /Filter/CharacterEncodingFilter/explanation
tags: Filter拦截器 类解释
key: Filter-CharacterEncodingFilter-explanation
---
Servlet过滤器，它允许为请求指定字符编码。这很有用，因为即使在HTML页面或表单中指定了当前的浏览器，通常也不会设置字符编码。
如果请求尚未指定编码，则此过滤器可以应用其编码，或者在任何情况下都可以强制执行此过滤器的编码（“ forceEncoding” =“ true”）。在后一种情况下，该编码也将用作默认响应编码（尽管通常会被视图中设置的完整内容类型覆盖）

| 修饰符和类型	| 方法和说明| 描述|
| :-----| :---- | :---- |
| protected void| 	doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)| 与相同的合同doFilter，但保证在单个请求线程中每个请求仅被调用一次。|
| String| 	getEncoding()|返回为请求和/或响应配置的编码。|
| boolean| 	isForceRequestEncoding()|返回是否对请求强加编码。|
| boolean	| isForceResponseEncoding()|返回是否应在响应中强制使用编码。|
| void| 	setEncoding(String encoding)|设置用于请求的编码。|
| void| 	setForceEncoding(boolean forceEncoding)|设置是否encoding应该配置此过滤器以覆盖现有的请求和响应编码。|
| void| 	setForceRequestEncoding(boolean forceRequestEncoding)|设置encoding此过滤器的配置是否应该覆盖现有的请求编码。|
| void| 	setForceResponseEncoding(boolean forceResponseEncoding)|设置encoding此过滤器的配置是否应该覆盖现有的响应编码。|
