import {
  MessageSquareText,
  Mic,
  LayoutDashboard,
  Code2,
  Mail,
  MapPin,
  Phone,
  LucideIcon,
} from 'lucide-react';
import { Facebook, Instagram, Linkedin, XBrand, type BrandIcon } from '../../icons/brand-icons';

export interface NavItem {
  label: string;
  href: string;
}

export interface SolutionItem {
  label: string;
  icon: LucideIcon;
  href: string;
}

export interface ContactItem {
  icon: LucideIcon;
  text: string;
  href: string;
}

export interface SocialItem {
  icon: BrandIcon;
  href: string;
  label: string;
}

export const navigation: NavItem[] = [
  { label: 'Home', href: '/#home' },
  { label: 'Services', href: '/services' },
  { label: 'Case Studies', href: '/case-studies' },
  { label: 'About', href: '/about' },
  { label: 'Q&A', href: '/#faq' },
];

export const solutions: SolutionItem[] = [
  { label: 'AI Voice Agents', icon: Mic, href: '/services/ai-voice-agents' },
  { label: 'AI Chat Agents', icon: MessageSquareText, href: '/services/ai-chat-agents' },
  { label: 'CRM Development', icon: LayoutDashboard, href: '/services/crm-development' },
  { label: 'Custom SaaS', icon: Code2, href: '/services/custom-saas-solutions' },
];

export const contact: ContactItem[] = [
  { icon: MapPin, text: 'Tel Aviv, Israel', href: 'https://maps.google.com' },
  { icon: Mail, text: 'yoni.insell@twosteps.ai', href: 'mailto:yoni.insell@twosteps.ai' },
  { icon: Phone, text: '+972 54 4831148', href: 'tel:+972544831148' },
];

export const social: SocialItem[] = [
  { icon: Facebook, href: 'https://www.facebook.com/twostepsai', label: 'Facebook' },
  { icon: XBrand, href: 'https://x.com/twostepsai', label: 'X (Twitter)' },
  { icon: Linkedin, href: 'https://www.linkedin.com/company/two-steps-ai/', label: 'LinkedIn' },
  { icon: Instagram, href: 'https://www.instagram.com/twostepsai', label: 'Instagram' },
];

export const LEGAL_TYPES = ['privacy', 'terms', 'cookies'] as const;

export function getLegalLabel(type: (typeof LEGAL_TYPES)[number]) {
  return type === 'terms' ? 'Terms of Service' : `${type} Policy`;
}
