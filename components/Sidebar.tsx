'use client'

import { useState, useEffect } from 'react'
import { ProfileType } from '@/lib/types'

interface Props {
  activeProfile: ProfileType
  onProfile: (p: ProfileType) => void
}

const NAV = [
  { id: 'onboarding', label: 'Onboarding',   section: 'build' },
  { id: 'references', label: 'References',   section: 'build' },
  { id: 'profile',    label: 'Taste Profile', section: 'build' },
  { id: 'export',     label: 'Export Skill',  section: 'output' },
]

export default function Sidebar({ activeProfile, onProfile }: Props) {
  const [activeSection, setActiveSection] = useState('onboarding')

  useEffect(() => {
    const ids = NAV.map(n => n.id)
    const sections = ids.map(id => document.getElementById(id)).filter(Boolean) as HTMLElement[]

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the topmost intersecting section
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible.length > 0) setActiveSection(visible[0].target.id)
      },
      { rootMargin: '-10% 0px -60% 0px', threshold: 0 }
    )

    sections.forEach(s => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <aside className="sidebar">
      <div className="logo">
        Design Taste
        <span>Skill Builder</span>
      </div>

      <nav className="nav-section">
        <div className="nav-label">Build</div>
        {NAV.filter(n => n.section === 'build').map(item => (
          <button
            key={item.id}
            className={`nav-btn${activeSection === item.id ? ' active' : ''}`}
            onClick={() => scrollTo(item.id)}
          >
            <span className="dot" />
            {item.label}
          </button>
        ))}
      </nav>

      <nav className="nav-section">
        <div className="nav-label">Output</div>
        {NAV.filter(n => n.section === 'output').map(item => (
          <button
            key={item.id}
            className={`nav-btn${activeSection === item.id ? ' active' : ''}`}
            onClick={() => scrollTo(item.id)}
          >
            <span className="dot" />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="profile-switcher">
        <div className="profile-label">Active Profile</div>
        <div className="profile-tabs">
          <button
            className={`profile-tab${activeProfile === 'personal' ? ' active' : ''}`}
            onClick={() => onProfile('personal')}
          >Personal</button>
          <button
            className={`profile-tab${activeProfile === 'team' ? ' active' : ''}`}
            onClick={() => onProfile('team')}
          >Team</button>
        </div>
      </div>
    </aside>
  )
}
