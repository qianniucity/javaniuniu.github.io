---
title: SecurityContext使用实例
permalink: /SpringSecurity/SecurityContext
tags: SpringSecurity CodeMark
key: SpringSecurity-SecurityContext
---
**默认实现SecurityContextHolder**
- SecurityContext:认证成功后，就把用户信息和拥有的权限都存储在其中
- Authentication => 认证对象，认证开始时创建，认证成功后存储于SecurityContext
- principal => 用户信息对象，是一个Object，通常可转为UserDetails

Authentication中的principal方法获取对象
```java
@Controller
public class WsController {
    @Autowired
    SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/ws/chat")
    public void handleMsg(Authentication authentication, ChatMsg chatMsg) {
        Hr hr = (Hr) authentication.getPrincipal();
        chatMsg.setFrom(hr.getUsername());
        chatMsg.setFromNickname(hr.getName());
        chatMsg.setDate(new Date());
        simpMessagingTemplate.convertAndSendToUser(chatMsg.getTo(), "/queue/chat", chatMsg);
    }
}
```
```java
public class HrUtils {
    public static Hr getCurrentHr() {
        return ((Hr) SecurityContextHolder.getContext().getAuthentication().getPrincipal());
    }
}
```

SecurityContext
```java
/**
     * 用户登陆相关,主要验证用户用户密码以及设置jwt和用户缓存相关,并返回jwt的凭证
     *
     * @param userVo
     * @return
     */
    public MsgResponseBody<JWTUserDetail> login(UserVo userVo) {
        User user = new User();
        user.setLoginName(userVo.getAccountname());
        User userOne = selectOne(user);
        if (ObjectUtils.isEmpty(userOne)) {
            log.info("用户不存在!");
            return MsgResponseBody.error(ErrorCodeEnum.LOGIN_INCORRECT.getCode()).setResult(ErrorCodeEnum.LOGIN_INCORRECT.getMessage());
        }
        if (!bCryptPasswordEncoder.matches(userVo.getPassword(), userOne.getPassWord())) {
            log.info("用户登陆密码错误!");
            return MsgResponseBody.error(ErrorCodeEnum.LOGIN_INCORRECT.getCode()).setResult(ErrorCodeEnum.LOGIN_INCORRECT.getMessage());
        }
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        userVo.getAccountname(),
                        userVo.getPassword()
                )
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        //使用jwt生成token 用于权限效验
        JWTUserDetail jwtUserDetail = new JWTUserDetail();
        jwtUserDetail.setLoginName(userOne.getLoginName());
        jwtUserDetail.setLoginTime(new Date());
        jwtUserDetail.setUserId(userOne.getTid());
        jwtUserDetail.setUserType(JWTUserDetail.UserType.User);
        String token = jwtTokenUtil.generateToken(jwtUserDetail);
        jwtUserDetail.setJwtToken(token);
        return MsgResponseBody.success().setResult(jwtUserDetail);
    }
```
参考文档
- [principal](https://github.com/mcks2000/vhr/tree/master/vhr/vhrserver/vhr-web/src/main/java/org/javaboy/vhr/controller)
- [SecurityContextHolder](https://github.com/mcks2000/sc-whorl/tree/master/sc-whorl-web/src/main/java/sc/whorl/system/commons)
