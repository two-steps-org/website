import React, { useEffect, useState } from 'react';
import { m } from 'framer-motion';
import { Activity, Lock } from 'lucide-react';
import CardContainer from '../shared/CardContainer';

const EncryptionCard: React.FC<{ className?: string }> = ({ className }) => {
  const [label, setLabel] = useState('Total Revenue');
  const [value, setValue] = useState('$42,850');
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeField, setActiveField] = useState<'label' | 'value' | null>(null);
  const [metricMode, setMetricMode] = useState<'revenue' | 'users'>('revenue');

  useEffect(() => {
    let isMounted = true;

    const typeText = async (
      currentText: string,
      targetText: string,
      setter: (s: string) => void,
      field: 'label' | 'value'
    ) => {
      if (!isMounted) return;
      setIsSyncing(true);
      setActiveField(field);

      let tempText = currentText;
      while (tempText.length > 0) {
        if (!isMounted) return;
        await new Promise((r) => setTimeout(r, 40));
        tempText = tempText.slice(0, -1);
        setter(tempText);
      }

      await new Promise((r) => setTimeout(r, 150));

      for (let i = 0; i <= targetText.length; i++) {
        if (!isMounted) return;
        await new Promise((r) => setTimeout(r, 40));
        setter(targetText.slice(0, i));
      }

      if (!isMounted) return;
      await new Promise((r) => setTimeout(r, 400));
      setIsSyncing(false);
      setActiveField(null);
    };

    const loop = async () => {
      await new Promise((r) => setTimeout(r, 1500));

      while (isMounted) {
        await typeText('Total Revenue', 'Active Users', setLabel, 'label');
        await new Promise((r) => setTimeout(r, 1000));

        setMetricMode('users');
        await typeText('$42,850', '12,482', setValue, 'value');
        await new Promise((r) => setTimeout(r, 2000));

        await typeText('Active Users', 'Total Revenue', setLabel, 'label');
        await new Promise((r) => setTimeout(r, 1000));

        setMetricMode('revenue');
        await typeText('12,482', '$42,850', setValue, 'value');
        await new Promise((r) => setTimeout(r, 2000));
      }
    };

    loop();
    return () => {
      isMounted = false;
    };
  }, []);

  const delta = metricMode === 'revenue' ? '+12.4%' : '+8.1%';
  return (
    <CardContainer className={className}>
      <div className="relative flex h-full flex-col overflow-hidden">
        <div className="relative z-10 mb-4">
          <div className="bento-card-title bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Encryption Telemetry
          </div>
        </div>

        <div className="relative z-10 mb-2 flex gap-4">
          <div className="w-1/2 flex justify-center">
            <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-slate-400">What we see</p>
          </div>
          <div className="w-1/2 flex justify-center">
            <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-slate-400">What you see</p>
          </div>
        </div>

        <div className="relative z-10 flex min-h-0 flex-1 gap-4">
          <div className="w-1/2 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/65 shadow-[0_20px_45px_rgba(0,0,0,0.42)] backdrop-blur-md">
            <div className="flex items-center border-b border-white/10 bg-white/[0.02] px-3 py-2">
              <div className="flex gap-[5px]">
                <div className="h-[8px] w-[8px] rounded-full bg-[#ff5f57]" />
                <div className="h-[8px] w-[8px] rounded-full bg-[#febc2e]" />
                <div className="h-[8px] w-[8px] rounded-full bg-[#28c840]" />
              </div>
              <div className="flex-1 flex justify-center">
                <span className="font-mono text-[9px] text-slate-500">MetricCard.tsx</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`h-1.5 w-1.5 rounded-full ${isSyncing ? 'animate-pulse bg-cyan-400' : 'bg-slate-500'}`} />
                <span className="font-mono text-[8px] uppercase tracking-widest text-slate-500">{isSyncing ? 'Syncing' : 'Saved'}</span>
              </div>
            </div>

            <div className="relative p-5 font-mono text-[10px] leading-relaxed text-slate-500 sm:text-[11px]">
              {activeField && (
                <m.div
                  className="absolute left-0 right-0 h-5 border-l-2 border-cyan-400/80 bg-cyan-500/10"
                  initial={{ opacity: 0, top: activeField === 'label' ? 64 : 84 }}
                  animate={{ opacity: 1, top: activeField === 'label' ? 64 : 84 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}

              <div className="relative z-10 space-y-0.5">
                <div className="flex h-5 items-center gap-4">
                  <span className="w-4 select-none text-right text-gray-700">1</span>
                  <span>
                    <span className="text-pink-400">export const</span> <span className="text-blue-300">Metric</span> = () =&gt; (
                  </span>
                </div>
                <div className="flex h-5 items-center gap-4">
                  <span className="w-4 select-none text-right text-gray-700">2</span>
                  <span>
                    {'  '}&lt;<span className="text-purple-400">Card</span>&gt;
                  </span>
                </div>
                <div className="flex h-5 items-center gap-4">
                  <span className="w-4 select-none text-right text-gray-700">3</span>
                  <span>
                    {'    '}&lt;<span className="text-purple-400">Stat</span> <span className="text-orange-300">label</span>="
                    <span className="text-blue-200">{label}</span>"
                    {activeField === 'label' && <span className="ml-0.5 inline-block h-3.5 w-1.5 align-middle bg-cyan-400" />} /&gt;
                  </span>
                </div>
                <div className="flex h-5 items-center gap-4">
                  <span className="w-4 select-none text-right text-gray-700">4</span>
                  <span>
                    {'    '}&lt;<span className="text-purple-400">Value</span>&gt;<span className="text-white/90">{value}</span>
                    {activeField === 'value' && <span className="ml-0.5 inline-block h-3.5 w-1.5 align-middle bg-cyan-400" />}
                    &lt;/<span className="text-purple-400">Value</span>&gt;
                  </span>
                </div>
                <div className="flex h-5 items-center gap-4">
                  <span className="w-4 select-none text-right text-gray-700">5</span>
                  <span>
                    {'  '}&lt;/<span className="text-purple-400">Card</span>&gt;
                  </span>
                </div>
                <div className="flex h-5 items-center gap-4">
                  <span className="w-4 select-none text-right text-gray-700">6</span>
                  <span>);</span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative flex w-1/2 flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-950/35 p-4 shadow-[0_14px_30px_rgba(6,9,20,0.35)]">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent" />

            <div className="relative z-10 mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-400/10">
                  <m.div
                    animate={isSyncing ? { rotate: 360 } : { rotate: 0 }}
                    transition={{ duration: 2.2, ease: 'linear', repeat: isSyncing ? Infinity : 0 }}
                  >
                    <Activity className="h-4 w-4 text-cyan-100" />
                  </m.div>
                </div>
                <div>
                  <p className="text-[9px] font-mono tracking-[0.12em] text-slate-500">LIVE PIPELINE</p>
                  <p className="text-[11px] font-semibold text-slate-200/95">{metricMode === 'revenue' ? 'Revenue Stream' : 'User Stream'}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 rounded-full border border-emerald-400/25 bg-emerald-500/10 px-2 py-1 text-[9px] font-semibold tracking-[0.08em] text-emerald-300">
                <Lock className="h-3 w-3" />
                {delta}
              </div>
            </div>

            <div className="relative z-10 pb-4">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-[9px] font-mono tracking-[0.12em] text-slate-500">LIVE OUTPUT</p>
                <span className="text-[8px] font-semibold tracking-[0.12em] text-cyan-300">
                  {isSyncing ? 'updating' : 'locked'}
                </span>
              </div>
              <p className="text-[10px] tracking-[0.13em] text-slate-400">
                {label}
                {activeField === 'label' && <span className="ml-1 inline-block h-2 w-1 animate-pulse bg-cyan-300 align-middle" />}
              </p>
              <h4 className="mt-1 text-3xl font-black tracking-tight text-white/95">
                {value}
                {activeField === 'value' && <span className="ml-1 inline-block h-5 w-1 animate-pulse bg-cyan-300 align-middle" />}
              </h4>
            </div>

            <div className="relative z-10 mt-1 pb-4">
              <div className="flex items-center justify-between text-[8px] font-mono">
                <span className="text-slate-500">Input</span>
                <span className="text-cyan-200">Encrypt</span>
                <span className="text-slate-500">Output</span>
              </div>
            </div>

            <div className="relative z-10 mt-auto flex items-center justify-between border-t border-white/10 pt-3">
              <span className="text-[9px] font-mono tracking-[0.1em] text-slate-500">SYSTEM HEALTH</span>
              <div className="flex items-center gap-1.5 text-[8px] font-semibold tracking-[0.12em] text-slate-400">
                <span className={`h-1.5 w-1.5 rounded-full ${isSyncing ? 'bg-cyan-300' : 'bg-emerald-300'}`} />
                {isSyncing ? 'Updating' : 'Stable'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </CardContainer>
  );
};

export default React.memo(EncryptionCard);
