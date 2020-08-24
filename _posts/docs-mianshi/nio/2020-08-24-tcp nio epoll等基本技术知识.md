---
title: tcp nio epoll等基本技术知识
permalink: /mianshi/tcp/nio/01
tags: 面试题
key: mianshi-2020-08-24-01
---

#### TCP

应用层-->传输层-->网络层-->链路层--物理层

三次握手

四次分手



![1](/assets/images/nio/0824/Jietu20200824-155730@2x.jpg)



#### IO消耗

1. 程序调用
2. 用户态调用切换到系统调用



#### BIO

每个线程对应每个连接

优势：可接收很多的连接

问题：

1. 线程内存浪费
2. cpu调度消耗

根本原因：

​	BLOCKING 阻塞： accept recv

演变的解决方法 -->NONBLOCKING  非阻塞





#### NIO

New IO

NONBLOCKING 

优势：避免多线程问题

弊端：假设有1w个连接，只有一个发来数据，每循环一次

其实都需要向内核发生1w次reav系统调用，这里有9999是无意义的

消耗时间和资源（用户空间向内核空间的循环遍历，复杂度在系统调用上）



```java
package com.mashibing.io.nio;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.ByteBuffer;
import java.nio.channels.SelectionKey;
import java.nio.channels.Selector;
import java.nio.channels.ServerSocketChannel;
import java.nio.channels.SocketChannel;
import java.util.Iterator;
import java.util.Set;

public class Server {
    public static void main(String[] args) throws IOException {
        ServerSocketChannel ssc = ServerSocketChannel.open();
        ssc.socket().bind(new InetSocketAddress("127.0.0.1", 8888));
        ssc.configureBlocking(false);

        System.out.println("server started, listening on :" + ssc.getLocalAddress());
        Selector selector = Selector.open();
        ssc.register(selector, SelectionKey.OP_ACCEPT);

        while(true) {
            selector.select();
            Set<SelectionKey> keys = selector.selectedKeys();
            Iterator<SelectionKey> it = keys.iterator();
            while(it.hasNext()) {
                SelectionKey key = it.next();
                it.remove();
                handle(key);
            }
        }

    }

    private static void handle(SelectionKey key) {
        if(key.isAcceptable()) {
            try {
                ServerSocketChannel ssc = (ServerSocketChannel) key.channel();
                SocketChannel sc = ssc.accept();
                sc.configureBlocking(false);
                //new Client
                //
                //String hostIP = ((InetSocketAddress)sc.getRemoteAddress()).getHostString();

			/*
			log.info("client " + hostIP + " trying  to connect");
			for(int i=0; i<clients.size(); i++) {
				String clientHostIP = clients.get(i).clientAddress.getHostString();
				if(hostIP.equals(clientHostIP)) {
					log.info("this client has already connected! is he alvie " + clients.get(i).live);
					sc.close();
					return;
				}
			}*/

                sc.register(key.selector(), SelectionKey.OP_READ );
            } catch (IOException e) {
                e.printStackTrace();
            } finally {
            }
        } else if (key.isReadable()) { //flip
            SocketChannel sc = null;
            try {
                sc = (SocketChannel)key.channel();
                ByteBuffer buffer = ByteBuffer.allocate(512);
                buffer.clear();
                int len = sc.read(buffer);

                if(len != -1) {
                    System.out.println(new String(buffer.array(), 0, len));
                }

                ByteBuffer bufferToWrite = ByteBuffer.wrap("HelloClient".getBytes());
                sc.write(bufferToWrite);
            } catch (IOException e) {
                e.printStackTrace();
            } finally {
                if(sc != null) {
                    try {
                        sc.close();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            }
        }
    }
}

```



#### 多路复用

-  **同步IO模型:**   **如果成自己读取IO，那么这个IO模型，无论是BIO，NIO，多路复用器，都叫做 同步IO模型**

- **多路复用器：**还是得自己来读取数据
- select，poll，epoll 都是同步的

优势：通过一次系统调用，把fds，传递给内核，内核进行遍历，想多NIO的遍历，多路复用减少了系统调用次数

弊端：1. 因为在where循环中，所有会出现重复传递数据到系统调用

​					- 解决方法：内核开辟内存空间保留fd

​			2. 每次select，poll 都都用重复遍历全量的fd

**shell命令 工具**

- strace 追踪io 可打印出系统调用日志



