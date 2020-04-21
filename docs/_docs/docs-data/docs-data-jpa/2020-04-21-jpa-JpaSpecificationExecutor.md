---
title: jpa-JpaSpecificationExecutor子查询等功能使用
permalink: /docs-data-jpa/JpaSpecificationExecutor
tags: JPA
key: docs-data-jpa-JpaSpecificationExecutor
---
## JpaSpecificationExecutor接口，该接口提供了如下一些方法：
```java
public interface JpaSpecificationExecutor<T> {

    T findOne(Specification<T> spec);//根据sql获取单个对象数据

    List<T> findAll(Specification<T> spec);//根据sql查询所有数据

    Page<T> findAll(Specification<T> spec, Pageable pageable);//根据sql分页查询数据

    List<T> findAll(Specification<T> spec, Sort sort); //根据sql查询数据，并根据参数进行排序

    long count(Specification<T> spec); //根据sql查询数据总数
}
```
## Sort 的构造函数如下

 ```java
//可以输入多个Sort.Order对象，在进行多个值排序时有用
public Sort(Sort.Order... orders);

//和上面的方法一样，无非把多个参数换成了一个List
public Sort(List orders);

//当排序方向固定时，使用这个比较方便，第一个参数是排序方向，第二个开始就是排序的字段.
public Sort(Sort.Direction direction, String... properties);

//第一个参数是排序方向,还有一个方法第二个参数是list，原理相同
public Sort(Direction direction, List<String> properties);
```

## Pageable 是一个接口，提供了分页一组方法的声明，如第几页，每页多少条记录，排序信息等
```java
int getPageNumber();

int getPageSize();

int getOffset();

Sort getSort();

Pageable next();

Pageable previousOrFirst();

Pageable first();

boolean hasPrevious();
```

## PageRequest  它是 Pageable 的实现类，它提供三个构造方法
```java
//这个构造方法构造出来的分页对象不具备排序功能
public PageRequest(int page, int size) {
    this(page, size, (Sort)null);
}
//Direction和properties用来做排序操作
public PageRequest(int page, int size, Direction direction, String... properties) {
    this(page, size, new Sort(direction, properties));
}
//此构造方法是自定义一个排序的操作
public PageRequest(int page, int size, Sort sort) {
    super(page, size);
    this.sort = sort;
}
```
Spring Data Jpa 支持 Criteria 查询方式，使用这种方式需要继承JpaSpecificationExecutor，通过实现 Specification
中的 toPredicate方法来定义动态查询，通过 CriteriaBuilder 来创建查询条件
```java
Specification<User> specification = new Specification<User>(){

    @Override
    public Predicate toPredicate(Root<MessageItem> root, CriteriaQuery<?> query, CriteriaBuilder cb){
    List<Predicate> predicates = new ArrayList<Predicate>();
    //root.get("name")表示获取name这个字段名称,like表示执行like查询,%zt%表示值
    Predicate p1 = cb.like(root.get("name"), "%ray%");
    Predicate p2 = cb.greaterThan(root.get("rid"),"3");
    //将两个查询条件联合起来之后返回Predicate对象
     //建立子查询
     //构建criteriaQuery对象
    CriteriaQuery<Organization> criteriaQuery  = cb.createQuery(Organization.class);
    //获取子查询Subquery对象
    Subquery<Organization> organizationSubQuery = criteriaQuery.subquery(Organization.class);
    //构建新的子查询字段Mapping对象
    Root<Organization> organizationSubRoot =         organizationubQuery.from(Organization.class);
    //相当于sql中的select *，如需获取一个字段可以使用organizationSubRoot.get("字段").as(String.class).
    organizationSubQuery.select(organizationSubRoot);
    Predicate subqueryPredicate = cb.and(cb.equal(organizationSubRoot .get("rid").as(String.class), root.get("rid").as(String.class),
    cb.equal(organizationSubRoot .get("orgName").as(String.class),"部门名称"))；
    //构建where条件
    organizationSubQuery .where(subqueryPredicate);
    // exists的使用
    Predicate p3 = cb.exists(organizationSubQuery);
    //相当于select rid,name...
    query.multiselect(root.get("rid"),root.get("name"));
    Predicate p4 = cb.and(p1,p2,p3);
    predicates.add(p4)
    return query.where(predicates.toArray(new     Predicate[predicates.size()])).getRestriction();

    }
};
```

利用JpaSpecificationExecutor的findAl方法进行分页查询，例子如下：

```java
Order order = new Order(Direction.ASC,"name");
Sort sort = new Sort(order);
Pageable pageable = new PageRequest(page,size,sort);//page从0开始
Page<User> resutls = UserDao.findAll(specification, pageable);
```

PS:其中UserDao需要继承JpaSpecificationExecutor和Repository接口。

其实也可以定义多个 Specification，然后通过 Specifications 对象将其连接起来,复杂sql可以这样做，使代码不会这么臃肿。
```java
//第一个Specification定义了两个or的组合
Specification s1 = new Specification() {
    @Override
    public Predicate toPredicate(Root root, CriteriaQuery criteriaQuery, CriteriaBuilder criteriaBuilder) {
        Predicate p1 = criteriaBuilder.equal(root.get("rid"),"2");
        Predicate p2 = criteriaBuilder.equal(root.get("rid"),"3");
        return criteriaBuilder.or(p1,p2);
    }
};
//第二个Specification定义了两个or的组合
Specification s2 = new Specification() {
    @Override
    public Predicate toPredicate(Root root, CriteriaQuery criteriaQuery, CriteriaBuilder criteriaBuilder) {
        Predicate p1 = criteriaBuilder.like(root.get("name"),"r%");
        Predicate p2 = criteriaBuilder.like(root.get("name"),"a%");
        return criteriaBuilder.or(p1,p2);
    }
};
//通过Specifications将两个Specification连接起来，第一个条件加where，第二个是and
List userList= UserDao.findAll(Specifications.where(s1).and(s2));
```

这个代码生成的 SQL 是
```sql
select * from t_user where (rid='2' or rid='3') and (name like 'r%' or name like 'a%');
```
