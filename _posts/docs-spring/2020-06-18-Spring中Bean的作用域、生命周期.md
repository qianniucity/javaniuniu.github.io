---
title: Spring中Bean的作用域、生命周期
permalink: /spring/bean
tags: spring
key: spring-bean
---

### Bean的作用域
　　Spring 3中为Bean定义了5中作用域，分别为singleton（单例）、prototype（原型）、request、session和global session，5种作用域说明如下：   
1. __singleton__：单例模式，Spring IoC容器中只会存在一个共享的Bean实例，无论有多少个Bean引用它，始终指向同一对象。Singleton作用域是Spring中的缺省作用域，也可以显示的将Bean定义为singleton模式，配置为：
`<bean id="userDao" class="com.ioc.UserDaoImpl" scope="singleton"/>`
2. __prototype__:原型模式，每次通过Spring容器获取prototype定义的bean时，容器都将创建一个新的Bean实例，每个Bean实例都有自己的属性和状态，而singleton全局只有一个对象。根据经验，对有状态的bean使用prototype作用域，而对无状态的bean使用singleton作用域。
3. __request__：在一次Http请求中，容器会返回该Bean的同一实例。而对不同的Http请求则会产生新的Bean，而且该bean仅在当前Http Request内有效。
`<bean id="loginAction" class="com.cnblogs.Login" scope="request"/>` ，针对每一次Http请求，Spring容器根据该bean的定义创建一个全新的实例，且该实例仅在当前Http请求内有效，而其它请求无法看到当前请求中状态的变化，当当前Http请求结束，该bean实例也将会被销毁。
4. __session__：在一次Http Session中，容器会返回该Bean的同一实例。而对不同的Session请求则会创建新的实例，该bean实例仅在当前Session内有效。
`<bean id="userPreference" class="com.ioc.UserPreference" scope="session"/>`，同Http请求相同，每一次session请求创建新的实例，而不同的实例之间不共享属性，且实例仅在自己的session请求内有效，请求结束，则实例将被销毁。
5. __global Session__：在一个全局的Http Session中，容器会返回该Bean的同一个实例，仅在使用portlet context时有效。

### Bean的生命周期
　　经过如上对Bean作用域的介绍，接下来将在Bean作用域的基础上讲解Bean的生命周期。    
　　Spring容器可以管理singleton作用域下Bean的生命周期，在此作用域下，Spring能够精确地知道Bean何时被创建，何时初始化完成，以及何时被销毁。而对于prototype作用域的Bean，Spring只负责创建，当容器创建了Bean的实例后，Bean的实例就交给了客户端的代码管理，Spring容器将不再跟踪其生命周期，并且不会管理那些被配置成prototype作用域的Bean的生命周期。Spring中Bean的生命周期的执行是一个很复杂的过程，读者可以利用Spring提供的方法来定制Bean的创建过程。Spring容器在保证一个bean实例能够使用之前会做很多工作：

![1](/assets/images/spring/0618/2018110145039276.png)
![2](/assets/images/spring/0618/2018110145059598.png)
