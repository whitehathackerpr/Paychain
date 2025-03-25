from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from setup_database import SessionLocal, User, Transaction, NFTReceipt, ScheduledPayment
from typing import List, Dict, Any
import uvicorn

app = FastAPI(title="PayChain API", description="FastAPI backend for PayChain application")

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

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

if __name__ == "__main__":
    uvicorn.run("simple_app:app", host="0.0.0.0", port=8000) 