---
title: 各种 Spring-Boot-Starters系列 介绍
permalink: /mianshi/springboot/0707/01
tags: 面试题
key: mianshi-2020-07-07-01
---

# Spring Boot application starters

| Name                                   | Description                                                  | 备注                                                         |
| -------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| spring-boot-starter-thymeleaf          | 使MVC Web applications 支持Thymeleaf                         | Thymeleaf是一个JAVA库，一个XML/XHTML/HTML5的可扩展的模板引擎，同类事物：Jsp |
| spring-boot-starter-data-couchbase     | 使用Couchbase 文件存储数据库、Spring Data Couchbase          | Spring Data是一个用于简化数据库访问，并支持云服务的开源框架  |
| spring-boot-starter-artemis            | 为JMS messaging使用Apache Artemis                            | JMS是Java消息服务；HornetQ代码库捐献给 Apache ActiveMQ 社区，它现在成为ActiveMQ旗下的一个子项目，名为 “Artemis” |
| spring-boot-starter-web-services       | 使用Spring Web Services                                      | Spring Web Services是基于Spring框架的Web服务框架，主要侧重于基于文档驱动的Web服务，提供SOAP服务开发，允许通过多种方式创建 Web 服务。 |
| spring-boot-starter-mail               | 使用Java Mail、Spring email发送支持                          | Java Mail、Spring email为邮件发送工具                        |
| spring-boot-starter-data-redis         | 通过Spring Data Redis 、Jedis client使用Redis键值存储数据库  | Jedis 是 Redis 官方首选的 Java 客户端开发包                  |
| spring-boot-starter-web                | 构建Web，包含RESTful风格框架SpringMVC和默认的嵌入式容器Tomcat | RESTful是一种软件架构风格，设计风格而不是标准，只是提供了一组设计原则和约束条件 |
| spring-boot-starter-activemq           | 为JMS使用Apache ActiveMQ                                     | ActiveMQ 是Apache出品，最流行的，能力强劲的开源消息总线      |
| spring-boot-starter-data-elasticsearch | 使用Elasticsearch、analytics engine、Spring Data Elasticsearch | ElasticSearch是一个基于Lucene的搜索服务器。它提供了一个分布式多用户能力的全文搜索引擎，基于RESTful web接口 |
| spring-boot-starter-integration        | 使用Spring Integration                                       | Spring Integration是Spring框架创建的一个API，面向企业应用集成（EAI） |
| spring-boot-starter-test               | 测试 Spring Boot applications包含JUnit、 Hamcrest、Mockito   | JUnit、 Hamcrest、Mockito为测试框架                          |
| spring-boot-starter-jdbc               | 通过 Tomcat JDBC 连接池使用JDBC                              |                                                              |
| spring-boot-starter-mobile             | 通过Spring Mobile构建Web应用                                 | Spring Mobile 是 Spring MVC 的扩展,用来简化手机上的Web应用开发 |
| spring-boot-starter-validation         | 通过Hibernate Validator使用 Java Bean Validation             | Bean Validation 是一个数据验证的规范；Hibernate Validator是一个数据验证框架 |
| spring-boot-starter-hateoas            | 使用Spring MVC、Spring HATEOAS构建 hypermedia-based RESTful Web 应用 | hypermedia-based似乎是专业术语，博主表示不会翻译；Spring HATEOAS 是一个用于支持实现超文本驱动的 REST Web 服务的开发库 |
| spring-boot-starter-jersey             | 通过 JAX-RS、Jersey构建 RESTful web applications；spring-boot-starter-web的另一替代方案 | JAX-RS是JAVA EE6 引入的一个新技术；Jersey不仅仅是一个JAX-RS的参考实现，Jersey提供自己的API，其API继承自JAX-RS，提供更多的特性和功能以进一步简化RESTful service和客户端的开发 |
| spring-boot-starter-data-neo4j         | 使用Neo4j图形数据库、Spring Data Neo4j                       | Neo4j是一个高性能的,NOSQL图形数据库，它将结构化数据存储在网络上而不是表中 |
| spring-boot-starter-websocket          | 使用Spring WebSocket构建 WebSocket 应用                      | Websocket是一个持久化的协议，相对于HTTP这种非持久的协议来说  |
| spring-boot-starter-aop                | 通过Spring AOP、AspectJ面向切面编程                          | AspectJ是一个面向切面的框架，它扩展了Java语言                |
| spring-boot-starter-amqp               | 使用Spring AMQP、Rabbit MQ                                   | Spring AMQP 是基于 Spring 框架的 AMQP 消息解决方案,提供模板化的发送和接收消息的抽象层,提供基于消息驱动的 POJO；RabbitMQ是一个在AMQP基础上完整的，可复用的企业消息系统 |
| spring-boot-starter-data-cassandra     | 使用Cassandra分布式数据库、Spring Data Cassandra             | Apache Cassandra是一套开源分布式NoSQL数据库系统              |
| spring-boot-starter-social-facebook    | 使用 Spring Social Facebook                                  | Facebook提供用户使用第三方社交网络的账号API，同类事物：QQ第三方登录接口 |
| spring-boot-starter-jta-atomikos       | 为 JTA 使用 Atomikos                                         | JTA，即Java Transaction API，JTA允许应用程序执行分布式事务处理；Atomikos 是一个为Java平台提供增值服务的并且开源类事务管理 |
| spring-boot-starter-security           | 使用 Spring Security                                         | Spring Security是一个能够为基于Spring的企业应用系统提供声明式的安全访问控制解决方案的安全框架 |
| spring-boot-starter-mustache           | 使MVC Web applications 支持Mustache                          | Mustache是基于JavaScript实现的模版引擎，类似于jQuery Template，但是这个模版更加的轻量级，语法更加的简单易用，很容易上手 |
| spring-boot-starter-data-jpa           | 通过 Hibernate 使用 Spring Data JPA （Spring-data-jpa依赖于Hibernate） | JPA全称Java Persistence API.JPA通过JDK 5.0注解或XML描述对象－关系表的映射关系，并将运行期的实体对象持久化到数据库中 |
| spring-boot-starter                    | Core starter,包括 自动配置支持、 logging and YAML            | logging是指的Starter的专有框架；YAML是“另一种标记语言”的外语缩写，它参考了其他多种语言，包括：XML、C语言、Python、Perl以及电子邮件格式RFC2822 |
| spring-boot-starter-groovy-templates   | 使MVC Web applications 支持Groovy Templates                  | Groovy Templates是模视图模板，同类事物：Jsp                  |
| spring-boot-starter-freemarker         | 使MVC Web applications 支持 FreeMarker                       | FreeMarker是模视图模板，同类事物：Jsp                        |
| spring-boot-starter-batch              | 使用Spring Batch                                             | Spring Batch是一个轻量级的,完全面向Spring的批处理框架,可以应用于企业级大量的数据处理系统 |
| spring-boot-starter-social-linkedin    | 使用Spring Social LinkedIn                                   | LinkedIn提供用户使用第三方社交网络的账号API，同类事物：QQ第三方登录接口 |
| spring-boot-starter-cache              | 使用 Spring caching 支持                                     | Spring caching是Spring的提供的缓存框架                       |
| spring-boot-starter-data-solr          | 通过 Spring Data Solr 使用 Apache Solr                       | Apache Solr 是一个开源的搜索服务器。Solr 使用 Java 语言开发，主要基于 HTTP 和 Apache Lucene 实现 |
| spring-boot-starter-data-mongodb       | 使用 MongoDB 文件存储数据库、Spring Data MongoDB             | Spring Data是一个用于简化数据库访问，并支持云服务的开源框架  |
| spring-boot-starter-jooq               | 使用JOOQ链接SQL数据库；spring-boot-starter-data-jpa、spring-boot-starter-jdbc的另一替代方案 | jOOQ（Java Object Oriented Querying，即面向Java对象查询）是一个高效地合并了复杂SQL、类型安全、源码生成、ActiveRecord、存储过程以及高级数据类型的Java API的类库。 |
| spring-boot-starter-jta-narayana       | Spring Boot Narayana JTA Starter                             | 似乎和jboss.narayana.jta有关                                 |
| spring-boot-starter-cloud-connectors   | 用连接简化的 Spring Cloud 连接器进行云服务就像Cloud Foundry、Heroku那样 | Cloud Foundry是VMware推出的业界第一个开源PaaS云平台；Heroku是一个支持多种编程语言的云平台即服务 |
| spring-boot-starter-jta-bitronix       | 为JTA transactions 使用 Bitronix                             | Bitronix Transaction Manager (BTM) 是一个简单但完整实现了 JTA 1.1 API 的类库，完全支持 XA 事务管理器，提供 JTA API 所需的所有服务，并让代码保持简洁 |
| spring-boot-starter-social-twitter     | 使用 Spring Social Twitter                                   | Twitter提供用户使用第三方社交网络的账号API，同类事物：QQ第三方登录接口 |
| spring-boot-starter-data-rest          | 使用Spring Data REST 以 REST 方式暴露 Spring Data repositories | 博主也不是很明白。原文：exposing Spring Data repositories over REST using Spring Data REST |

