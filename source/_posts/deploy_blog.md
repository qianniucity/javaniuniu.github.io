---
title: 有关使用Hexo和GitHub搭建个人博客
date: 2019-10-15 07:30:42
categories: Tools
tags: deploy blog
---
## 有关使用 Hexo 和 GitHub 搭建个人博客
- [连接实例](https://minplemon.github.io/)

##hexo 安装步骤，[参考官网](https://hexo.io/zh-cn/docs/setup)

## hexo 常用命令，参考
```
$ hexo --help
```

##针对 Spawn failed 处理方法
```
git@github.com: Permission denied (publickey).
fatal: Could not read from remote repository.

Please make sure you have the correct access rights
and the repository exists.
FATAL Something's wrong. Maybe you can find the solution here: https://hexo.io/docs/troubleshooting.html
Error: Spawn failed
    at ChildProcess.task.on.code (/Users/minp/GitHub/minplemon.github.io/node_modules/hexo-deployer-git/node_modules/hexo-util/lib/spawn.js:51:21)
    at ChildProcess.emit (events.js:198:13)
    at Process.ChildProcess._handle.onexit (internal/child_process.js:248:12)
```

## _ config 修改如下 亲测可用
```
deploy:
  type: git   
  repo: https://github.com/{yourname}/{yourname}.github.io.git   
  branch: master

修改为如下：

deploy:    
  type: git   
  repo: https://{yourname}:{yourpassword}@github.com/{yourname}/{yourname}.github.io.git   
  branch: master
```
