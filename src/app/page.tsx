'use client'

import { useState, useRef, useCallback } from 'react'
import Navbar from './components/ui/Navbar'
import HeroSection from './components/sections/HeroSection'
import HowItWorksSection from './components/sections/HowItWorksSection'
import TemplateGallerySection from './components/sections/TemplateGallerySection'
import LivePreviewSection from './components/sections/LivePreviewSection'
import ExportSection from './components/sections/ExportSection'
import { useAudioAnalyzer } from './hooks/useAudioAnalyzer'
import type { TemplateId, ExportSettings, ExportStatus } from './lib/config'

// ── Feature strip between hero and how-it-works ───────────────────────────────

function FeatureStrip() {
  const chips = [
    'Real-time 3D preview',
    'Audio-reactive effects',
    '1080p MP4 export',
    'Drag & drop upload',
  ]
  return (
    <div style={{
      background: '#f5f5f7',
      borderTop: '1px solid #e8e8ed', borderBottom: '1px solid #e8e8ed',
      padding: '18px 24px',
      display: 'flex', justifyContent: 'center', gap: 48, flexWrap: 'wrap',
    }}>
      {chips.map(c => (
        <div key={c} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, fontWeight: 500 }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="6.5" stroke="#0071e3" strokeWidth="1.2"/>
            <path d="M4.5 7L6 8.5L9.5 5" stroke="#0071e3" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {c}
        </div>
      ))}
    </div>
  )
}

