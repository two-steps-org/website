import React from 'react';
import { useReducedMotionQuery } from '../../../utils/scroll';
import CardContainer from '../shared/CardContainer';
import { useInView } from '../../../utils/useInView';
import { LiveMetricPanel, MetricCodePreviewPanel } from './EncryptionMetricPanels';
import { useEncryptionMetricCycle } from './useEncryptionMetricCycle';

const EncryptionCard: React.FC<{ className?: string; title?: string }> = ({
  className,
  title = 'Encryption Telemetry',
}) => {
  const { ref, inView } = useInView();
  const reduce = useReducedMotionQuery();
  const { label, value, isSyncing, activeField, delta, streamLabel } = useEncryptionMetricCycle(inView && !reduce);

  return (
    <CardContainer className={className}>
      <div ref={ref} className="relative flex h-full flex-col overflow-hidden">
        <div className="relative z-10 mb-4">
          <h3 className="bento-card-title text-ink m-0">{title}</h3>
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
