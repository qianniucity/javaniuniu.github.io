---
title: SpringBoot面试题
permalink: /mianshi/SpringBoot/0704
tags: 面试题
key: mianshi-2020-07-04-03
---

#### 1、Spring Boot、Spring MVC 和 Spring 有什么区别？

##### 什么是Spring？它解决了什么问题？

我们说到Spring，一般指代的是Spring Framework，它是一个开源的应用程序框架，提供了一个简易的开发方式，**通过这种开发方式，将避免那些可能致使代码变得繁杂混乱的大量的业务/工具对象，说的更通俗一点就是由框架来帮你管理这些对象，包括它的创建，销毁等**，比如基于Spring的项目里经常能看到的`Bean`，它代表的就是由Spring管辖的对象。

##### 什么是Spring MVC？它解决了什么问题？

Spring MVC是Spring的一部分，Spring 出来以后，大家觉得很好用，于是按照这种模式设计了一个 MVC框架（一些用Spring 解耦的组件），**主要用于开发WEB应用和网络接口，它是Spring的一个模块，通过Dispatcher Servlet, ModelAndView 和 View Resolver，让应用开发变得很容易**

##### 什么是Spring Boot？它解决了什么问题？

初期的Spring通过代码加配置的形式为项目提供了良好的灵活性和扩展性，但随着Spring越来越庞大，其配置文件也越来越繁琐，太多复杂的xml文件也一直是Spring被人诟病的地方，特别是近些年其他简洁的WEB方案层出不穷，如基于Python或Node.Js，几行代码就能实现一个WEB服务器，对比起来，大家渐渐觉得Spring那一套太过繁琐，此时，Spring社区推出了Spring Boot，它的目的在于**实现自动配置，降低项目搭建的复杂度**



#### 2、什么是自动配置？

__Spring Boot：__该框架使用了特定的方式来进行配置，从而使开发人员不再需要定义样板化的配置__。__Spring Boot采用约定大约配置的方式，大量的减少了配置文件的使用

可以通过查看源码的run方法，通过一个简单的run方法，__将引发的是一系列复杂的内部调用和加载过程，从而初始化一个应用所需的配置、环境、资源以及各种自定义的类。在这个阶段，会导入一些列自动配置的类，实现强大的自动配置的功能__

我们可以点开@SpringBootApplicaton 注解， 其中，__@ComponentScan将扫描和加载一些自定义的类__，__@EnableAutoConfiguration将导入一些自动配置的类__

#### 3、我们说的springboot约定大于配置是什么意思呢？

自动配置在加载一个类的时候，会首先去读取项目当中的配置文件，假如没有，就会启用默认值，这就是springboot约定大于配置原理。以Thymeleaf为例：看下下面我们就知道，为什么我们使用Thymeleaf模板引擎，html文件默认放在resources下面的templates文件夹下面，因为这是Thymeleaf的默认配置。



#### 4、什么是 Spring Boot Stater

starter可以理解成pom配置了一堆jar组合的空maven项目，__用来简化maven依赖配置__，starter可以继承也可以依赖于别的starter。

如果我要使用redis，我直接引入redis驱动jar包就行了，何必要引入starter包？__starter和普通jar包的区别在于，它能够实现自动配置，和Spring Boot无缝衔接，从而节省我们大量开发时间。__

#### 5、你能否举一个例子来解释更多 Staters 的内容

比如 我们开发一个web 应用程序或者是公开的 REST 服务的应用程序 Spring Boot Stater Web，是首选，它会加载 ：

Spring - core，beans，context，aop

Web MVC - （Spring MVC）

Jackson - for JSON Binding

Validation - Hibernate,Validation API

Enbedded Servlet Container - Tomcat

Logging - logback,slf4j

而且我不用担心这个些依赖项之间的版本兼容性

#### 6、Spring Boot 还提供了其它的哪些 Starter Project Options

Spring Boot 也提供了其它的启动器项目包括，包括用于开发特定类型应用程序的典型依赖项。

spring-boot-starter-web-services - SOAP Web Services

spring-boot-starter-web - Web 和 RESTful 应用程序

spring-boot-starter-test - 单元测试和集成测试

spring-boot-starter-jdbc - 传统的 JDBC

spring-boot-starter-hateoas - 为服务添加 HATEOAS 功能

spring-boot-starter-security - 使用 SpringSecurity 进行身份验证和授权

spring-boot-starter-data-jpa - 带有 Hibeernate 的 Spring Data JPA

spring-boot-starter-data-rest - 使用 Spring Data REST 公布简单的 REST 服务

#### 7、Spring 是如何快速创建产品就绪应用程序的

