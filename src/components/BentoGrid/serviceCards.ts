import PipelineCard from './cards/PipelineCard';
import EncryptionCard from './cards/EncryptionCard';
import DataEncryptionCard from './cards/DataEncryptionCard';
import IntegrationCard from './cards/IntegrationCard';

export const TILES = [
  { id: 'ai-chat-agents', Card: PipelineCard, className: 'md:col-span-6 min-h-[280px] md:min-h-0' },
  { id: 'crm-development', Card: EncryptionCard, className: 'md:col-span-6 min-h-[280px] md:min-h-0' },
  { id: 'custom-saas-solutions', Card: DataEncryptionCard, className: 'md:col-span-5 min-h-[240px] md:min-h-0' },
  { id: 'ai-voice-agents', Card: IntegrationCard, className: 'md:col-span-7 min-h-[240px] md:min-h-0' },
] as const;

/** The animated card that stands for each service, by service id. */
export const SERVICE_CARDS: Record<string, (typeof TILES)[number]['Card']> = Object.fromEntries(
  TILES.map(({ id, Card }) => [id, Card]),
);
