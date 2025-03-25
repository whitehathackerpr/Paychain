import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Button,
  Divider,
  useTheme,
  Paper,
  alpha,
} from '@mui/material';
import { motion } from 'framer-motion';
import { usePayChainStore } from '../store/paychainStore';

// Mock NFT receipt interface
interface NFTReceipt {
  id: string;
  title: string;
  transactionId: string;
  amount: number;
  date: string;
  image: string;
  recipient: string;
  status: 'minted' | 'pending';
}

const NFTReceipts: React.FC = () => {
  const theme = useTheme();
  const { transactions } = usePayChainStore();
  const [isLoading, setIsLoading] = useState(true);
  const [nftReceipts, setNftReceipts] = useState<NFTReceipt[]>([]);
  
  // Mock data for NFT receipts
  const mockNftReceipts: NFTReceipt[] = [
    {
      id: 'nft-1',
      title: 'Payment to Vendor A',
      transactionId: 'tx-123456',
      amount: 150,
      date: '2023-06-15T12:30:00Z',
      image: 'https://via.placeholder.com/300/3F88F6/FFFFFF?text=Receipt+NFT',
      recipient: 'user-xyz789',
      status: 'minted',
    },
    {
      id: 'nft-2',
      title: 'Monthly Subscription',
      transactionId: 'tx-789012',
      amount: 30,
      date: '2023-07-01T10:15:00Z',
      image: 'https://via.placeholder.com/300/9c27b0/FFFFFF?text=Subscription+NFT',
      recipient: 'user-abc123',
      status: 'minted',
    },
    {
      id: 'nft-3',
      title: 'Service Payment',
      transactionId: 'tx-345678',
      amount: 75,
      date: '2023-07-10T15:45:00Z',
      image: 'https://via.placeholder.com/300/4CAF50/FFFFFF?text=Service+NFT',
      recipient: 'user-def456',
      status: 'pending',
    },
  ];
  
  useEffect(() => {
    // Simulate loading NFT receipts from the backend
    const fetchNftReceipts = async () => {
      try {
        setIsLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // For a real implementation, we would generate these from transactions
        // const generatedReceipts = transactions.map(tx => ({...}))
        
        // Set mock data
        setNftReceipts(mockNftReceipts);
      } catch (error) {
        console.error('Error fetching NFT receipts:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNftReceipts();
  }, []);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };
  
  // Format date to readable string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          NFT Receipts
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View and manage your transaction receipts as NFTs
        </Typography>
      </Box>
      
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {nftReceipts.length === 0 ? (
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
                No NFT Receipts Found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                You don't have any transaction receipts minted as NFTs yet.
              </Typography>
              <Button variant="contained" color="primary">
                Create Your First NFT Receipt
              </Button>
            </Paper>
          ) : (
            <Grid
              container
              spacing={3}
              component={motion.div}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {nftReceipts.map((receipt) => (
                <Grid item xs={12} sm={6} md={4} key={receipt.id}>
                  <Card
                    component={motion.div}
                    variants={itemVariants}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 20px rgba(0, 0, 0, 0.2)',
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={receipt.image}
                      alt={receipt.title}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="h6" component="div" gutterBottom>
                          {receipt.title}
                        </Typography>
                        <Chip
                          label={receipt.status === 'minted' ? 'Minted' : 'Pending'}
                          color={receipt.status === 'minted' ? 'success' : 'warning'}
                          size="small"
                          sx={{ ml: 1 }}
                        />
                      </Box>
                      
                      <Divider sx={{ my: 1.5 }} />
                      
                      <Box sx={{ mb: 1.5 }}>
                        <Typography variant="body2" color="text.secondary">
                          Amount
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {receipt.amount.toFixed(2)} Tokens
                        </Typography>
                      </Box>
                      
                      <Box sx={{ mb: 1.5 }}>
                        <Typography variant="body2" color="text.secondary">
                          Date
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {formatDate(receipt.date)}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ mb: 1.5 }}>
                        <Typography variant="body2" color="text.secondary">
                          Recipient
                        </Typography>
                        <Typography variant="body1" fontWeight="medium" noWrap>
                          {receipt.recipient}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ mt: 2 }}>
                        <Button
                          variant="outlined"
                          color="primary"
                          fullWidth
                          sx={{ borderRadius: 2 }}
                        >
                          View Details
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}
    </Box>
  );
};

export default NFTReceipts; 