__Spring Boot 致力于快速产品就绪应用程序。为此，它提供了一些譬如高速缓存，日志记录，监控和嵌入式服务器等开箱即用的非功能性特征。__

spring-boot-starter-actuator - 使用一些如监控和跟踪应用的高级功能

spring-boot-starter-undertow, spring-boot-starter-jetty, spring-boot-starter-tomcat - 选择您的特定嵌入式 Servlet 容器

spring-boot-starter-logging - 使用 logback 进行日志记录

spring-boot-starter-cache - 启用 Spring Framework 的缓存支持

#### 8、创建一个 Spring Boot Project 的最简单的方法是什么

Spring Initializr是启动 Spring Boot Projects 的一个很好的工具

#### 9、Spring Initializr 是创建 Spring Boot Projects 的唯一方法吗？

Spring Initializr，还有通过maven创建

#### 10、为什么我们需要 spring-boot-maven-plugin?

- spring-boot-maven-plugin 提供了一些像 jar 一样打包或者运行应用程序的命令。

- spring-boot:run 运行你的 SpringBooty 应用程序。
- spring-boot：repackage 重新打包你的 jar 包或者是 war 包使其可执行
- spring-boot：start 和 spring-boot：stop 管理 Spring Boot 应用程序的生命周期（也可以说是为了集成测试）。
- spring-boot:build-info 生成执行器可以使用的构造信息。

#### 11、如何使用 SpringBoot 自动重装我的应用程序？

把下面的依赖项添加至你的 Spring Boot Project pom.xml 中

```
<dependency>
     <groupId>org.springframework.boot</groupId>
     <artifactId>spring-boot-devtools</artifactId>
     <scope>runtime</scope>
</dependency>
```

重启应用程序，然后就可以了。

#### 12、什么是嵌入式服务器？我们为什么要使用嵌入式服务器呢?

思考一下在你的虚拟机上部署应用程序需要些什么。

第一步： 安装 Java

第二部： 安装 Web 或者是应用程序的服务器（Tomat/Wbesphere/Weblogic 等等）

第三部： 部署应用程序 war 包

如果我们想简化这些步骤，应该如何做呢？

让我们来思考如何使服务器成为应用程序的一部分？

> 你只需要一个安装了 Java 的虚拟机，就可以直接在上面部署应用程序了，
> 是不是很爽？

这个想法是嵌入式服务器的起源。

当我们创建一个可以部署的应用程序的时候，我们将会把服务器（例如，tomcat）嵌入到可部署的服务器中。

> 例如，对于一个 Spring Boot 应用程序来说，你可以生成一个包含 Embedded Tomcat 的应用程序 jar。你就可以想运行正常 Java 应用程序一样来运行 web 应用程序了。

嵌入式服务器就是我们的可执行单元包含服务器的二进制文件

#### 13、如何在 Spring Boot 中添加通用的 JS 代码？

在源文件夹下，创建一个名为 static 的文件夹。然后，你可以把你的静态的内容放在这里面。

例如，myapp.js 的路径是 resources\static\js\myapp.js

你可以参考它在 jsp 中的使用方法

<script src="/js/myapp.js"></script>

#### 14、错误：HAL browser gives me unauthorized error - Full authenticaition is required to access this resource.该如何来修复这个错误呢？

```
{
  "timestamp": 1488656019562,
  "status": 401,
  "error": "Unauthorized",
  "message": "Full authentication is required to access this resource.",
  "path": "/beans"
}
```

两种方法：

##### 方法 1：关闭安全验证

application.properties

```
management.security.enabled:FALSE
```

##### 方法二：在日志中搜索密码并传递至请求标头中

#### 15、什么是 Spring Date

```
Spring Data的使命是为数据访问提供熟悉且一致的基于Spring的编程模型，同时仍保留底层数据存储的特​​殊特性。
它使数据访问技术，关系数据库和非关系数据库，map-reduce框架和基于云的数据服务变得简单易用。这是一个伞形项目，其中包含许多特定于给定数据库的子项目。这些项目是通过与这些激动人心的技术背后的许多公司和开发人员合作开发的。
```

__主要模块__
Spring Data主要使用的一些模块，根据需要选择对应的一些功能模块。

