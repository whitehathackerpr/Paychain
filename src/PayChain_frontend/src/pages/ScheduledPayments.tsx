import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  IconButton,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  useTheme,
  alpha,
  Tooltip,
  Divider,
  Alert,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CalendarToday as CalendarIcon,
  Payment as PaymentIcon,
  Timer as TimerIcon,
  Loop as LoopIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { format } from 'date-fns';
import { backendAdapter } from '../services/backendAdapter';

// Frequency options for the scheduled payments
const frequencyOptions = [
  { value: 'once', label: 'Once' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Bi-weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly', label: 'Yearly' },
];

// TypeScript interface for a scheduled payment
interface ScheduledPayment {
  id: number;
  recipient_principal: string;
  amount: number;
  description: string | null;
  start_date: string;
  frequency: string;
  end_date: string | null;
  max_payments: number | null;
  is_active: boolean;
  payments_made: number;
  next_payment_date: string | null;
}

// Form values interface
interface PaymentFormValues {
  recipientAddress: string;
  amount: string;
  description: string;
  startDate: Date;
  frequency: string;
  endDate: Date | null;
  maxPayments: string;
  isActive: string;
}

// Validation schema using Yup
const validationSchema = Yup.object({
  recipientAddress: Yup.string()
    .required('Recipient address is required')
    .min(5, 'Address must be at least 5 characters'),
  amount: Yup.number()
    .required('Amount is required')
    .positive('Amount must be positive')
    .typeError('Amount must be a number'),
  description: Yup.string(),
  startDate: Yup.date().required('Start date is required'),
  frequency: Yup.string().required('Frequency is required'),
  endDate: Yup.date().nullable(),
  maxPayments: Yup.number()
    .nullable()
    .transform((value) => (isNaN(value) ? null : value))
    .min(1, 'Must be at least 1')
    .integer('Must be a whole number'),
  isActive: Yup.string().oneOf(['true', 'false']),
});

const ScheduledPayments: React.FC = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState<ScheduledPayment[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<ScheduledPayment | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [paymentToDelete, setPaymentToDelete] = useState<number | null>(null);

  // Load scheduled payments on mount
  useEffect(() => {
    fetchPayments();
  }, []);

  // Fetch payments from the backend
  const fetchPayments = async () => {
    setLoading(true);
    try {
      const response = await backendAdapter.scheduledPayments.getScheduledPayments();
      setPayments(response.data);
    } catch (err) {
      console.error('Error fetching scheduled payments:', err);
      setError('Failed to load scheduled payments');
    } finally {
      setLoading(false);
    }
  };

  // Handle dialog open for creating a new payment
  const handleCreatePayment = () => {
    setSelectedPayment(null);
    setFormMode('create');
    setOpenDialog(true);
  };

  // Handle dialog open for editing an existing payment
  const handleEditPayment = (payment: ScheduledPayment) => {
    setSelectedPayment(payment);
    setFormMode('edit');
    setOpenDialog(true);
  };

  // Handle dialog close
  const handleCloseDialog = () => {
    setOpenDialog(false);
    formik.resetForm();
  };

  // Open delete confirmation dialog
  const handleDeleteClick = (paymentId: number) => {
    setPaymentToDelete(paymentId);
    setDeleteConfirmOpen(true);
  };

  // Confirm delete action
  const handleConfirmDelete = async () => {
    if (paymentToDelete) {
      try {
        await backendAdapter.scheduledPayments.deleteScheduledPayment(paymentToDelete);
        setPayments((prev) => prev.filter((p) => p.id !== paymentToDelete));
      } catch (err) {
        console.error('Error deleting payment:', err);
        setError('Failed to delete scheduled payment');
      } finally {
        setDeleteConfirmOpen(false);
        setPaymentToDelete(null);
      }
    }
  };

  // Cancel delete action
  const handleCancelDelete = () => {
    setDeleteConfirmOpen(false);
    setPaymentToDelete(null);
  };

  // Formik setup for create/edit form
  const formik = useFormik<PaymentFormValues>({
    initialValues: {
      recipientAddress: selectedPayment?.recipient_principal || '',
      amount: selectedPayment?.amount.toString() || '',
      description: selectedPayment?.description || '',
      startDate: selectedPayment?.start_date ? new Date(selectedPayment.start_date) : new Date(),
      frequency: selectedPayment?.frequency || 'monthly',
      endDate: selectedPayment?.end_date ? new Date(selectedPayment.end_date) : null,
      maxPayments: selectedPayment?.max_payments?.toString() || '',
      isActive: selectedPayment?.is_active ? "true" : "false",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const paymentData = {
          recipient_principal: values.recipientAddress,
          amount: parseFloat(values.amount),
          description: values.description,
          start_date: values.startDate.toISOString().split('T')[0],
          frequency: values.frequency,
          end_date: values.endDate ? values.endDate.toISOString().split('T')[0] : null,
          max_payments: values.maxPayments ? parseInt(values.maxPayments) : null,
          is_active: values.isActive === "true",
        };

        if (formMode === 'create') {
          // Create new scheduled payment
          const response = await backendAdapter.scheduledPayments.createScheduledPayment(paymentData);
          setPayments((prev) => [...prev, response.data]);
        } else if (selectedPayment) {
          // Update existing scheduled payment
          const response = await backendAdapter.scheduledPayments.updateScheduledPayment(
            selectedPayment.id,
            paymentData
          );
          setPayments((prev) =>
            prev.map((p) => (p.id === selectedPayment.id ? response.data : p))
          );
        }

        handleCloseDialog();
      } catch (err) {
        console.error('Error submitting payment:', err);
        setError('Failed to save scheduled payment');
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Reset form when selected payment changes
  useEffect(() => {
    if (selectedPayment) {
      formik.setValues({
        recipientAddress: selectedPayment.recipient_principal,
        amount: selectedPayment.amount.toString(),
        description: selectedPayment.description || '',
        startDate: new Date(selectedPayment.start_date),
        frequency: selectedPayment.frequency,
        endDate: selectedPayment.end_date ? new Date(selectedPayment.end_date) : null,
        maxPayments: selectedPayment.max_payments?.toString() || '',
        isActive: selectedPayment.is_active ? "true" : "false",
      });
    } else {
      formik.resetForm();
    }
  }, [selectedPayment]);

  // Helper function to get human-readable frequency
  const getFrequencyLabel = (frequency: string) => {
    const option = frequencyOptions.find((opt) => opt.value === frequency);
    return option ? option.label : frequency;
  };

  // Helper function to get next payment text
  const getNextPaymentText = (payment: ScheduledPayment) => {
    if (!payment.is_active) return 'Inactive';
    if (!payment.next_payment_date) return 'No future payments';
    return format(new Date(payment.next_payment_date), 'MMM d, yyyy');
  };

  // Loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Scheduled Payments
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreatePayment}
          sx={{
            borderRadius: 2,
            boxShadow: '0 4px 14px 0 rgba(0,118,255,0.39)',
          }}
        >
          Create New Scheduled Payment
        </Button>
      </Box>

      {payments.length === 0 ? (
        <Paper
          sx={{
            p: 4,
            textAlign: 'center',
            borderRadius: 2,
            bgcolor: alpha(theme.palette.background.paper, 0.8),
            backdropFilter: 'blur(10px)',
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No scheduled payments found
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Create your first scheduled payment to automate your recurring transfers.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {payments.map((payment) => (
            <Grid item xs={12} md={6} key={payment.id}>
              <Card
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                sx={{
                  height: '100%',
                  borderRadius: 2,
                  boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 20px rgba(0,0,0,0.15)',
                  },
                  bgcolor: payment.is_active
                    ? alpha(theme.palette.background.paper, 0.9)
                    : alpha(theme.palette.grey[300], 0.5),
                  border: payment.is_active
                    ? `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
                    : `1px solid ${theme.palette.divider}`,
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" component="div">
                      {payment.description || `Payment to ${payment.recipient_principal.slice(0, 8)}...`}
                    </Typography>
                    <Box>
                      <Tooltip title="Edit Payment">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleEditPayment(payment)}
                          sx={{ mr: 1 }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Payment">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteClick(payment.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <PaymentIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                    <Typography variant="body1">
                      <strong>${payment.amount.toFixed(2)}</strong>
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LoopIcon sx={{ mr: 1, color: theme.palette.secondary.main }} />
                    <Typography variant="body2">
                      {getFrequencyLabel(payment.frequency)}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CalendarIcon sx={{ mr: 1, color: theme.palette.info.main }} />
                    <Typography variant="body2">
                      Started: {format(new Date(payment.start_date), 'MMM d, yyyy')}
                    </Typography>
                  </Box>

                  {payment.end_date && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CalendarIcon sx={{ mr: 1, color: theme.palette.error.main }} />
                      <Typography variant="body2">
                        Ends: {format(new Date(payment.end_date), 'MMM d, yyyy')}
                      </Typography>
                    </Box>
                  )}

                  <Divider sx={{ my: 1.5 }} />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TimerIcon sx={{ mr: 1, color: theme.palette.warning.main }} />
                      <Typography variant="body2">
                        Next payment: {getNextPaymentText(payment)}
                      </Typography>
                    </Box>
                    <Chip
                      label={payment.is_active ? 'Active' : 'Inactive'}
                      color={payment.is_active ? 'success' : 'default'}
                      size="small"
                    />
                  </Box>

                  {payment.payments_made > 0 && (
                    <Box sx={{ mt: 1.5, display: 'flex', alignItems: 'center' }}>
                      <InfoIcon sx={{ mr: 1, color: theme.palette.grey[600], fontSize: 20 }} />
                      <Typography variant="body2" color="text.secondary">
                        {payment.payments_made} payment{payment.payments_made !== 1 ? 's' : ''} processed
                        {payment.max_payments && ` (of ${payment.max_payments})`}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>
          {formMode === 'create' ? 'Create Scheduled Payment' : 'Edit Scheduled Payment'}
        </DialogTitle>
        <DialogContent>
          <form onSubmit={formik.handleSubmit}>
            <Box sx={{ mt: 1 }}>
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
                margin="normal"
              />

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
                margin="normal"
              />

              <TextField
                fullWidth
                id="description"
                name="description"
                label="Description (Optional)"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
                margin="normal"
              />

              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Box sx={{ mt: 2, mb: 1 }}>
                  <DatePicker
                    label="Start Date"
                    value={formik.values.startDate}
                    onChange={(newValue) => {
                      formik.setFieldValue('startDate', newValue);
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        margin: 'normal',
                        error: formik.touched.startDate && Boolean(formik.errors.startDate),
                        helperText: formik.touched.startDate && formik.errors.startDate as string,
                      },
                    }}
                  />
                </Box>
              </LocalizationProvider>

              <FormControl fullWidth margin="normal">
                <InputLabel id="frequency-label">Frequency</InputLabel>
                <Select
                  labelId="frequency-label"
                  id="frequency"
                  name="frequency"
                  value={formik.values.frequency}
                  onChange={formik.handleChange}
                  label="Frequency"
                >
                  {frequencyOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Box sx={{ mt: 2, mb: 1 }}>
                  <DatePicker
                    label="End Date (Optional)"
                    value={formik.values.endDate}
                    onChange={(newValue) => {
                      formik.setFieldValue('endDate', newValue);
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        margin: 'normal',
                        error: formik.touched.endDate && Boolean(formik.errors.endDate),
                        helperText: formik.touched.endDate && formik.errors.endDate as string,
                      },
                    }}
                  />
                </Box>
              </LocalizationProvider>

              <TextField
                fullWidth
                id="maxPayments"
                name="maxPayments"
                label="Max Number of Payments (Optional)"
                value={formik.values.maxPayments}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.maxPayments && Boolean(formik.errors.maxPayments)}
                helperText={formik.touched.maxPayments && formik.errors.maxPayments}
                margin="normal"
                type="number"
              />

              <FormControl fullWidth margin="normal">
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  id="isActive"
                  name="isActive"
                  value={formik.values.isActive}
                  onChange={formik.handleChange}
                  label="Status"
                >
                  <MenuItem value="true">Active</MenuItem>
                  <MenuItem value="false">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => formik.handleSubmit()}
            disabled={formik.isSubmitting || !formik.isValid}
          >
            {formik.isSubmitting ? (
              <CircularProgress size={24} />
            ) : formMode === 'create' ? (
              'Create'
            ) : (
              'Save Changes'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this scheduled payment? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ScheduledPayments; 