// ── Footer ────────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer style={{ background: '#f5f5f7', borderTop: '1px solid #e8e8ed', padding: '48px 24px 36px' }}>
      <div style={{ maxWidth: 980, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 32 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.03em' }}>
            Motion<span style={{ color: '#0071e3' }}>Art</span>
          </div>
          <p style={{ fontSize: 13, color: '#6e6e73', marginTop: 8, maxWidth: 260, lineHeight: 1.6 }}>
            Turn your cover art into cinematic motion. Export broadcast-ready promo videos in seconds.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap' }}>
          {[
            { title: 'Product',  links: ['Templates', 'Pricing', 'Changelog'] },
            { title: 'Company',  links: ['About', 'Blog', 'Contact'] },
            { title: 'Legal',    links: ['Privacy', 'Terms'] },
          ].map(col => (
            <div key={col.title}>
              <h4 style={{ fontSize: 12, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: '#6e6e73', marginBottom: 12 }}>
                {col.title}
              </h4>
              {col.links.map(l => (
                <a key={l} href="#" style={{ display: 'block', fontSize: 14, color: '#1d1d1f', textDecoration: 'none', opacity: .6, marginBottom: 8, transition: 'opacity .2s' }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '0.6')}>
                  {l}
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div style={{ maxWidth: 980, margin: '28px auto 0', paddingTop: 24, borderTop: '1px solid #e8e8ed', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <p style={{ fontSize: 12, color: '#a1a1a6' }}>Copyright © 2025 MotionArt Studio. All rights reserved.</p>
        <p style={{ fontSize: 12, color: '#a1a1a6' }}>Built with Next.js · Three.js · FFmpeg</p>
      </div>
    </footer>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function Home() {
  // Media state
  const [artworkUrl,  setArtworkUrl]  = useState<string | null>(null)
  const [artworkFile, setArtworkFile] = useState<File | null>(null)
  const [audioFile,   setAudioFile]   = useState<File | null>(null)
  const [audioName,   setAudioName]   = useState<string | null>(null)

  // Template + preview state
  const [templateId, setTemplateId] = useState<TemplateId>('cd-disc')
  const [isPlaying,  setIsPlaying]  = useState(true)

  // Export state
  const [exportStatus,  setExportStatus]  = useState<ExportStatus>('idle')
  const [exportProgress, setExportProgress] = useState(0)
  const [exportMsg,     setExportMsg]     = useState('Rendering frames…')

  // Hidden file inputs
  const artworkInputRef = useRef<HTMLInputElement>(null)
  const audioInputRef   = useRef<HTMLInputElement>(null)

  // Audio analyzer
  const { loadAudio, startAnalysis, stopAnalysis, isPlaying: audioPlaying, audioData } = useAudioAnalyzer()

  // ── Handlers ────────────────────────────────────────────────────────────

  const handleArtworkFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return
    const url = URL.createObjectURL(file)
    setArtworkUrl(url)
    setArtworkFile(file)
  }, [])

  const handleAudioFile = useCallback(async (file: File) => {
    setAudioFile(file)
    setAudioName(file.name)
    try {
      const buf = await loadAudio(file)
      startAnalysis(buf)
    } catch (e) {
      console.error('Audio load error', e)
    }
  }, [loadAudio, startAnalysis])

  const handleArtworkInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) handleArtworkFile(f)
    e.target.value = ''
  }, [handleArtworkFile])

  const handleAudioInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) handleAudioFile(f)
    e.target.value = ''
  }, [handleAudioFile])

  // Drag & drop on the whole app
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (!file) return
    if (file.type.startsWith('image/'))        handleArtworkFile(file)
    else if (file.type.startsWith('audio/'))   handleAudioFile(file)
  }, [handleArtworkFile, handleAudioFile])

  // ── Export ───────────────────────────────────────────────────────────────

  const handleExport = useCallback(async (settings: ExportSettings) => {
    if (!artworkFile) return
    setExportStatus('rendering')
    setExportProgress(0)

    // Simulate progress while server renders
    const msgs = ['Rendering frames…', 'Encoding video…', 'Mixing audio…', 'Finalizing…', 'Almost done…']
    let pct = 0
    const timer = setInterval(() => {
      pct = Math.min(pct + (pct < 65 ? 5 : 2), 96)
      setExportProgress(pct)
      setExportMsg(msgs[Math.min(Math.floor(pct / 22), msgs.length - 1)])
    }, 300)

    try {
      setExportStatus('encoding')
      const fd = new FormData()
      fd.append('artwork',    artworkFile)
      fd.append('template',   templateId)
      fd.append('resolution', settings.resolution)
      fd.append('duration',   String(settings.duration))
      fd.append('fps',        String(settings.fps))
      if (audioFile) fd.append('audio', audioFile)

      const res = await fetch('/api/export', { method: 'POST', body: fd })
      clearInterval(timer)

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Export failed')
      }

      // Trigger download
      const blob = await res.blob()
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href = url; a.download = 'motionart-export.mp4'
      document.body.appendChild(a); a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setExportProgress(100)
      setExportStatus('done')
    } catch (err) {
      clearInterval(timer)
      console.error(err)
      setExportStatus('error')
    }
  }, [artworkFile, audioFile, templateId])

  const resetExport = useCallback(() => {
    setExportStatus('idle')
    setExportProgress(0)
    setExportMsg('Rendering frames…')
  }, [])

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div
      onDrop={handleDrop}
      onDragOver={e => e.preventDefault()}
      style={{ minHeight: '100vh' }}
    >
      {/* Nav */}
      <Navbar />

      {/* Hidden inputs */}
      <input
        ref={artworkInputRef}
        type="file" accept="image/png,image/jpeg,image/jpg,image/webp"
        style={{ display: 'none' }}
        onChange={handleArtworkInput}
      />
      <input
        ref={audioInputRef}
        type="file" accept="audio/mp3,audio/mpeg,audio/wav,audio/aiff"
        style={{ display: 'none' }}
        onChange={handleAudioInput}
      />

      {/* Sections */}
      <HeroSection
        artworkUrl={artworkUrl}
        onUploadClick={() => artworkInputRef.current?.click()}
      />

      <FeatureStrip />

      <HowItWorksSection />

      <div className="divider" />

      <TemplateGallerySection
        active={templateId}
        onSelect={id => {
          setTemplateId(id)
          document.getElementById('preview')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }}
      />

      <div className="divider" />

      <LivePreviewSection
        templateId={templateId}
        artworkUrl={artworkUrl}
        audioData={audioData}
        isPlaying={isPlaying}
        onTplChange={setTemplateId}
        onUploadClick={() => artworkInputRef.current?.click()}
        onAudioClick={() => audioInputRef.current?.click()}
        onPlayToggle={() => setIsPlaying(p => !p)}
        audioName={audioName}
      />

      <div className="divider" />

      <ExportSection
        artworkUrl={artworkUrl}
        audioName={audioName}
        onExport={handleExport}
        status={exportStatus}
        progress={exportProgress}
        statusMsg={exportMsg}
        onReset={resetExport}
      />

      <Footer />
    </div>
  )
}
