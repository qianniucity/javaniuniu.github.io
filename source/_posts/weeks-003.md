---
title: 无重复字符的最长子串-####-有关使用Hexo和GitHub搭建个人博客-####
date: 2019-10-21 21:51:43
categories: ARTS
tags: [算法,linux]
---
## Algorithm
## 题目：[无重复字符的最长子串](https://leetcode-cn.com/problems/longest-substring-without-repeating-characters/)
```txt
给定一个字符串，请你找出其中不含有重复字符的 最长子串 的长度。
```
1.题解
```java
class Solution {
    public int lengthOfLongestSubstring(String s) {
        int n = s.length();
        int ans = 0;
        for(int i=0;i<n;i++)
            for(int j=i+1;j<=n;j++)
                if(allUnique(s,i,j)) ans = Math.max(ans,j-i);
        return ans;
    }

    public boolean allUnique(String s, int start, int end) {
        Set<Character> set = new HashSet<>();
        for (int i = start; i<end;i++) {
            Character ch = s.charAt(i);
            if (set.contains(ch)) return false;
            set.add(ch);
        }
        return true;
    }
}
```
时间复杂度：O(n^3)
空间复杂度：O(min(n, m))


2. 题解

```python
class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        if not s:return 0
        left = 0
        lookup = set()
        n = len(s)
        max_len = 0
        cur_len = 0
        for i in range(n):
            cur_len += 1
            while s[i] in lookup:
                lookup.remove(s[left])
                left += 1
                cur_len -= 1
            if cur_len > max_len:max_len = cur_len
            lookup.add(s[i])
        return max_len
```


```txt
思路：
这道题主要用到思路是：滑动窗口

什么是滑动窗口？

其实就是一个队列,比如例题中的 abcabcbb，进入这个队列（窗口）为 abc 满足题目要求，当再进入 a，队列变成了 abca，这时候不满足要求。所以，我们要移动这个队列！

如何移动？

我们只要把队列的左边的元素移出就行了，直到满足题目要求！

一直维持这样的队列，找出队列出现最长的长度时候，求出解！

时间复杂度：O(n)O(n)
```

## Review


## Tip
[有关使用Hexo和GitHub搭建个人博客](deploy_blog.md)

## Share
