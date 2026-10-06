# 博客示例文章
VitePress 可以渲染Markdown格式文本。

- 列表项目
- **加粗文字**
- 代码块：
```js
console.log("hello vitepress")
```

## 科创粒子动画

<canvas id="kechuang-canvas" style="width:100%;height:360px;border-radius:18px;display:block;box-shadow:0 8px 32px rgba(173,20,87,0.25);"></canvas>

<script setup>
import { onMounted, onUnmounted } from 'vue'

let raf = null

onMounted(() => {
  // 鉴权
  if (localStorage.getItem('blogAuth') !== 'ok') {
    location.replace('./lock.html')
    return
  }

  const canvas = document.getElementById('kechuang-canvas')
  if (!canvas) return
  const ctx = canvas.getContext('2d')

  let W = canvas.parentElement.clientWidth
  let H = 360
  canvas.width = W
  canvas.height = H

  const TEXT = '科创'
  let particles = []
  let phase = 0          // 0:模糊飘散 1:组成文字 2:旋转散开 3:隐匿
  let phaseTime = 0

  // 离屏采样文字像素
  function sampleText() {
    const off = document.createElement('canvas')
    off.width = W
    off.height = H
    const octx = off.getContext('2d')
    octx.fillStyle = '#fff'
    octx.font = `bold ${Math.min(W * 0.32, 160)}px "PingFang SC", "Microsoft YaHei", sans-serif`
    octx.textAlign = 'center'
    octx.textBaseline = 'middle'
    octx.fillText(TEXT, W / 2, H / 2)
    const data = octx.getImageData(0, 0, W, H).data
    particles = []
    for (let y = 0; y < H; y += 3) {
      for (let x = 0; x < W; x += 3) {
        if (data[(y * W + x) * 4 + 3] > 128) {
          particles.push({
            tx: x, ty: y,
            x: Math.random() * W,
            y: Math.random() * H,
            vx: 0, vy: 0,
            size: Math.random() * 1.8 + 0.8,
            color: `hsl(${320 + Math.random() * 30}, 85%, ${62 + Math.random() * 18}%)`,
            opacity: 0
          })
        }
      }
    }
  }

  function drawBackground() {
    const g = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, Math.max(W, H)/1.2)
    g.addColorStop(0, '#2a1040')
    g.addColorStop(1, '#0d0518')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, W, H)
  }

  function animate() {
    drawBackground()
    phaseTime++

    particles.forEach(p => {
      if (phase === 0) {
        // 模糊飘散：缓慢漂移，低透明度
        p.x += (Math.random() - 0.5) * 0.6
        p.y += (Math.random() - 0.5) * 0.6
        p.opacity = Math.min(p.opacity + 0.008, 0.35)
      } else if (phase === 1) {
        // 汇聚成文字
        p.x += (p.tx - p.x) * 0.06
        p.y += (p.ty - p.y) * 0.06
        p.opacity = Math.min(p.opacity + 0.04, 1)
      } else if (phase === 2) {
        // 旋转散开
        const cx = W / 2, cy = H / 2
        const dx = p.x - cx, dy = p.y - cy
        const ang = 0.025
        const nx = dx * Math.cos(ang) - dy * Math.sin(ang)
        const ny = dx * Math.sin(ang) + dy * Math.cos(ang)
        const dist = Math.sqrt(nx*nx + ny*ny) + 0.1
        p.x = cx + nx + (nx / dist) * 1.5
        p.y = cy + ny + (ny / dist) * 1.5
        p.opacity = Math.max(p.opacity - 0.015, 0)
      } else if (phase === 3) {
        // 隐匿于背景
        p.x += p.vx
        p.y += p.vy
        p.opacity = Math.max(p.opacity - 0.02, 0)
      }

      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fillStyle = p.color
      ctx.globalAlpha = p.opacity
      ctx.fill()
    })
    ctx.globalAlpha = 1

    // 阶段切换
    if (phase === 0 && phaseTime > 130) { phase = 1; phaseTime = 0 }
    else if (phase === 1 && phaseTime > 200) { phase = 2; phaseTime = 0 }
    else if (phase === 2 && phaseTime > 110) {
      phase = 3; phaseTime = 0
      particles.forEach(p => {
        const ang = Math.random() * Math.PI * 2
        const spd = 1 + Math.random() * 2.5
        p.vx = Math.cos(ang) * spd
        p.vy = Math.sin(ang) * spd
      })
    }
    else if (phase === 3 && phaseTime > 130) {
      phase = 0; phaseTime = 0
      particles.forEach(p => {
        p.x = Math.random() * W
        p.y = Math.random() * H
        p.opacity = 0
      })
    }

    raf = requestAnimationFrame(animate)
  }

  sampleText()
  animate()

  window.addEventListener('resize', () => {
    W = canvas.parentElement.clientWidth
    canvas.width = W
    sampleText()
  })
})

onUnmounted(() => {
  if (raf) cancelAnimationFrame(raf)
})
</script>
