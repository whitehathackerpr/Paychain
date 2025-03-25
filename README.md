# PayChain

PayChain is a modern decentralized payment application with a beautiful Web3 UI. The application supports both Motoko (Internet Computer) and FastAPI (Python) backends, allowing flexible deployment options.

## Project Structure

```
PayChain/
├── docker-compose.yml           # Docker Compose file for running both services
├── src/
│   ├── PayChain_backend/        # Original Motoko backend
│   ├── PayChain_backend_python/ # New FastAPI backend
│   └── PayChain_frontend/       # React frontend with Material-UI
```

## Features

- User authentication and management
- Send and receive payments
- Transaction history and tracking
- Payment templates with conditional processing
- Beautiful, responsive UI with Web3 aesthetics
- Dockerized deployment for easy setup

## Backend Options

### FastAPI Backend (Python)

The FastAPI backend provides a modern, high-performance API with:

- JWT authentication
- SQLAlchemy ORM for database operations
- Pydantic for data validation
- Comprehensive API documentation (Swagger UI)
- Easy testing and extensibility
 ![Dashboard Preview](/docs/api.png)

### Motoko Backend (Internet Computer)

The original Motoko backend provides:

- Blockchain-based authentication and storage
- Decentralized architecture
- Smart contracts for payment logic
- Native token support

## Getting Started

### Running with Docker (FastAPI Backend)

1. Clone the repository
2. Run the application with Docker Compose:
   ```
   docker-compose up
   ```
3. Access the frontend at http://localhost:3000
4. The API documentation is available at http://localhost:8001/docs

### Manual Setup

#### FastAPI Backend

```bash
cd src/PayChain_backend_python
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python initialize_db.py
python run.py
```

#### React Frontend

```bash
cd src/PayChain_frontend
npm install
npm start
```

## Development

### Frontend Development

The frontend is built with:
- React with TypeScript
- Material-UI for components
- Framer Motion for animations
- Zustand for state management

### Backend Development

#### FastAPI Backend
- FastAPI framework
- SQLAlchemy ORM
- JWT authentication
- Pydantic for validation

#### Motoko Backend
- Internet Computer SDK
- Motoko programming language
- Candid interface definition

## License

MIT
