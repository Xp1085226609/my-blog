import { defineConfig } from 'vitepress'

export default defineConfig({
  base: "/my-blog/",
  title: "我的博客",
  description: 'VitePress个人博客',
  themeConfig: {
    nav: [
      { text: "首页", link: "/" },
      { text: "文章", link: "/article1.html" },
      { text: "标签", link: "/tags.html" },
      { text: "关于", link: "/about.html" },
      { text: "密码验证页", link: "/lock.html" }
    ],
    footer: {
      message: '用 VitePress 搭建的个人博客',
      copyright: '© 2026 我的博客'
    },
    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    }
  }
})
