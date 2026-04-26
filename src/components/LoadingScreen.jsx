import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import IMAGES from '../data/images.json'
import './LoadingScreen.css'

// ── Only preload the hero video + first image of each category ────────────────
// Full gallery images lazy-load on demand; this keeps the initial load fast.
function collectAssets() {
  const images = []
  const videos = ['/video/hero.mp4']
  Object.entries(IMAGES).forEach(([, items]) => {
    const first = items.find(i => i.type === 'image' || !i.type)
    if (first?.src) images.push(first.src)
  })
  return { images, videos }
}

// ── Preload one image — resolves whether it succeeds or fails ─────────────────
function preloadImage(src) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = resolve
    img.onerror = resolve   // never block on a broken file
    img.src = src
  })
}

// ── Prime video cache by fetching the first 512 KB (fire-and-forget) ─────────
function primeVideo(src) {
  fetch(src, {
    method: 'GET',
    headers: { Range: 'bytes=0-524287' },
    cache: 'force-cache',
    priority: 'low',
  }).catch(() => {})
}

// ── Minimum time the loading screen stays visible (ms) ───────────────────────
const MIN_MS = 1800

export default function LoadingScreen({ onComplete }) {
  const overlayRef  = useRef(null)
  const barRef      = useRef(null)
  const percentRef  = useRef(null)
  const labelRef    = useRef(null)

  useEffect(() => {
    const { images, videos } = collectAssets()
    const total     = Math.max(images.length, 1)
    let   loaded    = 0
    let   killed    = false
    const startTime = Date.now()

    // Animated proxy so rapid updates don't look janky
    const proxy = { val: 0 }

    const setBar = (pct) => {
      if (percentRef.current) percentRef.current.textContent = `${Math.round(pct)}%`
      if (barRef.current)     barRef.current.style.width     = `${pct}%`
    }

    const tweenTo = (target) => {
      gsap.to(proxy, {
        val: target,
        duration: 0.35,
        ease: 'power2.out',
        overwrite: 'auto',
        onUpdate: () => !killed && setBar(proxy.val),
      })
    }

    // Slide out and call onComplete
    const exit = () => {
      if (killed) return
      gsap.to(proxy, {
        val: 100,
        duration: 0.4,
        ease: 'power2.out',
        onUpdate: () => setBar(proxy.val),
        onComplete: () => {
          if (killed) return
          gsap.to(labelRef.current, { opacity: 0, duration: 0.25 })
          gsap.to(overlayRef.current, {
            yPercent: -100,
            duration: 0.95,
            ease: 'power4.inOut',
            delay: 0.25,
            onComplete: () => onComplete?.(),
          })
        },
      })
    }

    // Start video priming immediately in background
    videos.forEach(primeVideo)

    // Preload every image and track progress
    const promises = images.map((src) =>
      preloadImage(src).then(() => {
        loaded++
        // Cap displayed progress at 95 — final 5% fills on exit
        tweenTo(Math.min(95, Math.round((loaded / total) * 95)))
      })
    )

    Promise.all(promises).then(() => {
      const elapsed   = Date.now() - startTime
      const remaining = Math.max(0, MIN_MS - elapsed)
      setTimeout(exit, remaining)
    })

    return () => {
      killed = true
      gsap.killTweensOf(proxy)
    }
  }, [onComplete])

  return (
    <div className="loading-screen" ref={overlayRef}>
      <div className="loading-red-slice" />
      <div className="loading-content">
        <div className="loading-title mono">Sam Varghese</div>
        <div className="loading-percent" ref={percentRef}>0%</div>
        <div className="loading-bar-track">
          <div className="loading-bar-fill" ref={barRef} />
        </div>
        <div className="loading-label mono" ref={labelRef}>Caching assets</div>
      </div>
    </div>
  )
}
