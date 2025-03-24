import React from 'react';
import { Card, CardProps } from '@mui/material';
import { motion } from 'framer-motion';

interface AnimatedCardProps extends CardProps {
  children: React.ReactNode;
  delay?: number;
}

const MotionCard = motion(Card);

export default function AnimatedCard({ children, delay = 0, ...props }: AnimatedCardProps) {
  return (
    <MotionCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.4, 0, 0.2, 1],
      }}
      whileHover={{
        scale: 1.02,
        transition: {
          duration: 0.2,
          ease: [0.4, 0, 0.2, 1],
        },
      }}
      {...props}
    >
      {children}
    </MotionCard>
  );
} 