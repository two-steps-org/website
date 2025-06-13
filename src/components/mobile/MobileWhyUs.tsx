import React from 'react';
import { motion } from 'framer-motion';
import { Target, Puzzle, Brain, Rocket, ShieldCheck, HeartHandshake } from 'lucide-react';
import SectionBackground from '../common/SectionBackground';

const features = [
  {
    icon: Target,
    title: "Built for Your Business",
    description: "Our AI solutions are custom-built to fit your goals, industry, and challenges—because your business deserves more than one-size-fits-all.",
    gradient: "from-blue-500 to-indigo-500"
  },
  {
    icon: Puzzle,
    title: "Effortless Integration",
    description: "Seamlessly connect our AI solutions with your existing tools and workflows, ensuring zero downtime and immediate results.",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    icon: Brain,
    title: "Intelligence You Can Trust",
    description: "Our AI agents are designed with precision, delivering reliable, consistent results that you can count on.",
    gradient: "from-amber-500 to-orange-500"
  },
  {
    icon: Rocket,
    title: "Evolving with Your Needs",
    description: "Our solutions grow with you, adapting to your business's evolution so you're always ready for what's next.",
    gradient: "from-green-500 to-emerald-500"
  },
  {
    icon: ShieldCheck,
    title: "Security at the Core",
    description: "Every AI solution we build is designed with advanced data protection, keeping your operations secure at every step.",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: HeartHandshake,
    title: "Expertise You Can Rely On",
    description: "Our team of specialists works closely with you, from concept to delivery, to ensure your AI vision becomes a reality.",
    gradient: "from-purple-500 to-indigo-500"
  }
];

const MobileWhyUs: React.FC = () => {
  return (
    <SectionBackground
      id="why-us"
      className="py-16 px-4"
      gradient="from-blue-500/10 via-purple-500/10 to-blue-500/10"
    >
      <div className="text-center mb-8">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-blue-400 text-sm font-semibold tracking-wider uppercase mb-4 block"
        >
          UNIQUE VALUE
        </motion.span>
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl font-bold mb-4"
        >
          <span className="bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
            Why Choose Us?
          </span>
        </motion.h2>
      </div>

      <div className="space-y-4">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group touch-manipulation"
          >
            <motion.div
              whileTap={{ scale: 0.98 }}
              className="relative overflow-hidden rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 p-6"
            >
              {/* Header with Icon */}
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.gradient} p-[1px] shrink-0`}>
                  <div className="w-full h-full rounded-xl bg-gray-900 flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className={`text-lg font-bold bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`}>
                  {feature.title}
                </h3>
              </div>

              {/* Content */}
              <p className="text-gray-400 text-sm leading-relaxed">
                {feature.description}
              </p>

              {/* Hover/Active State Indicator */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5">
                <div className={`h-full bg-gradient-to-r ${feature.gradient} transform scale-x-0 group-active:scale-x-100 transition-transform duration-200 origin-left`} />
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </SectionBackground>
  );
};

export default MobileWhyUs;