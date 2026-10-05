# 阶段1：构建阶段，安装依赖并打包VitePress静态页面
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# vitepress打包，输出到 docs/.vitepress/dist
RUN npm run build

# 阶段2：运行阶段，用nginx托管静态网页
FROM nginx:alpine
# 把构建产物复制到nginx网页目录
COPY --from=builder /app/docs/.vitepress/dist /usr/share/nginx/html
# 如果你网站访问路径是 /my-blog/，需要额外配置nginx子路径
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]