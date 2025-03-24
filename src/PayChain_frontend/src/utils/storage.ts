import { Transaction, NFTReceipt } from '../types';

const STORAGE_KEYS = {
  TRANSACTIONS: 'paychain_transactions',
  NFT_RECEIPTS: 'paychain_nft_receipts',
  LAST_SYNC: 'paychain_last_sync',
};

export const storage = {
  getTransactions: (): Transaction[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading transactions from storage:', error);
      return [];
    }
  },

  setTransactions: (transactions: Transaction[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    } catch (error) {
      console.error('Error saving transactions to storage:', error);
    }
  },

  getNFTReceipts: (): NFTReceipt[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NFT_RECEIPTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading NFT receipts from storage:', error);
      return [];
    }
  },

  setNFTReceipts: (receipts: NFTReceipt[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.NFT_RECEIPTS, JSON.stringify(receipts));
    } catch (error) {
      console.error('Error saving NFT receipts to storage:', error);
    }
  },

  getLastSync: (): number => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LAST_SYNC);
      return data ? parseInt(data, 10) : 0;
    } catch (error) {
      console.error('Error reading last sync from storage:', error);
      return 0;
    }
  },

  setLastSync: (timestamp: number): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.LAST_SYNC, timestamp.toString());
    } catch (error) {
      console.error('Error saving last sync to storage:', error);
    }
  },

  clear: (): void => {
    try {
      Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },
}; 