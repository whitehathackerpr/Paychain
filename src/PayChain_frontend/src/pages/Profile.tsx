import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Divider,
  Paper,
  CircularProgress,
  Alert,
  useTheme,
  alpha,
  styled,
} from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon, CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { usePayChainStore } from '../store/paychainStore';
import { backendAdapter } from '../services/backendAdapter';

// Styled components
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const Profile: React.FC = () => {
  const theme = useTheme();
  const { user, updateUser } = usePayChainStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Form values
  const [formValues, setFormValues] = useState({
    fullName: '',
    email: '',
    profileImage: '',
    principalId: '',
  });
  
  // Load user data when component mounts
  useEffect(() => {
    if (user) {
      setFormValues({
        fullName: user.name || '',
        email: user.email || '',
        profileImage: user.avatar || '',
        principalId: user.principalId || '',
      });
    }
  }, [user]);
  
  const handleEditToggle = () => {
    if (isEditing) {
      // Discard changes if cancelling
      if (user) {
        setFormValues({
          fullName: user.name || '',
          email: user.email || '',
          profileImage: user.avatar || '',
          principalId: user.principalId || '',
        });
      }
    }
    setIsEditing(!isEditing);
    setError(null);
    setSuccess(null);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };
  
  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        setFormValues({
          ...formValues,
          profileImage: reader.result as string,
        });
      };
      
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      setError(null);
      
      await updateUser({
        name: formValues.fullName,
        avatar: formValues.profileImage,
        // We don't update principalId and email for security reasons
      });
      
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
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
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Profile
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}
      
      {!user ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <form onSubmit={handleSubmit}>
          <Grid 
            container 
            spacing={4}
            component={motion.div}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Profile Summary Card */}
            <Grid item xs={12} md={4}>
              <Card 
                component={motion.div}
                variants={itemVariants}
                sx={{
                  height: '100%',
                  backdropFilter: 'blur(10px)',
                  bgcolor: alpha(theme.palette.background.paper, 0.8),
                }}
              >
                <CardContent sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  textAlign: 'center',
                  p: 4 
                }}>
                  <Box sx={{ position: 'relative' }}>
                    <Avatar 
                      src={formValues.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(formValues.fullName || 'User')}&background=3F88F6&color=fff&size=256`} 
                      sx={{ 
                        width: 120, 
                        height: 120, 
                        mb: 2,
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)'
                      }}
                    />
                    {isEditing && (
                      <Button
                        component="label"
                        variant="contained"
                        size="small"
                        startIcon={<CloudUploadIcon />}
                        sx={{
                          position: 'absolute',
                          bottom: 8,
                          right: -20,
                          borderRadius: '20px'
                        }}
                      >
                        Upload
                        <VisuallyHiddenInput 
                          type="file" 
                          accept="image/*" 
                          onChange={handleProfileImageUpload}
                        />
                      </Button>
                    )}
                  </Box>
                  
                  <Typography variant="h5" gutterBottom>
                    {formValues.fullName || 'User'}
                  </Typography>
                  
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ mb: 2, wordBreak: 'break-all' }}
                  >
                    {backendAdapter.utils.formatPrincipalId(formValues.principalId)}
                  </Typography>
                  
                  <Button
                    variant={isEditing ? "outlined" : "contained"}
                    color={isEditing ? "secondary" : "primary"}
                    startIcon={isEditing ? null : <EditIcon />}
                    onClick={handleEditToggle}
                    sx={{ mt: 'auto' }}
                  >
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            
            {/* Profile Details Card */}
            <Grid item xs={12} md={8}>
              <Card 
                component={motion.div}
                variants={itemVariants}
                sx={{
                  height: '100%',
                  backdropFilter: 'blur(10px)',
                  bgcolor: alpha(theme.palette.background.paper, 0.8),
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h6" gutterBottom>
                    Profile Information
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Full Name"
                        name="fullName"
                        value={formValues.fullName}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        InputProps={{
                          readOnly: !isEditing,
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        value={formValues.email}
                        disabled={true}
                        helperText={isEditing ? "Email cannot be changed" : ""}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Principal ID"
                        name="principalId"
                        value={formValues.principalId}
                        disabled={true}
                        helperText={isEditing ? "Principal ID cannot be changed" : ""}
                      />
                    </Grid>
                    
                    {isEditing && (
                      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                          startIcon={<SaveIcon />}
                          disabled={isLoading}
                        >
                          {isLoading ? 'Saving...' : 'Save Changes'}
                        </Button>
                      </Grid>
                    )}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            
            {/* Account Statistics Card */}
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
                  Account Statistics
                </Typography>
                <Divider sx={{ mb: 3 }} />
                
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="primary">
                        {user.balance?.toFixed(2) || '0.00'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Current Balance
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="primary">
                        24
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Transactions
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="primary">
                        3
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        NFT Receipts
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="primary">
                        2
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Scheduled Payments
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </form>
      )}
    </Box>
  );
};

export default Profile; 