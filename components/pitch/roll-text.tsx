import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * A label that rolls to a fresh copy of itself when its `group` parent is
 * hovered or focused. The second copy is decorative, so it is hidden from
 * assistive technology.
 */
export function RollText({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn('roll', className)}>
      <span>{children}</span>
      <span aria-hidden="true">{children}</span>
    </span>
  )
}
