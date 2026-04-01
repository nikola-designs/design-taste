'use client'

import { useState } from 'react'
import { Onboarding } from '@/lib/types'

interface Props {
  initial: Onboarding
  onSave: (ob: Onboarding) => void
  isTeam: boolean
}

function ChipGroup({ options, selected, onChange }: {
  options: string[]
  selected: string[]
  onChange: (vals: string[]) => void
}) {
  const toggle = (val: string) => {
    onChange(selected.includes(val) ? selected.filter(v => v !== val) : [...selected, val])
  }
  return (
    <div className="chip-group">
      {options.map(opt => (
        <span
          key={opt}
          className={`chip${selected.includes(opt) ? ' selected' : ''}`}
          onClick={() => toggle(opt)}
        >
          {opt}
        </span>
      ))}
    </div>
  )
}

export default function OnboardingPanel({ initial, onSave, isTeam }: Props) {
  const [ob, setOb] = useState<Onboarding>(initial)

  const update = (key: keyof Onboarding, val: string[] | string) => {
    setOb(prev => ({ ...prev, [key]: val }))
  }

  return (
    <div>
      <div className="page-header">
        <h1>Build your taste profile</h1>
        <p>Answer a few questions to seed your profile. The more honest you are, the more precisely your agent will see through your eyes.</p>
      </div>
      <div className="onboarding-grid">

        <div className="interview-card">
          <div className="card-label">Question 01</div>
          <div className="card-q">What's your overall visual instinct?</div>
          <ChipGroup
            options={['Less is more', 'Rich & layered', 'Editorial', 'Raw / brutalist', 'Warm & organic', 'Cold & precise', 'Playful', 'Luxury']}
            selected={ob.instinct}
            onChange={v => update('instinct', v)}
          />
        </div>

        <div className="interview-card">
          <div className="card-label">Question 02</div>
          <div className="card-q">How do you feel about white space?</div>
          <ChipGroup
            options={['Generous — let it breathe', 'Balanced', 'Dense — use every pixel', 'Depends on context']}
            selected={ob.space}
            onChange={v => update('space', v)}
          />
        </div>

        <div className="interview-card">
          <div className="card-label">Question 03</div>
          <div className="card-q">Typography instinct?</div>
          <ChipGroup
            options={['Serif personality', 'Clean sans-serif', 'Monospace character', 'Big contrast in scale', 'Subtle, understated', 'Type as visual element']}
            selected={ob.type}
            onChange={v => update('type', v)}
          />
        </div>

        <div className="interview-card">
          <div className="card-label">Question 04</div>
          <div className="card-q">Color philosophy?</div>
          <ChipGroup
            options={['Near-neutral with one accent', 'Tonal / monochromatic', 'High contrast B&W', 'Rich, expressive palette', 'Earthy / muted', 'Vibrant & saturated']}
            selected={ob.color}
            onChange={v => update('color', v)}
          />
        </div>

        <div className="interview-card full">
          <div className="card-label">Question 05</div>
          <div className="card-q">Name one product or website you think has exceptional design. Why does it work for you?</div>
          <textarea
            value={ob.inspiration}
            onChange={e => update('inspiration', e.target.value)}
            placeholder="e.g. Linear — the density is perfect, nothing feels wasted, dark mode done right, interactions have weight without being theatrical..."
          />
        </div>

        <div className="interview-card full">
          <div className="card-label">Question 06</div>
          <div className="card-q">What design trend or pattern do you actively dislike?</div>
          <textarea
            value={ob.antipattern}
            onChange={e => update('antipattern', e.target.value)}
            placeholder="e.g. Glassmorphism everywhere. Cards with too much border radius. Gradient purple on white. Everything looking like Notion..."
          />
        </div>

        <div className="interview-card full">
          <div className="card-label">Question 07 — Optional</div>
          <div className="card-q">Any other strong opinions about motion, interaction, or feel?</div>
          <textarea
            value={ob.motion}
            onChange={e => update('motion', e.target.value)}
            placeholder="e.g. Animations should be fast and purposeful, not theatrical. I hate page transitions that slow me down. Hover states should be instant..."
          />
        </div>

        <div style={{ gridColumn: '1/-1', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button className="btn btn-primary" onClick={() => onSave(ob)}>Save & continue →</button>
          <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Answers are saved locally in your browser</span>
        </div>

      </div>
    </div>
  )
}
