import React from 'react';
import PipelineCard from './cards/PipelineCard';
import EncryptionCard from './cards/EncryptionCard';
import DataEncryptionCard from './cards/DataEncryptionCard';
import IntegrationCard from './cards/IntegrationCard';

const BentoGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 md:gap-5 w-full lg:grid-rows-[420px_340px]">
      {/* Row 1: Agentic Workflow */}
      <PipelineCard className="col-span-1 md:col-span-1 lg:col-span-6 min-h-[420px]" />

      {/* Row 1: Encryption Telemetry */}
      <EncryptionCard className="col-span-1 md:col-span-1 lg:col-span-6 min-h-[420px]" />

      {/* Row 2: Data Encryption Stream (Narrow) */}
      <DataEncryptionCard className="col-span-1 md:col-span-1 lg:col-span-5 min-h-[340px]" />

      {/* Row 2: Integrations (Wide) */}
      <IntegrationCard className="col-span-1 md:col-span-1 lg:col-span-7 min-h-[340px]" />
    </div>
  );
};

export default React.memo(BentoGrid);
