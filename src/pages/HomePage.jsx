import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import IMAGES from '../data/images.json'
import FooterTable from '../components/FooterTable'
import './HomePage.css'

const CATEGORIES = [
  { id: 'portraits',   label: 'PORTRAITS',        path: '/portraits',   sub: 'Portrait Photography' },
  { id: 'automotive',  label: 'AUTOMOTIVE',        path: '/automotive',  sub: 'Automotive Photography' },
  { id: 'videography', label: 'VIDEOGRAPHY',       path: '/videography', sub: 'Film & Video' },
  { id: 'lifestyle',   label: 'LIFESTYLE',         path: '/lifestyle',   sub: 'Lifestyle Photography' },
  { id: 'events',      label: 'EVENTS',            path: '/events',      sub: 'Event Coverage' },
  { id: 'misc',        label: 'MISCELLANEOUS',     path: '/misc',        sub: 'Photography' },
  { id: 'featured',   label: 'SELECTED PROJECTS', path: '/selected',    sub: 'Featured Work' },
].filter(({ id }) => (IMAGES[id] || []).length > 0)

function getPreview(id) {
  const items = IMAGES[id] || []
  return (items.find(i => i.type === 'image' || !i.type) || items[0])?.src ?? null
}

export default function HomePage() {
  const [hovered, setHovered] = useState(null)
  const heroRef = useRef(null)
  const listRef = useRef(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    const ctx = gsap.context(() => {
      gsap.fromTo(
        heroRef.current.querySelectorAll('.hp__hero-line'),
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out', stagger: 0.1, delay: 3.2 }
      )
      gsap.fromTo(
        listRef.current.querySelectorAll('.hp__row'),
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', stagger: 0.06, delay: 3.6 }
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <div className="hp">
      {/* Fixed preview panel — right half */}
      <div className="hp__preview" aria-hidden="true">
        {/* Default hero video — visible when nothing is hovered */}
        <video
          className={`hp__preview-video ${hovered === null ? 'hp__preview-video--active' : ''}`}
          src="/video/hero.mp4"
          autoPlay
          muted
          loop
          playsInline
        />

        {/* Category still images — swap in on hover */}
        {CATEGORIES.map((cat, i) => {
          const src = getPreview(cat.id)
          if (!src) return null
          return (
            <img
              key={cat.id}
              src={src}
              alt=""
              className={`hp__preview-img ${hovered === i ? 'hp__preview-img--active' : ''}`}
            />
          )
        })}
      </div>

      {/* Left content */}
      <div className="hp__left">
        {/* Identity */}
        <div className="hp__hero" ref={heroRef}>
          <span className="hp__hero-line mono hp__hero-tag">Photographer &amp; Filmmaker</span>
          <h1 className="hp__hero-line hp__name">Sam<br />Varghese</h1>
          <span className="hp__hero-line mono hp__hero-meta">Brisbane, AU · 2026</span>
        </div>

        {/* Divider */}
        <div className="hp__divider" />

        {/* Category index */}
        <nav className="hp__list" ref={listRef} aria-label="Work categories">
          {CATEGORIES.map((cat, i) => (
            <Link
              key={cat.id}
              to={cat.path}
              className={`hp__row ${hovered === i ? 'hp__row--active' : ''}`}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <span className="mono hp__row-num">0{i + 1}</span>
              <span className="hp__row-label">{cat.label}</span>
              <span className="hp__row-rule" />
              <span className="mono hp__row-count">{(IMAGES[cat.id] || []).length}&nbsp;works</span>
              <span className="hp__row-arrow" aria-hidden="true">→</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Footer lives inside home page */}
      <div className="hp__footer-wrap">
        <FooterTable />
      </div>
    </div>
  )
}
