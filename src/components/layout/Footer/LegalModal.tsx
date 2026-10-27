'use client';

import React, { useEffect, memo, useRef, useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { useReducedMotionQuery } from '../../../utils/scroll';
import clsx from 'clsx';
import ModalHeader from '../../common/Modal/ModalHeader';
import { Shield, Scale, Cookie, Plus, Minus } from 'lucide-react';
import { fade, modalPanel } from '../../../utils/motion';

/** Defines the structure of each legal content section. */
interface LegalSection {
  title: string;
  teaser: string;
  content: string[];
}

/** Defines the structure of each legal content type. */
interface LegalContentType {
  title: string;
  icon: React.ElementType;
  sections: LegalSection[];
}

/** Main mapping of privacy/terms/cookies to their content. Updated for 2026. */
const legalContent: Record<string, LegalContentType> = {
  privacy: {
    title: 'Privacy',
    icon: Shield,
    sections: [
      {
        title: 'What we collect',
        teaser: 'Only what you type into the booking dialog.',
        content: [
          'When you book a call: your name, your email, the time you chose, and the page you booked from.',
          'When booking is offline and you leave your email instead: your email, your message, and the page.',
          'Standard server logs from our host (Netlify): IP address, browser, and the pages requested, kept by them for their own operations.',
          'We run no analytics script, no advertising pixel, and no tracking cookies on this site.',
        ],
      },
      {
        title: 'What we do with it',
        teaser: 'Put the call on our calendar and reply to you.',
        content: [
          'The booking is written to our Google Calendar as an event with your name and email in it.',
          'We use your email to confirm the call and to follow up on what we discussed. Nothing else.',
          'We do not send marketing email and we do not sell or share your details with anyone.',
        ],
      },
      {
        title: 'Where it lives and for how long',
        teaser: 'Google Calendar and Netlify, as long as the relationship lasts.',
        content: [
          'Calendar events stay on our calendar. Netlify form submissions stay in our Netlify account.',
          'Ask us at yoni.insell@twosteps.ai and we will delete what we hold about you within 30 days.',
        ],
      },
      {
        title: 'Your rights',
        teaser: 'Access, correction, deletion.',
        content: [
          'You can ask what we hold, ask us to correct it, or ask us to delete it. Email yoni.insell@twosteps.ai.',
          'Two Steps is based in Tel Aviv, Israel. If you are in the EU or the UK, the rights under the GDPR apply and we honour them.',
        ],
      },
    ],
  },
  terms: {
    title: 'Terms',
    icon: Scale,
    sections: [
      {
        title: 'This website',
        teaser: 'What using this site means.',
        content: [
          'The content of this site describes our work and lets you book a call. It is not an offer, and nothing here forms a contract.',
          'Engagements are governed by a written agreement between you and Two Steps, which takes precedence over anything on this site.',
        ],
      },
      {
        title: 'Who owns what',
        teaser: 'You own what we build for you.',
        content: [
          'Work we deliver under an engagement belongs to you once paid for, including the code, the blueprint from Step One, and the infrastructure accounts, which are set up in your name.',
          'Our own products (Phyizit, Shift Manager and the others named on the work page) and the content and design of this site remain ours.',
          'We may keep and reuse general know-how, tooling and patterns that are not specific to you.',
        ],
      },
      {
        title: 'Booking a call',
        teaser: 'A conversation, not a commitment.',
        content: [
          'Booking a call commits neither of us to anything. We will say on the call whether we can help.',
          'Please do not use the booking tool to send abuse, spam or test traffic. We rate-limit it and we will block repeat offenders.',
        ],
      },
      {
        title: 'Liability',
        teaser: 'The usual limits.',
        content: [
          'This site is provided as is. We do our best to keep it accurate and available, and we are not liable for losses arising from its use.',
          'These terms are governed by the laws of the State of Israel, and the courts of Tel Aviv have jurisdiction.',
        ],
      },
    ],
  },
  cookies: {
    title: 'Cookies',
    icon: Cookie,
    sections: [
      {
        title: 'What this site stores',
        teaser: 'Nothing that tracks you.',
        content: [
          'This site sets no tracking or advertising cookies and runs no analytics.',
          'The browser may keep a technical preference for the site (for example, which calendar view you last used). It never leaves your device and it identifies nobody.',
          'If that ever changes, this page will say exactly what is set and why, before it is set.',
        ],
      },
    ],
  },
};

/** Props for the LegalModal component. */
interface LegalModalProps {
  /** The legal content type (e.g., 'privacy', 'terms', 'cookies'). */
  type?: string | null;
  /** Callback to close the modal. */
  onClose: () => void;
}

/**
 * LegalModal displays privacy, terms, or cookies content in a modal.
 * Sections are collapsible; initially collapsed with teasers visible.
 */
const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  return type ? <LegalModalContent key={type} type={type} onClose={onClose} /> : null;
};

