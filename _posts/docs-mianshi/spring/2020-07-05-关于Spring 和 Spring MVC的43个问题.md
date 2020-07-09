---
title: 关于Spring 和 Spring MVC的43个问题
permalink: /mianshi/spring/0705/10
tags: 面试题
key: mianshi-2020-07-05-010
---

#### 1、为什么使用spring？

1. 社区活跃，使用的企业多
2. 很多第三方框架集成了spring
3. 提供了Ioc容器，对象间的依赖关系由spring进行控制，避免了硬代码之间的耦合
4. 提供AOP编程的支持，通过spring的AOP功能，避免了业务之间的耦合

#### 2、什么是IoC，为什使用IoC ?

__控制什么？为什么要控制？__ 把创建对象的权限托管给了spring统一管理，控制对象之间的依赖关系，避免硬编码之间的耦合

__什么是反转？怎么反转：__ 如果把自己主动new的对象称为正转，那么通过spring创建的的对象称为反转，spring创建对象的方式使用了反转和代理的机制

#### 3、什么是AOP，为什么使用AOP ?

AOP（面向切面编程）是一种编程思想，其主要思想是让开发者把诸多业务流程中的通用功能抽取出来，单独编写功能代码，形成独立的模块，这些模块也被称为切面。AOP在spring中是的核心模块，并提供了编程模范。降低了因不同业务之间的依赖造成的耦合度。

#### 4、什么是Spring的事务管理

作为企业级的开发框架，spring在不同的事务api上定义了一个抽象层，而开发人员不必了解底底层是事务api，就可以使用spring的事务管理器

Spring既支持编程式事务管理(也称编码式事务)，也支持声明式的事务管理

**编程式事务管理**：将事务管理代码嵌入到业务方法中来控制事务的提交和回滚，在编程式事务中，必须在每个业务操作中包含额外的事务管理代码

**声明式事务管理**：大多数情况下比编程式事务管理更好用。它将事务管理代码从业务方法中分离出来，以声明的方式来实现事务管理。事务管理作为一种横切关注点，可以通过AOP方法模块化。Spring通过Spring AOP框架支持声明式事务管理。

#### 5、Spring框架支持以下五种bean的作用域?

__单例：__ 默认值，bean在每个spring ioc 容器中只有一个对象

__多例：__ 一个bean的定义可以有多个实例

__request：__ 针对每一次Http请求，Spring容器根据该bean的定义创建一个全新的实例，且该实例仅在当前Http请求内有效，而其它请求无法看到当前请求中状态的变化，当当前Http请求结束，该bean实例也将会被销毁。

__seession：__ 在一次Http Session中，容器会返回该Bean的同一实例。而对不同的Session请求则会创建新的实例，该bean实例仅在当前Session内有效

__global session：__ 在一个全局的Http Session中，容器会返回该Bean的同一个实例，仅在使用portlet context时有效。

#### 6、什么是Spring的MVC框架？

- springmvc 是基于mvc的web框架，
- spring mvc是spring框架的一个模块，springmvc和spring无需通过中间整合层进行整合。
- 将web层进行职责解耦

- 它允许以声明的方式把请求参数和业务对象绑定。

##### 以下组件通常使用框架提供实现：

__DispatcherServlet：__ 作为前端控制器，整个流程控制的中心，控制其它组件执行，统一调度，降低组件之间的耦合性，提高每个组件的扩展性。

__HandlerMapping：__ 通过扩展处理器映射器实现不同的映射方式，例如：配置文件方式，实现接口方式，注解方式等。

__HandlAdapter：__ 通过扩展处理器适配器，支持更多类型的处理器。

__ViewResolver：__ 通过扩展视图解析器，支持更多类型的视图解析，例如：jsp、freemarker、pdf、excel等。

#### 7、如何启用注解?

    <context:annotation-config/>
    如果使用<context:component-scan base-package="com.tgb.web.controller.annotation"> </context:component-scan>  则上面内容可以省略

#### 8、Spring MVC的请求流程?

![img](/assets/images/mianshiti/0705/249993-20170207140151791-1932120070.png)

**看到这个图大家可能会有很多的疑惑，现在我们来看一下这个图的步骤：（可以对比MVC的原理图进行理解）**

第一步:用户发起请求到前端控制器（DispatcherServlet）

第二步：前端控制器请求处理器映射器（HandlerMappering）去查找处理器（Handle）：通过xml配置或者注解进行查找

