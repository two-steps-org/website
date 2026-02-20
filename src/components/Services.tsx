'use client';

import React, { useState, memo, useRef, useEffect } from 'react';
import { m } from 'framer-motion';
import clsx from 'clsx';
import {
  MessageSquareText,
  Mic,
  LayoutDashboard,
  Code2,
  Briefcase,
  LucideIcon,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Section from './common/Section';
import ServiceModal from './ServiceModal';
import { hapticFeedback } from '../utils/mobile/hapticFeedback';

interface ServiceDetails {
  features: string[];
  benefits: string[];
  useCase: string;
  extendedDescription?: string;
}

interface Service {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
  delay: number;
  featured?: boolean;
  details: ServiceDetails;
}

const services: Service[] = [
  {
    icon: MessageSquareText,
    title: 'AI Chat Agents',
    description: 'Transform how you engage with customers and streamline operations using smart AI Chat Agents built just for you.',
    gradient: 'from-amber-500 to-orange-500',
    delay: 0,
    details: {
      features: ['Text-based conversational agents', 'Task automation and workflow integration', '24/7 availability', 'Personalized responses and functionality'],
      benefits: ['Enhance customer engagement', 'Automate repetitive tasks', 'Improve response times and accuracy', 'Free up your team for higher-value activities'],
      useCase: 'Businesses aiming to automate customer service, streamline operations, and ensure personalized interactions with clients and team members.',
      extendedDescription: 'Our conversational AI agents deliver personalized, 24/7 support across multiple platforms, integrating seamlessly with your existing workflows to automate routine tasks while maintaining human-like interactions. From customer service to internal team communication, our chat agents understand context, learn from interactions, and continuously improve to provide exceptional experiences.',
    },
  },
  {
    icon: Mic,
    title: 'AI Voice Agents',
    description: 'Enhance customer experiences with conversational AI Voice Agents that handle calls like a pro.',
    gradient: 'from-blue-500 to-indigo-500',
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
    icon: LayoutDashboard,
    title: 'CRM Development',
    description: 'Say goodbye to generic CRMs — let us build one perfectly designed for your needs.',
    gradient: 'from-purple-500 to-pink-500',
    delay: 0.2,
    details: {
      features: ['Fully customizable CRM platforms', 'Built-in automation', 'Seamless integration', 'Scalable solutions'],
      benefits: ['Streamline workflows', 'Improve team collaboration', 'Save on costs', 'Scale effortlessly'],
      useCase: 'Organizations seeking a CRM designed for their specific needs, eliminating unnecessary features and boosting productivity.',
      extendedDescription: 'We create fully customizable CRM platforms with built-in automation, seamless integration with your existing tools, and scalable solutions that grow with your business. Whether you need to manage customer relationships, track sales pipelines, automate marketing campaigns, or centralize your business data, we build CRMs that fit your unique processes—not the other way around.',
    },
  },
  {
    icon: Code2,
    title: 'Custom SaaS Solutions',
    description: 'Bring your vision to life with custom-built software, tailored precisely to your needs.',
    gradient: 'from-green-500 to-emerald-500',
    delay: 0.3,
    details: {
      features: ['Custom software solutions', 'Robust architecture', 'API integration', 'Unique requirements'],
      benefits: ['Build unique products', 'Gain competitive edge', 'Ensure seamless UX/UI', 'Adapt as needed'],
      useCase: 'Businesses with unique software needs that require custom-built, scalable, and integrated SaaS solutions.',
    },
  },
];

const ServiceSection: React.FC = () => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const totalItems = services.length;
  const extendedServices = [...services, ...services, ...services];

  useEffect(() => {
    if (scrollRef.current) {
      const { scrollWidth } = scrollRef.current;
      scrollRef.current.scrollLeft = scrollWidth / 3;
    }
  }, []);

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

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const singleSetWidth = scrollWidth / 3;

      // Seamless jump logic - jump when nearing edges to avoid "hitting a wall"
      if (scrollLeft < 20) {
        scrollRef.current.scrollLeft = scrollLeft + singleSetWidth;
      } else if (scrollLeft > scrollWidth - clientWidth - 20) {
        scrollRef.current.scrollLeft = scrollLeft - singleSetWidth;
      }

      // Update active dot based on middle set
      const relativeScroll = (scrollLeft % singleSetWidth);
      const itemWidth = singleSetWidth / totalItems;
      const index = Math.round(relativeScroll / itemWidth);
      setActiveIndex(index % totalItems);
    }
  };

  const handleBookCall = () => {
    window.open('https://calendly.com/yoni-insell-twosteps/30min', '_blank');
  };

  return (
    <Section className="py-6 sm:py-12 md:py-16 lg:py-24" id="services">
      <div className="relative">
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-8 sm:mb-20 lg:mb-24">
          <div className="inline-flex mb-6 px-4 sm:px-5 py-2.5 bg-gradient-to-r from-blue-500/10 via-blue-500/5 to-transparent rounded-full backdrop-blur-sm border border-blue-500/10 shadow-[0_0_20px_rgba(59,130,246,0.1)] transition-all duration-300 mx-auto">
            <span className="text-blue-400 text-xs sm:text-sm font-medium flex items-center gap-2">
              <Briefcase className="w-4 h-4 animate-pulse" />
              OUR SERVICES
            </span>
          </div>

          <m.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight"
          >
            <span className="bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
              Automate Roles, Not Just Tasks
            </span>
          </m.h2>
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-7xl mx-auto px-4">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <m.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: service.delay }}
                className={clsx("group relative", service.featured && "lg:-mt-14 z-10")}
              >
                <div
                  className={clsx(
                    "relative h-full rounded-2xl overflow-hidden transition-all duration-500",
                    service.featured
                      ? "p-[2px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-2xl shadow-blue-500/20 backdrop-blur-xl"
                      : "bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 hover:border-blue-500/30"
                  )}
                >
                  <div className={clsx("h-full p-6 md:p-8 flex flex-col", service.featured && "rounded-2xl bg-gray-900/95")}>
                    <div className="mb-4 md:mb-6">
                      <div className={clsx(`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-r ${service.gradient} p-[1px] group-hover:scale-110 transition-transform duration-300`)}>
                        <div className="w-full h-full rounded-xl bg-gray-900 flex items-center justify-center">
                          <Icon className="w-4 h-4 md:w-5 md:h-5 text-white" />
                        </div>
                      </div>
                    </div>

                    <h3 className={clsx(`text-lg md:text-xl font-bold mb-3 md:mb-4 bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent`)}>
                      {service.title}
                    </h3>

                    <p className="text-gray-400 mb-6 md:mb-8 leading-relaxed flex-grow text-[13px] md:text-[15px]">{service.description}</p>

                    <div className="flex justify-center">
                      <m.button
                        onClick={() => setSelectedService(service)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="group/btn text-xs md:text-sm font-medium tracking-wide relative flex items-center justify-center"
                      >
                        <span className={`bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 absolute whitespace-nowrap`}>
                          Discover More
                        </span>
                        <span className="text-white/70 group-hover/btn:opacity-0 transition-opacity duration-300 whitespace-nowrap">
                          Discover More
                        </span>
                      </m.button>
                    </div>

                    {service.featured && (
                      <div className="absolute top-4 right-4">
                        <div className="px-3 md:px-4 py-1.5 rounded-full text-[9px] md:text-[10px] uppercase tracking-wider font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-lg">
                          Popular
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className={clsx(`absolute -inset-2 bg-gradient-to-r ${service.gradient} rounded-3xl opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500 -z-10`)} />
              </m.div>
            );
          })}
        </div>

        {/* Mobile View Wrapper */}
        <div className="block md:hidden">
          <div className="relative">
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="flex overflow-x-auto snap-x snap-proximity gap-4 pb-4 px-10 scrollbar-hide"
              style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-x pan-y' }}
            >
              {extendedServices.map((service, index) => (
                <div
                  key={`${service.title}-${index}`}
                  className="snap-center shrink-0 w-[280px] xs:w-[300px]"
                >
                  <div
                    onClick={() => setSelectedService(service)}
                    className={clsx(
                      "relative h-full min-h-[320px] flex flex-col overflow-hidden rounded-3xl transition-all duration-300 group cursor-pointer touch-manipulation",
                      service.featured
                        ? "p-[1px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-2xl shadow-blue-500/20"
                        : "bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 hover:border-blue-500/30 hover:bg-gray-900/60"
                    )}
                  >
                    <div className={clsx(
                      "relative z-10 flex flex-col h-full p-6",
                      service.featured && "rounded-[calc(1.5rem-1px)] bg-gray-900/95"
                    )}>
                      <div className="mb-5 flex justify-between items-start">
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${service.gradient} p-[1px] shadow-lg shadow-blue-500/10`}>
                          <div className="w-full h-full rounded-2xl bg-gray-950 flex items-center justify-center">
                            <service.icon className="w-5 h-5 text-white" />
                          </div>
                        </div>
                        
                        {service.featured && (
                          <div className="px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/20">
                            Popular
                          </div>
                        )}
                      </div>

                      <h3 className={`text-xl font-bold mb-3 bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent`}>
                        {service.title}
                      </h3>

                      <p className="text-gray-400 text-base leading-relaxed mb-6 flex-grow">
                        {service.description}
                      </p>

                      <div className="mt-auto">
                        <div className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-center text-sm font-medium text-white group-hover:bg-white/10 transition-colors">
                          Discover More
                        </div>
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
                  className="p-3 rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 text-white/50 hover:text-white transition-colors"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-5 h-5" />
                </m.button>
                
                <div className="flex gap-2">
                  {services.map((_, i) => (
                    <div
                      key={i}
                      className={clsx(
                        "w-1.5 h-1.5 rounded-full transition-all duration-300",
                        activeIndex === i ? "bg-blue-500 w-3" : "bg-gray-700"
                      )}
                    />
                  ))}
                </div>

                <m.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => scroll('right')}
                  className="p-3 rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 text-white/50 hover:text-white transition-colors"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-5 h-5" />
                </m.button>
              </div>
            </div>
          </div>
        </div>
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
