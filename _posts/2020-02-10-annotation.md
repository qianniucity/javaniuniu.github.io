---
title: 注释解释
permalink: /code/annotation
tags: 注解
sidebar:
  nav: docs-en-code
---

1. @Slf4j 一般注解在类的开头 [详情参考](https://blog.csdn.net/fanrenxiang/article/details/81012803)
2. @EqualsAndHashCode(callSuper = false) 作用就是自动的给model bean实现equals方法和hashcode方法，callSuper = false 表示生成的 hashcode 包括父类属性 [详情参考](https://blog.csdn.net/qq_27093465/article/details/90056695)
3. lombok
- @Data ： 注在类上，提供类的get、set、equals、hashCode、canEqual、toString方法
- @AllArgsConstructor ： 注在类上，提供类的全参构造
- @NoArgsConstructor ： 注在类上，提供类的无参构造
- @Setter ： 注在属性上，提供 set 方法
- @Getter ： 注在属性上，提供 get 方法
- @EqualsAndHashCode ： 注在类上，提供对应的 equals 和 hashCode 方法
- @Log4j/@Slf4j ： 注在类上，提供对应的 Logger 对象，变量名为 log   ，private static final Logger log = LoggerFactory.getLogger(UserController.class);

4. @Value 给属性赋值 [@Value注入](https://www.cnblogs.com/wangbin2188/p/9014837.html)
5. @Target注解用法  [取值(ElementType)有](https://www.cnblogs.com/unknows/p/10261539.html)
6. @Retention(RetentionPolicy.RUNTIME)  解不仅被保存到class文件中，jvm加载class文件之后，仍然存在 [RetentionPolicy.RUNTIME](https://www.cnblogs.com/a8457013/p/9965551.html)
7. Java自定义注解用在请求拦截中比较常用 [Java自定义注解](https://www.cnblogs.com/jajian/p/9695055.html)
