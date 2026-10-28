/*
 * All editable pitch copy lives here. Navigation order, hashes and chapter
 * titles live in `lib/panels.ts`; the five-year graph's copy and figures live in
 * `config/five-year-compensation.ts`. This file holds only what each panel says.
 *
 * Copy limits (every main screen must fit without scrolling):
 * eyebrow one short line · headline 5–10 words · supporting copy ≤ 2 short
 * sentences · point title 2–5 words · point body one short sentence ·
 * at most four points per screen.
 *
 * Each screen has one job and must not restate another's:
 * Opportunity = why · Career model = the four pillars, named · Economics =
 * pillar 01 only · Support = pillars 02–04 · Next step = the way forward.
 */
import type { ChapterId } from './panels'

export type IconKey =
  | 'income'
  | 'choice'
  | 'admin'
  | 'focus'
  | 'brand'
  | 'scale'
  | 'flexibility'
  | 'growth'
  | 'production'
  | 'solo'
  | 'shelf'
  | 'leadership'
  | 'process'
  | 'producer'
  | 'earnings'
  | 'longTerm'

/** A right-hand point. With `icon` it shows the icon; without, it is numbered by position. */
export interface Point {
  title: string
  body: string
  icon?: IconKey
}

export const DISCLAIMER =
  'Illustrative concept for discussion. Features, economics and terms are subject to validation and approval.'

export const cover = {
  // The artwork carries the visible text; these give it to assistive technology.
  headline: 'Take Your Advisory Career Further',
  imageAlt:
    'Prudential Financial Advisers. Take Your Advisory Career Further. An exclusive opportunity to serve your clients better, grow your business and build lasting career value.',
  beginLabel: 'Begin',
}

export const agenda = {
  eyebrow: 'Agenda',
  headline: 'Your expertise. Our scale. A new financial advisory model.',
  // Red phrases: one per headline, and only on the headlines that carry one.
  emphasis: 'A new financial advisory model.',
  body: 'A new career opportunity for successful advisers ready to grow their business and focus on clients.',
  startLabel: 'Start',
  // Entry order and destinations come from CHAPTERS; only the entry titles are here.
  entryTitles: {
    opportunity: 'We’re building something different',
    'career-proposition': 'Here’s what it means for you',
    'next-step': 'Explore joining us',
  } satisfies Record<ChapterId, string>,
  entryEmphasis: {
    opportunity: 'something different',
    'career-proposition': 'for you',
    'next-step': 'joining us',
  } satisfies Record<ChapterId, string>,
}

/**
 * Facts quoted in the copy. Edit here and every sentence that uses them follows.
 * No brand age or adviser headcount is stated until an approved figure is supplied:
 * replace `network` with e.g. 'An approximately N-strong FA network' once approved.
 */
export const PFA_FACTS = {
  network: 'A substantial FA network',
}

export const opportunity = {
  subsection: 'Why we’re building something different',
  headline: 'We listened, and built around what matters.',
  emphasis: 'what matters',
  statement:
    'Advisers want sustainable earnings, broader ways to serve clients and less time on administration. Clients want trusted advice, clear guidance and solutions that grow with them.',
  closing: 'The New Career Model is designed to deliver both.',
  forwardCue: 'See the Career Model',
  pointsHeading: 'Why PFA can deliver',
  points: [
    {
      title: 'Trusted foundation',
      body: 'The strength and heritage of Prudential in Singapore.',
      icon: 'brand',
    },
    {
      title: 'Scale and expertise',
      body: `${PFA_FACTS.network} backed by Prudential and Eastspring Investments.`,
      icon: 'scale',
    },
    {
      title: 'Broader solutions',
      body: 'A curated range of Prudential and selected partner products.',
      icon: 'shelf',
    },
    {
      title: 'Built for advisers',
      body: 'Greater flexibility, smarter tools and practical support.',
      icon: 'flexibility',
    },
  ] satisfies Point[],
}

export const careerModel = {
  subsection: 'The New Career Model',
  headline: 'Built around your clients, your production and your growth.',
  emphasis: 'your growth',
  statement:
    'A dedicated model for high-performing advisers who want to grow through their own clients and production.',
  // Exactly four pillars, equal weight. Numbered, so a later step can make each one a link.
  pillars: [
    {
      title: 'Focused on personal production',
      body: 'Build your business around the clients and production you own.',
    },
    {
      title: 'Broader client solutions',
      body: 'Serve more needs across protection, wealth and investments.',
    },
    {
      title: 'AI-enabled platform',
      body: 'Plan, compare, submit and service with less friction.',
    },
    {
      title: 'Experienced leadership',
      body: 'Get practical support from leaders who understand the advisory journey.',
    },
  ] satisfies Point[],
}

export const economics = {
  // Expands pillar 01 only; pillars 02–04 belong to the Support screen.
  subsection: 'Focused on personal production',
  headline: 'More of the value you create comes back to you.',
  emphasis: 'comes back to you',
  statement: 'Earn through core commissions and volume bonuses across Prudential and selected partner products.',
  pointsHeading: 'How value builds',
  points: [
    {
      title: 'Core commissions',
      body: 'Product-level payout from Prudential and partner products.',
      icon: 'earnings',
    },
    {
      title: 'Volume bonus',
      body: 'Additional upside as qualifying production grows.',
      icon: 'growth',
    },
    {
      title: 'Long-term value',
      body: 'Rewards that recognise consistency and tenure.',
      icon: 'longTerm',
    },
  ] satisfies Point[],
  proof: {
    primary: 'Competitive from Year 1',
    secondary: '~15% higher over five years versus the average IFA benchmark*',
    footnote:
      '*Illustrative five-year scenario. IFA benchmark represents the average of three sampled IFA firms. See the graph notes for assumptions.',
  },
  illustrationLabel: 'View illustrative compensation',
}

export const support = {
  // Consolidates pillars 02–04. No economics here: that is the previous screen.
  subsection: 'Built to help you do more',
  headline: 'More ways to serve clients. More support to grow.',
  emphasis: 'More support to grow.',
  statement: 'Broader solutions, smarter tools and experienced leadership—brought together in one model.',
  pillars: [
    {
      title: 'Broader client solutions',
      body: 'Prudential protection, Eastspring investment expertise and curated partner products.',
      icon: 'shelf',
    },
    {
      title: 'AI-enabled platform',
      body: 'Integrated tools for planning, comparison, submission and servicing.',
      icon: 'process',
    },
    {
      title: 'Experienced leadership',
      body: 'Salaried Directors who bring practical experience, access and long-term support.',
      icon: 'leadership',
    },
  ] satisfies Point[],
}

export const nextStep = {
  subsection: 'Your next chapter',
  headline: 'See whether The New Career Model fits your ambitions.',
  emphasis: 'fits your ambitions.',
  body: 'Explore how the model could support your clients, your production and your long-term goals.',
  steps: [
    { title: 'Understand the opportunity', body: 'See how the model works and what it offers.' },
    { title: 'Explore the fit', body: 'Consider how it aligns with your business and clients.' },
    { title: 'Continue the conversation', body: 'Discuss your questions and possible next steps with PFA.' },
  ] satisfies Point[],
  continueLabel: 'Continue the conversation',
  /**
   * No contact destination is configured yet. Set a URL (e.g. 'mailto:…' or a
   * booking page) and the action becomes a link; while null it renders as a
   * marked, non-interactive placeholder — never a form.
   */
  continueHref: null as string | null,
  continuePendingNote: 'Contact route to be confirmed',
  returnLabel: 'Return to agenda',
}
