import React from 'react';
import { m } from 'framer-motion';
import { FileCode, Cloud, Lock } from 'lucide-react';
import CardContainer from '../shared/CardContainer';

const fileTypes = [
  { name: 'JSON', icon: FileCode, color: 'text-emerald-400' },
  { name: 'API', icon: Cloud, color: 'text-blue-400' },
];

// --- Sub-component: Infinite Scrolling Data Row ---
const DataStreamRow = ({ y, speed, opacity, content }: { y: string; speed: number; opacity: number; content: string }) => {
  return (
    <div 
      className="absolute left-0 right-0 flex overflow-hidden pointer-events-none" 
      style={{ top: y, opacity }}
    >
      <div
        className="flex whitespace-nowrap font-mono text-[10px] text-emerald-500/80 select-none animate-marquee"
        style={{ animationDuration: `${speed}s` }}
      >
        {/* Render content twice to ensure no gaps during the loop */}
        <span className="mr-8">{content}</span>
        <span className="mr-8">{content}</span>
      </div>
    </div>
  );
};

const DataEncryptionCard: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <CardContainer className={className}>
      <div className="flex flex-col h-full relative z-10 overflow-hidden">
        
        {/* Header Section */}
        <div className="mb-4">
          <div className="bento-card-title bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Data Encryption
          </div>
        </div>

        {/* Visual Engine - Horizontal Layout */}
        <div className="flex-1 flex items-center justify-between w-full relative min-h-0 overflow-hidden gap-6">
          
          {/* Left: File Icons */}
          <div className="flex flex-col gap-3 z-20">
            {fileTypes.map((file, idx) => (
              <m.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.2 }}
                className="w-12 h-12 bg-gray-950 border border-white/[0.08] rounded-lg flex flex-col items-center justify-center gap-1 relative shadow-lg group"
              >
                {/* Corner Fold */}
                <div className="absolute -top-[1px] -right-[1px] w-0 h-0 border-l-[8px] border-l-transparent border-b-[8px] border-b-white/[0.08] border-r-[8px] border-r-transparent rounded-br-lg" />
                
                <file.icon className={`w-4 h-4 ${file.color} group-hover:scale-110 transition-transform duration-300`} />
                <span className="text-[7px] font-mono font-semibold text-gray-500 group-hover:text-gray-300 transition-colors">
                  {file.name}
                </span>
              </m.div>
            ))}
          </div>

          {/* Center: Encryption Barrier (Vertical Line) */}
          <div className="h-full w-px bg-gradient-to-b from-transparent via-blue-500/50 to-transparent relative mx-2">
            {/* Laser Scanner */}
            <m.div 
              className="absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 bg-blue-400 blur-[2px]"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            
            {/* Central Lock */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
              <m.div
                className="w-10 h-10 rounded-full bg-gray-950 border border-blue-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                animate={{ 
                  boxShadow: ['0 0 15px rgba(59,130,246,0.2)', '0 0 25px rgba(59,130,246,0.5)', '0 0 15px rgba(59,130,246,0.2)'],
                  borderColor: ['rgba(59,130,246,0.3)', 'rgba(59,130,246,0.6)', 'rgba(59,130,246,0.3)'],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Lock className="w-4 h-4 text-blue-400" />
              </m.div>
            </div>
          </div>

          {/* Right: Encrypted Data Stream Background */}
          <div className="flex-1 h-full relative overflow-hidden rounded-lg border border-white/[0.05] bg-gray-950/50 mask-linear-fade">
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-900/5 to-emerald-900/20" />
             
             {/* Data Rows */}
             <div className="flex flex-col justify-center h-full gap-4 py-2">
               <DataStreamRow 
                 y="auto" 
                 speed={15} 
                 opacity={0.3} 
                 content="0x1A4F 8B2C 9D3E 0x5F1A 7C8B 2D9E 0x3F4A 1B2C 8D9E" 
               />
               <DataStreamRow 
                 y="auto" 
                 speed={20} 
                 opacity={0.6} 
                 content="ENCRYPTED_PAYLOAD_V2_SECURE_CHANNEL_ESTABLISHED" 
               />
               <DataStreamRow 
                 y="auto" 
                 speed={12} 
                 opacity={0.4} 
                 content=":: AES-256-GCM :: SHA-384 :: RSA-4096 :: TLS 1.3" 
               />
             </div>
          </div>

        </div>
      </div>
    </CardContainer>
  );
};

export default React.memo(DataEncryptionCard);
