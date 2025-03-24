import React from 'react';
import { Button, ButtonProps } from '@mui/material';
import { motion } from 'framer-motion';

interface AnimatedButtonProps extends ButtonProps {
  children: React.ReactNode;
  delay?: number;
}

const MotionButton = motion(Button);

export default function AnimatedButton({ children, delay = 0, ...props }: AnimatedButtonProps) {
  return (
    <MotionButton
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.3,
        delay,
        ease: [0.4, 0, 0.2, 1],
      }}
      whileHover={{
        scale: 1.05,
        transition: {
          duration: 0.2,
          ease: [0.4, 0, 0.2, 1],
        },
      }}
      whileTap={{
        scale: 0.95,
        transition: {
          duration: 0.1,
          ease: [0.4, 0, 0.2, 1],
        },
      }}
      {...props}
    >
      {children}
    </MotionButton>
  );
} 