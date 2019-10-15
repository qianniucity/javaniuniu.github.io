# elasticsearch

## elasticsearch
Elasticsearch 是一个分布式、RESTful 风格的搜索和数据分析引擎，能够解决不断涌现出的各种用例。 作为 Elastic Stack 的核心，它集中存储您的数据，帮助您发现意料之中以及意料之外的情况。

## Kibana
通过 Kibana，您可以对自己的 Elasticsearch 进行可视化，还可以在 Elastic Stack 中进行导航，这样您便可以进行各种操作了，从跟踪查询负载，到理解请求如何流经您的整个应用，都能轻松完成。

## Logstash
Logstash 是开源的服务器端数据处理管道，能够同时从多个来源采集数据，转换数据，然后将数据发送到您最喜欢的“存储库”中。

## Beats
Beats 平台集合了多种单一用途数据采集器。它们从成百上千或成千上万台机器和系统向 Logstash 或 Elasticsearch 发送数据。

elasticsearch 和mysql 抽象对比

[对比](./images/Jietu20190924-125116@2x.jpg)

## analysis 分词器

## Search API
```
语法                       范围
/_search                  集群上所有的索引
/index1/_search index1    index1
/index1,index2/_search    index1 和 index2
/index*/_search           以 index 开头的索引
```

## URI Search
- q 指定查询语言。使用 Query String Syntax
- df 默认字段，不指定时，会对所有字段进行查询
- Sort 排序 / from 和 size 用于分页
- Profile 可以查看查询是如何被执行的

## 参考书籍
[Elasticsearch2.0 权威指南（中文版）](https://es.xiaoleilu.com/index.html)
