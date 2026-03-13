'use client'
import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

/* ─── Mini hero vinyl rendered in 2D canvas (no Three.js overhead) ─── */
function HeroVinyl({ artworkUrl }: { artworkUrl: string | null }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef    = useRef<number>(0)
  const imgRef    = useRef<HTMLImageElement | null>(null)
  const angleRef  = useRef(0)
  const waveRef   = useRef<number[]>([])

  // Init waveform bars
  useEffect(() => {
    waveRef.current = Array.from({ length: 72 }, () => Math.random())
  }, [])

  useEffect(() => {
    if (artworkUrl) {
      const img = new Image()
      img.src = artworkUrl
      img.onload = () => { imgRef.current = img }
    } else {
      imgRef.current = null
    }
  }, [artworkUrl])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const DPR = window.devicePixelRatio || 1
    const SIZE = 480

    canvas.width  = SIZE * DPR
    canvas.height = SIZE * DPR
    canvas.style.width  = SIZE + 'px'
    canvas.style.height = SIZE + 'px'
    ctx.scale(DPR, DPR)

    const draw = (ts: number) => {
      ctx.clearRect(0, 0, SIZE, SIZE)
      const t = ts / 1000
      const cx = SIZE / 2, cy = SIZE / 2
      angleRef.current = t * 0.7 // radians per second

      // ── Waveform ring ──────────────────────────────────────
      const bars = 72, innerR = SIZE * 0.51, outBase = SIZE * 0.545
      for (let i = 0; i < bars; i++) {
        const angle = (i / bars) * Math.PI * 2 - Math.PI / 2
        const n = Math.sin(i * 0.4 + t * 2.2) * 0.4 + Math.sin(i * 0.15 + t * 1.1) * 0.3
        const amp = (n * 0.5 + 0.5) * SIZE * 0.045
        const r2 = outBase + amp
        ctx.beginPath()
        ctx.moveTo(cx + Math.cos(angle) * innerR, cy + Math.sin(angle) * innerR)
        ctx.lineTo(cx + Math.cos(angle) * r2,     cy + Math.sin(angle) * r2)
        ctx.strokeStyle = `rgba(0,113,227,${0.08 + (n * 0.5 + 0.5) * 0.18})`
        ctx.lineWidth = 1.5
        ctx.lineCap = 'round'
        ctx.stroke()
      }

      // ── Ground shadow ──────────────────────────────────────
      const shadowGrad = ctx.createRadialGradient(cx + 8, cy + 8, 0, cx + 8, cy + 8, SIZE * 0.38)
      shadowGrad.addColorStop(0, 'rgba(0,0,0,.1)')
      shadowGrad.addColorStop(1, 'transparent')
      ctx.beginPath(); ctx.arc(cx + 8, cy + 8, SIZE * 0.38, 0, Math.PI * 2)
      ctx.fillStyle = shadowGrad; ctx.fill()

      // ── Vinyl body (rotated) ────────────────────────────────
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(angleRef.current)

      const R = SIZE * 0.38
      // Base disc
      const base = ctx.createRadialGradient(0, 0, 0, 0, 0, R)
      base.addColorStop(0,   '#2d2926')
      base.addColorStop(0.4, '#1e1b18')
      base.addColorStop(0.7, '#161410')
      base.addColorStop(1,   '#0c0b09')
      ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2)
      ctx.fillStyle = base; ctx.fill()

      // Grooves
      for (let g = 0; g < 44; g++) {
        const gr = R * 0.27 + g * (R * 0.016)
        ctx.beginPath(); ctx.arc(0, 0, gr, 0, Math.PI * 2)
        ctx.strokeStyle = g % 3 === 0 ? 'rgba(255,255,255,.04)' : 'rgba(0,0,0,.22)'
        ctx.lineWidth = 0.7; ctx.stroke()
      }

      // Sheen
      const sheen = ctx.createLinearGradient(-R, -R, R, R)
      sheen.addColorStop(0,   'rgba(255,200,80,.04)')
      sheen.addColorStop(0.4, 'rgba(255,80,50,.05)')
      sheen.addColorStop(0.8, 'rgba(60,60,220,.04)')
      ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2)
      ctx.fillStyle = sheen; ctx.fill()

      // Label
      const LR = R * 0.32
      ctx.save()
      ctx.beginPath(); ctx.arc(0, 0, LR, 0, Math.PI * 2); ctx.clip()
      ctx.rotate(-angleRef.current) // counter-rotate so art stays upright
      if (imgRef.current) {
        ctx.drawImage(imgRef.current, -LR, -LR, LR * 2, LR * 2)
      } else {
        const lg = ctx.createRadialGradient(0, 0, 0, 0, 0, LR)
        lg.addColorStop(0, '#c9a84c'); lg.addColorStop(1, '#8a6a28')
        ctx.fillStyle = lg; ctx.fillRect(-LR, -LR, LR * 2, LR * 2)
      }
      ctx.restore()

      // Label border + center hole
      ctx.beginPath(); ctx.arc(0, 0, LR, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(200,160,80,.4)'; ctx.lineWidth = 2; ctx.stroke()
      ctx.beginPath(); ctx.arc(0, 0, R * 0.03, 0, Math.PI * 2)
      ctx.fillStyle = '#0c0b09'; ctx.fill()

      // Specular highlight
      const spec = ctx.createRadialGradient(-R * 0.2, -R * 0.28, 0, 0, 0, R)
      spec.addColorStop(0, 'rgba(255,255,255,.18)')
      spec.addColorStop(0.25, 'rgba(255,255,255,.04)')
      spec.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2)
      ctx.fillStyle = spec; ctx.fill()

      ctx.restore()

      // ── Tonearm ─────────────────────────────────────────────
      ctx.save()
      const armX = cx + SIZE * 0.3, armY = cy - SIZE * 0.35
      const armSway = Math.sin(t * 0.3) * 4
      ctx.translate(armX, armY - SIZE * 0.02)
      ctx.rotate((-22 + armSway) * Math.PI / 180)
      // Pivot circle
      ctx.beginPath(); ctx.arc(0, 0, 10, 0, Math.PI * 2)
      ctx.fillStyle = '#d2d2d7'; ctx.fill()
      ctx.strokeStyle = '#a1a1a6'; ctx.lineWidth = 1; ctx.stroke()
      ctx.beginPath(); ctx.arc(0, 0, 4, 0, Math.PI * 2)
      ctx.fillStyle = '#6e6e73'; ctx.fill()
      // Arm
      ctx.beginPath(); ctx.moveTo(0, 10)
      ctx.lineTo(-SIZE * 0.08, SIZE * 0.35)
      ctx.strokeStyle = '#a1a1a6'; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.stroke()
      // Needle
      ctx.beginPath()
      ctx.arc(-SIZE * 0.08, SIZE * 0.35, 5, 0, Math.PI * 2)
      ctx.fillStyle = '#0071e3'; ctx.fill()
      ctx.restore()

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  return (
    <div className="animate-float" style={{ position: 'relative' }}>
      <canvas ref={canvasRef} style={{ borderRadius: '50%' }} />
      {/* Platform reflection */}
      <div style={{
        position: 'absolute', bottom: -20, left: '15%', right: '15%',
        height: 30, borderRadius: '50%',
        background: 'radial-gradient(ellipse,rgba(0,0,0,.12) 0%,transparent 70%)',
        filter: 'blur(6px)',
      }} />
    </div>
  )
}

