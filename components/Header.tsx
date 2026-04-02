'use client'

import { useState, useEffect } from 'react'
import { ProfileType } from '@/lib/types'

const NAV = [
  { id: 'onboarding', label: 'Onboarding' },
  { id: 'references', label: 'References' },
  { id: 'profile',    label: 'Taste Profile' },
  { id: 'export',     label: 'Export' },
]

interface Props {
  activeProfile: ProfileType
  onProfile: (p: ProfileType) => void
}

export default function Header({ activeProfile, onProfile }: Props) {
  const [activeSection, setActiveSection] = useState('')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const sections = NAV.map(n => document.getElementById(n.id)).filter(Boolean) as HTMLElement[]

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible.length > 0) setActiveSection(visible[0].target.id)
      },
      { rootMargin: '-64px 0px -55% 0px', threshold: 0 }
    )
    sections.forEach(s => sectionObserver.observe(s))

    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      sectionObserver.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <header className={`site-header${scrolled ? ' scrolled' : ''}`}>
      <div className="site-header-inner">

        <button className="site-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span className="site-logo-name">Design Taste</span>
          <span className="site-logo-sub">Skill Builder</span>
        </button>

        <nav className="site-nav">
          {NAV.map(link => (
            <button
              key={link.id}
              className={`site-nav-link${activeSection === link.id ? ' active' : ''}`}
              onClick={() => scrollTo(link.id)}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="site-profile-switcher">
          <button
            className={`site-profile-btn${activeProfile === 'personal' ? ' active' : ''}`}
            onClick={() => onProfile('personal')}
          >Personal</button>
          <button
            className={`site-profile-btn${activeProfile === 'team' ? ' active' : ''}`}
            onClick={() => onProfile('team')}
          >Team</button>
        </div>

      </div>
    </header>
  )
}
