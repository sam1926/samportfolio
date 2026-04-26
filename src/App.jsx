import { useState, useEffect } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import LoadingScreen from './components/LoadingScreen'
import CustomCursor from './components/CustomCursor'
import Navbar from './components/Navbar'

import HomePage    from './pages/HomePage'
import GalleryPage from './pages/GalleryPage'
import AboutPage   from './pages/AboutPage'

import './App.css'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (loaded) ScrollTrigger.refresh()
  }, [loaded])

  return (
    <HashRouter>
      <CustomCursor />
      <div className="grain-overlay" aria-hidden="true" />

      {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}

      <div className={`page ${loaded ? 'page--visible' : ''}`}>
        <Navbar />
        <main>
          <Routes>
            <Route path="/"           element={<HomePage />} />
            <Route path="/portraits"  element={<GalleryPage category="portraits"   title="PORTRAITS" />} />
            <Route path="/automotive" element={<GalleryPage category="automotive"  title="AUTOMOTIVE" />} />
            <Route path="/videography"element={<GalleryPage category="videography" title="VIDEOGRAPHY" />} />
            <Route path="/lifestyle"  element={<GalleryPage category="lifestyle"   title="LIFESTYLE" />} />
            <Route path="/events"     element={<GalleryPage category="events"      title="EVENTS" />} />
            <Route path="/misc"       element={<GalleryPage category="misc"        title="MISCELLANEOUS" />} />
            <Route path="/selected"   element={<GalleryPage category="featured"    title="SELECTED PROJECTS" />} />
            <Route path="/about"      element={<AboutPage />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  )
}
