'use client'

import { Panel, ProfileType } from '@/lib/types'

interface Props {
  activePanel: Panel
  activeProfile: ProfileType
  onPanel: (p: Panel) => void
  onProfile: (p: ProfileType) => void
}

const NAV = [
  { id: 'onboarding' as Panel, label: 'Onboarding' },
  { id: 'references' as Panel, label: 'References' },
  { id: 'profile' as Panel, label: 'Taste Profile' },
]

export default function Sidebar({ activePanel, activeProfile, onPanel, onProfile }: Props) {
  return (
    <aside className="sidebar">
      <div className="logo">
        Design Taste
        <span>Skill Builder</span>
      </div>

      <nav className="nav-section">
        <div className="nav-label">Build</div>
        {NAV.map(item => (
          <button
            key={item.id}
            className={`nav-btn${activePanel === item.id ? ' active' : ''}`}
            onClick={() => onPanel(item.id)}
          >
            <span className="dot" />
            {item.label}
          </button>
        ))}
      </nav>

      <nav className="nav-section">
        <div className="nav-label">Output</div>
        <button
          className={`nav-btn${activePanel === 'export' ? ' active' : ''}`}
          onClick={() => onPanel('export')}
        >
          <span className="dot" />
          Export Skill
        </button>
      </nav>

      <div className="profile-switcher">
        <div className="profile-label">Active Profile</div>
        <div className="profile-tabs">
          <button
            className={`profile-tab${activeProfile === 'personal' ? ' active' : ''}`}
            onClick={() => onProfile('personal')}
          >
            Personal
          </button>
          <button
            className={`profile-tab${activeProfile === 'team' ? ' active' : ''}`}
            onClick={() => onProfile('team')}
          >
            Team
          </button>
        </div>
      </div>
    </aside>
  )
}
