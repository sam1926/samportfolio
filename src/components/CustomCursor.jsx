import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function CustomCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const ringPos = { x: pos.x, y: pos.y }

    const onMove = (e) => {
      pos.x = e.clientX
      pos.y = e.clientY
      gsap.to(dot, { x: pos.x, y: pos.y, duration: 0.05, ease: 'none' })
      gsap.to(ring, { x: pos.x, y: pos.y, duration: 0.12, ease: 'power2.out' })
    }

    const onEnterLink = () => {
      gsap.to(ring, { scale: 2, borderColor: 'rgba(255,49,49,0.8)', duration: 0.3 })
      gsap.to(dot, { scale: 0, duration: 0.3 })
    }

    const onLeaveLink = () => {
      gsap.to(ring, { scale: 1, borderColor: 'rgba(255,49,49,0.6)', duration: 0.3 })
      gsap.to(dot, { scale: 1, duration: 0.3 })
    }

    window.addEventListener('mousemove', onMove)

    const links = document.querySelectorAll('a, button, .project-card')
    links.forEach((el) => {
      el.addEventListener('mouseenter', onEnterLink)
      el.addEventListener('mouseleave', onLeaveLink)
    })

    return () => {
      window.removeEventListener('mousemove', onMove)
      links.forEach((el) => {
        el.removeEventListener('mouseenter', onEnterLink)
        el.removeEventListener('mouseleave', onLeaveLink)
      })
    }
  }, [])

  return (
    <>
      <div className="cursor-dot" ref={dotRef} />
      <div className="cursor-ring" ref={ringRef} />
    </>
  )
}
