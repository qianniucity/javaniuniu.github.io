---
title: Spring Boot自动配置实现原理
permalink: /mianshi/SpringBoot/0704-02
tags: 面试题
key: mianshi-2020-07-04-04
---

我们在使用Spring Boot构建Java Web项目的时候，实现起来非常的简单，那么SpringBoot是如何做到看似简单，却能够实现我们之前使用SSM或者SSH结合复杂配置实现的功能的呢？

我们在看Spring Boot的介绍的时候，常看到下面一段话：Spring Boot 是由 Pivotal 团队提供的全新框架，其__设计目的是用来简化新 Spring 应用的初始搭建以及开发过程__。__该框架使用了特定的方式来进行配置，从而使开发人员不再需要定义样板化的配置__。__Spring Boot采用约定大约配置的方式，大量的减少了配置文件的使用__。那么，Spring Boot是如何做到约定大于配置的呢？

首先我们看一下Spring Boot的主程序功能，也就是Spring Boot官方文档里面写的，你可以直接run

```java
@SpringBootApplication
public class Application {
 
	public static void main(String[] args) {
 
		SpringApplication.run(Application.class, args);
	}
}
```




一个非常简单的run方法的执行，加上@SpringBootApplication的注解，我们看一下run方法的源代码：

```java
public class SpringApplication{
      ......
 
    public ConfigurableApplicationContext run(String... args) {
        //监控任务执行时间
		StopWatch stopWatch = new StopWatch();
		stopWatch.start();
        //创建应用上下文
		ConfigurableApplicationContext context = null;
        //用来记录关于启动的错误报告
		Collection<SpringBootExceptionReporter> exceptionReporters = new ArrayList<>();
		configureHeadlessProperty();
        //可以监听springboot应用启动过程中的一些生命周期事件
		SpringApplicationRunListeners listeners = getRunListeners(args);
		listeners.starting();
		try {
            //程序运行参数
			ApplicationArguments applicationArguments = new DefaultApplicationArguments(
					args);
            //加载相关的配置文件
			ConfigurableEnvironment environment = prepareEnvironment(listeners,
					applicationArguments);
			configureIgnoreBeanInfo(environment);
            //打印Banner,也就是springboot启动后最开始打印的图像
			Banner printedBanner = printBanner(environment);
            //真正的创建应用上下文
			context = createApplicationContext();
			exceptionReporters = getSpringFactoriesInstances(
					SpringBootExceptionReporter.class,
					new Class[] { ConfigurableApplicationContext.class }, context);
			prepareContext(context, environment, listeners, applicationArguments,
					printedBanner);
			refreshContext(context);
			afterRefresh(context, applicationArguments);
			stopWatch.stop();
			if (this.logStartupInfo) {
				new StartupInfoLogger(this.mainApplicationClass)
						.logStarted(getApplicationLog(), stopWatch);
			}
			listeners.started(context);
			callRunners(context, applicationArguments);
		}
		catch (Throwable ex) {
			handleRunFailure(context, ex, exceptionReporters, listeners);
			throw new IllegalStateException(ex);
		}
 
		try {
			listeners.running(context);
		}
		catch (Throwable ex) {
			handleRunFailure(context, ex, exceptionReporters, null);
			throw new IllegalStateException(ex);
		}
		return context;
	}
 
    ......
}

```





在上面这段run方法的源代码当中，有一个context = createApplicationContext();方法

```java
protected ConfigurableApplicationContext createApplicationContext() {
		Class<?> contextClass = this.applicationContextClass;
		if (contextClass == null) {
			try {
				switch (this.webApplicationType) {
				case SERVLET:
                    //假如是servlet应用，默认加载DEFAULT_WEB_CONTEXT_CLASS
					contextClass = Class.forName(DEFAULT_WEB_CONTEXT_CLASS);
					break;
				case REACTIVE:
					contextClass = Class.forName(DEFAULT_REACTIVE_WEB_CONTEXT_CLASS);
					break;
				default:
					contextClass = Class.forName(DEFAULT_CONTEXT_CLASS);
				}
			}
			catch (ClassNotFoundException ex) {
				throw new IllegalStateException(
						"Unable create a default ApplicationContext, "
								+ "please specify an ApplicationContextClass",
						ex);
			}
		}
		return (ConfigurableApplicationContext) BeanUtils.instantiateClass(contextClass);
	}

```



