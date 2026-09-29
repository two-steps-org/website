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
    question: 'Is my business the right fit for AI solutions?',
    answer:
      "If you want to streamline operations, enhance customer experiences, or stay ahead of the competition, then yes! At Two Steps, we craft AI solutions tailored specifically to your business's needs. Start a conversation, and let's explore how we can help you succeed.",
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

const panelMotion = (reduce: boolean) => ({
  ...mainThread,
  initial: { height: 0, opacity: 0 },
  animate: { height: 'auto' as const, opacity: 1 },
  exit: { height: 0, opacity: 0 },
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
                    key={panelId}
                    id={panelId}
                    {...panelMotion(reduceMotion)}
                    className="overflow-hidden"
                  >
                    <p className="max-w-[62ch] pb-5 pr-10 text-[17px] leading-relaxed text-muted">
                      {faq.answer}
                    </p>
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
