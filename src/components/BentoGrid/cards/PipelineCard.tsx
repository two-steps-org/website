import React, { useState, useEffect } from 'react';
import { m } from 'framer-motion';
import {
  Cpu,
  Zap,
  CheckCircle2,
  GitBranch,
  Sparkles,
} from 'lucide-react';
import CardContainer from '../shared/CardContainer';

type Token = { text: string; color: string };
type CodeLine = { lineNo: number; tokens: Token[]; stepIdx?: number };

// Trimmed to just the run() method — keeps active lines (5–7) prominent
const codeLines: CodeLine[] = [
  { lineNo: 1, tokens: [
    { text: 'import', color: 'text-ink' },
    { text: ' { Agent } ', color: 'text-muted' },
    { text: 'from', color: 'text-ink' },
    { text: " './core'", color: 'text-status-success' },
  ]},
  { lineNo: 2, tokens: [] },
  { lineNo: 3, tokens: [
    { text: 'class', color: 'text-ink' },
    { text: ' Pipeline ', color: 'text-ink' },
    { text: 'extends', color: 'text-ink' },
    { text: ' Agent ', color: 'text-ink' },
    { text: '{', color: 'text-ink' },
  ]},
  { lineNo: 4, tokens: [
    { text: '  ', color: '' },
    { text: 'async', color: 'text-ink' },
    { text: ' run', color: 'text-ink' },
    { text: '(', color: 'text-ink' },
    { text: 'q', color: 'text-ink' },
    { text: ') {', color: 'text-ink' },
  ]},
  { lineNo: 5, tokens: [
    { text: '    ', color: '' },
    { text: 'const', color: 'text-ink' },
    { text: ' i ', color: 'text-ink' },
    { text: '= await ', color: 'text-muted' },
    { text: 'this', color: 'text-ink' },
    { text: '.', color: 'text-muted' },
    { text: 'parse', color: 'text-ink' },
    { text: '(q)', color: 'text-ink' },
  ], stepIdx: 0 },
  { lineNo: 6, tokens: [
    { text: '    ', color: '' },
    { text: 'const', color: 'text-ink' },
    { text: ' p ', color: 'text-ink' },
    { text: '= await ', color: 'text-muted' },
    { text: 'this', color: 'text-ink' },
    { text: '.', color: 'text-muted' },
    { text: 'plan', color: 'text-ink' },
    { text: '(i)', color: 'text-ink' },
  ], stepIdx: 1 },
  { lineNo: 7, tokens: [
    { text: '    ', color: '' },
    { text: 'const', color: 'text-ink' },
    { text: ' r ', color: 'text-ink' },
    { text: '= await ', color: 'text-muted' },
    { text: 'this', color: 'text-ink' },
    { text: '.', color: 'text-muted' },
    { text: 'exec', color: 'text-ink' },
    { text: '(p)', color: 'text-ink' },
  ], stepIdx: 2 },
  { lineNo: 8, tokens: [
    { text: '    ', color: '' },
    { text: 'return', color: 'text-ink' },
    { text: ' r', color: 'text-ink' },
  ]},
  { lineNo: 9, tokens: [
    { text: '  }', color: 'text-ink' },
  ]},
  { lineNo: 10, tokens: [
    { text: '}', color: 'text-ink' },
  ]},
];

const steps = [
  {
    id: 1,
    label: 'Parse Query',
    detail: 'Analyzing intent',
    icon: Cpu,
    color: 'text-ink',
    bg: 'bg-ink/15',
    border: 'border-line-strong',
    glow: '0 0 16px rgba(168,85,247,0.25)',
    dot: 'bg-ink shadow-[0_0_10px_rgba(168,85,247,0.55)]',
  },
  {
    id: 2,
    label: 'Build Plan',
    detail: '3 steps queued',
    icon: GitBranch,
    color: 'text-ink',
    bg: 'bg-ink/15',
    border: 'border-line-strong',
    glow: '0 0 16px rgba(59,130,246,0.25)',
    dot: 'bg-ink shadow-[0_0_10px_rgba(59,130,246,0.55)]',
  },
  {
    id: 3,
    label: 'Execute',
    detail: 'Running tasks',
    icon: Zap,
    color: 'text-status-warning',
    bg: 'bg-[var(--status-warning-bg)]',
    border: 'border-line',
    glow: '0 0 16px rgba(251,191,36,0.2)',
    dot: 'bg-status-warning shadow-[0_0_10px_rgba(251,191,36,0.5)]',
  },
];

