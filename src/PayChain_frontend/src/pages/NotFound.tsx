import React from 'react';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import { BackupTable as NotFoundIcon } from '@mui/icons-material';

const NotFound: React.FC = () => {
  return (
    <Container maxWidth="md">
      <Paper 
        sx={{ 
          textAlign: 'center', 
          p: 5, 
          mt: 10,
          borderRadius: 2,
          boxShadow: 3
        }}
      >
        <NotFoundIcon sx={{ fontSize: 100, color: 'text.secondary', mb: 2 }} />
        
        <Typography variant="h4" gutterBottom>
          Page Not Found
        </Typography>
        
        <Typography variant="body1" color="text.secondary" paragraph>
          The page you're looking for doesn't exist or has been moved.
        </Typography>
        
        <Box sx={{ mt: 4 }}>
          <Button 
            component={Link} 
            to="/dashboard" 
            variant="contained" 
            size="large"
          >
            Go to Dashboard
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default NotFound; 