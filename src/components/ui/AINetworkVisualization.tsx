import React from 'react';
import { cn } from '../../lib/utils';
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
};

type ConnectionProps = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  delay: number;
  useMobileGradient?: boolean;
};

const CustomIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 186.77 160.8" 
    className={cn("block overflow-visible", className)} 
    preserveAspectRatio="xMidYMid meet"
  >
    <polygon 
      fill="#ffffff"
      points="93.65 78.07 52.85 148.06 68.84 148.06 93.08 106.12 125.69 160.8 110.56 160.8 93.26 131.8 76.5 160.8 30.38 160.8 93.78 52.04 148.37 147.8 164.13 147.8 92.93 25.88 15.01 160.8 0 160.8 92.87 0 186.77 160.8 140.82 160.8 93.65 78.07"
    />
  </svg>
);

export function AINetworkVisualization({ className, simplified = false }: AINetworkVisualizationProps) {
  
  if (simplified) {
    return (
      <div className={cn('relative w-full h-full flex items-center justify-center', className)}>
        <div className="relative w-full max-w-[360px] h-[360px] flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 360 360">
            <defs>
              <linearGradient id="line-grad-mobile" gradientUnits="userSpaceOnUse" x1="180" y1="50" x2="180" y2="310">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.1" />
                <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <Connection x1={180} y1={180} x2={180} y2={50} delay={0} useMobileGradient />
            <Connection x1={180} y1={180} x2={305} y2={95} delay={0} useMobileGradient />
            <Connection x1={180} y1={180} x2={305} y2={265} delay={0} useMobileGradient />
            <Connection x1={180} y1={180} x2={180} y2={310} delay={0} useMobileGradient />
            <Connection x1={180} y1={180} x2={55} y2={265} delay={0} useMobileGradient />
            <Connection x1={180} y1={180} x2={55} y2={95} delay={0} useMobileGradient />
          </svg>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <div className="absolute inset-0 bg-blue-500/10 rounded-full animate-pulse" />
              <div className="relative z-10 w-16 h-16 bg-gray-900/80 backdrop-blur-xl rounded-full flex items-center justify-center border border-blue-500/30 shadow-lg">
                <CustomIcon className="w-[42px] h-[42px] translate-x-[1px] -translate-y-[4px]" />
              </div>
            </div>
          </div>

          {/* SWAPPED MOBILE LOCATIONS */}
          <Node icon={<Cpu className="text-purple-400" />} title="LLM Engine" desc="Reasoning" style={{ top: '14%', left: '50%' }} simplified />
          <Node icon={<Database className="text-cyan-400" />} title="Vector Store" desc="Knowledge" style={{ top: '26%', left: '85%' }} simplified />
          <Node icon={<Zap className="text-yellow-400" />} title="Realtime API" desc="Automation" style={{ top: '74%', left: '85%' }} simplified />
          <Node icon={<Shield className="text-emerald-400" />} title="Security" desc="Privacy" style={{ top: '86%', left: '50%' }} simplified />
          <Node icon={<BarChart3 className="text-pink-400" />} title="Analytics" desc="Insights" style={{ top: '74%', left: '15%' }} simplified />
          <Node icon={<LinkIcon className="text-indigo-400" />} title="Connectors" desc="Integrations" style={{ top: '26%', left: '15%' }} simplified />
        </div>
      </div>
    );
  }

  return (
    <div className={cn('relative w-full h-full flex items-center justify-center', className)}>
      <div className="relative w-full max-w-[500px] aspect-[500/580] flex items-center justify-center translate-y-8 translate-x-12">
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 500 580">
          <defs>
            <linearGradient id="line-grad" gradientUnits="userSpaceOnUse" x1="250" y1="70" x2="250" y2="510">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <Connection x1={250} y1={290} x2={250} y2={70} delay={0} />
          <Connection x1={250} y1={290} x2={440} y2={174} delay={0} />
          <Connection x1={250} y1={290} x2={440} y2={406} delay={0} />
          <Connection x1={250} y1={290} x2={250} y2={510} delay={0} />
          <Connection x1={250} y1={290} x2={60} y2={406} delay={0} />
          <Connection x1={250} y1={290} x2={60} y2={174} delay={0} />
        </svg>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="relative w-28 h-28 flex items-center justify-center">
            <div className="absolute inset-0 border-2 border-blue-500/20 rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute inset-3 border border-purple-500/20 rounded-full opacity-30 group-hover:opacity-80 transition-opacity duration-500" />
            
            <div className="relative z-10 w-20 h-20 bg-gray-900/50 backdrop-blur-lg rounded-full flex items-center justify-center border border-gray-800/50 group cursor-pointer transition-all duration-500 hover:scale-110">
              <CustomIcon className="w-[50px] h-[50px] translate-x-[1px] -translate-y-[4px]" />
            </div>
          </div>
        </div>

        {/* SWAPPED DESKTOP LOCATIONS */}
        <Node icon={<Cpu className="text-purple-400" />} title="LLM Engine" desc="Reasoning" style={{ top: '12%', left: '50%' }} />
        <Node icon={<Database className="text-cyan-400" />} title="Vector Store" desc="Database" style={{ top: '30%', left: '88%' }} />
        <Node icon={<Zap className="text-yellow-400" />} title="Realtime API" desc="Automation" style={{ top: '70%', left: '88%' }} />
        <Node icon={<Shield className="text-emerald-400" />} title="Security" desc="Privacy Layer" style={{ top: '88%', left: '50%' }} />
        <Node icon={<BarChart3 className="text-pink-400" />} title="Analytics" desc="Insights" style={{ top: '70%', left: '12%' }} />
        <Node icon={<LinkIcon className="text-indigo-400" />} title="Connectors" desc="Integrations" style={{ top: '30%', left: '12%' }} />
      </div>
    </div>
  );
}

