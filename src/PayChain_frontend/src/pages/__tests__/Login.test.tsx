import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../theme';
import Login from '../Login';
import { AuthProvider } from '../../contexts/AuthContext';

const renderLogin = () => {
  return render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('Login Component', () => {
  it('renders login page with correct elements', () => {
    renderLogin();
    
    // Check for main elements
    expect(screen.getByText('Welcome to PayChain')).toBeInTheDocument();
    expect(screen.getByText('Your Secure Payment Solution')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login with internet identity/i })).toBeInTheDocument();
  });

  it('shows loading state when login button is clicked', async () => {
    renderLogin();
    
    const loginButton = screen.getByRole('button', { name: /login with internet identity/i });
    fireEvent.click(loginButton);
    
    // Check for loading state
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });
  });

  it('handles login error correctly', async () => {
    // Mock AuthClient to simulate an error
    jest.spyOn(require('@dfinity/auth-client'), 'AuthClient').mockImplementationOnce(() => ({
      create: jest.fn().mockRejectedValue(new Error('Login failed')),
    }));

    renderLogin();
    
    const loginButton = screen.getByRole('button', { name: /login with internet identity/i });
    fireEvent.click(loginButton);
    
    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByText(/login failed/i)).toBeInTheDocument();
    });
  });
}); 