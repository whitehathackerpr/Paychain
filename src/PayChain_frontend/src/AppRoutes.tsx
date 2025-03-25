import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Payment from './pages/Payment';
import Receive from './pages/Receive';
import Transactions from './pages/Transactions';
import ScheduledPayments from './pages/ScheduledPayments';
import NFTReceipts from './pages/NFTReceipts';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import { usePayChainStore } from './store/paychainStore';

const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  const { isAuthenticated, initialize } = usePayChainStore();
  
  React.useEffect(() => {
    initialize();
  }, [initialize]);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

const AppRoutes: React.FC = () => {
  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected routes */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <Layout>
                <Payment />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/receive"
          element={
            <ProtectedRoute>
              <Layout>
                <Receive />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <Layout>
                <Transactions />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/scheduled-payments"
          element={
            <ProtectedRoute>
              <Layout>
                <ScheduledPayments />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/nft-receipts"
          element={
            <ProtectedRoute>
              <Layout>
                <NFTReceipts />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Layout>
                <Settings />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        {/* Catch all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default AppRoutes; 