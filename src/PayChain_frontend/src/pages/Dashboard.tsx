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
  Badge,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Menu,
  MenuItem,
  Dialog,
  DialogContent,
  ListItemSecondaryAction,
  Tooltip,
  Container,
  Skeleton,
  Paper,
  styled,
  DialogTitle,
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
  Notifications as NotificationsIcon,
  QrCode as QrCodeIcon,
  Receipt as ReceiptIcon,
  Schedule as ScheduleIcon,
  Settings as SettingsIcon,
  ArrowForward as ArrowForwardIcon,
  ContentCopy as CopyIcon,
  FilterList,
  Bolt,
  Speed,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { usePayChainStore, Transaction } from '../store/paychainStore';
import { backendAdapter } from '../services/backendAdapter';
import { format, parseISO } from 'date-fns';
import Chart from '../components/ApexChartWrapper';

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

// Styled components for enhanced UI
const StatsCard = styled(motion.div)(({ theme }) => ({
  height: '100%',
  borderRadius: 16,
  overflow: 'hidden',
  position: 'relative',
  transition: 'all 0.3s ease',
  backdropFilter: 'blur(10px)',
  background: 'rgba(9, 14, 44, 0.4)',
  border: '1px solid rgba(79, 124, 255, 0.1)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '4px',
    background: 'linear-gradient(90deg, #4F7CFF, #03DAC6)',
  },
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
    '& .icon-wrapper': {
      transform: 'scale(1.1) rotate(10deg)',
    },
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  borderRadius: '50%',
  width: 48,
  height: 48,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: alpha(theme.palette.primary.main, 0.15),
  color: theme.palette.primary.main,
  transition: 'all 0.3s ease',
  boxShadow: `0 0 15px ${alpha(theme.palette.primary.main, 0.2)}`,
}));

const ChartCard = styled(Card)(({ theme }) => ({
  height: '100%',
  background: 'rgba(9, 14, 44, 0.4)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(79, 124, 255, 0.1)',
  borderRadius: 16,
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
    transform: 'translateY(-5px)',
  },
}));

const TransactionItem = styled(motion.div)(({ theme }) => ({
  padding: theme.spacing(1.5),
  borderRadius: 12,
  marginBottom: theme.spacing(1),
  transition: 'all 0.3s ease',
  background: alpha(theme.palette.background.paper, 0.4),
  border: '1px solid rgba(79, 124, 255, 0.05)',
  backdropFilter: 'blur(5px)',
  '&:hover': {
    background: alpha(theme.palette.background.paper, 0.6),
    transform: 'translateX(5px)',
  },
}));

const GlowingValue = styled(Typography)(({ theme }) => ({
  background: 'linear-gradient(90deg, #7EBCFF, #4F7CFF)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 700,
  textShadow: '0 0 10px rgba(79, 124, 255, 0.5)',
}));

const PositiveValue = styled(Typography)(({ theme }) => ({
  color: theme.palette.success.main,
  fontWeight: 600,
  display: 'flex',
  alignItems: 'center',
  '& svg': {
    marginRight: theme.spacing(0.5),
  },
}));

const NegativeValue = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.main,
  fontWeight: 600,
  display: 'flex',
  alignItems: 'center',
  '& svg': {
    marginRight: theme.spacing(0.5),
  },
}));

