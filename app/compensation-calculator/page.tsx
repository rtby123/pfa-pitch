import { redirect } from 'next/navigation'

/** The illustration now lives inside the Economics panel; old links land there. */
export default function CompensationCalculatorPage() {
  redirect('/#economics')
}
