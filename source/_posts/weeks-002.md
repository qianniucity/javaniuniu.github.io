---
title: 两数相加-Deploying the ELK Stack on Kubernetes with Helm-Atom-Linux系统简介
date: 2019-10-15 07:27:45
categories: ARTS
tags: [算法,linux]
---
## Algorithm
题目：[两数相加](https://leetcode-cn.com/problems/add-two-numbers/)
```txt
给出两个 非空 的链表用来表示两个非负的整数。其中，它们各自的位数是按照 逆序 的方式存储的，并且它们的每个节点只能存储 一位 数字。
如果，我们将这两个数相加起来，则会返回一个新的链表来表示它们的和。
您可以假设除了数字 0 之外，这两个数都不会以 0 开头
```
题解：
```python
class Solution:
    def addTwoNumbers(self, l1: ListNode, l2: ListNode) -> ListNode:
        re = ListNode(0)
        r =re
        carry = 0
        while(l1 or l2):
            x = l1.val if l1 else 0
            y = l2.val if l2 else 0
            s = carry + x + y
            carry = s//10
            r.next = ListNode(s%10)
            r = r.next
            if(l1 !=None):l1 = l1.next
            if(l2 !=None):l2 = l2.next
        if(carry > 0):
            r.next = ListNode(1)
        return re.next
```
时间复杂度：O(\max(m, n))O(max(m,n))，假设 mm 和 nn 分别表示 l1l1 和 l2l2 的长度，上面的算法最多重复 \max(m, n)max(m,n) 次。

空间复杂度：O(\max(m, n))O(max(m,n))， 新列表的长度最多为 \max(m,n) + 1max(m,n)+1。

## Review
[Deploying the ELK Stack on Kubernetes with Helm](https://logz.io/blog/deploying-the-elk-stack-on-kubernetes-with-helm/)
基于kbs集群部署ELK 并通过Helm 管理ELK
其中包括整个的安装步骤

## Tip
Atom 插件功能丰富。常用markdown 插件作文档编辑，同时配合支持git github markdown预览等插件，特别方便。当然也包括编程插件
[Atom 下载地址](https://atom.io/)
[Atom 插件下载地址](https://atom.io/packages)

## Share
[Linux系统简介](http://c.biancheng.net/linux_tutorial/10/)
