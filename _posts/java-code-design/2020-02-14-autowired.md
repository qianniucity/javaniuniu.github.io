---
title: Autowired的使用:推荐对构造函数进行注释
permalink: /goodjavacode/autowired
tags: Code Annotation
pageview: true
show_date: true
sidebar:
  nav: docs-en-code
---
在编写代码的时候，使用@Autowired注解是，发现IDE报的一个警告，如下：

Spring Team recommends "Always use constructor based dependency injection in your beans. Always use assertions for mandatory dependencies".
{:.error}
翻译：Spring建议”总是在您的bean中使用构造函数建立依赖注入。总是使用断言强制依赖”。


这段代码警告原来的写法是：
```java
@Autowired
private EnterpriseDbService service;
```

建议后写成下面的样子：
```java
private final EnterpriseDbService service;

@Autowired
public EnterpriseDbController(EnterpriseDbService service) {
   this.service = service;
}
```

奇怪，为何会有这样的建议。?
我们知道：@Autowired 可以对成员变量、方法以及构造函数进行注释。那么对成员变量和构造函数进行注释又有什么区别呢？

@Autowired注入bean，相当于在配置文件中配置bean，并且使用setter注入。而对构造函数进行注释，就相当于是使用构造函数进行依赖注入了吧。莫非是这两种注入方法的不同。

以下是：@Autowired和构造方法执行的顺序解析

先看一段代码，下面的代码能运行成功吗？

```java
@Autowired
private User user;
private String school;

public UserAccountServiceImpl(){
    this.school = user.getSchool();
}
```

答案是不能。

因为Java类会先执行构造方法，然后再给注解了@Autowired 的user注入值，所以在执行构造方法的时候，就会报错。

报错信息可能会像下面：
```java
　　Exception in thread "main" org.springframework.beans.factory.BeanCreationException: Error creating bean with name '...' defined in file [....class]: Instantiation of bean failed; nested exception is org.springframework.beans.BeanInstantiationException: Failed to instantiate [...]: Constructor threw exception; nested exception is java.lang.NullPointerException
```
报错信息说：创建Bean时出错，出错原因是实例化bean失败，因为bean时构造方法出错，在构造方法里抛出了空指针异常。

解决办法是，使用构造器注入，如下：

```java
private User user;
private String school;

@Autowired
public UserAccountServiceImpl(User user){
    this.user = user;
    this.school = user.getSchool();
}
```

可以看出，**使用构造器注入的方法，可以明确成员变量的加载顺序。**

PS：Java变量的初始化顺序为：静态变量或静态语句块–>实例变量或初始化语句块–>构造方法–>@Autowired


##### 那么最开始Spring建议，为何要将成员变量加上final类型呢？

网上有解释如下：spring配置默认的bean的scope是singleton，也就是启动后一直有。通过设置bean的scope属性为prototype来声明该对象为动态创建。但是，如果你的service本身是singleton，注入只执行一次。

 @Autowired本身就是单例模式，只会在程序启动时执行一次，即使不定义final也不会初始化第二次，所以这个final是没有意义的吧。

可能是为了防止，在程序运行的时候，又执行了一遍构造函数；

或者是更容易让人理解的意思，加上final只会在程序启动的时候初始化一次，并且在程序运行的时候不会再改变。
