---
title: springboot自定义参数解析HandlerMethodArgumentResolver
permalink: /SpringBoot/HandlerMethodArgumentResolver
tags: SpringBoot
sidebar:
  nav: docs-en-Spring
---
## 简介
自定义解析器需要实现 *HandlerMethodArgumentResolver* 接口， *HandlerMethodArgumentResolver* 接口包含两个接口函数：
```java
public interface HandlerMethodArgumentResolver {
    boolean supportsParameter(MethodParameter var1);

    @Nullable
    Object resolveArgument(MethodParameter var1, @Nullable ModelAndViewContainer var2, NativeWebRequest var3, @Nullable WebDataBinderFactory var4) throws Exception;
}
```

## 自定义一个解析器CurrentUserMethodArgumentResolver

我们在解析器中返回一个固定的 *UserBeannew UserBean(1L,"admin")* ，实际情况是从Session、数据库或者缓存中查。
```java
import org.springframework.core.MethodParameter;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

/**
 * 用于绑定@CurrentUser的方法参数解析器
 *
 * @author lism
 */
public class CurrentUserMethodArgumentResolver implements HandlerMethodArgumentResolver {

    public CurrentUserMethodArgumentResolver() {
    }

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        if (parameter.getParameterType().isAssignableFrom(UserBean.class) && parameter.hasParameterAnnotation(CurrentUser.class)) {
            return true;
        }
        return false;
    }

    @Override
    public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer, NativeWebRequest webRequest, WebDataBinderFactory binderFactory) throws Exception {
        CurrentUser currentUserAnnotation = parameter.getParameterAnnotation(CurrentUser.class);
        //从Session 获取用户
        Object object = webRequest.getAttribute(currentUserAnnotation.value(), NativeWebRequest.SCOPE_SESSION);
//从  accessToken获得用户信息
       if (object == null) {
            String token = webRequest.getHeader("Authorization");
            if (token == null) {
                token = webRequest.getParameter("accessToken");
            }
            //为了测试先写死用户名
            //TODO: 取真实用户
            return new UserBean(1L,"admin");
        }
        return object;
    }
}
```

## 自定义注解@CurrentUser
```java
import java.lang.annotation.*;

/**
 * <p>绑定当前登录的用户</p>
 * <p>不同于@ModelAttribute</p>
 *
 * @author lism
 */
@Target({ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface CurrentUser {

    /**
     * 当前用户在request中的名字
     *
     * @return
     */
    String value() default "user";

}
```

## 在控制器中使用@CurrentUser

在控制器方法上加入 *@CurrentUser UserBean userBean* 即可自动注入userBean的值
```java
@RestController
@RequestMapping(value = "/test")
public class TestController  {

    /**
     * 根据name查询
     *
     * @param request
     * @return
     */
    @RequestMapping(value = "/testCurrentUser", method = RequestMethod.POST, produces = "application/json", consumes = "application/json")
    @ResponseBody
    public void test(@CurrentUser UserBean userBean, @RequestBody SubjectRequest request) {
        String createdBy = userBean.getUsername();
        log.info(createdBy);
    }
}
```

## User实体UserBean
```java
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserBean implements Serializable {
    private Long id;
    private String username;
}
```

## 总结

我们可以通过实现 *HandlerMethodArgumentResolver* 接口来实现对自定义的参数进行解析。
比如可以解析自定义的时间格式、自定义解析Map对象等这些spring原本不支持的对象格式。
