---
title: Mybatis Example的高级用法
permalink: /java-code-mybatis/mybatis/Example
tags: Mybatis
key: java-code-mybatis-mybatis-Example
---

### 一. mapper接口中的函数及方法

|方法名| 功能 |
| :-----| :-----|
|int countByExample(UserExample example)   |	按条件计数   |
|int deleteByPrimaryKey(Integer id)   |	按主键删除   |
|int deleteByExample(UserExample example)   |	按条件查询   |
|String/Integer insert(User record)   |	插入数据（返回值为ID）   |
|User selectByPrimaryKey(Integer id)   |	按主键查询   |
|ListselectByExample(UserExample example)   |	按条件查询   |
|ListselectByExampleWithBLOGs(UserExample example)   |	按条件查询（包括BLOB字段）。只有当数据表中的字段类型有为二进制的才会产生。   |
|int updateByPrimaryKey(User record)   |	按主键更新   |
|int updateByPrimaryKeySelective(User record)   |	按主键更新值不为null的字段   |
|int updateByExample(User record, UserExample example)   |	按条件更新   |
|int updateByExampleSelective(User record, UserExample example)   |	按条件更新值不为null的字段   |

### 二. example实例方法
>example 用于添加条件，相当于where后面的部分，理论上单表的任何复杂条件查询都可以使用example来完成。

|方法名| 功能 |
| :-----| :-----|
|example.setOrderByClause(“字段名 ASC”)   |	添加升序排列条件，DESC为降序   |
|example.setDistinct(false)   | 	去除重复，boolean型，true为选择不重复的记录。   |
|example.and(Criteria criteria)   |	为example添加criteria查询条件，关系为与   |
|example.or(Criteria criteria)	为example添加criteria查询条件，关系为或   |
|criteria.andXxxIsNull	添加字段xxx为null的条件   |
|criteria.andXxxIsNotNull	添加字段xxx不为null的条件   |
|criteria.andXxxEqualTo(value)   |	添加xxx字段等于value条件   |
|criteria.andXxxNotEqualTo(value)   |	添加xxx字段不等于value条件   |
|criteria.andXxxGreaterThan(value)   |	添加xxx字段大于value条件   |
|criteria.andXxxGreaterThanOrEqualTo(value)   |	添加xxx字段大于等于value条件   |
|criteria.andXxxLessThan(value)   |	添加xxx字段小于value条件   |
|criteria.andXxxLessThanOrEqualTo(value)   |	添加xxx字段小于等于value条件   |
|criteria.andXxxIn(List<？>)   |	添加xxx字段值在List<？>条件   |
|criteria.andXxxNotIn(List<？>)   |	添加xxx字段值不在List<？>条件   |
|criteria.andXxxLike(“%”+value+”%”)   |	添加xxx字段值为value的模糊查询条件   |
|criteria.andXxxNotLike(“%”+value+”%”)   |	添加xxx字段值不为value的模糊查询条件   |
|criteria.andXxxBetween(value1,value2)   |	添加xxx字段值在value1和value2之间条件   |
|criteria.andXxxNotBetween(value1,value2)   |	添加xxx字段值不在value1和value2之间条件   |
