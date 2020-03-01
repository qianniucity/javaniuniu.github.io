---
title: Springboot 使用BindingResult校验参数
permalink: /web/Controller/BindingResult
tags: CodeMark
pageview: true
show_date: true
sidebar:
  nav: docs-en-web
---
[配合@Valid一起使用](/Annotation/Valid)

1、创建一个参数对象
```java
import java.util.List;

import javax.validation.constraints.Min;
import javax.validation.constraints.Size;

import org.hibernate.validator.constraints.Email;
import org.hibernate.validator.constraints.NotBlank;
import org.hibernate.validator.constraints.NotEmpty;

public class Parameter {

	@NotEmpty(message="姓名不能为空")
	private String name;

	@Min(value = 18, message = "年龄必须大于18岁")
	private int age;

	@NotEmpty(message="hobbies不能为空")
	private List<String> hobbies;

	@NotBlank(message="账号不能为空")
	private String account;

	@Size(min=5,max=10,message="密码的长度应该在5和10之间")
	private String password;

	@Email(message="邮箱格式错误")
	private String email;

	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public int getAge() {
		return age;
	}
	public void setAge(int age) {
		this.age = age;
	}
	public List<String> getHobbies() {
		return hobbies;
	}
	public void setHobbies(List<String> hobbies) {
		this.hobbies = hobbies;
	}
	public String getAccount() {
		return account;
	}
	public void setAccount(String account) {
		this.account = account;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
}
```
2、controller控制层写参数接收的入口，需要注意的是@Valid 和 BindingResult 是一 一对应的，如果有多个@Valid，那么每个@Valid后面都需要添加BindingResult用于接收bean中的校验信息

```java
@RequestMapping(value = "/test", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
public @ResponseBody ResponseEntity<Pesponsibles> testBindingResult(@Valid @RequestBody Parameter parameter,BindingResult bindingResult)
			{
		log.info("test start");
		Pesponsibles pesponsibles=new Pesponsibles();
		if(bindingResult.hasErrors()){
			 List<FieldError> fieldErrors = bindingResult.getFieldErrors();
			 fieldErrors.forEach(fieldError -> {
                   //日志打印不符合校验的字段名和错误提示
                   log.error("error field is : {} ,message is : {}", fieldError.getField(), fieldError.getDefaultMessage());
                 });
			 for(int i=0;i<fieldErrors.size();i++){
                    //控制台打印不符合校验的字段名和错误提示
			System.out.println("error field is :"+fieldErrors.get(i).getField()+",message is :"+fieldErrors.get(i).getDefaultMessage());
			 }
			// pesponsibles.setError_msg(fieldErrors);
			return new ResponseEntity<>(pesponsibles, HttpStatus.BAD_REQUEST);
		}
		return new ResponseEntity<>(pesponsibles, HttpStatus.OK);
}


```

3、常用校验注解
```
@Null 只能是null
@NotNull 不能为null 注意用在基本类型上无效，基本类型有默认初始值
@AssertFalse 必须为false
@AssertTrue 必须是true

字符串/数组/集合检查：(字符串本身就是个数组)
@Pattern(regexp="reg") 验证字符串满足正则
@Size(max, min) 验证字符串、数组、集合长度范围
@NotEmpty 验证字符串不为空或者null
@NotBlank 验证字符串不为null或者trim()后不为空

数值检查：同时能验证一个字符串是否是满足限制的数字的字符串
@Max 规定值得上限int
@Min 规定值得下限
@DecimalMax("10.8") 以传入字符串构建一个BigDecimal，规定值要小于这个值 
@DecimalMin 可以用来限制浮点数大小
@Digits(int1, int2) 限制一个小数，整数精度小于int1；小数部分精度小于int2
@Digits 无参数，验证字符串是否合法
@Range(min=long1,max=long2) 检查数字是否在范围之间
这些都包括边界值

日期检查：Date/Calendar
@Post 限定一个日期，日期必须是过去的日期
@Future 限定一个日期，日期必须是未来的日期

其他验证：
@Vaild 递归验证，用于对象、数组和集合，会对对象的元素、数组的元素进行一一校验
@Email 用于验证一个字符串是否是一个合法的右键地址，空字符串或null算验证通过
@URL(protocol=,host=,port=,regexp=,flags=) 用于校验一个字符串是否是合法UR

```
