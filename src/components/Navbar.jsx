import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import './Navbar.css'

export default function Navbar() {
  const navRef = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 2.8 }
    )
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const handleContact = (e) => {
    e.preventDefault()
    setMenuOpen(false)
    const scroll = () => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
    if (location.pathname !== '/' && location.pathname !== '/about') {
      navigate('/')
      setTimeout(scroll, 400)
    } else {
      scroll()
    }
  }

  return (
    <>
      <nav
        className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}
        ref={navRef}
      >
        <Link to="/" className="navbar__logo mono">
          <span className="navbar__logo-dot" />
          S . V
        </Link>

        {/* Desktop links */}
        <ul className="navbar__links">
          <li>
            <Link to="/about" className="navbar__link mono">About</Link>
          </li>
          <li>
            <a href="#contact" className="navbar__link mono" onClick={handleContact}>Contact</a>
          </li>
        </ul>

        <button
          className={`navbar__burger ${menuOpen ? 'navbar__burger--open' : ''}`}
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span />
          <span />
        </button>
      </nav>

      {/* Mobile overlay */}
      <div className={`nav-overlay ${menuOpen ? 'nav-overlay--open' : ''}`}>
        <button
          className="nav-overlay__close"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
        >
          <span />
          <span />
        </button>
        <ul className="nav-overlay__links">
          <li>
            <Link to="/" className="nav-overlay__link mono">Home</Link>
          </li>
          <li>
            <Link to="/about" className="nav-overlay__link mono">About</Link>
          </li>
          <li>
            <a href="#contact" className="nav-overlay__link mono" onClick={handleContact}>Contact</a>
          </li>
        </ul>
      </div>
    </>
  )
}
