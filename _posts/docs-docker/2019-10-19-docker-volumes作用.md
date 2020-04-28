---
title: Volumes作用
permalink: /docker/Volumes
tags: docker
key: docker-Volumes
---
# Docker Compose Volumes

**volumes的作用有点类似于VMware里面的共享目录，用于将物理主机里的目录映射到docker虚拟机里。**

## 通常用法
```
version: '2'

networks:
  thinking:

services:
  test_1.thinking.com:
    image: ubuntu
    ports:
      - "3333:3333"
    container_name: test_1.thinking.com
    command: /bin/bash
    volumes:
      - $PWD/:/test_pwd
    tty: true
    networks:
      - thinking

  test_2.thinking.com:
    image: ubuntu
    ports:
      - "4444:4444"
    container_name: test_2.thinking.com
    command: /bin/bash
    tty: true
    networks:
      - thinking
```
其中
```
    volumes:
    - $PWD/:/test_pwd
```

表示将物理机的当前目录映射到docker虚拟机/test_pwd里面。

执行

```
$ docker-compose -f test_voloumes.yaml up -d
Creating network "desktop_thinking" with the default driver
Creating test_1.thinking.com ... done

Creating test_2.thinking.com ... done
```
```
$ docker exec -it test_1.thinking.com /bin/bash
root@6322d7abd4b6:/# ls
bin   dev  home  lib64  mnt  proc  run   srv  test_pwd  usr

boot  etc  lib   media  opt  root  sbin  sys  tmp       var

root@6322d7abd4b6:/# ls /test_pwd/

docker-compose-test.yml  docker-compose.yml  test  test_voloumes.yaml
```
可以看到映射成功了。

特殊用法
在研究fabric项目的时候还发现有另外一种用法
```
version: '2'

volumes:
  test_1.thinking.com:
  test_2.thinking.com:

networks:
  thinking:

services:
  test_1.thinking.com:
    image: ubuntu
    ports:
      - "3333:3333"
    container_name: test_1.thinking.com
    command: /bin/bash
    volumes:
      - test_1.thinking.com:/test
      - $PWD/:/test_pwd
    tty: true
    networks:
      - thinking

  test_2.thinking.com:
    image: ubuntu
    ports:
      - "4444:4444"
    container_name: test_2.thinking.com
    command: /bin/bash
    tty: true
    networks:
      - thinking
```
试一下
```
$ docker-compose -f test_voloumes.yaml up -d
Creating volume "desktop_test_1.thinking.com" with default driver
Creating volume "desktop_test_2.thinking.com" with default driver
Recreating test_1.thinking.com ... 

Recreating test_1.thinking.com ... done
```
```
$ docker volume ls
DRIVER              VOLUME NAME
local               desktop_test_1.thinking.com

local               desktop_test_2.thinking.com
```
```
$ docker volume inspect desktop_test_1.thinking.com
[
    {
        "CreatedAt": "2018-06-06T02:37:41-07:00",
        "Driver": "local",
        "Labels": null,
        "Mountpoint": "/var/lib/docker/volumes/desktop_test_1.thinking.com/_data",
        "Name": "desktop_test_1.thinking.com",
        "Options": null,
        "Scope": "local"
    }

]
```

这看起来意思是volume test_1.thinking.com对应的物理机是/var/lib/docker/volumes/desktop_test_1.thinking.com/_ data，映射到docker虚拟机里面是/test，检验一下
```
$ docker exec -it test_1.thinking.com /bin/bash
root@104a3ebe6639:/# ls
bin   dev  home  lib64  mnt  proc  run   srv  test      tmp  var
boot  etc  lib   media  opt  root  sbin  sys  test_pwd  usr

root@104a3ebe6639:/# mkdir -p /test/fuck
```
到物理机里面去看
```
$ ls /var/lib/docker/volumes/desktop_test_1.thinking.com/_data

ls: cannot access '/var/lib/docker/volumes/desktop_test_1.thinking.com/_data': Permission denied

$ sudo ls /var/lib/docker/volumes/desktop_test_1.thinking.com/_data

fuck
```
