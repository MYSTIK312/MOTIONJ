'use client'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <nav
      style={{
        position:         'fixed',
        top:              0, left: 0, right: 0,
        zIndex:           200,
        height:           52,
        display:          'flex',
        alignItems:       'center',
        justifyContent:   'space-between',
        padding:          '0 24px',
        background:       scrolled ? 'rgba(255,255,255,0.88)' : 'rgba(255,255,255,0.72)',
        backdropFilter:   'saturate(180%) blur(20px)',
        WebkitBackdropFilter: 'saturate(180%) blur(20px)',
        borderBottom:     '1px solid rgba(0,0,0,0.07)',
        transition:       'background 0.3s',
      }}
    >
      {/* Logo */}
      <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.03em', color: '#1d1d1f' }}>
        Motion<span style={{ color: '#0071e3' }}>Art</span>
      </div>

      {/* Links */}
      <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
        {['How it works', 'Templates', 'Preview', 'Export'].map((label, i) => {
          const ids = ['#how', '#templates', '#preview', '#export']
          return (
            <a
              key={label}
              href={ids[i]}
              style={{
                fontSize:       13,
                fontWeight:     400,
                color:          '#1d1d1f',
                textDecoration: 'none',
                opacity:        0.65,
                transition:     'opacity 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '0.65')}
            >
              {label}
            </a>
          )
        })}
      </div>

      {/* CTA */}
      <button
        className="btn btn-primary btn-sm"
        onClick={() => document.getElementById('upload-zone')?.scrollIntoView({ behavior: 'smooth' })}
      >
        Upload Track
      </button>
    </nav>
  )
}
