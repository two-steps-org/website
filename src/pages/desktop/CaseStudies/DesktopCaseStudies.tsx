import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../../components/navigation/Navbar';
import Footer from '../../../components/Footer/Footer';
import { caseStudies } from '../../../components/CaseStudies/data';
import type { CaseStudy } from '../../../components/CaseStudies/types';
import ParticleBackground from '../../../components/ParticleBackground';
import CaseStudyModal from '../../../components/CaseStudies/CaseStudyModal';

const DesktopCaseStudies = () => {
  const [selectedStudy, setSelectedStudy] = useState<CaseStudy | null>(null);

  const handleBookCall = () => {
    window.open('https://calendly.com/yoniinsell/30min', '_blank');
  };

  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* Enhanced Background Effects */}
      <div className="fixed inset-0">
        <ParticleBackground />
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-blue-500/5 rounded-full filter blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[800px] h-[800px] bg-purple-500/5 rounded-full filter blur-[120px] animate-pulse" />
      </div>

      <Navbar />
      
      <main className="flex-1 relative w-full">
        <div className="w-full max-w-7xl mx-auto px-8 pt-32 pb-16">
          <motion.header
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.span
              className="text-blue-400 text-sm font-semibold tracking-wider uppercase mb-4 block"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              CASE STUDIES
            </motion.span>
            
            <motion.h1 
              className="text-5xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
                Our Success Stories
              </span>
            </motion.h1>
            
            <motion.p
              className="text-gray-400 text-xl max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Discover how we've helped businesses transform with AI
            </motion.p>
          </motion.header>

          {/* Case Studies Grid */}
          <div className="space-y-16">
            {caseStudies.map((study, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative"
              >
                <div className="relative overflow-hidden rounded-3xl bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 hover:border-blue-500/30 transition-all duration-300">
                  <div className="grid grid-cols-[1fr,500px] gap-8">
                    {/* Content Section */}
                    <div className="p-8 flex flex-col justify-between">
                      {/* Header */}
                      <div>
                        <div className="flex items-start gap-4 mb-6">
                          <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${study.gradient} p-[1px] group-hover:scale-110 transition-transform duration-300`}>
                            <div className="w-full h-full rounded-xl bg-gray-900 flex items-center justify-center">
                              <study.icon className="w-7 h-7 text-white" />
                            </div>
                          </div>
                          <div>
                            <h3 className={`text-2xl font-bold bg-gradient-to-r ${study.gradient} bg-clip-text text-transparent mb-2`}>
                              {study.title}
                            </h3>
                            <div className="flex flex-wrap gap-x-4 text-gray-400">
                              <p>{study.client}</p>
                              <span>•</span>
                              <p>{study.industry}</p>
                              <span>•</span>
                              <p>{study.deployedPlatform}</p>
                            </div>
                          </div>
                        </div>

                        <p className="text-gray-300 text-lg leading-relaxed mb-8">
                          {study.description}
                        </p>
                      </div>

                      {/* Metrics Grid */}
                      <div>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          {Object.entries(study.metrics).map(([key, value]) => (
                            <div key={key} className="bg-gray-900/50 rounded-xl p-4">
                              <p className="text-gray-400 text-sm mb-1">{key}</p>
                              <p className={`text-xl font-bold bg-gradient-to-r ${study.gradient} bg-clip-text text-transparent`}>
                                {value}
                              </p>
                            </div>
                          ))}
                        </div>

                        <button
                          onClick={() => setSelectedStudy(study)}
                          className={`inline-flex items-center text-base font-medium group/btn`}
                        >
                          <span className={`bg-gradient-to-r ${study.gradient} bg-clip-text text-transparent`}>
                            Learn More
                          </span>
                          <motion.span
                            className="inline-block ml-2 opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all duration-300"
                          >
                            →
                          </motion.span>
                        </button>
                      </div>
                    </div>

                    {/* Image Section */}
                    <div className="relative h-full min-h-[400px] overflow-hidden">
                      <img 
                        src={study.image} 
                        alt={study.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/50 to-transparent" />
                    </div>
                  </div>
                </div>

                {/* Hover Glow Effect */}
                <div className={`absolute -inset-2 bg-gradient-to-r ${study.gradient} rounded-[2rem] opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500 -z-10`} />
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <Footer />

      {selectedStudy && (
        <CaseStudyModal
          study={selectedStudy}
          onClose={() => setSelectedStudy(null)}
          onBookCall={handleBookCall}
        />
      )}
    </div>
  );
};

export default DesktopCaseStudies;
