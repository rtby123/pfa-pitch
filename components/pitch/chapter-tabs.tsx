import { cn } from '@/lib/utils'
import { CHAPTERS, PANELS, type PanelId } from '@/lib/panels'
import { RollText } from './roll-text'

export const navItemClass = (active: boolean) =>
  cn(
    'group relative inline-flex h-11 shrink-0 items-center rounded-sm px-2 text-sm whitespace-nowrap transition-colors lg:px-3',
    'after:absolute after:inset-x-2 after:bottom-1 after:h-0.5 after:rounded-full lg:after:inset-x-3',
    active
      ? 'font-semibold text-foreground after:bg-brand'
      : 'text-muted-foreground hover:text-foreground after:bg-transparent',
  )

export function ChapterTabs({
  activeIndex,
  onNavigate,
}: {
  activeIndex: number
  onNavigate: (id: PanelId) => void
}) {
  const activeChapter = PANELS[activeIndex].chapter

  return (
    <ul className="flex items-center">
      {CHAPTERS.map((chapter) => {
        const active = chapter.id === activeChapter
        return (
          <li key={chapter.id}>
            <button
              type="button"
              onClick={() => onNavigate(chapter.firstPanelId)}
              aria-current={active ? 'true' : undefined}
              aria-label={`Section ${chapter.number}: ${chapter.title}`}
              className={navItemClass(active)}
            >
              <RollText className="md:hidden">{chapter.shortTabLabel}</RollText>
              <RollText className="hidden md:inline-flex">{chapter.tabLabel}</RollText>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
