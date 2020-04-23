---
title: JoinPoint的用法
permalink: /Spring/Aspect/JoinPoint
tags: SpringAop Aspect 类解释
key: Spring-Aspect-JoinPoint
---
#### JoinPoint 对象
JoinPoint对象`封装了SpringAop中切面方法的信息`,在切面方法中添加`JoinPoint参数`,就可以获取到封装了该方法信息的`JoinPoint对象`.   
**常用api:**    

| 方法名	| 功能 |
| :-----| :---- |
| Signature getSignature();	  |   获取封装了署名信息的对象,在该对象中可以获取到目标方法名,所属类的Class等信息 |
| Object[] getArgs();	  |   获取传入目标方法的参数对象 |
| Object getTarget();	  |   获取被代理的对象 |
| Object getThis();	  |   获取代理对象 |

#### ProceedingJoinPoint对象

**ProceedingJoinPoint对象是JoinPoint的子接口,该对象只用在@Around的切面方法中,**
添加了
- Object proceed() throws Throwable //执行目标方法
- Object proceed(Object[] var1) throws Throwable //传入的新的参数去执行目标方法
两个方法.

#### Demo

**切面类**
```java
@Aspect
@Component
public class aopAspect {
    /**
     * 定义一个切入点表达式,用来确定哪些类需要代理
     * execution(* aopdemo.*.*(..))代表aopdemo包下所有类的所有方法都会被代理
     */
    @Pointcut("execution(* aopdemo.*.*(..))")
    public void declareJoinPointerExpression() {}

    /**
     * 前置方法,在目标方法执行前执行
     * @param joinPoint 封装了代理方法信息的对象,若用不到则可以忽略不写
     */
    @Before("declareJoinPointerExpression()")
    public void beforeMethod(JoinPoint joinPoint){
        System.out.println("目标方法名为:" + joinPoint.getSignature().getName());
        System.out.println("目标方法所属类的简单类名:" +        joinPoint.getSignature().getDeclaringType().getSimpleName());
        System.out.println("目标方法所属类的类名:" + joinPoint.getSignature().getDeclaringTypeName());
        System.out.println("目标方法声明类型:" + Modifier.toString(joinPoint.getSignature().getModifiers()));
        //获取传入目标方法的参数
        Object[] args = joinPoint.getArgs();
        for (int i = 0; i < args.length; i++) {
            System.out.println("第" + (i+1) + "个参数为:" + args[i]);
        }
        System.out.println("被代理的对象:" + joinPoint.getTarget());
        System.out.println("代理对象自己:" + joinPoint.getThis());
    }

    /**
     * 环绕方法,可自定义目标方法执行的时机
     * @param pjd JoinPoint的子接口,添加了
     *            Object proceed() throws Throwable 执行目标方法
     *            Object proceed(Object[] var1) throws Throwable 传入的新的参数去执行目标方法
     *            两个方法
     * @return 此方法需要返回值,返回值视为目标方法的返回值
     */
    @Around("declareJoinPointerExpression()")
    public Object aroundMethod(ProceedingJoinPoint pjd){
        Object result = null;

        try {
            //前置通知
            System.out.println("目标方法执行前...");
            //执行目标方法
            //result = pjd.proeed();
            //用新的参数值执行目标方法
            result = pjd.proceed(new Object[]{"newSpring","newAop"});
            //返回通知
            System.out.println("目标方法返回结果后...");
        } catch (Throwable e) {
            //异常通知
            System.out.println("执行目标方法异常后...");
            throw new RuntimeException(e);
        }
        //后置通知
        System.out.println("目标方法执行后...");

        return result;
    }
}
```

**被代理类**
```java
/**
 * 被代理对象
 */
@Component
public class TargetClass {
    /**
     * 拼接两个字符串
     */
    public String joint(String str1, String str2) {
        return str1 + "+" + str2;
    }
}
```
**测试类**
```java
public class TestAop {
    @Test
    public void testAOP() {
        //1、创建Spring的IOC的容器
        ApplicationContext ctx = new ClassPathXmlApplicationContext("classpath:bean.xml");

        //2、从IOC容器中获取bean的实例
        TargetClass targetClass = (TargetClass) ctx.getBean("targetClass");

        //3、使用bean
        String result = targetClass.joint("spring","aop");
        System.out.println("result:" + result);
    }
}
```
**输出结果**
```
目标方法执行前...
目标方法名为:joint
目标方法所属类的简单类名:TargetClass
目标方法所属类的类名:aopdemo.TargetClass
目标方法声明类型:public
第1个参数为:newSpring
第2个参数为:newAop
被代理的对象:aopdemo.TargetClass@4efc180e
代理对象自己:aopdemo.TargetClass@4efc180e
目标方法返回结果后...
目标方法执行后...
result:newSpring+newAop
```


参考链接
- [JoinPoint的用法](https://blog.csdn.net/qq_15037231/article/details/80624064)
