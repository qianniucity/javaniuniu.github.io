---
title: GrantedAuthorityHolder
permalink: /SpringSecurity/GrantedAuthorityHolder
tags: SpringSecurity 类解释
pageview: true
show_date: true
sidebar:
  nav: docs-en-Spring
---

**作用：** 保留系统当前的安全上下文细节，其中就包括当前使用系统的用户的信息。

**上下文细节怎么表示？**
用SecurityContext对象来表示

**每个用户都会有它的上下文，那这个SecurityContext保存在哪里呢？**
存储在一个SecurityContextHolder中，整个应用就一个SecurityContextHolder。

**SecurityContextHolder存储SecurityContext的方式？**

这要考虑到应用场景。
1. 单机系统，即应用从开启到关闭的整个生命周期只有一个用户在使用。由于整个应用只需要保存一个SecurityContext（安全上下文即可）
2. 多用户系统，比如典型的Web系统，整个生命周期可能同时有多个用户在使用。这时候应用需要保存多个SecurityContext（安全上下文），需要利用ThreadLocal进行保存，每个线程都可以利用ThreadLocal获取其自己的SecurityContext，及安全上下文。

#### 源码分析：
SecurityContextHolder结构

![图片pic1]({{"/assets/images/SpringSecurity_SecurityContextHolder/1313132-20180804103843367-247474087.png"}})


SecurityContextHolder.java(部分源码)
![图片pic2]({{"/assets/images/SpringSecurity_SecurityContextHolder/1313132-20180804103852761-1124294795.png"}})


由源码可知，SecurityContextHolder利用了一个SecurityContextHolderStrategy（存储策略）进行上下文的存储。我们来看看SecurityContestHolderStrategy，到底是什么



SecurityContestHolderStrategy.java（全部源码


![图片pic3]({{"/assets/images/SpringSecurity_SecurityContextHolder/1313132-20180804104028438-131989176.png"}})


可知 SecurityContestHolderStrategy只是一个接口，这个接口提供创建、清空、获取、设置上下文的操作。那它有哪些实现类呢，也就是有哪些存储策略呢？

GlobalSecurityContextHolderStrategy.java（全部源码）

全局的上下文存取策略，只存储一个上下文，对应前面说的单机系统。


![图片pic4]({{"/assets/images/SpringSecurity_SecurityContextHolder/1313132-20180804104006667-1903530318.png"}})

ThreadLocalSecurityContextHolderStrategy.java（全部源码）


![图片pic5]({{"/assets/images/SpringSecurity_SecurityContextHolder/1313132-20180804103942608-416432377.png"}})

基于ThreadLocal的存储策略实现，看上去，这个类好像跟上面那个全局的没什么差别。但是要注意了，它是用ThreadLocal来存储的。新手可能会疑惑，就一个变量，我怎么存储多个上下文，这个变量又不是集合。
这里就不分析源码了，实际上ThreadLocal内部会用数组来存储多个对象的。原理是，ThreadLocal会为每个线程开辟一个存储区域，来存储相应的对象。

**Authentication——用户信息的表示：**
    在SecurityContextHolder中存储了当前与系统交互的用户的信息。Spring Security使用一个Authentication 对象来表示这些信息。一般不需要自己创建这个对象，但是查找这个对象的操作对用户来说却非常常见。


![图片pic6]({{"/assets/images/SpringSecurity_SecurityContextHolder/1313132-20180804104047613-972268494.png"}})


批注：
    ①Principal（准则）=> 允许通过的规则，即允许访问的规则，基本等价于UserDetails（用户信息）

源码分析：
我们来看看，这个SecurityContext（安全上下文），到底是个什么样子。
SecurityContext.java（全部源码



![图片pic7]({{"/assets/images/SpringSecurity_SecurityContextHolder/1313132-20180804105743635-1374139544.png"}})


由源码可知，所谓的安全上下文，只是保存了Authentication（认证信息）。那认证信息包含哪些内容呢？

Authentication.java（全部源码）



![图片pic8]({{"/assets/images/SpringSecurity_SecurityContextHolder/1313132-20180804105755092-1881110492.png"}})

由源码可知，Authentication（认证信息），主要包含了以下内容
- 用户权限集合 => 可用于访问受保护资源时的权限验证
- 用户证书（密码） => 初次认证的时候，进行填充，认证成功后将被清空
- 细节 => 暂不清楚，猜测应该是记录哪些保护资源已经验证授权，下次不用再验证，等等。
- Pirncipal => 大概就是账号吧
- 是否已认证成功

参考链接
- [核心组件之SecurityContextHolder](https://www.cnblogs.com/longfurcat/p/9417912.html)
