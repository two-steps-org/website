'use client';

import React, { useState, memo, useEffect } from 'react';
import {
  MessageSquareText,
  Mic,
  LayoutDashboard,
  Code2,
  LucideIcon,
} from 'lucide-react';
import ServiceModal from './ServiceModal';
import BentoGrid from './BentoGrid/BentoGrid';
import SplitText from './common/SplitText';
import Scrub from './common/Scrub';
import { BOOK_CALL_URL } from '../data/navItems';

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
  details: ServiceDetails;
}

const services: Service[] = [
  {
    id: 'ai-chat-agents',
    icon: MessageSquareText,
    title: 'AI Chat Agents',
    description: 'Transform how you engage with customers and streamline operations using smart AI Chat Agents built just for you.',
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
    details: {
      features: ['Custom software solutions', 'Robust architecture', 'API integration', 'Unique requirements'],
      benefits: ['Build unique products', 'Gain competitive edge', 'Ensure seamless UX/UI', 'Adapt as needed'],
      useCase: 'Businesses with unique software needs that require custom-built, scalable, and integrated SaaS solutions.',
    },
  },
];

const handleBookCall = () => {
  window.open(BOOK_CALL_URL, '_blank', 'noopener,noreferrer');
};

const ServiceSection: React.FC = () => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isServiceOpen, setIsServiceOpen] = useState(false);

  const openById = (id: string) => {
    const service = services.find((item) => item.id === id);
    if (service) {
      setSelectedService(service);
      setIsServiceOpen(true);
    }
  };

  useEffect(() => {
    const handleServicesFocus = (event: Event) => {
      const serviceId = (event as CustomEvent<{ serviceId?: string }>).detail?.serviceId;
      if (!serviceId) return;
      document.getElementById('services')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      openById(serviceId);
    };

    window.addEventListener('servicesFocus', handleServicesFocus);
    return () => window.removeEventListener('servicesFocus', handleServicesFocus);
  }, []);

  return (
    <section id="services" className="relative border-t border-line py-6 md:py-16 lg:py-24">
      <div className="ts-container relative">
        <Scrub y={32} className="mb-8 md:mb-14 lg:mb-16">
          <p className="ts-eyebrow mb-4">Our services</p>
          <SplitText as="h2" delay={0.1} className="ts-h2 text-ink m-0 max-w-[16ch]" text="Automate Roles, Not Just Tasks" />
        </Scrub>

        <BentoGrid services={services} onSelect={openById} />
      </div>

      <ServiceModal
        isOpen={isServiceOpen}
        onClose={() => setIsServiceOpen(false)}
        service={selectedService}
        onBookCall={handleBookCall}
      />
    </section>
  );
};

export default memo(ServiceSection);
