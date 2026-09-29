import React from 'react';
import { Link } from 'react-router-dom';
import Scrub from '../common/Scrub';
import { TILES } from './serviceCards';

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
