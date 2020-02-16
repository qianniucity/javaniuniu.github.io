---
title: OncePerRequestFilter
permalink: /Spring/OncePerRequestFilter
tags: SpringFilter CodeMark JWT
pageview: true
show_date: true
sidebar:
  nav: docs-en-Spring
---
#### 一句话简介
springboot中javax.servlet.Filter原生接口的实现；而Spring的OncePerRequestFilter类实际上是一个实现了Filter接口的抽象类。spring对Filter进行了一些封装处理。   
OncePerRequestFilter，顾名思义，**它能够确保在一次请求中只通过一次filter，而需要重复的执行。** 大家常识上都认为，一次请求本来就只filter一次，为什么还要由此特别限定呢，往往我们的常识和实际的实现并不真的一样，经过一番资料的查阅，此方法是为了兼容不同的web container，也就是说并不是所有的container都入我们期望的只过滤一次，servlet版本不同，执行过程也不同，因此，为了兼容各种不同运行环境和版本，默认filter继承OncePerRequestFilter是一个比较稳妥的选择。

#### 使用场景
jwt认证token

#### 示例
```java
package sc.whorl.system.config.jwt;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.ObjectUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.Date;
import java.util.concurrent.TimeUnit;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import lombok.extern.slf4j.Slf4j;
import sc.whorl.system.config.springsecurity.conf.CustomUserDetailsService;
import sc.whorl.system.config.springsecurity.utils.ErrorCodeEnum;
import sc.whorl.system.utils.redis.RedisUtil;

/***
 *
 * @FileName: JwtAuthenticationTokenFilter
 * @remark: jwt认证token
 * @explain 每次请求接口时 就会进入这里验证token 是否合法
 *             token 如果用户一直在操作，则token 过期时间会叠加    如果超过设置的过期时间未操作  则token 失效 需要重新登录
 *
 */
@Slf4j
@Component
public class JwtAuthenPreFilter extends OncePerRequestFilter {
    @Autowired
    private JwtTokenUtil jwtTokenUtil;
    @Autowired
    private RedisUtil redisUtil;

    /**
     * 防止filter被执行两次
     */
    private static final String FILTER_APPLIED = "__spring_security_JwtAuthenPreFilter_filterApplied";


    @Value("${jwt.header:Authorization}")
    private String tokenHeader;

    @Value("${jwt.tokenHead:Bearer-}")
    private String tokenHead;
    /**
     * 距离快过期多久刷新令牌
     */
    @Value("${jwt.token.subRefresh:#{10*60}}")
    private Long subRefresh;
    // 不需要认证的接口
    @Value("${jwt.security.antMatchers}")
    private String antMatchers;
    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    public JwtAuthenPreFilter() {
    }


    @Override
    protected void doFilterInternal(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, FilterChain filterChain) throws ServletException, IOException {
        if (httpServletRequest.getAttribute(FILTER_APPLIED) != null) {
            filterChain.doFilter(httpServletRequest, httpServletResponse);
            return;
        }
        httpServletRequest.setAttribute(FILTER_APPLIED, true);

        SkipPathAntMatcher skipPathRequestMatcher = new SkipPathAntMatcher(Arrays.asList(antMatchers.split(",")));
        //过滤掉不需要token验证的url
        if (skipPathRequestMatcher.matches(httpServletRequest)) {
            filterChain.doFilter(httpServletRequest, httpServletResponse);
        } else {
            try {
                //1.判断是否有效 2.判断是否过期 3.如果未过期的,且过期时间小于10分钟的延长过期时间,并在当前response返回新的header,客户端需替换此令牌
                String authHeader = httpServletRequest.getHeader(this.tokenHeader);
                if (authHeader != null && authHeader.startsWith(tokenHead)) {
                    final String authToken = authHeader.substring(tokenHead.length());
                    JWTUserDetail userDetail = jwtTokenUtil.getUserFromToken(authToken);
                    if (ObjectUtils.isEmpty(userDetail)) {
                        log.info("令牌非法,解析失败{}!", authToken);
                        throw new BadCredentialsException(ErrorCodeEnum.TOKEN_INVALID.getMessage());
                    }
                    if (jwtTokenUtil.isTokenExpired(authToken)) {
                        log.info("令牌已失效!{}", authToken);
                        throw new BadCredentialsException(ErrorCodeEnum.TOKEN_INVALID.getMessage());
                    }
                    if (!StringUtils.isEmpty(redisUtil.get(authToken))) {
                        log.info("令牌已位于黑名单!{}", authToken);
                        throw new BadCredentialsException(ErrorCodeEnum.TOKEN_INVALID.getMessage());
                    }
                    //令牌快过期生成新的令牌并设置到返回头中,客户端在每次的restful请求如果发现有就替换原值,同时原值做redis黑名单
                    if (new Date(System.currentTimeMillis() - subRefresh).after(jwtTokenUtil.getExpirationDateFromToken(authToken))) {
                        String resAuthToken = jwtTokenUtil.generateToken(userDetail);
                        redisUtil.setEx(authToken,String.format(JwtTokenUtil.JWT_TOKEN_PREFIX, userDetail.getUserType(), userDetail.getUserId()), subRefresh, TimeUnit.SECONDS);
                        httpServletResponse.setHeader(tokenHeader, tokenHead + resAuthToken);
                    }
                    JwtTokenUtil.LOCAL_USER.set(userDetail);
                    UserDetails userDetails = customUserDetailsService.loadUserByUsername(userDetail.getLoginName());
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(httpServletRequest));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }else{
                    //需要校验却无用户token
                    System.out.println("无header请求-->" + httpServletRequest.getRequestURI());
                   // throw new InsufficientAuthenticationException(ErrorCodeEnum.NO_TOKEN.getMessage());
                }
            } catch (Exception e) {
                log.info("令牌解析失败!", e);
                throw new BadCredentialsException(ErrorCodeEnum.TOKEN_INVALID.getMessage());
            }
            filterChain.doFilter(httpServletRequest, httpServletResponse);
            //调用完成后清除
            JwtTokenUtil.LOCAL_USER.remove();
        }
    }
}


```