- Spring Data common- 支持每个Spring Data模块的Core Spring概念。
- Spring Data JDBC- 对JDBC的Spring Data存储库支持。
- Spring Data JPA - 对JPA的Spring Data存储库支持。
- Spring Data MongoDB - 对MongoDB的基于Spring对象文档的存储库支持。
- Spring Data Redis - 从Spring应用程序轻松配置和访问Redis。
- Spring Data JDBC Ext- 支持标准JDBC的数据库特定扩展，包括对Oracle RAC快速连接故障转移的支持，AQ JMS支持以及对使用高级数据类型的支持。
- Spring Data KeyValue - Map基于库和SPI轻松建立键值存储一个Spring数据模块。
- Spring Data LDAP - 对Spring LDAP的 Spring Data存储库支持。
- Spring Data REST- 将Spring Data存储库导出为超媒体驱动的RESTful资源。
- Spring Data for Pivotal GemFire - 轻松配置和访问Pivotal GemFire，实现高度一致，低延迟/高吞吐量，面向数据的Spring应用程序。
- Spring Data for Apache Cassandra- 轻松配置和访问Apache Cassandra或大规模，高可用性，面向数据的Spring应用程序。
- Spring Data for Apace Geode- 轻松配置和访问Apache Geode，实现高度一致，低延迟，面向数据的Spring应用程序。
- Spring Data for Apache Solr- 为面向搜索的Spring应用程序轻松配置和访问Apache Solr。

#### 16、什么是 Spring Data REST

Spring Data REST是基于Spring Data的repository之上，可以把 repository **自动** 输出为REST资源，目前支持Spring Data JPA、Spring Data MongoDB、Spring Data Neo4j、Spring Data GemFire、Spring Data Cassandra的 repository **自动** 转换成REST服务。

#### 17、当 Spring Boot 应用程序作为 Java 应用程序运行时，后台会发生什么？

当你启动 java 应用程序的时候，spring boot 自动配置文件就会魔法般的启用了。

- 当 Spring Boot 应用程序检测到你正在开发一个 web 应用程序的时候，它就会启动 tomcat。

#### 18、我们能否在 spring-boot-starter-web 中用 jetty 代替 tomcat？

在 spring-boot-starter-web 移除现有的依赖项，并把下面这些添加进去。

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
    <exclusions>
        <exclusion>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-tomcat</artifactId>
        </exclusion>
    </exclusions>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-jetty</artifactId>
</dependency
```

#### 19、如何使用 Spring Boot 生成一个 WAR 文件？

1. <packaging>war</packaging>

2. 在pom.xml中加入build节点,build节点中的finalName可改成项目名称(包名)

3. 在spring-boot-starter-web依赖中移除tomcat模块：

4. 新建启动类：主要是SpringApplicationBuilder configure 方法

   [详情配置](./0704-03)

#### 20、如何使用 Spring Boot 部署到不同的服务器？

- 在一个项目中生成一个 war 文件。
- 将它部署到你最喜欢的服务器（websphere 或者 Weblogic 或者 Tomcat and so on）。

21、RequestMapping 和 GetMapping 的不同之处在哪里？

- RequestMapping 具有类属性的，可以进行 GET,POST,PUT 或者其它的注释中具有的请求方法。
- GetMapping 是 GET 请求方法中的一个特例。它只是 ResquestMapping 的一个延伸，目的是为了提高清晰度

#### 22、为什么我们不建议在实际的应用程序中使用 Spring Data Rest?

我们认为 Spring Data Rest 很适合快速原型制造！在大型应用程序中使用需要谨慎。

通过 Spring Data REST 你可以把你的数据实体作为 RESTful 服务直接发布。

当你设计 RESTful 服务器的时候，最佳实践表明，你的接口应该考虑到两件重要的事情：

- 你的模型范围。
- 你的客户。
- Spring Data Rest 在做复杂数据库查询不适合

通过 With Spring Data REST，你不需要再考虑这两个方面，只需要作为 TEST 服务发布实体。

这就是为什么我们建议使用 Spring Data Rest 在快速原型构造上面，或者作为项目的初始解决方法。对于完整演变项目来说，这并不是一个好的注意。

#### 23、JPA 和 Hibernate 有哪些区别？

- JPA 是一个规范或者接口
- Hibernate 是 JPA 的一个实现
![1](/assets/images/mianshiti/0704/1436045-20180817162031268-1675607816.png)

#### 24、业务边界应该从哪一层开始？

我们建议在服务层管理业务。商业业务逻辑在商业层或者服务层，与此同时，你想要执行的业务管理也在该层。

#### 25、使用 Spring Boot 启动连接到内存数据库 H2 的 JPA 应用程序需要哪些依赖项？

在 Spring Boot 项目中，当你确保下面的依赖项都在类路里面的时候，你可以加载 H2 控制台。

- web 启动器
- h2
- jpa 数据启动器

#### 26、如何不通过任何配置来选择 Hibernate 作为 JPA 的默认实现？

因为 Spring Boot 是自动配置的。

下面是我们添加的依赖项

```
<dependency>
     <groupId>org.springframework.boot</groupId>
     <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