# Spring Boot production starters

下列 starters 可用于添加[ production ready](http://docs.spring.io/spring-boot/docs/current-SNAPSHOT/reference/htmlsingle/#production-ready) 功能

| Name                         | Description                                                  | 备注                                      |
| ---------------------------- | ------------------------------------------------------------ | ----------------------------------------- |
| spring-boot-starter-actuator | 使用Spring Boot Actuator 的 production-ready 功能来帮助你监视和管理应用 | production-ready 目前博主不知道该如何翻译 |

# Spring Boot technical starters

最后, Spring Boot 还包括一些 starters ，如果你想剔除或替换某些专门的功能，你可以使用这些 starters :

| Name                         | Description                                                  | 备注                                                         |
| ---------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| spring-boot-starter-undertow | 使用 Undertow 作为嵌入式服务容器；spring-boot-starter-tomcat的另一替代方案 | Undertow是JBoss开源组织旗下一款Web服务器的名称               |
| spring-boot-starter-jetty    | 使用 Jetty 作为嵌入式服务容器；spring-boot-starter-tomcat的另一替代方案 | Jetty 是开源 Java 应用服务器，有篇英语新闻译文称“Webtide —— Jetty背后的公司” |
| spring-boot-starter-logging  | 为 logging 使用Logback.默认 logging starter                  | Logback是由log4j创始人设计的又一个开源日志组件               |
| spring-boot-starter-tomcat   | 使用 Tomcat 作为嵌入式服务容器；作为默认嵌入式服务容器被spring-boot-starter-web使用 |                                                              |
| spring-boot-starter-log4j2   | 使用Log4j2记录日志；spring-boot-starter-logging的另一替代方案 |                                                              |

剔除logging使用log4j栗子：

```xml
 <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
            <exclusions>
            <!-- 剔除logging -->
                <exclusion>
                    <groupId>org.springframework.boot</groupId>
                    <artifactId>spring-boot-starter-logging</artifactId>
                </exclusion>
            </exclusions>
        </dependency>
        <!-- 添加Log4j -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-log4j2</artifactId>
        </dependency>
</dependencies>
```
