export type PanelId =
  | 'cover'
  | 'agenda'
  | 'opportunity'
  | 'career-model'
  | 'economics'
  | 'support-solutions'
  | 'next-step'

export type ChapterId = 'opportunity' | 'career-proposition' | 'next-step'

export interface Chapter {
  id: ChapterId
  number: number
  title: string
  tabLabel: string
  shortTabLabel: string
  firstPanelId: PanelId
}

export interface PanelConfig {
  id: PanelId
  hash: `#${string}`
  navLabel: string
  title: string
  chapter: ChapterId | null
  chapterLabel: string
  previousId: PanelId | null
  nextId: PanelId | null
}

export const CHAPTERS: readonly Chapter[] = [
  {
    id: 'opportunity',
    number: 1,
    title: 'The Opportunity',
    tabLabel: 'Opportunity',
    shortTabLabel: 'Opportunity',
    firstPanelId: 'opportunity',
  },
  {
    id: 'career-proposition',
    number: 2,
    title: 'The Career Proposition',
    tabLabel: 'Career Proposition',
    shortTabLabel: 'Career',
    firstPanelId: 'career-model',
  },
  {
    id: 'next-step',
    number: 3,
    title: 'Taking the Next Step',
    tabLabel: 'Next Step',
    shortTabLabel: 'Next Step',
    firstPanelId: 'next-step',
  },
]

type PanelBase = Omit<PanelConfig, 'previousId' | 'nextId' | 'chapterLabel'>

const ORDERED: readonly PanelBase[] = [
  // Cover and agenda are introductory: they count as progress positions but belong to no chapter.
  { id: 'cover', hash: '#cover', navLabel: 'Cover', title: 'Cover', chapter: null },
  { id: 'agenda', hash: '#agenda', navLabel: 'Agenda', title: 'Agenda', chapter: null },
  { id: 'opportunity', hash: '#opportunity', navLabel: 'Opportunity', title: 'The Opportunity', chapter: 'opportunity' },
  { id: 'career-model', hash: '#career-model', navLabel: 'Career model', title: 'The Career Model', chapter: 'career-proposition' },
  { id: 'economics', hash: '#economics', navLabel: 'Economics', title: 'Production-Led Economics', chapter: 'career-proposition' },
  { id: 'support-solutions', hash: '#support-solutions', navLabel: 'Support', title: 'Support and Client Solutions', chapter: 'career-proposition' },
  { id: 'next-step', hash: '#next-step', navLabel: 'Next step', title: 'Taking the Next Step', chapter: 'next-step' },
]

export function chapterById(id: ChapterId): Chapter {
  const chapter = CHAPTERS.find((c) => c.id === id)
  if (!chapter) throw new Error(`Unknown chapter: ${id}`)
  return chapter
}

// Previous/next are derived from array order so they can never disagree with it.
export const PANELS: readonly PanelConfig[] = ORDERED.map((panel, i) => ({
  ...panel,
  chapterLabel: panel.chapter
    ? `Section ${chapterById(panel.chapter).number} — ${chapterById(panel.chapter).title}`
    : panel.title,
  previousId: i > 0 ? ORDERED[i - 1].id : null,
  nextId: i < ORDERED.length - 1 ? ORDERED[i + 1].id : null,
}))

export const PANEL_COUNT = PANELS.length

export function panelIndex(id: PanelId): number {
  return PANELS.findIndex((p) => p.id === id)
}

export function panelById(id: PanelId): PanelConfig {
  return PANELS[panelIndex(id)]
}

// Retired hashes that old links may still carry, mapped to their replacement.
const HASH_ALIASES: Readonly<Record<string, `#${string}`>> = {
  '#overview': '#agenda',
}

export function canonicalHash(hash: string): string {
  return HASH_ALIASES[hash] ?? hash
}

export function indexOfHash(hash: string): number {
  return PANELS.findIndex((p) => p.hash === canonicalHash(hash))
}

export function headingId(id: PanelId): string {
  return `${id}-heading`
}

// The registration form's own heading on Panel 6 (target of the header CTA).
export const REGISTER_HEADING_ID = 'register-heading'
