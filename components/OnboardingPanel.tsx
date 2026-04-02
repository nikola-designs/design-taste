'use client'

import { useState } from 'react'
import { Onboarding } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'

interface Props {
  initial: Onboarding
  onSave: (ob: Onboarding) => void
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
    <div className="flex flex-wrap gap-1.5">
      {options.map(opt => (
        <Badge
          key={opt}
          variant={selected.includes(opt) ? 'default' : 'outline'}
          className="cursor-pointer select-none rounded-full px-3 py-1 text-[0.8rem] font-normal transition-all"
          onClick={() => toggle(opt)}
        >
          {opt}
        </Badge>
      ))}
    </div>
  )
}

export default function OnboardingPanel({ initial, onSave }: Props) {
  const [ob, setOb] = useState<Onboarding>(initial)
  const [open, setOpen] = useState(false)

  const update = (key: keyof Onboarding, val: string[] | string) =>
    setOb(prev => ({ ...prev, [key]: val }))

  const answeredCount = [
    ob.instinct.length > 0,
    ob.space.length > 0,
    ob.type.length > 0,
    ob.color.length > 0,
    ob.inspiration.trim() !== '',
    ob.antipattern.trim() !== '',
    ob.motion.trim() !== '',
  ].filter(Boolean).length

  return (
    <div>
      <div className="page-header">
        <h1>Build your taste profile</h1>
        <p>
          Answer a few guided questions to seed your profile with raw instincts — before you start curating references or selecting dimensions.
        </p>
        <div className="onboarding-trigger">
          <button
            className="taste-hints-btn"
            onClick={() => setOpen(prev => !prev)}
          >
            {open ? '↑ Hide taste hints' : '✦ Taste Hints'}
          </button>
          {answeredCount > 0 && !open && (
            <span className="taste-hints-count">{answeredCount} of 7 answered</span>
          )}
          {!open && (
            <span className="taste-hints-sub">Optional · helps seed your profile faster</span>
          )}
        </div>
      </div>

      {open && (
        <div className="onboarding-grid">

          <Card>
            <CardContent className="pt-8 flex flex-col gap-4">
              <div className="card-label">Question 01</div>
              <div className="card-q">What&apos;s your overall visual instinct?</div>
              <ChipGroup
                options={['Less is more', 'Rich & layered', 'Editorial', 'Raw / brutalist', 'Warm & organic', 'Cold & precise', 'Playful', 'Luxury']}
                selected={ob.instinct} onChange={v => update('instinct', v)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-8 flex flex-col gap-4">
              <div className="card-label">Question 02</div>
              <div className="card-q">How do you feel about white space?</div>
              <ChipGroup
                options={['Generous — let it breathe', 'Balanced', 'Dense — use every pixel', 'Depends on context']}
                selected={ob.space} onChange={v => update('space', v)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-8 flex flex-col gap-4">
              <div className="card-label">Question 03</div>
              <div className="card-q">Typography instinct?</div>
              <ChipGroup
                options={['Serif personality', 'Clean sans-serif', 'Monospace character', 'Big contrast in scale', 'Subtle, understated', 'Type as visual element']}
                selected={ob.type} onChange={v => update('type', v)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-8 flex flex-col gap-4">
              <div className="card-label">Question 04</div>
              <div className="card-q">Color philosophy?</div>
              <ChipGroup
                options={['Near-neutral with one accent', 'Tonal / monochromatic', 'High contrast B&W', 'Rich, expressive palette', 'Earthy / muted', 'Vibrant & saturated']}
                selected={ob.color} onChange={v => update('color', v)}
              />
            </CardContent>
          </Card>

          <Card className="col-span-full">
            <CardContent className="pt-8 flex flex-col gap-4">
              <div className="card-label">Question 05</div>
              <div className="card-q">Name one product or website you think has exceptional design. Why does it work for you?</div>
              <Textarea
                value={ob.inspiration}
                onChange={e => update('inspiration', e.target.value)}
                placeholder="e.g. Linear — the density is perfect, nothing feels wasted, dark mode done right, interactions have weight without being theatrical..."
              />
            </CardContent>
          </Card>

          <Card className="col-span-full">
            <CardContent className="pt-8 flex flex-col gap-4">
              <div className="card-label">Question 06</div>
              <div className="card-q">What design trend or pattern do you actively dislike?</div>
              <Textarea
                value={ob.antipattern}
                onChange={e => update('antipattern', e.target.value)}
                placeholder="e.g. Glassmorphism everywhere. Cards with too much border radius. Gradient purple on white..."
              />
            </CardContent>
          </Card>

          <Card className="col-span-full">
            <CardContent className="pt-8 flex flex-col gap-4">
              <div className="card-label">Question 07 — Optional</div>
              <div className="card-q">Any other strong opinions about motion, interaction, or feel?</div>
              <Textarea
                value={ob.motion}
                onChange={e => update('motion', e.target.value)}
                placeholder="e.g. Animations should be fast and purposeful, not theatrical..."
              />
            </CardContent>
          </Card>

          <div className="col-span-full flex gap-4 items-center">
            <Button size="lg" onClick={() => { onSave(ob); setOpen(false) }}>
              Save & continue →
            </Button>
            <button className="taste-hints-btn-ghost" onClick={() => setOpen(false)}>
              Collapse
            </button>
          </div>

        </div>
      )}
    </div>
  )
}
