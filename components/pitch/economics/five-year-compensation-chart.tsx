'use client'

import { useEffect, useRef, useState } from 'react'
import {
  compensationSection,
  formatPercent,
  formatThousands,
  ifaBenchmark,
  ifaBenchmarkTotal,
  newCareerModel,
  newCareerModelTotal,
  pacsMix,
  years,
} from '@/config/five-year-compensation'

const Y_MIN = 40
const Y_MAX = 185
const Y_TICKS = [50, 100, 150]

const RED = 'var(--chart-pilot)'
const GREY = 'var(--chart-ifa)'

/**
 * True while the target is on screen AND its panel is the active one, so the
 * chart draws when the reader actually arrives (not while the panel sits
 * mounted off-stage) and replays on every visit. Always true under reduced motion.
 */
export function useRevealed<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [revealed, setRevealed] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setRevealed(true)
      return
    }
    const panel = el.closest('section')
    let inView = false
    const update = () => setRevealed(inView && (!panel || panel.hasAttribute('data-active')))
    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting
        update()
      },
      { threshold: 0.3 },
    )
    io.observe(el)
    const mo = panel ? new MutationObserver(update) : null
    if (panel) mo!.observe(panel, { attributes: true, attributeFilter: ['data-active'] })
    return () => {
      io.disconnect()
      mo?.disconnect()
    }
  }, [])
  return { ref, revealed }
}

/** Shared with the deck's entrance: one sharp ease-in-out. */
const EASE = 'cubic-bezier(0.87, 0, 0.13, 1)'

/**
 * Drawn in real pixels at its measured width so type stays one size on every
 * screen and label density can respond to the space instead of shrinking.
 */
function useSize(reserveBelow: number) {
  const ref = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState<{ width: number; avail: number } | null>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const region = el.closest<HTMLElement>('[role="region"]')
    const measure = () => {
      const rect = el.getBoundingClientRect()
      // Height the screen can show once the region is snapped to the top of its scroller.
      let scroller: HTMLElement | null = el.parentElement
      while (scroller && !/(auto|scroll)/.test(getComputedStyle(scroller).overflowY)) scroller = scroller.parentElement
      const view = scroller?.getBoundingClientRect() ?? { top: 0, bottom: window.innerHeight, left: 0 }
      let viewBottom = Math.min(view.bottom, window.innerHeight)
      // A fixed strip (the disclaimer) can sit over the bottom of the scroller.
      let probe = document.elementFromPoint(view.left + 4, viewBottom - 2) as HTMLElement | null
      while (probe && probe !== document.body) {
        if (getComputedStyle(probe).position === 'fixed' && !scroller?.contains(probe)) {
          viewBottom = Math.min(viewBottom, probe.getBoundingClientRect().top)
          break
        }
        probe = probe.parentElement
      }
      const offset = region ? rect.top - region.getBoundingClientRect().top : 0
      setSize({ width: Math.round(rect.width), avail: viewBottom - view.top - offset - reserveBelow })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    if (region) ro.observe(region)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [reserveBelow])
  return { ref, width: size?.width ?? null, avail: size?.avail ?? 520 }
}

/** Pushes two vertically centred label blocks apart until they no longer overlap. */
function separate(a: number, b: number, ha: number, hb: number, gap = 8) {
  const need = (ha + hb) / 2 + gap
  const d = b - a
  if (d >= need) return [a, b]
  const shift = (need - d) / 2
  return [a - shift, b + shift]
}

export const CHART_SUMMARY = `Over five years, illustrative annual compensation under ${newCareerModel.label} rises from S$${newCareerModel.values[0]},000 in Year 1 to S$${newCareerModel.values[4]},000 in Year 5. The average ${ifaBenchmark.label}, the average of three sampled IFA firms, rises from S$${ifaBenchmark.values[0]},000 to S$${ifaBenchmark.values[4]},000. Source-provided five-year totals are ${newCareerModelTotal.spoken} for ${newCareerModel.label} and ${ifaBenchmarkTotal.spoken} for the ${ifaBenchmark.label}; ${newCareerModel.label} is approximately 15% higher.`

