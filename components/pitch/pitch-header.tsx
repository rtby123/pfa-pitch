import { House, ListOrdered } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PANELS, PANEL_COUNT, type PanelId } from '@/lib/panels'
import { ChapterTabs, navItemClass } from './chapter-tabs'
import { RollText } from './roll-text'

const pad = (n: number) => String(n).padStart(2, '0')

export function PitchHeader({
  activeIndex,
  onNavigate,
  onRegister,
}: {
  activeIndex: number
  onNavigate: (id: PanelId) => void
  onRegister: () => void
}) {
  const active = PANELS[activeIndex]

  return (
    <header className="deck-header flex shrink-0 items-center gap-2 border-b border-border bg-background md:gap-4">
      {/* The supplied PNG sits on white; multiply drops that plate onto the off-white header. */}
      <img
        src="/logos/pfa.png"
        alt="Prudential Financial Advisers"
        className="h-11 w-auto shrink-0 mix-blend-multiply md:h-12"
      />

      <nav aria-label="Pitch sections" className="flex min-w-0 items-center border-l border-border pl-1 md:pl-2">
        <button
          type="button"
          onClick={() => onNavigate('cover')}
          aria-label="Home"
          className={cn(navItemClass(false), 'min-w-11 justify-center gap-1.5')}
        >
          <House className="size-5 xl:size-4" aria-hidden="true" />
          <RollText className="hidden xl:inline-flex">Home</RollText>
        </button>
        <button
          type="button"
          onClick={() => onNavigate('agenda')}
          aria-label="Agenda"
          aria-current={active.id === 'agenda' ? 'true' : undefined}
          className={cn(navItemClass(active.id === 'agenda'), 'min-w-11 justify-center gap-1.5')}
        >
          <ListOrdered className="size-5 lg:size-4" aria-hidden="true" />
          <RollText className="hidden lg:inline-flex">Agenda</RollText>
        </button>
        <ChapterTabs activeIndex={activeIndex} onNavigate={onNavigate} />
      </nav>

      <div className="ml-auto flex shrink-0 items-center gap-3 lg:gap-4">
        <span
          className="hidden text-sm whitespace-nowrap text-muted-foreground tabular-nums md:inline"
          aria-label={`Panel ${activeIndex + 1} of ${PANEL_COUNT}: ${active.title}`}
        >
          {pad(activeIndex + 1)} / {pad(PANEL_COUNT)}
        </span>
        <button
          type="button"
          onClick={onRegister}
          aria-label="Explore joining"
          className="group inline-flex h-11 shrink-0 items-center rounded-md bg-brand px-4 text-sm font-semibold whitespace-nowrap text-brand-foreground transition-colors hover:bg-brand/90"
        >
          <RollText>
            Explore<span className="hidden lg:inline">&nbsp;joining</span>
          </RollText>
        </button>
      </div>
    </header>
  )
}
