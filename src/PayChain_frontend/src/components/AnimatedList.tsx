import React from 'react';
import { Box, BoxProps } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedListProps extends BoxProps {
  children: React.ReactNode;
  delay?: number;
}

const MotionBox = motion(Box);

export default function AnimatedList({ children, delay = 0, ...props }: AnimatedListProps) {
  return (
    <AnimatePresence>
      <MotionBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 0.3,
          delay,
          ease: [0.4, 0, 0.2, 1],
        }}
        {...props}
      >
        {children}
      </MotionBox>
    </AnimatePresence>
  );
} 