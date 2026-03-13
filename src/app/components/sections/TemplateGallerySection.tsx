'use client'
import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import type { TemplateId } from '../../lib/config'
import { TEMPLATES } from '../../lib/config'

// ── Mini canvas animations for each card ──────────────────────────────────────

function MiniCD({ active }: { active: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const raf = useRef<number>(0)
  useEffect(() => {
    const c = ref.current; if (!c) return
    const ctx = c.getContext('2d')!
    c.width = 80; c.height = 80
    const draw = (ts: number) => {
      const t = ts / 1000
      ctx.clearRect(0, 0, 80, 80)
      ctx.save(); ctx.translate(40, 40); ctx.rotate(t * 1.1)
      const R = 34
      const g = ctx.createLinearGradient(-R, -R, R, R)
      g.addColorStop(0, '#d8d8e8'); g.addColorStop(.25, '#eae0f8')
      g.addColorStop(.5, '#d0e8f8'); g.addColorStop(.75, '#f0e8f8')
      g.addColorStop(1, '#e0d8f0')
      ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2)
      ctx.fillStyle = g; ctx.fill()
      for (let r = 0; r < 8; r++) {
        const r1 = R * .24 + r * R * .075
        const cg = ctx.createRadialGradient(0, 0, r1, 0, 0, r1 + R * .04)
        cg.addColorStop(0, `hsla(${(r * 40 + t * 40) % 360},70%,72%,.18)`)
        cg.addColorStop(1, 'transparent')
        ctx.beginPath(); ctx.arc(0, 0, r1 + R * .04, 0, Math.PI * 2)
        ctx.arc(0, 0, r1, 0, Math.PI * 2, true)
        ctx.fillStyle = cg; ctx.fill()
      }
      ctx.beginPath(); ctx.arc(0, 0, R * .38, 0, Math.PI * 2)
      ctx.fillStyle = '#c8c8d8'; ctx.fill()
      ctx.beginPath(); ctx.arc(0, 0, R * .06, 0, Math.PI * 2)
      ctx.fillStyle = '#f5f5f7'; ctx.fill()
      ctx.restore()
      raf.current = requestAnimationFrame(draw)
    }
    raf.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf.current)
  }, [])
  return <canvas ref={ref} style={{ width: 80, height: 80 }} />
}

function MiniVinyl({ active }: { active: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const raf = useRef<number>(0)
  useEffect(() => {
    const c = ref.current; if (!c) return
    const ctx = c.getContext('2d')!
    c.width = 80; c.height = 80
    const draw = (ts: number) => {
      const t = ts / 1000
      ctx.clearRect(0, 0, 80, 80)
      ctx.save(); ctx.translate(40, 40); ctx.rotate(t * .75)
      const R = 34
      const base = ctx.createRadialGradient(0, 0, 0, 0, 0, R)
      base.addColorStop(0, '#2d2926'); base.addColorStop(1, '#0c0b09')
      ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2)
      ctx.fillStyle = base; ctx.fill()
      for (let g = 0; g < 18; g++) {
        const gr = R * .28 + g * R * .038
        ctx.beginPath(); ctx.arc(0, 0, gr, 0, Math.PI * 2)
        ctx.strokeStyle = 'rgba(255,255,255,.035)'; ctx.lineWidth = .5; ctx.stroke()
      }
      ctx.beginPath(); ctx.arc(0, 0, R * .32, 0, Math.PI * 2)
      const lg = ctx.createRadialGradient(0, 0, 0, 0, 0, R * .32)
      lg.addColorStop(0, '#e8c060'); lg.addColorStop(1, '#a87820')
      ctx.fillStyle = lg; ctx.fill()
      ctx.beginPath(); ctx.arc(0, 0, R * .05, 0, Math.PI * 2)
      ctx.fillStyle = '#0a0a0a'; ctx.fill()
      ctx.restore()
      raf.current = requestAnimationFrame(draw)
    }
    raf.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf.current)
  }, [])
  return <canvas ref={ref} style={{ width: 80, height: 80 }} />
}

