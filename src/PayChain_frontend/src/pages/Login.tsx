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
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { usePayChainStore } from '../store/paychainStore';
import { motion } from 'framer-motion';
import { Visibility, VisibilityOff } from '@mui/icons-material';

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
        background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
      }}
    >
      <Card 
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{ 
          maxWidth: 450, 
          width: '100%',
          borderRadius: 3,
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
          overflow: 'hidden',
          background: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: 'blur(20px)',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom 
            align="center"
            sx={{ mb: 4 }}
          >
            Welcome to PayChain
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          <form onSubmit={formik.handleSubmit}>
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
            />
            
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
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <Link 
                component={RouterLink} 
                to="/forgot-password"
                sx={{ fontSize: '0.875rem' }}
              >
                Forgot password?
              </Link>
            </Box>
            
            <Button
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
              disabled={isLoggingIn}
              sx={{ 
                py: 1.5,
                borderRadius: 2,
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
                background: 'linear-gradient(45deg, #3f51b5 30%, #5c6bc0 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #303f9f 30%, #3f51b5 90%)',
                }
              }}
            >
              {isLoggingIn ? <CircularProgress size={24} /> : 'Sign In'}
            </Button>
            
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Typography variant="body2">
                Don't have an account?{' '}
                <Link 
                  component={RouterLink} 
                  to="/register"
                  sx={{ fontWeight: 'bold' }}
                >
                  Sign up
                </Link>
              </Typography>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login; 