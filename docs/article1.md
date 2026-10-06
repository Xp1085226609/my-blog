# 博客示例文章
VitePress 可以渲染Markdown格式文本。

- 列表项目
- **加粗文字**
- 代码块：
```js
console.log("hello vitepress")
```

<canvas id="heart-canvas" style="width:100%;height:420px;border-radius:18px;display:block;box-shadow:0 8px 32px rgba(255,100,150,0.2);"></canvas>

<script setup>
import { onMounted, onUnmounted } from 'vue'

let raf = null

onMounted(() => {
  if (localStorage.getItem('blogAuth') !== 'ok') {
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

  // === 3D 爱心点云（参数方程分层采样，描点清晰） ===
  function buildHeartPoints(count) {
    const pts = []
    const layers = 14  // 从内到外14层爱心轮廓
    const perLayer = Math.floor(count / layers)
    for (let i = 0; i < layers; i++) {
      const scale = 0.25 + (i / layers) * 0.75
      for (let j = 0; j < perLayer; j++) {
        const t = (j / perLayer) * Math.PI * 2
        // 经典爱心参数方程
        const hx = 16 * Math.pow(Math.sin(t), 3)
        const hy = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t)
        const z = (Math.random() - 0.5) * 14
        pts.push({
          x: hx * scale * 2.2,
          y: -hy * scale * 2.2,
          z: z
        })
      }
    }
    return pts
  }

  const heartTargets = buildHeartPoints(1500)

  // === 预加载背景图 ===
  const bgImg = new Image()
  bgImg.src = '/my-blog/heart-bg.jpg'

  // === 主粒子：萤火 + 组爱心 ===
  class Firefly {
    constructor() {
      this.reset()
      this.phase = Math.random() * Math.PI * 2
      this.twinkleSpeed = Math.PI * 2 / 60  // 1秒闪烁周期（60帧）
      this.size = Math.random() * 2 + 1
      this.hue = 330 + Math.random() * 30
      this.sat = 85 + Math.random() * 15
      this.lum = 60 + Math.random() * 20
    }
    reset() {
      this.x = Math.random() * W
      this.y = Math.random() * H
      this.vx = (Math.random() - 0.5) * 0.4
      this.vy = (Math.random() - 0.5) * 0.4
      this.opacity = 0
      this.target = null
    }
    setTarget(t) { this.target = t }
  }

  const fireflies = heartTargets.map((t, i) => {
    const f = new Firefly()
    f.setTarget(t)
    return f
  })

  // === 贴地飞行的环境粒子（少量，不死感） ===
  const groundBugs = []
  for (let i = 0; i < 25; i++) {
    groundBugs.push({
      x: Math.random() * W,
      y: H * 0.75 + Math.random() * H * 0.2,
      vx: (Math.random() - 0.5) * 1.2,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 1.2 + 0.5,
      phase: Math.random() * Math.PI * 2,
      hue: 40 + Math.random() * 20  // 偏暖黄
    })
  }

  // === 动画阶段 ===
  // 0:萤火闪烁(5秒) 1:缓慢汇聚爱心(4秒) 2:维持旋转(3.5秒) 3:散开隐匿(2秒)
  let phase = 0
  let frame = 0
  let rotY = 0
  const FRAME = 60
  const PHASE_FRAMES = [5 * FRAME, 4 * FRAME, 3.5 * FRAME, 2 * FRAME]

  function project3D(p, rot) {
    const cosY = Math.cos(rot), sinY = Math.sin(rot)
    const x = p.x * cosY + p.z * sinY
    const z = -p.x * sinY + p.z * cosY
    const fov = 380  // 透视更强，近大远小
    const s = fov / (fov + z + 180)
    return {
      sx: W / 2 + x * s,
      sy: H / 2 + p.y * s,
      scale: s,
      depth: z
    }
  }

  function drawBackground() {
    if (bgImg.complete && bgImg.naturalWidth > 0) {
      ctx.drawImage(bgImg, 0, 0, W, H)
      // 叠加一层半透明暗色让粒子更突出
      ctx.fillStyle = 'rgba(10, 5, 20, 0.35)'
      ctx.fillRect(0, 0, W, H)
    } else {
      const g = ctx.createRadialGradient(W/2, H*0.4, 0, W/2, H/2, Math.max(W, H))
      g.addColorStop(0, '#1a0f2e')
      g.addColorStop(1, '#050310')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, W, H)
    }
  }

  function drawParticle(x, y, size, color, opacity) {
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
    const time = frame / FRAME  // 秒

    // === 贴地飞行粒子（始终无规则飘） ===
    groundBugs.forEach(b => {
      b.x += b.vx
      b.y += b.vy
      if (b.x < 0 || b.x > W) b.vx *= -1
      if (b.y < H*0.7 || b.y > H*0.95) b.vy *= -1
      const tw = 0.3 + 0.5 * (0.5 + 0.5 * Math.sin(time * 2 * Math.PI + b.phase))
      drawParticle(b.x, b.y, b.size, `hsl(${b.hue},90%,65%)`, tw * 0.7)
    })

    // === 阶段切换 ===
    if (frame > PHASE_FRAMES.slice(0, phase + 1).reduce((a,b) => a+b, 0)) {
      phase++
      if (phase >= 4) {
        phase = 0
        frame = 0
        fireflies.forEach(f => f.reset())
      }
    }

    // === 主粒子 ===
    fireflies.forEach(f => {
      let twinkle = 0.5 + 0.5 * Math.sin(time * 2 * Math.PI + f.phase)

      if (phase === 0) {
        // 萤火闪烁：无规则漂移，一闪一闪
        f.x += f.vx + (Math.random() - 0.5) * 0.3
        f.y += f.vy + (Math.random() - 0.5) * 0.3
        f.opacity = Math.min(f.opacity + 0.02, 0.3 + twinkle * 0.5)
      } else if (phase === 1) {
        // 缓慢组成爱心（3D投影目标点）
        const proj = project3D(f.target, rotY)
        f.x += (proj.sx - f.x) * 0.025
        f.y += (proj.sy - f.y) * 0.025
        f.opacity = Math.min(f.opacity + 0.02, 1)
      } else if (phase === 2) {
        // 维持展示：爱心缓慢旋转
        rotY += 0.008
        const proj = project3D(f.target, rotY)
        f.x = proj.sx
        f.y = proj.sy
        f.opacity = 0.9 + twinkle * 0.1
      } else if (phase === 3) {
        // 散开隐匿
        f.x += (Math.random() - 0.5) * 2
        f.y += (Math.random() - 0.5) * 2 - 0.3
        f.opacity = Math.max(f.opacity - 0.015, 0)
      }

      const color = `hsl(${f.hue},${f.sat}%,${f.lum}%)`
      drawParticle(f.x, f.y, f.size * (phase >= 1 ? 1.2 : 1), color, f.opacity)
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
