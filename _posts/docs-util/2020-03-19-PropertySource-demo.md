---
title: 浅析PropertySource 基本使用-示例
permalink: /docs-util/properties/PropertySource/demo
tags: 配置文件
key: docs-util-properties-PropertySource-demo
---
## 应用实例
以application开头的配置文件，属性和配置文件中的key相同，可直接获取value
```java
@ConfigurationProperties(prefix = "user")
public class UserConfig {
    private String name;
    private String good;
    private String pass;
    ...get set 方法省略
```
application-user.yml

```xml
user:
  name: javaniuniu
  pass: 1232342
  good: 23esd
```
