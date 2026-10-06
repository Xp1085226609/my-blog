# 博客示例文章
VitePress 可以渲染Markdown格式文本。

- 列表项目
- **加粗文字**
- 代码块：
```js
console.log("hello vitepress")
```

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  // 与 lock.html 共用授权，未登录自动跳转密码页
  if (localStorage.getItem('blogAuth') !== 'ok') {
    location.replace('./lock.html')
  }
})
</script>
