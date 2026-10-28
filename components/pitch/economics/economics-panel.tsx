'use client'

import { useCallback, useRef, type Ref } from 'react'
import { ArrowDown, TrendingUp } from 'lucide-react'
import { headingId } from '@/lib/panels'
import { economics } from '@/lib/pitch-content'
import { PointList, Slide } from '../content-panels'
import { PanelHeading } from '../panel-heading'
import { PanelFrame } from '../pitch-panel'
import { InlineCompensationIllustration } from './inline-compensation-illustration'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

function EconomicsOverview({ ref, onViewIllustration }: { ref?: Ref<HTMLDivElement>; onViewIllustration: () => void }) {
  const proof = economics.proof
  return (
    <div ref={ref} className="h-full snap-start">
      <PanelFrame>
        <Slide
          message={
            <>
              <PanelHeading
                id="economics"
                subsection={economics.subsection}
                headline={economics.headline}
                emphasis={economics.emphasis}
                statement={economics.statement}
              />
              {/* Secondary: outlined, so it never competes with the header's primary action. */}
              <button
                type="button"
                onClick={onViewIllustration}
                className="group inline-flex min-h-11 items-center gap-2 self-start rounded-md border border-brand/40 px-5 text-base font-semibold text-brand transition-colors hover:border-brand hover:bg-blush"
              >
                <TrendingUp className="size-4" aria-hidden="true" />
                {economics.illustrationLabel}
                <ArrowDown className="size-4 transition-transform group-hover:translate-y-0.5" aria-hidden="true" />
              </button>
            </>
          }
          points={
            <div className="flex flex-col gap-[clamp(0.75rem,2.2dvh,1.25rem)]">
              <PointList heading={economics.pointsHeading} points={economics.points} />
              <aside aria-label="Illustrative earnings comparison" className="flex flex-col gap-1.5 border-l-2 border-brand pl-4">
                <p className="text-xl leading-snug font-semibold tracking-tight text-brand">{proof.primary}</p>
                <p className="text-lg leading-snug font-semibold tracking-tight text-balance">{proof.secondary}</p>
                <p className="text-sm leading-snug text-pretty text-muted-foreground">{proof.footnote}</p>
              </aside>
            </div>
          }
        />
      </PanelFrame>
    </div>
  )
}

/**
 * Two full-height sections inside the one Economics screen. Moving between them
 * scrolls the panel's own vertical container; the deck's hash stays #economics.
 * The deck resets this scroll to the top whenever the panel is left or entered.
 */
export function EconomicsPanel() {
  const topRef = useRef<HTMLDivElement>(null)
  const lowerRef = useRef<HTMLDivElement>(null)
  const illustrationHeadingRef = useRef<HTMLHeadingElement>(null)

  const scrollTo = useCallback((section: 'top' | 'lower') => {
    const container = topRef.current?.closest('section')
    if (!container) return
    const top = section === 'top' ? 0 : (lowerRef.current?.offsetTop ?? 0)
    container.scrollTo({ top, behavior: prefersReducedMotion() ? 'instant' : 'smooth' })
    const target =
      section === 'top' ? document.getElementById(headingId('economics')) : illustrationHeadingRef.current
    target?.focus({ preventScroll: true })
  }, [])

  return (
    <>
      <EconomicsOverview ref={topRef} onViewIllustration={() => scrollTo('lower')} />
      <InlineCompensationIllustration
        ref={lowerRef}
        headingRef={illustrationHeadingRef}
        onBack={() => scrollTo('top')}
      />
    </>
  )
}
