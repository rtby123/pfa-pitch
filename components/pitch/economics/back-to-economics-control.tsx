import { ArrowUp } from 'lucide-react'

/** Sticks to the top of the Economics scroller while the lower section is in view. */
export function BackToEconomicsControl({ onBack }: { onBack: () => void }) {
  return (
    <div className="sticky top-0 z-10 border-b border-border bg-background">
      <div className="mx-auto w-full max-w-6xl px-6 md:px-10 lg:px-14">
        <button
          type="button"
          onClick={onBack}
          className="group inline-flex min-h-11 items-center gap-2 text-sm font-medium transition-colors hover:text-brand"
        >
          <ArrowUp className="size-4 transition-transform group-hover:-translate-y-0.5" aria-hidden="true" />
          Back to economics
        </button>
      </div>
    </div>
  )
}
