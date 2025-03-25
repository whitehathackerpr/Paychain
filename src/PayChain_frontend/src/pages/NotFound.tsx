import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AnimatedCard from '../components/AnimatedCard';

export default function NotFound() {
  const navigate = useNavigate();
  
  return (
    <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      minHeight="calc(100vh - 64px)"
      p={3}
    >
      <AnimatedCard sx={{ maxWidth: 500, width: '100%', textAlign: 'center', p: 3 }}>
        <Typography variant="h4" gutterBottom>
          404 - Page Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          The page you're looking for doesn't exist or has been moved.
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/')}
          sx={{ mt: 2 }}
        >
          Go to Dashboard
        </Button>
      </AnimatedCard>
    </Box>
  );
} 