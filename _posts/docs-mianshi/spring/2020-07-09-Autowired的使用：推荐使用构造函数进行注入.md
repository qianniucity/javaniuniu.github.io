---
title: Autowired的使用：推荐使用构造函数进行注入
permalink: /spring/0709/01
tags: 面试题
key: spring-2020-07-09-01
---
近期看同事用idea开发的代码，发现在使用@Autowired的时候，大多使用构造函数进行注入。

以前自己在写代码的时候都是直接在变量上进行注入，也没注意过，查了些资料，发现如果直接在变量上进行注入，那么可能会造成`NPE`。

##### 构造函数注入的方式：

```java
public class TestController {
private final TestService testService;
        @Autowired
        public TestController(TestService testService) {
                this.testService = testService;
        }
        …
}
```
 

##### 变量注入的方式：
```java
public class TestController {
        @Autowired
        private TestService testService;   
           …
 }
```


##### 那么为什么变量注入的方式可能会造成NPE？如下：
```java
public class TestController {
        @Autowired
        private TestService testService;
        private String testname;
                 public TestController(){
                         this.testname = testService.getTestName();
                 }
 }
```

这段代码执行时会报NPE。

__该类的构造函数中的变量值是通过TestService实例来调用TestService类中的方法获得，而Java类会先执行构造函数，然后在通过@Autowired注入实例，因此在执行构造函数的时候就会报错。__

解决方案就是采用构造函数的注入方式，如下：
```java
public class TestController {
        private TestService testService;
        private String testname;
        @Autowired
         public TestController(TestService testService){
                this.testService = testService;
                this.testname = testService.getTestName();
          }
 }
```


上面的方法中没有加入final来修饰，但是spring官方文档上是建议将成员变量加上final类型的，这是为什么呢？

有网友解释：

1.spring配置默认的bean的scope是singleton,可以通过设置bean的scope属性为prototype来声明该对象为动态创建。但是，如果你的service本身是singleton,注入只执行一次。

2.@Autowired本身就是单例模式，只会在程序启动时执行一次，即使不定义final也不会初始化第二次，所以这个final是没有意义的吧。

无论是spring的bean的scope是单例还是多例，成员变量加上了final后，只能被赋值一次，赋值后值不再改变。

 
##### 注意：

1.如果使用变量注入的话，可能回导致循环依赖，即A里面注入B，B里面又注入A。

2.在代码中发现构造方法中注入了很多依赖，显得很臃肿，对于这个问题，说明类中有太多的责任，违反了类的单一性职责原则，这时候需要考虑使用单一职责原则进行代码重构
