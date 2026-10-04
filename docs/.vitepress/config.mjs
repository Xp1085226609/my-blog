import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "我的个人技术博客",
  themeConfig: {
    nav: [
      { text: "首页", link: "/" },
      { text: "Hello", link: "/hello" }
    ]
  }
})