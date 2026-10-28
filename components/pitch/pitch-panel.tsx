import type { CSSProperties, ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { PANEL_COUNT, headingId, type PanelConfig, type PanelId } from '@/lib/panels'

/**
 * Washed-out photograph behind each content slide, one per chapter. The cover
 * carries its own artwork and Economics keeps a calm ground for its chart.
 */
const BACKDROPS: Partial<Record<PanelId, string>> = {
  agenda: '/images/backdrop-skyline.png',
  opportunity: '/images/backdrop-office.png',
  'career-model': '/images/backdrop-marble.png',
  'support-solutions': '/images/backdrop-marble.png',
  'next-step': '/images/backdrop-skyline.png',
}

/** The padded, vertically centred reading column every content slide sits in. */
export function PanelFrame({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        'deck-reveal mx-auto flex min-h-full w-full max-w-6xl flex-col justify-center px-6 py-[clamp(1rem,3dvh,2rem)] md:px-10 lg:px-14',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function PitchPanel({
  panel,
  index,
  active,
  layout = 'frame',
  children,
}: {
  panel: PanelConfig
  index: number
  active: boolean
  /**
   * `frame`: one centred slide. `bleed`: edge-to-edge artwork (the cover).
   * `stack`: the children are full-height sections the panel scrolls between
   * vertically, inside the one horizontal screen (Economics).
   */
  layout?: 'frame' | 'bleed' | 'stack'
  children: ReactNode
}) {
  const backdrop = BACKDROPS[panel.id]
  const shared = {
    id: `panel-${panel.id}`,
    'aria-labelledby': headingId(panel.id),
    'aria-roledescription': 'slide',
    'data-index': index + 1,
    'data-total': PANEL_COUNT,
    inert: !active,
    'data-active': active ? '' : undefined,
  }

  if (layout === 'bleed') {
    return (
      <section {...shared} className="deck-panel h-full w-full overflow-hidden">
        {children}
      </section>
    )
  }

  if (layout === 'stack') {
    return (
      <section
        {...shared}
        className="deck-panel relative h-full w-full snap-y snap-proximity overflow-x-hidden overflow-y-auto overscroll-y-contain"
      >
        {children}
      </section>
    )
  }

  return (
    <section
      {...shared}
      className={cn('deck-panel h-full w-full overflow-y-auto overscroll-y-contain', backdrop && 'deck-backdrop')}
      style={backdrop ? ({ '--backdrop': `url(${backdrop})` } as CSSProperties) : undefined}
    >
      {/* Overflow is a fallback (validation, keyboard, text zoom), not the design. */}
      <PanelFrame>{children}</PanelFrame>
    </section>
  )
}
