from fastapi import FastAPI, Depends, HTTPException, Request, Response
from fastapi.responses import JSONResponse
from fastapi.routing import APIRoute
from sqlalchemy.orm import Session
from setup_database import SessionLocal, User, Transaction, NFTReceipt, ScheduledPayment
from typing import List, Dict, Any, Callable
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime, timedelta
import secrets
import hashlib

# User authentication models
class UserCreate(BaseModel):
    email: str
    password: str
    principal_id: str

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class ClientErrorLog(BaseModel):
    message: str
    stack: str = None
    url: str = None
    line: int = None
    component: str = None

# Custom route class to handle OPTIONS requests
class CORSRoute(APIRoute):
    def get_route_handler(self) -> Callable:
        original_route_handler = super().get_route_handler()

        async def custom_route_handler(request: Request) -> JSONResponse:
            if request.method == "OPTIONS":
                return JSONResponse(
                    content={},
                    headers={
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                        "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
                    },
                )
            return await original_route_handler(request)

        return custom_route_handler

app = FastAPI(title="PayChain API", description="FastAPI backend for PayChain application")

# Use custom route class
app.router.route_class = CORSRoute

# Add CORS middleware with more explicit configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=600,  # Cache preflight requests for 10 minutes
)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Authentication functions
def hash_password(password: str) -> str:
    """Hash a password for storage."""
    return hashlib.sha256(password.encode()).hexdigest()

def create_access_token(email: str) -> str:
    """Create a simple access token."""
    # In a real app, use JWT with proper expiration and signing
    token = secrets.token_hex(32)
    # Here you would store the token with user id and expiration
    return token

@app.get("/")
def read_root():
    return {"message": "Welcome to PayChain API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.get("/users")
def get_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return [
        {
            "id": user.id,
            "email": user.email,
            "principal_id": user.principal_id,
            "balance": user.balance
        }
        for user in users
    ]

@app.get("/transactions")
def get_transactions(db: Session = Depends(get_db)):
    transactions = db.query(Transaction).all()
    return [
        {
            "id": tx.id,
            "sender_id": tx.sender_id,
            "recipient_id": tx.recipient_id,
            "amount": tx.amount,
            "description": tx.description,
            "status": tx.status,
            "timestamp": tx.timestamp
        }
        for tx in transactions
    ]

@app.get("/nft-receipts")
def get_nft_receipts(db: Session = Depends(get_db)):
    receipts = db.query(NFTReceipt).all()
    return [
        {
            "id": receipt.id,
            "transaction_id": receipt.transaction_id,
            "owner_id": receipt.owner_id,
            "image_url": receipt.image_url,
            "receipt_metadata": receipt.receipt_metadata,
            "created_at": receipt.created_at
        }
        for receipt in receipts
    ]

@app.get("/scheduled-payments")
def get_scheduled_payments(db: Session = Depends(get_db)):
    payments = db.query(ScheduledPayment).all()
    return [
        {
            "id": payment.id,
            "user_id": payment.user_id,
            "recipient_principal": payment.recipient_principal,
            "amount": payment.amount,
            "description": payment.description,
            "frequency": payment.frequency,
            "start_date": payment.start_date,
            "next_payment_date": payment.next_payment_date,
            "is_active": payment.is_active
        }
        for payment in payments
    ]

@app.get("/users/me")
def get_current_user(request: Request, db: Session = Depends(get_db)):
    # In a real app, you would extract user ID from token
    # This is a simplified implementation
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        raise HTTPException(
            status_code=401,
            detail="Not authenticated"
        )
    
    # Mock implementation - return first user for testing
    # In production, you'd validate the token and get the correct user
    user = db.query(User).first()
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    
    return {
        "id": user.id,
        "email": user.email,
        "principal_id": user.principal_id,
        "balance": user.balance
    }

@app.post("/register", status_code=201)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    hashed_password = hash_password(user.password)
    new_user = User(
        email=user.email,
        hashed_password=hashed_password,
        principal_id=user.principal_id,
        balance=1000.0  # Initial balance for testing
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return {
        "id": new_user.id,
        "email": new_user.email,
        "principal_id": new_user.principal_id
    }

@app.post("/login")
def login(user_credentials: UserLogin, db: Session = Depends(get_db)):
    # Find user
    user = db.query(User).filter(User.email == user_credentials.email).first()
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password"
        )
    
    # Verify password
    hashed_password = hash_password(user_credentials.password)
    if user.hashed_password != hashed_password:
        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password"
        )
    
    # Generate token
    access_token = create_access_token(user.email)
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "principal_id": user.principal_id,
            "balance": user.balance
        }
    }

