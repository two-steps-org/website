import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import SectionBackground from '../common/SectionBackground';
import { Search, Lightbulb, Code2, Rocket, RefreshCw } from 'lucide-react';

const steps = [
  {
    step: "Step 01",
    title: "Discovery Call",
    shortDescription: "We begin with a consultation call to understand your vision and goals.",
    fullDescription: "We begin with a one-on-one consultation call to understand your vision, challenges, and goals. This call helps us explore your unique needs and identify areas where AI can deliver the most impact. It's the foundation for building a solution tailored to your business.",
    gradient: "from-blue-400 via-blue-500 to-indigo-500",
    icon: Search
  },
  {
    step: "Step 02",
    title: "Tailored Solution Design",
    shortDescription: "Our team designs a personalized AI solution aligned with your operations.",
    fullDescription: "Our expert team designs a personalized AI solution. From defining the AI's personality to building its knowledge base and mapping out workflows, we ensure every detail aligns seamlessly with your operations and business goals.",
    gradient: "from-purple-400 via-purple-500 to-pink-500",
    icon: Lightbulb
  },
  {
    step: "Step 03",
    title: "Development & Integration",
    shortDescription: "We develop and integrate your AI solution with your existing platforms.",
    fullDescription: "Using the latest AI technology, we bring your solution to life. Our seamless integration process ensures your AI tools connect effortlessly with your existing platforms, providing a smooth and efficient experience for your team and customers.",
    gradient: "from-amber-400 via-amber-500 to-orange-500",
    icon: Code2
  },
  {
    step: "Step 04",
    title: "Deployment & Training",
    shortDescription: "We launch your AI solution and provide comprehensive training for your team.",
    fullDescription: "Your AI solution is launched! We embed it into your business operations and provide comprehensive training for your team, equipping them to maximize its potential and achieve immediate results.",
    gradient: "from-green-400 via-green-500 to-emerald-500",
    icon: Rocket
  },
  {
    step: "Step 05",
    title: "Continuous Optimization",
    shortDescription: "We continuously monitor and optimize your AI solution as your business grows.",
    fullDescription: "Our commitment doesn't end with deployment. We continuously monitor performance, refine capabilities, and scale your solution as your business grows. This ensures you remain ahead in the fast-paced AI landscape.",
    gradient: "from-blue-400 via-blue-500 to-cyan-500",
    icon: RefreshCw
  }
];

const MobileProcess: React.FC = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <SectionBackground
      id="process"
      className="py-16 px-4"
      gradient="from-purple-500/10 via-blue-500/10 to-purple-500/10"
    >
      <div className="text-center mb-8">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-blue-400 text-sm font-semibold tracking-wider uppercase mb-4 block"
        >
          OUR PROCESS
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl font-bold mb-4"
        >
          <span className="bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
            How We Transform Your Business
          </span>
        </motion.h2>
      </div>

      {/* Vertical Timeline */}
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-6 top-0 bottom-0 w-1">
          <motion.div
            className="h-full bg-gradient-to-b from-blue-500/30 via-purple-500/30 to-blue-500/30 rounded-full"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5 }}
          />
          <motion.div
            className="absolute inset-0 overflow-hidden"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <motion.div
              className="absolute inset-x-0 h-32 bg-gradient-to-b from-transparent via-blue-500/50 to-transparent rounded-full"
              animate={{ y: ["-25%", "125%"] }}
              transition={{
                duration: 2,
                ease: "linear",
                repeat: Infinity
              }}
            />
          </motion.div>
        </div>

        {/* Timeline Steps */}
        <div className="space-y-12">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative pl-16"
            >
              <div className="relative">
                {/* Icon Container with Step Number */}
                <div className="absolute -left-16 top-1/2 -translate-y-1/2 flex flex-col items-center">
                  {/* Step Number */}
                  <div className={`mb-2 z-10`}>
                    <div className={`text-[10px] font-bold text-white bg-gradient-to-r ${step.gradient} px-2 py-0.5 rounded-full text-center shadow-lg whitespace-nowrap min-w-[44px]`}>
                      {step.step}
                    </div>
                  </div>
                  
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${step.gradient} p-[1px] shadow-lg transition-transform duration-300 hover:scale-105`}>
                    <div className="w-full h-full rounded-xl bg-gray-900 flex items-center justify-center backdrop-blur-xl">
                      <step.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <motion.div
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleExpand(index)}
                  className="relative rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 p-6 group min-h-[200px] flex flex-col cursor-pointer"
                >
                  <h3 className={`text-lg font-bold mb-3 bg-gradient-to-r ${step.gradient} bg-clip-text text-transparent`}>
                    {step.title}
                  </h3>

                  <p className="text-gray-400 text-sm leading-relaxed flex-grow mb-6">
                    {expandedIndex === index ? step.fullDescription : step.shortDescription}
                  </p>

                  {/* See More Button */}
                  <div className="flex justify-center mt-auto">
                    <div 
                      className={`flex items-center text-sm font-medium bg-gradient-to-r ${step.gradient} bg-clip-text text-transparent hover:opacity-80 transition-colors`}
                    >
                      {expandedIndex === index ? "See Less" : "See More"}
                      <ChevronDown 
                        className={`w-5 h-5 ml-2 text-gray-400 transition-transform duration-300 ${expandedIndex === index ? "rotate-180" : ""}`}
                      />
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionBackground>
  );
};

export default MobileProcess;