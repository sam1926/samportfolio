import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import GridControls from '../components/GridControls'
import IMAGES from '../data/images.json'
import './GalleryPage.css'

gsap.registerPlugin(ScrollTrigger)

function GalleryCard({ item }) {
  const overlayRef = useRef(null)

  return (
    <article
      className="gc"
      onMouseEnter={() => gsap.to(overlayRef.current, { opacity: 1, duration: 0.35 })}
      onMouseLeave={() => gsap.to(overlayRef.current, { opacity: 0, duration: 0.35 })}
    >
      {item.type === 'video' ? (
        <video className="gc__media" src={item.src} autoPlay muted loop playsInline />
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
