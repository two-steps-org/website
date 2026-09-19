import { useState, memo } from 'react';
import { AnimatePresence, LayoutGroup, m } from 'framer-motion';
import { useReducedMotionQuery } from '../utils/scroll';
import { Plus } from 'lucide-react';
import Section from './common/Section';
import clsx from 'clsx';
import SplitText from './common/SplitText';
import Scrub from './common/Scrub';
import { EASE_OUT } from '../utils/motion';

const faqs = [
  {
    question: 'Is my business the right fit for AI solutions?',
    answer:
      "If you want to streamline operations, enhance customer experiences, or stay ahead of the competition, then yes! At Two Steps, we craft AI solutions tailored specifically to your business's needs. Book a call, and let's explore how we can help you succeed.",
  },
  {
    question: 'How do I know which AI solution is right for my business?',
    answer:
      "You don't need to know—we'll guide you. Our free consultation is designed to uncover your needs and recommend the ideal solution for your business. Let's take that first step together.",
  },
  {
    question: 'What industries do you work with?',
    answer:
      'From retail to healthcare, real estate, and beyond, we deliver AI solutions tailored to diverse industries. If your business has processes, we can automate and optimize them—no matter your niche or focus.',
  },
  {
    question: 'What makes your team different from other AI agencies?',
    answer:
      "We don't just build AI—we build relationships. Our team works closely with you to design solutions that align perfectly with your goals. Your success is our success, and we're with you every step of the way.",
  },
  {
    question: 'How do you ensure the AI solution will deliver results?',
    answer:
      "Our solutions are custom-made for your business, rigorously tested, and optimized for real-world results. You'll quickly see how they save time, reduce costs, and make your operations more efficient.",
  },
  {
    question: 'Can AI solutions work with the tools/software I already use?',
    answer:
      "Absolutely. Our custom AI solutions integrate seamlessly with your existing platforms, whether it's a CRM, email system, or other internal tools. We'll make sure everything works together effortlessly.",
  },
];

const FAQ = () => {
  const reduceMotion = useReducedMotionQuery();
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);
  const [showAllMobile, setShowAllMobile] = useState(false);

  const renderFaqItem = (faq: (typeof faqs)[0], index: number) => {
    const isOpen = openQuestion === faq.question;

    return (
      <Scrub effect="unfold" delay={(index % 2) * 0.08}
        key={faq.question}
        className={clsx(
          'group relative',
          index >= 3 && !showAllMobile ? 'hidden lg:block' : 'block',
        )}
      >
        <m.div
          layout
          transition={{ duration: reduceMotion ? 0 : 0.22, ease: EASE_OUT }}
          className={clsx(
            'relative overflow-hidden rounded-2xl ts-card transition-colors duration-200 h-full',
            isOpen ? 'border-line-strong' : 'hover:border-line-strong',
          )}
        >
          <m.div layout="position">
            <button
              type="button"
              onClick={() => setOpenQuestion(isOpen ? null : faq.question)}
              aria-expanded={isOpen}
              aria-controls={`faq-answer-${index}`}
              className="w-full cursor-pointer p-6 text-left"
            >
              <div className="flex justify-between items-start gap-4">
                <h3
                  className={clsx(
                    'ts-h3 transition-colors duration-300',
                    isOpen ? 'text-ink' : 'text-muted group-hover:text-ink',
                  )}
                >
                  {faq.question}
                </h3>
                <div
                  className={clsx('mt-1 transition-transform duration-300', isOpen && 'rotate-45')}
                >
                  <Plus className={clsx('w-5 h-5', isOpen ? 'text-ink' : 'text-muted')} />
                </div>
              </div>
            </button>
          </m.div>
          <AnimatePresence initial={false}>
            {isOpen && (
              <m.div
                key="answer"
                id={`faq-answer-${index}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.22, ease: EASE_OUT }}
              >
                <p className="px-6 pb-6 text-muted leading-relaxed">{faq.answer}</p>
              </m.div>
            )}
          </AnimatePresence>
        </m.div>
      </Scrub>
    );
  };

  return (
    <Section id="faq">
      {/* FAQ Header */}
      <Scrub y={32} className="text-center mb-8 md:mb-16">
        <p className="ts-eyebrow mb-4">
          FREQUENTLY ASKED QUESTIONS
        </p>
        <SplitText as="h2" delay={0.1} className="ts-h2 text-ink mb-6" text="Got Any Questions?" />
      </Scrub>

      <LayoutGroup>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
          {faqs.map((faq, index) => renderFaqItem(faq, index))}
        </div>
      </LayoutGroup>

      <div className="mt-8 flex justify-center lg:hidden">
        {showAllMobile ? (
          <button
            type="button"
            onClick={() => setShowAllMobile(false)}
            className="ts-icon-btn rounded-xl h-full w-full cursor-pointer border ts-card hover:border-line-strong px-6 py-4 text-sm font-semibold text-ink hover:text-ink"
          >
            See fewer questions
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setShowAllMobile(true)}
            className="ts-icon-btn rounded-xl h-full w-full cursor-pointer border ts-card hover:border-line-strong px-6 py-4 text-sm font-semibold text-ink hover:text-ink"
          >
            See more questions
          </button>
        )}
      </div>
    </Section>
  );
};

export default memo(FAQ);
