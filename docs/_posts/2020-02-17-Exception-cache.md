---
title: Checked Exception还是Unchecked Exception?
permalink: /java-code-design/Exception
tags: CodeDesign 异常处理 Exception
key: java-code-design-Exception
articles:
  show_excerpt: true
  show_readmore: true
  show_info: true
---
##### 一句话简介
- Checked异常必须被显式地捕获或者传递，如Basic try-catch-finally Exception Handling一文中所说。而unchecked异常则可以不必捕获或抛出。
- Checked异常继承java.lang.Exception类。Unchecked异常继承自java.lang.RuntimeException类。   

```java
  /**
	 * 将反射时的checked exception转换为unchecked exception.
	 */
	public static RuntimeException convertReflectionExceptionToUnchecked(Exception e) {
		if ((e instanceof IllegalAccessException) || (e instanceof IllegalArgumentException)
				|| (e instanceof NoSuchMethodException)) {
			return new IllegalArgumentException(e);
		} else if (e instanceof InvocationTargetException) {
			return new RuntimeException(((InvocationTargetException) e).getTargetException());
		} else if (e instanceof RuntimeException) {
			return (RuntimeException) e;
		}
		return new RuntimeException("Unexpected Checked Exception.", e);
	}

  /**
  	 * 将CheckedException转换为UncheckedException.
  	 */
  	public static RuntimeException unchecked(Throwable ex) {
  		if (ex instanceof RuntimeException) {
  			return (RuntimeException) ex;
  		} else {
  			return new RuntimeException(ex);
  		}
  	}
```
**参考链接**
- [Java异常：选择Checked Exception还是Unchecked Exception?](https://blog.csdn.net/kingzone_2008/article/details/8535287)
