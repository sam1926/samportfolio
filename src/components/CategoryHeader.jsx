import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './CategoryHeader.css'

gsap.registerPlugin(ScrollTrigger)

export default function CategoryHeader({ title, index }) {
  const ref = useRef(null)
  const lineRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { x: -60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: ref.current, start: 'top 80%' },
        }
      )
      gsap.fromTo(
        lineRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.2,
          ease: 'power4.out',
          scrollTrigger: { trigger: ref.current, start: 'top 80%' },
        }
      )
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <div className="cat-header" ref={ref}>
      <span className="mono cat-header__index">0{index + 1}</span>
      <h2 className="cat-header__title text-glow">{title}</h2>
      <div className="cat-header__line" ref={lineRef} />
    </div>
  )
}
