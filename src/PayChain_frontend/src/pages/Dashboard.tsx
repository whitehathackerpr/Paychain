import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Avatar,
  Button,
  Chip,
  IconButton,
  LinearProgress,
  alpha,
  useTheme,
  SxProps,
  Theme,
  CircularProgress,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Wallet as WalletIcon,
  Send as SendIcon,
  Sync as SyncIcon,
  Timeline as TimelineIcon,
  AccountBalance as AccountBalanceIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { usePayChainStore, Transaction } from '../store/paychainStore';
import { format } from 'date-fns';

// Define props interfaces with explicit types
interface GlassCardProps {
  children?: any; // Simplify to any for now to resolve the conflict
  sx?: SxProps<Theme>;
}

// Custom components
const GlassCard = (props: GlassCardProps) => {
  const { children, sx } = props;
  const theme = useTheme();
  return (
    <Card
      sx={{
        background: alpha(theme.palette.background.paper, 0.7),
        backdropFilter: 'blur(10px)',
        borderRadius: 4,
        boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
        border: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
        padding: 1,
        overflow: 'hidden',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 12px 40px rgba(31, 38, 135, 0.25)',
        },
        ...sx,
      }}
    >
      <React.Fragment>
        {children}
      </React.Fragment>
    </Card>
  );
};

interface GradientCardProps {
  gradientColors: string[];
  children?: any; // Simplify to any for now to resolve the conflict
  sx?: SxProps<Theme>;
}

const GradientCard = (props: GradientCardProps) => {
  const { gradientColors, children, sx } = props;
  const theme = useTheme();
  return (
    <Card
      sx={{
        position: 'relative',
        height: '100%',
        backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.8)} 0%, ${alpha(theme.palette.secondary.main, 0.8)} 100%)`,
        color: 'white',
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: `0 10px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(5px)',
          zIndex: 0,
        }
      }}
    >
      <CardContent sx={{ position: 'relative', zIndex: 1, height: '100%' }}>
        {children}
      </CardContent>
    </Card>
  );
};

