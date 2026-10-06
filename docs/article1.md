# 博客示例文章
VitePress 可以渲染Markdown格式文本。

- 列表项目
- **加粗文字**
- 代码块：
```js
console.log("hello vitepress")
```

<canvas id="heart-canvas" style="width:100%;height:420px;border-radius:18px;display:block;box-shadow:0 8px 32px rgba(100,200,120,0.15);"></canvas>

<script setup>
import { onMounted, onUnmounted } from 'vue'

let raf = null

onMounted(() => {
  if (sessionStorage.getItem('blogAuth') !== 'ok') {
    location.replace('./lock.html')
    return
  }

  const canvas = document.getElementById('heart-canvas')
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  let W = canvas.parentElement.clientWidth
  let H = 420
  canvas.width = W
  canvas.height = H

  // === 预加载背景图 ===
  const bgImg = new Image()
  bgImg.src = '/my-blog/heart-bg.jpg'

  // === 3D 爱心锚点（参数方程分层采样） ===
  function buildHeartTargets(count) {
    const pts = []
    const layers = 14
    const perLayer = Math.floor(count / layers)
    for (let i = 0; i < layers; i++) {
      const scale = 0.25 + (i / layers) * 0.75
      for (let j = 0; j < perLayer; j++) {
        const t = (j / perLayer) * Math.PI * 2
        const hx = 16 * Math.pow(Math.sin(t), 3)
        const hy = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t)
        const z = (Math.random() - 0.5) * 14
        pts.push({ x: hx * scale * 2.2, y: -hy * scale * 2.2, z: z })
      }
    }
    return pts
  }

  const targets = buildHeartTargets(1200)

  // === 主粒子：飘散位置 + 爱心锚点，按 progress 插值 ===
  class Firefly {
    constructor(target) {
      this.target = target
      this.driftX = Math.random() * W   // 飘散位置
      this.driftY = Math.random() * H
      this.vx = (Math.random() - 0.5) * 0.3  // 飘散速度（比环境粒子稍快一点）
      this.vy = (Math.random() - 0.5) * 0.3
      this.size = Math.random() * 1.8 + 0.8
      this.hue = 45 + Math.random() * 20  // 暖黄萤火色
      this.phase = Math.random() * Math.PI * 2
      this.twinkleSpeed = Math.PI * 2 / 60
    }
    updateDrift() {
      this.driftX += this.vx
      this.driftY += this.vy
      if (this.driftX < 0 || this.driftX > W) this.vx *= -1
      if (this.driftY < 0 || this.driftY > H) this.vy *= -1
    }
  }

  const fireflies = targets.map(t => new Firefly(t))

  // === 环境粒子：始终在全图缓慢飘，不参与组成 ===
  const ambient = []
  for (let i = 0; i < 40; i++) {
    ambient.push({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.15,  // 更慢
      vy: (Math.random() - 0.5) * 0.15,
      size: Math.random() * 1 + 0.4,
      hue: 40 + Math.random() * 30,
      phase: Math.random() * Math.PI * 2
    })
  }

  // === 连续 progress 控制：0=全图飘散，1=组成爱心 ===
  // 时序：飘散2s → 缓慢集结6s → 维持3s → 缓慢散开6s → 循环
  let progress = 0
  let direction = 1  // 1=向爱心汇聚，-1=散开
  let holdFrames = 0
  const FRAME = 60
  const GATHER_SPEED = 1 / (6 * FRAME)   // 6秒从0到1
  const HOLD_FRAMES = 3 * FRAME          // 维持3秒
  const DISPERSE_SPEED = 1 / (6 * FRAME) // 6秒从1到0

  let rotY = 0

  function project3D(p, rot) {
    const cosY = Math.cos(rot), sinY = Math.sin(rot)
    const x = p.x * cosY + p.z * sinY
    const z = -p.x * sinY + p.z * cosY
    const fov = 380
    const s = fov / (fov + z + 180)
    return { sx: W/2 + x*s, sy: H/2 + p.y*s, scale: s, depth: z }
  }

  function drawBackground() {
    if (bgImg.complete && bgImg.naturalWidth > 0) {
      ctx.drawImage(bgImg, 0, 0, W, H)
      // 叠加暗色让粒子更突出
      ctx.fillStyle = 'rgba(5, 10, 15, 0.3)'
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
    ctx.shadowBlur = 8
    ctx.shadowColor = color
    ctx.fill()
    ctx.shadowBlur = 0
    ctx.globalAlpha = 1
  }

  let frame = 0
  function animate() {
    drawBackground()
    frame++
    const time = frame / FRAME

    // === progress 连续变化 ===
    if (direction === 1) {
      progress += GATHER_SPEED
      if (progress >= 1) {
        progress = 1
        direction = 0  // 进入维持
        holdFrames = 0
      }
    } else if (direction === 0) {
      holdFrames++
      if (holdFrames > HOLD_FRAMES) direction = -1
    } else {
      progress -= DISPERSE_SPEED
      if (progress <= 0) {
        progress = 0
        direction = 1  // 重新开始集结
      }
    }

    // 旋转只在接近爱心时明显
    if (progress > 0.3) rotY += 0.006

    // === 环境粒子（始终缓慢飘） ===
    ambient.forEach(p => {
      p.x += p.vx
      p.y += p.vy
      if (p.x < 0 || p.x > W) p.vx *= -1
      if (p.y < 0 || p.y > H) p.vy *= -1
      const tw = 0.3 + 0.5 * (0.5 + 0.5 * Math.sin(time * 2 * Math.PI + p.phase))
      drawDot(p.x, p.y, p.size, `hsl(${p.hue},80%,60%)`, tw * 0.6)
    })

    // === 主粒子：飘散位置和爱心锚点按 progress 插值 ===
    fireflies.forEach(f => {
      f.updateDrift()
      const proj = project3D(f.target, rotY)

      // 插值：progress=0 在飘散位置，progress=1 在爱心位置
      const x = f.driftX * (1 - progress) + proj.sx * progress
      const y = f.driftY * (1 - progress) + proj.sy * progress

      // 闪烁
      const twinkle = 0.5 + 0.5 * Math.sin(time * 2 * Math.PI + f.phase)
      // 组成爱心时更亮更实
      const opacity = (0.25 + twinkle * 0.3) * (1 - progress * 0.3) + progress * 0.7
      const size = f.size * (0.8 + proj.scale * progress * 0.4)

      drawDot(x, y, size, `hsl(${f.hue},85%,${60 + twinkle*15}%)`, Math.min(opacity, 1))
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
