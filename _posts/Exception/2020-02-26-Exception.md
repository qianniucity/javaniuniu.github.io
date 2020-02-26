---
title: 项目中遇到的Exception
permalink: /Exception/all
tags: Exception 运行异常
pageview: true
show_date: true
sidebar:
  nav: docs-en-todo
---
### 测试过程
```
异常：No runnable methods
原因：@Test时import的是@org.testng.annotations.Test所以会报错
解决方法:改为import org.junit.Test
```

```
异常：JPA连接MySQL报错Table 'test.hibernate_sequence' doesn't exist
原因：设计数据库时（DDL），没有设置 id 自增
解决方法：@GeneratedValue(strategy = GenerationType.AUTO) 改成GenerationType.IDENTITY
```
