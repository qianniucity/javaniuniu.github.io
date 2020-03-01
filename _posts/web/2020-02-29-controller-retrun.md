---
title: 控制类中，return的几种形态
permalink: /web/Controller/retrurn
tags: CodeMark
pageview: true
show_date: true
sidebar:
  nav: docs-en-web
---


## redirect重定向流程
客户发送一个请求到服务器，服务器匹配servlet，这都和请求转发一样，servlet处理完之后调用了sendRedirect()这个方法，这个方法是response的方法，所以，当这个servlet处理完之后，看到response.senRedirect()方法，立即向客户端返回这个响应，响应行告诉客户端你必须要再发送一个请求，去访问test.jsp，紧接着客户端受到这个请求后，立刻发出一个新的请求，去请求test.jsp,这里两个请求互不干扰，相互独立，在前面request里面setAttribute()的任何东西，在后面的request里面都获得不了。可见，在sendRedirect()里面是两个请求，两个响应。

### 重定向场景
Spring MVC中做form表单功能提交时，防止用户客户端后退或者刷新时重复提交问题，需要在服务端进行重定向跳转,其中redirect是直接跳转到其他页面，有以下3种方法进行重定向。

### 1. response.sendRedirect重定向跳转
```java
@RequestMapping(value="/testredirect",method = { RequestMethod.POST, RequestMethod.GET })  
public ModelAndView testredirect(HttpServletResponse response){  
    response.sendRedirect("/index");
    return null;
}
```

### 2. ViewResolver直接跳转
不带参数
```java
@RequestMapping(value="/testredirect",method = { RequestMethod.POST, RequestMethod.GET })  
public  String testredirect(HttpServletResponse response){  
    return "redirect:/index";  
}
```

带参数
```java
@RequestMapping("/testredirect")
public String testredirect(Model model, RedirectAttributes attr) {
	attr.addAttribute("test", "51gjie");//跳转地址带上test参数
    attr.addFlashAttribute("u2", "51gjie");//跳转地址不带上u2参数
	return "redirect:/user/users";
}
```


### 3. ModelAndView重定向
不带参数
```java
@RequestMapping(value="/restredirect",method = { RequestMethod.POST, RequestMethod.GET })  
public  ModelAndView restredirect(String userName){  
    ModelAndView  model = new ModelAndView("redirect:/main/index");    
    return model;  
}
```

带参数
```java
@RequestMapping(value="/toredirect",method = { RequestMethod.POST, RequestMethod.GET })  
public  ModelAndView toredirect(String userName){  
    ModelAndView  model = new ModelAndView("redirect:/main/index");   
    model.addObject("userName", userName);  //把userName参数带入到controller的RedirectAttributes
    return model;  
}
```

## 其他return 形态
#####  带参数，跳转到admin/news/newsDetail页面
```java
@RequestMapping(value = "/news/{id}")
    public ModelAndView newsView(@PathVariable("id") Integer id,ModelAndView model) {
        News news = newsService.findById(id);
        model.addObject("news", news);
        model.setViewName("admin/news/newsDetail");
        return model;
    }
```

##### 不带参数，跳转到 admin/adminReg 页面
```java
@RequestMapping(value = "/reg", method = RequestMethod.GET)
    public String reg() {
        return "admin/adminReg";
    }
```


##### 返回指定数据到前端，JsonResult
```java
@RequestMapping(value = "/news/delete/{id}")
    @ResponseBody
    public JsonResult newsDelete(@PathVariable("id") Integer id) {
        newsService.delNews(id);
        JsonResult result = new JsonResult();
        result.setToSuccess();
        return result;
    }
```
---------2020/03/01 更新 ModelAndView 和 Map 及 Model

## ModelAndView

### 概述

控制器处理方法的返回值如果为 ModelAndView, 则其既包含视图信息，也包含模型数据信息。

#### 添加模型数据:
- MoelAndView addObject(String attributeName, Object attributeValue)
- ModelAndView addAllObject(Map< String, ?> modelMap )

####设置视图:
- void setView(View view )
- void setViewName(String viewName)

#### 示例

- register_form.jsp
```html
<!DOCTYPE HTML>
<html>
<head>
    <title>Getting Started: Serving Web Content</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
</head>
<body>
    <form action="model/register" method="post">
        username: <input type="text" name="username"/>
        <br>
        password: <input type="password" name="password"/>
        <br>
        email: <input type="text" name="email"/>
        <br>
        age: <input type="text" name="age"/>
        <br>
        province: <input type="text" name="address.province"/>
        <br>
        city: <input type="text" name="address.city"/>
        <br>
        <input type="submit" value="Submit"/>
    </form>
</body>
</html>
```
- ModelController.java
```java
package com.ricky.codelab.webapp.ch3;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;
import com.ricky.codelab.webapp.ch2.model.User;

@Controller
@RequestMapping("model")
public class ModelController {

    @RequestMapping("register")
    public ModelAndView register(User user){

        ModelAndView mv = new ModelAndView("home");
        mv.addObject("user", user);

        return mv;
    }
}
```

- home.jsp
```html
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<body>
<h2>Welcome ${requestScope.user.username }!</h2>
</body>
</html>
```

## Map 及 Model

### 概述    
Spring MVC 在内部使用了一个org.springframework.ui.Model 接口存储模型数据。

Spring MVC 在调用方法前会创建一个–隐含的模型对象作为模型数据的存储容器。如果方法的入参为 Map 或 Model 类型，Spring MVC 会隐含模型的引用传递给这些入参。在方法体内，开发者可以通过这个入参对象访问到模型中的所有数据，也可以向模型中添加新的属性数据。

#### 示例
- 1、Map
```java
package com.ricky.codelab.webapp.ch3;

import java.util.Map;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import com.ricky.codelab.webapp.ch2.model.User;

@Controller
@RequestMapping("model")
public class ModelController {

    @RequestMapping("register")
    public String register(User user, Map<String, Object> map){

        map.put("user", user);

        return "home";
    }
}
```

- 2、Model
```java
package com.ricky.codelab.webapp.ch3;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import com.ricky.codelab.webapp.ch2.model.User;

@Controller
@RequestMapping("model")
public class ModelController {

    @RequestMapping("register")
    public String register(User user, Model model){

        model.addAttribute("user", user);

        return "home";
    }
}
```
