---
title: Spring-Aop
permalink: /Spring/Aop
tags: SpringAop
key: Spring-Aop
---


#### AOP的作用
作用：在不修改源代码的情况下，可以实现功能的增强

---

传统的纵向体系代码复用：  

![1](/assets/images/spring/0630/20180630172708942.png)

横向抽取机制（AOP思想）：  

![2](/assets/images/spring/0630/20180630172800537.png)

__AOP 思想： 基于代理思想，对原来目标对象，创建代理对象，在不修改原对象代码情况下，通过代理对象，调用增强功能的代码，从而对原有业务方法进行增强 ！__

#### AOP应用场景

场景一： __记录日志__   
场景二： __监控方法运行时间__ （监控性能）   
场景三： __权限控制__
场景四： __缓存优化__ （第一次调用查询数据库，将查询结果放入内存对象， 第二次调用， 直接从内存对象返回，不需要查询数据库 ）    
场景五： __事务管理__ （调用方法前开启事务， 调用方法后提交关闭事务 ） 

#### AOP的实现原理
那Spring中AOP是怎么实现的呢？Spring中AOP的有两种实现方式：    
1. JDK动态代理   
2. Cglib动态代理   

##### JDK动态代理
1. 引入依赖，有spring，单元测，日志管理
```xml
<!-- https://mvnrepository.com/artifact/org.springframework/spring-context -->
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-context</artifactId>
            <version>5.2.7.RELEASE</version>
        </dependency>

        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.12</version>
<!--            <scope>test</scope>-->
        </dependency>
        <!-- 日志 -->
        <dependency>
            <groupId>org.slf4j</groupId>
            <artifactId>slf4j-log4j12</artifactId>
            <version>1.7.30</version>
        </dependency>


        <dependency>
            <groupId>cglib</groupId>
            <artifactId>cglib</artifactId>
            <version>3.3.0</version>
        </dependency>
```
2. UserDao接口

```java
public interface UserDao {
    public void saveUser();
}
```
3. UserDao实现类

```java
public class UserDaoImpl implements UserDao {

    @Override
    public void saveUser() {
        System.out.println("持久层：用户保存");
    }
}
```

4. 动态代理

```java
@Test
public void test1() {

    final UserDao userDao = new UserDaoImpl();
    // newProxyInstance的三个参数解释：
    // 参数1：代理类的类加载器，同目标类的类加载器
    // 参数2：代理类要实现的接口列表，同目标类实现的接口列表
    // 参数3：回调，是一个InvocationHandler接口的实现对象，当调用代理对象的方法时，执行的是回调中的invoke方法
    //proxy为代理对象
    UserDao proxy = (UserDao) Proxy.newProxyInstance(userDao.getClass().getClassLoader(),
            userDao.getClass().getInterfaces(), new InvocationHandler() {

                @Override
                // 参数proxy:被代理的对象
                // 参数method:执行的方法，代理对象执行哪个方法，method就是哪个方法
                // 参数args:执行方法的参数
                public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
                    System.out.println("记录日志");
                    Object result = method.invoke(userDao, args);
                    return result;
                }
            });
    //代理对象执行方法
    proxy.saveUser();
}
```
5. 结果

在没有修改原有类的代码的情况下，对原有类的功能进行了增强
```
记录日志
持久曾：用户保护
```

##### Cglib动态代理
在实际开发中，可能需要对 __没有实现接口的类增强，用JDK动态代理的方式就没法实现__ 。采用Cglib动态代理可以对没有实现接口的类产生代理，实际上是生成了目标类的子类来增强。
- 首先，需要导入Cglib所需的jar包。提示：spring已经集成了cglib，我们已经导入了spring包，所以不需要再导入其它包了。  
1. 目标类（一个公开方法，另外一个用final修饰）：

```java
public class Dog{

    final public void run(String name) {
        System.out.println("狗"+name+"----run");
    }

    public void eat() {
        System.out.println("狗----eat");
    }
}
```

2. 方法拦截器：

```java
import java.lang.reflect.Method;

import net.sf.cglib.proxy.MethodInterceptor;
import net.sf.cglib.proxy.MethodProxy;

public class MyMethodInterceptor implements MethodInterceptor{

    @Override
    public Object intercept(Object obj, Method method, Object[] args, MethodProxy proxy) throws Throwable {
      long start = System.currentTimeMillis();
      System.out.println("方法："+method.getName()+"开始执行");
      //注意这里的方法调用，不是用反射哦！！！
      Object object = methodProxy.invokeSuper(obj, args);
      long end = System.currentTimeMillis();
      System.out.println("用时："+ (end-start) + " ms");
    }  
}
```

3. 测试类

```java
import net.sf.cglib.core.DebuggingClassWriter;
import net.sf.cglib.proxy.Enhancer;

public class CgLibProxy {
    public static void main(String[] args) {
        //在指定目录下生成动态代理类，我们可以反编译看一下里面到底是一些什么东西
        // System.setProperty(DebuggingClassWriter.DEBUG_LOCATION_PROPERTY, "D:\\java\\java_workapace");

        //创建Enhancer对象，类似于JDK动态代理的Proxy类，下一步就是设置几个参数
        Enhancer enhancer = new Enhancer();
        //设置目标类的字节码文件
        enhancer.setSuperclass(Dog.class);
        //设置回调函数
        enhancer.setCallback(new MyMethodInterceptor());

        //这里的creat方法就是正式创建代理类
        Dog proxyDog = (Dog)enhancer.create();
        //调用代理类的eat方法
        proxyDog.eat();       
    }
}
```

3. 结果

```
这里是对目标类进行增强
狗----eat
```

#### 参考网站
[CGLib动态代理](https://www.cnblogs.com/wyq1995/p/10945034.html)  
[Spring AOP的实现原理及应用场景（通过动态代理）](https://blog.csdn.net/u010452388/article/details/80868392)