function Node({ icon, title, desc, style, simplified = false }: NodeProps) {
  return (
    <div className="absolute z-30 -translate-x-1/2 -translate-y-1/2 group" style={style}>
      <div className={cn(
        'relative flex items-center gap-3 rounded-xl bg-gray-900/50 backdrop-blur-lg border border-gray-800/50 transition-all duration-500 shadow-lg',
        simplified ? 'w-36 h-12 p-2' : 'w-40 h-16 p-2.5 hover:scale-105 hover:border-blue-500/30'
      )}>
        <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center shrink-0 border border-white/5 group-hover:bg-blue-500/10">
          {React.cloneElement(icon, { size: 18 })}
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-[11px] font-bold text-slate-100 leading-tight truncate">{title}</span>
          <span className="text-[9px] text-slate-400 font-medium uppercase tracking-widest mt-0.5 group-hover:text-blue-300 transition-colors truncate">{desc}</span>
        </div>
      </div>
    </div>
  );
}

function Connection({ x1, y1, x2, y2, delay, useMobileGradient }: ConnectionProps) {
  const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  // Skip animations during prerendering (react-snap)
  const isPrerender = typeof window === 'undefined';
  
  if (isPrerender) {
    return (
      <g>
        <path d={`M${x1} ${y1} L${x2} ${y2}`} stroke={useMobileGradient ? 'url(#line-grad-mobile)' : 'url(#line-grad)'} strokeWidth="2" fill="none" opacity="0.3" />
      </g>
    );
  }
  
  return (
    <g>
      <path d={`M${x1} ${y1} L${x2} ${y2}`} stroke={useMobileGradient ? 'url(#line-grad-mobile)' : 'url(#line-grad)'} strokeWidth="2" fill="none" opacity="0.3" />
      <path d={`M${x1} ${y1} L${x2} ${y2}`} stroke="#60a5fa" strokeWidth="2.5" fill="none" strokeDasharray={`40 ${length}`} className="drop-shadow-[0_0_6px_rgba(96,165,250,0.6)]">
        <animate attributeName="stroke-dashoffset" values={`${length + 40};${-40}`} dur="2.5s" repeatCount="indefinite" begin={`${delay}s`} />
        <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.2;0.8;1" dur="2.5s" repeatCount="indefinite" begin={`${delay}s`} />
      </path>
    </g>
  );
}
