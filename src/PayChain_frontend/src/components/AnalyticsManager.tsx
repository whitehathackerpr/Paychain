import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  CircularProgress,
  Alert,
  LinearProgress,
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
  BarChart,
  Bar,
} from 'recharts';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// Types
interface AnalyticsData {
  transactionVolume: {
    daily: [number, number][];
    weekly: [number, number][];
    monthly: [number, number][];
  };
  userActivity: {
    activeUsers: number;
    newUsers: number;
    retentionRate: number;
    averageSessionDuration: number;
  };
  riskMetrics: {
    fraudRate: number;
    suspiciousTransactions: number;
    averageRiskScore: number;
    riskDistribution: [string, number][];
  };
  categoryDistribution: [string, number][];
  errorStats: {
    totalErrors: number;
    errorByCategory: [string, number][];
    errorRate: number;
  };
  predictiveAnalytics: {
    forecastedVolume: number;
    confidence: number;
    contributingFactors: string[];
  };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const AnalyticsManager: React.FC = () => {
  const theme = useTheme();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange, startDate, endDate]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      const response = await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timeRange,
          startDate,
          endDate,
        }),
      });
      const analyticsData = await response.json();
      setData(analyticsData);
    } catch (err) {
      setError('Failed to fetch analytics data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount: number) => {
    return `${(amount / 1_000_000).toFixed(2)} ICP`;
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(2)}%`;
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <Box p={3}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4">Analytics Dashboard</Typography>
          <Box display="flex" gap={2}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Time Range</InputLabel>
              <Select
                value={timeRange}
                label="Time Range"
                onChange={(e) => setTimeRange(e.target.value as typeof timeRange)}
              >
                <MenuItem value="daily">Daily</MenuItem>
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
              </Select>
            </FormControl>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={setStartDate}
                slotProps={{ textField: { size: 'small' } }}
              />
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={setEndDate}
                slotProps={{ textField: { size: 'small' } }}
              />
            </LocalizationProvider>
            <Button
              variant="contained"
              onClick={fetchAnalyticsData}
              disabled={loading}
            >
              Refresh
            </Button>
          </Box>
        </Box>
      </motion.div>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {data && (
        <Grid container spacing={3}>
          {/* User Activity Stats */}
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Active Users
                </Typography>
                <Typography variant="h4">{data.userActivity.activeUsers}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  New Users
                </Typography>
                <Typography variant="h4">{data.userActivity.newUsers}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Retention Rate
                </Typography>
                <Typography variant="h4">{formatPercentage(data.userActivity.retentionRate)}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Avg. Session Duration
                </Typography>
                <Typography variant="h4">{formatTime(data.userActivity.averageSessionDuration)}</Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Transaction Volume Chart */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Transaction Volume
              </Typography>
              <Box height={300}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.transactionVolume[timeRange]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="0" label={{ value: 'Date', position: 'bottom' }} />
                    <YAxis label={{ value: 'Volume (ICP)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="1"
                      stroke={theme.palette.primary.main}
                      name="Volume"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>

          {/* Risk Metrics */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Risk Distribution
              </Typography>
              <Box height={300}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.riskMetrics.riskDistribution}
                      dataKey="1"
                      nameKey="0"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {data.riskMetrics.riskDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>

          {/* Category Distribution */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Category Distribution
              </Typography>
              <Box height={300}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.categoryDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="0" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="1" fill={theme.palette.primary.main} name="Transactions" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>

          {/* Predictive Analytics */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Predictive Analytics
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Forecasted Volume
                      </Typography>
                      <Typography variant="h4">{formatAmount(data.predictiveAnalytics.forecastedVolume)}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Confidence Score
                      </Typography>
                      <Box display="flex" alignItems="center">
                        <Box flexGrow={1} mr={1}>
                          <LinearProgress
                            variant="determinate"
                            value={data.predictiveAnalytics.confidence * 100}
                            color={data.predictiveAnalytics.confidence > 0.8 ? 'success' : 'warning'}
                            sx={{ height: 8, borderRadius: 4 }}
                          />
                        </Box>
                        <Typography variant="body2" color="textSecondary">
                          {formatPercentage(data.predictiveAnalytics.confidence)}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Contributing Factors
                      </Typography>
                      <Box component="ul" sx={{ pl: 2 }}>
                        {data.predictiveAnalytics.contributingFactors.map((factor, index) => (
                          <Typography component="li" key={index} variant="body2">
                            {factor}
                          </Typography>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      )}

      {loading && (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};

export default AnalyticsManager; 