export default function Dashboard() {
  const { user, transactions, fetchTransactions, fetchUserProfile } = usePayChainStore();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await fetchUserProfile();
        await fetchTransactions();
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [fetchTransactions, fetchUserProfile]);

  const handleSendPayment = () => {
    navigate('/payment');
  };

  const handleViewTransactions = () => {
    navigate('/transactions');
  };

  const handleRefreshData = async () => {
    setIsLoading(true);
    try {
      await fetchUserProfile();
      await fetchTransactions();
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate total received and spent
  const totalReceived = transactions
    .filter(tx => tx.status === 'completed' && tx.toAddress === (user?.principalId || ''))
    .reduce((acc, tx) => acc + tx.amount, 0);
  
  const totalSpent = transactions
    .filter(tx => tx.status === 'completed' && tx.fromAddress === (user?.principalId || ''))
    .reduce((acc, tx) => acc + tx.amount, 0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  return (
    <Box sx={{ px: 2, py: 4, maxWidth: 1200, mx: 'auto' }}>
      {isLoading && <LinearProgress sx={{ mb: 2, borderRadius: 1 }} />}
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography 
          variant="h4" 
          component={motion.h1}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          sx={{ 
            fontWeight: 700,
            background: 'linear-gradient(90deg, #1976d2, #9c27b0)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Your DeFi Dashboard
        </Typography>
        <IconButton 
          onClick={handleRefreshData} 
          disabled={isLoading}
          component={motion.button}
          whileHover={{ rotate: 180, scale: 1.1 }}
          transition={{ duration: 0.3 }}
          sx={{ 
            background: alpha(theme.palette.primary.main, 0.1),
            '&:hover': { background: alpha(theme.palette.primary.main, 0.2) }
          }}
        >
          <RefreshIcon />
        </IconButton>
      </Box>
      
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Balance Card */}
            <Grid item xs={12} md={6}>
              <motion.div variants={itemVariants}>
                <GradientCard 
                  gradientColors={['#1976d2', '#4527a0']}
                  sx={{ height: '100%' }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', mb: 2, alignItems: 'center' }}>
                      <Avatar 
                        sx={{ 
                          bgcolor: 'rgba(255, 255, 255, 0.2)', 
                          width: 48, 
                          height: 48,
                          mr: 2
                        }}
                      >
                        <WalletIcon />
                      </Avatar>
                      <Typography variant="h6" sx={{ fontWeight: 500 }}>
                        Your Balance
                      </Typography>
                    </Box>
                    
                    <Typography variant="h3" sx={{ mb: 1, fontWeight: 700 }}>
                      {user?.balance.toFixed(2)} ICP
                    </Typography>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                      <Button 
                        variant="contained" 
                        startIcon={<SendIcon />}
                        onClick={handleSendPayment}
                        sx={{ 
                          borderRadius: 2,
                          background: 'rgba(255, 255, 255, 0.2)',
                          backdropFilter: 'blur(5px)',
                          '&:hover': {
                            background: 'rgba(255, 255, 255, 0.3)',
                          }
                        }}
                      >
                        Send ICP
                      </Button>
                      <Button 
                        variant="outlined" 
                        color="inherit"
                        onClick={handleViewTransactions}
                        sx={{ 
                          borderRadius: 2,
                          borderColor: 'rgba(255, 255, 255, 0.5)',
                          '&:hover': {
                            borderColor: 'rgba(255, 255, 255, 0.8)',
                            background: 'rgba(255, 255, 255, 0.1)',
                          }
                        }}
                      >
                        View History
                      </Button>
                    </Box>
                  </CardContent>
                </GradientCard>
              </motion.div>
            </Grid>
            
            {/* Activity Card */}
            <Grid item xs={12} md={6}>
              <motion.div variants={itemVariants}>
                <GlassCard sx={{ height: '100%' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', mb: 3, alignItems: 'center' }}>
                      <Avatar 
                        sx={{ 
                          bgcolor: alpha(theme.palette.primary.main, 0.1), 
                          color: theme.palette.primary.main,
                          width: 48, 
                          height: 48,
                          mr: 2
                        }}
                      >
                        <TimelineIcon />
                      </Avatar>
                      <Typography variant="h6" sx={{ fontWeight: 500 }}>
                        Activity Overview
                      </Typography>
                    </Box>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary">
                            Total Received
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <ArrowDownwardIcon sx={{ color: theme.palette.success.main, mr: 1 }} />
                            <Typography variant="h6" color="success.main" sx={{ fontWeight: 600 }}>
                              +{totalReceived.toFixed(2)} ICP
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={6}>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary">
                            Total Spent
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <ArrowUpwardIcon sx={{ color: theme.palette.error.main, mr: 1 }} />
                            <Typography variant="h6" color="error.main" sx={{ fontWeight: 600 }}>
                              -{totalSpent.toFixed(2)} ICP
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                    
                    <Box sx={{ mt: 3, mb: 1 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        System Status
                      </Typography>
                      <Box sx={{ 
                        display: 'flex', 
                        gap: 1, 
                        flexWrap: 'wrap'
                      }}>
                        <Chip 
                          icon={<SyncIcon sx={{ fontSize: 16 }} />} 
                          label="Network: Active" 
                          size="small" 
                          color="success"
                          sx={{ borderRadius: 1 }}
                        />
                        <Chip 
                          icon={<SyncIcon sx={{ fontSize: 16 }} />} 
                          label="Sync: Complete" 
                          size="small" 
                          color="success"
                          sx={{ borderRadius: 1 }}
                        />
                      </Box>
                    </Box>
                  </CardContent>
                </GlassCard>
              </motion.div>
            </Grid>
          </Grid>
          
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Recent Transactions
          </Typography>
          
          <Grid container spacing={2}>
            {transactions.length > 0 ? (
              transactions.slice(0, 4).map((transaction, index) => (
                <Grid item xs={12} md={6} key={transaction.id}>
                  <motion.div variants={itemVariants}>
                    <GlassCard>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar
                              sx={{
                                bgcolor: transaction.status === 'completed' 
                                  ? alpha(theme.palette.success.main, 0.1)
                                  : transaction.status === 'failed'
                                  ? alpha(theme.palette.error.main, 0.1)
                                  : alpha(theme.palette.warning.main, 0.1),
                                color: transaction.status === 'completed'
                                  ? theme.palette.success.main
                                  : transaction.status === 'failed'
                                  ? theme.palette.error.main
                                  : theme.palette.warning.main,
                                mr: 2
                              }}
                            >
                              {transaction.fromAddress === user?.principalId ? <SendIcon /> : <TrendingUpIcon />}
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle2">
                                {transaction.fromAddress === user?.principalId
                                  ? `Sent to ${transaction.toAddress.substring(0, 8)}...`
                                  : `Received from ${transaction.fromAddress.substring(0, 8)}...`}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {format(new Date(transaction.timestamp), 'MMM dd, yyyy')}
                              </Typography>
                            </Box>
                          </Box>
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                              {transaction.fromAddress === user?.principalId ? '-' : '+'}{transaction.amount.toFixed(2)} ICP
                            </Typography>
                            <Chip
                              label={transaction.status}
                              size="small"
                              color={
                                transaction.status === 'completed'
                                  ? 'success'
                                  : transaction.status === 'failed'
                                  ? 'error'
                                  : 'warning'
                              }
                              sx={{ height: 24, borderRadius: 1 }}
                            />
                          </Box>
                        </Box>
                      </CardContent>
                    </GlassCard>
                  </motion.div>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <GlassCard>
                  <CardContent sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="body1" color="text.secondary">
                      No recent transactions found.
                    </Typography>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      sx={{ mt: 2, borderRadius: 2 }}
                      onClick={handleSendPayment}
                    >
                      Make Your First Transaction
                    </Button>
                  </CardContent>
                </GlassCard>
              </Grid>
            )}
          </Grid>
        </motion.div>
      )}
    </Box>
  );
} 