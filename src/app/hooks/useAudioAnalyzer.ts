'use client'
import { useRef, useCallback, useState } from 'react'

export interface AudioData {
  frequencies: Uint8Array
  waveform:    Uint8Array
  bass:        number  // 0-1
  mid:         number  // 0-1
  high:        number  // 0-1
  energy:      number  // 0-1
}

export function useAudioAnalyzer() {
  const ctxRef      = useRef<AudioContext | null>(null)
  const analyzerRef = useRef<AnalyserNode | null>(null)
  const sourceRef   = useRef<AudioBufferSourceNode | null>(null)
  const rafRef      = useRef<number>(0)
  const freqRef     = useRef<Uint8Array>(new Uint8Array(1024))
  const waveRef     = useRef<Uint8Array>(new Uint8Array(1024))

  const [audioData,   setAudioData]   = useState<AudioData | null>(null)
  const [isPlaying,   setIsPlaying]   = useState(false)
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null)

  /** Load & decode an audio File into AudioBuffer */
  const loadAudio = useCallback(async (file: File) => {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    ctxRef.current = ctx
    const arr = await file.arrayBuffer()
    const buf = await ctx.decodeAudioData(arr)
    setAudioBuffer(buf)
    return buf
  }, [])

  /** Start analysis loop — connects source → analyzer → output */
  const startAnalysis = useCallback((buf: AudioBuffer) => {
    const ctx = ctxRef.current
    if (!ctx) return

    const analyzer = ctx.createAnalyser()
    analyzer.fftSize = 2048
    analyzer.smoothingTimeConstant = 0.8
    analyzerRef.current = analyzer

    const source = ctx.createBufferSource()
    source.buffer = buf
    source.loop = true
    source.connect(analyzer)
    analyzer.connect(ctx.destination)
    source.start(0)
    sourceRef.current = source

    freqRef.current = new Uint8Array(analyzer.frequencyBinCount)
    waveRef.current = new Uint8Array(analyzer.frequencyBinCount)

    setIsPlaying(true)

    const tick = () => {
      analyzer.getByteFrequencyData(freqRef.current as any)
      analyzer.getByteTimeDomainData(waveRef.current as any)
      const f = freqRef.current

      const avg   = (arr: Uint8Array, s: number, e: number) =>
        arr.slice(s, e).reduce((a, b) => a + b, 0) / ((e - s) * 255)

      setAudioData({
        frequencies: new Uint8Array(f),
        waveform:    new Uint8Array(waveRef.current),
        bass:        avg(f, 0,   5),
        mid:         avg(f, 5,   40),
        high:        avg(f, 40,  200),
        energy:      avg(f, 0,   f.length),
      })

      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
  }, [])

  const stopAnalysis = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    try { sourceRef.current?.stop() } catch {}
    ctxRef.current?.close()
    ctxRef.current    = null
    analyzerRef.current = null
    setIsPlaying(false)
  }, [])

  /** Get raw frequency data for direct canvas rendering */
  const getFrequencyData = useCallback(() => {
    analyzerRef.current?.getByteFrequencyData(freqRef.current as any)
    return freqRef.current
  }, [])

  return { loadAudio, startAnalysis, stopAnalysis, getFrequencyData, isPlaying, audioData, audioBuffer }
}
