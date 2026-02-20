'use client';

import React, { useEffect, useState, memo } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { useDeviceType } from '../utils/responsive/hooks/useDeviceType';
import { 
  X, 
  ArrowRight, 
  MessageSquareText, 
  Mic, 
  LayoutDashboard, 
  Code2, 
  LucideIcon,
  CheckCircle2
} from 'lucide-react';
import clsx from 'clsx';
import { hapticFeedback } from '../utils/mobile/hapticFeedback';

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
      extendedDescription?: string;
    };
  } | null;
  onBookCall: () => void;
}

const icons: Record<string, LucideIcon> = {
  'AI Chat Agents': MessageSquareText,
  'AI Voice Agents': Mic,
  'CRM Development': LayoutDashboard,
  'Custom SaaS Solutions': Code2,
};

const ServiceModal: React.FC<ServiceModalProps> = ({ isOpen, onClose, service, onBookCall }) => {
  const deviceType = useDeviceType();
  const isMobile = deviceType === 'mobile';
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock background scroll while modal is open on all devices
  useEffect(() => {
    if (isOpen) {
      const scrollRef = window.pageYOffset;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollRef}px`;
      document.body.style.width = '100%';
      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo({ top: scrollRef, behavior: 'auto' });
      };
    }
  }, [isOpen]);

  if (!mounted || !service) return null;

  const Icon = icons[service.title] || MessageSquareText;

  // Map gradient to scrollbar style
  const getScrollbarStyle = (gradient?: string) => {
    if (!gradient) return '';
    if (gradient.includes('blue')) return 'modal-scrollbar-blue';
    if (gradient.includes('purple')) return 'modal-scrollbar-purple';
    if (gradient.includes('green')) return 'modal-scrollbar-green';
    if (gradient.includes('amber')) return 'modal-scrollbar-amber';
    if (gradient.includes('orange')) return 'modal-scrollbar-orange';
    if (gradient.includes('pink')) return 'modal-scrollbar-pink';
    if (gradient.includes('cyan')) return 'modal-scrollbar-cyan';
    return '';
  };

  // 2026 Design Refresh for Modal Content - Optimized for Mobile Density
  const Content = (
    <div className="space-y-5">
      {/* Extended Description */}
      {service.details.extendedDescription && (
        <div className="relative overflow-hidden p-4 rounded-xl bg-gray-900/50 border border-gray-800/50">
          <div className={clsx("absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r opacity-50", service.gradient)} />
          <p className="text-gray-300 text-sm leading-relaxed">
            {service.details.extendedDescription}
          </p>
        </div>
      )}

      {/* Features Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <div className={clsx("w-1 h-1 rounded-full", service.gradient.replace('from-', 'bg-').split(' ')[0])} />
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-[0.15em]">What's Included</h4>
        </div>
        
        <div className="grid gap-2">
          {service.details.features.map((feature, idx) => (
            <div key={idx} className="group flex items-start gap-3 p-3 rounded-xl bg-gray-900/50 border border-gray-800/50 hover:bg-gray-900/60 transition-colors">
              <div className={clsx("mt-0.5 p-0.5 rounded-full bg-white/5 shrink-0", service.gradient.replace('from-', 'text-').split(' ')[0])}>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <span className="text-gray-300 text-sm font-medium leading-relaxed">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <div className={clsx("w-1 h-1 rounded-full", service.gradient.replace('from-', 'bg-').split(' ')[0])} />
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-[0.15em]">Key Benefits</h4>
        </div>
        
        <div className="grid gap-2">
          {service.details.benefits.map((benefit, idx) => (
            <div key={idx} className="group flex items-start gap-3 p-3 rounded-xl bg-gray-900/50 border border-gray-800/50 hover:bg-gray-900/60 transition-colors">
              <div className={clsx("mt-0.5 p-0.5 rounded-full bg-white/5 shrink-0", service.gradient.replace('from-', 'text-').split(' ')[0])}>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <span className="text-gray-300 text-sm font-medium leading-relaxed">{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Use Case Section */}
      <div className="relative overflow-hidden p-4 rounded-xl bg-gray-900/50 border border-gray-800/50">
        <div className={clsx("absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r opacity-50", service.gradient)} />
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
          <span className={clsx("w-1 h-1 rounded-full", service.gradient.replace('from-', 'bg-').split(' ')[0])} />
          Ideal Solution For
        </h4>
        <p className="text-gray-300 text-sm leading-relaxed font-medium">
          "{service.details.useCase}"
        </p>
      </div>

      {/* Main Action */}
      <div className="pt-2">
        <m.button
          onClick={() => {
            onBookCall();
            hapticFeedback.success();
          }}
          whileTap={{ scale: 0.98 }}
          className={clsx(
            "w-full px-5 py-3 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 transition-all active:opacity-90", 
            "bg-gradient-to-r",
            service.gradient
          )}
        >
          <span>Consult an Expert</span>
          <ArrowRight className="w-4 h-4" />
        </m.button>
        <p className="text-center text-xs text-gray-500 mt-2.5 font-medium">
          No commitment required • Free 30-min consultation
        </p>
      </div>
    </div>
  );

  const mobileContent = (
    <div className="space-y-3 pb-1">
      <div
        className={clsx(
          'relative overflow-hidden rounded-2xl border border-gray-800/60',
          'bg-gradient-to-b from-gray-900/90 to-black/90 backdrop-blur-xl',
        )}
      >
        <div className={clsx("absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r opacity-70", service.gradient)} />
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={clsx(
                'w-10 h-10 rounded-xl bg-gradient-to-r p-[1px] shrink-0',
                service.gradient,
              )}
            >
              <div className="w-full h-full rounded-xl bg-gray-900 flex items-center justify-center">
                <Icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <h3
              className={clsx(
                'text-lg font-bold bg-gradient-to-r bg-clip-text text-transparent truncate',
                service.gradient,
              )}
            >
              {service.title}
            </h3>
          </div>

          <m.button
            onClick={onClose}
            whileTap={{ scale: 0.92 }}
            className={clsx(
              'p-2 rounded-lg bg-gradient-to-r transition-opacity shrink-0',
              service.gradient,
            )}
            aria-label="Close modal"
          >
            <X className="w-4 h-4 text-white" />
          </m.button>
        </div>
      </div>

      <div
        className={clsx(
          'relative overflow-hidden rounded-2xl border border-gray-800/50',
          'bg-gradient-to-b from-gray-900/80 to-black/80 backdrop-blur-xl p-4',
        )}
      >
        {Content}
      </div>
    </div>
  );

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {isMobile ? (
            <m.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.22 }}
              className={clsx(
                "relative w-full max-w-md mx-4 max-h-[86dvh] overflow-y-auto",
                getScrollbarStyle(service.gradient)
              )}
            >
              {mobileContent}
            </m.div>
          ) : (
            <m.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className={clsx(
                'relative w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col',
                'bg-gradient-to-b from-gray-900/95 to-black/95 rounded-2xl',
                'border border-gray-800/50 backdrop-blur-xl',
              )}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-gray-800/50">
                <div className="flex items-center gap-4">
                  <div
                    className={clsx(
                      'w-12 h-12 rounded-xl bg-gradient-to-r p-[1px]',
                      service.gradient,
                    )}
                  >
                    <div className="w-full h-full rounded-xl bg-gray-900 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h3
                    className={clsx(
                      'text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent',
                      service.gradient,
                    )}
                  >
                    {service.title}
                  </h3>
                </div>
                <m.button
                  onClick={onClose}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className={clsx(
                    'p-2 rounded-lg bg-gradient-to-r hover:opacity-90 transition-opacity',
                    service.gradient,
                  )}
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5 text-white" />
                </m.button>
              </div>

              {/* Scrollable Content */}
              <div
                className={clsx(
                  "flex-1 overflow-y-auto p-5",
                  getScrollbarStyle(service.gradient)
                )}
              >
                {Content}
              </div>
            </m.div>
          )}
        </div>
      )}
    </AnimatePresence>
  );

  const targetNode = typeof document !== 'undefined' ? (document.getElementById('modal-root') || document.body) : null;
  return targetNode ? createPortal(modalContent, targetNode) : null;
};

export default memo(ServiceModal);
