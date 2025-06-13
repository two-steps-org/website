import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquareText, Mic, LayoutDashboard, Code2, ArrowRight } from 'lucide-react';
import Section from './common/Section';
import ServiceModal from './ServiceModal';

const services = [
  {
    icon: MessageSquareText,
    title: "AI Chat Agents",
    description: "Transform how you engage with customers and streamline operations using smart AI Chat Agents built just for you.",
    gradient: "from-amber-500 to-orange-500",
    delay: 0,
    details: {
      features: [
        "Text-based conversational agents",
        "Task automation and workflow integration",
        "24/7 availability",
        "Personalized responses and functionality"
      ],
      benefits: [
        "Enhance customer engagement",
        "Automate repetitive tasks",
        "Improve response times and accuracy",
        "Free up your team for higher-value activities"
      ],
      useCase: "Businesses aiming to automate customer service, streamline operations, and ensure personalized interactions with clients and team members."
    }
  },
  {
    icon: Mic,
    title: "AI Voice Agents",
    description: "Enhance customer experiences with conversational AI Voice Agents that handle calls like a pro.",
    gradient: "from-blue-500 to-indigo-500",
    delay: 0.1,
    featured: true,
    details: {
      features: [
        "Multilingual voice assistants",
        "Natural language processing",
        "Integration with phones and apps",
        "Real-time task execution"
      ],
      benefits: [
        "Enhance customer experience",
        "Reduce manual call handling",
        "Ensure 24/7 availability",
        "Support multiple languages"
      ],
      useCase: "For industries needing real-time, voice-based support—deploy a single agent or a coordinated team to suit your needs."
    }
  },
  {
    icon: LayoutDashboard,
    title: "CRM Development",
    description: "Say goodbye to generic CRMs — let us build one perfectly designed for your needs.",
    gradient: "from-purple-500 to-pink-500",
    delay: 0.2,
    details: {
      features: [
        "Fully customizable CRM platforms",
        "Built-in automation",
        "Seamless integration",
        "Scalable solutions"
      ],
      benefits: [
        "Streamline workflows",
        "Improve team collaboration",
        "Save on costs",
        "Scale effortlessly"
      ],
      useCase: "Organizations seeking a CRM designed for their specific needs, eliminating unnecessary features and boosting productivity."
    }
  },
  {
    icon: Code2,
    title: "Custom SaaS Solutions",
    description: "Bring your vision to life with custom-built software, tailored precisely to your needs.",
    gradient: "from-green-500 to-emerald-500",
    delay: 0.3,
    details: {
      features: [
        "Custom software solutions",
        "Robust architecture",
        "API integration",
        "Unique requirements"
      ],
      benefits: [
        "Build unique products",
        "Gain competitive edge",
        "Ensure seamless UX/UI",
        "Adapt as needed"
      ],
      useCase: "Businesses with unique software needs that require custom-built, scalable, and integrated SaaS solutions."
    }
  }
];

const Services = () => {
  const [selectedService, setSelectedService] = useState(null);

  const handleBookCall = () => {
    window.open('https://calendly.com/jonathani-atly/yoni', '_blank');
  };

  return (
    <Section id="services" className="bg-black -mt-16">
      <div className="relative">
        {/* Background Effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl animate-pulse" />
        
        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-32">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
              className="text-blue-400 text-sm font-semibold tracking-wider uppercase mb-4 block"
            >
              OUR SERVICES
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              <span className="bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
                Automate Roles, Not Just Tasks
              </span>
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: service.delay }}
                className={`group relative ${
                  service.featured ? 'lg:-mt-16 z-10' : ''
                }`}
              >
                {/* Card Container */}
                <div className={service.featured 
                  ? `relative h-full rounded-2xl overflow-hidden backdrop-blur-xl p-[2px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-lg shadow-blue-500/20`
                  : `relative h-full overflow-hidden rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 hover:border-blue-500/30 transition-all duration-300`
                }>
                  <div className={service.featured 
                    ? 'h-full rounded-2xl bg-[#0A0F1F]/95 p-8'
                    : 'h-full p-8'
                  }>
                    {/* Icon */}
                    <div className="mb-6">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${service.gradient} p-[1px] group-hover:scale-110 transition-transform duration-300`}>
                        <div className="w-full h-full rounded-xl bg-gray-900 flex items-center justify-center">
                          <service.icon className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    </div>

                    <h3 className={`text-xl font-bold mb-4 bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent`}>
                      {service.title}
                    </h3>

                    <p className="text-gray-400 mb-8 leading-relaxed">
                      {service.description}
                    </p>

                    {/* See More Button */}
                    <button
                      onClick={() => setSelectedService(service)}
                      className="flex items-center text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors group/btn"
                    >
                      See More
                      <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover/btn:opacity-100 transform -translate-x-2 group-hover/btn:translate-x-0 transition-all duration-300" />
                    </button>

                    {/* Popular Badge */}
                    {service.featured && (
                      <div className="absolute top-4 right-4">
                        <div className="px-4 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25">
                          Popular
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Hover Glow Effect */}
                <div className={`absolute -inset-2 bg-gradient-to-r ${service.gradient} rounded-3xl opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500 -z-10`} />
                
                {/* Featured Card Additional Glow */}
                {service.featured && (
                  <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl opacity-5 blur-2xl -z-20" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Service Details Modal */}
      <ServiceModal
        isOpen={!!selectedService}
        onClose={() => setSelectedService(null)}
        service={selectedService}
        onBookCall={handleBookCall}
      />
    </Section>
  );
};

export default Services;