
## ③ `docs/hello.md`（完整代码）

```markdown
# 你好世界
这是我的第一篇博客文章。

## 内容
VitePress 非常适合搭建个人博客。

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  // 与 lock.html 共用授权，未登录自动跳转密码页
  if (sessionStorage.getItem('blogAuth') !== 'ok') {
    location.replace('./lock.html')
  }
})
</script>
