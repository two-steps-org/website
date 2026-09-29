import React, { type MouseEvent } from 'react';
import { ArrowRight, LucideIcon } from 'lucide-react';
import clsx from 'clsx';
import Logo from '../../Logo';
import CollapsibleSection from './CollapsibleSection';
import {
  contact,
  getLegalLabel,
  LEGAL_TYPES,
  navigation,
  social,
  solutions,
  type ContactItem,
  type NavItem,
  type SocialItem,
  type SolutionItem,
} from './footerData';
import { hapticFeedback } from '../../../utils/mobile/hapticFeedback';
import { useBookCall } from '../../BookCall/useBookCall';

const IconBox = ({ icon: Icon, className }: { icon: LucideIcon; className?: string }) => (
  <div
    className={clsx(
      'w-10 h-10 rounded-nested border border-line-strong bg-surface-2 shrink-0 flex items-center justify-center',
      'transition-colors duration-300 group-hover:bg-ink/10',
      className,
    )}
  >
    <Icon className="w-5 h-5 text-ink" />
  </div>
);

export function FooterBrandColumn() {
  const { open } = useBookCall();

  return (
    <div className="space-y-6 md:col-span-2 lg:col-span-1">
      <div className="w-auto">
        <Logo className="w-36 md:w-40 lg:w-44 h-auto" />
      </div>
      <div className="space-y-4">
        <p className="text-ink leading-relaxed">
          Two Steps — AI systems, built to a standard.
        </p>
      </div>
      <div className="flex gap-2">
        {social.filter((item) => item.href !== '#').map((item: SocialItem) => (
          <a
            key={item.label}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => hapticFeedback.selection()}
            className={clsx(
              'ts-icon-btn inline-flex h-11 w-11 items-center justify-center rounded-full border border-line-strong',
              'text-muted hover:bg-ink/10 hover:text-ink',
            )}
            aria-label={`Visit our ${item.label} page`}
          >
            <item.icon className="h-4 w-4" />
          </a>
        ))}
      </div>
      <button
        type="button"
        onClick={() => {
          open();
          hapticFeedback.success();
        }}
        aria-label="Start a conversation"
        className="ts-pill h-12 px-6 text-[15px]"
      >
        Start a conversation
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}

interface FooterLinksGridProps {
  isMobile: boolean;
  reduceMotion: boolean | null;
  expandedSections: Record<string, boolean>;
  onToggleSection: (sectionKey: string) => void;
  onNavigate: (href: string, event?: MouseEvent<HTMLAnchorElement>) => void;
}

