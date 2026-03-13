'use client'
import { motion } from 'framer-motion'
import { useScrollReveal } from '../../hooks/useScrollReveal'

const STEPS = [
  {
    num:   '01',
    icon:  (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M14 18V6M9 11l5-5 5 5M3 21v2a2 2 0 002 2h18a2 2 0 002-2v-2" stroke="#0071e3" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Upload Your Artwork',
    body:  'Drop your cover art in any format — PNG, JPG, or WebP. Any resolution works. We handle the rest, automatically composing it into the template.',
  },
  {
    num:   '02',
    icon:  (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="3" y="3" width="10" height="10" rx="2.5" stroke="#0071e3" strokeWidth="1.8"/>
        <rect x="15" y="3" width="10" height="10" rx="2.5" stroke="#0071e3" strokeWidth="1.8"/>
        <rect x="3" y="15" width="10" height="10" rx="2.5" stroke="#0071e3" strokeWidth="1.8"/>
        <rect x="15" y="15" width="10" height="10" rx="2.5" stroke="#0071e3" strokeWidth="1.8"/>
      </svg>
    ),
    title: 'Choose a Template',
    body:  'Pick from five cinematic 3D animation styles. Swap between them instantly and preview your artwork live inside each template with smooth transitions.',
  },
  {
    num:   '03',
    icon:  (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M14 18V6M9 13.5L14 18l5-4.5M4 22v1.5A1.5 1.5 0 005.5 25h17a1.5 1.5 0 001.5-1.5V22" stroke="#0071e3" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Export Your Video',
    body:  'Download a broadcast-ready 1080 × 1080 MP4 with your audio mixed in. Ready for Instagram, TikTok, Spotify Canvas, and every major platform.',
  },
]

export default function HowItWorksSection() {
  const { ref, visible } = useScrollReveal()

  return (
    <section id="how" className="section-white" style={{ padding: '140px 24px' }}>
      <div ref={ref} style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Header */}
        <div className={`reveal ${visible ? 'in' : ''}`} style={{ textAlign: 'center', marginBottom: 72 }}>
          <p style={{ fontSize: 13, fontWeight: 600, letterSpacing: '.05em', textTransform: 'uppercase', color: '#0071e3', marginBottom: 12 }}>
            Process
          </p>
          <h2 className="text-display">
            Three steps.<br />
            <span style={{ color: '#6e6e73', fontWeight: 400 }}>One stunning promo video.</span>
          </h2>
        </div>

        {/* Cards grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20 }}>
          {STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              className={`card reveal reveal-d${i + 1} ${visible ? 'in' : ''}`}
              style={{ padding: '48px 36px' }}
              whileHover={{ y: -5, boxShadow: '0 20px 64px rgba(0,0,0,.10)' }}
              transition={{ duration: 0.3 }}
            >
              {/* Step number (decorative) */}
              <div style={{ fontSize: 72, fontWeight: 800, lineHeight: 1, color: 'rgba(0,113,227,.06)', letterSpacing: '-0.04em', marginBottom: 24 }}>
                {step.num}
              </div>

              {/* Icon */}
              <div style={{
                width: 56, height: 56, borderRadius: 14,
                background: 'rgba(0,113,227,.06)',
                border: '1px solid rgba(0,113,227,.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 24,
                transition: 'background .25s',
              }}>
                {step.icon}
              </div>

              <h3 className="text-headline" style={{ marginBottom: 12 }}>{step.title}</h3>
              <p className="text-caption" style={{ lineHeight: 1.65, fontSize: 15 }}>{step.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
