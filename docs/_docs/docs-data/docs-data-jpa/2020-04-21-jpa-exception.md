---
title: JPA应用中出现的Exception
permalink: /docs-data-jpa/exception
tags: JPA
key: docs-data-jpa-exception
---

## java代码
```
public interface CheckDayInfoRepository extends JpaRepository<CheckDayInfo, Long>, JpaSpecificationExecutor<CheckDayInfo> {
    List<CheckDayInfo> findAllByDate(String date);

    @Query(value = "SELECT me.address as address,me.totalChecked as totalChecked,info.checked as checked,me.avatar as avatar,info.checkedTime as checkedTime," +
            "info.upvoteNumber as upvoteNumber,me.username as username" +
            " FROM Member me LEFT  JOIN  (SELECT * FROM CheckDayInfo  WHERE date= ?1 ) info  ON me.username=info.username WHERE me.status= 0 " +
            "ORDER by info.checked DESC , info.checkedTime DESC",
            countQuery = "select COUNT(*) FROM Member me LEFT  JOIN  (SELECT * FROM CheckDayInfo  WHERE  date= ?1 ) info  " +
                    "ON me.username=info.username WHERE me.status= 0",
            nativeQuery = true)
    Page<CheckDayVO> selectCheckInfoByDate(String date, Pageable pageable);
    // 查询条件 meusername
    @Query(value = "SELECT new com.ojeveryday.backend.pojo.dto.CheckDayVO(me.address,me.totalChecked,info.checked,me.avatar,info.checkedTime,info.upvoteNumber,me.username) " +
            "FROM CheckDayInfo info LEFT JOIN Member me ON info.username = me.username and me.status= 0 and info.date = ?1 ORDER by info.checked DESC, info.checkedTime ASC")
    Page<CheckDayVO> selectAllByDate(String date, Pageable pageable);
```

## 1. 分页异常
**错误异常**，分页查询报错， `Unknown column 'me' in 'field list' `     
**解决方法** 可通过自己写 `countQuery = ` 解决

## 2. No converter found capable of converting from type [org.springframework.data.jpa.repository....
```java
Hibernate: SELECT me.address as address,me.totalChecked as totalChecked,info.checked as checked,me.avatar as avatar,info.checkedTime as checkedTime,info.upvoteNumber as upvoteNumber,me.username as username FROM Member me LEFT  JOIN  (SELECT * FROM CheckDayInfo  WHERE date= ? ) info  ON me.username=info.username WHERE me.status= 0 ORDER by info.checked DESC , info.checkedTime DESC limit ?
Hibernate: select COUNT(*) FROM Member me LEFT  JOIN  (SELECT * FROM CheckDayInfo  WHERE  date= ? ) info  ON me.username=info.username WHERE me.status= 0
2020-04-21 01:49:27.398 ERROR 56349 --- [p-nio-80-exec-1] c.o.b.c.handler.GlobalExceptionHandler   : [everyday]-[unknown error happen]-No converter found capable of converting from type [org.springframework.data.jpa.repository.query.AbstractJpaQuery$TupleConverter$TupleBackedMap] to type [com.ojeveryday.backend.pojo.dto.CheckDayVO]

org.springframework.core.convert.ConverterNotFoundException: No converter found capable of converting from type [org.springframework.data.jpa.repository.query.AbstractJpaQuery$TupleConverter$TupleBackedMap] to type [com.ojeveryday.backend.pojo.dto.CheckDayVO]
```

**错误原因** 在 `nativeQuery = true`只能返回 JpaRepository<CheckDayInfo, Long> 中的 `CheckDayInfo` 而我的方法返回的是 `CheckDayVO`



## 3. 在`nativeQuery = false` 情况下可以指定实体类返回

## 4. org.springframework.data.mapping.PropertyReferenceException: No property xxxx found for type Xxxx

## 参考链接
- [JPA错误之Failed to convert from type [java.lang.Object[]] to type](https://blog.csdn.net/moshowgame/article/details/80537196)
- [org.springframework.data.mapping.PropertyReferenceException: No property xxxx found for type Xxxx](https://my.oschina.net/anxiaole/blog/873695)
- [jpa2.x的getOne()/findOne()/findById()的区别及使用](https://blog.csdn.net/zx110503/article/details/81356735)
