'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
  PANELS,
  PANEL_COUNT,
  REGISTER_HEADING_ID,
  canonicalHash,
  headingId,
  indexOfHash,
  panelIndex,
  type PanelId,
} from '@/lib/panels'
import { PitchHeader } from './pitch-header'
import { DeckControls } from './deck-controls'
import { PitchPanel } from './pitch-panel'
import { CoverPanel } from './cover-panel'
import { AgendaPanel } from './agenda-panel'
import { CareerModelPanel, NextStepPanel, OpportunityPanel, SupportPanel } from './content-panels'
import { EconomicsPanel } from './economics/economics-panel'
import { DISCLAIMER } from '@/lib/pitch-content'

// Native scroll keeps emitting events through a smooth scroll and snap, so a
// short quiet period reliably means "movement has finished" on browsers
// without `scrollend` (older iPadOS Safari).
const SETTLE_MS = 120
// If an explicit move is interrupted by a swipe, stop treating it as in flight.
const NAV_TIMEOUT_MS = 1600

const INTERACTIVE_SELECTOR = [
  'input',
  'textarea',
  'select',
  'button',
  'a[href]',
  'summary',
  '[contenteditable]:not([contenteditable="false"])',
  '[role="button"]',
  '[role="link"]',
  '[role="checkbox"]',
  '[role="radio"]',
  '[role="tab"]',
  '[role="textbox"]',
  '[role="combobox"]',
  '[role="slider"]',
].join(',')