function MiniCassette({ active }: { active: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const raf = useRef<number>(0)
  useEffect(() => {
    const c = ref.current; if (!c) return
    const ctx = c.getContext('2d')!
    c.width = 80; c.height = 80
    const draw = (ts: number) => {
      const t = ts / 1000
      ctx.clearRect(0, 0, 80, 80)
      // Body
      if (ctx.roundRect) ctx.roundRect(8, 22, 64, 36, 5)
      else ctx.rect(8, 22, 64, 36)
      ctx.fillStyle = '#f0ece8'; ctx.fill()
      ctx.strokeStyle = '#d2d2d7'; ctx.lineWidth = 1; ctx.stroke()
      // Label strip
      if (ctx.roundRect) ctx.roundRect(14, 26, 52, 18, 3)
      else ctx.rect(14, 26, 52, 18)
      const lg = ctx.createLinearGradient(14, 26, 66, 44)
      lg.addColorStop(0, '#e8c060'); lg.addColorStop(1, '#c9a030')
      ctx.fillStyle = lg; ctx.fill()
      // Window
      ctx.clearRect(22, 44, 36, 10)
      if (ctx.roundRect) ctx.roundRect(22, 44, 36, 10, 3)
      else ctx.rect(22, 44, 36, 10)
      ctx.fillStyle = '#d0ccc8'; ctx.fill()
      // Reels
      for (const [rx] of [[29, 0], [51, 0]]) {
        ctx.save(); ctx.translate(rx, 50); ctx.rotate(t * 3)
        ctx.beginPath(); ctx.arc(0, 0, 6, 0, Math.PI * 2)
        ctx.fillStyle = '#e0dcd8'; ctx.fill(); ctx.strokeStyle = '#a1a1a6'; ctx.lineWidth = .7; ctx.stroke()
        for (let s = 0; s < 4; s++) {
          const a = (s / 4) * Math.PI * 2
          ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * 4.5, Math.sin(a) * 4.5)
          ctx.strokeStyle = '#a1a1a6'; ctx.lineWidth = 1; ctx.stroke()
        }
        ctx.beginPath(); ctx.arc(0, 0, 2, 0, Math.PI * 2)
        ctx.fillStyle = '#e8c060'; ctx.fill()
        ctx.restore()
      }
      raf.current = requestAnimationFrame(draw)
    }
    raf.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf.current)
  }, [])
  return <canvas ref={ref} style={{ width: 80, height: 80 }} />
}

