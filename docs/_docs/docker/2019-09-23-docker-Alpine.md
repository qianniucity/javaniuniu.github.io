---
title: Alpine简要介绍
permalink: /docker/Alpine
tags: docker
key: docker-Alpine
---
Alpine 的意思是“高山的”，比如 Alpine plants高山植物，Alpine skiing高山滑雪、the alpine resort阿尔卑斯山胜地。
Alpine Linux 网站首页注明“Small！Simple！Secure！Alpine Linux is a security-oriented, lightweight Linux distribution based on musl libc and busybox.”概括了以下特点：

1、小巧：基于Musl libc和busybox，和busybox一样小巧，最小的Docker镜像只有5MB；

2、安全：面向安全的轻量发行版；

3、简单：提供APK包管理工具，软件的搜索、安装、删除、升级都非常方便。

4、适合容器使用：由于小巧、功能完备，非常适合作为容器的基础镜像。

## notice
- 进入终端使用 /bin/sh （其他使用 /bin/bash ）
```
docker container run -p 82:80 --name myalpine_naginx -itd king101125s/alpine_nginx:v1.0.0 /bin/sh
docker container exec -it 28545d300667 /bin/sh
```

## for nginx config
```
apk add make libc-dev gcc pcre-dev zlib-dev linux-headers libxslt-dev gd-dev geoip-dev perl-dev libedit-dev mercurial alpine-sdk findutils
```


## 参考文档
[Alpine Linux 使用简介](https://blog.csdn.net/zl1zl2zl3/article/details/80118001)
