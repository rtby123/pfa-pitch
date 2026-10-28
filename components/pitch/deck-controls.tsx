import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react'
import { PANELS, panelById, type PanelId } from '@/lib/panels'
import { ProgressNavigation } from './progress-navigation'
import { RollText } from './roll-text'

const stepButton =
  'group inline-flex min-h-11 max-w-full items-center gap-1.5 rounded-sm px-2 text-sm font-medium whitespace-nowrap transition-colors hover:text-brand'

export function DeckControls({
  activeIndex,
  onNavigate,
}: {
  activeIndex: number
  onNavigate: (id: PanelId) => void
}) {
  const panel = PANELS[activeIndex]
  const previous = panel.previousId ? panelById(panel.previousId) : null
  const next = panel.nextId ? panelById(panel.nextId) : null

  return (
    <footer className="deck-footer grid shrink-0 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 border-t border-border bg-background">
      <div className="flex min-w-0 justify-start">
        {previous && (
          <button
            type="button"
            onClick={() => onNavigate(previous.id)}
            aria-label={`Previous: ${previous.title}`}
            className={stepButton}
          >
            <ChevronLeft className="size-5 shrink-0" aria-hidden="true" />
            <RollText>Previous</RollText>
            <span className="hidden min-w-0 truncate font-normal text-muted-foreground xl:inline">
              · {previous.title}
            </span>
          </button>
        )}
      </div>

      <div className="flex items-center gap-4">
        <ProgressNavigation activeIndex={activeIndex} onNavigate={onNavigate} />
        <p className="hidden text-xs whitespace-nowrap text-muted-foreground xl:block">Swipe or use arrow keys</p>
      </div>

      <div className="flex min-w-0 justify-end">
        {next ? (
          <button
            type="button"
            onClick={() => onNavigate(next.id)}
            aria-label={`Next: ${next.title}`}
            className={stepButton}
          >
            <span className="hidden min-w-0 truncate font-normal text-muted-foreground xl:inline">
              {next.title} ·
            </span>
            <RollText>Next</RollText>
            <ChevronRight className="size-5 shrink-0" aria-hidden="true" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onNavigate('agenda')}
            aria-label="Return to agenda"
            className={stepButton}
          >
            <RollText>Agenda</RollText>
            <RotateCcw className="size-4 shrink-0" aria-hidden="true" />
          </button>
        )}
      </div>
    </footer>
  )
}
