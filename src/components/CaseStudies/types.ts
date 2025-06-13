import { LucideIcon } from 'lucide-react';

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
 * Represents a case study with its relevant details.
 */
export interface CaseStudy {
  /** Title of the case study. */
  readonly title: string;
  /** The client for whom the solution was developed. */
  readonly client: string;
  /** The industry sector relevant to the case study. */
  readonly industry: string;
  /** The platform where the solution was deployed. */
  readonly deployedPlatform: string;
  /** Icon component representing the case study. */
  readonly icon: LucideIcon;
  /** Tailwind CSS gradient classes used for styling the case study. */
  readonly gradient: string;
  /** Key performance metrics for the case study. */
  readonly metrics: Readonly<Record<string, string>>;
  /** A brief description of the case study. */
  readonly description: string;
  /** The solution provided in the case study. */
  readonly solution: string;
  /** A series of implementation steps for the case study. */
  readonly implementation: readonly Implementation[];
  /** URL or path to an image representing the case study. */
  readonly image: string;
}
