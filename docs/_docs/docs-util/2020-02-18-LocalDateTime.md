---
title: LocalDateTime在spring boot中的格式化配置
permalink: /docs-util/LocalDateTime
tags: 工具类 SpringBoot CodeMark
key: docs-util-LocalDateTime
---

在项目中日期格式化是最常见的问题，之前涉及的 java.util.Date 和 java.util.Calendar 类易用性差，不支持时区，非线程安全，对日期的计算方式繁琐，而且容易出错，因为月份是从0开始的，从 Calendar 中获取的月份需要加一才能表示当前月份。

在 JDK8 中，一个新的重要特性就是引入了全新的时间和日期API，它被收录在 java.time 包中，借助新的时间和日期API可以以更简洁的方法处理时间和日期。

下面我们通过一些配置实现对日期类型LocalDateTime的格式化

##### 导入依赖    
新建一个spring boot项目导入web依赖即可
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```
##### 配置方案一
定义一个配置类，在里面定义两个 Bean 即可完成全局日期格式化处理，同时还兼顾了 Date 和 LocalDateTime 并存

```java
package com.carry.config;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.jackson.Jackson2ObjectMapperBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;

@Configuration
public class LocalDateTimeSerializerConfig {

    @Value("${spring.jackson.date-format:yyyy-MM-dd HH:mm:ss}")
    private String pattern;

     // 方案一
    @Bean
    public LocalDateTimeSerializer localDateTimeDeserializer() {
        return new LocalDateTimeSerializer(DateTimeFormatter.ofPattern(pattern));
    }

    @Bean
    public Jackson2ObjectMapperBuilderCustomizer jackson2ObjectMapperBuilderCustomizer() {
        return builder -> builder.serializerByType(LocalDateTime.class, localDateTimeDeserializer());
    }

}
```


实体类
```java
package com.carry.dto;

import java.time.LocalDateTime;

public class Order {

    private LocalDateTime createTime;

    public LocalDateTime getCreateTime() {
        return createTime;
    }

    public void setCreateTime(LocalDateTime createTime) {
        this.createTime = createTime;
    }

}
```

控制层
```java
package com.carry.controller;

import java.time.LocalDateTime;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.carry.dto.Order;

@RestController
@RequestMapping("/orders")
public class OrderController {

    @GetMapping
    public Order query() {
        Order order = new Order();
        order.setCreateTime(LocalDateTime.now());
        return order;
    }
}
```

##### 测试
启动项目并在浏览器中访问 http://localhost:8080/orders
```
{
  "createTime":"2020-02-18 14:21:34"
}
```

参考链接
- [LocalDateTime在spring boot中的格式化配置](https://www.cnblogs.com/carrychan/p/9883172.html)
