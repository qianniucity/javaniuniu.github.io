---
title: 两数之和-Amazon Translate-markdown-Nginx
date: 2019-10-14 23:06:11
categories: ARTS
tags: [算法,nginx]
---
## Algorithm
题目：[两数之和](https://leetcode-cn.com/problems/two-sum/)
```txt
给定一个整数数组 nums 和一个目标值 target，请你在该数组中找出和为目标值的那 两个 整数，并返回他们的数组下标。
你可以假设每种输入只会对应一个答案。但是，你不能重复利用这个数组中同样的元素。
```
1. 题解
```python
class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        #num = len(nums);
        for n in range(0,len(nums)):
            #print(n,nums[n]);
            for m in range(n+1,len(nums)):
                #print(n,m,nums[n],nums[m]);
                if nums[n]+nums[m] == target:
                    lis = [];
                    lis.append(n);
                    lis.append(m);
                    return lis;
```
时间复杂度：O(n^2)
空间复杂度：O(1)

2. 官方题解：https://leetcode-cn.com/problems/two-sum/solution/liang-shu-zhi-he-by-leetcode-2/

## Review
[Amazon Translate 新增加一些国家语言](https://aws.amazon.com/cn/blogs/aws/new-languages-for-amazon-translate-greek-hungarian-romanian-thai-ukrainian-urdu-and-vietnamese/)
1. Amazon Translate 新支持两罗马，希腊等国家
2. AT 到目前支持32个国家的语言翻译，Google Translate [支持100多个国家](https://translate.google.com/intl/en/about/languages/)
2. 文章贴除了 AT API 相当简介
3. [Amazon Translate实时翻译连接](https://us-west-2.console.aws.amazon.com/translate/home?region=us-west-2#translation)
4. 翻译无语言输出，有应用集成提示
5. 初步连接，更偏向与B端
6. 以下是 Amazon Translate 支持地区
    亚太区域 (孟买)
    欧洲 (爱尔兰)
    亚太区域 (新加坡)
    亚太区域 (首尔)
    欧洲 (法兰克福)
    亚太区域 (东京)
    美国东部 (弗吉尼亚北部)
    美国东部 (俄亥俄)
    加拿大 (中部)
    美国西部 (俄勒冈)

*顺便说下，aws 技术博客，含有真人语言阅读文章，体验不错*

## Tip
markdown，让我喜欢上记录笔记,向大家推荐
[Markdown基本语法](https://tree.tech/13.html)
## Share
为什么要分享便连接
1. 官网文档都是精华所在，耐着性质看能看懂的
2. 在极刻时间淘辉老师的带领下，学习 [Nginx核心知识100讲](https://time.geekbang.org/course/intro/138)
[nginx.org](http://nginx.org/en/docs/)