function isInteractiveTarget(target: EventTarget | null) {
  // Anything inside a form belongs to the form, never to deck navigation.
  return target instanceof Element && target.closest(`${INTERACTIVE_SELECTOR},form`) !== null
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

const clampIndex = (i: number) => Math.min(PANEL_COUNT - 1, Math.max(0, i))

/** Long enough for the horizontal slide to carry the panel out of view. */
const LEAVE_RESET_MS = 900

function resetStackedPanel(id: PanelId) {
  if (id !== 'economics') return
  const el = document.getElementById(`panel-${id}`)
  if (el && el.scrollTop !== 0) el.scrollTo({ top: 0, behavior: 'instant' })
}

type HistoryMode = 'push' | 'none'

export function PitchDeck() {
  const scrollerRef = useRef<HTMLElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const activeRef = useRef(0)
  const navTargetRef = useRef<number | null>(null)
  // Id of the element to focus once an explicit move finishes, if any.
  const focusOnArrivalRef = useRef<string | null>(null)
  const settleTimerRef = useRef<number | undefined>(undefined)
  const navTimerRef = useRef<number | undefined>(undefined)

  const setActive = useCallback((i: number) => {
    activeRef.current = i
    setActiveIndex(i)
  }, [])

  const indexFromScroll = useCallback(() => {
    const el = scrollerRef.current
    if (!el || el.clientWidth === 0) return activeRef.current
    return clampIndex(Math.round(el.scrollLeft / el.clientWidth))
  }, [])

  const focusElement = useCallback((id: string) => {
    // Wait a frame so the panel's `inert` has been lifted by the render.
    requestAnimationFrame(() => {
      document.getElementById(id)?.focus({ preventScroll: id !== REGISTER_HEADING_ID })
    })
  }, [])

  const goTo = useCallback(
    (
      index: number,
      { history, focus }: { history: HistoryMode; focus: boolean | string },
    ) => {
      const el = scrollerRef.current
      if (!el) return
      const target = clampIndex(index)
      const panel = PANELS[target]
      // `true` means the panel heading; a string names a specific element.
      const focusId = focus === true ? headingId(panel.id) : focus || null

      // Arriving at Economics from elsewhere always opens its top section. The
      // panel is off-screen at this moment, so the jump is never seen.
      if (target !== activeRef.current) resetStackedPanel(panel.id)

      if (history === 'push' && window.location.hash !== panel.hash) {
        window.history.pushState({ panel: panel.id }, '', panel.hash)
      }
      setActive(target)

      const destination = target * el.clientWidth
      if (Math.abs(el.scrollLeft - destination) < 2) {
        navTargetRef.current = null
        if (focusId) focusElement(focusId)
        return
      }

      navTargetRef.current = target
      focusOnArrivalRef.current = focusId
      window.clearTimeout(navTimerRef.current)
      navTimerRef.current = window.setTimeout(() => {
        navTargetRef.current = null
      }, NAV_TIMEOUT_MS)

      el.scrollTo({ left: destination, behavior: prefersReducedMotion() ? 'instant' : 'smooth' })
    },
    [focusElement, setActive],
  )

  const navigateTo = useCallback(
    (id: PanelId) => goTo(panelIndex(id), { history: 'push', focus: true }),
    [goTo],
  )

  const registerInterest = useCallback(
    () => goTo(panelIndex('next-step'), { history: 'push', focus: true }),
    [goTo],
  )

  // Open directly on the panel named in the URL, before first paint.
  useLayoutEffect(() => {
    const el = scrollerRef.current
    const hash = window.location.hash
    const i = indexOfHash(hash)
    if (el && i > 0) {
      el.scrollLeft = i * el.clientWidth
      setActive(i)
    }
  }, [setActive])

  // Track position during native swipes/trackpad movement, and reconcile the
  // URL once movement settles (replace, never push, to avoid history spam).
  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return

    const settle = () => {
      window.clearTimeout(settleTimerRef.current)
      const i = indexFromScroll()
      const target = navTargetRef.current
      navTargetRef.current = null
      window.clearTimeout(navTimerRef.current)
      if (i !== activeRef.current) setActive(i)

      if (target !== null && i === target) {
        if (focusOnArrivalRef.current) focusElement(focusOnArrivalRef.current)
        focusOnArrivalRef.current = null
        return
      }
      focusOnArrivalRef.current = null
      const hash = PANELS[i].hash
      if (window.location.hash !== hash) {
        window.history.replaceState(window.history.state, '', hash)
      }
    }

    const onScroll = () => {
      if (navTargetRef.current === null) {
        const i = indexFromScroll()
        if (i !== activeRef.current) setActive(i)
      }
      window.clearTimeout(settleTimerRef.current)
      settleTimerRef.current = window.setTimeout(settle, SETTLE_MS)
    }

    el.addEventListener('scroll', onScroll, { passive: true })
    el.addEventListener('scrollend', settle)
    return () => {
      el.removeEventListener('scroll', onScroll)
      el.removeEventListener('scrollend', settle)
      window.clearTimeout(settleTimerRef.current)
      window.clearTimeout(navTimerRef.current)
    }
  }, [focusElement, indexFromScroll, setActive])

  // Keep the active panel aligned when the viewport width changes (rotation).
  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    let width = el.clientWidth
    const observer = new ResizeObserver(() => {
      if (el.clientWidth === width) return
      width = el.clientWidth
      const i = navTargetRef.current ?? activeRef.current
      el.scrollTo({ left: i * width, behavior: 'instant' })
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // A swipe back into Economics never passes through `goTo`, so once the panel
  // has slid out of view its internal scroll is returned to the top as well.
  useEffect(() => {
    if (PANELS[activeIndex].id === 'economics') return
    const t = window.setTimeout(() => resetStackedPanel('economics'), LEAVE_RESET_MS)
    return () => window.clearTimeout(t)
  }, [activeIndex])

  // Browser Back/Forward and hand-edited hashes.
  useEffect(() => {
    const onPopState = () => {
      const i = indexOfHash(window.location.hash)
      goTo(i === -1 ? 0 : i, { history: 'none', focus: false })
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [goTo])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return
      if (isInteractiveTarget(e.target)) return

      let next: number
      switch (e.key) {
        case 'ArrowRight':
          next = activeRef.current + 1
          break
        case 'ArrowLeft':
          next = activeRef.current - 1
          break
        case 'Home':
          next = 0
          break
        case 'End':
          next = PANEL_COUNT - 1
          break
        default:
          return
      }
      e.preventDefault()
      if (next < 0 || next >= PANEL_COUNT || next === activeRef.current) return
      goTo(next, { history: 'push', focus: true })
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [goTo])

  // An old `#overview` link opens the agenda and the address bar is corrected in place.
  // This runs after hydration on a timer: the Next router re-applies the initial URL while
  // hydrating, which undid a correction made any earlier.
  useEffect(() => {
    const hash = window.location.hash
    if (!hash || canonicalHash(hash) === hash) return
    const t = window.setTimeout(() => {
      if (window.location.hash === hash) {
        window.history.replaceState(window.history.state, '', canonicalHash(hash))
      }
    }, 0)
    return () => window.clearTimeout(t)
  }, [])

  const active = PANELS[activeIndex]
  // The cover is the artwork alone: no header, tabs, disclaimer or bottom bar over it.
  const onCover = active.id === 'cover'

  return (
    <div className="deck-shell flex h-dvh flex-col overflow-hidden bg-background text-foreground">
      <h1 className="sr-only">Prudential Financial Advisors — Experienced Adviser Opportunity</h1>
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {`Panel ${activeIndex + 1} of ${PANEL_COUNT}: ${active.title}`}
      </p>

      {!onCover && (
        <PitchHeader activeIndex={activeIndex} onNavigate={navigateTo} onRegister={registerInterest} />
      )}

      <main
        ref={scrollerRef}
        aria-label="Pitch presentation"
        className="deck-scroller no-scrollbar flex min-h-0 flex-1"
      >
        {PANELS.map((panel, i) => (
          <PitchPanel
            key={panel.id}
            panel={panel}
            index={i}
            active={i === activeIndex}
            layout={panel.id === 'cover' ? 'bleed' : panel.id === 'economics' ? 'stack' : 'frame'}
          >
            {panel.id === 'cover' && <CoverPanel onNavigate={navigateTo} />}
            {panel.id === 'agenda' && <AgendaPanel onNavigate={navigateTo} />}
            {panel.id === 'opportunity' && <OpportunityPanel onNavigate={navigateTo} />}
            {panel.id === 'career-model' && <CareerModelPanel />}
            {panel.id === 'economics' && <EconomicsPanel />}
            {panel.id === 'support-solutions' && <SupportPanel />}
            {panel.id === 'next-step' && (
              <NextStepPanel onNavigate={navigateTo} />
            )}
          </PitchPanel>
        ))}
      </main>

      {!onCover && (
        <>
          <p className="deck-disclaimer shrink-0 border-t border-border bg-ivory py-1.5 text-xs leading-snug text-muted-foreground">
            {DISCLAIMER}
          </p>
          <DeckControls activeIndex={activeIndex} onNavigate={navigateTo} />
        </>
      )}
    </div>
  )
}