const Dashboard = () => {
  const { user, transactions, fetchTransactions, fetchUserProfile } = usePayChainStore();
  const [isLoading, setIsLoading] = useState(true);
  const [accountData, setAccountData] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [receiveQrCode, setReceiveQrCode] = useState('');
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [qrCodeData, setQrCodeData] = useState('');
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);
  const [localTransactions, setLocalTransactions] = useState<any[]>([]);
  
  const navigate = useNavigate();
  const theme = useTheme();

  const [balanceHistory, setBalanceHistory] = useState<number[]>([]);
  const [qrCodeValue, setQrCodeValue] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  
  // Animation variants
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
        duration: 0.4
      }
    }
  };

  // Chart configuration
  const chartOptions = {
    chart: {
      type: 'area',
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      foreColor: 'rgba(255, 255, 255, 0.7)',
      fontFamily: '"Inter", sans-serif',
    },
    tooltip: {
      enabled: true,
      theme: 'dark',
      x: {
        format: 'dd MMM yyyy',
      },
    },
    colors: ['#4F7CFF', '#03DAC6'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.2,
        stops: [0, 90, 100],
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    xaxis: {
      type: 'datetime',
      categories: [
        new Date(2023, 2, 1).getTime(),
        new Date(2023, 2, 8).getTime(),
        new Date(2023, 2, 15).getTime(),
        new Date(2023, 2, 22).getTime(),
        new Date(2023, 2, 29).getTime(),
        new Date(2023, 3, 5).getTime(),
      ],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: 'rgba(255, 255, 255, 0.7)',
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: 'rgba(255, 255, 255, 0.7)',
        },
        formatter: (value: number) => `${value.toFixed(2)} ICP`,
      },
    },
    grid: {
      borderColor: 'rgba(255, 255, 255, 0.1)',
      strokeDashArray: 5,
      yaxis: {
        lines: {
          show: true,
        },
      },
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
    legend: {
      labels: {
        colors: 'rgba(255, 255, 255, 0.9)',
      },
    },
  };

  const chartSeries = [
    {
      name: "Balance",
      data: [4.2, 5.1, 4.8, 6.2, 5.8, 6.5],
    },
    {
      name: "Transaction Volume",
      data: [0.5, 1.2, 0.8, 1.5, 0.9, 1.1],
    },
  ];

  const walletStats = [
    {
      title: "Total Balance",
      value: accountData?.balance || user?.balance?.toFixed(2) || "0.00",
      icon: <WalletIcon />,
      change: "+5.4%",
      positive: true,
      gradientStart: "#4F7CFF",
      gradientEnd: "#03DAC6",
    },
    {
      title: "Pending Payments",
      value: "2.75",
      icon: <ScheduleIcon />,
      change: "-2.1%",
      positive: false,
      gradientStart: "#FF5252",
      gradientEnd: "#FFAB40",
    },
    {
      title: "NFT Receipts",
      value: "12",
      icon: <ReceiptIcon />,
      change: "+8.3%",
      positive: true,
      gradientStart: "#4F7CFF",
      gradientEnd: "#9C27B0",
    },
    {
      title: "Network Status",
      value: "99.98%",
      icon: <Speed />,
      change: "+0.2%",
      positive: true,
      gradientStart: "#00E676",
      gradientEnd: "#03DAC6",
    },
  ];

  const handleCopyPrincipalId = () => {
    if (user?.principalId) {
      navigator.clipboard.writeText(user.principalId);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handleShowReceiveQR = () => {
    setQrDialogOpen(true);
  };

  const handleSendPayment = () => {
    navigate('/payment');
  };

  // Mock data - would be replaced with actual API calls
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      // Generate sample transaction data
      const mockTransactions = [
        {
          id: 'tx1',
          type: 'received',
          amount: 1.25,
          fromAddress: 'pr1nc1p4l-1d-4l1c3',
          toAddress: user?.principalId,
          timestamp: new Date(2023, 3, 1).toISOString(),
          status: 'completed',
          description: 'Payment for services',
        },
        {
          id: 'tx2',
          type: 'sent',
          amount: 0.5,
          fromAddress: user?.principalId,
          toAddress: 'pr1nc1p4l-1d-b0b',
          timestamp: new Date(2023, 3, 2).toISOString(),
          status: 'completed',
          description: 'Dinner',
        },
        {
          id: 'tx3',
          type: 'received',
          amount: 2.0,
          fromAddress: 'pr1nc1p4l-1d-ch4rl13',
          toAddress: user?.principalId,
          timestamp: new Date(2023, 3, 4).toISOString(),
          status: 'completed',
          description: 'Refund',
        },
        {
          id: 'tx4',
          type: 'sent',
          amount: 0.75,
          fromAddress: user?.principalId,
          toAddress: 'pr1nc1p4l-1d-d4v1d',
          timestamp: new Date(2023, 3, 5).toISOString(),
          status: 'completed',
          description: 'Coffee meetup',
        },
        {
          id: 'tx5',
          type: 'received',
          amount: 0.3,
          fromAddress: 'pr1nc1p4l-1d-3v3',
          toAddress: user?.principalId,
          timestamp: new Date(2023, 3, 6).toISOString(),
          status: 'pending',
          description: 'Split bill',
        },
      ];

      setLocalTransactions(mockTransactions);
      setAccountData({ balance: 10.5 });
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Box sx={{ 
      p: { xs: 0, sm: 0 }, 
      height: '100%',
      overflow: 'hidden'
    }}>
      <Container maxWidth={false} disableGutters sx={{ height: '100%', overflow: 'auto', pb: 0 }}>
        <Grid container spacing={0} sx={{ minHeight: '100%' }}>
          {/* Stats Section */}
          <Grid item xs={12}>
            <Box sx={{ p: 2, pt: 2 }}>
              <Grid container spacing={2}>
                {walletStats.map((stat, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <StatsCard
                        initial="hidden"
                        animate="visible"
                        whileHover={{ scale: 1.02 }}
                      >
                        <Box sx={{ p: 2 }}>
                          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                            <Typography variant="subtitle2" color="text.secondary">
                              {stat.title}
                            </Typography>
                            <IconWrapper className="icon-wrapper" 
                              sx={{ 
                                background: `linear-gradient(135deg, ${stat.gradientStart} 0%, ${stat.gradientEnd} 100%)`,
                                color: 'white'
                              }}
                            >
                              {stat.icon}
                            </IconWrapper>
                          </Box>
                          
                          {isLoading ? (
                            <Skeleton variant="text" width="80%" height={40} />
                          ) : (
                            <GlowingValue variant="h4">
                              {typeof stat.value === 'string' ? stat.value : stat.value?.toFixed(2)}
                            </GlowingValue>
                          )}
                          
                          <Box display="flex" alignItems="center" mt={1}>
                            {stat.positive ? (
                              <PositiveValue variant="body2">
                                <TrendingUpIcon fontSize="small" />
                                {stat.change}
                              </PositiveValue>
                            ) : (
                              <NegativeValue variant="body2">
                                <TrendingDownIcon fontSize="small" />
                                {stat.change}
                              </NegativeValue>
                            )}
                            <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                              vs last month
                            </Typography>
                          </Box>
                        </Box>
                      </StatsCard>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>

          {/* Charts and Transactions Section */}
          <Grid item xs={12}>
            <Box sx={{ p: 2, pt: 0 }}>
              <Grid container spacing={2}>
                {/* Chart Section */}
                <Grid item xs={12} md={8}>
                  <ChartCard>
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6">Balance History</Typography>
                        <Box>
                          <IconButton size="small" color="primary">
                            <RefreshIcon />
                          </IconButton>
                          <IconButton size="small" color="primary">
                            <FilterList />
                          </IconButton>
                        </Box>
                      </Box>
                      
                      {isLoading ? (
                        <Skeleton variant="rectangular" width="100%" height={350} />
                      ) : (
                        <Chart 
                          options={chartOptions}
                          series={chartSeries}
                          type="area"
                          height={350}
                        />
                      )}
                    </CardContent>
                  </ChartCard>
                </Grid>
                
                {/* Transactions Section */}
                <Grid item xs={12} md={4}>
                  <ChartCard>
                    <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6">Recent Transactions</Typography>
                        <IconButton size="small" color="primary">
                          <TimelineIcon />
                        </IconButton>
                      </Box>
                      
                      <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                        {isLoading ? (
                          Array.from(new Array(4)).map((_, index) => (
                            <Box key={index} mb={2}>
                              <Skeleton variant="rectangular" width="100%" height={70} sx={{ borderRadius: 2 }} />
                            </Box>
                          ))
                        ) : (
                          <motion.div variants={containerVariants} initial="hidden" animate="visible">
                            {localTransactions.slice(0, 4).map((tx, index) => (
                              <motion.div key={tx.id} variants={itemVariants}>
                                <TransactionItem>
                                  <Grid container alignItems="center" spacing={1}>
                                    <Grid item>
                                      <Avatar 
                                        sx={{ 
                                          bgcolor: tx.type === 'in' ? 'success.main' : 'error.main',
                                          width: 40,
                                          height: 40
                                        }}
                                      >
                                        {tx.type === 'in' ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />}
                                      </Avatar>
                                    </Grid>
                                    <Grid item xs>
                                      <Typography variant="subtitle2" noWrap>
                                        {tx.title}
                                      </Typography>
                                      <Typography variant="caption" color="text.secondary" noWrap>
                                        {tx.date} • {tx.status}
                                      </Typography>
                                    </Grid>
                                    <Grid item>
                                      <Typography 
                                        variant="subtitle2" 
                                        color={tx.type === 'in' ? 'success.main' : 'error.main'}
                                        fontWeight="bold"
                                      >
                                        {tx.type === 'in' ? '+' : '-'}{tx.amount}
                                      </Typography>
                                    </Grid>
                                  </Grid>
                                </TransactionItem>
                              </motion.div>
                            ))}
                          </motion.div>
                        )}
                      </Box>
                      
                      <Box mt={2} sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Button 
                          variant="outlined" 
                          color="primary" 
                          endIcon={<ArrowForwardIcon />}
                          onClick={() => navigate('/transactions')}
                          fullWidth
                          sx={{ 
                            borderRadius: 4,
                            background: 'rgba(79, 124, 255, 0.05)',
                            boxShadow: '0 4px 12px rgba(79, 124, 255, 0.1)',
                            '&:hover': {
                              background: 'rgba(79, 124, 255, 0.1)',
                              boxShadow: '0 6px 16px rgba(79, 124, 255, 0.2)',
                            }
                          }}
                        >
                          View All Transactions
                        </Button>
                      </Box>
                    </CardContent>
                  </ChartCard>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          {/* Quick Actions Section */}
          <Grid item xs={12}>
            <Box sx={{ p: 2, pt: 0 }}>
              <Grid container spacing={2}>
                {/* Payment Actions Section */}
                <Grid item xs={12} md={4}>
                  <ChartCard>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Quick Actions
                      </Typography>
                      
                      <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Button 
                          variant="contained" 
                          color="primary" 
                          startIcon={<SendIcon />}
                          fullWidth
                          size="large"
                          onClick={handleSendPayment}
                          sx={{ 
                            borderRadius: 8,
                            py: 1.5,
                            background: 'linear-gradient(90deg, #4F7CFF, #03DAC6)',
                            boxShadow: '0 4px 15px rgba(79, 124, 255, 0.3)',
                            '&:hover': {
                              boxShadow: '0 6px 20px rgba(79, 124, 255, 0.4)',
                            }
                          }}
                        >
                          Send Payment
                        </Button>
                        
                        <Button 
                          variant="outlined" 
                          color="primary" 
                          startIcon={<QrCodeIcon />}
                          fullWidth
                          size="large"
                          onClick={handleShowReceiveQR}
                          sx={{ 
                            borderRadius: 8,
                            py: 1.5,
                            borderColor: 'rgba(79, 124, 255, 0.5)',
                            '&:hover': {
                              borderColor: 'primary.main',
                              background: 'rgba(79, 124, 255, 0.05)',
                            }
                          }}
                        >
                          Receive Payment
                        </Button>
                        
                        <Button 
                          variant="outlined" 
                          color="secondary" 
                          startIcon={<Bolt />}
                          fullWidth
                          size="large"
                          sx={{ 
                            borderRadius: 8,
                            py: 1.5,
                            borderColor: 'rgba(3, 218, 198, 0.5)',
                            color: 'secondary.main',
                            '&:hover': {
                              borderColor: 'secondary.main',
                              background: 'rgba(3, 218, 198, 0.05)',
                            }
                          }}
                        >
                          Quick Transfer
                        </Button>
                      </Box>
                    </CardContent>
                  </ChartCard>
                </Grid>
                
                {/* Principal ID Card Section */}
                <Grid item xs={12} md={8}>
                  <ChartCard>
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                        <Typography variant="h6">Your Principal ID</Typography>
                        <Chip 
                          label="Verified"
                          color="success"
                          size="small"
                          sx={{ 
                            fontWeight: 'bold',
                            background: 'rgba(46, 204, 113, 0.2)',
                            border: '1px solid rgba(46, 204, 113, 0.3)',
                          }}
                        />
                      </Box>
                      
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 3,
                          background: 'rgba(255, 255, 255, 0.05)',
                          backdropFilter: 'blur(5px)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                      >
                        <Grid container spacing={0} alignItems="center">
                          <Grid item xs={12} md={8}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Use this ID to receive payments
                            </Typography>
                            
                            <Typography
                              variant="subtitle1"
                              sx={{
                                fontFamily: 'monospace',
                                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                                p: 1.5,
                                borderRadius: 2,
                                wordBreak: 'break-all',
                                mb: 1
                              }}
                            >
                              {isLoading ? (
                                <Skeleton width="100%" />
                              ) : (
                                user?.id || '2vxsx-fae-xxxxxxxx-xxxxxxxx-xxxxxxxx-xxxxxxxx-xxxxxxxx-x'
                              )}
                            </Typography>
                            
                            <Box display="flex" gap={1}>
                              <Button
                                size="small"
                                variant="outlined"
                                color="primary"
                                onClick={handleCopyPrincipalId}
                                startIcon={<CopyIcon />}
                                sx={{ borderRadius: 4 }}
                              >
                                Copy
                              </Button>
                              <Button
                                size="small"
                                variant="outlined"
                                color="primary"
                                startIcon={<QrCodeIcon />}
                                onClick={handleShowReceiveQR}
                                sx={{ borderRadius: 4 }}
                              >
                                QR Code
                              </Button>
                            </Box>
                          </Grid>
                          
                          <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'center', mt: { xs: 3, md: 0 } }}>
                            <Box
                              sx={{
                                width: 120,
                                height: 120,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#fff',
                                borderRadius: 2,
                                p: 1,
                                border: '1px solid rgba(0, 0, 0, 0.1)',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                              }}
                            >
                              {isLoading ? (
                                <Skeleton variant="rectangular" width={100} height={100} />
                              ) : (
                                <QRCode
                                  value={user?.id ? String(user.id) : ''}
                                  size={100}
                                  level="H"
                                  includeMargin={false}
                                />
                              )}
                            </Box>
                          </Grid>
                        </Grid>
                      </Box>
                    </CardContent>
                  </ChartCard>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Container>
      
      {/* QR Code Dialog */}
      <Dialog
        open={qrDialogOpen}
        onClose={() => setQrDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, rgba(9, 14, 44, 0.8) 0%, rgba(26, 16, 53, 0.9) 100%)',
            backdropFilter: 'blur(10px)',
            borderRadius: 4,
            overflow: 'hidden',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
          }
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', pb: 0 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Receive Payment</Typography>
          <Typography variant="caption" color="text.secondary">Scan QR code or share your Principal ID</Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                backgroundColor: '#ffffff',
                p: 2,
                borderRadius: 2,
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                mb: 2,
              }}
            >
              <QRCode
                value={user?.id ? String(user.id) : ''}
                size={200}
                level="H"
                includeMargin
              />
            </Box>
            
            <Typography variant="subtitle2" sx={{ fontFamily: 'monospace', textAlign: 'center' }}>
              {user?.id ? backendAdapter.utils.formatPrincipalId(String(user.id)) : ''}
            </Typography>
            
            <Box display="flex" gap={2} mt={1} width="100%">
              <Button
                variant="outlined"
                color="primary"
                startIcon={<CopyIcon />}
                onClick={handleCopyPrincipalId}
                fullWidth
                sx={{ borderRadius: 4 }}
              >
                Copy ID
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Dashboard; 