# Developer Guide

This guide provides information for developers who want to contribute to the PayChain FastAPI backend.

## Development Environment Setup

### Prerequisites

- Python 3.9 or higher
- Git
- SQLite (for development)
- A code editor (VS Code recommended)

### Setting Up Local Development Environment

1. **Clone the repository**

```bash
git clone https://github.com/your-org/paychain.git
cd paychain/src/PayChain_backend_python
```

2. **Create a virtual environment**

```bash
python -m venv venv
```

3. **Activate the virtual environment**

Windows:
```bash
.\venv\Scripts\activate
```

Unix/MacOS:
```bash
source venv/bin/activate
```

4. **Install development dependencies**

```bash
pip install -r requirements-dev.txt  # Contains additional dev tools
```

5. **Setup environment variables**

Create a `.env.development` file in the root directory:

```
DATABASE_URL=sqlite:///./dev.db
SECRET_KEY=your_development_secret_key
ACCESS_TOKEN_EXPIRE_MINUTES=30
ALGORITHM=HS256
ENVIRONMENT=development
DEBUG=true
```

6. **Initialize the database with sample data**

```bash
python initialize_db.py --sample-data
```

7. **Run the development server**

```bash
uvicorn app.main:app --reload --port 8000
```

## Project Structure

```
src/PayChain_backend_python/
├── app/
│   ├── api/                # API endpoints
│   │   ├── auth.py         # Authentication routes
│   │   ├── users.py        # User management routes
│   │   ├── transactions.py # Transaction routes
│   │   ├── scheduled_payments.py
│   │   ├── nft_receipts.py
│   │   └── analytics.py
│   ├── core/               # Core application components
│   │   ├── config.py       # Configuration management
│   │   ├── security.py     # Security utilities
│   │   └── exceptions.py   # Custom exceptions
│   ├── db/                 # Database components
│   │   ├── base.py         # SQLAlchemy base setup
│   │   ├── session.py      # Database session management
│   │   └── init_db.py      # Database initialization logic
│   ├── models/             # SQLAlchemy ORM models
│   │   ├── user.py
│   │   ├── transaction.py
│   │   ├── scheduled_payment.py
│   │   └── nft_receipt.py
│   ├── schemas/            # Pydantic schemas for validation
│   │   ├── user.py
│   │   ├── transaction.py
│   │   ├── scheduled_payment.py
│   │   └── nft_receipt.py
│   ├── services/           # Business logic services
│   │   ├── user_service.py
│   │   ├── transaction_service.py
│   │   ├── scheduled_payment_service.py
│   │   └── nft_service.py
│   ├── utils/              # Utility functions
│   │   ├── dependencies.py # FastAPI dependencies
│   │   └── image_gen.py    # NFT image generation
│   ├── tasks/              # Background tasks
│   │   └── scheduled_payments.py
│   └── main.py             # FastAPI application entry point
├── tests/                  # Test suite
│   ├── conftest.py         # Test configuration
│   ├── test_api/           # API tests
│   ├── test_services/      # Service layer tests
│   └── test_utils/         # Utility tests
├── requirements.txt        # Production dependencies
├── requirements-dev.txt    # Development dependencies
├── initialize_db.py        # Database initialization script
└── run.py                  # Application runner script
```

## Coding Style and Guidelines

### Python Style