// ── Hero section ──────────────────────────────────────────────────────────────

interface HeroProps {
  artworkUrl: string | null
  onUploadClick: () => void
}

export default function HeroSection({ artworkUrl, onUploadClick }: HeroProps) {
  const fadeIn = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }

  return (
    <section
      id="hero"
      className="hero-bg"
      style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '120px 24px 80px' }}
    >
      <div className="hero-content" style={{ maxWidth: 980, margin: '0 auto', width: '100%' }}>

        {/* Kicker badge */}
        <motion.div
          variants={fadeIn} initial="hidden" animate="visible" transition={{ duration: 0.7, ease: [0.16,1,0.3,1], delay: 0.1 }}
          style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}
        >
          <span className="badge">
            <span className="badge-dot" />
            Introducing MotionArt Studio
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="text-hero"
          variants={fadeIn} initial="hidden" animate="visible" transition={{ duration: 0.8, ease: [0.16,1,0.3,1], delay: 0.2 }}
          style={{ maxWidth: 760, margin: '0 auto' }}
        >
          Turn Your Cover Art<br />
          <span style={{ color: '#0071e3' }}>Into Motion.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          className="text-body-lg"
          variants={fadeIn} initial="hidden" animate="visible" transition={{ duration: 0.8, ease: [0.16,1,0.3,1], delay: 0.35 }}
          style={{ maxWidth: 520, margin: '22px auto 0', color: '#6e6e73' }}
        >
          Create animated visuals for your music in seconds.<br />
          3D templates, audio-reactive effects, 1080p export.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={fadeIn} initial="hidden" animate="visible" transition={{ duration: 0.8, ease: [0.16,1,0.3,1], delay: 0.5 }}
          style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 40, flexWrap: 'wrap' }}
        >
          <button className="btn btn-primary" onClick={onUploadClick}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 12V3M5.5 7l3.5-4 3.5 4M2.5 14.5v1A1.5 1.5 0 004 17h10a1.5 1.5 0 001.5-1.5v-1" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Upload Your Track
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => document.getElementById('templates')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Explore templates
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 7h8M7.5 3.5l3.5 3.5-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </motion.div>

        {/* Vinyl hero visual */}
        <motion.div
          variants={fadeIn} initial="hidden" animate="visible" transition={{ duration: 1, ease: [0.16,1,0.3,1], delay: 0.65 }}
          style={{ marginTop: 72, display: 'flex', justifyContent: 'center' }}
        >
          <HeroVinyl artworkUrl={artworkUrl} />
        </motion.div>

        {/* Stats strip */}
        <motion.div
          variants={fadeIn} initial="hidden" animate="visible" transition={{ duration: 0.8, ease: [0.16,1,0.3,1], delay: 0.9 }}
          style={{ display: 'flex', gap: 48, justifyContent: 'center', marginTop: 60, flexWrap: 'wrap' }}
        >
          {[['1080p', 'Export quality'], ['5', 'Visual templates'], ['MP4', 'With audio'], ['< 60s', 'To create']].map(([n, l]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.03em' }}>{n}</div>
              <div style={{ fontSize: 13, color: '#6e6e73', marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
