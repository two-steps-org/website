import React from 'react';
import CardContainer from '../shared/CardContainer';
import { LiveMetricPanel, MetricCodePreviewPanel } from './EncryptionMetricPanels';
import { useEncryptionMetricCycle } from './useEncryptionMetricCycle';

const EncryptionCard: React.FC<{ className?: string; index?: number }> = ({ className, index }) => {
  const { label, value, isSyncing, activeField, delta, streamLabel } = useEncryptionMetricCycle();

  return (
    <CardContainer className={className} index={index}>
      <div className="relative flex h-full flex-col overflow-hidden">
        <div className="relative z-10 mb-4">
          <div className="bento-card-title text-ink">
            Encryption Telemetry
          </div>
        </div>

        <div className="relative z-10 mb-2 flex gap-4">
          <div className="w-1/2 flex justify-center">
            <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-muted">What we see</p>
          </div>
          <div className="w-1/2 flex justify-center">
            <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-muted">What you see</p>
          </div>
        </div>

        <div className="relative z-10 flex min-h-0 flex-1 gap-4">
          <MetricCodePreviewPanel
            label={label}
            value={value}
            isSyncing={isSyncing}
            activeField={activeField}
          />
          <LiveMetricPanel
            label={label}
            value={value}
            isSyncing={isSyncing}
            activeField={activeField}
            delta={delta}
            streamLabel={streamLabel}
          />
        </div>
      </div>
    </CardContainer>
  );
};

export default React.memo(EncryptionCard);
