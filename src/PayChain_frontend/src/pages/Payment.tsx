import React, { useState } from 'react';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { usePayChainStore } from '../store/paychainStore';
import { createGenericPrincipal } from '../utils/principal';

const validationSchema = Yup.object({
  recipientAddress: Yup.string()
    .required('Recipient address is required')
    .matches(/^[a-zA-Z0-9-]+$/, 'Invalid principal ID format'),
  amount: Yup.number()
    .required('Amount is required')
    .positive('Amount must be positive')
    .typeError('Amount must be a number'),
});

export default function Payment() {
  const { processPayment, loading, error } = usePayChainStore();
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (values: { recipientAddress: string; amount: string }) => {
    setSuccess(false);

    try {
      const genericPrincipal = createGenericPrincipal(values.recipientAddress);
      const amountValue = Number(values.amount);

      const result = await processPayment(genericPrincipal, amountValue);
      if ('ok' in result) {
        setSuccess(true);
      }
    } catch (error) {
      console.error('Payment error:', error);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Send Payment
        </Typography>
        <Formik
          initialValues={{ recipientAddress: '', amount: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isValid, dirty }) => (
            <Form>
              <Field
                name="recipientAddress"
                as={TextField}
                fullWidth
                label="Recipient Address"
                margin="normal"
                required
                placeholder="Enter ICP principal ID"
                helperText={errors.recipientAddress && touched.recipientAddress ? errors.recipientAddress : 'Enter the recipient\'s Principal ID'}
                error={errors.recipientAddress && touched.recipientAddress}
              />
              <Field
                name="amount"
                as={TextField}
                fullWidth
                label="Amount (ICP)"
                type="number"
                margin="normal"
                required
                placeholder="Enter amount in ICP"
                helperText={errors.amount && touched.amount ? errors.amount : 'Enter the amount to send'}
                error={errors.amount && touched.amount}
              />
              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}
              {success && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  Payment processed successfully!
                </Alert>
              )}
              <Box mt={3}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  disabled={loading || !isValid || !dirty}
                >
                  {loading ? (
                    <>
                      <CircularProgress size={24} sx={{ mr: 1 }} />
                      Processing...
                    </>
                  ) : (
                    'Send Payment'
                  )}
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
  );
} 