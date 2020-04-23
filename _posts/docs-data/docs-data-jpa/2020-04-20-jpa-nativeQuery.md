---
title: 有nativeQuery = true和没有的区别
permalink: /docs-data-jpa/nativeQuery
tags: jpa
key: docs-data-jpa-nativeQuery
---

有 `nativeQuery = true` 时，是可以执行原生sql语句，所谓原生sql，也就是说这段sql拷贝到数据库中，然后把参数值给一下就能运行了，比如：
```java
@Query(value = "select * from product_rel where audit_id=?1 and process_object=0 ",nativeQuery = true)
List<ProductRel> findAllByProductAuditId(Integer id);
```
这个时候，把 `select * from product_rel where audit_id=?1 and process_object=0` 拷贝到数据库中，并给audit_id赋一个值，那么这段sql就可以运行。其中数据库表在数据库中的表名就是product_rel，字段audit_id在数据库中也是真实存在的字段名。

 

没有 `nativeQuery = true` 时，就不是原生sql，而其中的 `select * from xxx中xxx` 也不是数据库对应的真正的表名，而是对应的实体名，并且sql中的字段名也不是数据库中真正的字段名，而是 `实体的字段名`。例如：
```java
@Query("select ratio from MdmRatio ratio  where enabledNum=1 ")
List<MdmUtilThreeProjection> findByMdmUtilThreeProjection();
```

```java
@Entity
@Table(name="mdm_ratio")
public class MdmRatio implements Serializale{...}
```
此中， `select ratio from MdmRatio ratio` 中的MdmRatio为实体名，不是真正的数据库表名，真正的数据库表名是mdm_ratio(如上图@Table里面写的那样，MdmRatio实体对应的数据库表名是mdm_ratio。但不一定都是这样的，可能你的MdmRatio实体对应的数据库表是mdm_ratio_abc，但whatever，随便是什么，只要它真实存在就Ok)，而查询条件中的enabledNum在数据库中真正的名字是enabled_num。

这两个的作用是一样的，只是写法不同而已。涉及到HQL的知识。
