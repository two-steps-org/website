import React from 'react';
import clsx from 'clsx';
import { useInView } from '../../utils/useInView';
import { useReducedMotionQuery } from '../../utils/scroll';
import {
  Database,
  Cpu,
  Zap,
  Shield,
  BarChart3,
  Link as LinkIcon,
} from 'lucide-react';

export type AINetworkVisualizationProps = {
  className?: string;
  simplified?: boolean;
};

type NodeProps = {
  icon: React.ReactElement<{ size?: number }>;
  title: string;
  desc: string;
  style: React.CSSProperties;
  simplified?: boolean;
  delayMs?: number;
};

type ConnectionProps = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  delay: number;
  useMobileGradient?: boolean;
  running: boolean;
};

const CustomIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 186.77 160.8"
    className={clsx('block overflow-visible text-ink', className)}
    preserveAspectRatio="xMidYMid meet"
    aria-hidden
  >
    <polygon
      fill="currentColor"
      points="93.65 78.07 52.85 148.06 68.84 148.06 93.08 106.12 125.69 160.8 110.56 160.8 93.26 131.8 76.5 160.8 30.38 160.8 93.78 52.04 148.37 147.8 164.13 147.8 92.93 25.88 15.01 160.8 0 160.8 92.87 0 186.77 160.8 140.82 160.8 93.65 78.07"
    />
  </svg>
);

