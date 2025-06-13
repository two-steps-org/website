import React, { memo } from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { ArrowRight, LucideIcon } from 'lucide-react';

interface ServiceDetails {
  features: string[];
  benefits: string[];
  useCase: string;
}

interface ServiceCardProps {
  /** Lucide icon to display in the service card */
  icon: LucideIcon;
  /** Title of the service */
  title: string;
  /** Short description of the service */
  description: string;
  /** Tailwind gradient classes for the card's accent (e.g. 'from-blue-500 to-purple-500') */
  gradient: string;
  /** Whether the service is featured, adding a special style */
  featured?: boolean;
  /** Additional details about the service */
  details: ServiceDetails;
  /** Callback for clicking the 'Learn More' button */
  onSelect: () => void;
}

/**
 * ServiceCard displays a service item with an icon, title, description,
 * and a call-to-action button to show more details.
 */
const ServiceCard: React.FC<ServiceCardProps> = ({
  icon: Icon,
  title,
  description,
  gradient,
  featured,
  details,
  onSelect
}) => {
  // Outer container for the service card
  return (
    <div className={clsx('group h-full touch-manipulation', featured && 'relative')}>
      {/* If 'featured', show an outer gradient border effect */}
      {featured && (
        <div className="absolute -inset-[2px] bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl" />
      )}

      {/* Main Card Container */}
      <div
        className={clsx(
          'relative h-full overflow-hidden rounded-2xl backdrop-blur-xl border transition-all duration-300',
          featured
            ? 'bg-[#0A0F1F]/95 border-2 border-blue-500/50' // matching desktop thickness & color
            : 'bg-gray-900/40 border border-gray-800/50 hover:border-blue-500/30'
        )}
      >
        <div className="p-6 flex flex-col h-full">
          {/* Icon & Title */}
          <div className="mb-4 flex items-center">
            <div
              className={clsx(
                'w-12 h-12 mr-4 rounded-xl bg-gradient-to-r p-[1px] group-hover:scale-110 transition-transform duration-300',
                gradient
              )}
            >
              <div className="w-full h-full rounded-xl bg-gray-900 flex items-center justify-center">
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3
              className={clsx(
                'text-xl font-bold bg-gradient-to-r bg-clip-text text-transparent',
                gradient
              )}
            >
              {title}
            </h3>
          </div>

          {/* Description */}
          <p className="text-gray-400 leading-relaxed mb-6 flex-grow">
            {description}
          </p>

          {/* CTA Button */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={onSelect}
            className="flex items-center text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors mt-auto cursor-pointer touch-manipulation z-10"
          >
            Learn More
            <ArrowRight className="w-5 h-5 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
          </motion.button>
        </div>

        {/* Hover Glow Effect (non-featured) */}
        {!featured && (
          <div
            className={clsx(
              'absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500',
              'bg-gradient-to-r',
              gradient
            )}
          />
        )}
      </div>
    </div>
  );
};

export default memo(ServiceCard);
