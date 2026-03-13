import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir, readFile, rm } from 'fs/promises'
import { join } from 'path'
import { v4 as uuid } from 'uuid'
import { createCanvas, loadImage } from 'canvas'
import ffmpeg from 'fluent-ffmpeg'
import { Readable } from 'stream'

const TEMP_DIR = '/tmp/motionart'
const W = 1080, H = 1080, FPS = 30

// ── Frame renderer (mirrors client-side logic) ────────────────────────────────

async function renderFrame(
  ctx: CanvasRenderingContext2D,
  template: string,
  t: number,
  artwork: any | null
) {
  ctx.clearRect(0, 0, W, H)

  switch (template) {
    case 'vinyl-record': renderVinyl(ctx, t, artwork); break
    case 'cd-disc':      renderCD(ctx, t, artwork);    break
    case 'cassette-tape': renderCassette(ctx, t, artwork); break
    case 'spotify-canvas': renderCanvasStyle(ctx, t, artwork); break
    case 'club-led':     renderLED(ctx, t, artwork);   break
    default:             renderVinyl(ctx, t, artwork)
  }
}

function renderVinyl(ctx: any, t: number, img: any) {
  const cx = W / 2, cy = H / 2
  ctx.fillStyle = '#faf8f5'; ctx.fillRect(0, 0, W, H)
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(t * 0.78)
  const R = W * 0.38
  const base = ctx.createRadialGradient(0, 0, 0, 0, 0, R)
  base.addColorStop(0, '#2d2926'); base.addColorStop(0.5, '#1e1b18'); base.addColorStop(1, '#0c0b09')
  ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2); ctx.fillStyle = base; ctx.fill()
  for (let g = 0; g < 48; g++) {
    const gr = R * 0.26 + g * R * 0.015
    ctx.beginPath(); ctx.arc(0, 0, gr, 0, Math.PI * 2)
    ctx.strokeStyle = g % 3 === 0 ? 'rgba(255,255,255,.04)' : 'rgba(0,0,0,.18)'
    ctx.lineWidth = 0.65; ctx.stroke()
  }
  const LR = R * 0.32
  ctx.save(); ctx.beginPath(); ctx.arc(0, 0, LR, 0, Math.PI * 2); ctx.clip()
  ctx.rotate(-t * 0.78)
  if (img) ctx.drawImage(img, -LR, -LR, LR * 2, LR * 2)
  else { ctx.fillStyle = '#c9a84c'; ctx.beginPath(); ctx.arc(0, 0, LR, 0, Math.PI * 2); ctx.fill() }
  ctx.restore()
  ctx.beginPath(); ctx.arc(0, 0, R * 0.032, 0, Math.PI * 2)
  ctx.fillStyle = '#0e0c0a'; ctx.fill()
  ctx.restore()
}

function renderCD(ctx: any, t: number, img: any) {
  const cx = W / 2, cy = H / 2
  const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, W * 0.7)
  bg.addColorStop(0, '#f0f0fa'); bg.addColorStop(1, '#dde0f0')
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H)
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(t * 1.1)
  const R = W * 0.37
  const cg = ctx.createLinearGradient(-R, -R, R, R)
  cg.addColorStop(0, '#dde0f0'); cg.addColorStop(0.5, '#d0e8f8'); cg.addColorStop(1, '#e0d8f0')
  ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2); ctx.fillStyle = cg; ctx.fill()
  for (let r = 0; r < 12; r++) {
    const r1 = R * 0.22 + r * R * 0.053
    const rg = ctx.createRadialGradient(0, 0, r1, 0, 0, r1 + R * 0.025)
    rg.addColorStop(0, `hsla(${(r * 30 + t * 45) % 360},60%,72%,.22)`)
    rg.addColorStop(1, 'transparent')
    ctx.beginPath(); ctx.arc(0, 0, r1 + R * 0.025, 0, Math.PI * 2)
    ctx.arc(0, 0, r1, 0, Math.PI * 2, true); ctx.fillStyle = rg; ctx.fill()
  }
  const LR = R * 0.38
  ctx.save(); ctx.beginPath(); ctx.arc(0, 0, LR, 0, Math.PI * 2); ctx.clip()
  ctx.rotate(-t * 1.1)
  if (img) ctx.drawImage(img, -LR, -LR, LR * 2, LR * 2)
  ctx.restore()
  ctx.beginPath(); ctx.arc(0, 0, R * 0.052, 0, Math.PI * 2)
  ctx.fillStyle = '#f0f0f5'; ctx.fill()
  ctx.restore()
}

