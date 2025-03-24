import { useEffect, useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Box,
  CircularProgress,
} from '@mui/material';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { usePayChainStore } from '../store/paychainStore';
import { Transaction } from '../types';

export default function Dashboard() {
  const navigate = useNavigate();
  const { balance, recentTransactions, fetchBalance, fetchRecentTransactions } = usePayChainStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([fetchBalance(), fetchRecentTransactions()]);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [fetchBalance, fetchRecentTransactions]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {/* Balance Card */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Current Balance
            </Typography>
            <Typography variant="h4" component="h2">
              {balance ? `${balance} ICP` : '0 ICP'}
            </Typography>
            <Box mt={2}>
              <Chip
                label="View Transactions"
                color="primary"
                onClick={() => navigate('/transactions')}
                sx={{ cursor: 'pointer' }}
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Recent Transactions */}
      <Grid item xs={12} md={8}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recent Transactions
            </Typography>
            <List>
              {recentTransactions.map((transaction: Transaction) => (
                <ListItem key={transaction.id} divider>
                  <ListItemText
                    primary={`${transaction.amount} ICP`}
                    secondary={format(Number(transaction.timestamp), 'PPp')}
                  />
                  <ListItemSecondaryAction>
                    <Chip
                      label={transaction.status}
                      color={
                        transaction.status === 'Completed'
                          ? 'success'
                          : transaction.status === 'Failed'
                          ? 'error'
                          : 'default'
                      }
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
              {recentTransactions.length === 0 && (
                <ListItem>
                  <ListItemText primary="No recent transactions" />
                </ListItem>
              )}
            </List>
            <Box mt={2} display="flex" justifyContent="flex-end">
              <Chip
                label="View All"
                color="primary"
                onClick={() => navigate('/transactions')}
                sx={{ cursor: 'pointer' }}
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
} 