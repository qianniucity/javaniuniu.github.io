---
title: SpringBoot面试题（2）
permalink: /mianshi/SpringBoot/0706
tags: 面试题
key: mianshi-2020-07-06-010
---

#### 1、什么是SpringBoot？

spring的开源子项目，简化spring开发难度，是spring的一站式解决方案

springboot解决的问题 

1、使编码变得简单
2、使配置变得简单
3、使部署变得简单
4、使监控变得简单

#### 2、SpringBoot有什么特点？

- 提供了starter POM，能够非常方便的进行包管理
- 项目快速搭建。springboot帮助开发者快速搭建spring框架，可无需配置的自动整合第三方框架
- 可以完全不使用xml配置，只需要自动配置和Java config
- 对主流框架无配置集成

#### 3、SpringBoot的核心注解是哪个？它主要由哪几个注解组成的

@SpringBootApplication下的三个注解

- @SpringBootConfiguration，@EnableAutoConfiguration，@ComponentScan

#### 4、SpringBoot自动配置的原理是什么？

详细看一看注解 @EnableAutoConfiguration 源码

#### 5、什么是YAML？

YAML是一种__数据序列化语言__，通常用于配置文件，例如application.yml。

#### 6、YAML优势在哪里？

（1）配置有序

（2）树形结构，清晰明了

（3）支持数组，数组中的元素可以是基本数据和对象

#### 7、SpringBoot是否可以使用XML配置 ?

Spring Boot推荐使用Java配置，但是同样也可以使用XML配置。

#### 8、spring boot 核心配置文件是什么？bootstrap.peoperties和application.properties有何区别

spring boot核心配置文件是application.properties或者application.yml

- bootstrap (. yml 或者 . properties)：boostrap 由父 ApplicationContext 加载的，比 applicaton 优先加载，配置在应用程序上下文的引导阶段生效。一般来说我们在 Spring Cloud Config 或者 Nacos 中会用到它。且 boostrap 里面的属性不能被覆盖；
- application (. yml 或者 . properties)： 由ApplicatonContext 加载，用于 spring boot 项目的自动化配置。

#### 9、什么是Spring Profiles？

Spring Profiles允许用户根据配置文件（dev，test，prod等）来注册bean。因此，当应用程序在开发中运行时，只有某些bean可以加载，而在PRODUCTION中，某些其他bean可以加载。假设我们的要求是Swagger文档仅适用于QA环境，并且禁用所有其他文档。这可以使用配置文件来完成。Spring Boot使得使用配置文件非常简单	

在实际应用中，给中配置对于不同的环境

#### 10、如何在自定义端口上运行Spring Boot应用程序

在配置文件中配置 port 为自定义端口

#### 11、如何实现Spring Boot应用程序的安全性？

spring可集合 spring security 或者shiro 作为安全组件，集成到程序中

使用 spring-boot-starter-security 依赖项，并且必须添加安全配置。它只需要很少的代码，配置类将必须扩展WebSecurityConfigurerAdapter并覆盖其方法。

#### 12、比较一下Spring Security和Shiro各自的优缺点

由于 Spring Boot 官方提供了大量的非常方便的开箱即用的 Starter ，包括 Spring Security 的 Starter ，使得在 Spring Boot 中使用 Spring Security 变得更加容易，甚至只需要添加一个依赖就可以保护所有的接口，所以，如果是 Spring Boot 项目，一般选择 Spring Security 。当然这只是一个建议的组合，单纯从技术上来说，无论怎么组合，都是没有问题的。Shiro 和 Spring Security 相比，主要有如下一些特点：

1. Spring Security 是一个重量级的安全管理框架；Shiro 则是一个轻量级的安全管理框架
2. Spring Security 概念复杂，配置繁琐；Shiro 概念简单、配置简单
3. Spring Security 功能强大；Shiro 功能简单

#### 13、Spring Boot中如何解决跨域问题 ?

