import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { headingId, type PanelId } from '@/lib/panels'
import { cover } from '@/lib/pitch-content'

export function CoverPanel({ onNavigate }: { onNavigate: (id: PanelId) => void }) {
  return (
    <div className="relative h-full w-full bg-canvas">
      <h2 id={headingId('cover')} tabIndex={-1} className="sr-only">
        {cover.headline}
      </h2>
      {/* `contain` keeps the logo, headline and face whole; 4:3 screens get warm-white margins instead of a crop. */}
      <Image
        src="/images/pfa-cover.png"
        alt={cover.imageAlt}
        fill
        priority
        sizes="100vw"
        className="object-contain"
      />
      <button
        type="button"
        onClick={() => onNavigate('agenda')}
        className="cover-begin absolute inline-flex min-h-12 items-center gap-2 rounded-sm border border-foreground/15 bg-background/95 px-5 text-base font-medium text-foreground shadow-sm transition-colors hover:border-brand hover:text-brand"
      >
        {cover.beginLabel}
        <ArrowRight className="size-5" aria-hidden="true" />
      </button>
    </div>
  )
}
