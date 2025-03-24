import React from 'react';
import {
  Box,
  CardContent,
  Typography,
  CircularProgress,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import AnimatedCard from '../components/AnimatedCard';
import AnimatedButton from '../components/AnimatedButton';
import AnimatedAlert from '../components/AnimatedAlert';

export default function Login() {
  const { login, loading, error } = useAuth();

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="calc(100vh - 64px)"
      p={3}
    >
      <AnimatedCard sx={{ maxWidth: 400, width: '100%' }}>
        <CardContent>
          <Typography
            variant="h4"
            gutterBottom
            align="center"
            component={motion.div}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Welcome to PayChain
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            paragraph
            align="center"
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Connect your Internet Identity to continue
          </Typography>
          {error && (
            <AnimatedAlert severity="error" sx={{ mb: 2 }}>
              {error}
            </AnimatedAlert>
          )}
          <AnimatedButton
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            onClick={login}
            disabled={loading}
            sx={{ mt: 2 }}
            delay={0.4}
          >
            {loading ? (
              <>
                <CircularProgress size={24} sx={{ mr: 1 }} />
                Connecting...
              </>
            ) : (
              'Connect Internet Identity'
            )}
          </AnimatedButton>
        </CardContent>
      </AnimatedCard>
    </Box>
  );
} 