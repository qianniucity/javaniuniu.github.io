---
title: shiro 中 AuthorizingRealm 的执行时机
permalink: /web/shiro/AuthorizingRealm
tags: shiro AuthorizingRealm
key: web-shiro-AuthorizingRealm
---

#### 1.doGetAuthenticationInfo执行时机如下


当调用Subject currentUser = SecurityUtils.getSubject();

currentUser.login(token);



#### 2.doGetAuthorizationInfo执行时机有三个，如下：



1. subject.hasRole(“admin”) 或 subject.isPermitted(“admin”)：自己去调用这个是否有什么角色或者是否有什么权限的时候；

2. @RequiresRoles("admin") ：在方法上加注解的时候；

3. [@shiro.hasPermission name = "admin"][/@shiro.hasPermission]：在页面上加shiro标签的时候，即进这个页面的时候扫描到有这个标签的时候。