跨域可以在前端通过JSONP来解决，但是JSONP只可以发送GET请求，无法发送其他类型的请求，在 RESTful风格的应用中，就显得非常鸡肋，因此我们推荐在后端通过（CORS，Cross-origin resource sharing） 来解决跨域问题。这种解决方案并非Spring Boot特有的，在传统的SSM框架中，就可以通过 CORS来解决跨域问题，只不过之前我们是在XML文件中配置 CORS ，现在可以通过实现WebMvcConfigurer接口然后重写addCorsMappings方法解决跨域问题。

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("*")
                .allowCredentials(true)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .maxAge(3600);
    }
}
```



项目中前后端分离部署，所以需要解决跨域的问题。我们使用cookie存放用户登录的信息，在spring拦截器进行权限控制，当权限不符合时，直接返回给用户固定的json结果。当用户登录以后，正常使用；当用户退出登录状态时或者token过期时，由于拦截器和跨域的顺序有问题，出现了跨域的现象。我们知道一个http请求，先走filter，到达servlet后才进行拦截器的处理，如果我们把cors放在filter里，就可以优先于权限拦截器执行。

```java
@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.addAllowedOrigin("*");
        corsConfiguration.addAllowedHeader("*");
        corsConfiguration.addAllowedMethod("*");
        corsConfiguration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource urlBasedCorsConfigurationSource = new UrlBasedCorsConfigurationSource();
        urlBasedCorsConfigurationSource.registerCorsConfiguration("/**", corsConfiguration);
        return new CorsFilter(urlBasedCorsConfigurationSource);
    }
}
```

#### 14、什么是CSRF攻击？

跨站请求伪

#### 15、Spring Boot中的监视器是什么？

Spring boot actuator 是 spring 启动框架中的重要功能之一。Spring boot 监视器可帮助您访问生产环境中正在运行的应用程序的当前状态。有几个指标必须在生产环境中进行检查和监控。即使一些外部应用程序可能正在使用这些服务来向相关人员触发警报消息。监视器模块公开了一组可直接作为 HTTP URL 访问的REST 端点来检查状态。

#### 16、如何在Spring Boot中禁用Actuator端点安全性？

默认情况下，所有敏感的 HTTP 端点都是安全的，只有具有 ACTUATOR 角色的用户才能访问它们。__安全性是使用标准的 HttpServletRequest.isUserInRole 方法实施的__。 我们可以使用来禁用安全性。只有在执行机构端点在防火墙后访问时，才建议禁用安全性。

#### 17、我们如何监视所有Spring Boot微服务？

Spring Boot 提供监视器端点以监控各个微服务的度量。这些端点对于获取有关应用程序的信息（如它们是否已启动）以及它们的组件（如数据库等）是否正常运行很有帮助。但是，使用监视器的一个主要缺点或困难是，我们必须单独打开应用程序的知识点以了解其状态或健康状况。__想象一下涉及 50 个应用程序的微服务__，管理员将不得不击中所有 50 个应用程序的执行终端。为了帮助我们处理这种情况，我们将使用位于的开源项目。 它建立在 Spring Boot Actuator 之上，它提供了一个 Web UI，使我们能够可视化多个应用程序的度量

#### 18、什么是WebSockets？

WebSocket是一种__计算机通信协议__，通过单个TCP连接提供全双工通信信道。

1、WebSocket 是双向的 -使用 WebSocket 客户端或服务器可以发起消息发送。

2、WebSocket 是全双工的 -客户端和服务器通信是相互独立的。

3、单个 TCP 连接 -初始连接使用 HTTP，然后将此连接升级到基于套接字的连接。然后这个单一连接用于所有未来的通信。

4、Light -与 http 相比，WebSocket 消息数据交换要轻得多

#### 19、什么是Spring Data ?

Spring Data是Spring的一个子项目，用于__简化数据库访问__，支持NoSQL和关系数据存储，其主要目标是使数据库的访问变得方便快捷。Spring Data具有如下特点：

SpringData项目支持NoSQL存储：

1. MongoDB （文档数据库）
2. Neo4j（图形数据库）
3. Redis（键/值存储）
4. Hbase（列族数据库）

SpringData项目所支持的关系数据存储技术：

1. JDBC
2. JPA

Spring Data Jpa致力于减少数据访问层(DAO)的开发量. 开发者唯一要做的，就是声明持久层的接口，其他都交给Spring Data JPA来帮你完成！Spring Data JPA通过规范方法的名字，根据符合规范的名字来确定方法需要实现什么样的逻辑。

#### 20、什么是Spring Batch？

Spring Boot Batch__提供可重用的函数__，这些函数在处理大量记录时非常重要，包括日志/跟踪，事务管理，作业处理统计信息，作业重新启动，跳过和资源管理。它还提供了更先进的技术服务和功能，__通过优化和分区技术，可以实现极高批量和高性能批处理作业__。简单以及复杂的大批量批处理作业可以高度可扩展的方式利用框架处理重要大量的信息。

#### 21、什么是FreeMarker模板？

FreeMarker是一个__基于Java的模板引擎__，最初专注于使用MVC软件架构进行动态网页生成。使用 Freemarker的__主要优点是表示层和业务层的完全分离__。程序员可以处理应用程序代码，而设计人员可以处理html页面设计。最后使用freemarker可以将这些结合起来，给出最终的输出页面。

#### 22、如何集成Spring Boot和ActiveMQ？

maven配置 ActiveMQ

#### 23、什么是Apache Kafka？

Apache Kafka是一个__分布式发布 - 订阅消息系统__。它是一个__可扩展的，容错的发布 - 订阅消息系统__，它使我们能够构建分布式应用程序。这是一个Apache顶级项目。Kafka适合离线和在线消息消费。

#### 24、什么是 Swagger？你用Spring Boot实现了它吗？

Swagger广泛用于__可视化API__，__使用Swagger UI为前端开发人员提供在线沙箱__。__Swagger是用于生成 RESTful Web服务的可视化表示的工具，规范和完整框架实现。它使文档能够以与服务器相同的速度更新__。当通过Swagger正确定义时，消费者可以使用最少量的实现逻辑来理解远程服务并与其进行交互。因此，Swagger消除了调用服务时的猜测。

#### 25、前后端分离，如何维护接口文档 ?

统一的接口规范，手写

使用第三方框架，自动或者半自动编辑

#### 26、如何重新加载Spring Boot上的更改，而无需重新启动服务，项目如何热部署

spring-detools

#### 27、Spring Boot 中的 starter到底是什么

首先，这个Starter并非什么新的技术点，基本上还是基于Spring已有功能来实现的。首先它__提供了一个自动化配置类，一般命名为XXXAutoConfiguration __，在这个配置类中通过条件注解来决定一个配置是否生效（条件注解就是 Spring 中原本就有的），然后它还会提供一系列的默认配置，也允许开发者根据实际情况自定义相关配置，然后通过类型安全的属性注入将这些配置属性注入进来，新注入的属性会代替掉默认属性。正因为如此，很多第三方框架，我们只需要引入依赖就可以直接使用了。当然，开发者也可以自定义Starter。

#### 28、spring-boot-starter-parent有什么用？

我们都知道，新创建一个 Spring Boot 项目，默认都是有 parent 的，这个 parent 就是 spring-boot-starter-parent ，spring-boot-starter-parent 主要有如下作用：

1、定义了 Java 编译版本为 1.8 。
2、使用 UTF-8 格式编码。
3、继承自 spring-boot-dependencies，这个里边定义了依赖的版本，也正是因为继承了这个依赖，所4、以我们在写依赖时才不需要写版本号。
5、执行打包操作的配置。
6、自动化的资源过滤。
7、自动化的插件配置。
8、针对 application.properties 和 application.yml 的资源过滤，包括通过 profile 定义的不同环境的配 置文件，例如 application-dev.properties 和 application-dev.yml。

#### 29、Spring Boot打成的jar和普通的jar有什么区别

Spring Boot 项目最终打包成的 jar 是可执行 jar ，这种 jar 可以直接通过 java -jar xxx.jar 命令来运行，这种 jar 不可以作为普通的 jar 被其他项目依赖，__即使依赖了也无法使用其中的类__。

Spring Boot 的 jar 无法被其他项目依赖，主要还是他和普通 jar 的结构不同。普通的 jar 包，解压后直接就是包名，包里就是我们的代码，而 Spring Boot 打包成的可执行 jar 解压后，在 \BOOT-INF\classes 目录下才是我们的代码，因此无法被直接引用。__如果非要引用，可以在 pom.xml 文件中增加配置__，将 Spring Boot 项目打包成两个 jar ，一个可执行，一个可引用。

#### 30、运行Spring Boot有哪几种方式？

1）直接运行main文件

2）打包用命令或放到容器中运行

3）用Maven/Gradle插件运行

#### 31、Spring Boot需要独立的容器运行吗？

可以不需要，因为Spring Boot有内嵌服务器tomcat

#### 32、开启Spring Boot特性有哪几种方式？

1）继承spring-boot-starter-parent项目

2）导入spring-boot-dependencies项目依赖

#### 33、如何使用Spring Boot实现异常处理？

Spring提供了一种使用__ControllerAdvice__处理异常的非常有用的方法。我们通过实现一个 ControlerAdvice类，来处理控制器类抛出的所有异常。

#### 34、如何使用 Spring Boot 实现分页和排序

spirng-data-jpa，或者使用第三方插件，自己实现

#### 35、微服务中如何实现session共享

在微服务中，一个完整的项目被拆分成多个不相同的独立的服务，各个服务独立部署在不同的服务器上，各自的session被从物理空间上隔离开了，但是经常，我们需要在不同微服务之间共享session，常见的方案就是Spring Session + Redis来实现session共享。将所有微服务的session统一保存在Redis 上，当各个微服务对session有相关的读写操作时，都去操作Redis上的session 。这样就实现了session 共享，Spring Session基于Spring中的代理过滤器实现，使得session的同步操作对开发人员而言是透明的，非常简便。

#### 36、Spring Boot中如何实现定时任务

定时任务也是一个常见的需求，Spring Boot中对于定时任务的支持主要还是来自Spring框架。在Spring Boot中使用定时任务主要有两种不同的方式，__一个就是使用Spring中的@Scheduled注解__，__另一个则是使用第三方框架Quartz__。

#### 37、SpringBoot的 Actuator 是做什么的？

本质上，Actuator 通过启用 production-ready 功能使得 SpringBoot 应用程序变得更有生命力。这些功能允许我们对生产环境中的应用程序进行监视和管理。

集成 SpringBoot Actuator 到项目中非常简单。我们需要做的只是将 *spring-boot-starter-actuator* starter 引入到 POM.xml 文件当中：

```
1 <dependency>
2     <groupId>org.springframework.boot</groupId>
3     <artifactId>spring-boot-starter-actuator</artifactId>
4 </dependency>
```

SpringBoot Actuaor 可以使用 HTTP 或者 JMX endpoints来浏览操作信息。大多数应用程序都是用 HTTP，作为 endpoint 的标识以及使用 */actuator* 前缀作为 URL路径。

这里有一些常用的内置 endpoints Actuator：

- *auditevents*：查看 audit 事件信息
- *env*：查看 环境变量
- *health*：查看应用程序健康信息
- *httptrace*：展示 HTTP 路径信息
- *info*：展示 *arbitrary* 应用信息
- *metrics*：展示 metrics 信息
- *loggers*：显示并修改应用程序中日志器的配置
- *mappings*：展示所有 *@RequestMapping* 路径信息
- *scheduledtasks*：展示应用程序中的定时任务信息
- *threaddump*：执行 *Thread Dump*

#### 38、怎么编写一个集成测试？

当我们使用 Spring 应用去跑一个集成测试时，我们需要一个 *ApplicationContext*。

为了使我们开发更简单，SpringBoot 为测试提供一个注解 – *@SpringBootTest*。这个注释由其 classes 属性指示的配置类创建一个 *ApplicationContext*。

**如果没有配置 classes 属性，SpringBoot 将会搜索主配置类**。搜索会从包含测试类的包开始直到找到一个使用 *@SpringBootApplication* 或者 *@SpringBootConfiguration* 的类为止。

注意如果使用 JUnit4，我们必须使用 *@RunWith(SpringRunner.class)* 来修饰这个测试类。

#### 38、SpringBoot 支持松绑定代表什么

SpringBoot中的松绑定适用于配置属性的类型安全绑定。使用松绑定，环境属性的键不需要与属性名完全匹配。这样就可以用驼峰式、短横线式、蛇形式或者下划线分割来命名。

例如，在一个有 *@ConfigurationProperties* 声明的 bean 类中带有一个名为 *myProp* 的属性，它可以绑定到以下任何一个参数中，*myProp*、 *my-prop*、*my_prop* 或者 *MY_PROP*。

#### 39、怎么将 SpringBoot web 应用程序部署为 JAR 或 WAR 文件？

通常，我们将 web 应用程序打包成 WAR 文件，然后将它部署到另外的服务器上。这样做使得我们能够在相同的服务器上处理多个项目。当 CPU 和内存有限的情况下，这是一种最好的方法来节省资源。

然而，事情发生了转变。现在的计算机硬件相比起来已经很便宜了，并且现在的注意力大多转移到服务器配置上。部署中对服务器配置的一个细小的失误都会导致无可预料的灾难发生。

Spring 通过提供插件来解决这个问题，也就是 *spring-boot-maven-plugin* 来打包 web 应用程序到一个额外的 JAR 文件当中。为了引入这个插件，只需要在 *pom.xml*中添加一个 *plugin* 属性：

```
<plugin>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-maven-plugin</artifactId>
</plugin>
```

有了这个插件，我们会在执行 *package* 步骤后得到一个 JAR 包。这个 JAR 包包含所需的所有依赖以及一个嵌入的服务器。因此，我们不再需要担心去配置一个额外的服务器了。

我们能够通过运行一个普通的 JAR 包来启动应用程序。

注意一点，为了打包成 JAR 文件，*pom.xml* 中的 *packgaing* 属性必须定义为 *jar*：

```
<packaging>jar</packaging>
```

如果我们不定义这个元素，它的默认值也为 *jar*。

如果我们想构建一个 WAR 文件，将 *packaging* 元素修改为 *war*：

```
<packaging>war</packaging>
```

并且将容器依赖从打包文件中移除：

```
<dependency>
	<groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-tomcat</artifactId>
  <scope>provided</scope>
</dependency>
```

执行 Maven 的 *package* 步骤之后，我们得到一个可部署的 WAR 文件

#### 40、当 bean 存在的时候怎么置后执行自动配置？

为了当 bean 已存在的时候通知自动配置类置后执行，我们可以使用 *@ConditionalOnMissingBean* 注解。这个注解中最值得注意的属性是：

- value：被检查的 beans 的类型
- name：被检查的 beans 的名字

当将 *@Bean* 修饰到方法时，目标类型默认为方法的返回类型：

```java
1 @Configuration
2 public class CustomConfiguration {
3     @Bean
4     @ConditionalOnMissingBean
5     public CustomService service() { ... }
6 }
```