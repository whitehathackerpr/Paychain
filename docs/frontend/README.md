# PayChain Frontend Documentation

## Overview

The PayChain frontend is a modern React application built with TypeScript, providing a secure and user-friendly interface for the PayChain payment system.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Internet Computer SDK (dfx)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/PayChain.git
cd PayChain/src/PayChain_frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

## Project Structure

```
src/
├── components/         # Reusable UI components
├── context/           # React context providers
├── hooks/             # Custom React hooks
├── pages/             # Page components
├── services/          # API and service integrations
├── styles/            # Global styles and themes
├── types/             # TypeScript type definitions
└── utils/             # Utility functions
```

## Key Components

### AppContext

The main application context that manages global state and provides methods for interacting with the backend.

```typescript
interface PayChainState {
  balance: number;
  recentTransactions: Transaction[];
  loading: boolean;
  error: string | null;
}
```

### Components

1. **TransactionList**
   - Displays recent transactions
   - Supports filtering and sorting
   - Real-time updates

2. **PaymentForm**
   - Handles payment submission
   - Input validation
   - Error handling

3. **NFTReceipt**
   - Displays transaction receipts
   - QR code generation
   - Download functionality

## State Management

The application uses Zustand for state management:

```typescript
interface Store {
  balance: number;
  transactions: Transaction[];
  setBalance: (balance: number) => void;
  addTransaction: (transaction: Transaction) => void;
}
```

## API Integration

The frontend communicates with the backend through the `api.ts` service:

```typescript
interface ApiService {
  getBalance(): Promise<number>;
  getTransactions(): Promise<Transaction[]>;
  processPayment(amount: number, recipient: string): Promise<Transaction>;
  getNFTReceipt(transactionId: string): Promise<string>;
}
```

## Styling

The application uses Material-UI with custom theming:

```typescript
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});
```

## Testing

Run tests with:
```bash
npm test
```

Test files are located in the `__tests__` directory and follow the naming convention `*.test.tsx`.

## Error Handling

The application implements comprehensive error handling:

1. API Errors
   - Network errors
   - Validation errors
   - Authentication errors

2. UI Errors
   - Form validation
   - Input errors
   - State errors

## Performance Optimization

1. Code Splitting
   - Route-based splitting
   - Component lazy loading

2. Caching
   - API response caching
   - State persistence

3. Bundle Optimization
   - Tree shaking
   - Code minification

## Security

1. Authentication
   - Internet Identity integration
   - Session management

2. Data Protection
   - Input sanitization
   - XSS prevention
   - CSRF protection

## Deployment

1. Build the application:
```bash
npm run build
```

2. Deploy to production:
```bash
npm run deploy
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 