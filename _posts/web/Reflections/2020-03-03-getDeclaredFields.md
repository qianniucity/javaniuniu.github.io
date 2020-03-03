---
title: JAVA反射中的getFields()方法和getDeclaredFields ()方法的区别
permalink: /web/Reflections/方法和getDeclaredFields
tags: CodeMark 反射类 工具类
pageview: true
show_date: true
sidebar:
  nav: docs-en-web
---
关于获取类的字段有两种方式：getFields()和getDeclaredFields()。我们先来看看这两者的区别吧：

getFields()：获得某个类的所有的公共（public）的字段，包括父类中的字段。
getDeclaredFields()：获得某个类的所有声明的字段，即包括public、private和proteced，但是不包括父类的申明字段。

同样类似的还有getConstructors()和getDeclaredConstructors()、getMethods()和getDeclaredMethods()，这两者分别表示获取某个类的方法、构造函数。

具体编码如下：

我们先创建一个POJO

```java
public class User {
	private long id;
	private String name;

	public void setId(long id) {
		this.id = id;
	}

	public void setName(String name) {
		this.name = name;
	}

	public long getId() {
		return id;
	}

	public String getName() {
		return name;
	}
}

```
再来获取此类中的所有字段
Field[] fields = User.class.getDeclaredFields();
获取字段的名称

String fieldName = field.getName();

获取字段的修饰符

int fieldValue = field.getModifiers();//如：private、static、final等

与某个具体的修饰符进行比较

Modifier.isStatic(fieldValue)//看此修饰符是否为静态(static)

获取字段的声明类型

field.getType()；//返回的是一个class

与某个类型进行比较

field.getType() == Timestamp.class

获取指定对象中此字段的值

Object fieldObject= field.get(user);//user可以看做是从数据库中查找出来的对象



如果POJO类中有一个集合类型的字段，我们该如何获取字段中中的值呢？

首先创建一个POJO类

```java
public class Bean {

	private String[] love;

	public String[] getLove() {
		return love;
	}

	public void setLove(String[] love) {
		this.love = love;
	}
}

```

创建一个操作类

```java
import java.lang.reflect.Method;

public class Admin {

	public static void main(String[] args) {

		try {

			// 赋值
			Object obj = Bean.class.newInstance();
			Class paramClass = Class.forName("[Ljava.lang.String;");
			String[] param = { "吃", "喝", "玩", "乐" };
			Method method = Bean.class.getMethod("setLove", paramClass);
			method.invoke(obj, (Object) param);

			// 取值
			Bean bean = (Bean) obj;
			for (int i = 0; i < bean.getLove().length; i++) {
				System.out.println(bean.getLove()[i]);
			}
			System.out.println();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}


```

得到的结果为：
吃
喝
玩
乐

关于field还有一种情况我们需要注意，就是当字段修饰符为private时，我们需要加上：

field.setAccessible(true);

判断方法是：if (!field.isAccessible())

更详细的解释请点击



接下来补充一下在Java中使用正则表达式

先创建一个正则表达式对象

Pattern pattern = Pattern.compile("[A-Z][a-z]* ");

指定为字符串的正则表达式必须首先被编译为此类的实例

Matcher matcher = pattern.matcher(fieldName);

尝试查找与该模式匹配的输入序列的下一个子序列

boolean isMatcher = matcher.find();

返回由以前匹配操作所匹配的输入子序列

String str = matcher.group();

实现非终端添加和替换步骤,以'_ '连接各个字段

matcher.appendReplacement(sb, str + "_ ");