function renderCassette(ctx: any, t: number, img: any) {
  ctx.fillStyle = '#fafafa'; ctx.fillRect(0, 0, W, H)
  const cx = W / 2, cy = H / 2
  const cW = W * 0.65, cH = H * 0.4, cX = cx - cW / 2, cY = cy - cH / 2 - H * 0.02
  const bd = ctx.createLinearGradient(cX, cY, cX, cY + cH)
  bd.addColorStop(0, '#f8f8f8'); bd.addColorStop(1, '#e8e8e8')
  ctx.fillStyle = bd; ctx.fillRect(cX, cY, cW, cH)
  ctx.strokeStyle = 'rgba(0,0,0,.08)'; ctx.lineWidth = 1; ctx.strokeRect(cX, cY, cW, cH)
  const lW = cW * 0.62, lH = cH * 0.4, lX = cx - lW / 2, lY = cY + cH * 0.1
  if (img) ctx.drawImage(img, lX, lY, lW, lH)
  const wW = cW * 0.56, wH = cH * 0.3, wX = cx - wW / 2, wY = cY + cH * 0.62
  ctx.fillStyle = '#e0e0e0'; ctx.fillRect(wX, wY, wW, wH)
  const rR = wH * 0.36, rCy = wY + wH * 0.44
  for (const rcx of [wX + wW * 0.26, wX + wW * 0.74]) {
    ctx.save(); ctx.translate(rcx, rCy); ctx.rotate(t * 3)
    ctx.beginPath(); ctx.arc(0, 0, rR, 0, Math.PI * 2)
    ctx.fillStyle = '#d0ccc8'; ctx.fill()
    ctx.beginPath(); ctx.arc(0, 0, rR * 0.24, 0, Math.PI * 2); ctx.fillStyle = '#e8d070'; ctx.fill()
    ctx.restore()
  }
}

function renderCanvasStyle(ctx: any, t: number, img: any) {
  if (img) {
    const z = 1 + Math.sin(t * 0.35) * 0.055
    ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2)
    ctx.drawImage(img, 0, 0, W, H); ctx.restore()
  } else { ctx.fillStyle = '#e0f0e8'; ctx.fillRect(0, 0, W, H) }
  const vg = ctx.createRadialGradient(W / 2, H / 2, W * 0.1, W / 2, H / 2, W * 0.65)
  vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.42)')
  ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H)
  const bc = 34, bY = H * 0.88, bX = W / 2 - W * 0.28
  for (let b = 0; b < bc; b++) {
    const bh = (H * 0.05) * (Math.abs(Math.sin(b * 0.42 + t * 2.8)) * 0.6 + 0.3)
    const x = bX + b * (W * 0.56 / bc + 3)
    ctx.fillStyle = 'rgba(0,113,227,.6)'; ctx.fillRect(x, bY - bh / 2, W * 0.56 / bc, bh)
  }
}

