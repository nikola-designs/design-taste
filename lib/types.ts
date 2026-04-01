export type ProfileType = 'personal' | 'team'

export type Panel = 'onboarding' | 'references' | 'profile' | 'export'

export interface Onboarding {
  instinct: string[]
  space: string[]
  type: string[]
  color: string[]
  inspiration: string
  antipattern: string
  motion: string
}

export interface Reference {
  id: string
  url: string
  name: string
  notes: string
  tags: string[]
  hasImage: boolean
}

export interface Dimensions {
  density: string
  typography: string
  color: string
  motion: string
  hierarchy: string
  components: string
  emotion: string
  avoids: string
}

export interface Profile {
  onboarding: Onboarding
  references: Reference[]
  dimensions: Dimensions
  uploadedImages: Record<string, string>
}

export interface AppState {
  personal: Profile
  team: Profile
}

export const DIMENSION_META = [
  { key: 'density' as keyof Dimensions,    icon: '⬜', label: 'Density & Breathing Room',  hint: 'How much lives on screen at once. Does the design breathe or pack in?' },
  { key: 'typography' as keyof Dimensions, icon: '𝐓',  label: 'Typography',                hint: 'Weight, scale contrast, personality. Serif vs sans vs mono. Type as voice.' },
  { key: 'color' as keyof Dimensions,      icon: '◐',  label: 'Color Philosophy',           hint: 'Neutral-dominant or expressive? Warm or cool? How contrast is used.' },
  { key: 'motion' as keyof Dimensions,     icon: '◎',  label: 'Motion & Interaction Feel',  hint: 'Snappy or fluid? Functional or theatrical? What interactions feel like.' },
  { key: 'hierarchy' as keyof Dimensions,  icon: '▤',  label: 'Visual Hierarchy',           hint: 'How the eye is guided. What gets emphasis, and how.' },
  { key: 'components' as keyof Dimensions, icon: '▣',  label: 'Component Character',        hint: 'Sharp or soft. Flat or layered. Structured or organic. Material vs tactile.' },
  { key: 'emotion' as keyof Dimensions,    icon: '◈',  label: 'Emotional Register',         hint: 'The feeling it gives off. Clinical, warm, playful, serious, luxurious, raw.' },
  { key: 'avoids' as keyof Dimensions,     icon: '∅',  label: 'What It Avoids',             hint: 'Taste is also refusal. What design choices are actively rejected.' },
]

export function getDefaultDimensions(): Dimensions {
  return { density: '', typography: '', color: '', motion: '', hierarchy: '', components: '', emotion: '', avoids: '' }
}

export function getDefaultOnboarding(): Onboarding {
  return { instinct: [], space: [], type: [], color: [], inspiration: '', antipattern: '', motion: '' }
}

export function getDefaultProfile(): Profile {
  return {
    onboarding: getDefaultOnboarding(),
    references: [],
    dimensions: getDefaultDimensions(),
    uploadedImages: {}
  }
}
