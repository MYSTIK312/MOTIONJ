'use client'

import { useEffect, useRef, useCallback } from 'react'
import type { TemplateId } from '../../lib/config'
import type { AudioData } from '../../hooks/useAudioAnalyzer'

const SIZE = 480

interface Props {
  templateId:  TemplateId
  artworkUrl:  string | null
  audioData:   AudioData | null
  isPlaying:   boolean
}

export default function PreviewCanvas({ templateId, artworkUrl, audioData, isPlaying }: Props) {
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const imgRef     = useRef<HTMLImageElement | null>(null)
  const rafRef     = useRef<number>(0)
  const startRef   = useRef<number>(0)
  const tplRef     = useRef<TemplateId>(templateId)
  const audioRef   = useRef<AudioData | null>(audioData)
  const playRef    = useRef(isPlaying)

  // Sync refs
  useEffect(() => { tplRef.current = templateId; startRef.current = 0 }, [templateId])
  useEffect(() => { audioRef.current = audioData }, [audioData])
  useEffect(() => { playRef.current = isPlaying }, [isPlaying])

  // Load artwork
  useEffect(() => {
    if (!artworkUrl) { imgRef.current = null; return }
    const img = new Image()
    img.src = artworkUrl
    img.onload = () => { imgRef.current = img }
  }, [artworkUrl])

  // ── RENDERER ──────────────────────────────────────────────────────────────

  const drawPlaceholder = useCallback((ctx: CanvasRenderingContext2D, t: number) => {
    ctx.fillStyle = '#f5f5f7'
    ctx.fillRect(0, 0, SIZE, SIZE)
    const cx = SIZE / 2, cy = SIZE / 2
    // Dot grid
    for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) {
      const px = (i + .5) * (SIZE / 8), py = (j + .5) * (SIZE / 8)
      const p = Math.sin(t * 1.4 + i * .7 + j * .5) * .4 + .5
      ctx.beginPath(); ctx.arc(px, py, 1.5, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(0,113,227,${p * .18})`; ctx.fill()
    }
    // Pulsing rings
    for (let r = 0; r < 4; r++) {
      const radius = 40 + r * 38, p = Math.sin(t * 1.2 - r * .4) * .25 + .35
      ctx.beginPath(); ctx.arc(cx, cy, radius, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(0,113,227,${p * .22})`; ctx.lineWidth = 1; ctx.stroke()
    }
    // Upload icon
    ctx.strokeStyle = 'rgba(0,113,227,.4)'; ctx.lineWidth = 1.5; ctx.lineCap = 'round'; ctx.lineJoin = 'round'
    ctx.beginPath(); ctx.moveTo(cx, cy - 18); ctx.lineTo(cx, cy + 14); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(cx - 12, cy - 6); ctx.lineTo(cx, cy - 22); ctx.lineTo(cx + 12, cy - 6); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(cx - 18, cy + 18); ctx.lineTo(cx + 18, cy + 18); ctx.stroke()
    ctx.fillStyle = 'rgba(0,0,0,.28)'; ctx.font = '300 13px -apple-system,sans-serif'
    ctx.textAlign = 'center'; ctx.fillText('Upload artwork to preview', cx, cy + 52)
    ctx.font = '300 11px monospace'; ctx.fillStyle = 'rgba(0,0,0,.15)'
    ctx.fillText('PNG · JPG · WEBP', cx, cy + 70)
  }, [])

  const drawCD = useCallback((ctx: CanvasRenderingContext2D, t: number, img: HTMLImageElement | null, ad: AudioData | null) => {
    const cx = SIZE / 2, cy = SIZE / 2
    const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, SIZE * .7)
    bg.addColorStop(0, '#f0f0fa'); bg.addColorStop(1, '#dde0f0')
    ctx.fillStyle = bg; ctx.fillRect(0, 0, SIZE, SIZE)

    // Energy-reactive glow
    const energy = ad?.energy || 0
    const bass   = ad?.bass   || 0

    // Shadow
    ctx.beginPath(); ctx.arc(cx + 6, cy + 8, SIZE * .37 + bass * 8, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(0,0,0,.07)'; ctx.fill()

    ctx.save(); ctx.translate(cx, cy); ctx.rotate(t * (1.1 + bass * .4))
    const R = SIZE * .37
    const cg = ctx.createLinearGradient(-R, -R, R, R)
    cg.addColorStop(0, '#dde0f0'); cg.addColorStop(.25, '#eae0f8')
    cg.addColorStop(.5, '#d0e8f8'); cg.addColorStop(.75, '#f0e8f8')
    cg.addColorStop(1, '#e0d8f0')
    ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2); ctx.fillStyle = cg; ctx.fill()

    for (let r = 0; r < 14; r++) {
      const r1 = R * .22 + r * R * .047, r2 = r1 + R * .022
      const rg = ctx.createRadialGradient(0, 0, r1, 0, 0, r2)
      rg.addColorStop(0, `hsla(${(r * 26 + t * 45) % 360},65%,72%,.2)`)
      rg.addColorStop(1, 'transparent')
      ctx.beginPath(); ctx.arc(0, 0, r2, 0, Math.PI * 2); ctx.arc(0, 0, r1, 0, Math.PI * 2, true)
      ctx.fillStyle = rg; ctx.fill()
    }

    const LR = R * .38
    ctx.save(); ctx.beginPath(); ctx.arc(0, 0, LR, 0, Math.PI * 2); ctx.clip()
    ctx.rotate(-t * (1.1 + bass * .4))
    if (img) ctx.drawImage(img, -LR, -LR, LR * 2, LR * 2)
    else { ctx.fillStyle = '#c8c8d8'; ctx.fillRect(-LR, -LR, LR * 2, LR * 2) }
    ctx.restore()

    ctx.beginPath(); ctx.arc(0, 0, LR, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(255,255,255,.4)'; ctx.lineWidth = 1.5; ctx.stroke()
    ctx.beginPath(); ctx.arc(0, 0, R * .052, 0, Math.PI * 2)
    ctx.fillStyle = '#f0f0f5'; ctx.fill()

    const sp = ctx.createRadialGradient(-R * .22, -R * .28, 0, 0, 0, R)
    sp.addColorStop(0, 'rgba(255,255,255,.4)'); sp.addColorStop(.3, 'rgba(255,255,255,.08)'); sp.addColorStop(1, 'transparent')
    ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2); ctx.fillStyle = sp; ctx.fill()
    ctx.restore()

    // Bass pulse glow
    if (bass > 0.4) {
      const gg = ctx.createRadialGradient(cx, cy, R * .8, cx, cy, R * 1.2)
      gg.addColorStop(0, 'rgba(0,113,227,0)')
      gg.addColorStop(.5, `rgba(0,113,227,${bass * .08})`)
      gg.addColorStop(1, 'rgba(0,113,227,0)')
      ctx.beginPath(); ctx.arc(cx, cy, R * 1.15, 0, Math.PI * 2)
      ctx.fillStyle = gg; ctx.fill()
    }
  }, [])

  const drawVinyl = useCallback((ctx: CanvasRenderingContext2D, t: number, img: HTMLImageElement | null, ad: AudioData | null) => {
    const cx = SIZE / 2, cy = SIZE / 2
    const bass = ad?.bass || 0
    ctx.fillStyle = '#faf8f5'; ctx.fillRect(0, 0, SIZE, SIZE)

    ctx.beginPath(); ctx.arc(cx + 8, cy + 10, SIZE * .39, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(0,0,0,.07)'; ctx.fill()

    ctx.save(); ctx.translate(cx, cy); ctx.rotate(t * (.78 + bass * .3))
    const R = SIZE * .38
    const base = ctx.createRadialGradient(0, 0, 0, 0, 0, R)
    base.addColorStop(0, '#2d2926'); base.addColorStop(.5, '#1e1b18'); base.addColorStop(1, '#0c0b09')
    ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2); ctx.fillStyle = base; ctx.fill()

    for (let g = 0; g < 48; g++) {
      const gr = R * .26 + g * R * .015
      ctx.beginPath(); ctx.arc(0, 0, gr, 0, Math.PI * 2)
      ctx.strokeStyle = g % 3 === 0 ? 'rgba(255,255,255,.04)' : 'rgba(0,0,0,.18)'
      ctx.lineWidth = .65; ctx.stroke()
    }

    const sh = ctx.createLinearGradient(-R, -R, R, R)
    sh.addColorStop(0, 'rgba(200,150,60,.04)'); sh.addColorStop(.4, 'rgba(200,80,40,.05)')
    sh.addColorStop(.8, 'rgba(60,60,200,.04)')
    ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2); ctx.fillStyle = sh; ctx.fill()

    const LR = R * .32
    ctx.save(); ctx.beginPath(); ctx.arc(0, 0, LR, 0, Math.PI * 2); ctx.clip()
    ctx.rotate(-t * (.78 + bass * .3))
    if (img) ctx.drawImage(img, -LR, -LR, LR * 2, LR * 2)
    else {
      const ll = ctx.createRadialGradient(0, 0, 0, 0, 0, LR)
      ll.addColorStop(0, '#c9a84c'); ll.addColorStop(1, '#8a6a28')
      ctx.fillStyle = ll; ctx.beginPath(); ctx.arc(0, 0, LR, 0, Math.PI * 2); ctx.fill()
    }
    ctx.restore()
    ctx.beginPath(); ctx.arc(0, 0, LR, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(200,160,80,.3)'; ctx.lineWidth = 2; ctx.stroke()
    ctx.beginPath(); ctx.arc(0, 0, LR * .14, 0, Math.PI * 2); ctx.fillStyle = '#c8a84c'; ctx.fill()
    ctx.beginPath(); ctx.arc(0, 0, R * .032, 0, Math.PI * 2); ctx.fillStyle = '#0e0c0a'; ctx.fill()

    const sp = ctx.createRadialGradient(-R * .18, -R * .3, 0, 0, 0, R)
    sp.addColorStop(0, 'rgba(255,255,255,.14)'); sp.addColorStop(.2, 'rgba(255,255,255,.03)'); sp.addColorStop(1, 'transparent')
    ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2); ctx.fillStyle = sp; ctx.fill()
    ctx.restore()
  }, [])

  const drawCassette = useCallback((ctx: CanvasRenderingContext2D, t: number, img: HTMLImageElement | null, ad: AudioData | null) => {
    ctx.fillStyle = '#fafafa'; ctx.fillRect(0, 0, SIZE, SIZE)
    for (let y = 0; y < SIZE; y += 6) { ctx.fillStyle = 'rgba(0,0,0,.012)'; ctx.fillRect(0, y, SIZE, 3) }

    const cx = SIZE / 2, cy = SIZE / 2
    const cW = SIZE * .7, cH = SIZE * .42, cX = cx - cW / 2, cY = cy - cH / 2 - SIZE * .03

    ctx.beginPath()
    if (ctx.roundRect) ctx.roundRect(cX + 8, cY + 10, cW, cH, 14)
    else ctx.rect(cX + 8, cY + 10, cW, cH)
    ctx.fillStyle = 'rgba(0,0,0,.06)'; ctx.fill()

    const bd = ctx.createLinearGradient(cX, cY, cX, cY + cH)
    bd.addColorStop(0, '#f8f8f8'); bd.addColorStop(.4, '#f0f0f0'); bd.addColorStop(1, '#e8e8e8')
    ctx.beginPath()
    if (ctx.roundRect) ctx.roundRect(cX, cY, cW, cH, 14)
    else ctx.rect(cX, cY, cW, cH)
    ctx.fillStyle = bd; ctx.fill(); ctx.strokeStyle = 'rgba(0,0,0,.07)'; ctx.lineWidth = 1; ctx.stroke()

    const lW = cW * .62, lH = cH * .4, lX = cx - lW / 2, lY = cY + cH * .1
    ctx.save(); ctx.beginPath()
    if (ctx.roundRect) ctx.roundRect(lX, lY, lW, lH, 5)
    else ctx.rect(lX, lY, lW, lH)
    ctx.clip()
    if (img) ctx.drawImage(img, lX, lY, lW, lH)
    else {
      const ll = ctx.createLinearGradient(lX, lY, lX + lW, lY + lH)
      ll.addColorStop(0, '#e8d070'); ll.addColorStop(.5, '#c8a030'); ll.addColorStop(1, '#e8d070')
      ctx.fillStyle = ll; ctx.fillRect(lX, lY, lW, lH)
    }
    ctx.restore()
    ctx.beginPath()
    if (ctx.roundRect) ctx.roundRect(lX, lY, lW, lH, 5)
    else ctx.rect(lX, lY, lW, lH)
    ctx.strokeStyle = 'rgba(0,0,0,.1)'; ctx.lineWidth = 1; ctx.stroke()

    // Window area
    const wW = cW * .56, wH = cH * .3, wX = cx - wW / 2, wY = cY + cH * .62
    ctx.beginPath()
    if (ctx.roundRect) ctx.roundRect(wX, wY, wW, wH, 7)
    else ctx.rect(wX, wY, wW, wH)
    ctx.fillStyle = '#e0e0e0'; ctx.fill(); ctx.strokeStyle = 'rgba(0,0,0,.07)'; ctx.lineWidth = 1; ctx.stroke()

    // Tape ribbon
    const tY = wY + wH * .52
    ctx.beginPath(); ctx.moveTo(wX + wW * .08, tY)
    for (let x = wX + wW * .08; x <= wX + wW * .92; x += 2)
      ctx.lineTo(x, tY + Math.sin((x - (wX + wW * .5)) * .02) * 5.5)
    ctx.strokeStyle = '#b8a090'; ctx.lineWidth = 2.5; ctx.stroke()

    // Reels
    const rR = wH * .36, rCy = wY + wH * .44
    const bass = ad?.bass || 0
    for (const rcx of [wX + wW * .26, wX + wW * .74]) {
      ctx.save(); ctx.translate(rcx, rCy); ctx.rotate(t * (3 + bass * 2))
      ctx.beginPath(); ctx.arc(0, 0, rR, 0, Math.PI * 2)
      ctx.fillStyle = '#d0ccc8'; ctx.fill(); ctx.strokeStyle = 'rgba(0,0,0,.07)'; ctx.lineWidth = 1; ctx.stroke()
      for (let s = 0; s < 5; s++) {
        const a = (s / 5) * Math.PI * 2
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * rR * .8, Math.sin(a) * rR * .8)
        ctx.strokeStyle = 'rgba(0,0,0,.12)'; ctx.lineWidth = 1.2; ctx.stroke()
      }
      ctx.beginPath(); ctx.arc(0, 0, rR * .24, 0, Math.PI * 2); ctx.fillStyle = '#e8d070'; ctx.fill()
      ctx.beginPath(); ctx.arc(0, 0, rR * .09, 0, Math.PI * 2); ctx.fillStyle = '#f0f0f0'; ctx.fill()
      ctx.restore()
    }
    // Screws
    for (const [sx, sy] of [[cX + 16, cY + 16], [cX + cW - 16, cY + 16], [cX + 16, cY + cH - 16], [cX + cW - 16, cY + cH - 16]]) {
      ctx.beginPath(); ctx.arc(sx, sy, 5, 0, Math.PI * 2)
      ctx.fillStyle = '#e0e0e0'; ctx.fill(); ctx.strokeStyle = 'rgba(0,0,0,.08)'; ctx.lineWidth = .8; ctx.stroke()
    }
  }, [])

  const drawCanvas = useCallback((ctx: CanvasRenderingContext2D, t: number, img: HTMLImageElement | null, ad: AudioData | null) => {
    const W = SIZE, H = SIZE, cx = W / 2, cy = H / 2
    const energy = ad?.energy || 0
    const bass   = ad?.bass   || 0
    if (img) {
      const z = 1 + Math.sin(t * .35) * .055 + bass * .04
      ctx.save(); ctx.translate(cx, cy); ctx.scale(z, z); ctx.translate(-cx, -cy)
      ctx.drawImage(img, 0, 0, W, H); ctx.restore()
    } else {
      const bg = ctx.createLinearGradient(0, 0, W, H)
      bg.addColorStop(0, '#eef8f2'); bg.addColorStop(1, '#d4eed8')
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H)
    }
    const vg = ctx.createRadialGradient(cx, cy, W * .12, cx, cy, W * .65)
    vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(.5, 'rgba(0,0,0,.1)'); vg.addColorStop(1, 'rgba(0,0,0,.42)')
    ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H)
    // Particles
    for (let i = 0; i < 18; i++) {
      const s = i * 113.7, bx = (s * 17.3) % W, by = (s * 29.1) % H
      const fx = bx + Math.sin(t * .7 + s) * 22
      const fy = ((by - t * (8 + energy * 12)) % H + H) % H
      const a = (Math.sin(t * 1.3 + s) * .3 + .45) * .5 + bass * .2
      ctx.beginPath(); ctx.arc(fx, fy, 1.5 + (s % 3), 0, Math.PI * 2)
      ctx.fillStyle = `rgba(0,113,227,${a})`; ctx.fill()
    }
    // Waveform bars
    const bc = 34, bY = H * .88, bX = cx - W * .28
    for (let b = 0; b < bc; b++) {
      const bh = (H * .045) * (Math.abs(Math.sin(b * .42 + t * (2.8 + bass * 3))) * .6 + .3 + bass * .4)
      const x = bX + b * (W * .56 / bc + 1.5)
      const al = .55 + Math.sin(t * 2.8 + b * 7) * .25
      if (ctx.roundRect) ctx.roundRect(x, bY - bh / 2, W * .56 / bc, bh, 2)
      else ctx.fillRect(x, bY - bh / 2, W * .56 / bc, bh)
      ctx.fillStyle = `rgba(0,113,227,${al})`; ctx.fill()
    }
  }, [])

  const drawLED = useCallback((ctx: CanvasRenderingContext2D, t: number, img: HTMLImageElement | null, ad: AudioData | null) => {
    const W = SIZE, H = SIZE, cx = W / 2, cy = H / 2
    const bass   = ad?.bass   || 0
    const energy = ad?.energy || 0
    ctx.fillStyle = '#0a0a0a'; ctx.fillRect(0, 0, W, H)

    const cols = 24, rows = 24
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const dx = c / cols - .5, dy = r / rows - .5, d = Math.sqrt(dx * dx + dy * dy)
      const v = (Math.sin(d * 9 - t * (3.2 + bass * 2)) * .5 + .5) * (1 - d * 1.05)
      if (v > .08) {
        ctx.fillStyle = `hsla(${(r * 6 + c * 4 + t * 32) % 360},95%,58%,${v * (.3 + energy * .15)})`
        ctx.fillRect(c * W / cols + 1, r * H / rows + 1, W / cols - 2, H / rows - 2)
      }
    }

    // Screen
    const sW = W * .5, sH = H * .5, sX = cx - sW / 2, sY = cy - sH / 2 - H * .04
    const p = Math.sin(t * 3.2) * .25 + .75
    ctx.fillStyle = '#111'; ctx.fillRect(sX - 8, sY - 8, sW + 16, sH + 16)
    ctx.strokeStyle = `rgba(0,113,227,${.7 * p + bass * .3})`; ctx.lineWidth = 1.5
    ctx.strokeRect(sX - 8, sY - 8, sW + 16, sH + 16)

    // Corner brackets
    const cs = 14
    for (const [bx, by] of [[sX - 8, sY - 8], [sX + sW + 8 - cs, sY - 8], [sX - 8, sY + sH + 8 - cs], [sX + sW + 8 - cs, sY + sH + 8 - cs]]) {
      ctx.strokeStyle = `rgba(0,113,227,${.9 * p})`; ctx.lineWidth = 2
      ctx.beginPath(); ctx.moveTo(bx, by + cs); ctx.lineTo(bx, by); ctx.lineTo(bx + cs, by); ctx.stroke()
    }

    if (img) ctx.drawImage(img, sX, sY, sW, sH)
    else {
      const mb = ctx.createLinearGradient(sX, sY, sX + sW, sY + sH)
      mb.addColorStop(0, '#1a1050'); mb.addColorStop(1, '#0a0828')
      ctx.fillStyle = mb; ctx.fillRect(sX, sY, sW, sH)
    }
    // Scanlines
    for (let sy2 = sY; sy2 < sY + sH; sy2 += 3) { ctx.fillStyle = 'rgba(0,0,0,.18)'; ctx.fillRect(sX, sy2, sW, 1.5) }

    // Waveform
    const wc = 56, wmH = H * .1, wX2 = cx - W * .42, wY2 = H * .9
    for (let i2 = 0; i2 < wc; i2++) {
      const bh = wmH * (Math.abs(Math.sin(i2 * .38 + t * (4.5 + bass * 3))) * .5 + Math.abs(Math.sin(i2 * .75 - t * 2.8)) * .3 + .2)
      const bw = W * .84 / wc
      ctx.fillStyle = `hsl(${210 + i2 / wc * 120},90%,62%)`
      ctx.fillRect(wX2 + i2 * (bw + 1.4), wY2 - bh, bw, bh)
    }
  }, [])

  // ── MAIN LOOP ────────────────────────────────────────────────────────────

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const DPR = Math.min(window.devicePixelRatio || 1, 2)

    canvas.width  = SIZE * DPR
    canvas.height = SIZE * DPR
    canvas.style.width  = SIZE + 'px'
    canvas.style.height = SIZE + 'px'
    ctx.scale(DPR, DPR)

    const loop = (ts: number) => {
      if (!startRef.current) startRef.current = ts
      const t = (ts - startRef.current) / 1000

      ctx.clearRect(0, 0, SIZE, SIZE)
      const img = imgRef.current
      const ad  = audioRef.current

      if (!img) {
        drawPlaceholder(ctx, t)
      } else {
        switch (tplRef.current) {
          case 'cd-disc':       drawCD(ctx, t, img, ad);       break
          case 'vinyl-record':  drawVinyl(ctx, t, img, ad);    break
          case 'cassette-tape': drawCassette(ctx, t, img, ad); break
          case 'spotify-canvas': drawCanvas(ctx, t, img, ad);  break
          case 'club-led':      drawLED(ctx, t, img, ad);      break
        }
      }

      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [drawPlaceholder, drawCD, drawVinyl, drawCassette, drawCanvas, drawLED])

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: 'block',
        width: SIZE, height: SIZE,
        borderRadius: 24,
      }}
    />
  )
}
