import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  Box,
  CircularProgress,
  Pagination,
} from '@mui/material';
import { format } from 'date-fns';
import { usePayChainStore } from '../store/paychainStore';
import { Transaction } from '../types';

const ITEMS_PER_PAGE = 10;

export default function Transactions() {
  const { recentTransactions, fetchRecentTransactions } = usePayChainStore();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        await fetchRecentTransactions();
      } catch (error) {
        console.error('Error loading transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, [fetchRecentTransactions]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const totalPages = Math.ceil(recentTransactions.length / ITEMS_PER_PAGE);
  const paginatedTransactions = recentTransactions.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Transaction History
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Recipient</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedTransactions.map((transaction: Transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    {format(Number(transaction.timestamp), 'PPp')}
                  </TableCell>
                  <TableCell>{transaction.amount} ICP</TableCell>
                  <TableCell>
                    {transaction.to.toString().slice(0, 8)}...
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={transaction.status}
                      color={
                        transaction.status === 'Completed'
                          ? 'success'
                          : transaction.status === 'Failed'
                          ? 'error'
                          : transaction.status === 'Fraudulent'
                          ? 'warning'
                          : 'default'
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
              {paginatedTransactions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No transactions found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {totalPages > 1 && (
          <Box display="flex" justifyContent="center" mt={3}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
} 