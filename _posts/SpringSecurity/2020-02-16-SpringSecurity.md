---
title: SpringSecurity用到的类
permalink: /SpringSecurity/class
tags: SpringSecurity 类解释
pageview: true
show_date: true
sidebar:
  nav: docs-en-Spring
---

1. [User](/SpringSecurity/User):`UserDetails`的默认实现（框架提供的）,用户可以从自己的数据库中取出此用户的账号，密码，以及相关权限，然后用构造方法填充创建一个User对象即可
2. [UserDetails](/SpringSecurity/UserDetails):Spring Security基础接口，包含某个用户的账号，密码，权限，状态（是否锁定）等信息。只有getter方法,配合 `SimpleGrantedAuthority` 一起使用
3. [UserDetailsService](/SpringSecurity/UserDetailsService):用于返回用户相关数据。它有loadUserByUsername()方法，根据username查询用户实体,配合 `SimpleGrantedAuthority`和`User` 一起使用
4. [SimpleGrantedAuthority](/SpringSecurity/GrantedAuthority):用于获取权限来授权/控制访问权限（已授予的权限）
5. [SecurityContextHolder](/SpringSecurity/SecurityContext) 认证成功后，就把用户信息和拥有的权限都存储在其中
6. AuthenticationEntryPoint:用来解决匿名用户访问无权限资源时的异常,和 [AuthenticationException](/SpringSecurity/authenticationException) 配合使用
7. AccessDeineHandler [用来解决认证过的用户访问无权限资源时的异常](https://blog.csdn.net/jkjkjkll/article/details/79975975),和 [AccessDeniedException](https://docs.spring.io/spring-security/site/docs/4.2.13.RELEASE/apidocs/org/springframework/security/access/AccessDeniedException.html) 配合使用
8. [WebSecurityConfigurerAdapter](/SpringSecurity/WebSecurityConfigurerAdapter) 是个适配器, 在配置的时候,需要我们自己写个配置类去继承他,然后编写自己所特殊需要的配置
