import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './FooterTable.css'

gsap.registerPlugin(ScrollTrigger)

const CONTACT_ROWS = [
  { label: 'Email',     value: 'sam@lero.com.au',          href: 'mailto:sam@lero.com.au' },
  { label: 'Instagram', value: '@sam.varghese_',            href: 'https://www.instagram.com/sam.varghese_/' },
  { label: 'Phone',     value: '0451 529 199',              href: 'tel:+61451529199' },
  { label: 'Location',  value: 'Brisbane, Australia',       href: null },
]

export default function FooterTable() {
  const sectionRef = useRef(null)
  const rowsRef = useRef([])
  const titleRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        }
      )

      rowsRef.current.forEach((row, i) => {
        if (!row) return
        gsap.fromTo(
          row,
          { x: -30, opacity: 0 },
          {
            x: 0, opacity: 1, duration: 0.6, ease: 'power3.out',
            delay: i * 0.08,
            scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
          }
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <footer className="footer" ref={sectionRef} id="contact">
      <div className="footer__inner">
        {/* Big heading */}
        <div className="footer__top" ref={titleRef}>
          <h2 className="footer__heading">
            Let's Create<br />
            <em>Together.</em>
          </h2>
          <span className="mono footer__available">Video · Photo · Available for bookings — 2026</span>
        </div>

        {/* Contact table */}
        <div className="footer__table">
          {CONTACT_ROWS.map((row, i) => (
            <div
              className="footer__row"
              key={row.label}
              ref={(el) => (rowsRef.current[i] = el)}
            >
              <span className="mono footer__row-label">{row.label}</span>
              {row.href ? (
                <a className="footer__row-value" href={row.href}>{row.value}</a>
              ) : (
                <span className="footer__row-value">{row.value}</span>
              )}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="footer__bottom">
          <span className="mono footer__copy">© 2026 Sam Varghese — All rights reserved</span>
          <span className="mono footer__built">Built with precision &amp; obsession</span>
        </div>
      </div>
    </footer>
  )
}
