---
title: 通过实现ConstraintValidator完成自定义校验注解
permalink: /java-code-design/constraintValidator
tags: CodeDesign CodeMark 数据校验 自定义注解
pageview: true
show_date: true
sidebar:
  nav: docs-en-code
---
首先贴上代码
```java
@Data
public class LoginVO {
    @NotNull
    @IsMobile
    private String mobile;

    @NotNull
    @Length(min = 32)
    private String password;

}
```
```java
public class IsMobileValidator implements ConstraintValidator<IsMobile,String> {

    private boolean require = false;

    @Override
    public void initialize(IsMobile constraintAnnotation) {
        require = constraintAnnotation.required();
    }

    @Override
    public boolean isValid(String s, ConstraintValidatorContext constraintValidatorContext) {
        if(require){
            return ValidatorUtils.isMobile(s);
        }else {
           if (StringUtils.isEmpty(s)) {
               return true;
           }else {
               return ValidatorUtils.isMobile(s);
           }
        }
    }
}
```
```java
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Constraint(
        validatedBy = {IsMobileValidator.class}
)
public @interface IsMobile {

    boolean required() default true;

    String message() default "手机号格式不正确";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};


}
```
```java
public class ValidatorUtils {

    private static final Pattern mobile_pattern = Pattern.compile("1\\d{10}");

    public static boolean isMobile(String src) {
        if (StringUtils.isEmpty(src)) {
            return false;
        }
        Matcher m = mobile_pattern.matcher(src);
        return m.matches();
    }
}
1. LoginVO类为一个普通的实体类，其中的mobile属性添加了自定义注解。
2. IsMobile类为自定义的字段注解，未了解过注解的同学请自行百度，在此不做基础介绍。该自定义注解类中用到了四种元注解，最后一个@Constraint指定了校验类，也就是接下来的IsMobileValidator类。值得一提的是除了自定义的message、require属性外，下面的groups和payload也是必须添加的。
3. ValidatorUtils为一个工具类，简单校验了是否为手机号，没有了解过的可以看我之前的一篇博文：https://blog.csdn.net/qq_38439885/article/details/80230753
4. IsMobileValidator为自定义注解的校验类。
校验类需要实现ConstraintValidator接口。
接口使用了泛型，需要指定两个参数，第一个自定义注解类，第二个为需要校验的数据类型。
实现接口后要override两个方法，分别为initialize方法和isValid方法。其中initialize为初始化方法，可以在里面做一些初始化操作，isValid方法就是我们最终需要的校验方法了。可以在该方法中实现具体的校验步骤。本示例中进行了简单的手机号校验。

完成这几部分之后，一个简单的自定义校验注解就完成啦，不要忘记在使用的时候加上@Valid注解开启valid校验。

那么如何获取在注解中定义的message信息呢？

在valid校验中，如果校验不通过，会产生BindException异常，捕捉到异常后可以获取到defaultMessage也就是自定义注解中定义的内容，具体实现如下：
```java
    BindException ex = (BindException)e;
    List<ObjectError> errors = ex.getAllErrors();
    ObjectError error = errors.get(0);
    String msg = error.getDefaultMessage();
```
