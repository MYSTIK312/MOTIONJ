// ── Types ────────────────────────────────────────────────────────────────────

export type TemplateId = 'vinyl-record' | 'cd-disc' | 'cassette-tape' | 'spotify-canvas' | 'club-led'

export interface Template {
  id:          TemplateId
  name:        string
  description: string
  tags:        string[]
  bgGradient:  string
}

export interface UploadState {
  artwork:    File | null
  artworkUrl: string | null
  audio:      File | null
  audioName:  string | null
}

export type ExportResolution = '720' | '1080' | '4k'
export type ExportFormat     = 'mp4' | 'gif' | 'webm'
export type ExportDuration   = 10 | 15 | 30
export type ExportFPS        = 24 | 30 | 60

export interface ExportSettings {
  resolution: ExportResolution
  format:     ExportFormat
  duration:   ExportDuration
  fps:        ExportFPS
}

export type ExportStatus = 'idle' | 'rendering' | 'encoding' | 'done' | 'error'

// ── Constants ────────────────────────────────────────────────────────────────

export const TEMPLATES: Template[] = [
  {
    id: 'cd-disc',
    name: 'CD Disc',
    description: 'Iridescent spinning CD with rainbow light diffraction',
    tags: ['Pop', 'Electronic'],
    bgGradient: 'linear-gradient(135deg,#eef0f8 0%,#dde1f0 100%)',
  },
  {
    id: 'vinyl-record',
    name: 'Vinyl Record',
    description: 'Authentic 3D vinyl with realistic grooves and reflections',
    tags: ['Hip-Hop', 'Soul', 'Classic'],
    bgGradient: 'linear-gradient(135deg,#f5f2ec 0%,#ede4d3 100%)',
  },
  {
    id: 'cassette-tape',
    name: 'Cassette Tape',
    description: 'Retro cassette with spinning reels and lo-fi aesthetic',
    tags: ['Lo-Fi', 'Indie', 'Retro'],
    bgGradient: 'linear-gradient(135deg,#f5f3ee 0%,#e8e0d0 100%)',
  },
  {
    id: 'spotify-canvas',
    name: 'Spotify Canvas',
    description: 'Looping slow-zoom canvas with floating particles',
    tags: ['Ambient', 'Modern', 'Minimal'],
    bgGradient: 'linear-gradient(135deg,#eef8f2 0%,#d4eed8 100%)',
  },
  {
    id: 'club-led',
    name: 'Club LED Screen',
    description: 'Beat-reactive LED grid with pulsing waveform bars',
    tags: ['EDM', 'Club', 'Electronic'],
    bgGradient: 'linear-gradient(135deg,#f8eef2 0%,#f0d4df 100%)',
  },
]

export const DEFAULT_EXPORT: ExportSettings = {
  resolution: '1080',
  format:     'mp4',
  duration:   10,
  fps:        30,
}

export const RESOLUTION_DIM: Record<ExportResolution, { w: number; h: number }> = {
  '720':  { w: 720,  h: 720  },
  '1080': { w: 1080, h: 1080 },
  '4k':   { w: 3840, h: 3840 },
}
