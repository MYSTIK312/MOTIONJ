'use client'
import { useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import PreviewCanvas from '../preview/PreviewCanvas'
import type { TemplateId } from '../../lib/config'
import { TEMPLATES } from '../../lib/config'
import type { AudioData } from '../../hooks/useAudioAnalyzer'

const TPL_ICONS: Record<TemplateId, string> = {
  'cd-disc':        '💿',
  'vinyl-record':   '🎵',
  'cassette-tape':  '📼',
  'spotify-canvas': '✦',
  'club-led':       '▤',
}

interface Props {
  templateId:    TemplateId
  artworkUrl:    string | null
  audioData:     AudioData | null
  isPlaying:     boolean
  onTplChange:   (id: TemplateId) => void
  onUploadClick: () => void
  onAudioClick:  () => void
  onPlayToggle:  () => void
  audioName:     string | null
}

export default function LivePreviewSection({
  templateId, artworkUrl, audioData, isPlaying,
  onTplChange, onUploadClick, onAudioClick, onPlayToggle, audioName,
}: Props) {
  const { ref, visible } = useScrollReveal()

  return (
    <section id="preview" className="section-white" style={{ padding: '140px 24px' }}>
      <div ref={ref} style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Header */}
        <div className={`reveal ${visible ? 'in' : ''}`} style={{ textAlign: 'center', marginBottom: 64 }}>
          <p style={{ fontSize: 13, fontWeight: 600, letterSpacing: '.05em', textTransform: 'uppercase', color: '#0071e3', marginBottom: 12 }}>
            Live Preview
          </p>
          <h2 className="text-display">
            See it come alive<br />
            <span style={{ color: '#6e6e73', fontWeight: 400 }}>in real time.</span>
          </h2>
        </div>

        {/* Preview layout */}
        <div className={`reveal reveal-d1 ${visible ? 'in' : ''}`} style={{ display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap', justifyContent: 'center' }}>

          {/* Canvas stage */}
          <div
            style={{
              position: 'relative', flexShrink: 0,
              borderRadius: 28, overflow: 'hidden',
              boxShadow: '0 40px 120px rgba(0,0,0,.14)',
              border: '1px solid #e8e8ed',
              background: '#f5f5f7',
              cursor: 'pointer',
            }}
            onClick={onUploadClick}
          >
            <PreviewCanvas
              templateId={templateId}
              artworkUrl={artworkUrl}
              audioData={audioData}
              isPlaying={isPlaying}
            />

            {/* Upload overlay (shown when no artwork) */}
            {!artworkUrl && (
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: 10, pointerEvents: 'none',
              }}>
                <div style={{
                  width: 64, height: 64, borderRadius: '50%',
                  border: '1.5px dashed #d2d2d7', background: 'rgba(255,255,255,.7)',
                  backdropFilter: 'blur(4px)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 16V6M8 10l4-4 4 4M3 19v1a2 2 0 002 2h14a2 2 0 002-2v-1" stroke="#a1a1a6" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar controls */}
          <div style={{ width: 240, flexShrink: 0 }}>

            {/* Template switcher */}
            <div className="card" style={{ padding: 20, marginBottom: 14 }}>
              <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: '#a1a1a6', marginBottom: 12 }}>
                Template
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {TEMPLATES.map(tpl => (
                  <motion.button
                    key={tpl.id}
                    whileTap={{ scale: .97 }}
                    onClick={() => onTplChange(tpl.id)}
                    style={{
                      display:    'flex', alignItems: 'center', gap: 10,
                      padding:    '9px 12px', borderRadius: 10,
                      border:     'none', cursor: 'pointer', width: '100%', textAlign: 'left',
                      background: templateId === tpl.id ? 'rgba(0,113,227,.08)' : 'transparent',
                      color:      templateId === tpl.id ? '#0071e3' : '#1d1d1f',
                      transition: 'background .15s, color .15s',
                      fontFamily: '-apple-system, sans-serif',
                    }}
                  >
                    <span style={{ fontSize: 17 }}>{TPL_ICONS[tpl.id]}</span>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{tpl.name}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Upload / Audio controls */}
            <div className="card" style={{ padding: 20 }}>
              <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: '#a1a1a6', marginBottom: 12 }}>
                Media
              </p>

              <button
                className="btn btn-secondary btn-sm"
                style={{ width: '100%', justifyContent: 'center', marginBottom: 8 }}
                onClick={onUploadClick}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 10V2M4 5l3-3 3 3M1.5 11.5v1A.5.5 0 002 13h10a.5.5 0 00.5-.5v-1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {artworkUrl ? 'Change Artwork' : 'Upload Artwork'}
              </button>

              <button
                className="btn btn-secondary btn-sm"
                style={{ width: '100%', justifyContent: 'center', marginBottom: 12 }}
                onClick={onAudioClick}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 4h3l2-2v10L5 10H2V4zM9.5 4.5a4 4 0 010 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {audioName ? audioName.slice(0, 16) + (audioName.length > 16 ? '…' : '') : 'Add Audio'}
              </button>

              {/* Play toggle */}
              <button
                className="btn btn-sm"
                style={{
                  width: '100%', justifyContent: 'center',
                  background: isPlaying ? '#0071e3' : '#f5f5f7',
                  color: isPlaying ? '#fff' : '#1d1d1f',
                  border: 'none',
                }}
                onClick={onPlayToggle}
              >
                {isPlaying ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <rect x="2" y="1" width="4" height="12" rx="1" fill="currentColor"/>
                      <rect x="8" y="1" width="4" height="12" rx="1" fill="currentColor"/>
                    </svg>
                    Pause
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 1l11 6L2 13V1z" fill="currentColor"/>
                    </svg>
                    Play
                  </>
                )}
              </button>
            </div>

            {/* Audio reactive indicator */}
            {audioData && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="card"
                style={{ padding: '14px 18px', marginTop: 12 }}
              >
                <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: '#a1a1a6', marginBottom: 10 }}>
                  Audio Reactive
                </p>
                {[
                  { label: 'Bass', value: audioData.bass },
                  { label: 'Mid',  value: audioData.mid  },
                  { label: 'High', value: audioData.high },
                ].map(({ label, value }) => (
                  <div key={label} style={{ marginBottom: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#6e6e73', marginBottom: 4 }}>
                      <span>{label}</span>
                      <span>{Math.round(value * 100)}%</span>
                    </div>
                    <div className="progress-track">
                      <motion.div
                        className="progress-fill"
                        animate={{ width: `${value * 100}%` }}
                        transition={{ duration: 0.08 }}
                      />
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
