import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
  CircularProgress,
  Alert,
  Divider,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Schedule as ScheduleIcon,
  Pause as PauseIcon,
  PlayArrow as PlayArrowIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { format, parseISO } from 'date-fns';
import { backendAdapter } from '../services/backendAdapter';
import { usePayChainStore } from '../store/paychainStore';

interface ScheduledPayment {
  id: number;
  user_id: number;
  recipient_principal: string;
  amount: number;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  start_date: string;
  next_payment_date: string;
  is_active: boolean;
}

interface FormValues {
  recipient: string;
  amount: number;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  startDate: Date;
}

const ScheduledPayments: React.FC = () => {
  const [payments, setPayments] = useState<ScheduledPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<ScheduledPayment | null>(null);
  const { user } = usePayChainStore();

  const fetchScheduledPayments = async () => {
    try {
      setLoading(true);
      const response = await backendAdapter.scheduledPayments.getScheduledPayments();
      setPayments(response.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching scheduled payments:', err);
      setError('Failed to load scheduled payments. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScheduledPayments();
  }, []);

  const handleOpenDialog = (payment?: ScheduledPayment) => {
    setSelectedPayment(payment || null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPayment(null);
  };

  const handleToggleActive = async (payment: ScheduledPayment) => {
    try {
      await backendAdapter.scheduledPayments.updateScheduledPayment(
        payment.id.toString(),
        {
          ...payment,
          is_active: !payment.is_active
        }
      );
      
      // Update the local state
      setPayments(payments.map(p => 
        p.id === payment.id ? { ...p, is_active: !p.is_active } : p
      ));
    } catch (err) {
      console.error('Error toggling scheduled payment:', err);
      setError('Failed to update payment status. Please try again later.');
    }
  };

  const handleDeletePayment = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this scheduled payment?')) {
      return;
    }
    
    try {
      await backendAdapter.scheduledPayments.deleteScheduledPayment(id.toString());
      setPayments(payments.filter(p => p.id !== id));
    } catch (err) {
      console.error('Error deleting scheduled payment:', err);
      setError('Failed to delete payment. Please try again later.');
    }
  };

  const handleSubmit = async (
    values: FormValues,
    { resetForm, setSubmitting }: FormikHelpers<FormValues>
  ) => {
    try {
      const paymentData = {
        recipient_principal: values.recipient,
        amount: values.amount,
        description: values.description,
        frequency: values.frequency,
        start_date: format(values.startDate, 'yyyy-MM-dd'),
        is_active: true
      };

      if (selectedPayment) {
        await backendAdapter.scheduledPayments.updateScheduledPayment(
          selectedPayment.id.toString(),
          { ...paymentData, id: selectedPayment.id }
        );
      } else {
        await backendAdapter.scheduledPayments.createScheduledPayment(paymentData);
      }

      resetForm();
      handleCloseDialog();
      fetchScheduledPayments();
    } catch (err) {
      console.error('Error submitting scheduled payment:', err);
      setError(
        selectedPayment
          ? 'Failed to update scheduled payment. Please try again.'
          : 'Failed to create scheduled payment. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const validationSchema = Yup.object({
    recipient: Yup.string()
      .required('Recipient is required'),
    amount: Yup.number()
      .required('Amount is required')
      .positive('Amount must be positive'),
    description: Yup.string()
      .required('Description is required')
      .max(100, 'Description cannot exceed 100 characters'),
    frequency: Yup.string()
      .oneOf(['daily', 'weekly', 'monthly'], 'Invalid frequency')
      .required('Frequency is required'),
    startDate: Yup.date()
      .required('Start date is required')
  });

  const initialValues: FormValues = selectedPayment
    ? {
        recipient: selectedPayment.recipient_principal,
        amount: selectedPayment.amount,
        description: selectedPayment.description,
        frequency: selectedPayment.frequency,
        startDate: parseISO(selectedPayment.start_date),
      }
    : {
        recipient: '',
        amount: 0,
        description: '',
        frequency: 'monthly',
        startDate: new Date(),
      };

  const getFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case 'daily':
        return 'Daily';
      case 'weekly':
        return 'Weekly';
      case 'monthly':
        return 'Monthly';
      default:
        return frequency;
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Scheduled Payments
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          New Schedule
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={2}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : payments.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <ScheduleIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No scheduled payments yet
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              Set up recurring payments to automatically transfer funds on a schedule.
            </Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
            >
              Create Your First Scheduled Payment
            </Button>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Recipient</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Frequency</TableCell>
                  <TableCell>Next Payment</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      {backendAdapter.utils.formatPrincipalId(payment.recipient_principal || '')}
                    </TableCell>
                    <TableCell>{payment.amount.toFixed(2)} ICP</TableCell>
                    <TableCell>{payment.description}</TableCell>
                    <TableCell>{getFrequencyLabel(payment.frequency)}</TableCell>
                    <TableCell>
                      {format(parseISO(payment.next_payment_date), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={payment.is_active ? 'Active' : 'Paused'}
                        color={payment.is_active ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title={payment.is_active ? 'Pause' : 'Activate'}>
                        <IconButton
                          size="small"
                          onClick={() => handleToggleActive(payment)}
                          color={payment.is_active ? 'default' : 'primary'}
                        >
                          {payment.is_active ? <PauseIcon /> : <PlayArrowIcon />}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(payment)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          onClick={() => handleDeletePayment(payment.id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedPayment ? 'Edit Scheduled Payment' : 'Create Scheduled Payment'}
        </DialogTitle>
        <Divider />
        
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting, errors, touched, values, setFieldValue, handleSubmit }) => (
            <form onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(e);
            }}>
              <DialogContent>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      name="recipient"
                      label="Recipient Principal ID"
                      fullWidth
                      variant="outlined"
                      error={touched.recipient && Boolean(errors.recipient)}
                      helperText={touched.recipient && errors.recipient}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      name="amount"
                      label="Amount (ICP)"
                      type="number"
                      fullWidth
                      variant="outlined"
                      inputProps={{ min: 0, step: 0.01 }}
                      error={touched.amount && Boolean(errors.amount)}
                      helperText={touched.amount && errors.amount}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      name="frequency"
                      label="Frequency"
                      select
                      fullWidth
                      variant="outlined"
                      error={touched.frequency && Boolean(errors.frequency)}
                      helperText={touched.frequency && errors.frequency}
                    >
                      <MenuItem value="daily">Daily</MenuItem>
                      <MenuItem value="weekly">Weekly</MenuItem>
                      <MenuItem value="monthly">Monthly</MenuItem>
                    </Field>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      name="description"
                      label="Description"
                      fullWidth
                      variant="outlined"
                      error={touched.description && Boolean(errors.description)}
                      helperText={touched.description && errors.description}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="Start Date"
                        value={values.startDate}
                        onChange={(date) => setFieldValue('startDate', date)}
                        disablePast
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            variant: "outlined",
                            error: touched.startDate && Boolean(errors.startDate),
                            helperText: touched.startDate && (errors.startDate as string)
                          }
                        }}
                      />
                    </LocalizationProvider>
                  </Grid>
                </Grid>
              </DialogContent>
              
              <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={handleCloseDialog}>Cancel</Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                  startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                >
                  {selectedPayment ? 'Update' : 'Create'}
                </Button>
              </DialogActions>
            </form>
          )}
        </Formik>
      </Dialog>
    </Box>
  );
};

export default ScheduledPayments; 