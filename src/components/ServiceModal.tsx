import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { X, ArrowRight, MessageSquareText, Mic, LayoutDashboard, Code2 } from 'lucide-react';

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: {
    title: string;
    gradient: string;
    details: {
      features: string[];
      benefits: string[];
      useCase: string;
    };
  } | null;
  onBookCall: () => void;
}

const icons: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  'AI Chat Agents': MessageSquareText,
  'AI Voice Agents': Mic,
  'CRM Development': LayoutDashboard,
  'Custom SaaS Solutions': Code2,
};

const ServiceModal: React.FC<ServiceModalProps> = ({ isOpen, onClose, service, onBookCall }) => {
  const modalRoot = document.getElementById('modal-root') || document.body;
  const [modalPosition, setModalPosition] = React.useState<{ x: number; y: number } | null>(null);

  // Capture click position when opening modal
  React.useEffect(() => {
    if (isOpen && !modalPosition) {
      const handleClick = (e: MouseEvent) => {
        setModalPosition({ x: e.clientX, y: e.clientY });
      };
      document.addEventListener('click', handleClick, { once: true });
      return () => document.removeEventListener('click', handleClick);
    }
  }, [isOpen, modalPosition]);

  // Reset modal position when modal closes
  React.useEffect(() => {
    if (!isOpen) {
      setModalPosition(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      // Lock scroll while preserving position
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.paddingRight = `${
        window.innerWidth - document.documentElement.clientWidth
      }px`;
    } else {
      const scrollY = parseInt(document.body.style.top || '0') * -1;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.paddingRight = '';
      window.scrollTo(0, scrollY);
    }

    return () => {
      const scrollY = parseInt(document.body.style.top || '0') * -1;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.paddingRight = '';
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  if (!isOpen || !service) return null;

  const Icon = icons[service.title] || MessageSquareText;

  const handleBookCall = () => {
    window.open('https://calendly.com/yoniinsell/30min', '_blank');
    onBookCall();
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center"
          style={{
            zIndex: 999999,
            isolation: 'isolate',
          }}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
            style={{ zIndex: 1 }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-2xl mx-4 max-h-[80vh] origin-center"
            style={{
              zIndex: 2,
              transformOrigin: modalPosition
                ? `${modalPosition.x}px ${modalPosition.y}px`
                : 'center center',
            }}
          >
            {/* Container Box */}
            <div className="relative w-full max-h-[80vh] bg-gradient-to-b from-gray-900/95 to-black/95 rounded-2xl border border-gray-800/50 backdrop-blur-xl overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="sticky top-0 z-20 flex items-center justify-between p-5 border-b border-gray-800/50 bg-inherit">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-r ${service.gradient} p-[1px] group`}
                  >
                    <div className="w-full h-full rounded-xl bg-gray-900 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <h3
                    className={`text-xl font-bold bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent`}
                  >
                    {service.title}
                  </h3>
                </div>
                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className={`p-1.5 rounded-lg bg-gradient-to-r ${service.gradient} hover:opacity-90 transition-opacity`}
                >
                  <X className="w-4 h-4 text-white" />
                </motion.button>
              </div>

              {/* Content */}
              <div className="overflow-y-auto p-5 space-y-6 custom-scrollbar">
                {/* Features & Benefits Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Features */}
                  <div>
                    <h4 className="text-base font-semibold text-white mb-3">Key Features</h4>
                    <ul className="space-y-2">
                      {service.details.features.map((feature, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center space-x-2"
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${service.gradient}`}
                          />
                          <span className="text-gray-300 text-sm">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  {/* Benefits */}
                  <div>
                    <h4 className="text-base font-semibold text-white mb-3">Benefits</h4>
                    <ul className="space-y-2">
                      {service.details.benefits.map((benefit, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                          className="flex items-center space-x-2"
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${service.gradient}`}
                          />
                          <span className="text-gray-300 text-sm">{benefit}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Use Case */}
                <div className={`mt-6 p-4 bg-gray-900/50 rounded-xl`}>
                  <div className="bg-black/20 rounded-lg p-4 backdrop-blur-sm border border-white/5">
                    <h4 className="text-base font-semibold text-white mb-2">Perfect For</h4>
                    <p className="text-gray-300 text-sm leading-relaxed mb-4">
                      {service.details.useCase}
                    </p>
                    <motion.button
                      onClick={handleBookCall}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full bg-gradient-to-r ${service.gradient} px-6 py-2.5 rounded-xl text-white font-medium flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-300`}
                    >
                      Book a Call
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, modalRoot);
};

export default ServiceModal;
