import React, { useEffect } from 'react';
import { Box, BoxProps } from '@mui/material';
import { motion, HTMLMotionProps, domAnimation, m } from 'framer-motion';

type AnimatedListProps = Omit<BoxProps, keyof HTMLMotionProps<"div">> & {
  children: React.ReactNode;
  delay?: number;
  onError?: (error: Error) => void;
};

const MotionBox = motion(Box) as typeof motion.div;

export default function AnimatedList({ children, delay = 0, onError, ...props }: AnimatedListProps) {
  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error('Animation error:', error);
      onError?.(error.error);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, [onError]);

  return (
    <m.div animate="visible" initial="hidden">
      <MotionBox
        {...props}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 0.3,
          delay,
        }}
      >
        {children}
      </MotionBox>
    </m.div>
  );
} 