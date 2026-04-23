import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import IMAGES from '../data/images.json'
import GridControls from './GridControls'
import './ShowreelSection.css'

gsap.registerPlugin(ScrollTrigger)

function FeatCard({ item }) {
  const videoRef = useRef(null)

  const handleMetadata = () => {
    const v = videoRef.current
    if (v && v.videoWidth && v.videoHeight) {
      v.style.aspectRatio = `${v.videoWidth} / ${v.videoHeight}`
    }
  }

  return (
    <div className={`featcard featcard--${item.type === 'video' ? 'video' : 'image'}`}>
      {item.type === 'video' ? (
        <video
          className="featcard__media"
          ref={videoRef}
          src={item.src}
          autoPlay
          muted
          loop
          playsInline
          onLoadedMetadata={handleMetadata}
        />
      ) : (
        <img className="featcard__media" src={item.src} alt={item.role} loading="lazy" />
      )}
      <div className="featcard__info">
        <span className="mono featcard__role">{item.role}</span>
        <span className="mono featcard__year">{item.year}</span>
      </div>
    </div>
  )
}

export default function ShowreelSection() {
  const sectionRef = useRef(null)
  const headingRef = useRef(null)
  const [cols, setCols] = useState(2)

  const FEATURED = IMAGES.featured || []
  if (FEATURED.length === 0) return null

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        }
      )
      const cards = sectionRef.current.querySelectorAll('.featcard')
      gsap.fromTo(
        cards,
        { y: 80, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1, ease: 'power3.out',
          stagger: 0.15,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section className="showreel" ref={sectionRef}>
      <div className="showreel__header" ref={headingRef}>
        <span className="mono showreel__label">Featured Work</span>
        <h2 className="showreel__heading">SELECTED<br /><em>PROJECTS</em></h2>
      </div>

      <GridControls cols={cols} onChange={setCols} />

      <div className="showreel__grid" data-cols={cols}>
        {FEATURED.map((item) => (
          <FeatCard key={item.slug} item={item} />
        ))}
      </div>
    </section>
  )
}
