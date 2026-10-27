import React, { useRef } from 'react';
import clsx from 'clsx';
import { m, useInView } from 'framer-motion';
import { FileCode, Cloud, Lock } from 'lucide-react';
import CardContainer from '../shared/CardContainer';
import { useReducedMotionQuery } from '../../../utils/scroll';
import ScrollAccent from '../../common/ScrollAccent';

const fileTypes = [
  { name: 'JSON', icon: FileCode, color: 'text-status-success' },
  { name: 'API', icon: Cloud, color: 'text-ink' },
];

const DataStreamRow = ({
  speed,
  opacity,
  content,
  running,
}: {
  speed: number;
  opacity: number;
  content: string;
  running: boolean;
}) => (
  <div className="pointer-events-none absolute left-0 right-0 flex overflow-hidden" style={{ opacity }}>
    <div
      className={clsx(
        'flex select-none whitespace-nowrap font-mono text-[10px] text-status-success animate-marquee',
        !running && 'marquee-paused',
      )}
      style={{ animationDuration: `${speed}s` }}
    >
      <span className="mr-8">{content}</span>
      <span className="mr-8">{content}</span>
    </div>
  </div>
);

const DataEncryptionCard: React.FC<{ className?: string; title?: string }> = ({
  className,
  title = 'Data Encryption',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: '80px' });
  const reduce = useReducedMotionQuery();
  const running = inView && !reduce;

  return (
    <CardContainer className={className}>
      <div ref={ref} className="relative z-10 flex h-full flex-col overflow-hidden">
        <div className="mb-4">
          <h3 className="bento-card-title m-0 text-ink">{title}</h3>
        </div>

        <div className="relative flex min-h-0 flex-1 items-center justify-between gap-6 overflow-hidden">
          <div className="z-20 flex flex-col gap-3">
            {fileTypes.map((file, index) => (
              <ScrollAccent
                key={file.name}
                x={-10}
                delay={index * 0.2}
                className="group relative flex h-12 w-12 flex-col items-center justify-center gap-1 rounded-lg border border-white/[0.08] bg-bg shadow-lg"
              >
                <div className="absolute -right-[1px] -top-[1px] h-0 w-0 rounded-br-lg border-b-[8px] border-l-[8px] border-r-[8px] border-b-white/[0.08] border-l-transparent border-r-transparent" />
                <file.icon className={`h-4 w-4 ${file.color}`} />
                <span className="text-[7px] font-mono font-semibold text-muted">{file.name}</span>
              </ScrollAccent>
            ))}
          </div>

          <div className="relative mx-2 h-full w-px bg-gradient-to-b from-transparent to-transparent">
            {running && (
              <m.div
                className="absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 bg-ink blur-[2px]"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}

            <div className="absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-full border border-line-strong bg-bg">
                {running && (
                  <m.div
                    data-encryption-glow
                    className="pointer-events-none absolute inset-0 rounded-full border border-blue-400/40 bg-blue-500/20"
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
                <Lock className="relative z-10 h-4 w-4 text-ink" />
              </div>
            </div>
          </div>

          <div className="relative h-full flex-1 overflow-hidden rounded-lg border border-white/[0.05] bg-bg/50 mask-linear-fade">
            <div className="relative flex h-full flex-col justify-center gap-4 py-2">
              {[
                { speed: 15, opacity: 0.3, content: '0x1A4F 8B2C 9D3E 0x5F1A 7C8B 2D9E 0x3F4A 1B2C 8D9E' },
                { speed: 20, opacity: 0.6, content: 'ENCRYPTED_PAYLOAD_V2_SECURE_CHANNEL_ESTABLISHED' },
                { speed: 12, opacity: 0.4, content: ':: AES-256-GCM :: SHA-384 :: RSA-4096 :: TLS 1.3' },
              ].map((row) => (
                <div key={row.content} className="relative h-5 overflow-hidden">
                  <DataStreamRow {...row} running={running} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </CardContainer>
  );
};

export default React.memo(DataEncryptionCard);
