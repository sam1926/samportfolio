import { useState, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import LoadingScreen from './components/LoadingScreen'
import CustomCursor from './components/CustomCursor'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import MarqueeReel from './components/MarqueeReel'
import AboutSplit from './components/AboutSplit'
import ShowreelSection from './components/ShowreelSection'
import ProjectGallery from './components/ProjectGallery'
import InstagramSection from './components/InstagramSection'
import FooterTable from './components/FooterTable'

import './App.css'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (loaded) {
      // Refresh ScrollTrigger after mount
      ScrollTrigger.refresh()
    }
  }, [loaded])

  return (
    <>
      {/* Custom cursor — desktop only, hidden via CSS on touch */}
      <CustomCursor />

      {/* Grain overlay */}
      <div className="grain-overlay" aria-hidden="true" />

      {/* Loading screen */}
      {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}

      {/* Main page — rendered but invisible until loader completes */}
      <div className={`page ${loaded ? 'page--visible' : ''}`}>
        <Navbar />

        <main>
          {/* 1. Dark hero + WebGL */}
          <Hero />

          {/* Red marquee strip */}
          <MarqueeReel />

          {/* 2. Light about */}
          <AboutSplit />

          {/* 3. Dark featured showreel with WebGL distortion hover */}
          <ShowreelSection />

          {/* Red marquee strip (reversed) */}
          <MarqueeReel reverse />

          {/* 4. Dark project grid */}
          <ProjectGallery />

          {/* 5. Instagram feed */}
          <InstagramSection />

          {/* 6. Light footer / contact */}
          <FooterTable />
        </main>
      </div>
    </>
  )
}
