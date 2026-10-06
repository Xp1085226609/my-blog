---
---
# 欢迎来到我的博客
这是基于VitePress搭建的个人技术静态博客。

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  // 未通过 lock.html 验证则跳转密码页（与 lock.html 共用 localStorage 授权，登录一次全站免重复输入）
  if (localStorage.getItem('blogAuth') !== 'ok') {
    location.replace('./lock.html')
  }
})
</script>

## 项目功能
1. Markdown文章渲染
2. 顶部导航栏
3. 页面访问鉴权演示

## 文章入口
- [查看第一篇文章](./article1.md)
