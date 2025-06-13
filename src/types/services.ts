import { LucideIcon } from 'lucide-react';

export interface ServiceDetails {
  features: string[];
  benefits: string[];
  useCase: string;
}

export interface Service {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
  featured?: boolean;
  details: ServiceDetails;
}