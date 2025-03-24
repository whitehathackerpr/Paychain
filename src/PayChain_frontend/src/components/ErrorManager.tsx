import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Tooltip,
  Chip,
  CircularProgress,
  Alert,
  LinearProgress,
  Grid,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from '@mui/material';
import {
  Edit as EditIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';

// Types
interface ErrorDetails {
  id: string;
  code: number;
  category: string;
  message: string;
  timestamp: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  resolution?: {
    type: 'automatic' | 'manual' | 'hybrid' | 'escalated';
    attempts: number;
    lastAttempt: number;
    result: 'success' | 'failure' | 'pending';
    notes: string;
  };
  affectedTransactions: string[];
  stackTrace?: string;
  metadata: Record<string, any>;
}

interface ErrorStats {
  totalErrors: number;
  openErrors: number;
  resolvedErrors: number;
  errorByCategory: [string, number][];
  errorBySeverity: [string, number][];
  averageResolutionTime: number;
  resolutionRate: number;
}

const ErrorManager: React.FC = () => {
  const theme = useTheme();
  const [errors, setErrors] = useState<ErrorDetails[]>([]);
  const [stats, setStats] = useState<ErrorStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedError, setSelectedError] = useState<ErrorDetails | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    fetchErrorData();
  }, []);

  const fetchErrorData = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API calls
      const [errorsResponse, statsResponse] = await Promise.all([
        fetch('/api/errors'),
        fetch('/api/errors/stats'),
      ]);
      const [errorsData, statsData] = await Promise.all([
        errorsResponse.json(),
        statsResponse.json(),
      ]);
      setErrors(errorsData);
      setStats(statsData);
    } catch (err) {
      setError('Failed to fetch error data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateError = async (updatedError: ErrorDetails) => {
    try {
      // TODO: Replace with actual API call
      await fetch(`/api/errors/${updatedError.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedError),
      });
      setOpenDialog(false);
      fetchErrorData();
    } catch (err) {
      setError('Failed to update error');
      console.error(err);
    }
  };

  const handleResolveError = async (errorId: string) => {
    try {
      // TODO: Replace with actual API call
      await fetch(`/api/errors/${errorId}/resolve`, {
        method: 'POST',
      });
      fetchErrorData();
    } catch (err) {
      setError('Failed to resolve error');
      console.error(err);
    }
  };

  const getSeverityColor = (severity: ErrorDetails['severity']) => {
    switch (severity) {
      case 'critical':
        return 'error';
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status: ErrorDetails['status']) => {
    switch (status) {
      case 'resolved':
        return 'success';
      case 'in_progress':
        return 'warning';
      case 'closed':
        return 'default';
      case 'open':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatDuration = (minutes: number) => {
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
          <Typography variant="h4">Error Manager</Typography>
          <Tooltip title="Refresh">
            <IconButton onClick={fetchErrorData} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </motion.div>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {stats && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Total Errors
                </Typography>
                <Typography variant="h4">{stats.totalErrors}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Open Errors
                </Typography>
                <Typography variant="h4" color="error">
                  {stats.openErrors}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Resolution Rate
                </Typography>
                <Typography variant="h4">{formatDuration(stats.averageResolutionTime)}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Success Rate
                </Typography>
                <Box display="flex" alignItems="center">
                  <Box flexGrow={1} mr={1}>
                    <LinearProgress
                      variant="determinate"
                      value={stats.resolutionRate * 100}
                      color={stats.resolutionRate > 0.8 ? 'success' : 'warning'}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    {(stats.resolutionRate * 100).toFixed(1)}%
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Code</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Severity</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Timestamp</TableCell>
              <TableCell>Affected Transactions</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : errors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No errors found
                </TableCell>
              </TableRow>
            ) : (
              errors.map((error) => (
                <TableRow key={error.id}>
                  <TableCell>{error.id}</TableCell>
                  <TableCell>{error.code}</TableCell>
                  <TableCell>{error.category}</TableCell>
                  <TableCell>
                    <Chip
                      label={error.severity}
                      color={getSeverityColor(error.severity)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={error.status}
                      color={getStatusColor(error.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{formatTime(error.timestamp)}</TableCell>
                  <TableCell>{error.affectedTransactions.length}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSelectedError(error);
                          setOpenDialog(true);
                        }}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    {error.status !== 'resolved' && (
                      <Tooltip title="Resolve">
                        <IconButton
                          size="small"
                          onClick={() => handleResolveError(error.id)}
                          color="success"
                        >
                          <CheckCircleIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Error Details</DialogTitle>
        <DialogContent>
          {selectedError && (
            <Box pt={2}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Status"
                    value={selectedError.status}
                    select
                    margin="normal"
                    onChange={(e) =>
                      setSelectedError({
                        ...selectedError,
                        status: e.target.value as ErrorDetails['status'],
                      })
                    }
                  >
                    <MenuItem value="open">Open</MenuItem>
                    <MenuItem value="in_progress">In Progress</MenuItem>
                    <MenuItem value="resolved">Resolved</MenuItem>
                    <MenuItem value="closed">Closed</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Severity"
                    value={selectedError.severity}
                    select
                    margin="normal"
                    onChange={(e) =>
                      setSelectedError({
                        ...selectedError,
                        severity: e.target.value as ErrorDetails['severity'],
                      })
                    }
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                    <MenuItem value="critical">Critical</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Message"
                    value={selectedError.message}
                    multiline
                    rows={3}
                    margin="normal"
                    onChange={(e) =>
                      setSelectedError({
                        ...selectedError,
                        message: e.target.value,
                      })
                    }
                  />
                </Grid>
                {selectedError.resolution && (
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                      Resolution Details
                    </Typography>
                    <Stepper activeStep={activeStep} orientation="vertical">
                      <Step>
                        <StepLabel>Resolution Type</StepLabel>
                        <StepContent>
                          <Typography>{selectedError.resolution.type}</Typography>
                        </StepContent>
                      </Step>
                      <Step>
                        <StepLabel>Attempts</StepLabel>
                        <StepContent>
                          <Typography>{selectedError.resolution.attempts}</Typography>
                        </StepContent>
                      </Step>
                      <Step>
                        <StepLabel>Last Attempt</StepLabel>
                        <StepContent>
                          <Typography>{formatTime(selectedError.resolution.lastAttempt)}</Typography>
                        </StepContent>
                      </Step>
                      <Step>
                        <StepLabel>Result</StepLabel>
                        <StepContent>
                          <Chip
                            label={selectedError.resolution.result}
                            color={
                              selectedError.resolution.result === 'success'
                                ? 'success'
                                : selectedError.resolution.result === 'failure'
                                ? 'error'
                                : 'warning'
                            }
                          />
                        </StepContent>
                      </Step>
                      <Step>
                        <StepLabel>Notes</StepLabel>
                        <StepContent>
                          <Typography>{selectedError.resolution.notes}</Typography>
                        </StepContent>
                      </Step>
                    </Stepper>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={() => selectedError && handleUpdateError(selectedError)}
            variant="contained"
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ErrorManager; 