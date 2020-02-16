---
title: User
permalink: /SpringSecurity/User
tags: SpringSecurity CodeMark
pageview: true
show_date: true
sidebar:
  nav: docs-en-Spring
---
### 简介
UserDetails的默认实现（框架提供的），User。用户可以从自己的数据库中取出此用户的账号，密码，以及相关权限，然后用构造方法填充创建一个User对象即可。 注：实现CredentialsContainer接口是为了在登录成功后，清除用户信息中的密码。（登录成功后会将用户信息存储在SecurityContext中）
### 源码
```java
public class User implements UserDetails, CredentialsContainer {
    private static final long serialVersionUID = 500L;
    private static final Log logger = LogFactory.getLog(User.class);
    private String password;
    private final String username;
    private final Set<GrantedAuthority> authorities;
    private final boolean accountNonExpired;
    private final boolean accountNonLocked;
    private final boolean credentialsNonExpired;
    private final boolean enabled;

    public User(String username, String password, Collection<? extends GrantedAuthority> authorities) {
        this(username, password, true, true, true, true, authorities);
    }

    public User(String username, String password, boolean enabled, boolean accountNonExpired, boolean credentialsNonExpired, boolean accountNonLocked, Collection<? extends GrantedAuthority> authorities) {
        if (username != null && !"".equals(username) && password != null) {
            this.username = username;
            this.password = password;
            this.enabled = enabled;
            this.accountNonExpired = accountNonExpired;
            this.credentialsNonExpired = credentialsNonExpired;
            this.accountNonLocked = accountNonLocked;
            this.authorities = Collections.unmodifiableSet(sortAuthorities(authorities));
        } else {
            throw new IllegalArgumentException("Cannot pass null or empty values to constructor");
        }
    }
    //省略部分代码
}
```
