import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  InputAdornment,
  IconButton,
  Link,
  useTheme,
  alpha,
  Grid,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { usePayChainStore } from '../store/paychainStore';
import { motion } from 'framer-motion';
import { 
  Visibility, 
  VisibilityOff, 
  LockOutlined, 
  MailOutline, 
  SecurityOutlined 
} from '@mui/icons-material';

// Login form values interface
interface LoginFormValues {
  email: string;
  password: string;
}

// Validation schema
const validationSchema = Yup.object({
  email: Yup.string()
    .email('Enter a valid email')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required'),
});

const Login: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = usePayChainStore();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  // Formik form handling
  const formik = useFormik<LoginFormValues>({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoggingIn(true);
      setError(null);
      
      try {
        await login(values.email, values.password);
        navigate('/dashboard');
      } catch (err) {
        console.error('Login error:', err);
        setError('Invalid email or password. Please try again.');
      } finally {
        setIsLoggingIn(false);
      }
    },
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        p: 3,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Elements */}
      <Box
        component={motion.div}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.8, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        sx={{
          position: 'absolute',
          top: '-15%',
          right: '-10%',
          width: '50%',
          height: '50%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, rgba(99, 102, 241, 0) 70%)',
          filter: 'blur(60px)',
          zIndex: -1,
        }}
      />
      
      <Box
        component={motion.div}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.8, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
        sx={{
          position: 'absolute',
          bottom: '-15%',
          left: '-10%',
          width: '50%',
          height: '50%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, rgba(16, 185, 129, 0) 70%)',
          filter: 'blur(60px)',
          zIndex: -1,
        }}
      />
      
      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <Box
          key={`particle-${i}`}
          component={motion.div}
          sx={{
            position: 'absolute',
            width: i % 2 === 0 ? '80px' : '120px',
            height: i % 2 === 0 ? '80px' : '120px',
            borderRadius: '50%',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            zIndex: 0,
          }}
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: 0,
          }}
          animate={{
            x: [
              Math.random() * window.innerWidth,
              Math.random() * window.innerWidth,
              Math.random() * window.innerWidth,
            ],
            y: [
              Math.random() * window.innerHeight,
              Math.random() * window.innerHeight,
              Math.random() * window.innerHeight,
            ],
            opacity: [0.1, 0.2, 0.1],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 15 + i * 5,
            ease: "linear",
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      ))}
      
      {/* Main Card */}
      <Card 
        component={motion.div}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        sx={{ 
          maxWidth: 450, 
          width: '100%',
          borderRadius: 4,
          overflow: 'hidden',
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(99, 102, 241, 0.1)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), 0 0 40px rgba(99, 102, 241, 0.1) inset',
          position: 'relative',
          zIndex: 2,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: 'linear-gradient(90deg, #6366F1, #10B981)',
          },
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
          <motion.div variants={itemVariants}>
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                mb: 4 
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(16, 185, 129, 0.2))',
                  backdropFilter: 'blur(10px)',
                  mb: 2,
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1), 0 0 15px rgba(99, 102, 241, 0.2) inset',
                }}
              >
                <SecurityOutlined 
                  sx={{ 
                    fontSize: 40, 
                    color: '#F9FAFB',
                    filter: 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.5))'  
                  }} 
                />
              </Box>
              
              <Typography 
                variant="h4" 
                component="h1"
                sx={{ 
                  fontWeight: 700,
                  background: 'linear-gradient(90deg, #F9FAFB, #E5E7EB)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-0.02em',
                  mb: 1,
                  textAlign: 'center'
                }}
              >
                Welcome to PayChain
              </Typography>
              
              <Typography 
                variant="body1" 
                color="text.secondary"
                align="center"
                sx={{ maxWidth: 320 }}
              >
                Secure blockchain payment system with enhanced security
              </Typography>
            </Box>
          </motion.div>
          
          {error && (
            <motion.div variants={itemVariants}>
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3, 
                  border: '1px solid rgba(244, 67, 54, 0.2)',
                  backgroundColor: 'rgba(244, 67, 54, 0.1)',
                }}
              >
                {error}
              </Alert>
            </motion.div>
          )}
          
          <form onSubmit={formik.handleSubmit}>
            <motion.div variants={itemVariants}>
              <TextField
                fullWidth
                id="email"
                name="email"
                label="Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                margin="normal"
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MailOutline sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <TextField
                fullWidth
                id="password"
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                margin="normal"
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Link 
                  component={RouterLink} 
                  to="/forgot-password"
                  sx={{ 
                    fontSize: '0.875rem',
                    color: theme.palette.primary.main,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      color: theme.palette.primary.light,
                      textDecoration: 'none',
                    }
                  }}
                >
                  Forgot password?
                </Link>
              </Box>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
                disabled={isLoggingIn}
                sx={{ 
                  py: 1.5,
                  borderRadius: 30,
                  background: 'linear-gradient(90deg, #6366F1, #10B981)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2), 0 0 0 2px rgba(99, 102, 241, 0.1)',
                  transition: 'all 0.3s ease-in-out',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
                    transform: 'translateX(-100%)',
                  },
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 30px rgba(0, 0, 0, 0.3), 0 0 0 2px rgba(99, 102, 241, 0.2)',
                    '&::before': {
                      transform: 'translateX(100%)',
                      transition: 'transform 0.8s ease-in-out',
                    }
                  },
                }}
              >
                {isLoggingIn ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Sign In'
                )}
              </Button>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Don't have an account?{' '}
                  <Link 
                    component={RouterLink} 
                    to="/register"
                    sx={{ 
                      fontWeight: 600,
                      color: theme.palette.primary.main,
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        color: theme.palette.primary.light,
                        textDecoration: 'none',
                      }
                    }}
                  >
                    Sign up
                  </Link>
                </Typography>
              </Box>
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login; 