第三步：找到以后处理器映射器（HandlerMappering）像前端控制器返回执行链（HandlerExecutionChain）

第四步：前端控制器（DispatcherServlet）调用处理器适配器（HandlerAdapter）去执行处理器（Handler）

第五步：处理器适配器去执行Handler

第六步：Handler执行完给处理器适配器返回ModelAndView

第七步：处理器适配器向前端控制器返回ModelAndView

第八步：前端控制器请求视图解析器（ViewResolver）去进行视图解析

第九步：视图解析器像前端控制器返回View

第十步：前端控制器对视图进行渲染

第十一步：前端控制器向用户响应结果

#### 9、web.xml的配置

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_3_1.xsd"
         version="3.1">
    <!--添加过滤器-->
    <filter>
        <filter-name>characterEncodingFilter</filter-name>
        <filter-class>org.springframework.web.filter.CharacterEncodingFilter</filter-class>
        <init-param>
            <param-name>encoding</param-name>
            <param-value>UTF-8</param-value>
        </init-param>
        <init-param>
            <param-name>forceEncoding</param-name>
            <param-value>true</param-value>
        </init-param>
    </filter>
    <filter-mapping>
        <filter-name>characterEncodingFilter</filter-name>
        <url-pattern>/*</url-pattern>
    </filter-mapping>
    <!--配置spring-->
    <servlet>
        <servlet-name>dispatcherServlet</servlet-name>
        <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
        <init-param>
            <param-name>contextConfigLocation</param-name>
            <param-value>classpath:spring-config.xml</param-value>
        </init-param>
    </servlet>
    <servlet-mapping>
        <servlet-name>dispatcherServlet</servlet-name>
        <url-pattern>/</url-pattern>
    </servlet-mapping>
    <!--自定义首页-->
  <!--  <welcome-file-list>
        <welcome-file>/first/page</welcome-file>
    </welcome-file-list>-->
    <!--配置404错误页面-->
    <error-page>
        <error-code>404</error-code>
        <location>/error_pages/404.jsp</location>
    </error-page>
    <!--配置500错误提示-->
    <error-page>
        <error-code>500</error-code>
        <location>/error_pages/500.jsp</location>
    </error-page>


    <!--读取静态文件-->
    <servlet-mapping>
        <servlet-name>default</servlet-name>
        <url-pattern>*.js</url-pattern>
        <url-pattern>*.css</url-pattern>
        <url-pattern>*.woff</url-pattern>
        <url-pattern>*.woff2</url-pattern>
        <url-pattern>*.ttf</url-pattern>
        <url-pattern>*.png</url-pattern>
        <url-pattern>*.jpg</url-pattern>
        <url-pattern>*.ogg</url-pattern>
        <url-pattern>*.mp4</url-pattern>
    </servlet-mapping>


</web-app>
```

#### 10、注解的处理器映射器和适配器?

spring3.1之后使用org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping注解映射器。

在spring3.1之后使用org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter注解适配器。

使用 mvc:annotation-driven代替上边注解映射器和注解适配器配置

#### 11、spring 与 mybatis整合过程?

##### 第一步：整合dao层

   mybatis和spring整合，通过spring管理mapper接口。

   使用mapper的扫描器自动扫描mapper接口在spring中进行注册。

##### 第二步：整合service层

   通过spring管理 service接口。

   使用配置方式将service接口配置在spring配置文件中。

   实现事务控制。

##### 第三步：整合springmvc

   由于springmvc是spring的模块，不需要整合

##### 主要配置有：

      1). mybatis配置文件sqlMapConfig.xml配置别名自动扫描(实体类)

      2). mapper扫描器(接口，数据库访问接口)

      3). 数据库连接池配置

      4). 声明式事务配置

      5). 启用注解扫描：<context:component-scan base-package="cn.itcast.ssm.controller"></context:component-scan>

      6). 配置注解映射器和适配器： <mvc:annotation-driven></mvc:annotation-driven>

      7). 视图解析器：<bean  class="org.springframework.web.servlet.view.InternalResourceViewResolver">

      8). 配置控制类： DispatcherServlet前端控制器

      9). 配置spring配置文件加载类：ClassLoadListener

#### 12、视图解析器配置前缀和后缀?

```xml
<bean class="org.springframework.web.servlet.view.InternalResourceViewResolver" >
    <!--前缀-->
    <property name="prefix" value="/WEB-INF/jsp/"/>
    <!--后缀-->
    <property name="suffix" value=".jsp"/>
</bean>

```

#### 13、sqlMapConfig.xml，mybatis自己的配置文件?

```xml
<properties resource="db.properties"/>
	<environments default="development">
		<environment id="development">
			<transactionManager type="JDBC"/>
			<dataSource type="POOLED">
				<property name="driver" value="${jdbc.driver}"/>
				<property name="url" value="${jdbc.url}"/>
				<property name="username" value="${jdbc.username}"/>
				<property name="password" value="${jdbc.password}"/>
			</dataSource>
		</environment>
	</environments>

```

#### 14、spring自带的数据源

- ###### spring自带的数据源

- ###### DBCP数据源

- ###### C3P0数据源

- ###### JNDI数据源

#### 15、事务控制(applicationContext-transaction.xml)?

在applicationContext-transaction.xml中使用spring声明式事务控制方法。

#### 16、加载spring配置?

-  ClassPathXmlApplication的使用方法//

-  FileSystemXmlApplicationContext的使用方法

#### 17、静态资源访问不被拦截?

```xml
<resources mapping="/resources/**" location="/resources/" />
      <resources mapping="/images/**" location="/images/" />
      <resources mapping="/js/**" location="/js/" />
```

#### 18、@RequestMapping的作用?

__url映射：__ 在方法上田间

__限制http请求方法：__ 该注解的配置属性

__窄化请求映射：__ 在类上添加

#### 19、controller方法的返回值?

##### 1 返回ModelAndView

    需要方法结束时，定义ModelAndView，将model和view分别进行设置。

##### 2 返回string

     如果controller方法返回string，

     1). 表示返回逻辑视图名。真正视图(jsp路径)=前缀+逻辑视图名+后缀

     2). redirect重定向：返回字符串格式为："redirect:queryItem.action"

     3). forward页面转发：返回字符串格式为：“forward:queryItem.action”

##### 3 返回void

      在controller方法形参上可以定义request和response，使用request或 response指定响应结果：

     1). 使用request转向页面，如下：request.getRequestDispatcher("页面路径").forward(request, response);

     2). 也可以通过response页面重定向：response.sendRedirect("url")

     3). 也可以通过response指定响应结果，例如响应json数据如下：

           response.setCharacterEncoding("utf-8");

           response.setContentType("application/json;charset=utf-8");

           response.getWriter().write("json串");

#### 20、参数绑定

##### 1 默认支持的类型

直接在controller方法形参上定义下边类型的对象，就可以使用这些对象。在参数绑定过程中，如果遇到下边类型直接进行绑定。

1). HttpServletRequest：通过request对象获取请求信息

2). HttpServletResponse：通过response处理响应信息

3). HttpSession：通过session对象得到session中存放的对象

4). Model/ModelMap：model是一个接口，modelMap是一个接口实现 。作用：将model数据填充到request域。

##### 2 简单类型

通过@RequestParam对简单类型的参数进行绑定。

如果不使用@RequestParam，要求request传入参数名称和controller方法的形参名称一致，方可绑定成功。

如果使用@RequestParam，不用限制request传入参数名称和controller方法的形参名称一致。

通过required属性指定参数是否必须要传入，如果设置为true，没有传入参数，会报错。

##### 4 自定义参数绑定实现日期类型绑定

对于controller形参中pojo对象，如果属性中有日期类型，需要自定义参数绑定。将请求日期数据串转成 日期类型，要转换的日期类型和pojo中日期属性的类型保持一致。

#### 21、Spring MVC 和 Struts2 对比?

1). Struts2是类级别的拦截， 一个类对应一个request上下文，SpringMVC是方法级别的拦截，一个方法对应一个request上下文，而方法同时又跟一个url对应，所以说从架构本身上SpringMVC 就容易实现restful url

2). 由上边原因，SpringMVC的方法之间基本上独立的，独享request response数据，请求数据通过参数获取，处理结果通过ModelMap交回给框架，方法之间不共享变量，而Struts2搞的就比较乱，虽然方法之间也是独立的，但其所有Action变量是共享的，这不会影响程序运行，却给我们编码 读程序时带来麻烦，每次来了请求就创建一个Action，一个Action对象对应一个request上下文。

3). 由于Struts2需要针对每个request进行封装，把request，session等servlet生命周期的变量封装成一个一个Map，供给每个Action使用，并保证线程安全，所以在原则上，是比较耗费内存的。

4). SpringMVC集成了Ajax，使用非常方便，只需一个注解@ResponseBody就可以实现，然后直接返回响应文本即可，而Struts2拦截器集成了Ajax，在Action中处理时一般必须安装插件或者自己写代码集成进去，使用起来也相对不方便。

5). springmvc面向方法开发的（更接近service接口的开发方式），struts2面向类开发。

6). springmvc可以单例开发，struts2只能是多例开发

#### 22、乱码处理?

##### 1). post乱码

在web.xml添加post乱码filter：CharacterEncodingFilter

##### 2). 对于get请求中文参数出现乱码解决方法有两个：

###### a. 修改tomcat配置文件添加编码与工程编码一致，如下：

```xml
<Connector URIEncoding="utf-8" connectionTimeout="20000" port="8080" protocol="HTTP/1.1" redirectPort="8443"/>
```

###### b. 对参数进行重新编码：


```java
String userName = new String(request.getParamter("userName").getBytes("ISO8859-1"),"utf-8");
```


ISO8859-1是tomcat默认编码，需要将tomcat编码后的内容按utf-8编码


#### 23、集合类型绑定

##### 1). 数组绑定：

    controller方法参数使用：(Integer[] itemId)
    页面统一使用:itemId 作为name

##### 2). list绑定：

     pojo属性名为：itemsList
     页面：itemsList[index].属性名

##### 3). map 绑定：

     pojo属性名为：Map<String, Object> itemInfo = new HashMap<String, Object>();
     页面： <td>姓名：<inputtype="text"name="itemInfo['name']"/>

#### 24、spring 校验 ?

1). 项目中，通常使用较多是前端的校验，比如页面中js校验。对于安全要求较高点建议在服务端进行校验。

2). springmvc使用hibernate的校验框架validation(和hibernate没有任何关系)。

校验思路：页面提交请求的参数，请求到controller方法中，使用validation进行校验。如果校验出错，将错误信息展示到页面

#### 25、数据回显?

1). @ModelAttribute还可以将方法的返回值传到页面：在方法上加注解@ModelAttribute

2). 使用最简单方法使用model，可以不用@ModelAttribute：model.addAttribute("id", id);

3). springmvc默认对pojo数据进行回显。pojo数据传入controller方法后，springmvc自动将pojo数据放到request域，key等于pojo类型（首字母小写）

4). public String testParam(PrintWriter out, @RequestParam("username") String username) { //out直接输出

#### 26、异常处理?

springmvc提供全局异常处理器（一个系统只有一个异常处理器）进行统一异常处理。

   系统遇到异常，在程序中手动抛出，dao抛给service、service给controller、controller抛给前端控制器，前端控制器调用全局异常处理器。

Spring 统一异常处理有 3 种方式，分别为：

1. 使用 @ ExceptionHandler 注解
2. 实现 HandlerExceptionResolver 接口
3. 使用 @controlleradvice 注解

#### 27、上传图片？

1). 在页面form中提交enctype="multipart/form-data"的数据时，需要springmvc对multipart类型的数据进行解析。

2). 在springmvc.xml中配置multipart类型解析器。

3). 方法中使用：MultipartFile attach (单个文件上传) 或者  MultipartFile[] attachs (多个文件上传)

#### 28、Json处理

1). 加载json转换的jar包：springmvc中使用jackson的包进行json转换（@requestBody和@responseBody使用下边的包进行json转）

2). 配置json转换器。在注解适配器RequestMappingHandlerAdapter中加入messageConverters。如果使用<mvc:annotation-driven /> 则会自动加入。

3). ajax

4). Controller (ResponseBody、RequestBody)

5). 注意ajax中contentType如果不设置为json类型，则传的参数为key/value类型。上面设置后，传的是json类型。

#### 29、拦截器?

##### 1). 定义拦截器，实现HandlerInterceptor接口。接口中提供三个方法。

a. preHandle ：进入 Handler方法之前执行，用于身份认证、身份授权，比如身份认证，如果认证不通过表示当前用户没有登陆，需要此方法拦截不再向下执行

b. postHandle：进入Handler方法之后，返回modelAndView之前执行，应用场景从modelAndView出发：将公用的模型数据(比如菜单导航)在这里传到视图，也可以在这里统一指定视图

c. afterCompletion：执行Handler完成执行此方法，应用场景：统一异常处理，统一日志处理

##### 2). 拦截器配置：

a. 针对HandlerMapping配置(不推荐)：springmvc拦截器针对HandlerMapping进行拦截设置，如果在某个HandlerMapping中配置拦截，经过该 HandlerMapping映射成功的handler最终使用该 拦截器。  (一般不推荐使用)

b. 类似全局的拦截器：springmvc配置类似全局的拦截器，springmvc框架将配置的类似全局的拦截器注入到每个HandlerMapping中

#### 30、spring中自动装配的方式有哪些？

1、No：即不启用自动装配。

2、byName：通过属性的名字的方式查找JavaBean依赖的对象并为其注入。比如说类Computer有个属性printer，指定其autowire属性为byName后，Spring IoC容器会在配置文件中查找id/name属性为printer的bean，然后使用Seter方法为其注入。

3、byType：通过属性的类型查找JavaBean依赖的对象并为其注入。比如类Computer有个属性printer，类型为Printer，那么，指定其autowire属性为byType后，Spring IoC容器会查找Class属性为Printer的bean，使用Seter方法为其注入。

4、constructor：通byType一样，也是通过类型查找依赖对象。与byType的区别在于它不是使用Seter方法注入，而是使用构造子注入。

5、autodetect：在byType和constructor之间自动的选择注入方式。

6、default：由上级标签<beans>的default-autowire属性确定。

#### 31、Spring中AOP的应用场景、Aop原理、好处？

AOP--Aspect Oriented Programming面向切面编程；用来封装横切关注点，具体可以在下面的场景中使用:

Authentication 权限、Caching 缓存、Context passing 内容传递、Error handling 错误处理Lazy loading懒加载、Debugging调试、logging, tracing, profiling and monitoring 记录跟踪优化　校准、Performance optimization　性能优化、Persistence 持久化、Resource pooling　资源池、Synchronization　同步、Transactions 事务。

**原理：** AOP是面向切面编程，是通过__动态代理__的方式为程序添加统一功能，集中解决一些公共问题。

**优点：** 1.各个步骤之间的良好隔离性耦合性大大降低 	
      2.源代码无关性，再扩展功能的同时不对源码进行修改操作

#### 32、Spring中IOC的作用与原理？对象创建的过程？

IOC理论提出的观点大体是这样的：借助于“第三方”实现具有依赖关系的对象之间的解耦

__对象创建的过程：__

1. 读取resources文件下spring_ioc.xml
2. Xml解析spring_ioc.xml
3. 把解析xml里的内容存储到内存的map集合中
4. 从map集合中读取集合内容，就是<Bean></Bean>清单里的内容
5. 遍历集合中的所有数据，并反射实例化对象

Class.forName(“com.spring.ioc.Hello”).newInstance()

#### 33、Spring常见创建对象的注解？

@Component@Controller@ Service@ Repository

#### 34、Spring中用到的设计模式？

- 单例模式 bean默认单例
- 工厂模式 beanFactory ApplicationContext
- 代理模式 springAOP
- 模版模式 jdbcTemplate
- 观察者模式  Spring 事件驱动模型就是观察者模式很经典的一个应用。
- 适配器模式 Spring AOP 的增强或通知(Advice)使用到了适配器模式、spring MVC 中也是用到了适配器模式适配`Controller`

#### 35、Spring的优点？

1.  __降低了组件之间的耦合性__ ，实现了软件各层之间的解耦
2. 可以使用容易 __提供的众多服务__，如事务管理，消息服务等
3. 容器提供 __单例模式__ 支持
4. 容器提供了 __AOP技术__，利用它很容易实现如权限拦截，运行期监控等功能
5. 容器提供了 __众多的辅助类__ ，能加快应用的开发
6. spring对于 __主流的应用框架提供了集成支持__ ，如hibernate，JPA，Struts等
7. spring属于低 __侵入式设计__ ，代码的污染极低
8. 独立于各种应用服务器
9. spring的DI机制降低了业务对象替换的复杂性

#### 36、Spring Bean的作用域之间有什么区别？

Spring容器中的bean可以分为5个范围。所有范围的名称都是自说明的，但是为了避免混淆，还是让我们来解释一下：

singleton：这种bean范围是默认的，这种范围确保不管接受到多少个请求，每个容器中只有一个bean的实例，单例的模式由bean factory自身来维护。

prototype：原形范围与单例范围相反，为每一个bean请求提供一个实例。

request：在请求bean范围内会每一个来自客户端的网络请求创建一个实例，在请求完成以后，bean会失效并被垃圾回收器回收。

Session：与请求范围类似，确保每个session中有一个bean的实例，在session过期后，bean会随之失效。

global-session：global-session和Portlet应用相关。当你的应用部署在Portlet容器中工作时，它包含很多portlet。如果你想要声明让所有的portlet共用全局的存储变量的话，那么这全局变量需要存储在global-session中。

全局作用域与Servlet中的session作用域效果相同。

#### 37、Spring管理事务有几种方式？

有两种方式：

1、编程式事务，在代码中硬编码。(不推荐使用)

2、声明式事务，在配置文件中配置（推荐使用）

声明式事务又分为两种：

a、基于XML的声明式事务

b、基于注解的声明式事务

#### 38、spring中的核心类有那些，各有什么作用？

BeanFactory：产生一个新的实例，可以实现单例模式

BeanWrapper：提供统一的get及set方法

ApplicationContext:提供框架的实现，包括BeanFactory的所有功能

#### 39、Bean的调用方式有哪些？

有三种方式可以得到Bean并进行调用：
1、使用BeanWrapper
```java
HelloWorld hw=new HelloWorld();
BeanWrapper bw=new BeanWrapperImpl(hw);
bw.setPropertyvalue(”msg”,”HelloWorld”);
system.out.println(bw.getPropertyCalue(”msg”));
```
2、使用BeanFactory
```java
InputStream is=new FileInputStream(”config.xml”);
XmlBeanFactory factory=new XmlBeanFactory(is);
HelloWorld hw=(HelloWorld) factory.getBean(”HelloWorld”);
system.out.println(hw.getMsg());
```
3、使用ApplicationConttext
```java
ApplicationContext actx=new FleSystemXmlApplicationContext(”config.xml”);
HelloWorld hw=(HelloWorld) actx.getBean(”HelloWorld”);
System.out.println(hw.getMsg());
```

#### 40、什么是IOC，什么又是DI，他们有什么区别？

依赖注入DI是一个程序设计模式和架构模型， 一些时候也称作控制反转，尽管在技术上来讲，依赖注入是一个IOC的特殊实现，依赖注入是指一个对象应用另外一个对象来提供一个特殊的能力，例如：把一个 数据库连接 以参数的形式传到另一个对象的结构方法里面 而不是在那个对象内部自行创建一个连接。控制反转和依赖注入的基本思想就是把类的依赖从类内部转化到外 部以减少依赖

应用控制反转，对象在被创建的时候，将实体依赖对象的引用传递给调控系统。也可以说，依赖被注入到对象中。所以，控制反转是，关于一个对象如何获取他所依赖的对象的引用，这个责任的反转

#### 41、spring有两种代理方式？

若目标对象实现了若干接口，spring使用JDK的java.lang.reflect.Proxy类代理。  

    优点：因为有接口，所以使系统更加松耦合
    缺点：为每一个目标类创建接口

若目标对象没有实现任何接口，spring使用CGLIB库生成目标对象的子类。  

    优点：因为代理类与目标类是继承关系，所以不需要有接口的存在。  
    缺点：因为没有使用接口，所以系统的耦合性没有使用JDK的动态代理好。  
#### 42、springMVC的流程？

请求->dispaterServlet->映射处理器->适配器->handle->modelView->view

#### 43、Springmvc的优点？

__Spring MVC__ 是一个基于Java的实现了MVC设计模式的请求驱动类型的轻量级Web框架，通过把Model，View，Controller分离，将web层进行职责解耦，把复杂的web应用分成逻辑清晰的几部分，简化开发，减少出错，方便组内开发人员之间的配合。

##### Springmvc的优点:

（1）可以支持各种视图技术,而不仅仅局限于JSP；

（2）与Spring框架集成（如IoC容器、AOP等）；

（3）清晰的角色分配：前端控制器(dispatcherServlet) , 请求到处理器映射（handlerMapping), 处理器适配器（HandlerAdapter), 视图解析器（ViewResolver）。

（4） 支持各种请求资源的映射策略



#### 44、过滤器和拦截器的区别：

　　①拦截器是基于java的反射机制的，而过滤器是基于函数回调。  
　　②拦截器不依赖与servlet容器，过滤器依赖与servlet容器。  
　　③拦截器只能对action请求起作用，而过滤器则可以对几乎所有的请求起作用。  
　　④拦截器可以访问action上下文、值栈里的对象，而过滤器不能访问。  
　　⑤在action的生命周期中，拦截器可以多次被调用，而过滤器只能在容器初始化时被调用一次。
　　⑥拦截器可以获取IOC容器中的各个bean，而过滤器就不行，这点很重要，在拦截器里注入一个service，可以调用业务逻辑。    
