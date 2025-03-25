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
  Grid,
  Paper,
  Link,
  Stepper,
  Step,
  StepLabel,
  useTheme,
  alpha,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { usePayChainStore } from '../store/paychainStore';
import { motion } from 'framer-motion';
import { Check as CheckIcon } from '@mui/icons-material';

// Registration form values interface
interface RegisterFormValues {
  email: string;
  password: string;
  confirmPassword: string;
  principalId: string;
}

// Validation schema
const validationSchema = Yup.object({
  email: Yup.string()
    .email('Enter a valid email')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    )
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
  principalId: Yup.string()
    .min(5, 'Principal ID must be at least 5 characters')
    .required('Principal ID is required'),
});

// Registration steps
const steps = ['Account Details', 'Identity Verification', 'Confirmation'];

const Register: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register } = usePayChainStore();

  // Formik form handling
  const formik = useFormik<RegisterFormValues>({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
      principalId: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsRegistering(true);
      setError(null);
      
      try {
        await register(values.email, values.password, values.principalId);
        setRegistrationSuccess(true);
        
        // Redirect to login after successful registration
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (err) {
        console.error('Registration error:', err);
        setError('Registration failed. Please try again.');
      } finally {
        setIsRegistering(false);
      }
    },
  });

  // Handle step navigation
  const handleNext = () => {
    // Validate current step
    if (activeStep === 0) {
      if (!formik.values.email || !formik.values.password || !formik.values.confirmPassword) {
        formik.setTouched({
          email: true,
          password: true,
          confirmPassword: true,
        });
        return;
      }
      if (formik.errors.email || formik.errors.password || formik.errors.confirmPassword) {
        return;
      }
    } else if (activeStep === 1) {
      if (!formik.values.principalId) {
        formik.setTouched({
          principalId: true,
        });
        return;
      }
      if (formik.errors.principalId) {
        return;
      }
    }

    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  // Generate a random principal ID (for demo purposes)
  const generatePrincipalId = () => {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = 'user-';
    for (let i = 0; i < 10; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    formik.setFieldValue('principalId', result);
  };

  // Render step content
  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
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
            />
            <TextField
              fullWidth
              id="password"
              name="password"
              label="Password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              margin="normal"
            />
            <TextField
              fullWidth
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
              helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
              margin="normal"
            />
          </Box>
        );
      case 1:
        return (
          <Box>
            <Typography variant="body1" gutterBottom>
              Your principal ID is a unique identifier in the PayChain network. 
              For testing purposes, you can generate a random ID or enter your own.
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <TextField
                fullWidth
                id="principalId"
                name="principalId"
                label="Principal ID"
                value={formik.values.principalId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.principalId && Boolean(formik.errors.principalId)}
                helperText={formik.touched.principalId && formik.errors.principalId}
                margin="normal"
                sx={{ mr: 2 }}
              />
              <Button 
                variant="outlined" 
                onClick={generatePrincipalId}
                sx={{ mt: 2, height: 56 }}
              >
                Generate
              </Button>
            </Box>
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Review Your Information
            </Typography>
            <Paper 
              sx={{ 
                p: 2, 
                mt: 2, 
                bgcolor: alpha(theme.palette.background.paper, 0.6),
                backdropFilter: 'blur(10px)'
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">
                    Email:
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="body1">{formik.values.email}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">
                    Principal ID:
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="body1">{formik.values.principalId}</Typography>
                </Grid>
              </Grid>
            </Paper>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              By creating an account, you agree to our Terms of Service and Privacy Policy.
            </Typography>
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  // Success page content
  const renderSuccessContent = () => (
    <Box sx={{ textAlign: 'center' }}>
      <Box 
        sx={{ 
          width: 80, 
          height: 80, 
          borderRadius: '50%',
          bgcolor: theme.palette.success.main,
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
        }}
      >
        <CheckIcon fontSize="large" />
      </Box>
      <Typography variant="h5" gutterBottom>
        Registration Successful!
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Your account has been created. You will be redirected to the login page in a few seconds.
      </Typography>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => navigate('/login')}
        sx={{ mt: 2 }}
      >
        Go to Login
      </Button>
    </Box>
  );

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
          maxWidth: 600, 
          width: '100%',
          borderRadius: 3,
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
          overflow: 'hidden',
          background: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: 'blur(20px)',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Create Your PayChain Account
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          {registrationSuccess ? (
            renderSuccessContent()
          ) : (
            <form onSubmit={formik.handleSubmit}>
              <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              
              {getStepContent(activeStep)}
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                >
                  Back
                </Button>
                
                <Box>
                  {activeStep === steps.length - 1 ? (
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      disabled={isRegistering}
                      sx={{ 
                        minWidth: 120,
                        borderRadius: 2,
                        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
                      }}
                    >
                      {isRegistering ? <CircularProgress size={24} /> : 'Create Account'}
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleNext}
                      sx={{ 
                        minWidth: 120,
                        borderRadius: 2,
                        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
                      }}
                    >
                      Next
                    </Button>
                  )}
                </Box>
              </Box>
              
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="body2">
                  Already have an account?{' '}
                  <Link component={RouterLink} to="/login">
                    Sign in
                  </Link>
                </Typography>
              </Box>
            </form>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Register; 