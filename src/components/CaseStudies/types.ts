import { LucideIcon } from 'lucide-react';

/**
 * Image tone. The 2026 system is monochrome everywhere except photographic
 * surfaces, which are graded with one of four tones (light → deep).
 */
export type Tone = 'sand' | 'ember' | 'ocean' | 'moss';

/**
 * Represents a single implementation step for a case study.
 */
export interface Implementation {
  /** Title of the implementation step. */
  readonly title: string;
  /** List of detailed actions or insights for this step. */
  readonly details: readonly string[];
}

/**
 * A named attribution for a client quote.
 */
export interface CaseStudyQuote {
  readonly text: string;
  readonly name: string;
  readonly role: string;
}

/**
 * Represents a case study with its relevant details.
 *
 * Fields below the divider are part of the 2026 case-study anatomy but are not
 * yet supplied for every study. They are optional on purpose: the template
 * hides the section rather than inventing content, so nothing unverified can
 * reach production.
 */
export interface CaseStudy {
  /** URL segment for this study's page: /case-studies/<slug>. Must match an
   *  entry in scripts/routes.mjs so the page is prerendered and sitemapped. */
  readonly slug: string;
  /** Title of the case study. */
  readonly title: string;
  /** `id` of the service in src/data/services.ts this work belongs to. */
  readonly service: string;
  /** The client for whom the solution was developed. */
  readonly client: string;
  /** The industry sector relevant to the case study. */
  readonly industry: string;
  /** The platform where the solution was deployed. */
  readonly deployedPlatform: string;
  /** Icon component representing the case study. */
  readonly icon?: LucideIcon;
  /** Image tone used to grade this study's photographic surfaces. */
  readonly tone: Tone;
  /** Measured outcomes only. `source` says who measured it and over what
   *  period; it renders under the number. No source, no metric. */
  readonly metrics?: ReadonlyArray<{ readonly label: string; readonly value: string; readonly source: string }>;
  /** A brief description of the case study. */
  readonly description: string;
  /** The solution provided in the case study. */
  readonly solution: string;
  /** A series of implementation steps for the case study. */
  readonly implementation: readonly Implementation[];
  /** A real screen of the system, when one may be shown. */
  readonly image?: string;

  /* ── Optional: rendered only when supplied ─────────────────────────── */

  /** The "before" state, set as the Problem section heading. */
  readonly before?: string;
  readonly after?: string;
  /** Narrative of what was wrong before the build. */
  readonly problem?: string;
  /** Concrete shipped items, rendered as a checked list. */
  readonly delivered?: readonly string[];
  /** Tools and stack, rendered as chips. */
  readonly stack?: readonly string[];
  /** Client quote with attribution. */
  readonly quote?: CaseStudyQuote;
  /** Public URL of the live system. */
  readonly live?: string;
  /** How long the build took, e.g. "4 months". */
  readonly timeframe?: string;
  /** Year delivered. */
  readonly year?: string;
}
