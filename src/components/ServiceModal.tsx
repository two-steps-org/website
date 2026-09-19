'use client';

import React, { useEffect, useEffectEvent, memo } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import {
  ArrowRight,
  MessageSquareText,
  Mic,
  LayoutDashboard,
  Code2,
  LucideIcon,
  CheckCircle2,
} from 'lucide-react';
import ModalHeader from './common/Modal/ModalHeader';
import { hapticFeedback } from '../utils/mobile/hapticFeedback';
import { fade, modalPanel } from '../utils/motion';

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

  const onEscapeClose = useEffectEvent(onClose);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onEscapeClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  if (!service) return null;

  const Icon = icons[service.title] || MessageSquareText;

  const Content = (
    <div className="space-y-5">
      {service.details.extendedDescription && (
        <div className="ts-surface p-4">
          <p className="text-muted text-sm leading-relaxed">
            {service.details.extendedDescription}
          </p>
        </div>
      )}

      <div className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <div className="w-1 h-1 rounded-full bg-ink" />
          <h4 className="text-xs font-bold text-muted uppercase tracking-[0.15em]">What&apos;s Included</h4>
        </div>

        <div className="grid gap-2">
          {service.details.features.map((feature) => (
            <div key={feature} className="ts-surface flex items-start gap-3 p-3">
              <div className="mt-0.5 p-0.5 rounded-full bg-ink/5 shrink-0 text-ink">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <span className="text-muted text-sm font-medium leading-relaxed">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <div className="w-1 h-1 rounded-full bg-ink" />
          <h4 className="text-xs font-bold text-muted uppercase tracking-[0.15em]">Key Benefits</h4>
        </div>

        <div className="grid gap-2">
          {service.details.benefits.map((benefit) => (
            <div key={benefit} className="ts-surface flex items-start gap-3 p-3">
              <div className="mt-0.5 p-0.5 rounded-full bg-ink/5 shrink-0 text-ink">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <span className="text-muted text-sm font-medium leading-relaxed">{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="ts-surface p-4">
        <h4 className="text-xs font-bold text-muted uppercase tracking-widest mb-2 flex items-center gap-2">
          <span className="w-1 h-1 rounded-full bg-ink" />
          Ideal Solution For
        </h4>
        <p className="text-muted text-sm leading-relaxed font-medium">
          &ldquo;{service.details.useCase}&rdquo;
        </p>
      </div>

      <div className="pt-2">
        <button
          type="button"
          onClick={() => {
            onBookCall();
            hapticFeedback.success();
          }}
          className="ts-pill w-full px-5 py-3.5 text-sm"
        >
          <span>Consult an Expert</span>
          <ArrowRight className="w-4 h-4" />
        </button>
        <p className="text-center text-xs text-muted mt-2.5 font-medium">
          No commitment required • Free 30-min consultation
        </p>
      </div>
    </div>
  );

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <m.div
            {...fade}
            onClick={onClose}
            className="absolute inset-0 bg-bg/70 backdrop-blur-sm"
          />

          <div className="pointer-events-none flex h-full w-full items-center justify-center p-4 mobile-safe-px mobile-safe-pb mobile-safe-pt">
            <m.div
              {...modalPanel}
              role="dialog"
              aria-modal="true"
              aria-label={service.title}
              className="pointer-events-auto relative flex w-full max-w-2xl max-h-[90dvh] flex-col ts-modal-shell overflow-hidden"
            >
              <ModalHeader title={service.title} icon={Icon} onClose={onClose} />

              <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
                {Content}
              </div>
            </m.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );

  const targetNode = typeof document !== 'undefined' ? (document.getElementById('modal-root') || document.body) : null;
  return targetNode ? createPortal(modalContent, targetNode) : null;
};

export default memo(ServiceModal);
