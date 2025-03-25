import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  TextField,
  MenuItem,
  InputAdornment,
  IconButton,
  Pagination,
  useTheme,
  alpha,
  Tooltip,
} from '@mui/material';
import { usePayChainStore, Transaction } from '../store/paychainStore';
import { Search as SearchIcon, Receipt as ReceiptIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';

const Transactions: React.FC = () => {
  const theme = useTheme();
  const { transactions, fetchTransactions, isLoading } = usePayChainStore();
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  useEffect(() => {
    // Apply filters and search
    let filtered = [...transactions];
    
    // Apply type filter
    if (filter !== 'all') {
      filtered = filtered.filter(tx => tx.type === filter);
    }
    
    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(tx => 
        (tx.id?.toLowerCase() || '').includes(term) ||
        (tx.fromAddress?.toLowerCase() || '').includes(term) ||
        (tx.toAddress?.toLowerCase() || '').includes(term) ||
        ((tx.description || '').toLowerCase().includes(term))
      );
    }
    
    setFilteredTransactions(filtered);
  }, [transactions, filter, searchTerm]);

  const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(1); // Reset to first page when search changes
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value);
    setPage(1); // Reset to first page when filter changes
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Format address for display
  const formatAddress = (address: string | undefined | null): string => {
    if (!address) return 'Unknown';
    if (address.length <= 12) return address;
    return `${address.substring(0, 6)}...${address.substring(address.length - 6)}`;
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  // Get transaction type label
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'payment':
        return 'Payment';
      case 'deposit':
        return 'Deposit';
      case 'withdrawal':
        return 'Withdrawal';
      default:
        return type;
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  // Calculate pagination
  const start = (page - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const paginatedTransactions = filteredTransactions.slice(start, end);
  const pageCount = Math.ceil(filteredTransactions.length / rowsPerPage);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Transaction History
      </Typography>
      
      <Paper
        elevation={2}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 2,
          background: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: 'blur(10px)',
        }}
      >
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <TextField
            label="Search"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ flexGrow: 1, minWidth: '200px' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            placeholder="Search by ID, address, or description"
          />
          
          <TextField
            select
            label="Filter"
            value={filter}
            onChange={handleFilterChange}
            sx={{ minWidth: '150px' }}
          >
            <MenuItem value="all">All Types</MenuItem>
            <MenuItem value="payment">Payments</MenuItem>
            <MenuItem value="deposit">Deposits</MenuItem>
            <MenuItem value="withdrawal">Withdrawals</MenuItem>
          </TextField>
        </Box>
      </Paper>
      
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {filteredTransactions.length === 0 ? (
            <Paper
              sx={{
                p: 4,
                textAlign: 'center',
                bgcolor: alpha(theme.palette.background.paper, 0.6),
                backdropFilter: 'blur(10px)',
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" gutterBottom>
                No Transactions Found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {searchTerm || filter !== 'all'
                  ? 'No transactions match your search criteria. Try adjusting your filters.'
                  : 'You haven\'t made any transactions yet.'}
              </Typography>
            </Paper>
          ) : (
            <>
              <TableContainer 
                component={Paper} 
                sx={{ 
                  borderRadius: 2, 
                  overflow: 'hidden',
                  background: alpha(theme.palette.background.paper, 0.8),
                  backdropFilter: 'blur(10px)',
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>From</TableCell>
                      <TableCell>To</TableCell>
                      <TableCell align="right">Amount</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="center">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody component={motion.tbody} variants={containerVariants} initial="hidden" animate="visible">
                    {paginatedTransactions.map((transaction) => (
                      <TableRow
                        key={transaction.id}
                        component={motion.tr}
                        variants={itemVariants}
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                          transition: 'background-color 0.2s',
                          '&:hover': {
                            bgcolor: alpha(theme.palette.primary.main, 0.05),
                          },
                        }}
                      >
                        <TableCell sx={{ maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          <Typography variant="body2" component="span" sx={{ fontFamily: 'monospace' }}>
                            {transaction.id}
                          </Typography>
                        </TableCell>
                        <TableCell>{formatDate(transaction.timestamp)}</TableCell>
                        <TableCell>
                          <Chip
                            label={getTypeLabel(transaction.type)}
                            size="small"
                            sx={{
                              bgcolor: 
                                transaction.type === 'payment' 
                                  ? alpha(theme.palette.primary.main, 0.1)
                                  : transaction.type === 'deposit'
                                    ? alpha(theme.palette.success.main, 0.1)
                                    : alpha(theme.palette.warning.main, 0.1),
                              color: 
                                transaction.type === 'payment' 
                                  ? theme.palette.primary.main
                                  : transaction.type === 'deposit'
                                    ? theme.palette.success.main
                                    : theme.palette.warning.main,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Tooltip title={transaction.fromAddress}>
                            <Typography variant="body2" component="span" sx={{ fontFamily: 'monospace' }}>
                              {formatAddress(transaction.fromAddress)}
                            </Typography>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <Tooltip title={transaction.toAddress}>
                            <Typography variant="body2" component="span" sx={{ fontFamily: 'monospace' }}>
                              {formatAddress(transaction.toAddress)}
                            </Typography>
                          </Tooltip>
                        </TableCell>
                        <TableCell align="right">
                          <Typography
                            variant="body2"
                            component="span"
                            fontWeight="medium"
                            color={transaction.fromAddress === 'account' ? 'success.main' : ''}
                          >
                            {transaction.amount.toFixed(2)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                            size="small"
                            color={getStatusColor(transaction.status) as any}
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="Generate NFT Receipt">
                            <IconButton size="small" color="primary">
                              <ReceiptIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              {pageCount > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <Pagination
                    count={pageCount}
                    page={page}
                    onChange={handleChangePage}
                    variant="outlined"
                    shape="rounded"
                    color="primary"
                  />
                </Box>
              )}
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default Transactions; 