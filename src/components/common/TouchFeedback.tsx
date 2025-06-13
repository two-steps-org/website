import React, { memo } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { useBreakpoint } from '../../utils/responsive/hooks';

interface TouchFeedbackProps extends HTMLMotionProps<'div'> {
  /** Wrapped children for the touch/hover feedback */
  children: React.ReactNode;
  /** Whether the touch/hover feedback is disabled */
  disabled?: boolean;
}

/**
 * TouchFeedback applies either a hover or tap animation
 * based on the user's device breakpoint. On mobile, it uses a smaller
 * tap-scale. On desktop, it uses hover & tap feedback.
 */
const TouchFeedback: React.FC<TouchFeedbackProps> = ({
  children,
  disabled = false,
  ...props
}) => {
  const breakpoint = useBreakpoint();
  const isMobile = ['xs', 'sm'].includes(breakpoint);

  // Define motion props for mobile vs. desktop
  const touchProps = isMobile
    ? {
        whileTap: disabled ? undefined : { scale: 0.95 },
        transition: { duration: 0.2 }
      }
    : {
        whileHover: disabled ? undefined : { scale: 1.02 },
        whileTap: disabled ? undefined : { scale: 0.98 },
        transition: { duration: 0.2 }
      };

  return (
    <motion.div {...touchProps} {...props}>
      {children}
    </motion.div>
  );
};

export default memo(TouchFeedback);
