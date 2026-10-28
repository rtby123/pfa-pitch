import { cn } from '@/lib/utils'
import { PANELS, PANEL_COUNT, type PanelId } from '@/lib/panels'

export function ProgressNavigation({
  activeIndex,
  onNavigate,
}: {
  activeIndex: number
  onNavigate: (id: PanelId) => void
}) {
  return (
    <nav aria-label="Panel progress">
      <ol className="flex items-center">
        {PANELS.map((panel, i) => {
          const active = i === activeIndex
          const startsChapter = i > 0 && PANELS[i - 1].chapter !== panel.chapter
          return (
            <li key={panel.id} className={cn(startsChapter && 'ml-1.5')}>
              <button
                type="button"
                onClick={() => onNavigate(panel.id)}
                aria-label={`Panel ${i + 1} of ${PANEL_COUNT}: ${panel.title}`}
                aria-current={active ? 'step' : undefined}
                title={panel.title}
                className="group flex h-11 w-9 items-center justify-center rounded-sm sm:w-11"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'block rounded-full transition-all duration-200 motion-reduce:transition-none',
                    active
                    ? 'h-1.5 w-8 bg-brand group-hover:w-9'
                    : cn(
                        'h-1 w-5 group-hover:w-6 group-hover:bg-foreground/60',
                          i < activeIndex ? 'bg-foreground/45' : 'bg-foreground/15',
                        ),
                  )}
                />
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
