import { ArrowRight } from 'lucide-react'
import { CHAPTERS, headingId, type PanelId } from '@/lib/panels'
import { agenda } from '@/lib/pitch-content'
import { Emphasis } from './emphasis'
import { SectionLabel } from './panel-heading'

export function AgendaPanel({ onNavigate }: { onNavigate: (id: PanelId) => void }) {
  return (
    <div className="deck-gap flex flex-col">
      <div className="deck-cascade flex max-w-3xl flex-col gap-[clamp(0.625rem,1.8dvh,1.125rem)] [@media(max-height:600px)]:gap-1.5">
        <SectionLabel primary={agenda.eyebrow} />
        <h2 id={headingId('agenda')} tabIndex={-1} className="deck-headline text-balance outline-none">
          <Emphasis text={agenda.headline} phrase={agenda.emphasis} />
        </h2>
        <p className="max-w-2xl text-lg leading-relaxed text-pretty text-muted-foreground [@media(max-height:640px)]:text-base [@media(max-height:600px)]:leading-normal">
          {agenda.body}
        </p>
      </div>

      {/* Three chapter panels on landscape; a compact stack on portrait. The list moves as one, never card by card. */}
      <ol className="deck-after grid gap-3 md:landscape:grid-cols-3 md:landscape:gap-4 lg:gap-5">
        {CHAPTERS.map((chapter, i) => (
          <li key={chapter.id} className="flex">
            <button
              type="button"
              onClick={() => onNavigate(chapter.firstPanelId)}
              aria-label={`${String(chapter.number).padStart(2, '0')}: ${agenda.entryTitles[chapter.id]}`}
              className={`deck-surface group flex w-full items-center gap-5 border border-transparent p-[clamp(0.875rem,2.4dvh,1.75rem)] text-left transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-brand/30 md:landscape:flex-col md:landscape:items-stretch md:landscape:gap-[clamp(0.5rem,1.8dvh,1.25rem)] [@media(max-height:600px)]:gap-2 [@media(max-height:600px)]:p-3.5 bg-ivory`}
            >
              {/* On landscape the arrow shares the numeral's row, so it never costs a line of its own. */}
              <span className="flex shrink-0 items-center justify-between gap-4 md:landscape:order-none">
                <span
                  aria-hidden="true"
                  className="w-14 text-5xl leading-none font-light tracking-tight text-brand tabular-nums md:landscape:w-auto md:landscape:text-[clamp(2.25rem,8dvh,4.5rem)]"
                >
                  {String(chapter.number).padStart(2, '0')}
                </span>
                <ArrowRight
                  className="hidden size-5 text-brand transition-transform group-hover:translate-x-1 md:landscape:block"
                  aria-hidden="true"
                />
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-1.5">
                <span className="text-xl leading-snug font-semibold text-balance lg:text-2xl">
                  <Emphasis text={agenda.entryTitles[chapter.id]} phrase={agenda.entryEmphasis[chapter.id]} />
                </span>
                <span className="deck-label text-muted-foreground">{chapter.title}</span>
              </span>
              <ArrowRight
                className="size-5 shrink-0 text-brand transition-transform group-hover:translate-x-1 md:landscape:hidden"
                aria-hidden="true"
              />
            </button>
          </li>
        ))}
      </ol>

      <button
        type="button"
        onClick={() => onNavigate('opportunity')}
        className="deck-after deck-after-late inline-flex min-h-11 items-center gap-2 self-start rounded-md bg-brand px-5 text-base font-semibold text-brand-foreground transition-colors hover:bg-brand/90"
      >
        {agenda.startLabel}
        <ArrowRight className="size-5" aria-hidden="true" />
      </button>
    </div>
  )
}
