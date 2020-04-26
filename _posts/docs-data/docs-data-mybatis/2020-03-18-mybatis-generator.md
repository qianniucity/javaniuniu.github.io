---
title: 利用mybatis-generator自动生成代码
permalink: /java-code-mybatis/mybatis-generator
tags: 工具类 Mybatis
key: java-code-mybatis-mybatis-generator
---

### 1、mybatis-generator 概述
MyBatis官方提供了逆向工程 mybatis-generator，可以针对数据库表自动生成MyBatis执行所需要的代码（如Mapper.java、Mapper.xml、POJO）。mybatis-generator 有三种用法：命令行、eclipse插件、maven插件。而maven插件的方式比较通用，本文也将概述maven插件的使用方式。

### 2、pom.xml中配置plugin
（官方文档：[Running MyBatis Generator With Maven](http://www.mybatis.org/generator/running/runningWithMaven.html)）
```xml
<build>
        <plugins>
            <plugin>
                <groupId>org.mybatis.generator</groupId>
                <artifactId>mybatis-generator-maven-plugin</artifactId>
                <version>1.3.7</version>
                <configuration>
                    <configurationFile>
                        mybatis-generator/generatorConfig.xml
                    </configurationFile>
                    <overwrite>true</overwrite>
                    <verbose>true</verbose>
                </configuration>
                <dependencies>
                    <dependency>
                        <groupId>mysql</groupId>
                        <artifactId>mysql-connector-java</artifactId>
                        <version>5.1.47</version>
                    </dependency>
                    <dependency>
                        <groupId>com.itfsw</groupId>
                        <artifactId>mybatis-generator-plugin</artifactId>
                        <version>1.3.8</version>
                    </dependency>
                </dependencies>
            </plugin>
        </plugins>
    </build>
```
### 3、generatorConfig.xml配置文件
（官方文档：[MyBatis GeneratorXML Configuration File Reference](http://www.mybatis.org/generator/configreference/xmlconfig.html)）
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE generatorConfiguration
        PUBLIC "-//mybatis.org//DTD MyBatis Generator Configuration 1.0//EN"
        "http://mybatis.org/dtd/mybatis-generator-config_1_0.dtd">

<generatorConfiguration>

    <context id="mysqlgenerator" targetRuntime="MyBatis3">
      <property name="autoDelimitKeywords" value="true"/>
      <!--可以使用``包括字段名，避免字段名与sql保留字冲突报错-->
      <property name="beginningDelimiter" value="`"/>
      <property name="endingDelimiter" value="`"/>

      <!-- 自动生成toString方法 -->
      <plugin type="org.mybatis.generator.plugins.ToStringPlugin"/>
      <!-- 自动生成equals方法和hashcode方法 -->
      <plugin type="org.mybatis.generator.plugins.EqualsHashCodePlugin"/>

      <!-- 非官方插件 https://github.com/itfsw/mybatis-generator-plugin -->
      <!-- 查询单条数据插件 -->
      <plugin type="com.itfsw.mybatis.generator.plugins.SelectOneByExamplePlugin"/>
      <!-- MySQL分页插件 -->
      <plugin type="com.itfsw.mybatis.generator.plugins.LimitPlugin"/>
      <!-- 查询结果选择性返回插件 -->
      <plugin type="com.itfsw.mybatis.generator.plugins.SelectSelectivePlugin"/>
      <!-- Example Criteria 增强插件 -->
      <plugin type="com.itfsw.mybatis.generator.plugins.ExampleEnhancedPlugin"/>
      <!-- 数据Model属性对应Column获取插件 -->
      <plugin type="com.itfsw.mybatis.generator.plugins.ModelColumnPlugin"/>
      <!-- 逻辑删除插件 需配合数据库有对应的字段-->
      <plugin type="com.itfsw.mybatis.generator.plugins.LogicalDeletePlugin">
          <!-- 这里配置的是全局逻辑删除列和逻辑删除值，当然在table中配置的值会覆盖该全局配置 -->
          <!-- 逻辑删除列类型只能为数字、字符串或者布尔类型 -->
          <property name="logicalDeleteColumn" value="deleted"/>
          <!-- 逻辑删除-已删除值 -->
          <property name="logicalDeleteValue" value="1"/>
          <!-- 逻辑删除-未删除值 -->
          <property name="logicalUnDeleteValue" value="0"/>
      </plugin>

        <!-- Example 目标包修改插件 -->
        <plugin type="com.itfsw.mybatis.generator.plugins.ExampleTargetPlugin">
            <!-- 修改Example类生成到目标包下 -->
            <property name="targetPackage" value="org.linlinjava.litemall.db.domain.example"/>
        </plugin>

        <!-- 是否去除自动生成的注释 true：是 ： false:否 -->
        <commentGenerator>
            <property name="suppressDate" value="true"/>
            <property name="suppressAllComments" value="true"/>
        </commentGenerator>

        <!--数据库连接信息-->
        <jdbcConnection driverClass="com.mysql.jdbc.Driver"
                        connectionURL="jdbc:mysql://127.0.0.1:3306/litemall?useUnicode=true&amp;characterEncoding=UTF-8&amp;serverTimezone=UTC&amp;verifyServerCertificate=false&amp;useSSL=false"
                        userId="litemall"
                        password="litemall123456"/>

        <javaTypeResolver>
            <property name="useJSR310Types" value="true"/>
        </javaTypeResolver>

        <javaModelGenerator targetPackage="org.linlinjava.litemall.db.domain" targetProject="src/main/java"/>
        <sqlMapGenerator targetPackage="org.linlinjava.litemall.db.mapper" targetProject="src/main/resources"/>
        <javaClientGenerator type="XMLMAPPER" targetPackage="org.linlinjava.litemall.db.mapper"
                             targetProject="src/main/java"/>
        <!--表名-->
        <table tableName="litemall_ad">
            <generatedKey column="id" sqlStatement="MySql" identity="true"/>
        </table>
        <table tableName="litemall_address">
            <generatedKey column="id" sqlStatement="MySql" identity="true"/>
        </table>
        <table tableName="litemall_admin">
            <generatedKey column="id" sqlStatement="MySql" identity="true"/>
            <columnOverride column="role_ids" javaType="java.lang.Integer[]"
                            typeHandler="org.linlinjava.litemall.db.mybatis.JsonIntegerArrayTypeHandler"/>
        </table>
        <table tableName="litemall_goods">
            <generatedKey column="id" sqlStatement="MySql" identity="true"/>
            <columnOverride column="gallery" javaType="java.lang.String[]"
                            typeHandler="org.linlinjava.litemall.db.mybatis.JsonStringArrayTypeHandler"/>
        </table>
        <table tableName="litemall_goods_product">
            <generatedKey column="id" sqlStatement="MySql" identity="true"/>
            <columnOverride column="specifications" javaType="java.lang.String[]"
                            typeHandler="org.linlinjava.litemall.db.mybatis.JsonStringArrayTypeHandler"/>
        </table>
        <table tableName="litemall_issue">
            <generatedKey column="id" sqlStatement="MySql" identity="true"/>
        </table>

        <table tableName="litemall_order_goods">
            <generatedKey column="id" sqlStatement="MySql" identity="true"/>
            <columnOverride column="specifications" javaType="java.lang.String[]"
                            typeHandler="org.linlinjava.litemall.db.mybatis.JsonStringArrayTypeHandler"/>
            <columnOverride column="comments" javaType="java.lang.Integer[]"
                            typeHandler="org.linlinjava.litemall.db.mybatis.JsonIntegerArrayTypeHandler"/>

        </table>
        <table tableName="litemall_topic">
            <generatedKey column="id" sqlStatement="MySql" identity="true"/>
            <columnOverride column="goods" javaType="java.lang.Integer[]"
                            typeHandler="org.linlinjava.litemall.db.mybatis.JsonIntegerArrayTypeHandler"/>
        <table tableName="litemall_coupon">
            <generatedKey column="id" sqlStatement="MySql" identity="true"/>
            <columnOverride column="goods_value" javaType="java.lang.Integer[]"
                            typeHandler="org.linlinjava.litemall.db.mybatis.JsonIntegerArrayTypeHandler"/>
        </table>
        <table tableName="litemall_notice_admin">
            <generatedKey column="id" sqlStatement="MySql" identity="true"/>
        </table>
        <table tableName="litemall_aftersale">
            <generatedKey column="id" sqlStatement="MySql" identity="true"/>
            <columnOverride column="pictures" javaType="java.lang.String[]"
                            typeHandler="org.linlinjava.litemall.db.mybatis.JsonStringArrayTypeHandler"/>
        </table>
    </context>
</generatorConfiguration>
```

参考文档
- [利用mybatis-generator自动生成代码](https://www.cnblogs.com/deng-cc/p/9340748.html)
- [mybatis generator columnOverride](https://blog.csdn.net/john1337/article/details/87286571)
- [使用mybatis-generator生成Mybatis代码](https://blog.csdn.net/AOBO516/article/details/90245203)
- [Mybatis对于类转换器TypeHandler的简单使用](https://blog.csdn.net/java_tzx/article/details/82147032)
- [mybatis-generator-plugin](https://github.com/itfsw/mybatis-generator-plugin)
