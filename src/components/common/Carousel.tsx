import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type CarouselProps<T> = {
  data: T[];
  renderItem: (item: T, isActive: boolean) => React.ReactNode;
  onClickItem?: (item: T) => void;
  className?: string;
  itemKey?: (item: T, index: number) => string | number;
};

export function Carousel<T>({
  data,
  renderItem,
  onClickItem,
  className = '',
  itemKey = (_, i) => i,
}: CarouselProps<T>) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: { zIndex: 1, x: 0, opacity: 1 },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => Math.abs(offset) * velocity;

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => (prevIndex + newDirection + data.length) % data.length);
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Slide */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={itemKey(data[currentIndex], currentIndex)}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(_, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);
            if (swipe < -swipeConfidenceThreshold) paginate(1);
            else if (swipe > swipeConfidenceThreshold) paginate(-1);
          }}
          className="absolute w-full"
        >
          <div onClick={() => onClickItem?.(data[currentIndex])} className="cursor-pointer">
            {renderItem(data[currentIndex], true)}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <div className="absolute inset-x-0 bottom-0 flex justify-center items-center">
        <div className="flex items-center gap-3 mb-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => paginate(-1)}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-400" />
          </motion.button>

          <div className="flex space-x-2">
            {data.map((_, idx) => (
              <button
                key={itemKey(_, idx)}
                onClick={() => {
                  setDirection(idx > currentIndex ? 1 : -1);
                  setCurrentIndex(idx);
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? 'bg-white' : 'bg-gray-600 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => paginate(1)}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
