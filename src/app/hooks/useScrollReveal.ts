'use client'
import { useEffect, useRef, useState } from 'react'

export function useScrollReveal(rootMargin = '0px 0px -60px 0px') {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ob = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); ob.unobserve(el) } },
      { threshold: 0.12, rootMargin }
    )
    ob.observe(el)
    return () => ob.disconnect()
  }, [rootMargin])

  return { ref, visible }
}
