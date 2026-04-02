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

export const DIMENSION_META: {
  key: keyof Dimensions
  icon: string
  label: string
  hint: string
  chips: string[]
}[] = [
  {
    key: 'density', icon: '⬜', label: 'Density & Breathing Room',
    hint: 'How much lives on screen at once. Does the design breathe or pack in?',
    chips: [
      'Generous whitespace', 'Lots of breathing room', 'Airy & spacious', 'Editorial margins',
      'Balanced density', 'Content-first', 'Every pixel earns its place',
      'Dense & information-rich', 'Tight & compact', 'Layered density',
      'Intentional emptiness', 'Nothing decorative',
    ],
  },
  {
    key: 'typography', icon: '𝐓', label: 'Typography',
    hint: 'Weight, scale contrast, personality. Serif vs sans vs mono. Type as voice.',
    chips: [
      'Clean geometric sans', 'Humanist sans', 'Strong serif personality', 'Slab serif',
      'Monospace accents', 'High contrast scale', 'Minimal variation', 'Type as visual element',
      'Big display headers', 'Subtle & understated', 'Variable weight hierarchy',
      'Editorial type system', 'Mixed voices', 'Neutral workhorse',
    ],
  },
  {
    key: 'color', icon: '◐', label: 'Color Philosophy',
    hint: 'Neutral-dominant or expressive? Warm or cool? How contrast is used.',
    chips: [
      'Near-neutral with one accent', 'Monochromatic', 'High contrast B&W', 'Earthy & muted',
      'Warm tones dominant', 'Cool tones dominant', 'Rich & expressive', 'Vibrant & saturated',
      'Tonal & layered', 'Pastel & soft', 'Dark mode native', 'Light & airy',
      'Restrained palette',
    ],
  },
  {
    key: 'motion', icon: '◎', label: 'Motion & Interaction Feel',
    hint: 'Snappy or fluid? Functional or theatrical? What interactions feel like.',
    chips: [
      'Fast & snappy', 'Smooth & fluid', 'Subtle micro-interactions', 'No unnecessary animation',
      'Springy & elastic', 'Functional only', 'Easing curves matter', 'Instant feedback',
      'Restrained & purposeful', 'Cinematic transitions', 'Tactile response', 'Momentum & physics',
    ],
  },
  {
    key: 'hierarchy', icon: '▤', label: 'Visual Hierarchy',
    hint: 'How the eye is guided. What gets emphasis, and how.',
    chips: [
      'Clear & explicit', 'Typography-led', 'Size contrast dominant', 'Color-led hierarchy',
      'Whitespace-led', 'Bold focal points', 'Flat & democratic', 'Grid-based structure',
      'Asymmetric tension', 'Subtle gradients of emphasis', 'Progressive disclosure',
      'One strong primary action',
    ],
  },
  {
    key: 'components', icon: '▣', label: 'Component Character',
    hint: 'Sharp or soft. Flat or layered. Structured or organic. Material vs tactile.',
    chips: [
      'Sharp & angular', 'Soft & rounded', 'Pill-shaped', 'Flat & minimal',
      'Layered with depth', 'Organic shapes', 'Material & tactile', 'Geometric precision',
      'Structured & systematic', 'Playful & expressive', 'Brutalist & raw',
      'Swiss grid discipline', 'Invisible UI', 'Dense data tables',
    ],
  },
  {
    key: 'emotion', icon: '◈', label: 'Emotional Register',
    hint: 'The feeling it gives off. Clinical, warm, playful, serious, luxurious, raw.',
    chips: [
      'Calm & confident', 'Warm & inviting', 'Playful & fun', 'Serious & professional',
      'Luxurious & premium', 'Raw & brutal', 'Clinical & precise', 'Friendly & approachable',
      'Bold & assertive', 'Understated & refined', 'Curious & surprising',
      'Trustworthy & stable', 'Quietly delightful',
    ],
  },
  {
    key: 'avoids', icon: '∅', label: 'What It Avoids',
    hint: 'Taste is also refusal. What design choices are actively rejected.',
    chips: [
      'Glassmorphism', 'Gradient overuse', 'Drop shadow abuse', 'Excessive border radius',
      'Decorative noise', 'Trend-chasing', 'Heavy entrance animations', 'Cluttered layouts',
      'Inconsistent spacing', 'Dark patterns', 'Generic stock aesthetics',
      'Over-designed components', 'Purple-on-white gradients', 'Bouncy animations',
      'Skeuomorphism',
    ],
  },
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
