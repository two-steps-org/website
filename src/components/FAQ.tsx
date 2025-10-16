import React, { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import Section from './common/Section';
import clsx from 'clsx';

const faqs = [
  {
    question: 'Is my business the right fit for AI solutions?',
    answer:
      "If you want to streamline operations, enhance customer experiences, or stay ahead of the competition, then yes! At Two Steps, we craft AI solutions tailored specifically to your business's needs. Book a call, and let's explore how we can help you succeed.",
    gradient: 'from-blue-500 to-indigo-500',
  },
  {
    question: 'How do I know which AI solution is right for my business?',
    answer:
      "You don't need to know—we'll guide you. Our free consultation is designed to uncover your needs and recommend the ideal solution for your business. Let's take that first step together.",
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    question: 'What industries do you work with?',
    answer:
      'From retail to healthcare, real estate, and beyond, we deliver AI solutions tailored to diverse industries. If your business has processes, we can automate and optimize them—no matter your niche or focus.',
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    question: 'What makes your team different from other AI agencies?',
    answer:
      "We don't just build AI—we build relationships. Our team works closely with you to design solutions that align perfectly with your goals. Your success is our success, and we're with you every step of the way.",
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    question: 'How do you ensure the AI solution will deliver results?',
    answer:
      "Our solutions are custom-made for your business, rigorously tested, and optimized for real-world results. You'll quickly see how they save time, reduce costs, and make your operations more efficient.",
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    question: 'Can AI solutions work with the tools/software I already use?',
    answer:
      "Absolutely. Our custom AI solutions integrate seamlessly with your existing platforms, whether it's a CRM, email system, or other internal tools. We'll make sure everything works together effortlessly.",
    gradient: 'from-purple-500 to-indigo-500',
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Split FAQs evenly into two columns
  const half = Math.ceil(faqs.length / 2);
  const leftColumnFaqs = faqs.slice(0, half);
  const rightColumnFaqs = faqs.slice(half);

  // Render a single FAQ item
  const renderFaqItem = (faq: (typeof faqs)[0], index: number) => {
    const isOpen = openIndex === index;
    return (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="relative group"
      >
        <motion.div
          className={clsx(
            'relative overflow-hidden rounded-2xl border transition-all duration-300',
            isOpen
              ? 'bg-gray-900/50 border-blue-500/50'
              : 'bg-gray-900/30 border-gray-800/50 hover:border-gray-700/50',
          )}
        >
          <button
            onClick={() => setOpenIndex(isOpen ? null : index)}
            className="w-full p-6 text-left"
          >
            <div className="flex justify-between items-start gap-4">
              <h3
                className={clsx(
                  'text-lg font-semibold transition-colors duration-300 bg-gradient-to-r bg-clip-text',
                  faq.gradient,
                  isOpen
                    ? 'text-transparent'
                    : 'text-gray-300 group-hover:text-transparent group-hover:bg-clip-text',
                )}
              >
                {faq.question}
              </h3>
              <div
                className={clsx('mt-1 transition-transform duration-300', isOpen && 'rotate-45')}
              >
                <Plus className={clsx('w-5 h-5', isOpen ? 'text-blue-400' : 'text-gray-400')} />
              </div>
            </div>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 text-gray-400 leading-relaxed"
              >
                {faq.answer}
              </motion.div>
            )}
          </button>
        </motion.div>
        {/* Hover Glow Effect */}
        <div
          className={clsx(
            'absolute -inset-2 bg-gradient-to-r rounded-3xl opacity-0 blur-xl transition-opacity duration-500 -z-10',
            faq.gradient,
          )}
        />
      </motion.div>
    );
  };

  return (
    <Section id="faq">
      {/* FAQ Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <span className="text-blue-400 text-sm font-semibold tracking-wider uppercase mb-4 block">
          FREQUENTLY ASKED QUESTIONS
        </span>
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          <span className="bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
            Got Questions?
          </span>
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-4">
          {leftColumnFaqs.map((faq, index) => renderFaqItem(faq, index))}
        </div>
        {/* Right Column */}
        <div className="space-y-4">
          {rightColumnFaqs.map((faq, index) => renderFaqItem(faq, index + leftColumnFaqs.length))}
        </div>
      </div>
    </Section>
  );
};

export default memo(FAQ);
