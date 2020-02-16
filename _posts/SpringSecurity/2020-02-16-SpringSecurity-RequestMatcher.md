---
title: RequestMatcher(配置忽略url和认证的url)
permalink: /SpringSecurity/RequestMatcher
tags: SpringSecurity CodeMark
pageview: true
show_date: true
sidebar:
  nav: docs-en-Spring
---
#### 一句话简介
匹配`HttpServletRequest`的简单策略接口`RequestMatcher`，其下定义了`matches方法`，如果返回是true表示提供的请求与提供的匹配规则匹配，如果返回的是false则不匹配。

#### RequestMatcher其实现类：
- AntPathRequestMatcher：重点
- MvcRequestMatcher：重点
- RegexRequestMatcher： 根据正则模式进行匹配
- AnyRequestMatcher

#### 使用场景
可配合过滤器，[过滤掉不需要token验证的url](/Spring/OncePerRequestFilter)

#### 示例
```java
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;
import org.springframework.util.ObjectUtils;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

/***
 *  配置忽略url 和认证的url
 */
public class SkipPathAntMatcher implements RequestMatcher {
    private List<String> pathsToSkip;

    public SkipPathAntMatcher(List<String> pathsToSkip) {
        this.pathsToSkip = pathsToSkip;
    }

    @Override
    public boolean matches(HttpServletRequest request) {
        System.out.println("请求路径-->" + request.getRequestURL());
        if (!ObjectUtils.isEmpty(pathsToSkip)) {
            for (String s : pathsToSkip) {
                AntPathRequestMatcher antPathRequestMatcher = new AntPathRequestMatcher(s);
                if (antPathRequestMatcher.matches(request)) {
                    return true;
                }
            }
        }
        return false;
    }
}
```
