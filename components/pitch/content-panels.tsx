import type { ReactNode } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import type { PanelId } from '@/lib/panels'
import { careerModel, nextStep, opportunity, support, type Point } from '@/lib/pitch-content'
import { ContentIcon } from './content-icon'
import { PanelHeading } from './panel-heading'

type Navigate = (id: PanelId) => void

/** One slide: message on the left, supporting points on the right (stacked on portrait). */
export function Slide({ message, points }: { message: ReactNode; points: ReactNode }) {
  return (
    <div className="deck-gap grid grid-cols-1 md:landscape:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:landscape:items-center md:landscape:gap-x-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-x-16">
      <div className="deck-message deck-gap flex flex-col">{message}</div>
      <div className="deck-after min-w-0">{points}</div>
    </div>
  )
}

/**
 * Right-hand points. A point with an icon shows it; a point without one is
 * numbered by position (the Career Model's pillars, the next steps).
 */
export function PointList({ points, heading }: { points: Point[]; heading?: string }) {
  const list = (
    <ul className="deck-glass flex flex-col px-5">
      {points.map((point, i) => (
        <li
          key={point.title}
          className="grid grid-cols-[2.5rem_minmax(0,1fr)] items-start gap-x-4 border-t border-border py-[clamp(0.5rem,1.5dvh,1rem)] first:border-t-0 [@media(max-height:600px)]:py-2"
        >
          {point.icon ? (
            <span className="deck-icon-disc">
              <ContentIcon icon={point.icon} className="size-5" />
            </span>
          ) : (
            <span
              aria-hidden="true"
              className="text-3xl leading-none font-light tracking-tight text-brand tabular-nums"
            >
              {String(i + 1).padStart(2, '0')}
            </span>
          )}
          <div className="flex flex-col gap-0.5">
            <h3 className="text-xl leading-snug font-semibold tracking-tight">{point.title}</h3>
            <p className="text-base leading-snug text-pretty text-muted-foreground">{point.body}</p>
          </div>
        </li>
      ))}
    </ul>
  )
  if (!heading) return list
  return (
    <div className="flex flex-col gap-3">
      <p className="deck-label text-muted-foreground">{heading}</p>
      {list}
    </div>
  )
}

const forwardLinkClass =
  'group inline-flex min-h-11 items-center gap-2 self-start text-base font-medium transition-colors hover:text-brand'

export function OpportunityPanel({ onNavigate }: { onNavigate: Navigate }) {
  return (
    <Slide
      message={
        <>
          <PanelHeading
            id="opportunity"
            subsection={opportunity.subsection}
            headline={opportunity.headline}
            emphasis={opportunity.emphasis}
            statement={opportunity.statement}
          />
          <p className="max-w-2xl border-l-2 border-brand pl-4 text-xl leading-snug font-semibold tracking-tight text-balance">
            {opportunity.closing}
          </p>
          <button type="button" onClick={() => onNavigate('career-model')} className={forwardLinkClass}>
            {opportunity.forwardCue}
            <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </button>
        </>
      }
      points={<PointList heading={opportunity.pointsHeading} points={opportunity.points} />}
    />
  )
}

export function CareerModelPanel() {
  return (
    <Slide
      message={
        <PanelHeading
          id="career-model"
          subsection={careerModel.subsection}
          headline={careerModel.headline}
          emphasis={careerModel.emphasis}
          statement={careerModel.statement}
        />
      }
      points={<PointList points={careerModel.pillars} />}
    />
  )
}

const GROUP_LOGOS = [{ src: '/logos/eastspring.png', alt: 'Eastspring Investments' }]
const PARTNER_LOGOS = [
  { src: '/logos/singlife.png', alt: 'Singlife' },
  { src: '/logos/ntuc-income.png', alt: 'NTUC Income' },
]

function LogoGroup({ label, logos }: { label: string; logos: { src: string; alt: string }[] }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="deck-label text-muted-foreground">{label}</span>
      <ul className="flex flex-wrap items-center gap-x-6 gap-y-3">
        {logos.map((logo) => (
          <li key={logo.src}>
            {/* Logos ship on white; multiply lets them sit on the warm page ground. */}
            <img src={logo.src} alt={logo.alt} className="h-8 w-auto mix-blend-multiply md:h-9" />
          </li>
        ))}
      </ul>
    </div>
  )
}

function SolutionPartners() {
  return (
    <div className="flex flex-wrap gap-x-10 gap-y-4 border-t border-border pt-5">
      <LogoGroup label="Prudential Group" logos={GROUP_LOGOS} />
      <LogoGroup label="Curated partners" logos={PARTNER_LOGOS} />
    </div>
  )
}

export function SupportPanel() {
  return (
    <Slide
      message={
        <>
          <PanelHeading
            id="support-solutions"
            subsection={support.subsection}
            headline={support.headline}
            emphasis={support.emphasis}
            statement={support.statement}
          />
          <SolutionPartners />
        </>
      }
      points={<PointList points={support.pillars} />}
    />
  )
}

function ContinueAction() {
  const content = (
    <>
      {nextStep.continueLabel}
      <ArrowRight className="size-5" aria-hidden="true" />
    </>
  )
  if (nextStep.continueHref) {
    return (
      <a
        href={nextStep.continueHref}
        className="inline-flex min-h-11 items-center gap-2 self-start rounded-md bg-brand px-5 text-base font-semibold text-brand-foreground transition-colors hover:bg-brand/90"
      >
        {content}
      </a>
    )
  }
  // No destination configured: a marked placeholder, not a control that pretends to do something.
  return (
    <div className="flex flex-col gap-1.5 self-start">
      <span
        aria-disabled="true"
        className="inline-flex min-h-11 cursor-not-allowed items-center gap-2 rounded-md border border-dashed border-brand/50 px-5 text-base font-semibold text-brand"
      >
        {content}
      </span>
      <span className="text-sm text-muted-foreground">{nextStep.continuePendingNote}</span>
    </div>
  )
}

export function NextStepPanel({ onNavigate }: { onNavigate: Navigate }) {
  return (
    <Slide
      message={
        <>
          <PanelHeading
            id="next-step"
            subsection={nextStep.subsection}
            headline={nextStep.headline}
            emphasis={nextStep.emphasis}
            statement={nextStep.body}
          />
          <div className="flex flex-wrap items-start gap-x-6 gap-y-3">
            <ContinueAction />
            <button type="button" onClick={() => onNavigate('agenda')} className={forwardLinkClass}>
              <ArrowLeft className="size-5 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
              {nextStep.returnLabel}
            </button>
          </div>
        </>
      }
      points={<PointList points={nextStep.steps} />}
    />
  )
}