export function FooterLinksGrid({
  isMobile,
  reduceMotion,
  expandedSections,
  onToggleSection,
  onNavigate,
}: FooterLinksGridProps) {
  return (
    <div className={`md:col-span-2 lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-4 ${isMobile ? '' : 'pl-2 lg:pl-4'}`}>
      <CollapsibleSection
        title="Navigation"
        sectionKey="navigation"
        isMobile={isMobile}
        isExpanded={expandedSections.navigation}
        reduceMotion={reduceMotion}
        onToggle={onToggleSection}
      >
        <ul className="grid grid-cols-2 gap-y-5 gap-x-5">
          {navigation.map((item: NavItem) => (
            <li key={item.label}>
              <a
                href={item.href}
                onClick={(event) => {
                  onNavigate(item.href, event);
                  hapticFeedback.selection();
                }}
                className="group block w-full text-left min-h-[44px]"
                aria-label={`Navigate to ${item.label}`}
              >
                <span className="text-muted group-hover:text-ink transition-colors duration-300 flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-line-strong mr-3 group-hover:bg-ink group-hover:scale-125 transition-[background-color,transform] duration-300 shrink-0" />
                  <span className="relative flex items-center">
                    <span className="relative inline-block">
                      {item.label}
                      <span className="absolute -bottom-1 left-0 w-0 h-px bg-ink transition-[width] duration-300 group-hover:w-full" />
                    </span>
                    <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-[opacity,transform] duration-300" />
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </CollapsibleSection>

      <CollapsibleSection
        title="Solutions"
        sectionKey="solutions"
        isMobile={isMobile}
        isExpanded={expandedSections.solutions}
        reduceMotion={reduceMotion}
        onToggle={onToggleSection}
      >
        <ul className="space-y-5">
          {solutions.map((item: SolutionItem) => (
            <li key={item.label}>
              <a
                href={item.href}
                onClick={(event) => {
                  onNavigate(item.href, event);
                  hapticFeedback.selection();
                }}
                className="flex items-center gap-3 group w-full text-left min-h-[44px]"
                aria-label={`Learn more about ${item.label}`}
              >
                <IconBox icon={item.icon} />
                <span className="text-muted hover:text-ink transition-colors duration-300 flex items-center group">
                  <span className="relative flex items-center">
                    <span className="relative inline-block">
                      {item.label}
                      <span className="absolute -bottom-1 left-0 w-0 h-px bg-ink transition-[width] duration-300 group-hover:w-full" />
                    </span>
                    <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-[opacity,transform] duration-300" />
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </CollapsibleSection>
    </div>
  );
}

interface FooterContactColumnProps {
  isMobile: boolean;
  reduceMotion: boolean | null;
  expandedSections: Record<string, boolean>;
  onToggleSection: (sectionKey: string) => void;
  onSelectLegal: (type: string) => void;
}

export function FooterContactColumn({
  isMobile,
  reduceMotion,
  expandedSections,
  onToggleSection,
  onSelectLegal,
}: FooterContactColumnProps) {
  return (
    <div className={isMobile ? 'lg:col-span-1 space-y-6' : 'lg:col-span-1 pl-2 lg:pl-4'}>
      <CollapsibleSection
        title="Contact Us"
        sectionKey="contact"
        isMobile={isMobile}
        isExpanded={expandedSections.contact}
        reduceMotion={reduceMotion}
        onToggle={onToggleSection}
      >
        <ul className="space-y-5">
          {contact.map((item: ContactItem) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="flex items-center gap-3 group min-h-[44px]"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconBox icon={item.icon} />
                <span className="text-muted group-hover:text-ink transition-colors duration-300">
                  {item.text}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </CollapsibleSection>

      {isMobile && (
        <CollapsibleSection
          title="Policies"
          sectionKey="legal"
          isMobile={isMobile}
          isExpanded={expandedSections.legal}
          reduceMotion={reduceMotion}
          onToggle={onToggleSection}
        >
          <ul className="grid grid-cols-2 gap-y-5 gap-x-5">
            {LEGAL_TYPES.map((type) => (
              <li key={type}>
                <button
                  type="button"
                  onClick={() => {
                    onSelectLegal(type);
                    hapticFeedback.light();
                  }}
                  className="group block min-h-[44px] w-full cursor-pointer text-left"
                  aria-label={`View ${getLegalLabel(type)}`}
                >
                  <span className="text-muted group-hover:text-ink transition-colors duration-300 flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-line-strong mr-3 group-hover:bg-ink group-hover:scale-125 transition-[background-color,transform] duration-300 shrink-0" />
                    <span className="relative flex items-center">
                      <span className="relative inline-block">
                        {getLegalLabel(type)}
                        <span className="absolute -bottom-1 left-0 w-0 h-px bg-ink transition-[width] duration-300 group-hover:w-full" />
                      </span>
                      <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-[opacity,transform] duration-300" />
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </CollapsibleSection>
      )}
    </div>
  );
}

interface FooterBottomBarProps {
  isMobile: boolean;
  onSelectLegal: (type: string) => void;
}

export function FooterBottomBar({ isMobile, onSelectLegal }: FooterBottomBarProps) {
  return (
    <div className="mt-4 md:mt-10 pt-3 md:pt-6 md:border-t md:border-line">
      <div className="flex flex-col md:flex-row justify-between items-center gap-2 md:gap-4 text-center md:text-left">
        <p className="text-muted text-sm">
          © {new Date().getFullYear()} Two Steps. All Rights Reserved.
        </p>
        {!isMobile && (
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {LEGAL_TYPES.map((type) => (
              <button
                type="button"
                key={type}
                onClick={() => {
                  onSelectLegal(type);
                  hapticFeedback.light();
                }}
                className="min-h-[44px] cursor-pointer text-sm capitalize text-muted transition-colors duration-300 hover:text-ink"
                aria-label={`View ${getLegalLabel(type)}`}
              >
                {getLegalLabel(type)}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
