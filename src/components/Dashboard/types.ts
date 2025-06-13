// Common types used across dashboard components
export type GradientStyle = 
  | 'from-blue-500 to-indigo-500'
  | 'from-blue-400 to-indigo-400'
  | 'from-purple-500 to-pink-500'
  | 'from-purple-400 to-pink-400'
  | 'from-amber-500 to-orange-500'
  | 'from-amber-400 to-orange-400';

export type Status = 'Active' | 'Inactive';

export interface Metric {
  label: string;
  value: string;
  change: string;
  icon: LucideIcon;
  gradient: GradientStyle;
}

export interface AgentMetrics {
  [key: string]: string;
}