'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import type { ExportSettings, ExportStatus } from '../../lib/config'
import { DEFAULT_EXPORT } from '../../lib/config'

interface Props {
  artworkUrl: string | null
  audioName:  string | null
  onExport:   (settings: ExportSettings) => void
  status:     ExportStatus
  progress:   number
  statusMsg:  string
  onReset:    () => void
}

export default function ExportSection({ artworkUrl, audioName, onExport, status, progress, statusMsg, onReset }: Props) {
  const { ref, visible } = useScrollReveal()
  const [settings, setSettings] = useState<ExportSettings>(DEFAULT_EXPORT)

  const set = <K extends keyof ExportSettings>(k: K, v: ExportSettings[K]) =>
    setSettings(s => ({ ...s, [k]: v }))

  const canExport = !!artworkUrl

  return (
    <section id="export" className="section-light" style={{ padding: '140px 24px' }}>
      <div ref={ref} style={{ maxWidth: 980, margin: '0 auto' }}>

        {/* Header */}
        <div className={`reveal ${visible ? 'in' : ''}`} style={{ textAlign: 'center', marginBottom: 64 }}>
          <p style={{ fontSize: 13, fontWeight: 600, letterSpacing: '.05em', textTransform: 'uppercase', color: '#0071e3', marginBottom: 12 }}>
            Export
          </p>
          <h2 className="text-display">
            Ready when<br />
            <span style={{ color: '#6e6e73', fontWeight: 400 }}>you are.</span>
          </h2>
          <p className="text-body-lg" style={{ maxWidth: 420, margin: '14px auto 0', color: '#6e6e73' }}>
            Choose your settings and download a broadcast-ready video file.
          </p>
        </div>

        {/* Panel */}
        <motion.div
          className={`card reveal reveal-d1 ${visible ? 'in' : ''}`}
          style={{ maxWidth: 580, margin: '0 auto', padding: 52 }}
        >
          {/* File status row */}
          <div style={{
            display: 'flex', gap: 8, marginBottom: 32, padding: '14px 18px',
            borderRadius: 12, background: '#f5f5f7',
            border: '1px solid #e8e8ed',
          }}>
            <div style={{ display: 'flex', gap: 12, flex: 1, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                <span style={{ color: artworkUrl ? '#34c759' : '#a1a1a6', fontSize: 12 }}>
                  {artworkUrl ? '✓' : '○'}
                </span>
                <span style={{ color: artworkUrl ? '#1d1d1f' : '#a1a1a6' }}>
                  {artworkUrl ? 'Artwork ready' : 'No artwork'}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                <span style={{ color: audioName ? '#34c759' : '#a1a1a6', fontSize: 12 }}>
                  {audioName ? '✓' : '○'}
                </span>
                <span style={{ color: audioName ? '#1d1d1f' : '#a1a1a6' }}>
                  {audioName ? audioName.slice(0, 20) : 'No audio (optional)'}
                </span>
              </div>
            </div>
          </div>

          {/* Settings grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 28 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, letterSpacing: '.05em', textTransform: 'uppercase', color: '#6e6e73', marginBottom: 8 }}>
                Resolution
              </label>
              <select className="apple-select" value={settings.resolution} onChange={e => set('resolution', e.target.value as ExportSettings['resolution'])}>
                <option value="720">720 × 720 px</option>
                <option value="1080">1080 × 1080 px</option>
                <option value="4k">4K Upscale</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, letterSpacing: '.05em', textTransform: 'uppercase', color: '#6e6e73', marginBottom: 8 }}>
                Format
              </label>
              <select className="apple-select" value={settings.format} onChange={e => set('format', e.target.value as ExportSettings['format'])}>
                <option value="mp4">MP4 — H.264</option>
                <option value="gif">Animated GIF</option>
                <option value="webm">WebM</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, letterSpacing: '.05em', textTransform: 'uppercase', color: '#6e6e73', marginBottom: 8 }}>
                Duration
              </label>
              <select className="apple-select" value={settings.duration} onChange={e => set('duration', Number(e.target.value) as ExportSettings['duration'])}>
                <option value={10}>10 seconds</option>
                <option value={15}>15 seconds</option>
                <option value={30}>30 seconds</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, letterSpacing: '.05em', textTransform: 'uppercase', color: '#6e6e73', marginBottom: 8 }}>
                Frame Rate
              </label>
              <select className="apple-select" value={settings.fps} onChange={e => set('fps', Number(e.target.value) as ExportSettings['fps'])}>
                <option value={24}>24 fps (cinematic)</option>
                <option value={30}>30 fps</option>
                <option value={60}>60 fps</option>
              </select>
            </div>
          </div>

          {/* Divider */}
          <div className="divider" style={{ marginBottom: 28 }} />

          {/* Export button / progress / success */}
          <AnimatePresence mode="wait">
            {status === 'idle' && (
              <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <button
                  className="btn btn-primary"
                  style={{ width: '100%', fontSize: 17, height: 52, borderRadius: 14, justifyContent: 'center' }}
                  disabled={!canExport}
                  onClick={() => onExport(settings)}
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M9 12V3M5.5 8.5l3.5 3.5 3.5-3.5M2.5 14.5v.5A1.5 1.5 0 004 16.5h10a1.5 1.5 0 001.5-1.5v-.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Export Video
                </button>
                {!canExport && (
                  <p style={{ textAlign: 'center', fontSize: 13, color: '#a1a1a6', marginTop: 12 }}>
                    Upload artwork to enable export
                  </p>
                )}
              </motion.div>
            )}

            {(status === 'rendering' || status === 'encoding') && (
              <motion.div key="progress" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div style={{ marginBottom: 16 }}>
                  <div className="progress-track" style={{ height: 4 }}>
                    <motion.div
                      className="progress-fill"
                      style={{ position: 'relative' }}
                      initial={{ width: '0%' }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                    >
                      <div style={{
                        position: 'absolute', top: 0, right: 0, bottom: 0, width: 60,
                        background: 'linear-gradient(90deg,transparent,rgba(255,255,255,.5))',
                        animation: 'shimmer 1.2s ease-in-out infinite',
                      }} />
                    </motion.div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#6e6e73' }}>
                  <span>{statusMsg}</span>
                  <span style={{ color: '#0071e3', fontWeight: 600 }}>{Math.round(progress)}%</span>
                </div>
              </motion.div>
            )}

            {status === 'done' && (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: .95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                style={{ textAlign: 'center', paddingTop: 8 }}
              >
                <div style={{
                  width: 60, height: 60, borderRadius: '50%',
                  background: 'rgba(52,199,89,.1)', border: '1px solid rgba(52,199,89,.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px',
                }}>
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <path d="M5 14l6.5 6.5L23 7" stroke="#34c759" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 6 }}>
                  Video exported!
                </h3>
                <p style={{ fontSize: 15, color: '#6e6e73', marginBottom: 24 }}>
                  {settings.resolution === '4k' ? '3840' : settings.resolution} × {settings.resolution === '4k' ? '3840' : settings.resolution} · {settings.format.toUpperCase()} · {settings.fps} fps
                </p>
                <button
                  className="btn btn-primary"
                  style={{ margin: '0 auto' }}
                  onClick={onReset}
                >
                  Export Another
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3 7h8M7.5 3.5l3.5 3.5-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </motion.div>
            )}

            {status === 'error' && (
              <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center' }}>
                <p style={{ color: '#ff3b30', marginBottom: 16 }}>Export failed. Please try again.</p>
                <button className="btn btn-secondary" onClick={onReset}>Try Again</button>
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      </div>
    </section>
  )
}
