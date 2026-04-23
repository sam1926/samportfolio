import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import CategoryHeader from './CategoryHeader'
import IMAGES from '../data/images.json'
import './ProjectGallery.css'

gsap.registerPlugin(ScrollTrigger)

// ── Build CATEGORIES — only from real imported images, skip empty ones ────────
function buildCategory(id, title) {
  const real = IMAGES[id] || []
  if (real.length === 0) return null

  return {
    id,
    title,
    projects: real.map((item) => ({
      title: item.title,
      role:  item.role,
      year:  item.year,
      img:   item.src,
      type:  item.type || 'image',
    })),
  }
}

const CATEGORIES = [
  buildCategory('videography', 'VIDEOGRAPHY'),
  buildCategory('portraits',   'PORTRAITS'),
  buildCategory('automotive',  'AUTOMOTIVE'),
  buildCategory('lifestyle',   'LIFESTYLE'),
  buildCategory('events',      'EVENTS'),
  buildCategory('misc',        'MISCELLANEOUS'),
].filter(Boolean)

// ── Grid size control icons ───────────────────────────────────────────────────
const COL_OPTIONS = [2, 3, 4, 5]

function GridIcon({ cols }) {
  const gap = 1.5
  const totalGap = gap * (cols - 1)
  const w = (16 - totalGap) / cols
  const h = 20
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      {Array.from({ length: cols }).map((_, i) => (
        <rect
          key={i}
          x={i * (w + gap)}
          y={0}
          width={w}
          height={h}
          rx="0.5"
          fill="currentColor"
        />
      ))}
    </svg>
  )
}

function GridControls({ cols, onChange }) {
  return (
    <div className="grid-controls">
      <span className="mono grid-controls__label">Size</span>
      <div className="grid-controls__buttons">
        {COL_OPTIONS.map((n) => (
          <button
            key={n}
            className={`grid-controls__btn ${cols === n ? 'grid-controls__btn--active' : ''}`}
            onClick={() => onChange(n)}
            aria-label={`${n} columns`}
            title={`${n} columns`}
          >
            <GridIcon cols={n} />
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Card component ────────────────────────────────────────────────────────────
function ProjectCard({ project }) {
  const overlayRef = useRef(null)

  const handleMouseEnter = () => {
    gsap.to(overlayRef.current, { opacity: 1, duration: 0.4, ease: 'power2.out' })
  }

  const handleMouseLeave = () => {
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.4 })
  }

  return (
    <article
      className="project-card"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="project-card__img-wrap">
        {project.type === 'video' ? (
          <video
            className="project-card__img"
            src={project.img}
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          <img
            className="project-card__img"
            src={project.img}
            alt={project.title}
            loading="lazy"
          />
        )}
        <div className="project-card__overlay" ref={overlayRef}>
          <div className="project-card__overlay-inner">
            <span className="mono project-card__role">{project.role}</span>
            <span className="mono project-card__year">{project.year}</span>
          </div>
        </div>
      </div>
    </article>
  )
}

// ── Gallery section ───────────────────────────────────────────────────────────
export default function ProjectGallery() {
  const sectionsRef = useRef([])
  const [portraitCols, setPortraitCols] = useState(4)

  useEffect(() => {
    sectionsRef.current.forEach((el) => {
      if (!el) return
      const cards = el.querySelectorAll('.project-card')
      gsap.fromTo(
        cards,
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
          stagger: { amount: 0.5 },
          scrollTrigger: { trigger: el, start: 'top 80%' },
        }
      )
    })
  }, [])

  return (
    <section className="gallery" id="work">
      {CATEGORIES.map((cat, i) => (
        <div key={cat.title} ref={(el) => (sectionsRef.current[i] = el)}>
          <CategoryHeader title={cat.title} index={i} />

          {cat.id === 'portraits' && (
            <GridControls cols={portraitCols} onChange={setPortraitCols} />
          )}

          <div
            className="gallery__grid"
            data-cols={cat.id === 'portraits' ? portraitCols : undefined}
          >
            {cat.projects.map((p) => (
              <ProjectCard key={`${p.title}-${p.year}`} project={p} />
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}
