import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './InstagramSection.css'

gsap.registerPlugin(ScrollTrigger)

const INSTAGRAM_URL = 'https://www.instagram.com/sam.varghese_/'
const HANDLE = '@sam.varghese_'

// Pull 6 images from existing portfolio assets for the grid
const GRID_IMAGES = [
  { src: '/images/portraits/dsc00637.jpg',    alt: 'Portrait' },
  { src: '/images/portraits/dsc00699.jpg',    alt: 'Portrait' },
  { src: '/images/portraits/dsc00817.jpg',    alt: 'Portrait' },
  { src: '/images/portraits/dsc00821.jpg',    alt: 'Portrait' },
  { src: '/images/portraits/light-44.jpg',    alt: 'Portrait' },
  { src: '/images/portraits/light-55.jpg',    alt: 'Portrait' },
]

export default function InstagramSection() {
  const sectionRef = useRef(null)
  const headRef = useRef(null)
  const gridRef = useRef(null)
  const ctaRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        }
      )

      const cells = gridRef.current.querySelectorAll('.ig-grid__cell')
      gsap.fromTo(
        cells,
        { scale: 0.92, opacity: 0 },
        {
          scale: 1, opacity: 1, duration: 0.7, ease: 'power3.out',
          stagger: 0.07,
          scrollTrigger: { trigger: gridRef.current, start: 'top 80%' },
        }
      )

      gsap.fromTo(
        ctaRef.current,
        { y: 20, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.7, ease: 'power3.out',
          delay: 0.3,
          scrollTrigger: { trigger: ctaRef.current, start: 'top 90%' },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section className="ig-section" ref={sectionRef}>
      <div className="ig-section__inner">
        {/* Header */}
        <div className="ig-section__head" ref={headRef}>
          <span className="mono ig-section__label">Instagram</span>
          <h2 className="ig-section__heading">
            Latest on<br /><em>Instagram.</em>
          </h2>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mono ig-section__handle"
          >
            {HANDLE}
          </a>
        </div>

        {/* 3×2 image grid */}
        <div className="ig-grid" ref={gridRef}>
          {GRID_IMAGES.map((img, i) => (
            <a
              key={i}
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="ig-grid__cell"
              aria-label={`View ${img.alt} on Instagram`}
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className="ig-grid__img"
              />
              <div className="ig-grid__overlay">
                {/* Instagram SVG icon */}
                <svg className="ig-grid__icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="currentColor" strokeWidth="1.5"/>
                  <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5"/>
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
                </svg>
              </div>
            </a>
          ))}
        </div>

        {/* Follow CTA */}
        <div className="ig-section__cta" ref={ctaRef}>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="ig-section__btn mono"
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="currentColor" strokeWidth="1.5"/>
              <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5"/>
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
            </svg>
            Follow {HANDLE}
          </a>
        </div>
      </div>
    </section>
  )
}
