---
title: 注解中@Component和@Bean的区别
permalink: /Annotation/ComponentAndBean
tags: 注解
pageview: true
show_date: true
sidebar:
  nav: docs-en-code
---
**两者的目的是一样的，都是注册bean到Spring容器中**     
1、@Component注解表明一个类会作为组件类，并告知Spring要为这个类创建bean。   
2、@Bean注解告诉Spring这个方法将会返回一个对象，这个对象要注册为Spring应用上下文中的bean。通常方法体中包含了最终产生bean实例的逻辑。

**区别：**   
1、@Component（@Controller、@Service、@Repository）通常是通过类路径扫描来自动侦测以及自动装配到Spring容器中。      
2、而@Bean注解通常是我们在标有该注解的方法中定义产生这个bean的逻辑。     
3、@Component 作用于类，@Bean作用于方法

**Spring帮助我们管理Bean分为两个部分**
- 一个是注册Bean(@Component , @Repository , @ Controller , @Service , @Configration)，
- 一个装配Bean(@Autowired , @Resource，可以通过byTYPE（@Autowired）、byNAME（@Resource）的方式获取Bean)。
完成这两个动作有三种方式，一种是使用自动配置的方式、一种是使用JavaConfig的方式，一种就是使用XML配置的方式。

@Compent 作用就相当于 XML配置
```java
@Component
public class Student {

    private String name = "lkm";

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
```

@Bean 需要在配置类中使用，即类上需要加上@Configuration注解
```java

@Configuration
public class WebSocketConfig {
    @Bean
    public Student student(){
        return new Student();
    }

}
```
两者都可以通过@Autowired装配
```java
@Autowired
Student student;
```
**那为什么有了@Compent,还需要@Bean呢？**     
如果你想要将第三方库中的组件装配到你的应用中，在这种情况下，是没有办法在它的类上添加@Component注解的，因此就不能使用自动化装配的方案了，但是我们可以使用@Bean,当然也可以使用XML配置。
