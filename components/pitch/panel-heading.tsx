import { headingId, panelById, type PanelId } from '@/lib/panels'
import { Emphasis } from './emphasis'

/** Label row shared by every slide: a thin red rule, the chapter, then the subsection. */
export function SectionLabel({ primary, secondary }: { primary: string; secondary?: string }) {
  return (
    <p className="deck-label flex flex-wrap items-center gap-x-3 gap-y-1 self-start rounded-full bg-blush px-3.5 py-1.5">
      <span className="text-brand">{primary}</span>
      {secondary && (
        <>
          <span aria-hidden="true" className="text-muted-foreground/60">
            /
          </span>
          <span className="text-muted-foreground">{secondary}</span>
        </>
      )}
    </p>
  )
}

export function PanelHeading({
  id,
  subsection,
  headline,
  emphasis,
  statement,
}: {
  id: PanelId
  subsection?: string
  headline: string
  /** One short phrase of `headline` to set in red. Leave unset for a plain headline. */
  emphasis?: string
  statement?: string
}) {
  const panel = panelById(id)
  return (
    <div className="deck-cascade flex max-w-2xl flex-col gap-[clamp(0.625rem,1.8dvh,1.125rem)]">
      <SectionLabel primary={panel.chapterLabel} secondary={subsection} />
      <h2 id={headingId(id)} tabIndex={-1} className="deck-headline text-balance outline-none">
        <Emphasis text={headline} phrase={emphasis} />
      </h2>
      {statement && (
        <p className="text-lg leading-relaxed text-pretty text-muted-foreground [@media(max-height:600px)]:text-base [@media(max-height:600px)]:leading-normal">
          {statement}
        </p>
      )}
    </div>
  )
}
