---
title: RedisTemplate之opsForValue使用说明
permalink: /java-code-redis/RedisTemplate/opsForValue
tags: Redis
pageview: true
show_date: true
sidebar:
  nav: docs-en-data
---
#### Redis中opsForValue()方法的使用介绍：

##### 1、set(K key, V value)   
新增一个字符串类型的值，key是键，value是值。
```java
redisTemplate.opsForValue().set("stringValue","bbb");
```
##### 2、get(Object key)   
获取key键对应的值。
```java
String stringValue = redisTemplate.opsForValue().get("key")
```
##### 3、append(K key, String value)
在原有的值基础上新增字符串到末尾。   
```java
redisTemplate.opsForValue().append("key", "appendValue");
String stringValueAppend = redisTemplate.opsForValue().get("key");
System.out.println("通过append(K key, String value)方法修改后的字符串:"+stringValueAppend);  
```
##### 4、get(K key, long start, long end)
截取key键对应值得字符串，从开始下标位置开始到结束下标的位置(包含结束下标)的字符串。
```java
String cutString = redisTemplate.opsForValue().get("key", 0, 3);  
System.out.println("通过get(K key, long start, long end)方法获取截取的字符串:"+cutString);  
```
##### 5、getAndSet(K key, V value)
获取原来key键对应的值并重新赋新值。   
```java
String oldAndNewStringValue = redisTemplate.opsForValue().getAndSet("key", "ccc");  
System.out.print("通过getAndSet(K key, V value)方法获取原来的值：" + oldAndNewStringValue );  
String newStringValue = redisTemplate.opsForValue().get("key");  
System.out.println("修改过后的值:"+newStringValue);  
```
##### 6、setBit(K key, long offset, boolean value)
key键对应的值value对应的ascii码,在offset的位置(从左向右数)变为value。
```java
redisTemplate.opsForValue().setBit("key",1,false);  
newStringValue = redisTemplate.opsForValue().get("key")+"";  
System.out.println("通过setBit(K key,long offset,boolean value)方法修改过后的值:"+newStringValue);  
```
##### 7、getBit(K key, long offset)
判断指定的位置ASCII码的bit位是否为1。
```java
boolean bitBoolean = redisTemplate.opsForValue().getBit("key",1);  
System.out.println("通过getBit(K key,long offset)方法判断指定bit位的值是:" + bitBoolean);  
```
##### 8、size(K key)
获取指定字符串的长度
```java
Long stringValueLength = redisTemplate.opsForValue().size("key");  
System.out.println("通过size(K key)方法获取字符串的长度:"+stringValueLength);  
```
##### 9、increment(K key, double delta)
以增量的方式将double值存储在变量中。
```java
double stringValueDouble = redisTemplate.opsForValue().increment("doubleKey",5);   
System.out.println("通过increment(K key, double delta)方法以增量方式存储double值:" + stringValueDouble);  
```
##### 10、increment(K key, long delta)
以增量的方式将long值存储在变量中。
```java
double stringValueLong = redisTemplate.opsForValue().increment("longKey",6);   
System.out.println("通过increment(K key, long delta)方法以增量方式存储long值:" + stringValueLong);  
```
##### 11、setIfAbsent(K key, V value)
如果键不存在则新增,存在则不改变已经有的值。
```java
boolean absentBoolean = redisTemplate.opsForValue().setIfAbsent("absentKey","fff");  
System.out.println("通过setIfAbsent(K key, V value)方法判断变量值absentValue是否存在:" + absentBoolean);  
if(absentBoolean){  
    String absentValue = redisTemplate.opsForValue().get("absentKey")+"";  
    System.out.print(",不存在，则新增后的值是:"+absentValue);  
    boolean existBoolean = redisTemplate.opsForValue().setIfAbsent("absentKey","eee");  
    System.out.print(",再次调用setIfAbsent(K key, V value)判断absentValue是否存在并重新赋值:" + existBoolean);  
    if(!existBoolean){  
        absentValue = redisTemplate.opsForValue().get("absentKey")+"";  
        System.out.print("如果存在,则重新赋值后的absentValue变量的值是:" + absentValue);  
```
##### 12、set(K key, V value, long timeout, TimeUnit unit)
设置变量值的过期时间。
```java
redisTemplate.opsForValue().set("timeOutKey", "timeOut", 5, TimeUnit.SECONDS);  
String timeOutValue = redisTemplate.opsForValue().get("timeOutKey")+"";  
System.out.println("通过set(K key, V value, long timeout, TimeUnit unit)方法设置过期时间，过期之前获取的数据:"+timeOutValue);  
Thread.sleep(5*1000);  
timeOutValue = redisTemplate.opsForValue().get("timeOutKey")+"";  
System.out.print(",等待10s过后，获取的值:"+timeOutValue);  
```
##### 13、set(K key, V value, long offset)
覆盖从指定位置开始的值。
```java
redisTemplate.opsForValue().set("absentKey","dd",1);  
String overrideString = redisTemplate.opsForValue().get("absentKey");  
System.out.println("通过set(K key, V value, long offset)方法覆盖部分的值:"+overrideString);  
```
##### 14、multiSet(Map<? extends K,? extends V> map)
设置map集合到redis。
```java
Map valueMap = new HashMap();  
valueMap.put("valueMap1","map1");  
valueMap.put("valueMap2","map2");  
valueMap.put("valueMap3","map3");  
redisTemplate.opsForValue().multiSet(valueMap);  
```
##### 15、multiGet(Collection<K> keys)
根据集合取出对应的value值。
```java
//根据List集合取出对应的value值  
List paraList = new ArrayList();  
paraList.add("valueMap1");  
paraList.add("valueMap2");  
paraList.add("valueMap3");  
List<String> valueList = redisTemplate.opsForValue().multiGet(paraList);  
for (String value : valueList){  
    System.out.println("通过multiGet(Collection<K> keys)方法获取map值:" + value);  
}
```
##### 16、multiSetIfAbsent(Map<? extends K,? extends V> map)
如果对应的map集合名称不存在，则添加；如果存在则不做修改。
```java
Map valueMap = new HashMap();  
valueMap.put("valueMap1","map1");  
valueMap.put("valueMap2","map2");  
valueMap.put("valueMap3","map3");  
redisTemplate.opsForValue().multiSetIfAbsent(valueMap);
```

参考文档
- [RedisTemplate之opsForValue使用说明](https://blog.csdn.net/qq_25135655/article/details/80357137)
