import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Switch,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Divider,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert,
  useTheme,
  alpha,
  FormControlLabel,
  Grid,
  Paper,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Payment as PaymentIcon,
  Language as LanguageIcon,
  DarkMode as DarkModeIcon,
  LockReset as LockResetIcon,
  Delete as DeleteIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { usePayChainStore } from '../store/paychainStore';

const Settings: React.FC = () => {
  const theme = useTheme();
  const { user, logout } = usePayChainStore();
  
  // Settings states
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(true);
  const [language, setLanguage] = useState('English');
  const [securityLevel, setSecurityLevel] = useState('High');
  const [paymentMethod, setPaymentMethod] = useState('Default');
  
  // Dialog states
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  
  // Password reset form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  
  const handleNotificationsChange = () => {
    setNotificationsEnabled(!notificationsEnabled);
    setShowSuccessAlert(true);
    setTimeout(() => setShowSuccessAlert(false), 3000);
  };
  
  const handleDarkModeChange = () => {
    setDarkModeEnabled(!darkModeEnabled);
    setShowSuccessAlert(true);
    setTimeout(() => setShowSuccessAlert(false), 3000);
  };
  
  const handleResetPasswordSubmit = () => {
    if (newPassword !== confirmNewPassword) {
      setShowErrorAlert(true);
      setTimeout(() => setShowErrorAlert(false), 3000);
      return;
    }
    
    // Password reset logic would go here
    setResetPasswordOpen(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setShowSuccessAlert(true);
    setTimeout(() => setShowSuccessAlert(false), 3000);
  };
  
  const handleDeleteAccount = () => {
    // Account deletion logic would go here
    setDeleteAccountOpen(false);
    logout();
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
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Settings
      </Typography>
      
      {showSuccessAlert && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Settings updated successfully!
        </Alert>
      )}
      
      {showErrorAlert && (
        <Alert severity="error" sx={{ mb: 3 }}>
          There was an error. Please try again.
        </Alert>
      )}
      
      <Grid 
        container 
        spacing={4}
        component={motion.div}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* General Settings */}
        <Grid item xs={12} md={6}>
          <Card 
            component={motion.div}
            variants={itemVariants}
            sx={{
              height: '100%',
              backdropFilter: 'blur(10px)',
              bgcolor: alpha(theme.palette.background.paper, 0.8),
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                General Settings
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <NotificationsIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Push Notifications" 
                    secondary="Receive notifications for transactions and updates"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      checked={notificationsEnabled}
                      onChange={handleNotificationsChange}
                      color="primary"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                
                <Divider component="li" />
                
                <ListItem>
                  <ListItemIcon>
                    <DarkModeIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Dark Mode" 
                    secondary="Use dark theme across the application"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      checked={darkModeEnabled}
                      onChange={handleDarkModeChange}
                      color="primary"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                
                <Divider component="li" />
                
                <ListItem button onClick={() => setShowSuccessAlert(true)}>
                  <ListItemIcon>
                    <LanguageIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Language" 
                    secondary={language}
                  />
                  <ArrowForwardIcon fontSize="small" color="action" />
                </ListItem>
                
                <Divider component="li" />
                
                <ListItem button onClick={() => setShowSuccessAlert(true)}>
                  <ListItemIcon>
                    <SecurityIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Security Level" 
                    secondary={securityLevel}
                  />
                  <ArrowForwardIcon fontSize="small" color="action" />
                </ListItem>
                
                <Divider component="li" />
                
                <ListItem button onClick={() => setShowSuccessAlert(true)}>
                  <ListItemIcon>
                    <PaymentIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Default Payment Method" 
                    secondary={paymentMethod}
                  />
                  <ArrowForwardIcon fontSize="small" color="action" />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Security Settings */}
        <Grid item xs={12} md={6}>
          <Card 
            component={motion.div}
            variants={itemVariants}
            sx={{
              height: '100%',
              backdropFilter: 'blur(10px)',
              bgcolor: alpha(theme.palette.background.paper, 0.8),
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Security Settings
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <List>
                <ListItem button onClick={() => setResetPasswordOpen(true)}>
                  <ListItemIcon>
                    <LockResetIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Reset Password" 
                    secondary="Change your account password"
                  />
                  <ArrowForwardIcon fontSize="small" color="action" />
                </ListItem>
                
                <Divider component="li" />
                
                <ListItem>
                  <ListItemIcon>
                    <SecurityIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Two-Factor Authentication" 
                    secondary="Add an extra layer of security"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      checked={false}
                      onChange={() => setShowSuccessAlert(true)}
                      color="primary"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                
                <Divider component="li" />
                
                <ListItem button onClick={() => setDeleteAccountOpen(true)}>
                  <ListItemIcon>
                    <DeleteIcon color="error" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Delete Account" 
                    secondary="Permanently remove your account and data"
                    primaryTypographyProps={{ color: 'error' }}
                  />
                  <ArrowForwardIcon fontSize="small" color="action" />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Recent Activity */}
        <Grid item xs={12}>
          <Paper
            component={motion.div}
            variants={itemVariants}
            sx={{
              p: 3,
              backdropFilter: 'blur(10px)',
              bgcolor: alpha(theme.palette.background.paper, 0.8),
            }}
          >
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <List>
              <ListItem>
                <ListItemText 
                  primary="Login from new device" 
                  secondary="March 25, 2025 at 10:30 AM"
                />
              </ListItem>
              
              <Divider component="li" />
              
              <ListItem>
                <ListItemText 
                  primary="Password changed" 
                  secondary="March 20, 2025 at 2:15 PM"
                />
              </ListItem>
              
              <Divider component="li" />
              
              <ListItem>
                <ListItemText 
                  primary="Profile updated" 
                  secondary="March 15, 2025 at 9:45 AM"
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Reset Password Dialog */}
      <Dialog open={resetPasswordOpen} onClose={() => setResetPasswordOpen(false)}>
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To reset your password, please enter your current password and a new password.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Current Password"
            type="password"
            fullWidth
            variant="outlined"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="New Password"
            type="password"
            fullWidth
            variant="outlined"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Confirm New Password"
            type="password"
            fullWidth
            variant="outlined"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResetPasswordOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleResetPasswordSubmit} 
            variant="contained" 
            color="primary"
            disabled={!currentPassword || !newPassword || !confirmNewPassword}
          >
            Change Password
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Account Dialog */}
      <Dialog open={deleteAccountOpen} onClose={() => setDeleteAccountOpen(false)}>
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently lost.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteAccountOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleDeleteAccount} 
            variant="contained" 
            color="error"
          >
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Settings; 