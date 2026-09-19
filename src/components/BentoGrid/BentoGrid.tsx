import React from 'react';
import { Link } from 'react-router-dom';
import Scrub from '../common/Scrub';
import PipelineCard from './cards/PipelineCard';
import EncryptionCard from './cards/EncryptionCard';
import DataEncryptionCard from './cards/DataEncryptionCard';
import IntegrationCard from './cards/IntegrationCard';
const TILES = [
  { id: 'ai-chat-agents', Card: PipelineCard, className: 'md:col-span-6 min-h-[280px] md:min-h-0' },
  { id: 'crm-development', Card: EncryptionCard, className: 'md:col-span-6 min-h-[280px] md:min-h-0' },
  { id: 'custom-saas-solutions', Card: DataEncryptionCard, className: 'md:col-span-5 min-h-[240px] md:min-h-0' },
  { id: 'ai-voice-agents', Card: IntegrationCard, className: 'md:col-span-7 min-h-[240px] md:min-h-0' },
] as const;

/** The animated card that stands for each service, by service id. */
export const SERVICE_CARDS: Record<string, (typeof TILES)[number]['Card']> = Object.fromEntries(
  TILES.map(({ id, Card }) => [id, Card]),
);

interface BentoGridProps {
  services: readonly { id: string; title: string }[];
}

const BentoGrid: React.FC<BentoGridProps> = ({ services }) => {
  return (
    <div className="w-full">
      <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-12 md:grid-rows-[380px_300px] md:gap-4 lg:grid-rows-[420px_340px]">
        {TILES.map(({ id, Card, className }, index) => {
          const service = services.find((item) => item.id === id);
          if (!service) return null;

          return (
            <Scrub key={id} effect="assemble" x={index % 2 === 0 ? -72 : 72} delay={(index % 2) * 0.12} className={className}>
              <Link
                to={`/services/${id}`}
                aria-label={`Discover more about ${service.title}`}
                className="block h-full w-full min-h-[inherit] text-left"
              >
                <Card title={service.title} className="h-full" />
              </Link>
            </Scrub>
          );
        })}
      </div>
    </div>
  );
};

export default React.memo(BentoGrid);
