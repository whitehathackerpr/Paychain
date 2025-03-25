import React from 'react';
import { Box, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import NavBar from './NavBar';

interface LayoutProps {
  children: JSX.Element;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const theme = useTheme();
  
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <NavBar />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        style={{ 
          position: 'absolute',
          top: '5%',
          right: '5%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(99, 102, 241, 0) 70%)',
          filter: 'blur(40px)',
          zIndex: -1,
        }}
      />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        style={{ 
          position: 'absolute',
          bottom: '10%',
          left: '5%',
          width: '250px',
          height: '250px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0) 70%)',
          filter: 'blur(40px)',
          zIndex: -1,
        }}
      />
      
      <Box 
        component={motion.main}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{ 
          flexGrow: 1, 
          p: { xs: 2, sm: 3, md: 4 }, 
          position: 'relative',
          zIndex: 1,
        }}
      >
        {children}
      </Box>
      
      <Box
        component="footer"
        sx={{
          py: 2,
          textAlign: 'center',
          color: 'text.secondary',
          fontSize: '0.875rem',
          opacity: 0.7,
          position: 'relative',
          backdropFilter: 'blur(10px)',
          background: 'rgba(15, 23, 42, 0.3)',
          borderTop: '1px solid rgba(99, 102, 241, 0.1)',
          mt: 'auto'
        }}
      >
        © {new Date().getFullYear()} PayChain - Secure Blockchain Payments
      </Box>
    </Box>
  );
};

export default Layout; 