- Follow [PEP 8](https://peps.python.org/pep-0008/) style guide
- Use type hints for function parameters and return values
- Use docstrings for all public modules, functions, classes, and methods

### Code Formatting

We use the following tools to ensure code quality:

- **Black** for code formatting
- **isort** for import sorting
- **flake8** for linting
- **mypy** for static type checking

Run them with:

```bash
# Format code
black app tests

# Sort imports
isort app tests

# Lint code
flake8 app tests

# Type check
mypy app
```

### Commit Guidelines

- Use descriptive commit messages
- Include issue numbers in commit messages when applicable
- Follow conventional commits format: `type(scope): message`
  - Types: feat, fix, docs, style, refactor, test, chore
  - Example: `feat(auth): add social login capability`

## Testing

### Running Tests

```bash
# Run all tests
pytest

# Run specific test file
pytest tests/test_api/test_transactions.py

# Run with coverage report
pytest --cov=app
```

### Writing Tests

- Unit tests should be in the `tests/test_services` directory
- API integration tests should be in the `tests/test_api` directory
- Use fixtures defined in `conftest.py` for commonly used test objects
- Mock external dependencies when appropriate

Example test:

```python
def test_create_transaction(client, test_user, test_recipient):
    login_response = client.post(
        "/login/", data={"username": test_user.email, "password": "password123"}
    )
    access_token = login_response.json()["access_token"]
    
    response = client.post(
        "/transactions/",
        json={
            "recipient_principal": test_recipient.principal,
            "amount": 100.0,
            "description": "Test transaction"
        },
        headers={"Authorization": f"Bearer {access_token}"}
    )
    
    assert response.status_code == 201
    assert response.json()["amount"] == 100.0
    assert response.json()["sender_id"] == test_user.id
```

## API Changes

When making changes to the API:

1. Update the corresponding Pydantic schemas in `app/schemas/`
2. Update the route handlers in `app/api/`
3. Update the service layer in `app/services/` with business logic
4. Add or update tests in `tests/`
5. Update the API documentation in `API_DOCUMENTATION.md`

## Database Migrations

We use Alembic for database migrations:

```bash
# Create a new migration
alembic revision --autogenerate -m "Add new field to users table"

# Run migrations
alembic upgrade head

# Rollback one migration
alembic downgrade -1
```

## Adding a New Feature

1. **Create a new branch**

```bash
git checkout -b feature/feature-name
```

2. **Implement the feature**

   - Add necessary models in `app/models/`
   - Add Pydantic schemas in `app/schemas/`
   - Implement business logic in `app/services/`
   - Add API endpoints in `app/api/`
   - Add tests in `tests/`

3. **Run tests and ensure code quality**

```bash
pytest
black app tests
isort app tests
flake8 app tests
mypy app
```

4. **Submit a pull request**

   - Describe the feature in detail
   - Link to any related issues
   - Include any necessary setup steps

## Security Considerations

- Never commit secrets or API keys to the repository
- Use environment variables for all sensitive configuration
- Validate all input data with Pydantic schemas
- Use parameterized queries to prevent SQL injection
- Apply proper authentication and authorization checks for all endpoints

## Performance Tips

- Use async/await for I/O-bound operations
- Implement pagination for endpoints that return collections
- Use appropriate database indexes for frequently queried fields
- Consider caching for frequently accessed data

## Debugging

### FastAPI Debug Mode

FastAPI provides detailed error information in development mode. Make sure your `.env` file has:

```
DEBUG=true
```

### Logging

We use Python's built-in logging module. Add logs to your code:

```python
import logging

logger = logging.getLogger(__name__)

async def some_function():
    try:
        # Some code
        logger.info("Operation completed successfully")
    except Exception as e:
        logger.error(f"Error occurred: {str(e)}")
        raise
```

Access logs are available in the console when running the application.

## Common Tasks

### Adding a New Endpoint

1. Create or update the schema in `app/schemas/`
2. Add service method in `app/services/`
3. Add route handler in `app/api/`
4. Register the router in `app/main.py` if it's a new module
5. Add tests in `tests/test_api/`

### Adding a New Model

1. Create the model in `app/models/`
2. Create the schema in `app/schemas/`
3. Add service methods in `app/services/`
4. Run alembic to generate and apply migrations

### Adding a Background Task

1. Create a new module in `app/tasks/` if needed
2. Implement the task as an async function
3. Register the task in the application startup:

```python
@app.on_event("startup")
async def startup_event():
    asyncio.create_task(your_background_task())
```

## Troubleshooting

### Common Issues

1. **Database connection errors**
   - Check your DATABASE_URL in the .env file
   - Ensure the database server is running
   - Verify connection credentials

2. **Authorization failures**
   - Check that JWT_SECRET_KEY is properly set
   - Verify token expiration time
   - Check that the token is being passed correctly in the Authorization header

3. **Dependency issues**
   - Ensure you're using the correct virtual environment
   - Update requirements: `pip install -r requirements.txt`
   - Verify Python version compatibility

## Deployment

See the main README.md for detailed deployment instructions.

## Getting Help

If you need assistance:

1. Check existing issues on GitHub
2. Review the documentation
3. Reach out to the team on the project's communication channels

## Contributing Checklist

Before submitting a pull request, ensure:

- [ ] Your code follows the project's coding style
- [ ] You've added tests for your changes
- [ ] All tests pass successfully
- [ ] You've updated the documentation to reflect your changes
- [ ] You've added type hints where appropriate
- [ ] Your code has been reviewed by at least one other developer 