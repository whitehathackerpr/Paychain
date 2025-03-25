import React, { useEffect } from 'react';
import { Card, CardProps } from '@mui/material';
import { motion, HTMLMotionProps } from 'framer-motion';

type AnimatedCardProps = Omit<CardProps, keyof HTMLMotionProps<"div">> & {
  children: React.ReactNode;
  delay?: number;
  onError?: (error: Error) => void;
};

const MotionCard = motion(Card) as typeof motion.div;

export default function AnimatedCard({ children, delay = 0, onError, ...props }: AnimatedCardProps) {
  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error('Animation error:', error);
      onError?.(error.error);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, [onError]);

  return (
    <MotionCard
      {...props}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay,
      }}
      whileHover={{ scale: 1.02 }}
    >
      {children}
    </MotionCard>
  );
} 