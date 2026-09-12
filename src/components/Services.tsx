'use client';

import React, { useState, memo, useRef, useEffect, useCallback } from 'react';
import { m } from 'framer-motion';
import clsx from 'clsx';
import {
  MessageSquareText,
  Mic,
  LayoutDashboard,
  Code2,

  LucideIcon,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Section from './common/Section';
import ServiceModal from './ServiceModal';
import { hapticFeedback } from '../utils/mobile/hapticFeedback';
import SplitText from './common/SplitText';
import { pop, reveal, scaleIn, STAGGER } from '../utils/motion';

interface ServiceDetails {
  features: string[];
  benefits: string[];
  useCase: string;
  extendedDescription?: string;
}

interface Service {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  delay: number;
  featured?: boolean;
  details: ServiceDetails;
}

const services: Service[] = [
  {
    id: 'ai-chat-agents',
    icon: MessageSquareText,
    title: 'AI Chat Agents',
    description: 'Transform how you engage with customers and streamline operations using smart AI Chat Agents built just for you.',
    delay: 0,
    details: {
      features: ['Text-based conversational agents', 'Task automation and workflow integration', '24/7 availability', 'Personalized responses and functionality'],
      benefits: ['Enhance customer engagement', 'Automate repetitive tasks', 'Improve response times and accuracy', 'Free up your team for higher-value activities'],
      useCase: 'Businesses aiming to automate customer service, streamline operations, and ensure personalized interactions with clients and team members.',
      extendedDescription: 'Our conversational AI agents deliver personalized, 24/7 support across multiple platforms, integrating seamlessly with your existing workflows to automate routine tasks while maintaining human-like interactions. From customer service to internal team communication, our chat agents understand context, learn from interactions, and continuously improve to provide exceptional experiences.',
    },
  },
  {
    id: 'ai-voice-agents',
    icon: Mic,
    title: 'AI Voice Agents',
    description: 'Enhance customer experiences with conversational AI Voice Agents that handle calls like a pro.',
    delay: 0.1,
    featured: true,
    details: {
      features: ['Multilingual voice assistants', 'Natural language processing', 'Integration with phones and apps', 'Real-time task execution'],
      benefits: ['Enhance customer experience', 'Reduce manual call handling', 'Ensure 24/7 availability', 'Support multiple languages'],
      useCase: 'For industries needing real-time, voice-based support—deploy a single agent or a coordinated team to suit your needs.',
      extendedDescription: 'Deploy intelligent voice assistants that understand natural language, support multiple languages, and execute tasks in real-time—perfect for customer support, sales, and appointment scheduling. Our voice agents can handle inbound calls, make outbound calls, integrate with your phone systems, and perform complex tasks like lead qualification, appointment booking, and information retrieval—all while sounding natural and professional.',
    },
  },
  {
    id: 'crm-development',
    icon: LayoutDashboard,
    title: 'CRM Development',
    description: 'Say goodbye to generic CRMs — let us build one perfectly designed for your needs.',
    delay: 0.2,
    details: {
      features: ['Fully customizable CRM platforms', 'Built-in automation', 'Seamless integration', 'Scalable solutions'],
      benefits: ['Streamline workflows', 'Improve team collaboration', 'Save on costs', 'Scale effortlessly'],
      useCase: 'Organizations seeking a CRM designed for their specific needs, eliminating unnecessary features and boosting productivity.',
      extendedDescription: 'We create fully customizable CRM platforms with built-in automation, seamless integration with your existing tools, and scalable solutions that grow with your business. Whether you need to manage customer relationships, track sales pipelines, automate marketing campaigns, or centralize your business data, we build CRMs that fit your unique processes—not the other way around.',
    },
  },
  {
    id: 'custom-saas-solutions',
    icon: Code2,
    title: 'Custom SaaS Solutions',
    description: 'Bring your vision to life with custom-built software, tailored precisely to your needs.',
    delay: 0.3,
    details: {
      features: ['Custom software solutions', 'Robust architecture', 'API integration', 'Unique requirements'],
      benefits: ['Build unique products', 'Gain competitive edge', 'Ensure seamless UX/UI', 'Adapt as needed'],
      useCase: 'Businesses with unique software needs that require custom-built, scalable, and integrated SaaS solutions.',
    },
  },
];

const extendedServices = ['before', 'main', 'after'].flatMap((copy) =>
  services.map((service) => ({ service, copy })),
);

const handleBookCall = () => {
  window.open('https://calendly.com/yoni-insell-twosteps/30min', '_blank', 'noopener');
};

const ServiceSection: React.FC = () => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollRafRef = useRef<number | null>(null);
  
  const totalItems = services.length;

  useEffect(() => {
    if (scrollRef.current) {
      const { scrollWidth } = scrollRef.current;
      scrollRef.current.scrollLeft = scrollWidth / 3;
    }
  }, []);

  const scrollToServiceById = useCallback((serviceId: string) => {
    if (!scrollRef.current) return;
    const targetIndex = services.findIndex((service) => service.id === serviceId);
    if (targetIndex < 0) return;

    const middleSetDomIndex = targetIndex + totalItems;
    const targetCard = scrollRef.current.querySelector<HTMLElement>(
      `[data-carousel-index="${middleSetDomIndex}"]`,
    );
    if (!targetCard) return;

    const targetLeft = targetCard.offsetLeft - (scrollRef.current.clientWidth - targetCard.clientWidth) / 2;
    scrollRef.current.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' });
    setActiveIndex(targetIndex);
  }, [totalItems]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      // Scroll by roughly one card width + gap
      const scrollAmount = clientWidth - 40;
      const targetScroll = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
      
      scrollRef.current.scrollTo({ left: targetScroll, behavior: 'smooth' });
      hapticFeedback.selection();
    }
  };

  useEffect(() => {
    return () => {
      if (scrollRafRef.current !== null) {
        window.cancelAnimationFrame(scrollRafRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleServicesFocus = (event: Event) => {
      const customEvent = event as CustomEvent<{ serviceId?: string }>;
      const serviceId = customEvent.detail?.serviceId;
      if (!serviceId) return;
      window.setTimeout(() => scrollToServiceById(serviceId), 60);
    };

    window.addEventListener('servicesFocus', handleServicesFocus);
    return () => {
      window.removeEventListener('servicesFocus', handleServicesFocus);
    };
  }, [scrollToServiceById]);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    if (scrollRafRef.current !== null) return;

    scrollRafRef.current = window.requestAnimationFrame(() => {
      scrollRafRef.current = null;
      const el = scrollRef.current;
      if (!el) return;

      const { scrollLeft, scrollWidth, clientWidth } = el;
      const singleSetWidth = scrollWidth / 3;
      if (!singleSetWidth) return;

      // Seamless jump logic - jump when nearing edges to avoid "hitting a wall"
      let normalizedScrollLeft = scrollLeft;
      if (scrollLeft < 20) {
        normalizedScrollLeft = scrollLeft + singleSetWidth;
        el.scrollLeft = normalizedScrollLeft;
      } else if (scrollLeft > scrollWidth - clientWidth - 20) {
        normalizedScrollLeft = scrollLeft - singleSetWidth;
        el.scrollLeft = normalizedScrollLeft;
      }

      // Update active dot based on middle set
      const relativeScroll = normalizedScrollLeft % singleSetWidth;
      const itemWidth = singleSetWidth / totalItems;
      const nextIndex = Math.round(relativeScroll / itemWidth) % totalItems;
      setActiveIndex((prev) => (prev === nextIndex ? prev : nextIndex));
    });
  };

  return (
    <Section className="py-6 md:py-16 lg:py-24" id="services">
      <div className="relative">
        <div className="relative max-w-6xl mx-auto px-4 lg:px-8 text-center mb-8 md:mb-20 lg:mb-24">
          <m.p {...reveal()} className="ts-eyebrow mb-4">OUR SERVICES</m.p>

          <SplitText as="h2" delay={0.1} className="ts-h2 text-ink" text="Automate Roles, Not Just Tasks" />
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-7xl mx-auto px-4">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <m.div
                key={service.title}
                {...scaleIn((service.featured ? services.length : services.indexOf(service)) * STAGGER)}
                className={clsx("group relative", service.featured && "lg:-mt-14 z-10")}
              >
                <div
                  className={clsx(
                    "relative h-full rounded-2xl overflow-hidden transition-colors duration-500",
                    service.featured
                      ? "border border-line-strong backdrop-blur-xl"
                      : "ts-card backdrop-blur-xl hover:border-line-strong"
                  )}
                >
                  <div className={clsx("h-full p-6 md:p-8 flex flex-col", service.featured && "rounded-2xl bg-surface")}>
                    <div className="mb-4 md:mb-6">
                      <m.div {...pop(services.indexOf(service), 0.3)} className="w-10 h-10 md:w-12 md:h-12 rounded-xl border border-line-strong group-hover:scale-110 transition-transform duration-300">
                        <div className="w-full h-full rounded-xl bg-surface flex items-center justify-center">
                          <Icon className="w-4 h-4 md:w-5 md:h-5 text-ink" />
                        </div>
                      </m.div>
                    </div>

                    <h3 className="ts-h3 mb-3 md:mb-4 text-ink">
                      {service.title}
                    </h3>

                    <p className="text-muted mb-6 md:mb-8 leading-relaxed flex-grow text-[13px] md:text-[15px]">{service.description}</p>

                    <div className="flex justify-center">
                      <m.button
                        onClick={() => setSelectedService(service)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="group/btn text-xs md:text-sm font-medium tracking-wide relative flex items-center justify-center"
                      >
                        <span className={`text-ink opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 absolute whitespace-nowrap`}>
                          Discover More
                        </span>
                        <span className="text-muted group-hover/btn:opacity-0 transition-opacity duration-300 whitespace-nowrap">
                          Discover More
                        </span>
                      </m.button>
                    </div>

                    {service.featured && (
                      <div className="absolute top-4 right-4">
                        <div className="px-3 md:px-4 py-1.5 rounded-full text-[9px] md:text-[10px] uppercase tracking-wider font-bold bg-accent text-accent-fg">
                          Popular
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </m.div>
            );
          })}
        </div>

        {/* Mobile View Wrapper */}
        <m.div {...reveal(0.12)} className="block md:hidden">
          <div className="relative">
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="flex overflow-x-auto snap-x snap-proximity gap-4 pb-4 scrollbar-hide"
              style={{ paddingLeft: '9vw', paddingRight: '9vw', WebkitOverflowScrolling: 'touch', touchAction: 'pan-x pan-y' }}
            >
              {extendedServices.map(({ service, copy }, index) => (
                <div
                  key={`${copy}-${service.id}`}
                  data-carousel-index={index}
                  className="snap-center shrink-0 w-[82vw]"
                >
                  <div
                    className={clsx(
                      "relative h-full min-h-[320px] flex flex-col overflow-hidden rounded-3xl transition-colors duration-300 group cursor-pointer touch-manipulation",
                      service.featured
                        ? "border border-line-strong"
                        : "ts-card backdrop-blur-xl hover:border-line-strong hover:bg-surface"
                    )}
                  >
                    <div className={clsx(
                      "relative z-10 flex flex-col h-full p-6",
                      service.featured && "rounded-[calc(1.5rem-1px)] bg-surface"
                    )}>
                      <div className="mb-5 flex justify-between items-start">
                        <div className={`w-12 h-12 rounded-2xl border border-line-strong shadow-lg`}>
                          <div className="w-full h-full rounded-2xl bg-bg flex items-center justify-center">
                            <service.icon className="w-5 h-5 text-ink" />
                          </div>
                        </div>
                        
                        {service.featured && (
                          <div className="px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold bg-accent text-accent-fg">
                            Popular
                          </div>
                        )}
                      </div>

                      <h3 className="ts-h3 mb-3 text-ink">
                        {service.title}
                      </h3>

                      <p className="text-muted text-base leading-relaxed mb-6 flex-grow">
                        {service.description}
                      </p>

                      <div className="mt-auto">
                        <button
                          type="button"
                          onClick={() => setSelectedService(service)}
                          aria-label={`Discover more about ${service.title}`}
                          className="w-full py-3 rounded-xl bg-ink/5 border border-line text-center text-sm font-medium text-ink group-hover:bg-ink/10 transition-colors after:absolute after:inset-0 after:rounded-3xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                        >
                          Discover More
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Perfectly Centered Scroll UI */}
            <div className="flex flex-col items-center mt-2 w-full">
              <div className="flex items-center gap-6">
                <m.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => scroll('left')}
                  className="p-3 rounded-2xl ts-card backdrop-blur-xl text-muted hover:text-ink transition-colors"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-5 h-5" />
                </m.button>
                
                <div className="flex gap-2">
                  {services.map((service, i) => (
                    <div
                      key={service.id}
                      className={clsx(
                        "w-1.5 h-1.5 rounded-full transition-[width,background-color] duration-300",
                        activeIndex === i ? "bg-ink w-3" : "bg-line-strong"
                      )}
                    />
                  ))}
                </div>

                <m.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => scroll('right')}
                  className="p-3 rounded-2xl ts-card backdrop-blur-xl text-muted hover:text-ink transition-colors"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-5 h-5" />
                </m.button>
              </div>
            </div>
          </div>
        </m.div>
      </div>

      <ServiceModal
        isOpen={!!selectedService}
        onClose={() => setSelectedService(null)}
        service={selectedService}
        onBookCall={handleBookCall}
      />
    </Section>
  );
};

export default memo(ServiceSection);
