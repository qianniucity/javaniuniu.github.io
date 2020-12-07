---
title: FeignClient详解、配置
permalink: /SpringCloud/feign/configuration
tags: SpringCloud feign
key: SpringCloud-12-07-01
---

#### FeignClient详解

首先查看@FeignClient注解的源码:

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface FeignClient {


	@AliasFor("name")
	String value() default "";

	@Deprecated
	String serviceId() default "";

	@AliasFor("value")
	String name() default "";
	
	String qualifier() default "";
	
	String url() default "";
	
	boolean decode404() default false;
	
	Class<?>[] configuration() default {};
	
	Class<?> fallback() default void.class;
	
	Class<?> fallbackFactory() default void.class;
	
	String path() default "";
	
	boolean primary() default true;

}
1234567891011121314151617181920212223242526272829303132
```

FeignClient注解被@Target(ElementType.TYPE)修饰，标识FeignClient注解的作用目标在接口上。

@Retention(RetentionPolicy.RUNTIME)注解表明该注解会在Class字节码文件中存在，在运行时可以通过反射获取到。

@Documented表示该注解将被包含在Javadoc中。

@FeignClient注解用于创建声明式API接口，该接口是RESTful风格的。Feign被设计成插拔式的，可以注入其他组件和Feign一起使用。最典型的是如果Ribbon可用，Feign会和Ribbon相结合进行负载均衡。

在代码中，value()和name()一样，是被调用的服务的ServiceId。url()直接填写硬编码的Url地址。

decode404()即404是被解码，还是抛异常。

configuration()指明FeignClient的配置类，默认的配置类为`FeignClientsConfiguration`类，在缺省的情况下，这个类注入了默认的Decoder、Encoder和Contract等配置的Bean。

fallback()为配置熔断器的处理类。

#### FeignClient的配置

Feign Client默认的配置类为FeignClientsConfiguration, 这个类在spring-cloud-nettlix-core的jar包下。

打开这个类，可以发现这个类注入了很多Feign相关的配置Bean,包括FeignRetryer、FeignL oggerFactory和FormattingConversionService 等。

另外，Decoder、 Encoder 和Contract这3个类在没有Bean被注入的情况下,会自动注入默认配置的Bean,即ResponseEntityDecoder、SpringEncoder和SpringMvcContract。默认注入的配置如下。

- Decoder feignDecoder：ResponseEntityDecoder
- Decoder feignEncoder：SpringEncoder
- Logger FeignLogger：Slf4jLogger
- Contract feignContract：SpringMvcContract
- Feign.Builder feignBuilder: HystrixFeign.Builder

FeignClientsConfiguration的配置类部分代码如下，@ConditionalOnMissingBean注解表示如果没有注入该类的Bean就会默认注入一个Bean：
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200520211309960.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2NvbGRfX19wbGF5,size_16,color_FFFFFF,t_70)

重写FeignClientsConfiguration类中的Bean,覆盖掉默认的配置Bean,从而达到自定义配置的目的。例如Feign默认的配置在请求失败后，重试次数为0，即不重试(Retryer.NEVERRETRY)。现在希望在请求失败后能够重试，这时需要写一个配置FeignConfig 类，在该类中注入Retryer的Bean,覆盖掉默认的Retryer的Bean,并将FeignConfig指定为FeignClient的配置类。FeignConfig 类的代码如下:
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200520213406680.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2NvbGRfX19wbGF5,size_16,color_FFFFFF,t_70)

在上面的代码中，通过覆盖了默认的Retryer的Bean，更改了该FeignClient的请求失败重试策略，重试间隔为100毫秒，最大重试时间为1秒，重试次数为5次。