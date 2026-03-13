# MotionArt Studio

> Turn your cover art into cinematic promotional videos — in seconds.

A premium Apple-style web application for DJs and music artists to create animated promotional videos from cover artwork and audio. Features 3D spinning templates, audio-reactive visualizers, and FFmpeg-powered 1080p export.

---

## ✨ Features

- **5 animated 3D templates** — CD disc, Vinyl record, Cassette tape, Spotify Canvas, Club LED screen
- **Audio-reactive visualizer** — Real-time bass/mid/high analysis via Web Audio API
- **Live canvas preview** — Instant preview with your artwork, switches templates seamlessly
- **1080p MP4 export** — Server-side FFmpeg rendering with audio mixed in
- **Apple-style UI** — White background, generous spacing, smooth Framer Motion animations
- **Drag & drop upload** — Drop artwork or audio anywhere on the page

---

## 🗂 Project Structure

```
motionart/
├── src/
│   └── app/
│       ├── api/
│       │   └── export/
│       │       └── route.ts          # FFmpeg video export endpoint
│       ├── components/
│       │   ├── ui/
│       │   │   └── Navbar.tsx        # Fixed frosted-glass nav
│       │   ├── sections/
│       │   │   ├── HeroSection.tsx           # Hero with canvas vinyl animation
│       │   │   ├── HowItWorksSection.tsx     # 3-step process cards
│       │   │   ├── TemplateGallerySection.tsx # Template grid with live mini-previews
│       │   │   ├── LivePreviewSection.tsx    # Full preview + sidebar controls
│       │   │   └── ExportSection.tsx         # Export settings + progress
│       │   └── preview/
│       │       └── PreviewCanvas.tsx         # Main canvas renderer (all 5 templates)
│       ├── hooks/
│       │   ├── useAudioAnalyzer.ts   # Web Audio API analysis hook
│       │   └── useScrollReveal.ts    # IntersectionObserver scroll reveal
│       ├── lib/
│       │   └── config.ts             # Templates, types, constants
│       ├── styles/
│       │   └── globals.css           # Apple design system tokens + utilities
│       ├── layout.tsx
│       └── page.tsx                  # Root page — wires all sections together
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ 
- **FFmpeg** installed on your system

#### Install FFmpeg

```bash
# macOS
brew install ffmpeg

# Ubuntu / Debian
sudo apt-get install ffmpeg

# Windows (via Chocolatey)
choco install ffmpeg
```

### Installation

```bash
# 1. Clone or unzip the project
cd motionart

# 2. Install dependencies
npm install

# 3. Create temp directory for exports
mkdir -p /tmp/motionart

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the app is live.

---

## 🎬 How to Use

1. **Upload artwork** — Click "Upload Your Track" or drag a PNG/JPG anywhere on the page
2. **Choose a template** — Click any card in the Template Gallery section
3. **Add audio (optional)** — Click "Add Audio" in the preview sidebar for audio-reactive effects
4. **Preview live** — Watch your artwork animate in real time; switch templates instantly
5. **Export** — Choose resolution, format, and duration, then click "Export Video"

---

## 🔧 Configuration

### Export API (`/api/export`)

Accepts `multipart/form-data` with:

| Field        | Type   | Description                          |
|-------------|--------|--------------------------------------|
| `artwork`    | File   | PNG / JPG cover art                  |
| `audio`      | File   | MP3 / WAV audio (optional)           |
| `template`   | string | Template ID (e.g. `vinyl-record`)    |
| `resolution` | string | `720`, `1080`, or `4k`               |
| `duration`   | string | `10`, `15`, or `30` (seconds)        |
| `fps`        | string | `24`, `30`, or `60`                  |

Returns a binary `video/mp4` stream.

### Adding a New Template

1. Add the template config to `src/app/lib/config.ts` in the `TEMPLATES` array
2. Add a renderer function in `PreviewCanvas.tsx` for the live preview
3. Add the same renderer in `api/export/route.ts` for server-side export
4. Add a mini animation component to `TemplateGallerySection.tsx`

---

## 🏗 Tech Stack

| Layer           | Technology                        |
|----------------|-----------------------------------|
| Framework       | Next.js 14 (App Router)           |
| UI              | React 18 + Tailwind CSS           |
| Animations      | Framer Motion                     |
| 3D/Canvas       | HTML Canvas 2D (templates)        |
| Audio Analysis  | Web Audio API                     |
| Video Export    | FFmpeg via fluent-ffmpeg           |
| Server Canvas   | node-canvas                       |

---

## 📦 Deployment (Vercel)

```bash
npm run build
vercel --prod
```

**Important:** Vercel Serverless Functions have a default 10s timeout. For long exports:
- Upgrade to **Vercel Pro** (60s timeout)  
- Or use **Vercel Edge Functions** with streaming  
- Or deploy the export route separately on a VPS/container

For FFmpeg on Vercel, use [`@ffmpeg-installer/ffmpeg`](https://www.npmjs.com/package/@ffmpeg-installer/ffmpeg) and set the binary path:

```ts
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg'
ffmpeg.setFfmpegPath(ffmpegInstaller.path)
```

---

## 🎨 Design System

The UI strictly follows Apple's design language:

| Token               | Value                    |
|--------------------|--------------------------|
| Background          | `#FFFFFF`                |
| Primary text        | `#1D1D1F`                |
| Secondary text      | `#6E6E73`                |
| Accent blue         | `#0071E3`                |
| Surface / off-white | `#F5F5F7`                |
| Hero gradient       | `#FFF → #FDFDFE → #FAFAFC → #F5F5F7` |
| Section padding     | `140px` vertical          |
| Card radius         | `24px`                   |
| Font                | SF Pro / `-apple-system` |

---

## 📄 License

MIT — free to use, modify, and deploy.
