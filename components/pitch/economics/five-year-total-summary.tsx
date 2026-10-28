import {
  compensationSection,
  ifaBenchmark,
  ifaBenchmarkTotal,
  newCareerModel,
  newCareerModelTotal,
  totalUpliftLabel,
} from '@/config/five-year-compensation'

/** The five-year totals and the uplift. Fades in last in the reveal sequence. */
export function FiveYearTotalSummary({ revealed }: { revealed: boolean }) {
  return (
    <section
      aria-labelledby="five-year-total-heading"
      style={{ opacity: revealed ? 1 : 0, transition: 'opacity 200ms ease-out 600ms' }}
      className="flex flex-col gap-4 border-t-2 border-brand pt-4"
    >
      <div className="flex flex-col gap-1">
        <h4 id="five-year-total-heading" className="deck-label text-muted-foreground">
          {compensationSection.totalLabel}
        </h4>
        <p className="text-2xl leading-tight font-semibold tracking-tight text-balance text-brand md:text-3xl">
          {totalUpliftLabel}
        </p>
      </div>

      <dl className="flex flex-col gap-3 sm:flex-row sm:gap-8 [@media(orientation:landscape)]:md:flex-col [@media(orientation:landscape)]:md:gap-3">
        <div className="flex flex-col gap-0.5 rounded-sm bg-blush px-3 py-2.5">
          <dt className="text-sm font-semibold text-brand">{newCareerModel.label}</dt>
          <dd className="text-3xl leading-none font-semibold tracking-tight tabular-nums md:text-4xl">
            {newCareerModelTotal.label}
          </dd>
        </div>
        <div className="flex flex-col gap-0.5 px-3 py-2.5">
          <dt className="text-sm font-medium text-muted-foreground">{ifaBenchmark.label}</dt>
          <dd className="text-2xl leading-none font-semibold tracking-tight tabular-nums text-muted-foreground md:text-3xl">
            {ifaBenchmarkTotal.label}
          </dd>
        </div>
      </dl>
    </section>
  )
}
