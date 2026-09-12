import React from 'react';
import { m } from 'framer-motion';
import { Activity, Lock } from 'lucide-react';

type ActiveField = 'label' | 'value' | null;

interface MetricCodePreviewPanelProps {
  label: string;
  value: string;
  isSyncing: boolean;
  activeField: ActiveField;
}

export function MetricCodePreviewPanel({
  label,
  value,
  isSyncing,
  activeField,
}: MetricCodePreviewPanelProps) {
  return (
    <div className="w-1/2 overflow-hidden rounded-2xl border border-white/10 bg-surface/80 shadow-[0_20px_45px_rgba(0,0,0,0.42)] backdrop-blur-md">
      <div className="flex items-center border-b border-white/10 bg-white/[0.02] px-3 py-2">
        <div className="flex gap-[5px]">
          <div className="h-[8px] w-[8px] rounded-full bg-[#ff5f57]" />
          <div className="h-[8px] w-[8px] rounded-full bg-[#febc2e]" />
          <div className="h-[8px] w-[8px] rounded-full bg-[#28c840]" />
        </div>
        <div className="flex-1 flex justify-center">
          <span className="font-mono text-[9px] text-muted">MetricCard.tsx</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`h-1.5 w-1.5 rounded-full ${isSyncing ? 'animate-pulse bg-ink' : 'bg-line-strong'}`} />
          <span className="font-mono text-[8px] uppercase tracking-widest text-muted">
            {isSyncing ? 'Syncing' : 'Saved'}
          </span>
        </div>
      </div>

      <div className="relative p-5 font-mono text-[10px] leading-relaxed text-muted sm:text-[11px]">
        {activeField && (
          <m.div
            className="absolute left-0 right-0 h-5 border-l-2 border-line-strong bg-ink/10"
            style={{ top: activeField === 'label' ? 64 : 84 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        )}

        <div className="relative z-10 space-y-0.5">
          <div className="flex h-5 items-center gap-4">
            <span className="w-4 select-none text-right text-muted">1</span>
            <span>
              <span className="text-ink">export const</span> <span className="text-ink">Metric</span> = () =&gt; (
            </span>
          </div>
          <div className="flex h-5 items-center gap-4">
            <span className="w-4 select-none text-right text-muted">2</span>
            <span>
              {'  '}&lt;<span className="text-ink">Card</span>&gt;
            </span>
          </div>
          <div className="flex h-5 items-center gap-4">
            <span className="w-4 select-none text-right text-muted">3</span>
            <span>
              {'    '}&lt;<span className="text-ink">Stat</span> <span className="text-ink">label</span>="
              <span className="text-ink">{label}</span>"
              {activeField === 'label' && <span className="ml-0.5 inline-block h-3.5 w-1.5 align-middle bg-ink" />} /&gt;
            </span>
          </div>
          <div className="flex h-5 items-center gap-4">
            <span className="w-4 select-none text-right text-muted">4</span>
            <span>
              {'    '}&lt;<span className="text-ink">Value</span>&gt;<span className="text-white/90">{value}</span>
              {activeField === 'value' && <span className="ml-0.5 inline-block h-3.5 w-1.5 align-middle bg-ink" />}
              &lt;/<span className="text-ink">Value</span>&gt;
            </span>
          </div>
          <div className="flex h-5 items-center gap-4">
            <span className="w-4 select-none text-right text-muted">5</span>
            <span>
              {'  '}&lt;/<span className="text-ink">Card</span>&gt;
            </span>
          </div>
          <div className="flex h-5 items-center gap-4">
            <span className="w-4 select-none text-right text-muted">6</span>
            <span>);</span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface LiveMetricPanelProps {
  label: string;
  value: string;
  isSyncing: boolean;
  activeField: ActiveField;
  delta: string;
  streamLabel: string;
}

export function LiveMetricPanel({
  label,
  value,
  isSyncing,
  activeField,
  delta,
  streamLabel,
}: LiveMetricPanelProps) {
  return (
    <div className="relative flex w-1/2 flex-col overflow-hidden rounded-2xl border border-white/10 bg-bg/35 p-4 shadow-[0_14px_30px_rgba(6,9,20,0.35)]">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent" />

      <div className="relative z-10 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-ink/10">
            <m.div
              animate={isSyncing ? { rotate: 360 } : { rotate: 0 }}
              transition={{ duration: 2.2, ease: 'linear', repeat: isSyncing ? Infinity : 0 }}
            >
              <Activity className="h-4 w-4 text-ink" />
            </m.div>
          </div>
          <div>
            <p className="text-[9px] font-mono tracking-[0.12em] text-muted">LIVE PIPELINE</p>
            <p className="text-[11px] font-semibold text-ink/95">{streamLabel}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 rounded-full border border-line bg-[var(--status-success-bg)] px-2 py-1 text-[9px] font-semibold tracking-[0.08em] text-status-success">
          <Lock className="h-3 w-3" />
          {delta}
        </div>
      </div>

      <div className="relative z-10 pb-4">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[9px] font-mono tracking-[0.12em] text-muted">LIVE OUTPUT</p>
          <span className="text-[8px] font-semibold tracking-[0.12em] text-ink">
            {isSyncing ? 'updating' : 'locked'}
          </span>
        </div>
        <p className="text-[10px] tracking-[0.13em] text-muted">
          {label}
          {activeField === 'label' && <span className="ml-1 inline-block h-2 w-1 animate-pulse bg-ink align-middle" />}
        </p>
        <h4 className="mt-1 text-3xl font-black tracking-tight text-white/95">
          {value}
          {activeField === 'value' && <span className="ml-1 inline-block h-5 w-1 animate-pulse bg-ink align-middle" />}
        </h4>
      </div>

      <div className="relative z-10 mt-1 pb-4">
        <div className="flex items-center justify-between text-[8px] font-mono">
          <span className="text-muted">Input</span>
          <span className="text-ink">Encrypt</span>
          <span className="text-muted">Output</span>
        </div>
      </div>

      <div className="relative z-10 mt-auto flex items-center justify-between border-t border-white/10 pt-3">
        <span className="text-[9px] font-mono tracking-[0.1em] text-muted">SYSTEM HEALTH</span>
        <div className="flex items-center gap-1.5 text-[8px] font-semibold tracking-[0.12em] text-muted">
          <span className={`h-1.5 w-1.5 rounded-full ${isSyncing ? 'bg-ink' : 'bg-status-success'}`} />
          {isSyncing ? 'Updating' : 'Stable'}
        </div>
      </div>
    </div>
  );
}
