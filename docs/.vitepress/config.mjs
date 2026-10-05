import { defineConfig } from 'vitepress'

export default defineConfig({
  base:"/my-blog/",
  title: "我的博客",
  description: 'VitePress个人博客',
  themeConfig: {
    nav: [
      { text: "首页", link: "/" },
      { text: "文章", link: "/article1.md" },
      { text: "密码验证页", link: "/lock.html" }
    ]
  }
})