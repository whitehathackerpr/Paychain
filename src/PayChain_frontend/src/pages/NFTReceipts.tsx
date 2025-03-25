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
  Alert,
} from '@mui/material';
import { motion } from 'framer-motion';
import { usePayChainStore } from '../store/paychainStore';
import { backendAdapter } from '../services/backendAdapter';

// NFT receipt interface that matches the backend API response
interface NFTReceipt {
  id: string;
  transaction_id: string;
  owner_id: string;
  image_url: string;
  receipt_metadata: {
    amount: number;
    timestamp: string;
    sender: string;
    recipient: string;
    description?: string;
  };
}

const NFTReceipts: React.FC = () => {
  const theme = useTheme();
  const { user } = usePayChainStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nftReceipts, setNftReceipts] = useState<NFTReceipt[]>([]);
  
  useEffect(() => {
    const fetchNftReceipts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch NFT receipts from backend
        const response = await backendAdapter.nftReceipts.getNFTReceipts();
        setNftReceipts(response.data || []);
      } catch (err) {
        console.error('Error fetching NFT receipts:', err);
        setError('Failed to load NFT receipts. Please try again later.');
        
        // Fallback to empty array
        setNftReceipts([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNftReceipts();
  }, []);
  
  const handleGenerateNFT = async (transactionId: string) => {
    try {
      setIsLoading(true);
      await backendAdapter.nftReceipts.generateNFTReceipt(transactionId);
      
      // Refetch the NFT receipts to show the newly generated one
      const response = await backendAdapter.nftReceipts.getNFTReceipts();
      setNftReceipts(response.data || []);
      setError(null);
    } catch (err) {
      console.error('Error generating NFT receipt:', err);
      setError('Failed to generate NFT receipt. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
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
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  // Fix the formatPrincipalId wrapper function to handle undefined values
  const formatPrincipalId = (principalId: string | undefined | null): string => {
    return backendAdapter.utils.formatPrincipalId(principalId);
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
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
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
              <Button 
                variant="contained" 
                color="primary"
                onClick={() => handleGenerateNFT('')}
                disabled={isLoading}
              >
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
                      image={receipt.image_url || `https://via.placeholder.com/300/3F88F6/FFFFFF?text=Receipt+NFT`}
                      alt={`Transaction Receipt ${receipt.id}`}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="h6" component="div" gutterBottom>
                          {receipt.receipt_metadata.description || `Transaction Receipt`}
                        </Typography>
                        <Chip
                          label="Minted"
                          color="success"
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
                          ${receipt.receipt_metadata.amount.toFixed(2)}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ mb: 1.5 }}>
                        <Typography variant="body2" color="text.secondary">
                          Date
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {formatDate(receipt.receipt_metadata.timestamp)}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ mb: 1.5 }}>
                        <Typography variant="body2" color="text.secondary">
                          Recipient
                        </Typography>
                        <Typography variant="body1" fontWeight="medium" noWrap>
                          {formatPrincipalId(receipt.receipt_metadata.recipient)}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ mt: 2 }}>
                        <Button
                          variant="outlined"
                          color="primary"
                          fullWidth
                          sx={{ borderRadius: 2 }}
                          onClick={() => window.open(`/nft-receipts/${receipt.id}`, '_blank')}
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