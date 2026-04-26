import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import GridControls from '../components/GridControls'
import IMAGES from '../data/images.json'
import './GalleryPage.css'

gsap.registerPlugin(ScrollTrigger)

function PlayIcon() {
  return (
    <svg className="gc__play" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="1"/>
      <polygon points="10,8 17,12 10,16" fill="currentColor"/>
    </svg>
  )
}

function GalleryCard({ item }) {
  const overlayRef = useRef(null)
  const isVideo = item.type === 'video'

  return (
    <article
      className={`gc ${isVideo ? 'gc--video' : ''}`}
      onMouseEnter={() => gsap.to(overlayRef.current, { opacity: 1, duration: 0.35 })}
      onMouseLeave={() => gsap.to(overlayRef.current, { opacity: 0, duration: 0.35 })}
    >
      {isVideo ? (
        <div className="gc__video-thumb">
          <PlayIcon />
          <span className="mono gc__video-title">{item.title}</span>
        </div>
      ) : (
        <img className="gc__media" src={item.src} alt={item.role} loading="lazy" />
      )}
      <div className="gc__overlay" ref={overlayRef}>
        <span className="mono gc__role">{item.role}</span>
        <span className="mono gc__year">{item.year}</span>
      </div>
    </article>
  )
}

export default function GalleryPage({ category, title }) {
  const [cols, setCols] = useState(3)
  const headerRef = useRef(null)
  const gridRef = useRef(null)
  const items = IMAGES[category] || []

  useEffect(() => {
    window.scrollTo(0, 0)
    ScrollTrigger.refresh()

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.05 }
      )
      gsap.fromTo(
        gridRef.current.querySelectorAll('.gc'),
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.6, ease: 'power3.out',
          stagger: { amount: 0.5 }, delay: 0.15,
        }
      )
    })
    return () => ctx.revert()
  }, [category])

  return (
    <div className="gp">
      <header className="gp__header" ref={headerRef}>
        <Link to="/" className="gp__back mono">← Back</Link>
        <h1 className="gp__title">{title}</h1>
        <span className="mono gp__count">{items.length}&nbsp;works</span>
      </header>

      <GridControls cols={cols} onChange={setCols} />

      <div className="gp__grid" data-cols={cols} ref={gridRef}>
        {items.map((item) => (
          <GalleryCard key={item.slug} item={item} />
        ))}
      </div>
    </div>
  )
}
