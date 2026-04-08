import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import IMAGES from '../data/images.json'
import './ShowreelSection.css'

gsap.registerPlugin(ScrollTrigger)

function ImageCard({ src, role, year }) {
  return (
    <div className="featcard featcard--image">
      <img className="featcard__media" src={src} alt={role} loading="lazy" />
      <div className="featcard__info">
        <span className="mono featcard__role">{role}</span>
        <span className="mono featcard__year">{year}</span>
      </div>
    </div>
  )
}

function VideoCard({ src, role, year }) {
  const videoRef = useRef(null)

  const handleMetadata = () => {
    const v = videoRef.current
    if (v && v.videoWidth && v.videoHeight) {
      v.style.aspectRatio = `${v.videoWidth} / ${v.videoHeight}`
    }
  }

  return (
    <div className="featcard featcard--video">
      <video
        className="featcard__media"
        ref={videoRef}
        src={src}
        autoPlay
        muted
        loop
        playsInline
        onLoadedMetadata={handleMetadata}
      />
      <div className="featcard__info">
        <span className="mono featcard__role">{role}</span>
        <span className="mono featcard__year">{year}</span>
      </div>
    </div>
  )
}

export default function ShowreelSection() {
  const sectionRef = useRef(null)
  const headingRef = useRef(null)

  const FEATURED = IMAGES.featured || []
  if (FEATURED.length === 0) return null

  const videos = FEATURED.filter((i) => i.type === 'video')
  const images = FEATURED.filter((i) => i.type !== 'video')

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

      <div className="showreel__content">
        {/* Video — centred on top */}
        {videos.length > 0 && (
          <div className="showreel__videos">
            {videos.map((item) => (
              <VideoCard key={item.slug} {...item} />
            ))}
          </div>
        )}

        {/* Images — two columns below */}
        {images.length > 0 && (
          <div className="showreel__images">
            {images.map((item) => (
              <ImageCard key={item.slug} {...item} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
