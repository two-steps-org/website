import React, { useState, useRef, useEffect, memo } from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSwipeable } from '../../../hooks/useSwipeable';
import ServiceCard from './ServiceCard';
import { services } from './data';

/** Service item interface (optional if already defined elsewhere). */
interface ServiceItem {
  title: string;
  gradient: string;
  description: string;
  featured?: boolean;
  icon: React.ElementType;
  details: {
    features: string[];
    benefits: string[];
    useCase: string;
  };
}

interface ServicesCarouselProps {
  /** Callback invoked when a service is selected ("Learn More" clicked). */
  onSelectService: (service: ServiceItem) => void;
}

/**
 * ServicesCarousel renders a horizontally scrollable list of service cards.
 * Users can swipe (on mobile) or use the navigation buttons to move between cards.
 */
const BaseServicesCarousel: React.FC<ServicesCarouselProps> = ({ onSelectService }) => {
  // Start with the second card
  const [activeIndex, setActiveIndex] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  /**
   * Scroll to a specific card index, clamped between 0 and services.length-1.
   * This ensures we don’t scroll out of bounds.
   */
  const scrollToIndex = (index: number) => {
    if (containerRef.current) {
      const newIndex = Math.max(0, Math.min(index, services.length - 1));
      const scrollWidth = containerRef.current.offsetWidth;
      containerRef.current.scrollTo({
        left: newIndex * scrollWidth,
        behavior: 'smooth'
      });
      setActiveIndex(newIndex);
    }
  };

  // Swipe handlers for left and right swipes
  const handlers = useSwipeable({
    onSwipedLeft: () => scrollToIndex(activeIndex + 1),
    onSwipedRight: () => scrollToIndex(activeIndex - 1)
  });

  // On mount, ensure the second card is displayed initially
  useEffect(() => {
    scrollToIndex(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative">
      {/* Scrollable Container */}
      <div
        ref={containerRef}
        {...handlers}
        className="overflow-hidden snap-x snap-mandatory scroll-smooth"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        <div className="flex">
          {services.map((service, index) => (
            <div key={index} className="w-full flex-shrink-0 snap-center px-4">
              <ServiceCard
                {...service}
                onSelect={() => onSelectService(service)}
                featured={service.title === 'AI Voice Agents'}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex justify-center items-center mt-6 gap-4">
        {/* Previous Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => scrollToIndex(activeIndex - 1)}
          className={clsx(
            'w-10 h-10 rounded-full bg-gray-900/60 border border-gray-800/50',
            'flex items-center justify-center hover:bg-gray-800/60 transition-colors'
          )}
        >
          <ChevronLeft className="w-5 h-5 text-gray-400" />
        </motion.button>

        {/* Dots Navigation */}
        <div className="flex gap-2">
          {services.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToIndex(index)}
              className={clsx(
                'w-2 h-2 rounded-full transition-all duration-300',
                index === activeIndex
                  ? 'w-6 bg-blue-500'
                  : 'bg-gray-600 hover:bg-gray-500'
              )}
            />
          ))}
        </div>

        {/* Next Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => scrollToIndex(activeIndex + 1)}
          className={clsx(
            'w-10 h-10 rounded-full bg-gray-900/60 border border-gray-800/50',
            'flex items-center justify-center hover:bg-gray-800/60 transition-colors'
          )}
        >
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </motion.button>
      </div>
    </div>
  );
};

BaseServicesCarousel.displayName = 'ServicesCarousel';

export default memo(BaseServicesCarousel);