也就是说，__通过一个简单的run方法，将引发的是一系列复杂的内部调用和加载过程，从而初始化一个应用所需的配置、环境、资源以及各种自定义的类。在这个阶段，会导入一些列自动配置的类，实现强大的自动配置的功能__。那么自动配置类是从哪里来的呢？这就需要@SpringBootApplicaton起到作用了。

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@SpringBootConfiguration
@EnableAutoConfiguration
@ComponentScan(excludeFilters = {
		@Filter(type = FilterType.CUSTOM, classes = TypeExcludeFilter.class),
		@Filter(type = FilterType.CUSTOM, classes = AutoConfigurationExcludeFilter.class) })
public @interface SpringBootApplication {
     ......
}
```



其中，__@ComponentScan将扫描和加载一些自定义的类__，__@EnableAutoConfiguration将导入一些自动配置的类__。这些自动配置的类很多，并且他们都处于org.springframework.boot.autoconfigure这个包下面。这些配置类都会被导入并处于备用状态。假如你在maven文件当中引入了相关的包的时候，相关功能将被启用。



那么，我们说的springboot约定大于配置是什么意思呢？自动配置在加载一个类的时候，会首先去读取项目当中的配置文件，假如没有，就会启用默认值，这就是springboot约定大于配置原理。以Thymeleaf为例：看下下面我们就知道，为什么我们使用Thymeleaf模板引擎，html文件默认放在resources下面的templates文件夹下面，因为这是Thymeleaf的默认配置。

@ConfigurationProperties(prefix = "spring.thymeleaf")
public class ThymeleafProperties {

```java
@ConfigurationProperties(prefix = "spring.thymeleaf")
public class ThymeleafProperties {
 
	private static final Charset DEFAULT_ENCODING = StandardCharsets.UTF_8;
 
	public static final String DEFAULT_PREFIX = "classpath:/templates/";
 
	public static final String DEFAULT_SUFFIX = ".html";
 
	private boolean checkTemplate = true;
 
	private boolean checkTemplateLocation = true;
 
	private String prefix = DEFAULT_PREFIX;
 
	private String suffix = DEFAULT_SUFFIX;
 
	private String mode = "HTML";
 
	private Charset encoding = DEFAULT_ENCODING;
 
	private boolean cache = true;
 
    ......
}

```
}
并且这些约定的配置一般都以Properties为结尾，比如

org.springframework.boot.autoconfigure.jdbc.DataSourceProperties（数据库连接配置）

org.springframework.boot.autoconfigure.data.redis.RedisProperties（Redis连接配置）

org.springframework.boot.autoconfigure.amqp.RabbitProperties（RabbitMQ连接配置）

org.springframework.boot.autoconfigure.web.ResourceProperties（Web资源配置）

org.springframework.boot.autoconfigure.kafka.KafkaProperties（Kafka连接配置）

org.springframework.boot.autoconfigure.cache.CacheProperties（缓存配置）

那么，我们知道程序会自动装配加载很多类，但是我们假如不想程序去加载某些类（毕竟加载需要耗时），我们如何去自定义我们想加载的配置类呢？

我们只需要把@SpringBootApplication注解去掉，换成@Congfiguation注解，并通过@Import注解去指定需要加载的配置类就可以了（非常不建议这么做，因为我们可能不是特别了解所有自动加载的类的特性）。

```java
@Configuration
@Import({
		DispatcherServletAutoConfiguration.class,
		HttpEncodingAutoConfiguration.class,
		ThymeleafAutoConfiguration.class,
		WebMvcAutoConfiguration.class,
		WebSocketServletAutoConfiguration.class,
		MultipartAutoConfiguration.class
		//继续加载你需要的配置
})
public class Application {
 
	public static void main(String[] args) {
 
		SpringApplication.run(Application.class, args);
	}
}

```



