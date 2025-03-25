import React, { useEffect } from 'react';
import { Alert, AlertProps } from '@mui/material';
import { motion, HTMLMotionProps } from 'framer-motion';

type AnimatedAlertProps = Omit<AlertProps, keyof HTMLMotionProps<"div">> & {
  children: React.ReactNode;
  delay?: number;
  onError?: (error: Error) => void;
};

const MotionAlert = motion(Alert) as typeof motion.div;

export default function AnimatedAlert({ children, delay = 0, onError, ...props }: AnimatedAlertProps) {
  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error('Animation error:', error);
      onError?.(error.error);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, [onError]);

  return (
    <MotionAlert
      {...props}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{
        duration: 0.3,
        delay,
      }}
    >
      {children}
    </MotionAlert>
  );
} 