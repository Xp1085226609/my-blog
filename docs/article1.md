# 博客示例文章
VitePress 可以渲染Markdown格式文本。

- 列表项目
- **加粗文字**
- 代码块：
```js
console.log("hello vitepress")
```

<canvas id="firefly-canvas" style="width:100%;height:420px;border-radius:18px;display:block;box-shadow:0 8px 32px rgba(100,200,120,0.15);"></canvas>

<script setup>
import { onMounted, onUnmounted } from 'vue'

let raf = null

onMounted(() => {
  if (sessionStorage.getItem('blogAuth') !== 'ok') {
    location.replace('./lock.html')
    return
  }

  const canvas = document.getElementById('firefly-canvas')
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  let W = canvas.parentElement.clientWidth
  let H = 420
  canvas.width = W
  canvas.height = H

  // === 预加载森林背景 ===
  const bgImg = new Image()
  bgImg.src = '/my-blog/heart-bg.jpg'

  // === 荧光粒子：在森林里随机飘，不组成任何形状 ===
  class Firefly {
    constructor() {
      this.x = Math.random() * W
      this.y = Math.random() * H
      this.vx = (Math.random() - 0.5) * 0.4
      this.vy = (Math.random() - 0.5) * 0.4
      this.size = Math.random() * 2 + 0.6
      this.hue = 45 + Math.random() * 30
      this.phase = Math.random() * Math.PI * 2
    }
    update() {
      this.x += this.vx + (Math.random() - 0.5) * 0.2
      this.y += this.vy + (Math.random() - 0.5) * 0.2
      if (this.x < 0 || this.x > W) this.vx *= -1
      if (this.y < 0 || this.y > H) this.vy *= -1
    }
  }

  const fireflies = []
  for (let i = 0; i < 80; i++) fireflies.push(new Firefly())

  const FRAME = 60
  let frame = 0

  function drawBackground() {
    if (bgImg.complete && bgImg.naturalWidth > 0) {
      ctx.drawImage(bgImg, 0, 0, W, H)
      ctx.fillStyle = 'rgba(5, 10, 15, 0.25)'
      ctx.fillRect(0, 0, W, H)
    } else {
      ctx.fillStyle = '#0a1510'
      ctx.fillRect(0, 0, W, H)
    }
  }

  function drawDot(x, y, size, color, opacity) {
    ctx.beginPath()
    ctx.arc(x, y, size, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.globalAlpha = opacity
    ctx.shadowBlur = 10
    ctx.shadowColor = color
    ctx.fill()
    ctx.shadowBlur = 0
    ctx.globalAlpha = 1
  }

  function animate() {
    drawBackground()
    frame++
    const time = frame / FRAME

    fireflies.forEach(f => {
      f.update()
      const twinkle = 0.5 + 0.5 * Math.sin(time * 2 * Math.PI + f.phase)
      const opacity = 0.3 + twinkle * 0.6
      drawDot(f.x, f.y, f.size, `hsl(${f.hue},85%,${55 + twinkle*20}%)`, opacity)
    })

    raf = requestAnimationFrame(animate)
  }

  animate()

  window.addEventListener('resize', () => {
    W = canvas.parentElement.clientWidth
    canvas.width = W
  })
})

onUnmounted(() => {
  if (raf) cancelAnimationFrame(raf)
})
</script>
