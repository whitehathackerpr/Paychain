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
} from '@mui/material';
import {
  Edit as EditIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Security as SecurityIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';

// Types
interface UserSecurity {
  id: string;
  principal: string;
  kycStatus: 'pending' | 'approved' | 'rejected';
  riskScore: number;
  isBlocked: boolean;
  blockExpiry?: number;
  lastActivity: number;
  ipAddress: string;
  deviceFingerprint: string;
  suspiciousActivities: {
    type: string;
    timestamp: number;
    details: string;
  }[];
}

interface SecurityStats {
  totalUsers: number;
  blockedUsers: number;
  pendingKyc: number;
  rejectedKyc: number;
  averageRiskScore: number;
  suspiciousActivities: number;
}

const SecurityManager: React.FC = () => {
  const theme = useTheme();
  const [users, setUsers] = useState<UserSecurity[]>([]);
  const [stats, setStats] = useState<SecurityStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserSecurity | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchSecurityData();
  }, []);

  const fetchSecurityData = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API calls
      const [usersResponse, statsResponse] = await Promise.all([
        fetch('/api/security/users'),
        fetch('/api/security/stats'),
      ]);
      const [usersData, statsData] = await Promise.all([
        usersResponse.json(),
        statsResponse.json(),
      ]);
      setUsers(usersData);
      setStats(statsData);
    } catch (err) {
      setError('Failed to fetch security data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUser = async (userId: string) => {
    try {
      // TODO: Replace with actual API call
      await fetch(`/api/security/users/${userId}/block`, {
        method: 'POST',
      });
      fetchSecurityData();
    } catch (err) {
      setError('Failed to block user');
      console.error(err);
    }
  };

  const handleUnblockUser = async (userId: string) => {
    try {
      // TODO: Replace with actual API call
      await fetch(`/api/security/users/${userId}/unblock`, {
        method: 'POST',
      });
      fetchSecurityData();
    } catch (err) {
      setError('Failed to unblock user');
      console.error(err);
    }
  };

  const handleUpdateKyc = async (userId: string, status: UserSecurity['kycStatus']) => {
    try {
      // TODO: Replace with actual API call
      await fetch(`/api/security/users/${userId}/kyc`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      fetchSecurityData();
    } catch (err) {
      setError('Failed to update KYC status');
      console.error(err);
    }
  };

  const getKycStatusColor = (status: UserSecurity['kycStatus']) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const getRiskLevelColor = (score: number) => {
    if (score >= 0.8) return 'error';
    if (score >= 0.5) return 'warning';
    return 'success';
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <Box p={3}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4">Security Manager</Typography>
          <Tooltip title="Refresh">
            <IconButton onClick={fetchSecurityData} disabled={loading}>
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
                  Total Users
                </Typography>
                <Typography variant="h4">{stats.totalUsers}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Blocked Users
                </Typography>
                <Typography variant="h4" color="error">
                  {stats.blockedUsers}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Pending KYC
                </Typography>
                <Typography variant="h4" color="warning.main">
                  {stats.pendingKyc}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Average Risk Score
                </Typography>
                <Box display="flex" alignItems="center">
                  <Box flexGrow={1} mr={1}>
                    <LinearProgress
                      variant="determinate"
                      value={stats.averageRiskScore * 100}
                      color={getRiskLevelColor(stats.averageRiskScore)}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    {(stats.averageRiskScore * 100).toFixed(1)}%
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
              <TableCell>User ID</TableCell>
              <TableCell>Principal</TableCell>
              <TableCell>KYC Status</TableCell>
              <TableCell>Risk Score</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Last Activity</TableCell>
              <TableCell>IP Address</TableCell>
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
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.principal}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.kycStatus}
                      color={getKycStatusColor(user.kycStatus)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Box flexGrow={1} mr={1}>
                        <LinearProgress
                          variant="determinate"
                          value={user.riskScore * 100}
                          color={getRiskLevelColor(user.riskScore)}
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                      </Box>
                      <Typography variant="body2" color="textSecondary">
                        {(user.riskScore * 100).toFixed(1)}%
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {user.isBlocked ? (
                      <Chip
                        icon={<BlockIcon />}
                        label="Blocked"
                        color="error"
                        size="small"
                      />
                    ) : (
                      <Chip
                        icon={<CheckCircleIcon />}
                        label="Active"
                        color="success"
                        size="small"
                      />
                    )}
                  </TableCell>
                  <TableCell>{formatTime(user.lastActivity)}</TableCell>
                  <TableCell>{user.ipAddress}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSelectedUser(user);
                          setOpenDialog(true);
                        }}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    {user.isBlocked ? (
                      <Tooltip title="Unblock">
                        <IconButton
                          size="small"
                          onClick={() => handleUnblockUser(user.id)}
                          color="success"
                        >
                          <CheckCircleIcon />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Tooltip title="Block">
                        <IconButton
                          size="small"
                          onClick={() => handleBlockUser(user.id)}
                          color="error"
                        >
                          <BlockIcon />
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

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit User Security</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box pt={2}>
              <TextField
                fullWidth
                label="KYC Status"
                value={selectedUser.kycStatus}
                select
                margin="normal"
                onChange={(e) =>
                  setSelectedUser({
                    ...selectedUser,
                    kycStatus: e.target.value as UserSecurity['kycStatus'],
                  })
                }
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
              </TextField>
              <TextField
                fullWidth
                label="Risk Score"
                type="number"
                value={selectedUser.riskScore}
                margin="normal"
                onChange={(e) =>
                  setSelectedUser({
                    ...selectedUser,
                    riskScore: parseFloat(e.target.value),
                  })
                }
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={() =>
              selectedUser && handleUpdateKyc(selectedUser.id, selectedUser.kycStatus)
            }
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

export default SecurityManager; 