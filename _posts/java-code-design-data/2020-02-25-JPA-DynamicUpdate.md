---
title: DynamicUpdate正确使用方式
permalink: /java-code-design-data/jpa/DynamicUpdate
tags: jpa Spring注解
pageview: true
show_date: true
sidebar:
  nav: docs-en-data
---
#### 原理
DynamicUpdate: 在只更新同一个session里面，同一个对象有改变的字段。说白了, 就是在更新某条记录之前, 先把这条记录从数据库查出来, 那么这条数据就在session(一级缓存)中, 我们再去修改这个对象的数据即可;

#### @DynamicUpdate正确使用方式
1. 在做 update实体类的某个属性之前，先做findById操作
2. 将需要修改的字段做 set 操作
3. 做 save 操作

#### 误区及经常出现的错误
1. 更新数据时，只传入需要更新的数据，而没有操作findById操作,造成其他数据为null

#### 举例
先说明一下@DynamicUpdate注解用在实体类上     
有 数据库 表tbl_foo和对应的实体类Foo，如下：  

|id|	name|	col3|	col4|	col5|
|:---|:---|:---|:---|:---|
|1	 | 毕加索	|1770	|奥地利|	男|

```java
class Foo{
    private Integer id;
    private String name;
    private String col3;
    private String col4;
    private String col5;
    getter...
    setter...
}
```
在Service中更新id=1记录的name属性，代码如下：
```java
Foo foo = fooDao.findById(1);
foo.setName("贝多芬");
fooDao.save(foo);
```

**两种情况：**
1. 在entity类中未使用@DynamicUpdate注解或使用了@DynamicUpdate(false)，那么Hibernate底层执行的sql如:
```sql
update tbl_foo set name=?, col3=?, col4=?, col5=? where id=?
```

2. 在entity类中使用了@DynamicUpdate注解(或@DynamicUpdate(true))，Hibernate底层执行的sql如:
```sql
update tbl_foo set name=? where id=?
```
以上两种情况对数据库更新的结果是`等效`的，但是`使用@DynamicUpdate性能会好一些`。因为不使用@DynamicUpdate时，即使没有改变的字段也会被更新。如果进行频繁的更新操作，并且每次只更新少数字段，那么@DynamicUpdate对性能的优化效果还是很好的。
