'use client'

import { useEffect, useRef, useState, type Ref } from 'react'
import { compensationSection } from '@/config/five-year-compensation'
import { Emphasis } from '../emphasis'
import { SectionLabel } from '../panel-heading'
import { BackToEconomicsControl } from './back-to-economics-control'
import { CompensationAssumptions } from './compensation-assumptions'
import { CompensationFootnotes } from './compensation-footnotes'
import { FiveYearCompensationChart, useRevealed } from './five-year-compensation-chart'
import { FiveYearTotalSummary } from './five-year-total-summary'

const HEADING_ID = 'economics-illustration-heading'

/** Graph-first lower section of the Economics panel: header, graph + totals, assumptions, footnotes. */
export function InlineCompensationIllustration({
  ref,
  headingRef,
  onBack,
}: {
  ref?: Ref<HTMLDivElement>
  headingRef?: Ref<HTMLHeadingElement>
  onBack: () => void
}) {
  // One observer drives the whole sequence so chart and totals stay in step.
  const { ref: revealRef, revealed } = useRevealed<HTMLDivElement>()

  // The scenario row must share the screen with the graph, so the chart reserves its height.
  const assumptionsRef = useRef<HTMLDivElement>(null)
  const [reserveBelow, setReserveBelow] = useState(0)
  useEffect(() => {
    const el = assumptionsRef.current
    if (!el) return
    const measure = () => {
      const gap = parseFloat(getComputedStyle(el.parentElement!).rowGap) || 0
      setReserveBelow(Math.ceil(el.getBoundingClientRect().height + gap + 12))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div ref={ref} role="region" aria-labelledby={HEADING_ID} className="min-h-full snap-start bg-ivory/40">
      <BackToEconomicsControl onBack={onBack} />

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-[clamp(1rem,2.5dvh,1.75rem)] px-6 py-[clamp(1rem,3dvh,2rem)] md:px-10 lg:px-14">
        <header className="flex flex-col gap-1.5">
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
            <SectionLabel primary={compensationSection.eyebrow} />
            <p className="deck-label shrink-0 rounded-sm border border-brand px-2.5 py-1 text-brand">
              {compensationSection.status}
            </p>
          </div>
          <h3
            id={HEADING_ID}
            ref={headingRef}
            tabIndex={-1}
            className="text-3xl leading-tight font-semibold tracking-tight text-balance outline-none md:text-4xl [@media(max-height:760px)]:md:text-[2rem]"
          >
            <Emphasis text={compensationSection.headline} phrase={compensationSection.emphasis} />
          </h3>
          <p className="text-base leading-snug text-pretty text-muted-foreground">{compensationSection.supporting}</p>
        </header>

        {/* Portrait: totals first, then the full-width graph. Landscape: graph ~3/4, totals beside it. */}
        <div
          ref={revealRef}
          className="flex flex-col gap-6 [@media(orientation:landscape)]:md:grid [@media(orientation:landscape)]:md:grid-cols-[minmax(0,3fr)_minmax(0,1fr)] [@media(orientation:landscape)]:md:items-start [@media(orientation:landscape)]:md:gap-8"
        >
          <div className="order-2 min-w-0 [@media(orientation:landscape)]:md:order-1">
            <FiveYearCompensationChart revealed={revealed} reserveBelow={reserveBelow} />
          </div>
          <div className="order-1 [@media(orientation:landscape)]:md:order-2 [@media(orientation:landscape)]:md:pt-8">
            <FiveYearTotalSummary revealed={revealed} />
          </div>
        </div>

        <div ref={assumptionsRef}>
          <CompensationAssumptions />
        </div>
        <CompensationFootnotes />
      </div>
    </div>
  )
}
