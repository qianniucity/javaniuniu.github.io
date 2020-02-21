---
title: 自定义注释
permalink: Annotation/myself
tags: 注解 CodeMark
pageview: true
show_date: true
sidebar:
  nav: docs-en-code
---
```java
package com.javaniuniu.scshorlsweb.system.commons.preventresubmit;

import java.lang.annotation.*;
import java.util.concurrent.TimeUnit;

/**
 * TODO 阻止重复提交
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
public @interface PreventResubmitLock {

    /**
     * redis 锁key的前缀
     *
     * @return redis 锁key的前缀
     */
    String prefix() default "";

    /**
     * 过期秒数,默认为5秒
     *
     * @return 轮询锁的时间
     */
    int expire() default 5;

    /**timeUnit
     * 超时时间单位
     *
     * @return 秒
     */
    TimeUnit timeUnit() default TimeUnit.SECONDS;

    /**
     * <p>Key的分隔符（默认 :）</p>
     * <p>生成的Key：N:SO1008:500</p>
     *
     * @return String
     */
    String delimiter() default ":";
}

```

参考链接
- [java元注解 @Target注解用法](https://www.cnblogs.com/unknows/p/10261539.html)
