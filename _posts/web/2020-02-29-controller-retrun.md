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
