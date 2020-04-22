---
title: 项目中遇到的Exception
permalink: /Exception/all
tags: Exception 运行异常
key: Exception-all
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
```
异常：password (should be mapped with insert="false" update="false")
原因：某参数被重复定义，如@Column(name = "password"） 被定义了两次以上
解决方法：@Column定义数据库字段的过程中，name的值保证唯一性
```
```
异常：Could not write JSON: Infinite recursion (StackOverflowError)
对应项目：[Github](https://github.com/javaniuniu/springboot-buckets/springboot-restful)
原因：返回的json数据死循环
解决方法：在父类get方法添加 @JsonManagedReference 子类get方法添加 @JsonBackReference
```
```
异常：Cannot deserialize instance of
对应项目：[Github](https://github.com/javaniuniu/springboot-buckets/springboot-restful)
原因：参数为List 少用了 []
解决方法： 在入参值上面添加 []
```
```
异常：java.lang.ClassNotFoundException: com.mysql.cj.jdbc.Driver
对应项目：[Github](https://github.com/javaniuniu/springboot-buckets/springboot-hibernate)
原因：mysql版本不支持
解决方法：版本 5.7 -> 8.0.19
```

```
异常：org.hibernate.QueryException: Legacy-style query parameters (`?`) are no longer supported
对应项目：[Github](https://github.com/javaniuniu/springboot-buckets/springboot-hibernate)
原因：hibernate最新版本需要在参数上添加序号
解决方法：比如
this.getHibernateTemplate().find("from Product p where p.pname=?", name);
改为
this.getHibernateTemplate().find("from Product p where p.pname=?0", name);
多个参数依次递增
```

```
异常：Could not get constructor for org.hibernate.persister.entity.SingleTableEntityPersister报错解决办法
原因：没有javassist 包
解决方法： 添加javassist包
```

```
异常：javax.net.ssl.SSLException: closing inbound before receiving peer's close_notify的解决办法
解决方法：配置连接数据库的url时，加上useSSL=false
```