export function AINetworkVisualization({ className, simplified = false }: AINetworkVisualizationProps) {
  const { ref, inView } = useInView('0px');
  const reduce = useReducedMotionQuery();
  const running = inView && !reduce;

  if (simplified) {
    return (
      <div ref={ref} className={clsx('relative flex h-full w-full items-center justify-center', className)}>
        <div className="relative flex aspect-square w-full max-w-[360px] items-center justify-center">
          <svg className="pointer-events-none absolute inset-0 z-0 h-full w-full" viewBox="0 0 360 360" aria-hidden>
            <defs>
              <linearGradient id="line-grad-mobile" gradientUnits="userSpaceOnUse" x1="180" y1="50" x2="180" y2="310">
                <stop offset="0%" stopColor="#F5F6F8" stopOpacity="0.1" />
                <stop offset="50%" stopColor="#F5F6F8" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#F5F6F8" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <Connection running={running} x1={180} y1={180} x2={180} y2={50} delay={0} useMobileGradient />
            <Connection running={running} x1={180} y1={180} x2={305} y2={95} delay={0} useMobileGradient />
            <Connection running={running} x1={180} y1={180} x2={305} y2={265} delay={0} useMobileGradient />
            <Connection running={running} x1={180} y1={180} x2={180} y2={310} delay={0} useMobileGradient />
            <Connection running={running} x1={180} y1={180} x2={55} y2={265} delay={0} useMobileGradient />
            <Connection running={running} x1={180} y1={180} x2={55} y2={95} delay={0} useMobileGradient />
          </svg>

          <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
            <div data-hero-hub className="hero-hub-enter relative flex h-20 w-20 items-center justify-center">
              <div className={clsx('absolute inset-0 rounded-full bg-ink/10', running && 'animate-pulse')} />
              <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full ts-glass shadow-lg">
                <CustomIcon className="h-[42px] w-[42px] translate-x-[1px] -translate-y-[4px]" />
              </div>
            </div>
          </div>

          <Node icon={<Cpu className="text-ink" />} title="LLM Engine" desc="Reasoning" style={{ top: '14%', left: '50%' }} simplified delayMs={120} />
          <Node icon={<Database className="text-ink" />} title="Vector Store" desc="Knowledge" style={{ top: '26%', left: '85%' }} simplified delayMs={180} />
          <Node icon={<Zap className="text-ink" />} title="Realtime API" desc="Automation" style={{ top: '74%', left: '85%' }} simplified delayMs={240} />
          <Node icon={<Shield className="text-ink" />} title="Security" desc="Privacy" style={{ top: '86%', left: '50%' }} simplified delayMs={300} />
          <Node icon={<BarChart3 className="text-ink" />} title="Analytics" desc="Insights" style={{ top: '74%', left: '15%' }} simplified delayMs={360} />
          <Node icon={<LinkIcon className="text-ink" />} title="Connectors" desc="Integrations" style={{ top: '26%', left: '15%' }} simplified delayMs={420} />
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className={clsx('relative flex h-full w-full items-center justify-center', className)}>
      <div className="relative flex aspect-[500/580] h-full w-full max-w-[500px] translate-x-12 items-center justify-center">
        <svg className="pointer-events-none absolute inset-0 z-0 h-full w-full" viewBox="0 0 500 580" aria-hidden>
          <defs>
            <linearGradient id="line-grad" gradientUnits="userSpaceOnUse" x1="250" y1="70" x2="250" y2="510">
              <stop offset="0%" stopColor="#F5F6F8" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#F5F6F8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#F5F6F8" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <Connection running={running} x1={250} y1={290} x2={250} y2={70} delay={0} />
          <Connection running={running} x1={250} y1={290} x2={440} y2={174} delay={0} />
          <Connection running={running} x1={250} y1={290} x2={440} y2={406} delay={0} />
          <Connection running={running} x1={250} y1={290} x2={250} y2={510} delay={0} />
          <Connection running={running} x1={250} y1={290} x2={60} y2={406} delay={0} />
          <Connection running={running} x1={250} y1={290} x2={60} y2={174} delay={0} />
        </svg>

        <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
          <div data-hero-hub className="hero-hub-enter hero-network-node relative flex h-28 w-28 items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-line-strong opacity-50 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="absolute inset-3 rounded-full border border-line opacity-30 transition-opacity duration-500 group-hover:opacity-80" />

            <div className="hero-network-card relative z-10 flex h-20 w-20 items-center justify-center rounded-full ts-glass">
              <CustomIcon className="h-[50px] w-[50px] translate-x-[1px] -translate-y-[4px]" />
            </div>
          </div>
        </div>

        <Node icon={<Cpu className="text-ink" />} title="LLM Engine" desc="Reasoning" style={{ top: '12%', left: '50%' }} delayMs={140} />
        <Node icon={<Database className="text-ink" />} title="Vector Store" desc="Knowledge" style={{ top: '30%', left: '88%' }} delayMs={200} />
        <Node icon={<Zap className="text-ink" />} title="Realtime API" desc="Automation" style={{ top: '70%', left: '88%' }} delayMs={260} />
        <Node icon={<Shield className="text-ink" />} title="Security" desc="Privacy" style={{ top: '88%', left: '50%' }} delayMs={320} />
        <Node icon={<BarChart3 className="text-ink" />} title="Analytics" desc="Insights" style={{ top: '70%', left: '12%' }} delayMs={380} />
        <Node icon={<LinkIcon className="text-ink" />} title="Connectors" desc="Integrations" style={{ top: '30%', left: '12%' }} delayMs={440} />
      </div>
    </div>
  );
}

function Node({ icon, title, desc, style, simplified = false, delayMs = 0 }: NodeProps) {
  return (
    <div
      className="hero-network-node absolute z-30 -translate-x-1/2 -translate-y-1/2 group"
      style={style}
    >
      <div
        className="hero-node-enter"
        style={{ animationDelay: `${delayMs}ms` }}
      >
        <div
          className={clsx(
            'hero-network-card relative flex items-center gap-3 rounded-xl ts-card shadow-lg',
            simplified ? 'h-12 w-36 p-2' : 'h-16 w-40 p-2.5',
          )}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line bg-ink/[0.06] group-hover:bg-ink/10">
            {React.cloneElement(icon, { size: 18 })}
          </div>
          <div className="min-w-0 flex-1 flex-col">
            <span className="truncate text-[11px] font-bold leading-tight text-ink">{title}</span>
            <span className="mt-0.5 truncate text-[9px] font-medium uppercase tracking-widest text-muted transition-colors group-hover:text-ink">{desc}</span>
          </div>
      </div>
      </div>
    </div>
  );
}

function Connection({ x1, y1, x2, y2, delay, useMobileGradient, running }: ConnectionProps) {
  const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

  const stroke = useMobileGradient ? 'url(#line-grad-mobile)' : 'url(#line-grad)';

  if (!running) {
    return (
      <g>
        <path d={`M${x1} ${y1} L${x2} ${y2}`} stroke={stroke} strokeWidth="2" fill="none" opacity="0.35" />
      </g>
    );
  }

  return (
    <g>
      <path d={`M${x1} ${y1} L${x2} ${y2}`} stroke={stroke} strokeWidth="2" fill="none" opacity="0.35" />
      <path
        d={`M${x1} ${y1} L${x2} ${y2}`}
        stroke="#F5F6F8"
        strokeWidth="2.5"
        fill="none"
        strokeDasharray={`40 ${length}`}
      >
        <animate attributeName="stroke-dashoffset" values={`${length + 40};${-40}`} dur="2.5s" repeatCount="indefinite" begin={`${delay}s`} />
        <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.2;0.8;1" dur="2.5s" repeatCount="indefinite" begin={`${delay}s`} />
      </path>
    </g>
  );
}