function MiniCanvas({ active }: { active: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const raf = useRef<number>(0)
  useEffect(() => {
    const c = ref.current; if (!c) return
    const ctx = c.getContext('2d')!; c.width = 80; c.height = 80
    const draw = (ts: number) => {
      const t = ts / 1000
      ctx.fillStyle = '#e8f5ee'; ctx.fillRect(0, 0, 80, 80)
      for (let i = 0; i < 16; i++) {
        const s = i * 113.7, px = (s * 17.3) % 80, py = (s * 29.1) % 80
        const fy = ((py - t * 8) % 80 + 80) % 80
        ctx.beginPath(); ctx.arc(px + Math.sin(t + s) * 5, fy, 1.5 + (s % 2), 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0,113,227,${.2 + Math.sin(t + s) * .1})`; ctx.fill()
      }
      const bars = 24, bX = 8, bY = 72, bW = (80 - 16) / bars
      for (let b = 0; b < bars; b++) {
        const bh = 6 * (Math.abs(Math.sin(b * .4 + t * 3)) * .6 + .3)
        ctx.fillStyle = `rgba(0,113,227,.5)`
        ctx.fillRect(bX + b * bW, bY - bh, bW - 1.5, bh)
      }
      raf.current = requestAnimationFrame(draw)
    }
    raf.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf.current)
  }, [])
  return <canvas ref={ref} style={{ width: 80, height: 80 }} />
}

function MiniLED({ active }: { active: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const raf = useRef<number>(0)
  useEffect(() => {
    const c = ref.current; if (!c) return
    const ctx = c.getContext('2d')!; c.width = 80; c.height = 80
    const draw = (ts: number) => {
      const t = ts / 1000
      ctx.fillStyle = '#0a0a0a'; ctx.fillRect(0, 0, 80, 80)
      const cols = 16, rows = 16, cw = 80 / cols, rh = 80 / rows
      for (let r = 0; r < rows; r++) for (let col = 0; col < cols; col++) {
        const dx = col / cols - .5, dy = r / rows - .5, d = Math.sqrt(dx * dx + dy * dy)
        const v = Math.sin(d * 8 - t * 3.5) * .5 + .5
        if (v > .35) {
          ctx.fillStyle = `hsla(${(col * 8 + r * 6 + t * 30) % 360},90%,58%,${v * .5})`
          ctx.fillRect(col * cw + 1, r * rh + 1, cw - 2, rh - 2)
        }
      }
      const bars = 20, bX = 6, bY = 74
      for (let b = 0; b < bars; b++) {
        const bh = 10 * (Math.abs(Math.sin(b * .4 + t * 5)) * .6 + .3)
        ctx.fillStyle = `hsl(${200 + b * 6},90%,62%)`
        ctx.fillRect(bX + b * (68 / bars), bY - bh, 68 / bars - 1.5, bh)
      }
      raf.current = requestAnimationFrame(draw)
    }
    raf.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf.current)
  }, [])
  return <canvas ref={ref} style={{ width: 80, height: 80 }} />
}

const MINI: Record<TemplateId, React.FC<{ active: boolean }>> = {
  'cd-disc':      MiniCD,
  'vinyl-record': MiniVinyl,
  'cassette-tape': MiniCassette,
  'spotify-canvas': MiniCanvas,
  'club-led':     MiniLED,
}

// ── Template Gallery ──────────────────────────────────────────────────────────

interface Props {
  active:   TemplateId
  onSelect: (id: TemplateId) => void
}

export default function TemplateGallerySection({ active, onSelect }: Props) {
  const { ref, visible } = useScrollReveal()

  return (
    <section id="templates" className="section-light" style={{ padding: '140px 24px' }}>
      <div ref={ref} style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Header */}
        <div className={`reveal ${visible ? 'in' : ''}`} style={{ textAlign: 'center', marginBottom: 64 }}>
          <p style={{ fontSize: 13, fontWeight: 600, letterSpacing: '.05em', textTransform: 'uppercase', color: '#0071e3', marginBottom: 12 }}>
            Templates
          </p>
          <h2 className="text-display">Five iconic styles.<br />
            <span style={{ color: '#6e6e73', fontWeight: 400 }}>Infinitely yours.</span>
          </h2>
          <p className="text-body-lg" style={{ marginTop: 14, maxWidth: 440, margin: '14px auto 0' }}>
            Each template is a living 3D animation — not a static frame.
          </p>
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(190px,1fr))', gap: 16 }}>
          {TEMPLATES.map((tpl, i) => {
            const MiniComp = MINI[tpl.id]
            const isActive = active === tpl.id
            return (
              <motion.div
                key={tpl.id}
                className={`card reveal reveal-d${i + 1} ${visible ? 'in' : ''}`}
                style={{
                  cursor: 'pointer',
                  border: isActive ? '1.5px solid #0071e3' : '1px solid #e8e8ed',
                  boxShadow: isActive ? '0 0 0 2px rgba(0,113,227,.15), 0 8px 32px rgba(0,0,0,.08)' : undefined,
                  position: 'relative',
                }}
                whileHover={{ y: -5, scale: 1.02, boxShadow: '0 20px 60px rgba(0,0,0,.10)' }}
                whileTap={{ scale: .98 }}
                onClick={() => onSelect(tpl.id)}
              >
                {/* Active badge */}
                {isActive && (
                  <div style={{
                    position: 'absolute', top: 10, right: 10,
                    width: 22, height: 22, borderRadius: '50%',
                    background: '#0071e3', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 2,
                  }}>
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}

                {/* Thumbnail area */}
                <div style={{ background: tpl.bgGradient, aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MiniComp active={isActive} />
                </div>

                {/* Info */}
                <div style={{ padding: '16px 20px 20px', borderTop: '1px solid #f5f5f7' }}>
                  <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: '-0.01em', marginBottom: 3 }}>{tpl.name}</div>
                  <div style={{ fontSize: 12, color: '#6e6e73' }}>{tpl.tags.join(' · ')}</div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
