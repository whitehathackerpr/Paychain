import React from 'react';
import { Alert, AlertProps } from '@mui/material';
import { motion } from 'framer-motion';

interface AnimatedAlertProps extends AlertProps {
  children: React.ReactNode;
  delay?: number;
}

const MotionAlert = motion(Alert);

export default function AnimatedAlert({ children, delay = 0, ...props }: AnimatedAlertProps) {
  return (
    <MotionAlert
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{
        duration: 0.3,
        delay,
        ease: [0.4, 0, 0.2, 1],
      }}
      {...props}
    >
      {children}
    </MotionAlert>
  );
} 