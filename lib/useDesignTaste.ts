'use client'

import { useState, useEffect, useCallback } from 'react'
import { toast as sonnerToast } from 'sonner'
import {
  AppState, Profile, ProfileType, Onboarding, Reference, Dimensions,
  DIMENSION_META, getDefaultProfile
} from './types'

const STORAGE_KEY = 'design-taste-state'

function loadFromStorage(): AppState {
  if (typeof window === 'undefined') return { personal: getDefaultProfile(), team: getDefaultProfile() }
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return { personal: getDefaultProfile(), team: getDefaultProfile() }
    const parsed = JSON.parse(saved)
    const personal = { ...getDefaultProfile(), ...parsed.personal }
    const team = { ...getDefaultProfile(), ...parsed.team }
    if (!personal.uploadedImages) personal.uploadedImages = {}
    if (!team.uploadedImages) team.uploadedImages = {}
    return { personal, team }
  } catch {
    return { personal: getDefaultProfile(), team: getDefaultProfile() }
  }
}

export function useDesignTaste() {
  const [activeProfile, setActiveProfile] = useState<ProfileType>('personal')
  const [appState, setAppState] = useState<AppState>(() => ({ personal: getDefaultProfile(), team: getDefaultProfile() }))

  // Load from localStorage on mount
  useEffect(() => {
    setAppState(loadFromStorage())
  }, [])

  const saveToStorage = useCallback((state: AppState) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      sonnerToast('Storage full — images may not save')
    }
  }, [])

  const toast = useCallback((msg: string) => {
    sonnerToast(msg)
  }, [])

  const profile = useCallback((): Profile => appState[activeProfile], [appState, activeProfile])

  const updateProfile = useCallback((updater: (p: Profile) => Profile) => {
    setAppState(prev => {
      const next = { ...prev, [activeProfile]: updater({ ...prev[activeProfile] }) }
      saveToStorage(next)
      return next
    })
  }, [activeProfile, saveToStorage])

  // ── ONBOARDING ──
  const saveOnboarding = useCallback((ob: Onboarding) => {
    updateProfile(p => {
      const d = { ...p.dimensions }
      if (ob.space?.length && !d.density) d.density = ob.space.join(', ')
      if (ob.type?.length && !d.typography) d.typography = ob.type.join(', ')
      if (ob.color?.length && !d.color) d.color = ob.color.join(', ')
      if (ob.motion && !d.motion) d.motion = ob.motion
      if (ob.antipattern && !d.avoids) d.avoids = ob.antipattern
      if (ob.inspiration && !d.emotion) d.emotion = ob.inspiration
      return { ...p, onboarding: ob, dimensions: d }
    })
    toast('Onboarding saved ✓')
  }, [updateProfile, toast])

  // ── REFERENCES ──
  const addReference = useCallback((ref: Omit<Reference, 'id'>, imageData?: string) => {
    const id = Date.now().toString()
    const newRef: Reference = { ...ref, id }
    updateProfile(p => {
      const d = { ...p.dimensions }
      const images = { ...p.uploadedImages }
      if (imageData) images[id] = imageData

      // Update dimensions from ref
      if (ref.notes) {
        const lower = ref.notes.toLowerCase()
        const negWords = ['hate', 'dislike', 'avoid', "don't", 'never', 'bad', 'ugly', 'wrong']
        const isNegative = negWords.some(w => lower.includes(w))
        if (isNegative) {
          d.avoids = [d.avoids, ref.notes].filter(Boolean).join('\n\n')
        } else {
          d.emotion = [d.emotion, `[${ref.name || ref.url}] ${ref.notes}`].filter(Boolean).join('\n\n')
        }
      }
      const tagDimMap: Record<string, keyof Dimensions> = {
        'Minimal': 'density', 'Dense': 'density',
        'Serif': 'typography', 'Monospace': 'typography',
        'Motion-forward': 'motion', 'Static': 'motion',
        'Warm': 'color', 'Cold': 'color',
      }
      ref.tags.forEach(t => {
        const dim = tagDimMap[t]
        if (dim && !d[dim].includes(t)) {
          d[dim] = [d[dim], t].filter(Boolean).join(', ')
        }
      })

      return { ...p, references: [newRef, ...p.references], dimensions: d, uploadedImages: images }
    })
    toast('Reference added ✓')
  }, [updateProfile, toast])

  const removeReference = useCallback((id: string) => {
    updateProfile(p => {
      const images = { ...p.uploadedImages }
      delete images[id]
      return { ...p, references: p.references.filter(r => r.id !== id), uploadedImages: images }
    })
    toast('Reference removed')
  }, [updateProfile, toast])

  const updateReferenceNotes = useCallback((id: string, notes: string) => {
    updateProfile(p => ({
      ...p,
      references: p.references.map(r => r.id === id ? { ...r, notes } : r),
    }))
  }, [updateProfile])

  // ── PROFILE DIMENSIONS ──
  const saveDimensions = useCallback((dims: Dimensions) => {
    updateProfile(p => ({ ...p, dimensions: dims }))
    toast('Taste profile saved ✓')
  }, [updateProfile, toast])

  const rebuildFromRefs = useCallback(() => {
    updateProfile(p => {
      const d = { density: '', typography: '', color: '', motion: '', hierarchy: '', components: '', emotion: '', avoids: '' }
      const ob = p.onboarding
      if (ob.space?.length) d.density = ob.space.join(', ')
      if (ob.type?.length) d.typography = ob.type.join(', ')
      if (ob.color?.length) d.color = ob.color.join(', ')
      if (ob.motion) d.motion = ob.motion
      if (ob.antipattern) d.avoids = ob.antipattern
      if (ob.inspiration) d.emotion = ob.inspiration

      const tagDimMap: Record<string, keyof Dimensions> = {
        'Minimal': 'density', 'Dense': 'density',
        'Serif': 'typography', 'Monospace': 'typography',
        'Motion-forward': 'motion', 'Static': 'motion',
        'Warm': 'color', 'Cold': 'color',
      }
      p.references.forEach(ref => {
        if (ref.notes) {
          const lower = ref.notes.toLowerCase()
          const negWords = ['hate', 'dislike', 'avoid', "don't", 'never', 'bad', 'ugly', 'wrong']
          const isNegative = negWords.some(w => lower.includes(w))
          if (isNegative) d.avoids = [d.avoids, ref.notes].filter(Boolean).join('\n\n')
          else d.emotion = [d.emotion, `[${ref.name || ref.url}] ${ref.notes}`].filter(Boolean).join('\n\n')
        }
        ref.tags.forEach(t => {
          const dim = tagDimMap[t]
          if (dim && !d[dim].includes(t)) d[dim] = [d[dim], t].filter(Boolean).join(', ')
        })
      })
      return { ...p, dimensions: d }
    })
    toast('Profile rebuilt from references ✓')
  }, [updateProfile, toast])

  // ── SKILL EXPORT ──
  const buildSkillMD = useCallback((profileType: ProfileType): string => {
    const p = appState[profileType]
    const ob = p.onboarding
    const dims = p.dimensions
    const refs = p.references
    const label = profileType === 'team' ? 'Team Design Taste' : 'Personal Design Taste'
    const scope = profileType === 'team'
      ? 'This is the shared team taste profile. Apply it to all UI work in this project.'
      : "This is a personal taste profile. It reflects one developer's design sensibility."

    const dimLines = DIMENSION_META.map(dm => {
      const val = dims[dm.key]?.trim()
      return val ? `### ${dm.label}\n${val}` : `### ${dm.label}\n*(not yet defined)*`
    }).join('\n\n')

    const refLines = refs.length
      ? refs.map((r, i) => {
          const lines: string[] = [`### ${i + 1}. ${r.name}`]
          if (r.url) lines.push(`**Source:** ${r.url}`)
          if (r.tags?.length) lines.push(`**Signals:** ${r.tags.join(', ')}`)
          if (r.notes) lines.push(`\n**Design analysis:**\n${r.notes}`)
          else lines.push(`\n**Design analysis:** *(not yet analysed)*`)
          return lines.join('\n')
        }).join('\n\n---\n\n')
      : '*(no references added yet)*'

    const onboardingLines: string[] = []
    if (ob.instinct?.length) onboardingLines.push(`- Visual instinct: ${ob.instinct.join(', ')}`)
    if (ob.space?.length) onboardingLines.push(`- Space/density: ${ob.space.join(', ')}`)
    if (ob.type?.length) onboardingLines.push(`- Typography: ${ob.type.join(', ')}`)
    if (ob.color?.length) onboardingLines.push(`- Color: ${ob.color.join(', ')}`)
    if (ob.inspiration) onboardingLines.push(`- Inspiration: ${ob.inspiration}`)
    if (ob.antipattern) onboardingLines.push(`- Avoids: ${ob.antipattern}`)
    if (ob.motion) onboardingLines.push(`- Motion/interaction: ${ob.motion}`)

    return `---
name: design-taste${profileType === 'team' ? '-team' : ''}
description: >
  ${label} profile. Use this skill whenever building UI, reviewing a design,
  suggesting visual improvements, or evaluating whether something looks right.
  Trigger on any request involving components, layouts, screens, colors, typography,
  or design critique. Also trigger when the user says "add a reference" or shares
  a screenshot or URL of a design. This tells you what good design means to
  ${profileType === 'team' ? 'this team' : 'this person'} — not generic rules.
---

# ${label}

${scope}

**Your job is not to apply generic design rules. Your job is to see through ${profileType === 'team' ? "this team's" : "this person's"} eyes.**

---

## How to use this skill

### Generate UI
Before writing code: read the taste dimensions below. Apply them as a lens, not a checklist.
After generating, note in 1–2 sentences which taste signals you applied and why.

### Critique UI
Evaluate against the taste dimensions. Be specific.
Structure: **what works** / **what violates the taste** / **what to change**
Always explain *why* something feels off, not just *that* it does.

### Improve UI
Identify the 1–3 highest-leverage changes to move toward this taste profile.
Explain each in taste terms (e.g. "this spacing works against the preference for breathing room").

### Add a reference
Analyze the new URL or screenshot across the taste dimensions.
Identify what it contributes beyond what's already captured.
Update the profile by appending — do not overwrite. Note tensions if they exist.

---

## Taste Dimensions

${dimLines}

---

## References (${refs.length})

${refLines}

---

## Onboarding Answers

${onboardingLines.length ? onboardingLines.join('\n') : '*(not completed)*'}

---

## Guiding principle

Taste is personal, not universal. Do not correct or normalize this taste toward trends or conventions.
If the profile contains tensions — name them and use context to resolve them.
Uncertainty honestly expressed is more useful than false confidence.
`
  }, [appState])

  const buildTasteProfileMD = useCallback((profileType: ProfileType): string => {
    const p = appState[profileType]
    const dims = p.dimensions
    const refs = p.references

    const dimLines = DIMENSION_META.map(dm => {
      const val = dims[dm.key]?.trim()
      return val ? `## ${dm.label}\n${val}` : `## ${dm.label}\n*(not yet defined)*`
    }).join('\n\n')

    const refLines = refs.length
      ? refs.map((r, i) => {
          const lines = [`## Reference ${i + 1} — ${r.name}`]
          if (r.url) lines.push(`Source: ${r.url}`)
          if (r.tags?.length) lines.push(`Signals: ${r.tags.join(', ')}`)
          if (r.notes) lines.push(`\n"${r.notes}"`)
          return lines.join('\n')
        }).join('\n\n---\n\n')
      : '*(no references added yet)*'

    return `# Design Taste Profile
> Last updated via Design Taste Skill Builder

${dimLines}

---

## References

${refLines}

---

## Running Synthesis

*(This section should be updated by the agent after each new reference is added.)*
`
  }, [appState])

  return {
    activeProfile,
    setActiveProfile,
    profile,
    appState,
    saveOnboarding,
    addReference,
    removeReference,
    updateReferenceNotes,
    saveDimensions,
    rebuildFromRefs,
    buildSkillMD,
    buildTasteProfileMD,
  }
}
