# 关于本站 / 技术栈说明

## 为什么做这个博客

作为个人技术博客，核心需求是：**写作简单、加载快、免费托管、版本可追溯**。

## 技术栈选型

| 层级 | 选型 | 理由 |
|---|---|---|
| 框架 | **VitePress**（Vue 3 + Vite SSG） | 基于 Vue 3 的静态站点生成器，Markdown 即写即发，构建产物为纯静态 HTML，无需后端服务器 |
| 渲染 | 静态站点生成（SSG） | 构建时将 `.md` 编译为 HTML，首屏加载极快，SEO 友好 |
| 部署 | **GitHub Pages** | 免费、稳定、全球 CDN 加速 |
| CI/CD | **GitHub Actions** | push 代码后自动构建部署，无需手动操作 |
| 鉴权 | 原生 JS + SHA-256 + sessionStorage | 纯前端密码门，无服务端依赖，每次打开需重新验证 |

## 为什么不用传统前后端

个人技术博客的内容是**静态 Markdown**，不需要实时数据库交互。用 SSG 方案：

- **零运维**：不需要 Node/Java 后端服务器，不需要 MySQL/MongoDB
- **写作即发布**：写 `.md` 文件 → `git push` → GitHub Actions 自动部署
- **版本管理**：Git 天然记录每一篇文章的历史
- **成本为零**：GitHub Pages 完全免费

## 本站核心功能

- Markdown 文章渲染（VitePress 原生支持）
- 密码门鉴权（`lock.html` + SHA-256 哈希校验）
- 深色/浅色模式切换
- 樱花主题 UI（毛玻璃卡片 + 动态背景）
- Canvas 粒子动画（森林萤火效果）
- GitHub Actions 自动 CI/CD
