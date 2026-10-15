import { useEffect, useRef } from 'react'
import type { SceneId } from '../App'

interface Props { scene: SceneId }

export default function StarField({ scene }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    let animId: number
    let W = 0, H = 0

    interface Star {
      x: number; y: number; r: number; alpha: number;
      twinkleSpeed: number; twinklePhase: number;
      vx: number; vy: number;
    }

    const stars: Star[] = []

    function resize() {
      W = canvas.width = window.innerWidth
      H = canvas.height = window.innerHeight
    }

    function init() {
      resize()
      stars.length = 0
      const count = Math.min(220, Math.floor((W * H) / 5000))
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: 0.4 + Math.random() * 1.8,
          alpha: 0.2 + Math.random() * 0.8,
          twinkleSpeed: 0.005 + Math.random() * 0.02,
          twinklePhase: Math.random() * Math.PI * 2,
          vx: (Math.random() - 0.5) * 0.08,
          vy: (Math.random() - 0.5) * 0.04,
        })
      }
    }

    function draw(t: number) {
      ctx.clearRect(0, 0, W, H)

      // Shooting stars occasionally
      if (Math.random() < 0.002) {
        const sx = Math.random() * W
        const sy = Math.random() * H * 0.5
        const len = 80 + Math.random() * 120
        const angle = Math.PI / 4
        const grad = ctx.createLinearGradient(sx, sy, sx + Math.cos(angle) * len, sy + Math.sin(angle) * len)
        grad.addColorStop(0, 'rgba(200,180,255,0.9)')
        grad.addColorStop(1, 'rgba(200,180,255,0)')
        ctx.strokeStyle = grad
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.moveTo(sx, sy)
        ctx.lineTo(sx + Math.cos(angle) * len, sy + Math.sin(angle) * len)
        ctx.stroke()
      }

      for (const s of stars) {
        s.twinklePhase += s.twinkleSpeed
        const brightness = s.alpha * (0.5 + 0.5 * Math.sin(s.twinklePhase))
        s.x = (s.x + s.vx + W) % W
        s.y = (s.y + s.vy + H) % H

        // Sunrise scenes: shift star color to warm gold
        let color = '200, 180, 255'
        if (scene === 7 || scene === 8) {
          color = '255, 220, 150'
        }

        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${color}, ${brightness})`
        ctx.fill()

        // Glow
        if (s.r > 1.2) {
          const grd = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 4)
          grd.addColorStop(0, `rgba(${color}, ${brightness * 0.4})`)
          grd.addColorStop(1, `rgba(${color}, 0)`)
          ctx.beginPath()
          ctx.arc(s.x, s.y, s.r * 4, 0, Math.PI * 2)
          ctx.fillStyle = grd
          ctx.fill()
        }
      }

      // Floating fireflies in warmer scenes
      if (scene >= 2) {
        const fireflies = Math.floor(t / 100) % 6
        for (let i = 0; i < fireflies; i++) {
          const fx = (Math.sin(t * 0.001 + i * 1.3) * 0.5 + 0.5) * W
          const fy = (Math.cos(t * 0.0013 + i * 0.7) * 0.5 + 0.5) * H * 0.8
          const fa = 0.3 + 0.7 * Math.sin(t * 0.003 + i)
          ctx.beginPath()
          ctx.arc(fx, fy, 2, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(251, 191, 36, ${Math.max(0, fa)})`
          ctx.fill()
        }
      }

      animId = requestAnimationFrame(draw)
    }

    init()
    window.addEventListener('resize', init)
    animId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', init)
    }
  }, [scene])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  )
}
