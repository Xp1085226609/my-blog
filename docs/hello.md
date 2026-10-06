---
tags: [随笔, VitePress]
---

# 你好世界

这是我的第一篇博客文章。

## 内容

VitePress 非常适合搭建个人博客：

- 纯 Markdown 写作，无需写 HTML
- 构建产物是纯静态文件，加载极快
- 免费部署在 GitHub Pages

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  if (sessionStorage.getItem('blogAuth') !== 'ok') {
    location.replace('./lock.html')
  }
})
</script>
