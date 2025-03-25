import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  CircularProgress,
  Grid,
  Paper,
  InputAdornment,
  Divider,
  IconButton,
  Snackbar,
  Alert,
  useTheme,
  alpha,
  Chip,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ShareIcon from '@mui/icons-material/Share';
import QrCodeIcon from '@mui/icons-material/QrCode';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { motion } from 'framer-motion';
import { usePayChainStore } from '../store/paychainStore';
import { backendAdapter } from '../services/backendAdapter';
import { useFormik } from 'formik';
import * as Yup from 'yup';

// Conditionally import QRCode with a fallback
let QRCode: any;
try {
  // Try to import QRCode
  QRCode = require('qrcode.react').default;
} catch (e) {
  // Fallback to a simple component if qrcode.react is not available
  QRCode = ({ value, size }: { value: string; size: number; level?: string; includeMargin?: boolean }) => (
    <Box
      sx={{
        width: size,
        height: size,
        backgroundColor: '#f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid #ddd',
      }}
    >
      <Typography variant="caption" align="center">QR Code Placeholder<br />Value: {value.substring(0, 20)}...</Typography>
    </Box>
  );
}

interface ReceiveFormValues {
  amount: string;
  description: string;
}

const validationSchema = Yup.object({
  amount: Yup.number()
    .min(0, 'Amount must be positive')
    .typeError('Amount must be a number'),
  description: Yup.string()
    .max(100, 'Description cannot exceed 100 characters'),
});

