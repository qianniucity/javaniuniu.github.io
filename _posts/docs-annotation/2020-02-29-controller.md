---
title: Controller和@RestController的区别？
permalink: /Annotation/Annotation/Controller
tags: 注解
key: Annotation-Annotation-Controller
---

**知识点**：`@RestController`注解相当于`@ResponseBody ＋ @Controller`合在一起的作用。

1) **如果只是使用@RestController注解Controller，则Controller中的方法无法返回jsp页面，或者html，配置的视图解析器 InternalResourceViewResolver不起作用，返回的内容就是Return 里的内容。**

2) **如果需要返回到指定页面，则需要用 @Controller配合视图解析器InternalResourceViewResolver才行。如果需要返回JSON，XML或自定义mediaType内容到页面，则需要在对应的方法上加上@ResponseBody注解。**

例如：

1.使用@Controller 注解，在对应的方法上，视图解析器可以解析return 的jsp,html页面，并且跳转到相应页面

若返回json等内容到页面，则需要加@ResponseBody注解


```java
@CrossOrigin
@Controller
public class FileUploadController {
  //跳转到上传文件的页面
  @RequestMapping(value="/gouploadimg", method = RequestMethod.GET)
  public String goUploadImg() {
    //跳转到 templates 目录下的 uploadimg.html
    return "uploadimg";
  }

  //处理文件上传
  @RequestMapping(value="/testuploadimg", method = RequestMethod.POST)
  public @ResponseBody String uploadImg(@RequestParam("file") MultipartFile file,
  HttpServletRequest request) {
    System.out.println("调用文件上传方法");
    String contentType = file.getContentType();
    String fileName = file.getOriginalFilename();
    。。。
  }
}
```


2.@RestController注解，相当于@Controller+@ResponseBody两个注解的结合，返回json数据不需要在方法前面加@ResponseBody注解了，但使用@RestController这个注解，就不能返回jsp,html页面，视图解析器无法解析jsp,html页面


```java
@CrossOrigin
@RestController /* @Controller + @ResponseBody*/
public class HospitalController {

    //注入Service服务对象
    @Autowired
    private HospitalService hospitalService;

    /**
     * 查询所有医院信息（未分页）
     */

    @RequestMapping(value = "findAllHospital",method = RequestMethod.GET)
    public  List<Hospital> findAllHospital(){
        List<Hospital> hospitalList= hospitalService.findAllHospital();
        return hospitalList;
    }
```
