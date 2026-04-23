import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import CategoryHeader from './CategoryHeader'
import GridControls from './GridControls'
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
  const [cols, setCols] = useState(() =>
    Object.fromEntries(CATEGORIES.map((c) => [c.id, 4]))
  )

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

  const setColsFor = (id, n) => setCols((prev) => ({ ...prev, [id]: n }))

  return (
    <section className="gallery" id="work">
      {CATEGORIES.map((cat, i) => (
        <div key={cat.title} ref={(el) => (sectionsRef.current[i] = el)}>
          <CategoryHeader title={cat.title} index={i} />
          <GridControls cols={cols[cat.id]} onChange={(n) => setColsFor(cat.id, n)} />
          <div className="gallery__grid" data-cols={cols[cat.id]}>
            {cat.projects.map((p) => (
              <ProjectCard key={`${p.title}-${p.year}`} project={p} />
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}
