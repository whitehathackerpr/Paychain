# PayChain Backend (FastAPI)

A modern, high-performance backend for the PayChain application built with FastAPI, SQLAlchemy, and JSON Web Token (JWT) authentication.

## Features

- 🔐 **Secure Authentication**: JWT-based authentication system
- 💸 **Transaction Management**: Handle payments between users with detailed tracking
- 📊 **Analytics**: Generate reports on spending patterns and transaction history
- 📅 **Scheduled Payments**: Setup recurring payments with customizable frequencies
- 🖼️ **NFT Receipts**: Generate unique receipts for transactions as NFTs
- 🔍 **Comprehensive API**: Well-documented endpoints with automatic OpenAPI documentation

## Tech Stack

- **FastAPI**: High-performance web framework
- **SQLAlchemy**: SQL toolkit and ORM
- **Pydantic**: Data validation and settings management
- **JWT**: Authentication mechanism
- **SQLite**: Database (configurable to other databases)

## Getting Started

### Prerequisites

- Python 3.8+
- pip (Python package manager)

### Installation

1. Clone the repository
2. Navigate to the Python backend directory:
   ```bash
   cd src/PayChain_backend_python
   ```

3. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

4. Activate the virtual environment:
   - Windows: `.\venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`

5. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

6. Set up environment variables (optional):
   Create a `.env` file with:
   ```
   DATABASE_URL=sqlite:///./paychain.db
   SECRET_KEY=your-secret-key
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ```

### Database Setup

1. Initialize the database:
   ```bash
   python setup_database.py
   ```

2. Seed the database with sample data:
   ```bash
   python seed_database.py
   ```

### Running the Application

Start the application with:
```bash
python -m uvicorn app.main:app --reload
```

Or use the run script:
```bash
python run.py
```

The API will be available at http://localhost:8000

## API Documentation

Once running, access the interactive API documentation:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Core Endpoints

### Authentication
- `POST /login/`: Obtain access token
- `POST /users/`: Register new user

### User Management
- `GET /users/me/`: Get current user profile
- `PUT /users/me/`: Update user profile

### Transactions
- `GET /transactions/`: List user transactions
- `POST /transactions/`: Create new transaction
- `GET /transactions/{id}/`: Get transaction details

### Scheduled Payments
- `GET /scheduled-payments/`: List scheduled payments
- `POST /scheduled-payments/`: Create scheduled payment
- `DELETE /scheduled-payments/{id}/`: Delete scheduled payment

### NFT Receipts
- `GET /nft-receipts/`: List NFT receipts
- `GET /nft-receipts/{id}/`: Get receipt details
- `POST /transactions/{id}/generate-nft/`: Generate NFT for transaction

### Analytics
- `GET /reports/transaction-summary/`: Get transaction summary
- `GET /reports/spending-categories/`: Get spending by category

## Scheduled Tasks

The application includes a script to process scheduled payments:

```bash
python process_scheduled_payments.py
```

This can be configured as a cron job or scheduled task to run daily.

## Development

### Project Structure

```
src/PayChain_backend_python/
├── app/                    # Application package
│   ├── __init__.py         # Package initializer
│   ├── main.py             # FastAPI application
│   ├── auth.py             # Authentication logic
│   ├── crud.py             # Database operations
│   ├── database.py         # Database setup
│   ├── models.py           # SQLAlchemy models
│   └── schemas.py          # Pydantic schemas
├── venv/                   # Virtual environment
├── requirements.txt        # Dependencies
├── run.py                  # Application runner
├── setup_database.py       # Database setup script
├── seed_database.py        # Data seeding script
├── process_scheduled_payments.py  # Scheduler
└── README.md               # Documentation
```

### Testing

Run tests with:
```bash
pytest
```

## License

[MIT License](LICENSE)

## Contact

For questions or support, please open an issue in the GitHub repository. 