const EDITOR_PADDING_TOP = 16;  // matches p-4
const EDITOR_ROW_PITCH = 22;    // h-5 (20px) + space-y-0.5 (2px)

const PipelineCard: React.FC<{ className?: string; index?: number }> = ({ className, index }) => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((p) => (p + 1) % (steps.length + 1)), 2200);
    return () => clearInterval(id);
  }, []);

  const done = active === steps.length;
  const activeStepLineIndex = codeLines.findIndex((line) => line.stepIdx === active);

  return (
    <CardContainer className={className} index={index}>
      <div className="relative flex h-full flex-col overflow-hidden">

        {/* Header */}
        <div className="relative z-10 mb-3">
          <div className="bento-card-title text-ink">
            Agent Workflow
          </div>
        </div>

        {/* Column labels — widths match the panels below */}
        <div className="relative z-10 mb-1.5 flex gap-3">
          <div className="flex-1 flex justify-center">
            <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-muted">Your Code</p>
          </div>
          <div className="w-[42%] flex justify-center">
            <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-muted">Live Pipeline</p>
          </div>
        </div>

        {/* Split: Code | Pipeline */}
        <div className="relative z-10 flex min-h-0 flex-1 gap-3">

          {/* LEFT — Code Editor */}
          <div className="flex-1 overflow-hidden rounded-2xl border border-white/10 bg-surface/80 shadow-[0_20px_45px_rgba(0,0,0,0.42)] backdrop-blur-md flex flex-col min-w-0">
            {/* macOS title bar */}
            <div className="flex flex-shrink-0 items-center border-b border-white/10 bg-white/[0.02] px-3 py-2">
              <div className="flex gap-[5px]">
                <div className="w-2 h-2 rounded-full bg-[#ff5f57]" />
                <div className="w-2 h-2 rounded-full bg-[#febc2e]" />
                <div className="w-2 h-2 rounded-full bg-[#28c840]" />
              </div>
              <div className="flex-1 flex justify-center">
                <span className="font-mono text-[9px] text-muted">pipeline.ts</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className={`h-1.5 w-1.5 rounded-full transition-colors duration-500 ${!done ? 'animate-pulse bg-ink' : 'bg-status-success'}`} />
                <span className="font-mono text-[8px] uppercase tracking-widest text-muted">{!done ? 'Running' : 'Done'}</span>
              </div>
            </div>

            {/* Code lines */}
            <div className="relative flex-1 overflow-hidden p-4 font-mono text-[10px] leading-relaxed text-muted sm:text-[11px]">
              {activeStepLineIndex !== -1 && (
                <m.div
                  style={{ top: EDITOR_PADDING_TOP }}
                  initial={{ y: 0 }}
                  animate={{ y: activeStepLineIndex * EDITOR_ROW_PITCH }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="absolute left-0 right-0 h-5 border-l-2 border-line-strong bg-ink/10"
                />
              )}
              <div className="relative z-10 space-y-0.5">
                {codeLines.map((line) => {
                  const isActive = line.stepIdx !== undefined && active === line.stepIdx;
                  return (
                    <div key={line.lineNo} className="flex h-5 items-center gap-4">
                      <span className="w-4 select-none text-right text-muted">{line.lineNo}</span>
                      <span>
                        {line.tokens.length === 0
                          ? <span>&nbsp;</span>
                          : line.tokens.map((tok, j) => (
                              <span key={j} className={tok.color}>{tok.text}</span>
                            ))
                        }
                        {isActive && (
                          <span className="ml-0.5 inline-block h-3.5 w-[3px] animate-pulse align-middle bg-ink" />
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT — Live Pipeline */}
          <div className="relative flex w-[42%] min-w-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-bg/40 p-3 shadow-[0_14px_30px_rgba(6,9,20,0.35)]">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent" />

            <div className="relative z-10 flex flex-1 flex-col gap-2 min-h-0">
              {/* Vertical connector line */}
              <div className="absolute left-[6px] top-2 bottom-2 w-px bg-line-strong" />

              {steps.map((s, i) => {
                const isActive = active === i;
                const isPast = active > i || done;
                const isWaiting = !isActive && !isPast;

                return (
                  <div key={s.id} className="relative flex flex-1 min-h-0 items-center gap-2.5">
                    {/* Timeline dot */}
                    <div className={`
                      relative z-10 flex h-[13px] w-[13px] flex-shrink-0 items-center justify-center rounded-full transition-all duration-500
                      ${isActive ? s.dot : isPast ? 'bg-status-success shadow-[0_0_8px_rgba(34,197,94,0.45)]' : 'border border-line-strong bg-surface-2'}
                    `}>
                      {isPast && <CheckCircle2 className="h-2 w-2 text-white" />}
                    </div>

                    {/* Step card */}
                    <div
                      className={`
                        flex flex-1 h-full items-center gap-2.5 rounded-xl border px-2.5 transition-all duration-500
                        ${isActive
                          ? `${s.bg} ${s.border}`
                          : isPast
                            ? 'border-white/[0.05] bg-white/[0.02]'
                            : 'border-white/[0.03] bg-white/[0.01]'
                        }
                      `}
                      style={isActive ? { boxShadow: s.glow } : undefined}
                    >
                      {/* Icon */}
                      <div className={`
                        flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg border transition-all duration-500
                        ${isActive ? `${s.bg} ${s.border}` : isPast ? 'border-line bg-[var(--status-success-bg)]' : 'border-line bg-surface/80'}
                      `}>
                        {isPast && !isActive
                          ? <CheckCircle2 className="h-3.5 w-3.5 text-status-success" />
                          : <s.icon className={`h-3.5 w-3.5 transition-colors duration-500 ${isActive ? s.color : 'text-muted'}`} />
                        }
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className={`truncate text-[11px] font-semibold transition-colors duration-500 ${
                          isActive ? 'text-ink' : isPast ? 'text-muted' : 'text-muted'
                        }`}>
                          {s.label}
                        </div>
                        <div className={`truncate text-[9px] transition-colors duration-500 ${
                          isActive ? 'text-muted' : isPast ? 'text-status-success/60' : 'text-muted'
                        }`}>
                          {isPast && !isActive ? '✓ Completed' : isWaiting ? 'Waiting...' : s.detail}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Pipeline Complete row */}
              <div className="relative flex flex-1 min-h-0 items-center gap-2.5">
                <div className={`
                  relative z-10 flex h-[13px] w-[13px] flex-shrink-0 items-center justify-center rounded-full transition-all duration-500
                  ${done ? 'bg-status-success shadow-[0_0_12px_rgba(34,197,94,0.65)]' : 'border border-line-strong bg-surface-2'}
                `}>
                  {done && <CheckCircle2 className="h-2 w-2 text-white" />}
                </div>

                <m.div
                  animate={done ? { opacity: 1, scale: 1 } : { opacity: 0.3, scale: 0.98 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className={`
                    flex flex-1 h-full items-center justify-center gap-1.5 rounded-xl border transition-colors duration-500
                    ${done ? 'border-[var(--status-success)] bg-[var(--status-success-bg)]' : 'border-white/[0.03] bg-white/[0.01]'}
                  `}
                  style={done ? { boxShadow: '0 0 20px rgba(34,197,94,0.15)' } : undefined}
                >
                  {done && (
                    <m.span
                      initial={{ rotate: -10, scale: 0.5, opacity: 0 }}
                      animate={{ rotate: 0, scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    >
                      <Sparkles className="h-3 w-3 text-status-success" />
                    </m.span>
                  )}
                  <span className={`text-[11px] font-bold transition-colors duration-500 ${done ? 'text-status-success' : 'text-muted'}`}>
                    Pipeline Complete
                  </span>
                </m.div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </CardContainer>
  );
};

export default React.memo(PipelineCard);
