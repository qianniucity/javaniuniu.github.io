---
title: Dozer BeanMapper 对象转换
permalink: /goodjavacode/BeanMapper
tags: J2ee 对象转换 CodeDesign
pageview: true
show_date: true
sidebar:
  nav: docs-en-code
---
#### dozer是什么？

在开发过程中，常常会涉及到对象之间的转换，bean到dto到vo等等，dozer便是很好的一个对象转换的组件。它可以将一个对象递归拷贝到另外一个对象。既支持简单的对象映射，也支持复杂的对象映射。

#### 对象映射

dozer支持两种映射方式，调用api的简单映射方式和使用xml的映射方式。api调用的方式约束我们定义的 `两个bean中的成员变量名要一样`，方便自动映射，至于类型可以不一样，比如类A的成员变量 Integer num 和类B的 String num 是可以直接映射的。xml的方式是通过编写xml文件来定义映射规则。

#### dozer使用

使用dozer时，只需要加上dozer的依赖即可，下面以maven为例（版本号可以根据最新的做修改）：
```xmlns
<dependency>
    <groupId>com.github.dozermapper</groupId>
    <artifactId>dozer-core</artifactId>
    <version>6.2.0</version>
</dependency>
```

#### 实例
```java
/**
 * @Title: EntityObjectConverter.java
 * @Package com.joyce.util
 * @Copyright: Copyright (c) 2013
 *
 * @author Comsys-LZP
 * @date 2013-11-4 上午09:55:14
 * @version V2.0
 */
package com.joyce.util;

import java.util.ArrayList;
import java.util.List;

import net.sf.dozer.util.mapping.DozerBeanMapper;

/**
 * @Description: 两个对象间，相同属性名之间进行转换
 *
 * @ClassName: EntityObjectConverter
 * @Copyright: Copyright (c) 2013
 *
 * @author Comsys-LZP
 * @date 2013-11-4 上午09:55:14
 * @version V2.0
 */
public class EntityObjectConverter {
	/*
	 * 实例化对象
	 */
	private static DozerBeanMapper map = new DozerBeanMapper();

	/**
	 * @Description: 将目标对象转换为指定对象，相同属性名进行属性值复制
	 *
	 * @Title: EntityObjectConverter.java
	 * @Copyright: Copyright (c) 2013
	 *
	 * @author Comsys-LZP
	 * @date 2013-11-4 下午02:32:34
	 * @version V2.0
	 */
	@SuppressWarnings("unchecked")
	public static <T> T getObject(Object source,Class<T> cls){
		if (source==null) {
			return null;
		}
		return (T) map.map(source, cls);
	}

	/**
	 * @Description: 两个对象之间相同属性名的属性值复制
	 *
	 * @Title: EntityObjectConverter.java
	 * @Copyright: Copyright (c) 2013
	 *
	 * @author Comsys-LZP
	 * @date 2013-11-4 下午02:33:56
	 * @version V2.0
	 */
	public static void setObject(Object source,Object target){
		map.map(source, target);
	}

	/**
	 * @Description: 对象集合中对象相同属性名的属性值复制
	 *
	 * @Title: EntityObjectConverter.java
	 *
	 * @Copyright: Copyright (c) 2013
	 * @author Comsys-LZP
	 * @date 2013-11-4 下午02:34:26
	 * @version V2.0
	 */
	@SuppressWarnings("unchecked")
	public static List getList(List source,Class cls){
		List listTarget = new ArrayList();
		if(source != null){
			for (Object object : source) {
				Object objTarget = EntityObjectConverter.getObject(object, cls);
				listTarget.add(objTarget);
			}
		}
		return listTarget;
	}
}

```
