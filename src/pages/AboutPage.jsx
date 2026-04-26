import { useEffect } from 'react'
import AboutSplit from '../components/AboutSplit'
import FooterTable from '../components/FooterTable'
import './AboutPage.css'

export default function AboutPage() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div className="about-page">
      <AboutSplit />
      <FooterTable />
    </div>
  )
}