export function FiveYearCompensationChart({
  revealed,
  reserveBelow = 0,
}: {
  revealed: boolean
  /** Height of what must stay on screen under the chart (the scenario row), so the plot gives way to it. */
  reserveBelow?: number
}) {
  const { ref, width, avail } = useSize(reserveBelow)
  const [active, setActive] = useState<number | null>(null)

  const narrow = width !== null && width < 480
  const W = width ?? 640
  const H = Math.round(Math.max(240, Math.min(W * 0.66, avail, 520)))
  const M = { top: 24, right: narrow ? 92 : 136, bottom: 84, left: 44 }
  const plotW = W - M.left - M.right
  const plotH = H - M.top - M.bottom
  // Wide screens leave room left of Year 1 for the PACS row label beside its bubbles.
  const INSET = narrow ? 14 : 84
  const last = years.length - 1
  const step = (plotW - INSET * 2) / last

  const x = (i: number) => M.left + INSET + i * step
  const y = (v: number) => M.top + ((Y_MAX - v) / (Y_MAX - Y_MIN)) * plotH
  const path = (vs: readonly number[]) =>
    vs.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ')

  // Narrow screens keep the first and last values; every value stays available on tap/focus.
  const showValue = (i: number) => !narrow || i === 0 || i === last

  const ncmLines = ['The New', 'Career Model']
  const ifaLines = narrow ? ['IFA', 'benchmark'] : ['IFA benchmark']
  const LH = 16
  const [ncmCy, ifaCy] = separate(
    y(newCareerModel.values[last]),
    y(ifaBenchmark.values[last]),
    ncmLines.length * LH,
    ifaLines.length * LH,
  )
  const labelX = x(last) + 16

  // Leaving resets instantly (no transition) so the next visit replays from scratch.
  const fade = (delay: number, ms = 700, rise = 0) => ({
    opacity: revealed ? 1 : 0,
    transform: revealed || !rise ? 'none' : `translateY(${rise}px)`,
    transformBox: 'fill-box' as const,
    transition: revealed ? `opacity ${ms}ms ${EASE} ${delay}ms, transform ${ms}ms ${EASE} ${delay}ms` : 'none',
  })

  const TT_W = 200
  const ttX = active === null ? 0 : x(active) + 12 + TT_W > W - 4 ? x(active) - 12 - TT_W : x(active) + 12

  return (
    <figure aria-labelledby="five-year-chart-title" className="flex min-w-0 flex-col gap-2">
      <figcaption className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <span id="five-year-chart-title" className="text-base font-semibold tracking-tight">
          {compensationSection.chartTitle}
        </span>
  </figcaption>

      <div ref={ref} className="relative w-full" style={{ height: width === null ? 360 : H }}>
        {width !== null && (
          <svg
            width={W}
            height={H}
            viewBox={`0 0 ${W} ${H}`}
            className="block overflow-visible"
            role="img"
            aria-label={`${compensationSection.chartTitle}, ${compensationSection.unit}`}
            aria-describedby="five-year-chart-desc"
            onPointerLeave={() => setActive(null)}
          >
            <desc id="five-year-chart-desc">{CHART_SUMMARY}</desc>
  {/* Sits in the plot's top margin so the plot itself does not move. */}
  <text x={0} y={12} aria-hidden="true" className="fill-muted-foreground text-sm">
  {compensationSection.unit}
  </text>

            {/* Y grid and ticks */}
            {Y_TICKS.map((t) => (
              <g key={t}>
                <line x1={M.left} x2={M.left + plotW} y1={y(t)} y2={y(t)} stroke="var(--border)" strokeDasharray="2 4" />
                <text x={M.left - 10} y={y(t) + 4} fontSize={12} textAnchor="end" fill="var(--muted-foreground)">
                  {t}
                </text>
              </g>
            ))}
            <line x1={M.left} x2={M.left + plotW} y1={M.top + plotH} y2={M.top + plotH} stroke="var(--border)" />

            {/* Year axis with the PACS share beneath each year */}
            {years.map((label, i) => (
              <g key={label}>
                <text x={x(i)} y={M.top + plotH + 20} fontSize={13} fontWeight={600} textAnchor="middle" fill="var(--foreground)">
                  {label}
                </text>
                <rect
                  x={x(i) - 24}
                  y={M.top + plotH + 30}
                  width={48}
                  height={22}
                  rx={11}
                  fill="var(--muted)"
                  stroke="var(--border)"
                />
                <text x={x(i)} y={M.top + plotH + 45} fontSize={12} fontWeight={600} textAnchor="middle" fill="var(--foreground)">
                  {formatPercent(pacsMix[i])}
                </text>
              </g>
            ))}
            {narrow ? (
              <text
                x={(x(0) + x(last)) / 2}
                y={H - 8}
                fontSize={11}
                letterSpacing="0.08em"
                textAnchor="middle"
                fill="var(--muted-foreground)"
              >
                {'Share of APE from PACS'.toUpperCase()}
              </text>
            ) : (
              <text
                x={x(0) - 34}
                y={M.top + plotH + 41 - 12 + 4}
                fontSize={10}
                letterSpacing="0.06em"
                textAnchor="end"
                fill="var(--muted-foreground)"
              >
                {['Share of APE', 'from PACS', 'products'].map((line, k) => (
                  <tspan key={line} x={x(0) - 34} dy={k === 0 ? 0 : 12}>
                    {line.toUpperCase()}
                  </tspan>
                ))}
              </text>
            )}

            {/* IFA benchmark: thinner, dashed, hollow square markers. Fades in first. */}
            <g style={fade(300, 800)}>
              <path
                d={path(ifaBenchmark.values)}
                fill="none"
                stroke={GREY}
                strokeWidth={2}
                strokeDasharray="6 4"
                strokeLinejoin="round"
              />
              {ifaBenchmark.values.map((v, i) => (
                <rect
                  key={i}
                  x={x(i) - 4}
                  y={y(v) - 4}
                  width={8}
                  height={8}
                  fill="var(--background)"
                  stroke={GREY}
                  strokeWidth={2}
                />
              ))}
            </g>

            {/* The New Career Model: heavier, solid, filled circles. Draws in second. */}
            <path
              d={path(newCareerModel.values)}
              fill="none"
              stroke={RED}
              strokeWidth={4}
              strokeLinejoin="round"
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray={1}
              style={{
                strokeDashoffset: revealed ? 0 : 1,
                transition: revealed ? `stroke-dashoffset 1600ms ${EASE} 700ms` : 'none',
              }}
            />
            {/* Points pop in left to right as the line reaches them. */}
            {newCareerModel.values.map((v, i) => (
              <g key={i} style={fade(1100 + i * 180, 500, 8)}>
                <circle cx={x(i)} cy={y(v)} r={6} fill={RED} stroke="var(--background)" strokeWidth={2} />
              </g>
            ))}

            {/* Annual values: red above its point, grey below. Follow their points. */}
            <g aria-hidden="true">
              {years.map((_, i) =>
                showValue(i) ? (
                  <g key={i} style={fade(1300 + i * 180, 600, 10)}>
                    <text x={x(i)} y={y(newCareerModel.values[i]) - 14} fontSize={15} fontWeight={700} textAnchor="middle" fill={RED}>
                      {newCareerModel.values[i]}
                    </text>
                    <text x={x(i)} y={y(ifaBenchmark.values[i]) + 22} fontSize={13} fontWeight={500} textAnchor="middle" fill="var(--muted-foreground)">
                      {ifaBenchmark.values[i]}
                    </text>
                  </g>
                ) : null,
              )}
            </g>

            {/* Direct line labels, last: they name lines that are now drawn. */}
            <g aria-hidden="true" style={fade(2200, 700, 8)}>
              <text y={ncmCy - ((ncmLines.length - 1) * LH) / 2 + 5} fontSize={14} fontWeight={700} fill={RED}>
                {ncmLines.map((l, k) => (
                  <tspan key={l} x={labelX} dy={k === 0 ? 0 : LH}>
                    {l}
                  </tspan>
                ))}
              </text>
              <text y={ifaCy - ((ifaLines.length - 1) * LH) / 2 + 5} fontSize={13} fontWeight={500} fill="var(--muted-foreground)">
                {ifaLines.map((l, k) => (
                  <tspan key={l} x={labelX} dy={k === 0 ? 0 : LH}>
                    {l}
                  </tspan>
                ))}
              </text>
            </g>

            {active !== null && (
              <line x1={x(active)} x2={x(active)} y1={M.top} y2={M.top + plotH} stroke="var(--foreground)" strokeOpacity={0.2} />
            )}

            {/* Hover / focus / tap targets, one per year */}
            {years.map((label, i) => (
              <rect
                key={label}
                x={x(i) - step / 2}
                y={M.top}
                width={step}
                height={plotH}
                fill="transparent"
                tabIndex={0}
                role="img"
                aria-label={`${label}, ${formatPercent(pacsMix[i])} of APE from PACS products: ${newCareerModel.label} ${formatThousands(
                  newCareerModel.values[i],
                )}, ${ifaBenchmark.label} ${formatThousands(ifaBenchmark.values[i])}`}
                className="cursor-crosshair outline-none focus-visible:stroke-ring focus-visible:stroke-2"
                onPointerEnter={() => setActive(i)}
                onClick={() => setActive((a) => (a === i ? null : i))}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
              />
            ))}

            {active !== null && (
              <g pointerEvents="none" aria-hidden="true">
                <rect x={ttX} y={M.top + plotH - 76} width={TT_W} height={68} rx={4} fill="var(--background)" stroke="var(--border)" />
                <text x={ttX + 12} y={M.top + plotH - 56} fontSize={12} fontWeight={600} fill="var(--foreground)">
                  {years[active]} · {formatPercent(pacsMix[active])} PACS
                </text>
                <text x={ttX + 12} y={M.top + plotH - 36} fontSize={12} fontWeight={600} fill={RED}>
                  {newCareerModel.label}: {formatThousands(newCareerModel.values[active])}
                </text>
                <text x={ttX + 12} y={M.top + plotH - 18} fontSize={12} fill="var(--muted-foreground)">
                  {ifaBenchmark.label}: {formatThousands(ifaBenchmark.values[active])}
                </text>
              </g>
            )}
          </svg>
        )}
      </div>

      <table className="sr-only">
        <caption>
          {compensationSection.chartTitle}, {compensationSection.unit}
        </caption>
        <thead>
          <tr>
            <th scope="col">Year</th>
            <th scope="col">{compensationSection.pacsRowLabel}</th>
            <th scope="col">{newCareerModel.label}</th>
            <th scope="col">{ifaBenchmark.label}</th>
          </tr>
        </thead>
        <tbody>
          {years.map((label, i) => (
            <tr key={label}>
              <th scope="row">{label}</th>
              <td>{formatPercent(pacsMix[i])}</td>
              <td>{formatThousands(newCareerModel.values[i])}</td>
              <td>{formatThousands(ifaBenchmark.values[i])}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  )
}
