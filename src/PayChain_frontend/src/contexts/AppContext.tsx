import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { SystemHealth, Transaction, UserSecurity, PayChainError } from '../types';

interface AppState {
  systemHealth: SystemHealth | null;
  recentTransactions: Transaction[];
  securityAlerts: UserSecurity[];
  activeErrors: PayChainError[];
  loading: boolean;
  error: string | null;
}

type AppAction =
  | { type: 'SET_SYSTEM_HEALTH'; payload: SystemHealth }
  | { type: 'SET_RECENT_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'SET_SECURITY_ALERTS'; payload: UserSecurity[] }
  | { type: 'SET_ACTIVE_ERRORS'; payload: PayChainError[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'UPDATE_TRANSACTION'; payload: Transaction }
  | { type: 'UPDATE_SECURITY_ALERT'; payload: UserSecurity }
  | { type: 'UPDATE_ERROR'; payload: PayChainError };

const initialState: AppState = {
  systemHealth: null,
  recentTransactions: [],
  securityAlerts: [],
  activeErrors: [],
  loading: false,
  error: null,
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_SYSTEM_HEALTH':
      return { ...state, systemHealth: action.payload };
    case 'SET_RECENT_TRANSACTIONS':
      return { ...state, recentTransactions: action.payload };
    case 'SET_SECURITY_ALERTS':
      return { ...state, securityAlerts: action.payload };
    case 'SET_ACTIVE_ERRORS':
      return { ...state, activeErrors: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        recentTransactions: state.recentTransactions.map((t) =>
          t.id === action.payload.id ? action.payload : t
        ),
      };
    case 'UPDATE_SECURITY_ALERT':
      return {
        ...state,
        securityAlerts: state.securityAlerts.map((a) =>
          a.id === action.payload.id ? action.payload : a
        ),
      };
    case 'UPDATE_ERROR':
      return {
        ...state,
        activeErrors: state.activeErrors.map((e) =>
          e.id === action.payload.id ? action.payload : e
        ),
      };
    default:
      return state;
  }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        // Fetch initial data here
        // Example:
        // const systemHealth = await getSystemStats();
        // dispatch({ type: 'SET_SYSTEM_HEALTH', payload: systemHealth });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch initial data' });
        enqueueSnackbar('Failed to fetch initial data', { variant: 'error' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    fetchInitialData();
  }, [enqueueSnackbar]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext; 