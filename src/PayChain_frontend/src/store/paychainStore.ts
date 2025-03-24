import { create } from 'zustand';
import { Principal } from '@dfinity/principal';
import { canisterId, createActor, GenericPrincipal } from '../declarations/PayChain_backend';
import { AuthClient } from '@dfinity/auth-client';
import { PayChainState, Transaction, NFTReceipt, Result } from '../types';
import { toGenericPrincipal } from '../utils/principal';
import { storage } from '../utils/storage';

type State = {
  balance: number | null;
  recentTransactions: Transaction[];
  loading: boolean;
  error: string | null;
  isOnline: boolean;
};

type Actions = {
  fetchBalance: () => Promise<void>;
  fetchRecentTransactions: () => Promise<void>;
  processPayment: (to: GenericPrincipal, amount: number) => Promise<Result<number, string>>;
  getNFTReceipt: (id: number) => Promise<NFTReceipt | null>;
  setOnlineStatus: (status: boolean) => void;
};

export const usePayChainStore = create<State & Actions>((set, get) => ({
  balance: null,
  recentTransactions: storage.getTransactions(),
  loading: false,
  error: null,
  isOnline: navigator.onLine,

  setOnlineStatus: (status: boolean) => {
    set({ isOnline: status });
    if (status) {
      // Sync data when coming back online
      get().fetchRecentTransactions();
    }
  },

  fetchBalance: async () => {
    try {
      const authClient = await AuthClient.create();
      const actor = createActor(canisterId, {
        agentOptions: {
          identity: authClient.getIdentity(),
        },
      });

      const userPrincipal = authClient.getIdentity().getPrincipal();
      const genericPrincipal = toGenericPrincipal(userPrincipal);
      const balance = await actor.getBalance(genericPrincipal);
      set({ balance: Number(balance) });
    } catch (error) {
      set({ error: 'Failed to fetch balance' });
    }
  },

  fetchRecentTransactions: async () => {
    try {
      const authClient = await AuthClient.create();
      const actor = createActor(canisterId, {
        agentOptions: {
          identity: authClient.getIdentity(),
        },
      });

      const userPrincipal = authClient.getIdentity().getPrincipal();
      const genericPrincipal = toGenericPrincipal(userPrincipal);
      const transactions = await actor.getUserTransactions(genericPrincipal);
      
      set({ recentTransactions: transactions });
      storage.setTransactions(transactions);
      storage.setLastSync(Date.now());
    } catch (error) {
      set({ error: 'Failed to fetch transactions' });
      // Use cached transactions if offline
      if (!get().isOnline) {
        const cachedTransactions = storage.getTransactions();
        set({ recentTransactions: cachedTransactions });
      }
    }
  },

  processPayment: async (to: GenericPrincipal, amount: number) => {
    try {
      set({ loading: true, error: null });
      const authClient = await AuthClient.create();
      const actor = createActor(canisterId, {
        agentOptions: {
          identity: authClient.getIdentity(),
        },
      });

      const result = await actor.processPayment(to, amount);
      if ('ok' in result) {
        await get().fetchBalance();
        await get().fetchRecentTransactions();
        return { ok: result.ok };
      } else {
        return { err: result.err };
      }
    } catch (error) {
      set({ error: 'Failed to process payment' });
      return { err: 'Failed to process payment' };
    } finally {
      set({ loading: false });
    }
  },

  getNFTReceipt: async (id: number) => {
    try {
      const authClient = await AuthClient.create();
      const actor = createActor(canisterId, {
        agentOptions: {
          identity: authClient.getIdentity(),
        },
      });

      const receipt = await actor.getNFTReceipt(id);
      if (receipt) {
        const receipts = storage.getNFTReceipts();
        receipts.push(receipt);
        storage.setNFTReceipts(receipts);
      }
      return receipt;
    } catch (error) {
      set({ error: 'Failed to fetch NFT receipt' });
      // Use cached receipt if offline
      if (!get().isOnline) {
        const receipts = storage.getNFTReceipts();
        return receipts.find(r => r.id === id) || null;
      }
      return null;
    }
  },
})); 