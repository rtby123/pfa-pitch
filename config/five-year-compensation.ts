/**
 * Preliminary five-year compensation comparison, transcribed from the
 * discussion material. Every figure the Economics graph shows comes from here;
 * the React components hold no numbers of their own.
 */

export type SeriesId = 'ncm' | 'ifa'

export type CompensationSeries = {
  id: SeriesId
  /** Visible name, used in the direct label, tooltip and text alternative. */
  label: string
  /** Annual producer compensation in SGD thousands, one per `years` entry. Rounded for display. */
  values: readonly number[]
}

export const years: readonly string[] = ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5']

/** Share of APE from PACS products, one per `years` entry. */
export const pacsMix: readonly number[] = [0.8, 0.83, 0.85, 0.88, 0.9]

export const newCareerModel: CompensationSeries = {
  id: 'ncm',
  label: 'The New Career Model',
  values: [89, 118, 137, 151, 164],
}

export const ifaBenchmark: CompensationSeries = {
  id: 'ifa',
  label: 'IFA benchmark',
  values: [76, 107, 117, 127, 148],
}

/**
 * Five-year totals as published in the source analysis. They are NOT the sum of
 * the rounded annual values above (those add to 659 and 575), so they are stored
 * rather than derived; footnote 5 discloses the difference.
 */
export const newCareerModelTotal = { label: 'S$659.4k', spoken: 'S$659,400' }
export const ifaBenchmarkTotal = { label: 'S$574.9k', spoken: 'S$574,900' }

/** 659.4 / 574.9 − 1 = 14.7%, presented as approximately 15%. */
export const totalUpliftLabel = '~15% higher over five years'

export const compensationSection = {
  status: 'PRELIMINARY — FOR DISCUSSION ONLY',
  eyebrow: 'Illustrative five-year compensation',
  headline: 'More value, built over time.',
  emphasis: 'built over time',
  supporting: 'The New Career Model compared with the average IFA benchmark.',
  chartTitle: 'Total producer compensation over time',
  unit: "in S$ '000s",
  pacsRowLabel: 'Share of APE from PACS products',
  totalLabel: 'Total illustrative compensation',
}

export const assumptions = {
  heading: 'Illustrative adviser scenario',
  items: [
    { label: 'Starting APE', value: 'S$250k' },
    { label: 'Annual APE growth', value: '5%' },
    { label: 'PACS mix', value: '80% to 90% over five years' },
    { label: 'Product mix', value: '70% ILP, 5% Par, 15% Protection, 10% Shield' },
  ],
} as const

export const footnotes: readonly string[] = [
  'The illustration assumes an ILP-focused product mix across all five years: 70% ILP, 5% Par, 15% Protection and 10% Shield.',
  'The illustration assumes a starting annual APE of S$250,000 and 5% annual APE growth over five years.',
  'The New Career Model illustration includes core commission for PACS and third-party products, volume-based bonus and long-term career benefits. The IFA benchmark includes producer-share production commission.',
  'IFA benchmark represents the average of three sampled IFA firms and may not reflect the compensation structure of every firm or adviser.',
  'Annual compensation labels are rounded for presentation. The five-year totals of S$659.4k and S$574.9k are taken from the source analysis and may not exactly equal the sum of the displayed rounded annual values.',
  'The graph displays PACS production increasing from 80% to 90%. A supporting source footnote references a different PACS range of 60% to 70%; the final PACS assumption must be confirmed before external use.',
  'All values are preliminary illustrations based on discussion material. Actual compensation may vary depending on eligibility, product mix, business quality, persistency and final programme terms. The illustration does not constitute a contractual offer or guarantee of compensation.',
  'Source: IFA compensation schemes, PFA compensation scheme and PwC analysis.',
]

export const formatThousands = (v: number) => `S$${v}k`
export const formatPercent = (r: number) => `${Math.round(r * 100)}%`
