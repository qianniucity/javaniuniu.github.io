---
title: AuthenticationException 使用及所有子类
permalink: /SpringSecurity/authenticationException
tags: SpringSecurity 类解释 异常处理
key: SpringSecurity-authenticationException
---
**AuthenticationEntryPoint 用来解决匿名用户访问无权限资源时的异常**
1. AccountStatusException:用户状态异常它包含如下子类
  - AccountExpiredException:账户过期
  - CredentialsExpiredException:证书过期
  - DisabledException:账户不可用
  - LockedException:账户锁定
2. ActiveDirectoryAuthenticationException,
3. AuthenticationCancelledException:已取消OpenID身份验证
4. AuthenticationCredentialsNotFoundException:如果由于`SecurityContext`中没有身份验证对象而拒绝身份验证请求，则抛出该异常。
5. AuthenticationServiceException:如果由于系统问题而无法处理身份验证请求，则抛出该异常。例如，如果后端身份验证存储库不可用，则可能会抛出此错误。
6. BadCredentialsException:如果由于凭据无效而拒绝身份验证请求，则抛出该异常。 对于抛出此异常，这意味着该帐户既未锁定也未禁用。
7. InsufficientAuthenticationException:如果由于凭据未充分信任而拒绝身份验证请求，则抛出该异常。
如果`AccessDecisionVoters`对身份验证级别不满意，通常会引发此异常，例如使用“记住我”机制或匿名执行。 然后，`ExceptionTranslationFilter`通常将导致`AuthenticationEntryPoint`被调用，从而允许主体以更强的身份验证级别进行身份验证。
8. NonceExpiredException:如果由于摘要随机数已过期而拒绝认证请求，则抛出该异常。
9. OAuth2AuthenticationException:对于所有与OAuth 2.0相关的身份验证错误，都会引发此异常。在许多情况下可能会发生错误，例如：
  - 授权请求或令牌请求缺少必需的参数
  - 客户端标识符缺失或无效
  - 无效或不匹配的重定向URI
  - 请求的范围无效，未知或格式错误
  - 资源所有者或授权服务器拒绝了访问请求
  - 客户端身份验证失败
  - 提供的授权授权（授权代码，资源所有者凭证）无效，已过期或已撤销
10. PreAuthenticatedCredentialsNotFoundException:
11. ProviderNotFoundException:如果未找到支持所提供的`Authentication`对象的`AuthenticationProvider`，则由`ProviderManager`抛出。
12. RememberMeAuthenticationException:使用“记住我”身份验证时发生身份验证异常时，将引发此异常。
13. Saml2AuthenticationException:对于所有与SAML 2.0相关的身份验证错误，都会引发此异常。在许多情况下可能会发生错误，例如：
  - 响应或断言请求丢失或格式错误
  - 主题缺失或无效
  - 签名缺失或无效
  - 断言的时间段验证失败
  - 断言条件之一不满足
  - 解密失败
  - 无法找到主题标识符，通常称为用户名
14. SessionAuthenticationException:由`SessionAuthenticationStrategy`抛出，以指示认证对象对于当前会话无效，通常是因为同一用户超过了允许其同时进行的会话数。
15. UsernameNotFoundException:如果`UserDetailsService`实现无法通过用户名找到用户，则抛出该异常。

##### 举例
```java
@Slf4j
@Component
public class UnauthorizedHandler implements AuthenticationEntryPoint {
    @Override
    public void commence(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, AuthenticationException e) throws IOException, ServletException {
        // 用户登录时身份认证未通过
        if (e instanceof BadCredentialsException) {
            log.info("用户登录时身份认证失败!");
            ResultUtil.writeJavaScript(httpServletResponse, ErrorCodeEnum.TOKEN_INVALID.getCode(), e.getMessage());
        } else if (e instanceof InsufficientAuthenticationException) {
            log.info("缺少请求头参数,Authorization传递是token值所以参数是必须的.");
            ResultUtil.writeJavaScript(httpServletResponse, ErrorCodeEnum.NO_TOKEN.getCode(), ErrorCodeEnum.NO_TOKEN.getMessage());
        } else {
            log.info("用户token无效.");
            ResultUtil.writeJavaScript(httpServletResponse, ErrorCodeEnum.TOKEN_INVALID.getCode(), ErrorCodeEnum.TOKEN_INVALID.getMessage());
        }

    }
}
```

##### 参考文档:
[docs.spring.io](https://docs.spring.io/spring-security/site/docs/current/api/org/springframework/security/core/AuthenticationException.html)
