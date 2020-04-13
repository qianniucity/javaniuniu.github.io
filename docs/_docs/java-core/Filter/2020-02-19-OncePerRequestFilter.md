---
title: OncePerRequestFilter类方法说明
permalink: /Filter/OncePerRequestFilter/explanation
tags: Filter拦截器 类解释
key: Filter-OncePerRequestFilter-explanation
---
参考 [OncePerRequestFilter示例](/Spring/OncePerRequestFilter/example)

| 修饰符和类型|	方法和说明|描述|
| :-----| :---- | :---- |
| void	| doFilter(ServletRequest request, ServletResponse response, FilterChain filterChain)| 此doFilter实现存储“已过滤”的请求属性，如果该属性已经存在，则继续进行而不进行过滤。|
| protected abstract void| 	doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)| 与相同的合同doFilter，但保证在单个请求线程中每个请求仅被调用一次。|
| protected void| 	doFilterNestedErrorDispatch(HttpServletRequest request, HttpServletResponse response, FilterChainfilterChain)|通常，在REQUEST分派完成后，将发生ERROR分派，并且筛选器链重新开始。|
| protected String| 	getAlreadyFilteredAttributeName()| 返回标识已过滤请求的请求属性的名称。|
| protected boolean| 	isAsyncDispatch(HttpServletRequest request)|javax.servlet.DispatcherType.ASYNCServlet 3.0中引入的分派器类型意味着可以在单个请求的过程中在多个线程中调用过滤器。|
| protected boolean| 	isAsyncStarted(HttpServletRequest request)| 请求处理是否处于异步模式，这意味着在退出当前线程后将不会提交响应。|
| protected boolean| 	shouldNotFilter(HttpServletRequest request)| 可以在子类中重写以进行自定义过滤控制，然后返回true以避免对给定请求进行过滤。|
| protected boolean| 	shouldNotFilterAsyncDispatch()| javax.servlet.DispatcherType.ASYNCServlet 3.0中引入的分派器类型意味着可以在单个请求的过程中在多个线程中调用过滤器。|
| protected boolean| 	shouldNotFilterErrorDispatch()| 是否过滤错误调度，例如servlet容器何时处理和错误映射到web.xml。|
