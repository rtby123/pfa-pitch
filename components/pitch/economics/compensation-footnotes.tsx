import { footnotes as COMPENSATION_FOOTNOTES } from '@/config/five-year-compensation'

export function CompensationFootnotes() {
  return (
    <section aria-label="Footnotes" className="border-t border-border pt-4">
      <ol className="grid gap-x-8 gap-y-2 text-sm leading-relaxed text-pretty text-muted-foreground md:grid-cols-2">
        {COMPENSATION_FOOTNOTES.map((note, i) => (
          <li key={note} className="flex gap-2">
            <span className="shrink-0 font-semibold tabular-nums text-foreground/70">{i + 1}.</span>
            <span>{note}</span>
          </li>
        ))}
      </ol>
    </section>
  )
}
