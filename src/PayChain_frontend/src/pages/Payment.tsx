import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  CardContent,
  Alert,
  CircularProgress,
  Card,
  Grid,
} from '@mui/material';
import { Formik, FormikProps } from 'formik';
import * as Yup from 'yup';
import { usePayChainStore } from '../store/paychainStore';
import { createGenericPrincipal } from '../utils/principal';
import AnimatedCard from '../components/AnimatedCard';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface PaymentFormValues {
  recipientAddress: string;
  amount: string;
  description: string;
}

const validationSchema = Yup.object({
  recipientAddress: Yup.string()
    .required('Recipient address is required')
    .min(5, 'Enter a valid address'),
  amount: Yup.number()
    .required('Amount is required')
    .positive('Amount must be positive')
    .typeError('Amount must be a number'),
  description: Yup.string()
    .max(100, 'Description cannot exceed 100 characters'),
});

export default function Payment() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { sendPayment } = usePayChainStore();
  const navigate = useNavigate();

  const initialValues: PaymentFormValues = {
    recipientAddress: '',
    amount: '',
    description: '',
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setError(null);
      
      try {
        // Call the new sendPayment function with string recipient address
        await sendPayment(
          values.recipientAddress, 
          parseFloat(values.amount),
          values.description
        );
        
        setSuccess(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } catch (err) {
        setError('Failed to process payment. Please try again.');
        console.error('Payment error:', err);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Send Payment</Typography>
      
      <Card 
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        sx={{ 
          maxWidth: 600, 
          mx: 'auto',
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)'
        }}
      >
        <CardContent>
          {success ? (
            <Alert severity="success">
              Payment sent successfully! Redirecting to dashboard...
            </Alert>
          ) : (
            <form onSubmit={formik.handleSubmit}>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="recipientAddress"
                    name="recipientAddress"
                    label="Recipient Address"
                    value={formik.values.recipientAddress}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.recipientAddress && Boolean(formik.errors.recipientAddress)}
                    helperText={formik.touched.recipientAddress && formik.errors.recipientAddress}
                    disabled={formik.isSubmitting}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="amount"
                    name="amount"
                    label="Amount"
                    value={formik.values.amount}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.amount && Boolean(formik.errors.amount)}
                    helperText={formik.touched.amount && formik.errors.amount}
                    disabled={formik.isSubmitting}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="description"
                    name="description"
                    label="Description (Optional)"
                    multiline
                    rows={2}
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.description && Boolean(formik.errors.description)}
                    helperText={formik.touched.description && formik.errors.description}
                    disabled={formik.isSubmitting}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={formik.isSubmitting}
                    sx={{ py: 1.5 }}
                  >
                    {formik.isSubmitting ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      'Send Payment'
                    )}
                  </Button>
                </Grid>
              </Grid>
            </form>
          )}
        </CardContent>
      </Card>
    </Box>
  );
} 