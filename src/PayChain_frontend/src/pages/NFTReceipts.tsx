import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Box,
  CircularProgress,
  Chip,
} from '@mui/material';
import { format } from 'date-fns';
import { usePayChainStore } from '../store/paychainStore';
import { NFTReceipt, Transaction } from '../types';

export default function NFTReceipts() {
  const { recentTransactions, getNFTReceipt } = usePayChainStore();
  const [loading, setLoading] = useState(true);
  const [receipts, setReceipts] = useState<NFTReceipt[]>([]);

  useEffect(() => {
    const loadReceipts = async () => {
      try {
        const receiptPromises = recentTransactions
          .filter((tx: Transaction) => tx.nftReceiptId)
          .map((tx: Transaction) => getNFTReceipt(tx.nftReceiptId!));

        const loadedReceipts = await Promise.all(receiptPromises);
        setReceipts(loadedReceipts.filter((r: NFTReceipt | null): r is NFTReceipt => r !== null));
      } catch (error) {
        console.error('Error loading NFT receipts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadReceipts();
  }, [recentTransactions, getNFTReceipt]);

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
          NFT Receipts
        </Typography>
        <Grid container spacing={3}>
          {receipts.map((receipt: NFTReceipt) => (
            <Grid item xs={12} md={6} key={receipt.id}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Receipt #{receipt.id}
                  </Typography>
                  <Box mb={2}>
                    <Chip
                      label={`Transaction #${receipt.transactionId}`}
                      color="primary"
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    <Chip
                      label={`${receipt.metadata.amount} ICP`}
                      color="secondary"
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    From: {receipt.metadata.from.slice(0, 8)}...
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    To: {receipt.metadata.to.slice(0, 8)}...
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Date: {format(Number(receipt.metadata.timestamp), 'PPp')}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
          {receipts.length === 0 && (
            <Grid item xs={12}>
              <Typography variant="body1" color="textSecondary" align="center">
                No NFT receipts found
              </Typography>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
} 