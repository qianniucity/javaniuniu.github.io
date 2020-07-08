---
title: SpringBean 生命周期
permalink: /mianshi/spring/0707/11
tags: 面试题
key: mianshi-2020-07-07-21
---

最近面试过程中被问到了SpringBean生命周期，当时答了个印象中的大概，详细整理一下

Spring容器管理的类在定位，加载之后，初始化到能用的过程如下图：

![img](/assets/images/mianshiti/0707/2081031-20200702193359366-206975160.png)

 

1、调用构造方法new一个实例到容器中

2、对于依赖的属性进行注入

   注意：由于注入的属性在构造方法之后，所以在构造方法中使用被注解的字段（@Autowire、@Value等）会拿不到注入的值或者实例；

3、bean如果集成了Aware接口的各种子接口，那么可以执行相应Aware接口的方法，Aware接口主要是获取当前bean被放入容器的信息，不如beanId，beanFactory,ClassLoader等。

   执行顺序，大概是BeanNameAware->BeanFactoryAware...

4、BeanPostProcessor（后置处理器）的postProcessBeforeInitialization方法

   这个before初始化的意思是调用显式初始化方法之前的方法，BeanPostProcessor的方法逻辑是什么也不做，直接返回bean,

BeanPostProcessor:

```
//为在Bean的初始化前提供回调入口
@Nullable
default Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
	return bean;
}
```

可以自己定义一个处理器，来做一些想做的事



```xml
 1 　  
 2 
 3 <?xml version="1.0" encoding="UTF-8"?>
 4 <beans xmlns="http://www.springframework.org/schema/beans"
 5 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
 6 xsi:schemaLocation="http://www.springframework.org/schema/beans 
 7 http://www.springframework.org/schema/beans/spring-beans.xsd">
 8 
 9 <bean class="com.dpb.pojo.XXX" id="user" init-method="xxx">
10 <property name="xxx" value="波波烤鸭" />
11 </bean>
12 
13 <!-- 注册处理器 -->
14 <bean class="com.dpb.processor.MyBeanPostProcessor"></bean>
15 </beans>　　
```





```java
package com.dpb.processor;

import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.BeanPostProcessor;
/**
 * 自定义BeanPostProcessor实现类
 * BeanPostProcessor接口的作用是：
 *      我们可以通过该接口中的方法在bean实例化、配置以及其他初始化方法前后添加一些我们自己的逻辑
 * @author dengp
 *
 */
public class MyBeanPostProcessor implements BeanPostProcessor{

    /**
     * 实例化、依赖注入完毕，在调用显示的初始化之前完成一些定制的初始化任务
     * 注意：方法返回值不能为null
     * 如果返回null那么在后续初始化方法将报空指针异常或者通过getBean()方法获取不到bena实例对象
     * 因为后置处理器从Spring IoC容器中取出bean实例对象没有再次放回IoC容器中
     */
    @Override
    public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
        System.out.println("初始化 before--实例化的bean对象:"+bean+"\t"+beanName);
        // 可以根据beanName不同执行不同的处理操作
        return bean;
    }

    /**
     * 实例化、依赖注入、初始化完毕时执行 
     * 注意：方法返回值不能为null
     * 如果返回null那么在后续初始化方法将报空指针异常或者通过getBean()方法获取不到bena实例对象
     * 因为后置处理器从Spring IoC容器中取出bean实例对象没有再次放回IoC容器中
     */
    @Override
    public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
        System.out.println("初始化 after...实例化的bean对象:"+bean+"\t"+beanName);
        // 可以根据beanName不同执行不同的处理操作
        return bean;
    }

}
```



 

5、执行@PostConstruct 注解的方法，比如：

```java
@PostConstruct
private void init(){
  doSomething...
}
```

 

6、bean实现了InitializingBean，执行afterPropertiesSet方法,比如：



```java
public class MyServiceImpl implements InitializingBean {

    @Override
    public void afterPropertiesSet() throws Exception {
        System.out.println("AfterPropertiesSet method: myServiceImpl");
    }
}
```



 

7、执行配置文件中的init-method

8、BeanPostProcessor的postProcessAfterInitialization方法

9、至此完成bean的准备，可以使用。

__当bean不在被使用，容器关闭时，bean会被销毁__。可以有一下方法参与销毁行为

![img](/assets/images/mianshiti/0707/2081031-20200702195852697-627239963.png)

 

1、执行@PostDestroy 注解的方法

2、bean实现了DisposableBean，执行destroy方法

3、执行配置文件中的destroy-method