const LegalModalContent: React.FC<LegalModalProps> = ({ type, onClose }) => {
  const reduceMotion = useReducedMotionQuery();
  const scrollRef = useRef(0);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (type) {
      scrollRef.current = window.pageYOffset;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollRef.current}px`;
      document.body.style.width = '100%';

      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo({ top: scrollRef.current, behavior: 'instant' });
      };
    }
  }, [type]);

  const toggleSection = (sectionKey: string) => {
    setExpandedSections((prev) => ({ ...prev, [sectionKey]: !prev[sectionKey] }));
  };

  if (!type) return null;

  const content = legalContent[type] || {
    title: 'Legal Content Not Found',
    icon: Shield,
    sections: [],
  };
  const Icon = content.icon;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <AnimatePresence>
      {type && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <m.div
            {...fade}
            onClick={handleBackdropClick}
            className="absolute inset-0 bg-bg/70 backdrop-blur-sm"
          />

          <div className="pointer-events-none flex h-full w-full items-center justify-center p-4 mobile-safe-px mobile-safe-pb mobile-safe-pt">
          <m.div
            {...modalPanel}
            className={clsx(
              'pointer-events-auto relative flex w-full max-w-2xl max-h-[90dvh] flex-col',
              'ts-modal-shell overflow-hidden',
            )}
          >
            {/* Header */}
            <ModalHeader title={content.title} icon={Icon} onClose={onClose} />

            {/* Instruction Text */}
            <p className="px-5 pt-4 text-sm text-muted">
              If you want to read more, click the plus sign for more information on each section.
            </p>

            {/* Scrollable Content */}
            <div
              className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar"
            > {/* Reduced p-6 space-y-4 to p-4 space-y-3 */}
              {content.sections.map((section) => {
                const sectionKey = `${type}-${section.title}`;
                const isExpanded = expandedSections[sectionKey] ?? false;
                return (
                  <div
                    key={sectionKey}
                    className="relative group"
                  >
                    <div
                      className={clsx(
                        'ts-surface',
                        isExpanded ? 'p-5' : 'p-4',
                      )}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h4 className="ts-h3 mb-1.5 text-ink">
                            {section.title}
                          </h4>
                          <p className="text-muted text-sm">{section.teaser}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleSection(sectionKey)}
                          className="ts-icon-btn flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-full border border-line-strong text-ink hover:bg-ink/10"
                          aria-label={isExpanded ? `Collapse ${section.title}` : `Expand ${section.title}`}
                          aria-expanded={isExpanded}
                        >
                          {isExpanded ? (
                            <Minus className="w-5 h-5 text-ink" />
                          ) : (
                            <Plus className="w-5 h-5 text-ink" />
                          )}
                        </button>
                      </div>

                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <m.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: reduceMotion ? 0 : 0.2, ease: [0.23, 1, 0.32, 1] }}
                            className="overflow-hidden"
                          >
                            <ul className="mt-4 pt-4 border-t border-line space-y-3">
                              {section.content.map((item) => (
                                <li key={item} className="flex items-start">
                                  <div
                                    className="w-1.5 h-1.5 rounded-full mt-2 mr-3 shrink-0 bg-line-strong"
                                  />
                                  <p className="text-muted text-sm">{item}</p>
                                </li>
                              ))}
                            </ul>
                          </m.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                );
              })}
            </div>
          </m.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

LegalModal.displayName = 'LegalModal';

export default memo(LegalModal);
