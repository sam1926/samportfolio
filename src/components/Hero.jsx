import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { SplitText } from '../utils/SplitText'
import WebGLBackground from './WebGLBackground'
import './Hero.css'

// Detect hero video — Vite exposes files in public/ at root paths
const HERO_VIDEO_CANDIDATES = ['/video/hero.mp4', '/video/hero.mov', '/video/hero.webm']

async function detectHeroVideo() {
  for (const src of HERO_VIDEO_CANDIDATES) {
    try {
      const res = await fetch(src, { method: 'HEAD' })
      if (res.ok) return src
    } catch { /* not found */ }
  }
  return null
}

export default function Hero() {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const metaTLRef = useRef(null)
  const metaBRRef = useRef(null)
  const scrollHintRef = useRef(null)
  const [heroVideo, setHeroVideo] = useState(null)

  useEffect(() => {
    detectHeroVideo().then(src => { if (src) setHeroVideo(src) })
  }, [])

  useEffect(() => {
    const title = titleRef.current
    if (!title) return

    // Split title into individual chars
    const chars = SplitText(title)

    const tl = gsap.timeline({ delay: 2.6 })

    // Chars drop in with stagger
    tl.fromTo(
      chars,
      { y: 120, opacity: 0, rotateX: -80 },
      {
        y: 0,
        opacity: 1,
        rotateX: 0,
        duration: 1.1,
        ease: 'power4.out',
        stagger: { amount: 0.5 },
      }
    )
      .fromTo(
        subtitleRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
        '-=0.4'
      )
      .fromTo(
        [metaTLRef.current, metaBRRef.current],
        { opacity: 0 },
        { opacity: 1, duration: 0.6, ease: 'power2.out', stagger: 0.15 },
        '-=0.5'
      )
      .fromTo(
        scrollHintRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.6 },
        '-=0.2'
      )

    // Infinite scroll-hint pulse
    gsap.to(scrollHintRef.current, {
      y: 6,
      repeat: -1,
      yoyo: true,
      duration: 1.2,
      ease: 'sine.inOut',
      delay: 4,
    })

    return () => tl.kill()
  }, [])

  return (
    <section className="hero" ref={sectionRef} id="hero">
      {/* Background: hero video if available, otherwise WebGL */}
      {heroVideo ? (
        <>
          <video
            className="hero__video"
            src={heroVideo}
            autoPlay
            muted
            loop
            playsInline
          />
          <div className="hero__video-overlay" />
        </>
      ) : (
        <WebGLBackground />
      )}

      {/* Corner metadata */}
      <div className="hero__meta hero__meta--tl" ref={metaTLRef}>
        <span className="mono">Photographer &amp; Videographer</span>
        <span className="mono hero__meta-name">Sam Varghese</span>
      </div>

      <div className="hero__meta hero__meta--br" ref={metaBRRef}>
        <span className="mono">Brisbane, Australia</span>
        <span className="mono hero__meta-year">© 2026</span>
      </div>

      {/* Central title */}
      <div className="hero__center">
        <h1 className="hero__title text-glow-lg" ref={titleRef} aria-label="Portfolio">
          PORTFOLIO
        </h1>
        <p className="hero__subtitle mono" ref={subtitleRef}>
          Cinematic Video · Portrait · Automotive · Lifestyle · Events
        </p>
      </div>

      {/* Scroll hint */}
      <div className="hero__scroll-hint" ref={scrollHintRef}>
        <span className="mono">Scroll</span>
        <div className="hero__scroll-line" />
      </div>
    </section>
  )
}
