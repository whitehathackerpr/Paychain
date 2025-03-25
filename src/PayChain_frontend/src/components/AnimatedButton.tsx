import React, { useEffect } from 'react';
import { Button, ButtonProps } from '@mui/material';
import { motion, HTMLMotionProps } from 'framer-motion';

interface AnimatedButtonProps extends Omit<ButtonProps, keyof HTMLMotionProps<"button">> {
  children: React.ReactNode;
  delay?: number;
  onError?: (error: Error) => void;
  color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
}

const MotionButton = motion(Button) as typeof motion.button;

export default function AnimatedButton(props: AnimatedButtonProps) {
  const { children, delay = 0, onError, onClick, ...rest } = props;
  
  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error('Animation error:', error);
      onError?.(error.error);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, [onError]);

  return (
    <MotionButton
      {...rest}
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.3,
        delay,
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </MotionButton>
  );
} 