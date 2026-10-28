import {
  Briefcase,
  Building2,
  ClipboardCheck,
  Coins,
  Hourglass,
  LayoutGrid,
  Library,
  ShieldCheck,
  SlidersHorizontal,
  Target,
  TrendingUp,
  User,
  UserCheck,
  Users,
  Wallet,
  Workflow,
  type LucideIcon,
} from 'lucide-react'
import type { IconKey } from '@/lib/pitch-content'
import { cn } from '@/lib/utils'

const ICONS: Record<IconKey, LucideIcon> = {
  income: Wallet,
  choice: LayoutGrid,
  admin: ClipboardCheck,
  focus: Target,
  brand: ShieldCheck,
  scale: Building2,
  flexibility: SlidersHorizontal,
  growth: TrendingUp,
  production: Briefcase,
  solo: User,
  shelf: Library,
  leadership: Users,
  process: Workflow,
  producer: UserCheck,
  earnings: Coins,
  longTerm: Hourglass,
}

export function ContentIcon({ icon, className }: { icon: IconKey; className?: string }) {
  const Icon = ICONS[icon]
  return <Icon className={cn('size-5', className)} strokeWidth={1.5} aria-hidden="true" />
}
