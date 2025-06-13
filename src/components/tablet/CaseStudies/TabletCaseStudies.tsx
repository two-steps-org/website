import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { caseStudies } from '../../../components/CaseStudies/data';
import TabletCaseStudyCard from './TabletCaseStudyCard';
import TabletCaseStudyModal from './TabletCaseStudyModal';
import type { CaseStudy } from '../../../components/CaseStudies/types';
import ParticleBackground from '../../ParticleBackground';

const TabletCaseStudies: React.FC = () => {
  const [selectedStudy, setSelectedStudy] = useState<CaseStudy | null>(null);

  const handleBookCall = () => {
    window.open('https://calendly.com/yoniinsell/30min', '_blank');
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Enhanced Background Effects */}
      <div className="fixed inset-0">
        {/* Primary Gradient Orb */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[200vw] aspect-square 
          bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-blue-500/10 
          rounded-full blur-[100px] animate-[pulse_4s_cubic-bezier(0.4,0,0.6,1)_infinite]" 
        />
        
        {/* Secondary Gradient Orb */}
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[200vw] aspect-square 
          bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-purple-500/10 
          rounded-full blur-[100px] animate-[pulse_4s_cubic-bezier(0.4,0,0.6,1)_infinite]"
          style={{ animationDelay: '2s' }}
        />
        
        {/* Grid Pattern */}
        <ParticleBackground />
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
        
        {/* Subtle Vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-gray-800/50">
        <div className="px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 text-white">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-lg">Back to Home</span>
          </Link>
          <img src="/two-steps-logo.png" alt="Two Steps" className="h-10" />
        </div>
      </header>

      {/* Main Content */}
      <main className="relative pt-32 px-6 pb-16">
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-blue-400 text-sm font-semibold tracking-wider uppercase mb-4 block"
          >
            CASE STUDIES
          </motion.span>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-bold mb-4"
          >
            <span className="bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
              Our Success Stories
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto"
          >
            Discover how we've helped businesses transform with AI
          </motion.p>
        </div>

        {/* Case Studies Grid */}
        <div className="grid grid-cols-2 gap-6">
          {caseStudies.map((study, index) => (
            <TabletCaseStudyCard
              key={index}
              study={study}
              index={index}
              onSelect={() => setSelectedStudy(study)}
            />
          ))}
        </div>
      </main>

      {/* Case Study Modal */}
      <TabletCaseStudyModal
        study={selectedStudy}
        onClose={() => setSelectedStudy(null)}
        onBookCall={handleBookCall}
      />
    </div>
  );
};

export default TabletCaseStudies;