```

spring-boot-stater-data-jpa 对于 Hibernate 和 JPA 有过渡依赖性。

当 Spring Boot 在类路径中检测到 Hibernate 中，将会自动配置它为默认的 JPA 实现

#### 27、指定的数据库连接信息在哪里？它是如何知道自动连接至 H2 的？

这就是 Spring Boot 自动配置的魔力。

来自：https://docs.spring.io/spring-boot/docs/current/reference/html/using-boot-auto-configuration.html

Spring Boot auto-configuration 试图自动配置你已经添加的基于 jar 依赖项的 Spring 应用程序。比如说，如果 HSQLDBis 存在你的类路径中，并且，数据库连接 bean 还没有手动配置，那么我们可以自动配置一个内存数据库。

进一步的阅读：

http://www.springboottutorial.com/spring-boot-auto-configuration

#### 28、我们如何连接一个像 MYSQL 或者 orcale 一样的外部数据库？

让我们以 MySQL 为例来思考这个问题：

##### 第一步 - 把 mysql 连接器的依赖项添加至 pom.xml

```
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
</dependency>
```

##### 第二步 - 从 pom.xml 中移除 H2 的依赖项

或者至少把它作为测试的范围。

```
<!--
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
<scope>test</scope>
</dependency>
-->   
```

##### 第三步 - 安装你的 MySQL 数据库

更多的来看看这里 -https://github.com/in28minutes/jpa-with-hibernate#installing-and-setting-up-mysql

##### 第四步 - 配置你的 MySQL 数据库连接

配置 application.properties

```
spring.jpa.hibernate.ddl-auto=none
spring.datasource.url=jdbc:mysql://localhost:3306/todo_example
spring.datasource.username=todouser
spring.datasource.password=YOUR_PASSWORD   
```

##### 第五步 - 重新启动，你就准备好了！

就是这么简单！

#### 29、Spring Boot 配置的默认 H2 数据库的名字是上面？为什么默认的数据库名字是 testdb？

在 application.properties 里面，列出了所有的默认值

- https://docs.spring.io/spring-boot/docs/current/reference/html/common-application-properties.html

找到下面的属性

```
spring.datasource.name=testdb # Name of the datasource.
```

如果你使用了 H2 内部存储数据库，它里面确定了 Spring Boot 用来安装你的 H2 数据库的名字。

#### 30、你能否举一个以 ReadOnly 为事务管理的例子？

- 当你从数据库读取内容的时候，你想把事物中的用户描述或者是其它描述设置为只读模式，以便于 Hebernate 不需要再次检查实体的变化。这是非常高效的。

[Spring事务管理的两种方式](./0704/03)  
[只读事务（@Transactional(readOnly = true)）的一些概念](./0704/05)

#### 31、发布 Spring Boot 用户应用程序自定义配置的最好方法是什么？

@Value 的问题在于，您可以通过应用程序分配你配置值。更好的操作是采取集中的方法。
你可以使用 @ConfigurationProperties 定义一个配置组件。

```java
@Component
@ConfigurationProperties("basic")
public class BasicConfiguration {
    private boolean value;
    private String message;
    private int number;
```

你可以在 application.properties 中配置参数。

```xml
basic.value: true
basic.message: Dynamic Message
basic.number: 100
```

#### 32、配置文件的需求是什么？

企业应用程序的开发是复杂的，你需要混合的环境：

- Dev
- QA
- Stage
- Production

在每个环境中，你想要不同的应用程序配置。

> 配置文件有助于在不同的环境中进行不同的应用程序配置。

Spring 和 Spring Boot 提供了你可以制定的功能。

- 不同配置文件中，不同环境的配置是什么？
- 为一个制定的环境设置活动的配置文件。

Spring Boot 将会根据特定环境中设置的活动配置文件来选择应用程序的配置

#### 33、如何使用配置文件通过 Spring Boot 配置特定环境的配置？

配置文件不是设别环境的关键。

在下面的例子中，我们将会用到两个配置文件

- dev
- prod

缺省的应用程序配置在 application.properties 中。让我们来看下面的例子：

application.properties

```
basic.value= true
basic.message= Dynamic Message
basic.number= 100
```

我们想要为 dev 文件自定义 application.properties 属性。我们需要创建一个名为 application-dev.properties 的文件，并且重写我们想要自定义的属性。

application-dev.properties

```
basic.message: Dynamic Message in DEV
```

一旦你特定配置了配置文件，你需要在环境中设定一个活动的配置文件。

有多种方法可以做到这一点：

- 在 VM 参数中使用 Dspring.profiles.active=prod
- 在 application.properties 中使用 spring.profiles.active=prod