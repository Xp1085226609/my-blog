---
---
# 欢迎来到我的博客
这是基于VitePress搭建的个人技术静态博客。

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  // 去掉localStorage判断，每次页面加载都弹出密码
  const pwd = prompt("请输入访问密码")
  if(pwd === "123456"){
    // 不再存储授权记录
  }else{
    document.body.innerHTML = "<h1 style='text-align:center;margin-top:100px'>密码错误，拒绝访问</h1>"
  }
})
</script>

## 项目功能
1. Markdown文章渲染
2. 顶部导航栏
3. 页面访问鉴权演示

## 文章入口
- [查看第一篇文章](./article1.md)