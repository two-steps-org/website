'use client';

import React, { useEffect, memo, useRef, useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { X, Shield, Scale, Cookie, Plus, Minus } from 'lucide-react';

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
  gradient: string;
  sections: LegalSection[];
}

/** Main mapping of privacy/terms/cookies to their content. Updated for 2026. */
const legalContent: Record<string, LegalContentType> = {
  privacy: {
    title: 'Privacy Policy',
    icon: Shield,
    gradient: 'from-blue-500 to-indigo-500',
    sections: [
      {
        title: 'Information We Collect',
        teaser: 'Personal and usage data we gather to provide our services.',
        content: [
          'Personal Information: Name, email, phone, company details from forms and consultations',
          'Payment details for service purchases',
          'Automatically collected data: IP address, browser type, OS',
          'Cookies and similar tracking technologies',
          'Data processed by our AI systems (chat and voice agents) when you interact with them',
          'Sensitive data handling: We apply enhanced safeguards for health, financial, or other special categories of data you may share',
        ],
      },
      {
        title: 'How We Use Your Information',
        teaser: 'Purposes for which we process your data.',
        content: [
          'Provide and manage our services, including AI-powered solutions',
          'Customize your experience with personalized recommendations',
          'Respond to inquiries and requests',
          'Improve website functionality and service offerings',
          'Send promotional materials (with opt-in consent only)',
          'Ensure website security and prevent fraud',
          'Develop and improve our AI systems responsibly and ethically',
        ],
      },
      {
        title: 'Consent & Preference Management',
        teaser: 'Control how we use your data.',
        content: [
          'We obtain explicit consent before processing personal data where required',
          'Granular consent options for different processing activities',
          'Easy-to-use consent management; withdraw consent anytime',
          'Global Privacy Control (GPC) support: We honor browser-based opt-out signals',
          'Preference center to manage marketing and analytics preferences',
        ],
      },
      {
        title: 'Information Sharing',
        teaser: 'When and with whom we share your data.',
        content: [
          'We never sell or rent your personal information',
          'Trusted service providers for service delivery (under strict data processing agreements)',
          'Legal obligations and authority requests',
          'Business transfers in case of merger/acquisition',
        ],
      },
      {
        title: 'Data Security & Your Rights',
        teaser: 'Protection measures and your legal rights.',
        content: [
          'Robust technical and organizational security measures',
          'Regular policy reviews and updates to reflect best practices',
          'Right to access, correct, or delete your data',
          'Right to data portability in a portable format',
          'Option to object to or restrict processing',
          'Ability to withdraw consent and opt out of profiling',
          'Right to lodge a complaint with a supervisory authority',
        ],
      },
      {
        title: 'AI & Transparency',
        teaser: 'How we use AI and our commitment to transparency.',
        content: [
          'AI systems are used transparently; we disclose when AI assists in processing',
          'Ethical AI principles: fairness, accountability, and human oversight',
          'We do not use your data to train AI models without your consent',
          'Human review available for significant automated decisions',
        ],
      },
    ],
  },
  terms: {
    title: 'Terms of Service',
    icon: Scale,
    gradient: 'from-purple-500 to-pink-500',
    sections: [
      {
        title: 'Overview of Services',
        teaser: 'What we offer and how we deliver it.',
        content: [
          'Custom AI solutions including chat agents and voice agents',
          'Tailored CRM development and SaaS platforms',
          'Integration and deployment services',
          'Ongoing support and maintenance',
          'We regularly update our services and may modify offerings with notice',
        ],
      },
      {
        title: 'User Responsibilities',
        teaser: 'Your obligations when using our services.',
        content: [
          'Provide accurate and complete information',
          'Use services only for lawful purposes',
          'Protect account credentials and access',
          'Comply with all applicable laws and regulations',
          'Do not use AI services to generate harmful, deceptive, or illegal content',
        ],
      },
      {
        title: 'Intellectual Property',
        teaser: 'Ownership of our work and your content.',
        content: [
          'All content and software are Two Steps property',
          'Website design, text, and graphics are protected',
          'Custom AI solutions and tools ownership',
          'No unauthorized use or distribution',
        ],
      },
      {
        title: 'Service Terms',
        teaser: 'Pricing, delivery, and support.',
        content: [
          'Custom pricing based on project requirements',
          'Payments due as outlined in agreements',
          'Delivery timelines vary by project scope',
          'Support included per service agreement',
        ],
      },
      {
        title: 'Ethical AI & Acceptable Use',
        teaser: 'Our commitment to responsible AI use.',
        content: [
          'AI services must be used in accordance with ethical guidelines',
          'We reserve the right to suspend access for misuse',
          'Limited liability for indirect damages',
          'Right to terminate for Terms or Policy violations',
          'Privacy Policy compliance required',
          'Governing law and jurisdiction apply',
        ],
      },
    ],
  },
  cookies: {
    title: 'Cookie Policy',
    icon: Cookie,
    gradient: 'from-amber-500 to-orange-500',
    sections: [
      {
        title: 'What Are Cookies?',
        teaser: 'Small files that help our site work and remember your preferences.',
        content: [
          'Small text files stored on your device when visiting our website',
          'Help recognize your device and remember preferences',
          'Enable personalized browsing experience',
          'Support website functionality and performance',
        ],
      },
      {
        title: 'Types of Cookies We Use',
        teaser: 'Essential, performance, and optional cookies.',
        content: [
          'Essential Cookies: Required for basic website functionality',
          'Performance Cookies: Track website usage and improve performance',
          'Functionality Cookies: Remember your preferences and settings',
          'Targeting/Advertising Cookies: Deliver relevant ads and track campaigns (with consent)',
        ],
      },
      {
        title: 'Consent & GPC Support',
        teaser: 'How we manage your cookie consent.',
        content: [
          'We obtain consent for non-essential cookies before use',
          'Global Privacy Control (GPC) support: We honor GPC signals to opt out of non-essential cookies',
          'Consent preferences can be updated anytime via our cookie settings',
          'Clear choice between essential-only or full cookie experience',
        ],
      },
      {
        title: 'How We Use Cookies',
        teaser: 'Purposes for which we use cookies.',
        content: [
          'Improve website performance and loading speed',
          'Enhance user experience with personalized content',
          'Analyze traffic patterns and user behavior',
          'Optimize marketing and advertising effectiveness',
        ],
      },
      {
        title: 'Managing Cookie Preferences',
        teaser: 'Control your cookie settings.',
        content: [
          'Control cookies through browser settings',
          'Choose which types of cookies to accept',
          'Opt-out of non-essential cookies',
          'Note: Disabling cookies may affect website functionality',
        ],
      },
      {
        title: 'Third-Party Cookies',
        teaser: 'Cookies set by trusted partners.',
        content: [
          'Some cookies set by trusted third parties',
          'Analytics providers and advertisers (with consent)',
          'Governed by third-party privacy policies',
          'Regular review of third-party compliance',
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
  const scrollRef = useRef(0);
  const [expandedSections, setExpandedSections] = useState<Record<number, boolean>>({});

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

  // Reset expanded state when modal type changes
  useEffect(() => {
    setExpandedSections({});
  }, [type]);

  const toggleSection = (index: number) => {
    setExpandedSections((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  if (!type) return null;

  const content = legalContent[type] || {
    title: 'Legal Content Not Found',
    icon: Shield,
    gradient: 'from-gray-600 to-gray-900',
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleBackdropClick}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <m.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className={clsx(
              'relative w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col',
              'bg-gradient-to-b from-gray-900/95 to-black/95 rounded-2xl',
              'border border-gray-800/50 backdrop-blur-xl',
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-800/50">
              <div className="flex items-center gap-4">
                <div
                  className={clsx(
                    'w-12 h-12 rounded-xl bg-gradient-to-r p-[1px]',
                    content.gradient,
                  )}
                >
                  <div className="w-full h-full rounded-xl bg-gray-900 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3
                  className={clsx(
                    'text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent',
                    content.gradient,
                  )}
                >
                  {content.title}
                </h3>
              </div>
              <m.button
                onClick={onClose}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className={clsx(
                  'p-2 rounded-lg bg-gradient-to-r hover:opacity-90 transition-opacity',
                  content.gradient,
                )}
                aria-label="Close modal"
              >
                <X className="w-5 h-5 text-white" />
              </m.button>
            </div>

            {/* Instruction Text */}
            <p className="px-5 pt-4 text-sm text-gray-400">
              If you want to read more, click the plus sign for more information on each section.
            </p>

            {/* Scrollable Content */}
            <div
              className={clsx(
                'flex-1 overflow-y-auto p-5 space-y-4',
                type === 'privacy' && 'legal-modal-scrollbar-privacy',
                type === 'terms' && 'legal-modal-scrollbar-terms',
                type === 'cookies' && 'legal-modal-scrollbar-cookies',
              )}
            > {/* Reduced p-6 space-y-4 to p-4 space-y-3 */}
              {content.sections.map((section, index) => {
                const isExpanded = expandedSections[index] ?? false;
                return (
                  <m.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="relative group"
                  >
                    <div
                      className={clsx(
                        'relative overflow-hidden rounded-xl bg-gray-900/50 backdrop-blur-xl border border-gray-800/50',
                        isExpanded ? 'p-5' : 'p-4',
                      )}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-lg font-bold mb-1.5 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                            {section.title}
                          </h4>
                          <p className="text-gray-400 text-sm">{section.teaser}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleSection(index)}
                          className={clsx(
                            'shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-colors',
                            content.gradient,
                            'hover:opacity-90',
                          )}
                          aria-label={isExpanded ? `Collapse ${section.title}` : `Expand ${section.title}`}
                          aria-expanded={isExpanded}
                        >
                          {isExpanded ? (
                            <Minus className="w-5 h-5 text-white" />
                          ) : (
                            <Plus className="w-5 h-5 text-white" />
                          )}
                        </button>
                      </div>

                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <m.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="overflow-hidden"
                          >
                            <ul className="mt-4 pt-4 border-t border-gray-800/50 space-y-3">
                              {section.content.map((item, itemIndex) => (
                                <li key={itemIndex} className="flex items-start">
                                  <div
                                    className={clsx(
                                      'w-1.5 h-1.5 rounded-full mt-2 mr-3 shrink-0',
                                      type === 'privacy' && 'bg-blue-500',
                                      type === 'terms' && 'bg-purple-500',
                                      type === 'cookies' && 'bg-amber-500',
                                    )}
                                  />
                                  <p className="text-gray-300 text-sm">{item}</p>
                                </li>
                              ))}
                            </ul>
                          </m.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <div
                      className={clsx(
                        'absolute -inset-2 bg-gradient-to-r rounded-2xl opacity-0 group-hover:opacity-10',
                        'blur-xl transition-opacity duration-500 -z-10',
                        content.gradient,
                      )}
                    />
                  </m.div>
                );
              })}
            </div>
          </m.div>
        </div>
      )}
    </AnimatePresence>
  );
};

LegalModal.displayName = 'LegalModal';

export default memo(LegalModal);