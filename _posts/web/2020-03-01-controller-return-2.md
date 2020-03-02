---
title: Controller 数据处理示例(Model ModelAndView redirect)
permalink: /web/Controller/retrurn/2
tags: CodeMark
pageview: true
show_date: true
sidebar:
  nav: docs-en-web
---
[GitHub源码](https://github.com/javaniuniu/shops/tree/master/src/main/java/com/javaniuniu/shops/controller)

### 直接返回所需要的数据
```js
//删除用户地址
    $(".delAddresslBtn").click(function () {
        var addressId = $(this).attr("addressId");
        $.ajax({
            url: "/user/userAddress/delete/" + addressId,
            success: function (result) {
                if(result.status=="SUCCESS"){
                    $("tr[addressId="+addressId+"]").remove();
                    toastr.info("地址信息删除成功...");
                } else {
                    toastr.error(result.message);
                }
            },
            error: function () {
                toastr.error("发生错误...");
            }
        })
    });
```
```java
@RequestMapping(value = "/userAddress/delete/{id}", method = RequestMethod.GET)
    @ResponseBody
    public String delUserAddress(@PathVariable Integer id) {
        userAddressService.deleteById(id);
        log.debug("收货地址删除成功...");
        return "success";
    }
```


### 返回数据通过JsonResult封装
```js
//保存用户地址
    $("#addAddressBtn").click(function () {
        var addressId = $(this).attr("addressId");
        $.ajax({
            url: "/user/userAddress/add/",
            method:"post",
            data:{
                "id":$("#id").val(),
                "address":$("#address").val(),
                "phone":$("#phone").val(),
                "zipcode":$("#zipcode").val(),
                "consignee":$("#consignee").val()
            },
            success: function (result) {
                if(result.status=="SUCCESS"){
                    $('#addAddressSuccess').show();
                    toastr.info("添加成功");
                } else {
                    toastr.error(result.message);
                }
            },
            error: function () {
                toastr.error("发生错误...");
            }
        })
    });
```
```java
@RequestMapping(value = "/userAddress/add", method = RequestMethod.POST)
    @ResponseBody
    public JsonResult doAddUserAddress(HttpSession session, UserAddress userAddress) {
        userAddress.setUser(getUserFromSession(session));
        userAddressService.save(userAddress);
        log.debug("地址信息保存成功.");

        JsonResult result = new JsonResult();
        result.setToSuccess();
        return result;
    }
```

redirect 重定向到其他 controller 继续执行
```java
@RequestMapping(value = "/reg", method = RequestMethod.POST)
    public String doReg(Admin admin) {
        adminService.save(admin);
        return "redirect:/";
    }
```

### 通过controller 实现页面跳转
```html
<ul class="nav navbar-nav navbar-right" th:unless="${session.login_user != null}">
                <li><a href="/user/login">登陆</a></li>
                <li><a href="/user/reg">注册</a></li>
            </ul>
```
```java
@RequestMapping(value = "/login", method = RequestMethod.GET)
    public String login() {
        return "admin/adminLogin";
    }
```
跳转到 adminLogin.html 页面


### 通过 redirect 后面携带参数，返回数据到前端

```java
@RequestMapping(value = "/login", method = RequestMethod.POST)
    public String doLogin(Admin admin, HttpSession session) {
        if (adminService.checkLogin(admin)) {
            AdminUtil.saveAdminToSession(session, adminService.findByUsernameAndPassword(admin.getUsername(), admin.getPassword()));
            log.debug("管理员[{}]登陆成功", admin.getUsername());
            return "redirect:/admin/product";
        }
        return "redirect:/admin/login?errorPwd=true";
    }
```

```html
<form action="#" th:action="@{/user/login}" method="post"
          id="loginForm" class="form-signin">

        <h2 class="form-signin-heading">系统登录</h2>

         <div th:unless="${#httpServletRequest.getParameter('errorPwd')==null}">
             <div id="errorPwd" class="alert alert-success">用户密码错误...</div>
             <script type="text/javascript">
                 setTimeout(function () {
                     $('#errorPwd').hide('slow');
                 }, 3000);
             </script>
         </div>
```



### 通过 Model 传递数据到前端渲染
- html 触发请求
```html
<div class="row br" th:fragment="user">
    <ul class="nav nav-tabs">
        <li id="sub-nav-user"><a href="/user/profile">个人信息</a></li>
        <li id="sub-nav-order"><a href="/user/order/">订单管理</a></li>
        <li id="sub-nav-address"><a href="/user/userAddress">地址管理</a></li>
<!--        <li id="sub-nav-security"><a href="/user/security">安全管理</a></li>-->
    </ul>
</div>
```


- controller 接收请求，并将数据传递到前端     
1.通过model传递数据 userAddressList 到前端 userAddress.html 渲染       
2."userAddressList" 对应 html 中的 ${userAddressList}       
```java
@RequestMapping(value = "/userAddress", method = RequestMethod.GET)
    public String userAddress(Model model, HttpSession session) {
        model.addAttribute("title", "地址管理");
        List<UserAddress> userAddressList = userAddressService.findByUserId(UserUtil.getUserFromSession(session).getId());
        model.addAttribute("userAddressList", userAddressList);
        return "user/userAddress";
    }
```

- html前端渲染
```html
<tbody>
                <tr th:each="userAddress:${userAddressList}" addressId="${userAddress.id}">
                    <td th:text="${userAddress.consignee}">收件人</td>
                    <td th:text="${userAddress.zipcode}">邮编</td>
                    <td th:text="${userAddress.phone}">手机</td>
                    <td th:text="${userAddress.address}">地址</td>
                    <td>
                        <a class="btn btn-info btn-xs delAddresslBtn" th:addressId="${userAddress.id}">删除</a>
                        <a class="btn btn-info btn-xs editAddresslBtn" th:addressId="${userAddress.id}">修改</a>
                    </td>
                </tr>
            </tbody>
```

### 通过 ModelAndView 传递数据到前端渲染
```html
<ul class="nav nav-tabs">
        <!--<li id="sub-nav-admin"><a href="/user/profile">个人信息</a></li>-->
        <li id="sub-nav-product"><a href="/admin/product">商品管理</a></li>
        <li id="sub-nav-order"><a href="/admin/order">订单管理</a></li>
        <li id="sub-nav-news"><a href="/admin/news">公告管理</a></li>
    </ul>
```
```java
@RequestMapping(method = RequestMethod.GET)
    public ModelAndView index(ModelAndView model, HttpServletRequest request) {
        Page<News> page = new Page<News>(request);
        newsService.findNews(page);
        model.addObject("page",page);
        model.setViewName("admin/news/newsAdmin");
        return model;
    }
```

```html
<tbody>
            <tr th:each="news:${page.result}" th:pid="${news.id}">
                <td th:text="${news.createTime}"></td>
                <td th:text="${news.title}"></td>
                <td><a class="btn btn-info btn-xs">查看</a> <a class="btn btn-info btn-xs">修改 <a
                        class="btn btn-info btn-xs">删除</a></a></td>
            </tr>
            </tbody>
```