function renderLED(ctx: any, t: number, img: any) {
  ctx.fillStyle = '#0a0a0a'; ctx.fillRect(0, 0, W, H)
  const cols = 24, rows = 24
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const dx = c / cols - 0.5, dy = r / rows - 0.5, d = Math.sqrt(dx * dx + dy * dy)
    const v = (Math.sin(d * 9 - t * 3.2) * 0.5 + 0.5) * (1 - d * 1.05)
    if (v > 0.08) {
      ctx.fillStyle = `hsla(${(r * 6 + c * 4 + t * 32) % 360},95%,58%,${v * 0.3})`
      ctx.fillRect(c * W / cols + 3, r * H / rows + 3, W / cols - 6, H / rows - 6)
    }
  }
  const sW = W * 0.5, sH = H * 0.5, sX = W / 2 - sW / 2, sY = H / 2 - sH / 2 - H * 0.04
  ctx.fillStyle = '#111'; ctx.fillRect(sX - 12, sY - 12, sW + 24, sH + 24)
  if (img) ctx.drawImage(img, sX, sY, sW, sH)
  const wc = 56, wmH = H * 0.1, wX = W / 2 - W * 0.42, wY = H * 0.9
  for (let i = 0; i < wc; i++) {
    const bh = wmH * (Math.abs(Math.sin(i * 0.38 + t * 4.5)) * 0.5 + 0.3)
    ctx.fillStyle = `hsl(${210 + i / wc * 120},90%,62%)`
    ctx.fillRect(wX + i * (W * 0.84 / wc + 2), wY - bh, W * 0.84 / wc, bh)
  }
}

// ── API handler ───────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const jobId = uuid()
  const jobDir = join(TEMP_DIR, jobId)

  try {
    await mkdir(jobDir, { recursive: true })
    const formData = await req.formData()

    const artworkFile  = formData.get('artwork')  as File | null
    const audioFile    = formData.get('audio')    as File | null
    const template     = formData.get('template') as string || 'vinyl-record'
    const resolution   = formData.get('resolution') as string || '1080'
    const durationSec  = parseInt(formData.get('duration') as string || '10')
    const fps          = parseInt(formData.get('fps') as string || '30')

    const totalFrames = durationSec * fps

    // Save audio
    let audioPath: string | null = null
    if (audioFile) {
      audioPath = join(jobDir, 'audio.' + (audioFile.name.endsWith('.wav') ? 'wav' : 'mp3'))
      const buf = Buffer.from(await audioFile.arrayBuffer())
      await writeFile(audioPath, buf)
    }

    // Load artwork
    let artworkCanvas: any = null
    if (artworkFile) {
      const buf = Buffer.from(await artworkFile.arrayBuffer())
      artworkCanvas = await loadImage(buf)
    }

    // Render frames into memory as PNG buffers
    const canvas = createCanvas(W, H)
    const ctx    = canvas.getContext('2d') as any

    const framePaths: string[] = []
    for (let f = 0; f < totalFrames; f++) {
      const t = f / fps
      await renderFrame(ctx, template, t, artworkCanvas)
      const framePath = join(jobDir, `frame-${String(f).padStart(5, '0')}.png`)
      const pngBuf = canvas.toBuffer('image/png')
      await writeFile(framePath, pngBuf)
      framePaths.push(framePath)
    }

    // FFmpeg encode
    const outputPath = join(jobDir, 'output.mp4')
    await new Promise<void>((resolve, reject) => {
      const cmd = ffmpeg()
        .input(join(jobDir, 'frame-%05d.png'))
        .inputFPS(fps)

      if (audioPath) {
        cmd.input(audioPath)
          .audioCodec('aac')
          .audioBitrate('192k')
      }

      cmd
        .videoCodec('libx264')
        .outputOptions([
          '-crf 18',
          '-preset fast',
          '-pix_fmt yuv420p',
          '-movflags +faststart',
          audioPath ? `-t ${durationSec}` : `-frames:v ${totalFrames}`,
        ])
        .output(outputPath)
        .on('end', () => resolve())
        .on('error', reject)
        .run()
    })

    // Read output and stream back
    const videoBuffer = await readFile(outputPath)

    // Cleanup in background
    rm(jobDir, { recursive: true, force: true }).catch(() => {})

    return new NextResponse(videoBuffer, {
      headers: {
        'Content-Type':        'video/mp4',
        'Content-Disposition': 'attachment; filename="motionart-export.mp4"',
        'Content-Length':      String(videoBuffer.length),
      },
    })
  } catch (err) {
    rm(jobDir, { recursive: true, force: true }).catch(() => {})
    console.error('[Export Error]', err)
    return NextResponse.json({ error: 'Export failed', details: String(err) }, { status: 500 })
  }
}
