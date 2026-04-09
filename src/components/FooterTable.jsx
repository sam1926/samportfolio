import { useEffect, useRef, useState } from 'react'
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

// Replace YOUR_FORM_ID with your Formspree form ID (formspree.io — free tier available)
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID'

export default function FooterTable() {
  const sectionRef = useRef(null)
  const rowsRef = useRef([])
  const titleRef = useRef(null)
  const formRef = useRef(null)

  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | sending | success | error

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

      gsap.fromTo(
        formRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
          delay: 0.2,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        setStatus('success')
        setFormData({ name: '', email: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

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

        {/* Contact table + Form side by side */}
        <div className="footer__body">
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

          {/* Contact form */}
          <form
            ref={formRef}
            className="footer__form"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="footer__form-group">
              <label className="mono footer__form-label" htmlFor="cf-name">Name</label>
              <input
                id="cf-name"
                className="footer__form-input"
                type="text"
                name="name"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={status === 'sending' || status === 'success'}
              />
            </div>
            <div className="footer__form-group">
              <label className="mono footer__form-label" htmlFor="cf-email">Email</label>
              <input
                id="cf-email"
                className="footer__form-input"
                type="email"
                name="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={status === 'sending' || status === 'success'}
              />
            </div>
            <div className="footer__form-group footer__form-group--grow">
              <label className="mono footer__form-label" htmlFor="cf-message">Message</label>
              <textarea
                id="cf-message"
                className="footer__form-input footer__form-textarea"
                name="message"
                placeholder="Tell me about your project..."
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                disabled={status === 'sending' || status === 'success'}
              />
            </div>

            {status === 'success' ? (
              <p className="mono footer__form-success">Message sent — I'll be in touch soon.</p>
            ) : (
              <button
                className="footer__form-btn mono"
                type="submit"
                disabled={status === 'sending'}
              >
                {status === 'sending' ? 'Sending...' : 'Send Message'}
              </button>
            )}

            {status === 'error' && (
              <p className="mono footer__form-error">Something went wrong. Try emailing directly.</p>
            )}
          </form>
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
