---
title: Spring Cache – KeyGenerator自定义rediskey
permalink: /java-code-redis/KeyGenerator
tags: Redis
pageview: true
show_date: true
sidebar:
  nav: docs-en-data
---
#### 1. 概述     
在此教程中，我们将演示如何使用 Spring Cache 创建自定义密钥生成器。

#### 2. KeyGenerator     
这负责为缓存中的每个数据项生成每个键，这些键将用于在检索时查找数据项。

此处的默认实现是SimpleKeyGenerator –它使用提供的方法参数来生成密钥。这意味着，如果我们有两个使用相同的缓存名称和参数类型集的方法，则很有可能会导致冲突。

它还意味着缓存数据可以由另一种方法覆盖。

#### 3. 自定义密钥生成器     
密钥生成器只需要实现一个方法：

```java
Object generate(Object object, Method method, Object... params)
```
如果未正确实现或使用，则可能导致覆盖缓存数据。

让我们来看看实现：

```java
public class CustomKeyGenerator implements KeyGenerator {

    public Object generate(Object target, Method method, Object... params) {
        return target.getClass().getSimpleName() + "_"
          + method.getName() + "_"
          + StringUtils.arrayToDelimitedString(params, "_");
    }
}
```
之后，我们有两种可能的方式使用它;第一种是在应用程序Config中声明一个豆。

请务必指出，类必须从缓存配置支持或实现缓存配置程序扩展：
```java
@EnableCaching
@Configuration
public class ApplicationConfig extends CachingConfigurerSupport {

    @Bean
    public CacheManager cacheManager() {
        SimpleCacheManager cacheManager = new SimpleCacheManager();
        Cache booksCache = new ConcurrentMapCache("books");
        cacheManager.setCaches(Arrays.asList(booksCache));
        return cacheManager;
    }

    @Bean("customKeyGenerator")
    public KeyGenerator keyGenerator() {
        return new CustomKeyGenerator();
    }
}
```
第二种方法是将其用于特定方法：

```java
@Component
public class BookService {

    @Cacheable(value = "books", keyGenerator = "customKeyGenerator")
    public List<Book> getBooks() {
        List<Book> books = new ArrayList<>();
        books.add(new Book("The Counterfeiters", "André Gide"));
        books.add(new Book("Peer Gynt and Hedda Gabler", "Henrik Ibsen"));
        return books;
    }
}
```
#### 4. 结论
在本文中，我们探讨了实现自定义春季缓存的密钥生成器的方法。

与往常一样，示例的完整源代码可在 [GitHub](https://github.com/eugenp/tutorials/tree/master/spring-caching) 上找到。