@app.post("/api/log-error")
def log_client_error(error_log: ClientErrorLog):
    # Log the error to console (in production you'd use a proper logger)
    print(f"CLIENT ERROR: {error_log.message}")
    if error_log.stack:
        print(f"STACK: {error_log.stack}")
    if error_log.url:
        print(f"URL: {error_log.url}")
    if error_log.component:
        print(f"COMPONENT: {error_log.component}")
    
    # Return success to avoid additional errors
    return {"success": True}

# Add explicit OPTIONS handlers for problematic routes
@app.options("/login")
async def options_login():
    return JSONResponse(
        content={},
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
        },
    )

@app.options("/register")
async def options_register():
    return JSONResponse(
        content={},
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
        },
    )

@app.get("/api/login")
def api_login(email: str, password: str, db: Session = Depends(get_db)):
    """Login using GET request with query parameters to avoid CORS preflight."""
    # Find user
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password"
        )
    
    # Verify password
    hashed_password = hash_password(password)
    if user.hashed_password != hashed_password:
        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password"
        )
    
    # Generate token
    access_token = create_access_token(user.email)
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "principal_id": user.principal_id,
            "balance": user.balance
        }
    }

@app.get("/api/register")
def api_register(email: str, password: str, principal_id: str, db: Session = Depends(get_db)):
    """Register using GET request with query parameters to avoid CORS preflight."""
    # Check if user already exists
    db_user = db.query(User).filter(User.email == email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    hashed_password = hash_password(password)
    new_user = User(
        email=email,
        hashed_password=hashed_password,
        principal_id=principal_id,
        balance=1000.0  # Initial balance for testing
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return {
        "id": new_user.id,
        "email": new_user.email,
        "principal_id": new_user.principal_id
    }

# Add missing endpoints needed by the frontend
@app.get("/notifications")
def get_notifications(db: Session = Depends(get_db)):
    """Get notifications for the current user."""
    # Mock notifications for the demo
    return {
        "items": [
            {
                "id": "1",
                "title": "New Payment Received",
                "message": "You have received 100 ICP from User123",
                "type": "payment",
                "read": False,
                "created_at": (datetime.now() - timedelta(hours=2)).isoformat()
            },
            {
                "id": "2",
                "title": "Scheduled Payment Due",
                "message": "Your monthly subscription payment of 25 ICP is due tomorrow",
                "type": "reminder",
                "read": False,
                "created_at": (datetime.now() - timedelta(days=1)).isoformat()
            },
            {
                "id": "3",
                "title": "NFT Receipt Generated",
                "message": "Your transaction receipt has been minted as an NFT",
                "type": "nft",
                "read": True,
                "created_at": (datetime.now() - timedelta(days=3)).isoformat()
            }
        ],
        "unread_count": 2
    }

@app.get("/notifications/unread-count")
def get_unread_notifications_count():
    """Get count of unread notifications."""
    return {"count": 2}

@app.put("/notifications/{notification_id}/read")
def mark_notification_as_read(notification_id: str):
    """Mark a notification as read."""
    return {"success": True}

@app.put("/notifications/read-all")
def mark_all_notifications_as_read():
    """Mark all notifications as read."""
    return {"success": True}

@app.get("/balance")
def get_balance(db: Session = Depends(get_db)):
    """Get current user balance."""
    # Get first user for demo
    user = db.query(User).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"balance": user.balance}

@app.get("/qr-codes/receive")
def generate_receive_qr(amount: float = None, description: str = None):
    """Generate QR code for receiving payments."""
    # In a real app, this would generate an actual QR code
    qr_data = {
        "qrContent": f"paychain://receive?amount={amount or ''}&description={description or ''}",
        "imageUrl": "https://api.qrserver.com/v1/create-qr-code/?data=paychain://receive"
    }
    return qr_data

@app.get("/payment-links/generate")
def generate_payment_link(amount: float = None, description: str = None):
    """Generate a shareable payment link."""
    # In a real app, this would generate a unique link
    return {
        "paymentLink": f"https://paychain.app/pay?amount={amount or ''}&description={description or ''}"
    }

@app.post("/nft-receipts/generate")
def generate_nft_receipt(data: dict, db: Session = Depends(get_db)):
    """Generate an NFT receipt for a transaction."""
    transaction_id = data.get("transaction_id")
    if not transaction_id:
        raise HTTPException(status_code=400, detail="Transaction ID is required")
    
    # Find the transaction
    transaction = db.query(Transaction).filter(Transaction.id == transaction_id).first()
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    # Check if NFT already exists
    existing_nft = db.query(NFTReceipt).filter(NFTReceipt.transaction_id == transaction_id).first()
    if existing_nft:
        return {
            "id": existing_nft.id,
            "transaction_id": existing_nft.transaction_id,
            "owner_id": existing_nft.owner_id,
            "image_url": existing_nft.image_url,
            "receipt_metadata": existing_nft.receipt_metadata
        }
    
    # Create a new NFT receipt
    sender = db.query(User).filter(User.id == transaction.sender_id).first()
    recipient = db.query(User).filter(User.id == transaction.recipient_id).first()
    
    nft_receipt = NFTReceipt(
        transaction_id=transaction.id,
        owner_id=transaction.recipient_id,
        image_url=f"https://via.placeholder.com/300/3F88F6/FFFFFF?text=Receipt+NFT+{transaction.id}",
        receipt_metadata={
            "amount": transaction.amount,
            "timestamp": transaction.timestamp.isoformat(),
            "sender": sender.principal_id if sender else "",
            "recipient": recipient.principal_id if recipient else "",
            "description": transaction.description
        }
    )
    
    db.add(nft_receipt)
    db.commit()
    db.refresh(nft_receipt)
    
    return {
        "id": nft_receipt.id,
        "transaction_id": nft_receipt.transaction_id,
        "owner_id": nft_receipt.owner_id,
        "image_url": nft_receipt.image_url,
        "receipt_metadata": nft_receipt.receipt_metadata
    }

@app.get("/analytics/transactions")
def get_transaction_summary(period: str = "month", db: Session = Depends(get_db)):
    """Get transaction summary analytics."""
    # This would contain more complex logic in a real app
    return {
        "total_sent": 350.75,
        "total_received": 520.50,
        "transaction_count": 8,
        "average_amount": 108.91,
        "period": period,
        "chart_data": [
            {"date": "2023-06-01", "sent": 150.00, "received": 0},
            {"date": "2023-06-05", "sent": 0, "received": 200.50},
            {"date": "2023-06-12", "sent": 75.75, "received": 0},
            {"date": "2023-06-18", "sent": 0, "received": 320.00},
            {"date": "2023-06-25", "sent": 125.00, "received": 0}
        ]
    }

@app.get("/analytics/spending")
def get_spending_by_category(period: str = "month"):
    """Get spending by category analytics."""
    # This would contain more complex logic in a real app
    return {
        "categories": [
            {"name": "Subscriptions", "amount": 150.25, "percentage": 35},
            {"name": "Services", "amount": 95.50, "percentage": 22},
            {"name": "Shopping", "amount": 85.00, "percentage": 20},
            {"name": "Entertainment", "amount": 65.75, "percentage": 15},
            {"name": "Other", "amount": 34.25, "percentage": 8}
        ],
        "period": period,
        "total": 430.75
    }

if __name__ == "__main__":
    uvicorn.run("simple_app:app", host="0.0.0.0", port=8001) 