---
title: 注释解释
permalink: /Annotation/Annotation
tags: 注解
pageview: true
show_date: true
sidebar:
  nav: docs-en-code
---

1. @Slf4j 一般注解在类的开头 [详情参考](https://blog.csdn.net/fanrenxiang/article/details/81012803)
2.
3. lombok


4. @Value 给属性赋值 [@Value注入](https://www.cnblogs.com/wangbin2188/p/9014837.html)
5. @Target注解用法(元注解)  [取值(ElementType)有](https://www.cnblogs.com/unknows/p/10261539.html)
6. @Retention(RetentionPolicy.RUNTIME)  解不仅被保存到class文件中，jvm加载class文件之后，仍然存在 [RetentionPolicy.RUNTIME](https://www.cnblogs.com/a8457013/p/9965551.html)
7. Java自定义注解用在请求拦截中比较常用 [Java自定义注解](https://www.cnblogs.com/jajian/p/9695055.html)
8. @Aspect AOP为Aspect Oriented Programming的缩写，意为：面向切面编程 [@Aspect 注解使用详解](https://blog.csdn.net/fz13768884254/article/details/83538709)
9. @Order 定义Spring IOC容器中Bean的执行顺序的优先级 [浅谈Spring @Order注解的使用](https://blog.csdn.net/yaomingyang/article/details/86649072)
10. @EnableGlobalMethodSecurity(prePostEnabled=true) 这个注解，会从SecurityContext中取出Authencation对象，然后再取出Collection<GrantedAuthority> authorites集合。然后比对当前用户是否有权限"readArtical"。实际上就是比对集合中是否有那个GrantedAuthority的getAuthority()方法返回的字符串与"radArtical"匹配。
11.
