# PayChain Migration Guide: Motoko to FastAPI

This document outlines the process of migrating the PayChain backend from Motoko (Internet Computer) to FastAPI (Python).

## Migration Overview

The PayChain application has been successfully migrated from the Internet Computer's Motoko backend to a FastAPI Python backend. This migration offers several advantages:

1. **Simplified Development**: Python's ecosystem is more accessible to developers without blockchain experience
2. **Enhanced Flexibility**: The application can now be deployed in traditional cloud environments
3. **Improved Development Speed**: Faster iteration cycles for feature development and bug fixes
4. **Better Testing**: More comprehensive testing options with Python's testing ecosystem
5. **Simplified Integration**: Easier to integrate with third-party services and APIs

## What Was Migrated

The migration moved the following functionality from Motoko to FastAPI:

- User authentication and account management
- Transaction processing and history
- Balance tracking
- Payment templates
- Conditional payment execution
- Security features

## Architecture Changes

### Backend Architecture

- **Before**: Motoko canister running on the Internet Computer with blockchain-based storage
- **After**: FastAPI application with SQLAlchemy ORM and relational database (SQLite for development, can be upgraded to PostgreSQL for production)

### Authentication

- **Before**: Internet Identity and Principal-based authentication
- **After**: JWT token-based authentication with password hashing

### Data Storage

- **Before**: On-chain state storage in Motoko canisters
- **After**: SQLite/SQL database with SQLAlchemy ORM

### API Endpoints

The API structure remains similar, but implementation details have changed:

- User endpoints: `/users/`, `/login/`, `/users/me/`
- Transaction endpoints: `/transactions/`, `/balance/`
- Template endpoints: `/templates/`
- System endpoints: `/health`

## Frontend Changes

The frontend required minimal changes, with most of the work focused on:

1. Creating a backend adapter layer (`backendAdapter.ts`) to abstract API calls
2. Updating the application store to use the new API endpoints
3. Converting the Principal data type to a compatible format

## How to Switch Between Backends

The application now supports both backends:

### Using Motoko Backend

1. Start the Internet Computer replica:
   ```bash
   dfx start --background
   ```

2. Deploy the canister:
   ```bash
   dfx deploy
   ```

3. Run the frontend pointing to the Motoko backend:
   ```bash
   cd src/PayChain_frontend
   REACT_APP_USE_IC=true npm start
   ```

### Using FastAPI Backend

1. Start the FastAPI server:
   ```bash
   cd src/PayChain_backend_python
   python run.py
   ```

2. Run the frontend pointing to the FastAPI backend:
   ```bash
   cd src/PayChain_frontend
   npm start
   ```

Alternatively, use Docker Compose to run both services:
```bash
docker-compose up
```

## Testing the Migration

To verify the migration was successful, test the following functionality:

1. User registration and login
2. Viewing account balance
3. Creating and viewing transactions
4. Creating payment templates
5. System health checks

## Future Considerations

- **Database Upgrade**: Consider moving from SQLite to PostgreSQL for production
- **Authentication Enhancements**: Add OAuth support and refresh tokens
- **Scalability**: Implement horizontal scaling with multiple FastAPI instances
- **Caching**: Add Redis caching for improved performance
- **Monitoring**: Integrate with Prometheus and Grafana for monitoring

## Conclusion

The migration from Motoko to FastAPI provides a more accessible and flexible development environment while maintaining the core functionality of the PayChain application. Both backend options remain available, allowing developers to choose the approach that best fits their needs. 