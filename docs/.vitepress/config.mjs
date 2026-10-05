import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "我的博客",
  description: "个人博客站点",
  themeConfig: {
    nav: [
      { text: "首页", link: "/" },
      { text: "文章", link: "/article1.md" }
    ]
  }
})