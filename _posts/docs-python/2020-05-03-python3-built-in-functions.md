---
title: Python3 内置函数
permalink: /python3/built/in/functions
tags: python
key: python3-built-in-functions
---

### 参考链接
[菜鸟Python3 内置函数](https://www.runoob.com/python3/python3-built-in-functions.html)

### zip()
```
zip() 函数用于将可迭代的对象作为参数，将对象中对应的元素打包成一个个元组，然后返回由这些元组组成的列表。
如果各个迭代器的元素个数不一致，则返回列表长度与最短的对象相同，利用 * 号操作符，可以将元组解压为列表。
```

### divmod()
```
Python divmod() 函数接收两个数字类型（非复数）参数，返回一个包含商和余数的元组(a // b, a % b)。
```

### List  pop()
```
pop() 函数用于移除列表中的一个元素（默认最后一个元素），并且返回该元素的值。
可以通过 list.pop(index) index 表示下标，意思是删除指定位置的值 并返回
```

### List  remove()
```
remove() 函数用于移除列表中某个值的第一个匹配项。
list.remove('abc')
```

### 通过 self.属性 self.函数 来调用外部的属性或函数
```python
class Solution:
    cur = float("-inf")
    def isValidBST(self, root: TreeNode) -> bool:
        if root is None:
            return True
        # 访问左子树
        if  not self.isValidBST(root.left):
            return False
        # 访问当前节点：如果当前节点小于等于中序遍历的前一个节点，说明不满足BST，返回 false；否则继续遍历。
        if (root.val <= self.cur):
            return False
        self.cur = root.val
        # 访问右子树
        return self.isValidBST(root.right)
```
