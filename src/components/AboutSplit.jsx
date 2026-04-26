import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import IMAGES from '../data/images.json'
import './AboutSplit.css'

gsap.registerPlugin(ScrollTrigger)

export default function AboutSplit() {
  const sectionRef = useRef(null)
  const imgRef = useRef(null)
  const textRef = useRef(null)
  const taglineRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Image: reveal from left
      gsap.fromTo(
        imgRef.current,
        { clipPath: 'inset(0 100% 0 0)', x: -40 },
        {
          clipPath: 'inset(0 0% 0 0)',
          x: 0,
          duration: 1.2,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          },
        }
      )

      // Text block: staggered lines
      const lines = textRef.current.querySelectorAll('.about__line')
      gsap.fromTo(
        lines,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 65%',
          },
        }
      )

      // Tagline glow pulse
      gsap.fromTo(
        taglineRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 55%',
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section className="about" ref={sectionRef} id="about">
      <div className="about__split">
        {/* Left — portrait */}
        <div className="about__image-wrap" ref={imgRef}>
          <div className="about__image-placeholder">
            {IMAGES.bio?.[0] ? (
              <>
                <img src={IMAGES.bio[0].src} alt="Portrait" loading="lazy" />
                <div className="about__image-overlay" />
              </>
            ) : (
              <div className="about__image-empty" />
            )}
          </div>
        </div>

        {/* Right — text */}
        <div className="about__text" ref={textRef}>
          <div className="about__line">
            <span className="mono about__label">About</span>
          </div>
          <h2 className="about__line about__heading">
            Every Frame<br />
            <em>Intentional</em>
          </h2>
          <p className="about__line about__body">
            I work across cinematic videography, portrait, automotive,
            lifestyle, and event photography bringing the same obsessive
            attention to light, composition, and mood to every discipline.
            Whether it's a moving image or a still, the goal is the same:
            make people feel something.
          </p>
          <p className="about__line about__body">
            From high-speed car shoots on open roads to intimate portrait
            sessions and full event coverage, I adapt my visual language to
            the subject never the other way around.
          </p>
          <div className="about__line about__services">
            {['Cinematic Video', 'Portraits', 'Automotive', 'Lifestyle', 'Events', 'Editorial'].map((s) => (
              <span key={s} className="mono about__tag">{s}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="about__tagline" ref={taglineRef}>
        <span className="mono">Video · Photo · 6 Disciplines · Available Now</span>
      </div>
    </section>
  )
}
