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
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';

// Types
interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  timestamp: number;
  category: string;
  tags: string[];
  metadata: Record<string, any>;
  error?: {
    code: number;
    message: string;
    category: string;
  };
}

interface TransactionFilters {
  status: string;
  category: string;
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
}

const TransactionManager: React.FC = () => {
  const theme = useTheme();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [filters, setFilters] = useState<TransactionFilters>({
    status: 'all',
    category: 'all',
    dateRange: {
      start: null,
      end: null,
    },
  });

  useEffect(() => {
    fetchTransactions();
  }, [filters]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      const response = await fetch('/api/transactions');
      const data = await response.json();
      setTransactions(data);
    } catch (err) {
      setError('Failed to fetch transactions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setOpenDialog(true);
  };

  const handleDelete = async (transactionId: string) => {
    try {
      // TODO: Replace with actual API call
      await fetch(`/api/transactions/${transactionId}`, {
        method: 'DELETE',
      });
      fetchTransactions();
    } catch (err) {
      setError('Failed to delete transaction');
      console.error(err);
    }
  };

  const handleUpdate = async (updatedTransaction: Transaction) => {
    try {
      // TODO: Replace with actual API call
      await fetch(`/api/transactions/${updatedTransaction.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTransaction),
      });
      setOpenDialog(false);
      fetchTransactions();
    } catch (err) {
      setError('Failed to update transaction');
      console.error(err);
    }
  };

  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      case 'cancelled':
        return 'default';
      default:
        return 'default';
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatAmount = (amount: number) => {
    return `${(amount / 1_000_000).toFixed(2)} ICP`;
  };

  const filteredTransactions = transactions.filter((transaction) => {
    if (filters.status !== 'all' && transaction.status !== filters.status) {
      return false;
    }
    if (filters.category !== 'all' && transaction.category !== filters.category) {
      return false;
    }
    if (filters.dateRange.start && new Date(transaction.timestamp) < filters.dateRange.start) {
      return false;
    }
    if (filters.dateRange.end && new Date(transaction.timestamp) > filters.dateRange.end) {
      return false;
    }
    return true;
  });

  return (
    <Box p={3}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4">Transaction Manager</Typography>
          <Box>
            <Tooltip title="Refresh">
              <IconButton onClick={fetchTransactions} disabled={loading}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Filter">
              <IconButton>
                <FilterIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </motion.div>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>From</TableCell>
              <TableCell>To</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Timestamp</TableCell>
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
            ) : filteredTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No transactions found
                </TableCell>
              </TableRow>
            ) : (
              filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.id}</TableCell>
                  <TableCell>{transaction.from}</TableCell>
                  <TableCell>{transaction.to}</TableCell>
                  <TableCell align="right">{formatAmount(transaction.amount)}</TableCell>
                  <TableCell>
                    <Chip
                      label={transaction.status}
                      color={getStatusColor(transaction.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{transaction.category}</TableCell>
                  <TableCell>{formatTime(transaction.timestamp)}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(transaction)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(transaction.id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Transaction</DialogTitle>
        <DialogContent>
          {selectedTransaction && (
            <Box pt={2}>
              <TextField
                fullWidth
                label="Status"
                value={selectedTransaction.status}
                select
                margin="normal"
                onChange={(e) =>
                  setSelectedTransaction({
                    ...selectedTransaction,
                    status: e.target.value as Transaction['status'],
                  })
                }
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="failed">Failed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </TextField>
              <TextField
                fullWidth
                label="Category"
                value={selectedTransaction.category}
                margin="normal"
                onChange={(e) =>
                  setSelectedTransaction({
                    ...selectedTransaction,
                    category: e.target.value,
                  })
                }
              />
              <TextField
                fullWidth
                label="Tags"
                value={selectedTransaction.tags.join(', ')}
                margin="normal"
                onChange={(e) =>
                  setSelectedTransaction({
                    ...selectedTransaction,
                    tags: e.target.value.split(',').map((tag) => tag.trim()),
                  })
                }
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={() => selectedTransaction && handleUpdate(selectedTransaction)}
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

export default TransactionManager; 