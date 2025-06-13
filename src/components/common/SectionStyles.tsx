import React from 'react';
import { motion } from 'framer-motion';

interface SectionStylesProps {
  children: React.ReactNode;
  className?: string;
  withTopBorder?: boolean;
  withBottomBorder?: boolean;
  gradient?: string;
  noPadding?: boolean;
  spacing?: 'none' | 'sm' | 'md' | 'lg';
}

const SectionStyles: React.FC<SectionStylesProps> = ({
  children,
  className = '',
  withTopBorder = false,
  withBottomBorder = true,
  gradient = 'from-transparent via-blue-500/20 to-transparent',
  noPadding = false,
  spacing = 'md'
}) => {
  const getSpacing = () => {
    switch (spacing) {
      case 'none':
        return '';
      case 'sm':
        return 'py-6 sm:py-8';
      case 'lg':
        return 'py-12 sm:py-16';
      default: // md
        return 'py-8 sm:py-12';
    }
  };

  return (
    <div className={`
      relative
      ${!noPadding ? getSpacing() : ''}
      ${className}
    `}>
      {/* Top Border */}
      {withTopBorder && (
        <div className="absolute top-0 inset-x-0">
          <div className="h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
          <div className="h-6 bg-gradient-to-b from-blue-500/5 to-transparent" />
        </div>
      )}

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        {children}
      </motion.div>

      {/* Bottom Border */}
      {withBottomBorder && (
        <div className="absolute bottom-0 inset-x-0">
          <div className="h-6 bg-gradient-to-t from-blue-500/5 to-transparent" />
          <div className={`h-px bg-gradient-to-r ${gradient}`} />
        </div>
      )}

      {/* Side Borders */}
      <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-blue-500/10 to-transparent" />
      <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-blue-500/10 to-transparent" />
    </div>
  );
};

export default SectionStyles;