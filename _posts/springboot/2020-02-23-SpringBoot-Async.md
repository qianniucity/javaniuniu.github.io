---
title: SpringBoot Ansync 异步线程池-三种方式
permalink: /SpringBoot/Ansync
tags: SpringBootAnsync
sidebar:
  nav: docs-en-Spring
---
源码地址
[springboot-async](https://github.com/minplemon/springboot-buckets/tree/master/springboot-async)


## 异步线程池-三种方式
- @Ansync
- DeferredResult
- WebAsyncTask

演示在SpringBoot中如何使用异步线程池

## 主要类
- AsyncUncaughtExceptionHandler 处理异常 通过继承 `AsyncConfigurer` 可得
- ThreadPoolTaskExecutor 线程池配置 ，异步处理伴随着多请求，少不了线程处理

## 主要注解
- @Ansync 方法注解
- @EnableAsync 类注解，可在配置类中添加
