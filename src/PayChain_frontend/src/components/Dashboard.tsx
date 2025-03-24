import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';

// Types
interface SystemHealth {
  lastCheck: number;
  errorRate: number;
  averageResponseTime: number;
  activeConnections: number;
  systemLoad: number;
  memoryUsage: number;
}

interface SystemStats {
  totalTransactions: number;
  totalUsers: number;
  totalNFTReceipts: number;
  totalVolume: number;
  lastUpdate: number;
  activeUsers: number;
  blockedUsers: number;
  pendingKyc: number;
  rejectedKyc: number;
  totalRefunds: number;
  totalFraudulentTransactions: number;
  systemHealth: SystemHealth;
  errorStats: {
    totalErrors: number;
    errorByCategory: [string, number][];
    recentErrors: any[];
    errorRate: number;
  };
  velocityStats: {
    averageTransactionVelocity: number;
    peakTransactionVelocity: number;
    velocityByHour: [number, number][];
    velocityByCategory: [string, number][];
  };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // TODO: Replace with actual API call
        const response = await fetch('/api/system-stats');
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError('Failed to fetch system stats');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!stats) {
    return null;
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatBytes = (bytes: number) => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    return `${size.toFixed(2)} ${units[unitIndex]}`;
  };

  return (
    <Box p={3}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" gutterBottom>
          System Dashboard
        </Typography>
      </motion.div>

      <Grid container spacing={3}>
        {/* System Health Card */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  System Health
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Error Rate"
                      secondary={
                        <Box>
                          <LinearProgress
                            variant="determinate"
                            value={stats.systemHealth.errorRate * 100}
                            color={stats.systemHealth.errorRate > 0.1 ? 'error' : 'success'}
                            sx={{ height: 8, borderRadius: 4 }}
                          />
                          <Typography variant="caption" color="textSecondary">
                            {(stats.systemHealth.errorRate * 100).toFixed(2)}%
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary="Response Time"
                      secondary={`${(stats.systemHealth.averageResponseTime / 1_000_000).toFixed(2)}ms`}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary="Active Connections"
                      secondary={stats.systemHealth.activeConnections}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary="System Load"
                      secondary={
                        <Box>
                          <LinearProgress
                            variant="determinate"
                            value={stats.systemHealth.systemLoad * 100}
                            color={stats.systemHealth.systemLoad > 0.8 ? 'error' : 'success'}
                            sx={{ height: 8, borderRadius: 4 }}
                          />
                          <Typography variant="caption" color="textSecondary">
                            {(stats.systemHealth.systemLoad * 100).toFixed(2)}%
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary="Memory Usage"
                      secondary={formatBytes(stats.systemHealth.memoryUsage * 1024 * 1024)}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Transaction Stats Card */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Transaction Statistics
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Total Transactions"
                      secondary={stats.totalTransactions.toLocaleString()}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary="Total Volume"
                      secondary={`${(stats.totalVolume / 1_000_000).toFixed(2)} ICP`}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary="Active Users"
                      secondary={stats.activeUsers.toLocaleString()}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary="Blocked Users"
                      secondary={stats.blockedUsers.toLocaleString()}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary="Pending KYC"
                      secondary={stats.pendingKyc.toLocaleString()}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Transaction Velocity Chart */}
        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Transaction Velocity by Hour
              </Typography>
              <Box height={300}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats.velocityStats.velocityByHour}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="0" label={{ value: 'Hour', position: 'bottom' }} />
                    <YAxis label={{ value: 'Transactions', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="1"
                      stroke={theme.palette.primary.main}
                      name="Transactions"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </motion.div>
        </Grid>

        {/* Error Distribution Chart */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Error Distribution by Category
              </Typography>
              <Box height={300}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.errorStats.errorByCategory}
                      dataKey="1"
                      nameKey="0"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {stats.errorStats.errorByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </motion.div>
        </Grid>

        {/* Recent Errors */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Recent Errors
              </Typography>
              <List>
                {stats.errorStats.recentErrors.slice(0, 5).map((error, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemText
                        primary={`Error ${error.code}`}
                        secondary={
                          <>
                            <Typography variant="body2" color="textSecondary">
                              {error.category}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {formatTime(error.timestamp)}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    {index < 4 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 