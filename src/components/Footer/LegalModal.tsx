import React, { useEffect, memo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { X, Shield, Scale, Cookie } from 'lucide-react';

/** Defines the structure of each legal content section. */
interface LegalSection {
  title: string;
  content: string[];
}

/** Defines the structure of each legal content type. */
interface LegalContentType {
  title: string;
  icon: React.ElementType;
  gradient: string;
  sections: LegalSection[];
}

/** Main mapping of privacy/terms/cookies to their content. */
const legalContent: Record<string, LegalContentType> = {
  privacy: {
    title: 'Privacy Policy',
    icon: Shield,
    gradient: 'from-blue-500 to-indigo-500',
    sections: [
      {
        title: 'Information We Collect',
        content: [
          'Personal Information: Name, email, phone, company details from forms and consultations',
          'Payment details for service purchases',
          'Automatically collected data: IP address, browser type, OS',
          'Cookies and similar tracking technologies'
        ]
      },
      {
        title: 'How We Use Your Information',
        content: [
          'Provide and manage our services',
          'Customize your experience with personalized recommendations',
          'Respond to inquiries and requests',
          'Improve website functionality and service offerings',
          'Send promotional materials (with opt-in consent)',
          'Ensure website security and prevent fraud'
        ]
      },
      {
        title: 'Information Sharing',
        content: [
          'We never sell or rent your personal information',
          'Trusted service providers for service delivery',
          'Legal obligations and authority requests',
          'Business transfers in case of merger/acquisition'
        ]
      },
      {
        title: 'Data Security & Rights',
        content: [
          'Robust technical and organizational security measures',
          'Right to access, correct, or delete your data',
          'Option to object to or restrict processing',
          'Ability to request data copy and withdraw consent'
        ]
      }
    ]
  },
  terms: {
    title: 'Terms of Service',
    icon: Scale,
    gradient: 'from-purple-500 to-pink-500',
    sections: [
      {
        title: 'Overview of Services',
        content: [
          'Custom AI solutions including chat agents and voice agents',
          'Tailored CRM development and SaaS platforms',
          'Integration and deployment services',
          'Ongoing support and maintenance'
        ]
      },
      {
        title: 'User Responsibilities',
        content: [
          'Provide accurate and complete information',
          'Use services only for lawful purposes',
          'Protect account credentials and access',
          'Comply with all applicable laws and regulations'
        ]
      },
      {
        title: 'Intellectual Property',
        content: [
          'All content and software are Two Steps property',
          'Website design, text, and graphics are protected',
          'Custom AI solutions and tools ownership',
          'No unauthorized use or distribution'
        ]
      },
      {
        title: 'Service Terms',
        content: [
          'Custom pricing based on project requirements',
          'Payments due as outlined in agreements',
          'Delivery timelines vary by project scope',
          'Support included per service agreement'
        ]
      },
      {
        title: 'Legal Compliance',
        content: [
          'Limited liability for indirect damages',
          'Right to terminate for Terms violations',
          'Privacy Policy compliance required',
          'Governing law and jurisdiction apply'
        ]
      }
    ]
  },
  cookies: {
    title: 'Cookie Policy',
    icon: Cookie,
    gradient: 'from-amber-500 to-orange-500',
    sections: [
      {
        title: 'What Are Cookies?',
        content: [
          'Small text files stored on your device when visiting our website',
          'Help recognize your device and remember preferences',
          'Enable personalized browsing experience',
          'Support website functionality and performance'
        ]
      },
      {
        title: 'Types of Cookies We Use',
        content: [
          'Essential Cookies: Required for basic website functionality',
          'Performance Cookies: Track website usage and improve performance',
          'Functionality Cookies: Remember your preferences and settings',
          'Targeting/Advertising Cookies: Deliver relevant ads and track campaigns'
        ]
      },
      {
        title: 'How We Use Cookies',
        content: [
          'Improve website performance and loading speed',
          'Enhance user experience with personalized content',
          'Analyze traffic patterns and user behavior',
          'Optimize marketing and advertising effectiveness'
        ]
      },
      {
        title: 'Managing Cookie Preferences',
        content: [
          'Control cookies through browser settings',
          'Choose which types of cookies to accept',
          'Opt-out of non-essential cookies',
          'Note: Disabling cookies may affect website functionality'
        ]
      },
      {
        title: 'Third-Party Cookies',
        content: [
          'Some cookies set by trusted third parties',
          'Analytics providers and advertisers',
          'Governed by third-party privacy policies',
          'Regular review of third-party compliance'
        ]
      }
    ]
  }
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
 * It locks scroll on open and restores it on close.
 */
const BaseLegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  // Enhanced scroll locking with a ref storing scroll position
  const scrollRef = useRef(0);

  useEffect(() => {
    if (type) {
      // Store current scroll position
      scrollRef.current = window.pageYOffset;

      // Lock body scroll while the modal is open
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollRef.current}px`;
      document.body.style.width = '100%';

      return () => {
        // Restore body scroll
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';

        // Jump back to saved scroll position
        window.scrollTo({
          top: scrollRef.current,
          behavior: 'instant'
        });
      };
    }
  }, [type]);

  // If no type is provided, modal is not rendered
  if (!type) return null;

  // Retrieve the content object (or a fallback)
  const content = legalContent[type] || {
    title: 'Legal Content Not Found',
    icon: Shield,
    gradient: 'from-gray-600 to-gray-900',
    sections: [],
  };
  const Icon = content.icon;

  // Close the modal if clicking on the backdrop
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {type && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleBackdropClick}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className={clsx(
              'relative w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col',
              'bg-gradient-to-b from-gray-900/95 to-black/95 rounded-2xl',
              'border border-gray-800/50 backdrop-blur-xl'
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-800/50">
              <div className="flex items-center gap-4">
                <div
                  className={clsx(
                    'w-12 h-12 rounded-xl bg-gradient-to-r p-[1px]',
                    content.gradient
                  )}
                >
                  <div className="w-full h-full rounded-xl bg-gray-900 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3
                  className={clsx(
                    'text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent',
                    content.gradient
                  )}
                >
                  {content.title}
                </h3>
              </div>
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className={clsx(
                  'p-2 rounded-lg bg-gradient-to-r hover:opacity-90 transition-opacity',
                  content.gradient
                )}
              >
                <X className="w-5 h-5 text-white" />
              </motion.button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              {content.sections.map((section, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative group"
                >
                  <div className="relative overflow-hidden rounded-xl bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 p-6">
                    <h4 className="text-xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                      {section.title}
                    </h4>
                    <ul className="space-y-3">
                      {section.content.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 mr-3 shrink-0" />
                          <p className="text-gray-300">{item}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* Hover Effect */}
                  <div
                    className={clsx(
                      'absolute -inset-2 bg-gradient-to-r rounded-2xl opacity-0 group-hover:opacity-10',
                      'blur-xl transition-opacity duration-500 -z-10',
                      content.gradient
                    )}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

BaseLegalModal.displayName = 'LegalModal';

// Wrap with memo to avoid re-renders unless props change
export default memo(BaseLegalModal);