export default function Receive() {
  const { user } = usePayChainStore();
  const [qrCodeData, setQrCodeData] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [shareableLink, setShareableLink] = useState('');
  const [copySnackbarOpen, setCopySnackbarOpen] = useState(false);
  const [initialQrGenerated, setInitialQrGenerated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alertState, setAlertState] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const theme = useTheme();

  const formik = useFormik({
    initialValues: {
      amount: '',
      description: '',
    },
    validationSchema,
    onSubmit: (values) => {
      generateQrCode(values);
    },
  });

  // Generate an initial QR code on component mount
  useEffect(() => {
    if (user?.principalId && !initialQrGenerated) {
      generateDefaultQrCode();
    }
  }, [user?.principalId, initialQrGenerated]);

  const generateDefaultQrCode = async () => {
    if (!user?.principalId) return;
    
    setIsGenerating(true);
    try {
      // Try to get a QR code from the backend
      const qrData = await backendAdapter.qrCode.generateReceiveQR();
      setQrCodeData(qrData.qrContent);
      
      // Also generate a shareable link
      try {
        const linkData = await backendAdapter.qrCode.generateShareableLink();
        setShareableLink(linkData);
      } catch (error) {
        console.error('Error generating shareable link:', error);
        // Fallback to a dummy link for demo
        setShareableLink(`${window.location.origin}/pay/${user.principalId}`);
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
      // Fallback to a simple JSON string for demo purposes
      const fallbackData = {
        recipientId: user.principalId,
        timestamp: new Date().toISOString()
      };
      setQrCodeData(JSON.stringify(fallbackData));
      setShareableLink(`${window.location.origin}/pay/${user.principalId}`);
    } finally {
      setIsGenerating(false);
      setInitialQrGenerated(true);
    }
  };

  const generateQrCode = async (values: ReceiveFormValues) => {
    if (!user?.principalId) return;
    
    setIsGenerating(true);
    try {
      // Try to get a QR code from the backend with amount and description
      const amount = values.amount ? parseFloat(values.amount) : undefined;
      const qrData = await backendAdapter.qrCode.generateReceiveQR(amount, values.description);
      setQrCodeData(qrData.qrContent);
      
      // Also generate a shareable link
      try {
        const linkData = await backendAdapter.qrCode.generateShareableLink(amount, values.description);
        setShareableLink(linkData);
      } catch (error) {
        console.error('Error generating shareable link:', error);
        // Fallback to a dummy link for demo
        setShareableLink(`${window.location.origin}/pay/${user.principalId}${amount ? `?amount=${amount}` : ''}${values.description ? `&desc=${encodeURIComponent(values.description)}` : ''}`);
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
      // Fallback to a simple JSON string for demo purposes
      const fallbackData = {
        recipientId: user.principalId,
        amount: values.amount ? parseFloat(values.amount) : undefined,
        description: values.description,
        timestamp: new Date().toISOString()
      };
      setQrCodeData(JSON.stringify(fallbackData));
      setShareableLink(`${window.location.origin}/pay/${user.principalId}${values.amount ? `?amount=${values.amount}` : ''}${values.description ? `&desc=${encodeURIComponent(values.description)}` : ''}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyPrincipalId = () => {
    if (user?.principalId) {
      navigator.clipboard.writeText(user.principalId);
      setAlertState({
        open: true,
        message: 'Principal ID copied to clipboard!',
        severity: 'success',
      });
    }
  };

  const handleCopyLink = () => {
    if (shareableLink) {
      navigator.clipboard.writeText(shareableLink);
      setAlertState({
        open: true,
        message: 'Payment link copied to clipboard!',
        severity: 'success',
      });
    }
  };

  const handleShare = async () => {
    if (navigator.share && shareableLink) {
      try {
        await navigator.share({
          title: 'PayChain Payment Request',
          text: `Please send ${formik.values.amount || ''} ICP to my wallet${formik.values.description ? ` for ${formik.values.description}` : ''}.`,
          url: shareableLink,
        });
        
        setAlertState({
          open: true,
          message: 'Payment request shared successfully!',
          severity: 'success',
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  const handleDownloadQR = () => {
    const qrCodeElement = document.querySelector('#payment-qr-code svg');
    if (qrCodeElement) {
      // Create a canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return;
      
      // Create an image from the SVG
      const svgData = new XMLSerializer().serializeToString(qrCodeElement);
      const img = new Image();
      
      img.onload = () => {
        // Set canvas dimensions
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw white background
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw the image
        ctx.drawImage(img, 0, 0);
        
        // Create download link
        const link = document.createElement('a');
        link.download = 'paychain-qr.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        setAlertState({
          open: true,
          message: 'QR code downloaded!',
          severity: 'success' as const,
        });
      };
      
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
      },
    },
  };

  return (
    <Box p={3}>
      <Typography 
        variant="h4" 
        gutterBottom
        component={motion.h1}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Receive Payment
      </Typography>
      
      <Grid container spacing={3}>
        {/* QR Code Display */}
        <Grid item xs={12} md={6}>
          <Card 
            component={motion.div}
            variants={itemVariants}
            sx={{ 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              backdropFilter: 'blur(10px)',
              bgcolor: alpha(theme.palette.background.paper, 0.8),
            }}
          >
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4 }}>
              <Typography variant="h6" gutterBottom>
                Your QR Code
              </Typography>
              
              {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
                  <CircularProgress />
                </Box>
              ) : qrCodeData ? (
                <>
                  <Box
                    sx={{
                      position: 'relative',
                      p: 2,
                      borderRadius: 3,
                      bgcolor: 'white',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                      mb: 3,
                    }}
                  >
                    <QRCode
                      value={qrCodeData}
                      size={250}
                      level="H"
                      includeMargin={true}
                      renderAs="svg"
                      imageSettings={{
                        src: '/logo192.png',
                        excavate: true,
                        height: 50,
                        width: 50,
                      }}
                    />
                  </Box>
                  
                  <Box sx={{ mb: 2, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Amount: {formik.values.amount ? `${formik.values.amount} ICP` : 'Not specified'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Description: {formik.values.description || 'Not specified'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Your Principal ID:
                    </Typography>
                    <Chip 
                      label={backendAdapter.utils.formatPrincipalId(user?.principalId || '')}
                      variant="outlined"
                      color="primary"
                      sx={{ mb: 2 }}
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
                    <Button
                      variant="outlined"
                      startIcon={<ContentCopyIcon />}
                      onClick={handleCopyPrincipalId}
                      size="small"
                    >
                      Copy ID
                    </Button>
                    
                    <Button
                      variant="outlined"
                      startIcon={<ContentCopyIcon />}
                      onClick={handleCopyLink}
                      size="small"
                    >
                      Copy Link
                    </Button>
                    
                    <Button
                      variant="contained"
                      startIcon={<ShareIcon />}
                      onClick={handleShare}
                      size="small"
                      disabled={!navigator.share}
                    >
                      Share
                    </Button>
                    
                    <Button
                      variant="outlined"
                      startIcon={<CloudDownloadIcon />}
                      onClick={handleDownloadQR}
                      size="small"
                    >
                      Download
                    </Button>
                  </Box>
                </>
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
                  <Typography color="text.secondary">No QR code generated yet.</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        {/* QR Code Generation Form */}
        <Grid item xs={12} md={6}>
          <Card
            component={motion.div}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            sx={{ 
              borderRadius: 2,
              boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" gutterBottom>
                Payment Details
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Customize your payment request by specifying an amount and description.
              </Typography>
              
              <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="amount"
                      name="amount"
                      label="Amount (Optional)"
                      value={formik.values.amount}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.amount && Boolean(formik.errors.amount)}
                      helperText={formik.touched.amount && formik.errors.amount}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="description"
                      name="description"
                      label="Description (Optional)"
                      placeholder="What's this payment for?"
                      value={formik.values.description}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.description && Boolean(formik.errors.description)}
                      helperText={formik.touched.description && formik.errors.description}
                      multiline
                      rows={2}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      size="large"
                      disabled={isGenerating || formik.isSubmitting}
                      sx={{ py: 1.5 }}
                    >
                      {isGenerating ? <CircularProgress size={24} /> : 'Generate QR Code'}
                    </Button>
                  </Grid>
                </Grid>
              </form>
              
              <Box sx={{ mt: 4 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Instructions for Receiver
                </Typography>
                <Paper sx={{ p: 2, backgroundColor: alpha(theme.palette.info.light, 0.1), borderRadius: 1 }}>
                  <Typography variant="body2">
                    1. Share the QR code or payment link with the sender.
                  </Typography>
                  <Typography variant="body2">
                    2. The sender can scan the QR code or click the link to open the payment page.
                  </Typography>
                  <Typography variant="body2">
                    3. Once the payment is complete, you'll receive a notification and the funds will appear in your balance.
                  </Typography>
                </Paper>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Snackbar
        open={alertState.open}
        autoHideDuration={3000}
        onClose={() => setAlertState({ ...alertState, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setAlertState({ ...alertState, open: false })} 
          severity={alertState.severity as 'success' | 'error' | 'info' | 'warning'}
        >
          {alertState.message}
        </Alert>
      </Snackbar>
    </Box>
  );
} 