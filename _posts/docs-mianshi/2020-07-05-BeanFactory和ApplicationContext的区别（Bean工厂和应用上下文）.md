---
title: BeanFactory和ApplicationContext的区别（Bean工厂和应用上下文）
permalink: /mianshi/spring/0705/03
tags: 面试题
key: mianshi-2020-07-05-06
---

**BeanFactory和ApplicationContext 接口及其子类图** 

![applicationcontext和beanfactory](/assets/images/mianshiti/0705/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzIwNzU3NDg5,size_16,color_FFFFFF,t_70.jpeg)

## BeanFactory

BeanFactory是spring的原始接口，针对原始结构的实现类功能比较单一，BeanFactory接口实现的容器，特点是在每次获取对象时才会创建对象。

## ApplicationContext

继承了BeanFactory接口，拥有BeanFactory的全部功能，并且扩展了很多高级特性，每次容器启动时就会创建所有的对象。

**创建ApplicationContext的方法：** 

1. 丛类路径下加载配置文件:ClassPathXmlApplicationContext ("applicationContext.xml");
2. 从硬盘绝对路径下加载配置文件: FileSystemXmlApplicationContext(“d:/xxx/yyy/xxx”);

> ## **结论**
>
> 早期的电脑性能低，内存小，所以spring容器的容量不足，不能讲所以的对象全部创建好放入容器，所以使用的是BeanFactory，需要某个对象时，再进行创建，随着电脑硬件的发展，内存越来越大，所以spring框架引入了ApplicationContext，将所有的对象都创建好，放入容器，使用哪个对象，从容器中取得即可。

所以，web开发中,使用applicationContext. 在资源匮乏的环境可以使用BeanFactory.

 

**BeanFactory 和ApplicationContext** (详细说明)

- **Bean 工厂**（com.springframework.beans.factory.BeanFactory）是Spring 框架最核心的接口，它提供了高级IoC 的配置机制。
- **应用上下文**（com.springframework.context.ApplicationContext）建立在BeanFactory 基础之上。

**几乎所有的应用场合我们都直接使用ApplicationContext 而非底层的BeanFactory。**

**1.1 BeanFactory 的类体系结构**

**BeanFactory:** 接口位于类结构树的顶端， 它最主要的方法就是getBean(StringbeanName)，该方法从容器中返回特定名称的Bean，BeanFactory 的功能通过其他的接口得到不断扩展。
**ListableBeanFactory**：该接口定义了访问容器中Bean 基本信息的若干方法，如查看Bean 的个数、获取某一类型Bean 的配置名、查看容器中是否包括某一Bean 等方法；
**HierarchicalBeanFactory：**父子级联IoC 容器的接口，子容器可以通过接口方法访问父容器；
**ConfigurableBeanFactory**：是一个重要的接口，增强了IoC 容器的可定制性，它定义了设置类装载器、属性编辑器、容器初始**化后置处理器等方法；
AutowireCapableBeanFactory：**定义了将容器中的Bean 按某种规则（如按名字匹配、按类型匹配等）进行自动装配的方法；
**SingletonBeanRegistry：**定义了允许在运行期间向容器注册单实例Bean 的方法；
**BeanDefinitionRegistry：**Spring 配置文件中每一个<bean>节点元素在Spring 容器里都通过一个BeanDefinition 对象表示，它描述了Bean 的配置信息。而BeanDefinitionRegistry 接口提供了向容器手工注册BeanDefinition 对象的方法。

**1.2** **ApplicationContext** **的类体系结构**

**ApplicationContext** 由BeanFactory 派生而来，提供了更多面向实际应用的功能。在BeanFactory 中，很多功能需要以编程的方式实现，而在ApplicationContext 中则可以通过配置的方式实现。
ApplicationContext 的主要实现类是ClassPathXmlApplicationContext 和FileSystemXmlApplicationContext，前者默认从类路径加载配置文件，后者默认从文件系统中装载配置文件。

核心接口包括：
**ApplicationEventPublisher：**让容器拥有发布应用上下文事件的功能，包括容器启动事件、关闭事件等。实现了ApplicationListener 事件监听接口的Bean 可以接收到容器事件， 并对事件进行响应处理。在ApplicationContext 抽象实现类AbstractApplicationContext 中，我们可以发现存在一个ApplicationEventMulticaster，它负责保存所有监听器，以便在容器产生上下文事件时通知这些事件监听 者。
**MessageSource：**为应用提供i18n 国际化消息访问的功能；
**ResourcePatternResolver ：** 所有ApplicationContext 实现类都实现了类似于PathMatchingResourcePatternResolver 的功能，可以通过带前缀的Ant 风格的资源文件路径装载Spring 的配置文件。
**LifeCycle：**该接口是Spring 2.0 加入的，该接口提供了start()和stop()两个方法，主要用于控制异步处理过程。在具体使用时，该接口同时被 ApplicationContext 实现及具体Bean 实现，ApplicationContext 会将start/stop 的信息传递给容器中所有实现了该接口的Bean，以达到管理和控制JMX、任务调度等目的。
**ConfigurableApplicationContext** 扩展于ApplicationContext，它新增加了两个主要的方法：refresh()和close()，让ApplicationContext 具有启动、刷新和关闭应用上下文的能力。在应用上下文关闭的情况下调用refresh()即可启动应用上下文，在已经启动的状态下，调用 refresh()则清除缓存并重新装载配置信息，而调用close()则可关闭应用上下文。这些接口方法为容器的控制管理带来了便利.

**代码示例：**

```java
ApplicationContext ctx =new ClassPathXmlApplicationContext("com/baobaotao/context/beans.xml");
ApplicationContext ctx =new FileSystemXmlApplicationContext("com/baobaotao/context/beans.xml");
ApplicationContext ctx = new ClassPathXmlApplicationContext(new String[]{"conf/beans1.xml","conf/beans2.xml"});
```

ApplicationContext 的初始化和BeanFactory 有一个重大的区别：BeanFactory在初始化容器时，并未实例化Bean，直到第一次访问某个Bean 时才实例目标Bean；而ApplicationContext 则在初始化应用上下文时就实例化所有单实例的Bean 。