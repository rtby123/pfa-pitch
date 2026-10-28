import { assumptions } from '@/config/five-year-compensation'

export function CompensationAssumptions() {
  return (
    // Landscape: one row (heading beside the values) so the scenario sits on the same screen as the graph.
    <section
      aria-labelledby="comp-assumption-heading"
      className="flex flex-col gap-2 border-t border-border pt-4 [@media(max-height:760px)]:pt-3 [@media(orientation:landscape)]:md:flex-row [@media(orientation:landscape)]:md:items-start [@media(orientation:landscape)]:md:gap-8"
    >
      <h4 id="comp-assumption-heading" className="deck-label shrink-0 text-brand [@media(orientation:landscape)]:md:w-44 [@media(orientation:landscape)]:md:pt-0.5">
        {assumptions.heading}
      </h4>
      <dl className="grid min-w-0 flex-1 grid-cols-2 gap-x-6 gap-y-2 md:grid-cols-[auto_auto_auto_1fr]">
        {assumptions.items.map((item) => (
          <div key={item.label} className="flex flex-col gap-0.5">
            <dt className="text-sm text-muted-foreground">{item.label}</dt>
            <dd className="text-base leading-snug font-semibold text-pretty">{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
