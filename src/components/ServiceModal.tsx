'use client';

import React, { useEffect, memo } from 'react';
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
import ModalHeader from './common/Modal/ModalHeader';
import { hapticFeedback } from '../utils/mobile/hapticFeedback';

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: {
    title: string;
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

  if (!service) return null;

  const Icon = icons[service.title] || MessageSquareText;

  // 2026 Design Refresh for Modal Content - Optimized for Mobile Density
  const Content = (
    <div className="space-y-5">
      {/* Extended Description */}
      {service.details.extendedDescription && (
        <div className="relative overflow-hidden p-4 rounded-xl ts-card">
          <div className="absolute top-0 left-0 w-full h-px bg-line-strong" />
          <p className="text-muted text-sm leading-relaxed">
            {service.details.extendedDescription}
          </p>
        </div>
      )}

      {/* Features Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <div className="w-1 h-1 rounded-full bg-ink" />
          <h4 className="text-xs font-bold text-muted uppercase tracking-[0.15em]">What's Included</h4>
        </div>
        
        <div className="grid gap-2">
          {service.details.features.map((feature) => (
            <div key={feature} className="group flex items-start gap-3 p-3 rounded-xl ts-card hover:bg-surface transition-colors">
              <div className="mt-0.5 p-0.5 rounded-full bg-ink/5 shrink-0 text-ink">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <span className="text-muted text-sm font-medium leading-relaxed">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <div className="w-1 h-1 rounded-full bg-ink" />
          <h4 className="text-xs font-bold text-muted uppercase tracking-[0.15em]">Key Benefits</h4>
        </div>
        
        <div className="grid gap-2">
          {service.details.benefits.map((benefit) => (
            <div key={benefit} className="group flex items-start gap-3 p-3 rounded-xl ts-card hover:bg-surface transition-colors">
              <div className="mt-0.5 p-0.5 rounded-full bg-ink/5 shrink-0 text-ink">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <span className="text-muted text-sm font-medium leading-relaxed">{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Use Case Section */}
      <div className="relative overflow-hidden p-4 rounded-xl ts-card">
        <div className="absolute top-0 left-0 w-full h-px bg-line-strong" />
        <h4 className="text-xs font-bold text-muted uppercase tracking-widest mb-2 flex items-center gap-2">
          <span className="w-1 h-1 rounded-full bg-ink" />
          Ideal Solution For
        </h4>
        <p className="text-muted text-sm leading-relaxed font-medium">
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
          className="ts-pill w-full px-5 py-3.5 text-sm active:opacity-90"
        >
          <span>Consult an Expert</span>
          <ArrowRight className="w-4 h-4" />
        </m.button>
        <p className="text-center text-xs text-muted mt-2.5 font-medium">
          No commitment required • Free 30-min consultation
        </p>
      </div>
    </div>
  );

  const mobileContent = (
    <div className="space-y-3 pb-1">
      <div
        className={clsx(
          'relative overflow-hidden rounded-2xl border border-line',
          'bg-surface backdrop-blur-xl',
        )}
      >
        <div className="absolute top-0 left-0 w-full h-px bg-line-strong" />
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-nested border border-line-strong bg-surface-2 flex items-center justify-center shrink-0">
              <Icon className="w-5 h-5 text-ink" />
            </div>
            <h3 className="ts-h3 text-ink truncate">{service.title}</h3>
          </div>

          <m.button
            onClick={onClose}
            whileTap={{ scale: 0.92 }}
            className="flex items-center justify-center min-h-[44px] min-w-[44px] rounded-full border border-line-strong text-ink hover:bg-ink/10 transition-colors shrink-0"
            aria-label="Close modal"
          >
            <X className="w-4 h-4 text-ink" />
          </m.button>
        </div>
      </div>

      <div
        className={clsx(
          'relative overflow-hidden rounded-2xl border border-line',
          'bg-surface backdrop-blur-xl p-4',
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
            className="absolute inset-0 bg-bg/70 backdrop-blur-sm"
          />

          {isMobile ? (
            <m.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.22 }}
              className="relative w-full max-w-md mx-4 max-h-[90dvh] overflow-y-auto custom-scrollbar mobile-safe-px mobile-safe-pb"
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
                'bg-surface rounded-card',
                'border border-line backdrop-blur-xl',
              )}
            >
              {/* Header */}
              <ModalHeader title={service.title} icon={Icon} onClose={onClose} />

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
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
