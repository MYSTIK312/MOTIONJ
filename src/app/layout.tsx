import type { Metadata } from 'next'
import './styles/globals.css'

export const metadata: Metadata = {
  title: 'MotionArt — Turn Your Cover Art Into Motion',
  description: 'Create animated promotional videos for your music in seconds. 3D spinning vinyl, CD, cassette, and audio-reactive visualizers.',
  openGraph: {
    title: 'MotionArt',
    description: 'Animated promo videos from your cover art',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>{children}</body>
    </html>
  )
}
