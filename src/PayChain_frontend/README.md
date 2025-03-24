# PayChain Frontend

A modern React-based frontend for the PayChain payment system, featuring a comprehensive admin dashboard for managing transactions, security, analytics, and error handling.

## Features

- **Dashboard**: Real-time system health monitoring and key metrics visualization
- **Transaction Management**: Complete transaction lifecycle management with filtering and search capabilities
- **Security Management**: User security controls, KYC verification, and risk monitoring
- **Analytics**: Advanced analytics with predictive insights and customizable reports
- **Error Handling**: Comprehensive error tracking and resolution system

## Tech Stack

- React 18
- TypeScript
- Material-UI (MUI)
- Recharts for data visualization
- Framer Motion for animations
- React Router for navigation
- Notistack for notifications

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/PayChain.git
cd PayChain/src/PayChain_frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm start
# or
yarn start
```

The application will be available at `http://localhost:3000`.

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── Dashboard.tsx
│   ├── TransactionManager.tsx
│   ├── SecurityManager.tsx
│   ├── AnalyticsManager.tsx
│   └── ErrorManager.tsx
├── App.tsx            # Main application component
├── index.tsx          # Application entry point
└── index.css          # Global styles
```

## Available Scripts

- `npm start`: Runs the app in development mode
- `npm test`: Launches the test runner
- `npm run build`: Builds the app for production
- `npm run eject`: Ejects from Create React App

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Material-UI for the component library
- Recharts for the data visualization
- Framer Motion for the animations 