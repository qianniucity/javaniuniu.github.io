---
title: 对返回给前端的数据进行格式封装处理-SpringBoot
permalink: /java-util-code/MsgResponseBody
tags: CodeMark 工具类 返回前端数据格式封装
pageview: true
show_date: true
sidebar:
  nav: docs-en-code
---
```java
package com.javaniuniu.scshorlsweb.system.commons;

import java.io.Serializable;

public class MsgResponseBody<T> implements Serializable {
    private static final String SUCCESS = "0";
    private static final String ERROR = "0";
    private String resultCode;
    private T result;

    private MsgResponseBody(String statusCode) {
        this.resultCode = statusCode;
    }

    public static MsgResponseBody success() {
        return new MsgResponseBody("0");
    }

    public static MsgResponseBody error() {
        return new MsgResponseBody("1");
    }

    public static MsgResponseBody error(String errorCode) {
        return new MsgResponseBody(errorCode);
    }

    public String getResultCode() {
        return resultCode;
    }

    public MsgResponseBody setResultCode(String resultCode) {
        this.resultCode = resultCode;
        return this;
    }

    public T getResult() {
        return result;
    }

    public MsgResponseBody setResult(T result) {
        this.result = result;
        return this;
    }
}

```
