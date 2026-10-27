import { useState, memo } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { Plus } from 'lucide-react';
import clsx from 'clsx';
import Section from './common/Section';
import SplitText from './common/SplitText';
import Scrub from './common/Scrub';
import { CaseStudyClosingCta } from './CaseStudies/CaseStudyDetailSections';
import { useReducedMotionQuery } from '../utils/scroll';
import { EASE_OUT, mainThread } from '../utils/motion';

const faqs = [
  {
    question: 'Is my business the right fit for AI systems?',
    answer:
      "If you want to cut manual work or give customers faster answers, then yes. At Two Steps, we craft AI systems built specifically to your business's needs. Start a conversation, and let's explore how we can help you succeed.",
  },
  {
    question: 'How do I know which AI system is right for my business?',
    answer:
      "You don't need to know—we'll guide you. We'll uncover your needs and recommend the ideal system for your business. Let's take that first step together.",
  },
  {
    question: 'What industries do you work with?',
    answer:
      'We have built systems for retail, healthcare, and real estate. If your business has a process to automate, we can take that on too.',
  },
  {
    question: 'What makes your team different from other AI agencies?',
    answer:
      "We don't just build AI—we build relationships. Our team works closely with you to design systems that align perfectly with your goals. Your success is our success, and we're with you every step of the way.",
  },
  {
    question: 'How do you ensure the AI solution will deliver results?',
    answer:
      "Our systems are custom-made for your business, rigorously tested, and optimized for real-world results. You'll quickly see how they save time, reduce costs, and make your operations more efficient.",
  },
  {
    question: 'Can AI systems work with the tools/software I already use?',
    answer:
      "Absolutely. Our custom AI systems connect to the CRM, email, or other internal tools you already use, and we test that the handoff between them works.",
  },
];

const panelMotion = (reduce: boolean) => ({
  ...mainThread,
  initial: { gridTemplateRows: '0fr', opacity: 0 },
  animate: { gridTemplateRows: '1fr', opacity: 1 },
  exit: { gridTemplateRows: '0fr', opacity: 0 },
  transition: { duration: reduce ? 0 : 0.22, ease: EASE_OUT },
});

const FAQ = () => {
  const reduceMotion = useReducedMotionQuery();
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);

  return (
    <Section id="faq">
      <Scrub y={32} className="mb-8 text-center md:mb-16">
        <p className="ts-eyebrow mb-4">Frequently asked questions</p>
        <SplitText as="h2" delay={0.1} className="ts-h2 mb-6 text-ink" text="Got Any Questions?" />
      </Scrub>

      <ul className="mx-auto m-0 max-w-[720px] list-none border-t border-line p-0">
        {faqs.map((faq, index) => {
          const isOpen = openQuestion === faq.question;
          const panelId = `faq-answer-${index}`;

          return (
            <li key={faq.question} className="group border-b border-line">
              <button
                type="button"
                onClick={() => setOpenQuestion(isOpen ? null : faq.question)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="flex w-full cursor-pointer items-start justify-between gap-4 py-5 text-left"
              >
                <h3
                  className={clsx(
                    'ts-h3 transition-colors duration-200',
                    isOpen ? 'text-ink' : 'text-muted group-hover:text-ink',
                  )}
                >
                  {faq.question}
                </h3>
                <Plus
                  className={clsx(
                    'mt-1 h-5 w-5 shrink-0 transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none',
                    isOpen ? 'rotate-45 text-ink' : 'text-muted',
                  )}
                  aria-hidden
                />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <m.div
                    key={faq.question}
                    id={panelId}
                    {...panelMotion(reduceMotion)}
                    className="grid overflow-hidden"
                  >
                    <div className="min-h-0 overflow-hidden">
                      <p className="max-w-[62ch] pb-5 pr-10 text-[17px] leading-relaxed text-muted">
                        {faq.answer}
                      </p>
                    </div>
                  </m.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>

      <div className="mt-12 md:mt-16">
        <CaseStudyClosingCta embedded />
      </div>
    </Section>
  );
};

export default memo(FAQ);
