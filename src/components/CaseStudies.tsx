import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Bot, Zap, Database, Globe } from 'lucide-react';
import Section from './common/Section';

const caseStudies = [
  {
    title: "Global E-commerce AI Assistant",
    client: "ShopGlobal Inc.",
    industry: "E-commerce",
    icon: Globe,
    gradient: "from-blue-500 to-indigo-500",
    metrics: {
      "Customer Satisfaction": "+45%",
      "Response Time": "-85%",
      "Sales Conversion": "+32%",
      "Cost Reduction": "65%"
    },
    description: "Implemented an AI-powered customer service solution handling 50,000+ daily interactions across 12 languages, resulting in significant improvements in customer satisfaction and operational efficiency.",
    solution: "Custom multilingual AI chat system with advanced product recommendations and automated order processing.",
    image: "https://images.unsplash.com/photo-1531973576160-7125cd663d86?w=800&h=400&fit=crop"
  },
  {
    title: "Healthcare Voice Assistant",
    client: "MediCare Solutions",
    industry: "Healthcare",
    icon: Bot,
    gradient: "from-purple-500 to-pink-500",
    metrics: {
      "Appointment Efficiency": "+75%",
      "Patient Satisfaction": "+58%",
      "Administrative Time": "-70%",
      "Booking Accuracy": "99.9%"
    },
    description: "Developed an AI voice system handling patient scheduling, reminders, and basic health queries, serving over 100 medical facilities nationwide.",
    solution: "Voice-enabled AI assistant with natural language processing and integration with existing healthcare systems.",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=400&fit=crop"
  },
  {
    title: "Financial Services Automation",
    client: "WealthTech Partners",
    industry: "Finance",
    icon: Database,
    gradient: "from-amber-500 to-orange-500",
    metrics: {
      "Processing Speed": "+300%",
      "Error Rate": "-99%",
      "Client Onboarding": "-85%",
      "Cost Savings": "$2.5M"
    },
    description: "Created a comprehensive AI solution for automated client onboarding, risk assessment, and portfolio management, handling $5B+ in assets.",
    solution: "Integrated AI platform with automated compliance checks and real-time portfolio optimization.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop"
  },
  {
    title: "Smart Manufacturing System",
    client: "IndustrialTech Corp",
    industry: "Manufacturing",
    icon: Zap,
    gradient: "from-green-500 to-emerald-500",
    metrics: {
      "Production Efficiency": "+40%",
      "Defect Detection": "+95%",
      "Downtime": "-60%",
      "Energy Savings": "45%"
    },
    description: "Implemented an AI-driven manufacturing system for predictive maintenance and quality control across 12 production facilities.",
    solution: "Real-time monitoring system with predictive analytics and automated quality control processes.",
    image: "https://images.unsplash.com/photo-1565514020179-026b92b4a5a9?w=800&h=400&fit=crop"
  }
];

const CaseStudies = () => {
  return (
    <div className="bg-black min-h-screen">
      {/* Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 bg-black/90 backdrop-blur-xl z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <a href="/" className="flex items-center space-x-2 text-white hover:opacity-80 transition-opacity">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </a>
            <img
              src="/two-steps-logo.png"
              alt="Two Steps"
              loading="lazy"
              decoding="async"
              className="h-12"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Section className="pt-32">
        <div className="relative">
          {/* Background Effects */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl animate-pulse" />

          {/* Content */}
          <div className="relative">
            <div className="text-center mb-20">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl md:text-5xl font-bold mb-6"
              >
                <span className="bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
                  Our Success Stories
                </span>
              </motion.h1>
            </div>

            <div className="grid grid-cols-1 gap-12 max-w-6xl mx-auto">
              {caseStudies.map((study, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative"
                >
                  <div className="relative overflow-hidden rounded-3xl bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 hover:border-blue-500/30 transition-all duration-300">
                    {/* Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                      {/* Left Column - Content */}
                      <div className="space-y-6">
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${study.gradient} p-[1px]`}>
                          <div className="w-full h-full rounded-xl bg-gray-900 flex items-center justify-center">
                            <study.icon className="w-7 h-7 text-white" />
                          </div>
                        </div>

                        <div>
                          <h3 className={`text-2xl font-bold mb-2 bg-gradient-to-r ${study.gradient} bg-clip-text text-transparent`}>
                            {study.title}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            {study.client} • {study.industry}
                          </p>
                        </div>

                        <p className="text-gray-300">
                          {study.description}
                        </p>

                        {/* Metrics Grid */}
                        <div className="grid grid-cols-2 gap-4">
                          {Object.entries(study.metrics).map(([key, value]) => (
                            <div key={key} className="bg-gray-800/50 rounded-xl p-4">
                              <p className="text-gray-400 text-sm mb-1">{key}</p>
                              <p className={`text-xl font-bold bg-gradient-to-r ${study.gradient} bg-clip-text text-transparent`}>
                                {value}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right Column - Image */}
                      <div className="relative h-[300px] lg:h-auto rounded-xl overflow-hidden">
                        <img
                          src={study.image}
                          alt={study.title}
                          loading="lazy"
                          decoding="async"
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent opacity-60" />
                      </div>
                    </div>
                  </div>

                  {/* Hover Glow Effect */}
                  <div className={`absolute -inset-2 bg-gradient-to-r ${study.gradient} rounded-[2rem] opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500 -z-10`} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default CaseStudies;
