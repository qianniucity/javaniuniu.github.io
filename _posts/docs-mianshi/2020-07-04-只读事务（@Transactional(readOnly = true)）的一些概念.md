---
title: 只读事务（@Transactional(readOnly = true)）的一些概念
permalink: /mianshi/Transactional/0704/05
tags: 面试题
key: mianshi-2020-07-04-04
---

念：从这一点设置的时间点开始（时间点a）到这个事务结束的过程中，其他事务所提交的数据，该事务将看不见！（查询中不会出现别人在时间点a之后提交的数据）



应用场合：

如果你一次执行单条查询语句，则没有必要启用事务支持，数据库默认支持SQL执行期间的读一致性；
如果你一次执行多条查询语句，例如统计查询，报表查询，在这种场景下，多条查询SQL必须保证整体的读一致性，否则，在前条SQL查询之后，后条SQL查询之前，数据被其他用户改变，则该次整体的统计查询将会出现读数据不一致的状态，此时，应该启用事务支持。
【注意是一次执行多次查询来统计某些信息，这时为了保证数据整体的一致性，要用只读事务】



怎样设置：

对于只读查询，可以指定事务类型为readonly，即只读事务。
由于只读事务不存在数据的修改，因此数据库将会为只读事务提供一些优化手段，例如Oracle对于只读事务，不启动回滚段，不记录回滚log。

（1）在JDBC中，指定只读事务的办法为： connection.setReadOnly(true);

（2）在Hibernate中，指定只读事务的办法为： session.setFlushMode(FlushMode.NEVER);
此时，Hibernate也会为只读事务提供Session方面的一些优化手段

（3）在Spring的Hibernate封装中，指定只读事务的办法为： bean配置文件中，prop属性增加“readOnly”
或者用注解方式@Transactional(readOnly=true)
【 if the transaction is marked as read-only, Spring will set the Hibernate Session’s flush mode to FLUSH_NEVER,
and will set the JDBC transaction to read-only】也就是说在Spring中设置只读事务是利用上面两种方式



在将事务设置成只读后，相当于将数据库设置成只读数据库，此时若要进行写的操作，会出现错误
