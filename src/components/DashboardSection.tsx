import React, { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, MessageSquareText, Mic } from 'lucide-react';
import { DashboardProvider } from './Dashboard/DashboardContext';
const CRMDashboard = React.lazy(() => import('./Dashboard/CRMDashboard'));
import ChatDashboard from './Dashboard/ChatDashboard';
import VoiceDashboard from './Dashboard/VoiceDashboard';
import Section from './common/Section';

const features = [
  {
    icon: LayoutDashboard,
    text: "CRM Dashboard",
    gradient: "from-blue-500 to-indigo-500",
    id: "crm"
  },
  {
    icon: MessageSquareText,
    text: "Chat Agents",
    gradient: "from-purple-500 to-pink-500",
    id: "chat"
  },
  {
    icon: Mic,
    text: "Voice Agents",
    gradient: "from-amber-500 to-orange-500",
    id: "voice"
  }
];

const DashboardSection = () => {
  const [activeTab, setActiveTab] = useState('crm');

  const renderDashboard = () => {
    switch (activeTab) {
      case 'chat':
        return <ChatDashboard />;
      case 'voice':
        return <VoiceDashboard />;
      default:
        return <CRMDashboard />;
    }
  };

  return (
    <Section id="dashboard" className="bg-black">
      <div className="relative">
        {/* Loading State */}
        <Suspense fallback={
          <div className="min-h-[600px] flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        }>
        {/* Background Effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl animate-pulse" />

        <div className="relative">
          <div className="text-center mb-12">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-blue-400 text-sm font-semibold tracking-wider uppercase mb-4 block"
            >
              INTERACTIVE DEMOS
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              <span className="bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
                Experience Our Solutions
              </span>
            </motion.h2>
          </div>

          <DashboardProvider>
            <div className="flex justify-center gap-4 mb-6 max-w-4xl mx-auto">
              {features.map((feature, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onClick={() => setActiveTab(feature.id)}
                  className="group relative"
                >
                  <div className={`relative overflow-hidden rounded-xl ${
                    activeTab === feature.id 
                      ? 'bg-gray-900/80'
                      : 'bg-gray-900/50'
                  } backdrop-blur-xl border ${
                    activeTab === feature.id
                      ? 'border-blue-500/30'
                      : 'border-gray-800/50'
                  } p-3 hover:border-blue-500/30 transition-all duration-300`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${feature.gradient} p-[1px] group-hover:scale-110 transition-transform duration-300`}>
                        <div className="w-full h-full rounded-lg bg-gray-900 flex items-center justify-center">
                          <feature.icon className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <span className="text-sm font-medium text-gray-300">{feature.text}</span>
                    </div>
                  </div>
                  {/* Hover Glow Effect */}
                  <div className={`absolute -inset-2 bg-gradient-to-r ${feature.gradient} rounded-2xl opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500 -z-10`} />
                </motion.button>
              ))}
            </div>

            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderDashboard()}
            </motion.div>
          </DashboardProvider>
        </div>
        </Suspense>
      </div>
    </Section>
  );
};

export default DashboardSection;