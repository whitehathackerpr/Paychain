from fastapi import FastAPI, Depends, HTTPException, status, Query, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import uvicorn
from datetime import datetime, timedelta, date

from app import models, schemas, crud, auth
from app.database import engine, get_db
from app.auth import get_current_user, create_access_token
from app.models import TransactionStatus

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="PayChain API",
    description="FastAPI backend for PayChain application",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# User endpoints
@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)

@app.post("/login/", response_model=schemas.Token)
def login(user_credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    user = auth.authenticate_user(db, user_credentials.email, user_credentials.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me/", response_model=schemas.User)
def read_users_me(current_user: schemas.User = Depends(get_current_user)):
    return current_user

@app.put("/users/me/", response_model=schemas.User)
def update_user(
    user_update: schemas.UserUpdate,
    current_user: schemas.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return crud.update_user(db, current_user.id, user_update)

# Transaction endpoints
@app.post("/transactions/", response_model=schemas.Transaction)
def create_transaction(
    transaction: schemas.TransactionCreate,
    current_user: schemas.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if user has enough balance
    if transaction.amount > crud.get_user_balance(db, user_id=current_user.id):
        raise HTTPException(status_code=400, detail="Insufficient funds")
    
    return crud.create_transaction(db=db, transaction=transaction, user_id=current_user.id)

@app.get("/transactions/", response_model=List[schemas.Transaction])
def read_transactions(
    skip: int = 0,
    limit: int = 100,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    current_user: schemas.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    transactions = crud.get_user_transactions(
        db, 
        user_id=current_user.id, 
        skip=skip, 
        limit=limit,
        start_date=start_date,
        end_date=end_date
    )
    return transactions

@app.get("/transactions/{transaction_id}", response_model=schemas.Transaction)
def read_transaction(
    transaction_id: int,
    current_user: schemas.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    transaction = crud.get_transaction(db, transaction_id=transaction_id)
    if transaction is None:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    # Check if user is sender or recipient
    if transaction.sender_id != current_user.id and transaction.recipient_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view this transaction")
    
    return transaction

@app.get("/balance/")
def get_balance(current_user: schemas.User = Depends(get_current_user), db: Session = Depends(get_db)):
    balance = crud.get_user_balance(db, user_id=current_user.id)
    return {"balance": balance}

# Templates endpoints
@app.post("/templates/", response_model=schemas.PaymentTemplate)
def create_template(
    template: schemas.PaymentTemplateCreate,
    current_user: schemas.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return crud.create_payment_template(db=db, template=template, user_id=current_user.id)

@app.get("/templates/", response_model=List[schemas.PaymentTemplate])
def read_templates(
    current_user: schemas.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    templates = crud.get_user_templates(db, user_id=current_user.id)
    return templates

@app.get("/templates/{template_id}", response_model=schemas.PaymentTemplate)
def read_template(
    template_id: int,
    current_user: schemas.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    template = crud.get_template(db, template_id=template_id)
    if template is None or template.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Template not found")
    return template

@app.put("/templates/{template_id}", response_model=schemas.PaymentTemplate)
def update_template(
    template_id: int,
    template_update: schemas.PaymentTemplateUpdate,
    current_user: schemas.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    template = crud.get_template(db, template_id=template_id)
    if template is None or template.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Template not found")
    
    return crud.update_payment_template(db, template_id=template_id, template=template_update)

@app.delete("/templates/{template_id}")
def delete_template(
    template_id: int,
    current_user: schemas.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    template = crud.get_template(db, template_id=template_id)
    if template is None or template.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Template not found")
    
    crud.delete_template(db, template_id=template_id)
    return {"detail": "Template deleted successfully"}

# Analytics and reporting endpoints
@app.get("/reports/transaction-summary/")
def get_transaction_summary(
    period: str = Query("month", enum=["week", "month", "year"]),
    current_user: schemas.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    today = datetime.utcnow()
    
    if period == "week":
        start_date = today - timedelta(days=7)
    elif period == "month":
        start_date = today - timedelta(days=30)
    else:  # year
        start_date = today - timedelta(days=365)
    
    report = crud.generate_transaction_report(db, user_id=current_user.id, start_date=start_date)
    return report

@app.get("/reports/spending-categories/")
def get_spending_categories(
    period: str = Query("month", enum=["week", "month", "year"]),
    current_user: schemas.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    today = datetime.utcnow()
    
    if period == "week":
        start_date = today - timedelta(days=7)
    elif period == "month":
        start_date = today - timedelta(days=30)
    else:  # year
        start_date = today - timedelta(days=365)
    
    categories = crud.get_spending_by_category(db, user_id=current_user.id, start_date=start_date)
    return {"categories": categories}

# NFT Receipt endpoints
@app.get("/nft-receipts/", response_model=List[schemas.NFTReceipt])
def get_nft_receipts(
    current_user: schemas.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return crud.get_user_nft_receipts(db, user_id=current_user.id)

@app.get("/nft-receipts/{receipt_id}", response_model=schemas.NFTReceipt)
def get_nft_receipt(
    receipt_id: int,
    current_user: schemas.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    receipt = crud.get_nft_receipt(db, receipt_id=receipt_id)
    if receipt is None or receipt.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="NFT receipt not found")
    return receipt

@app.post("/transactions/{transaction_id}/generate-nft", response_model=schemas.NFTReceipt)
def generate_nft_receipt(
    transaction_id: int,
    current_user: schemas.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if transaction exists and user is either sender or recipient
    transaction = crud.get_transaction(db, transaction_id=transaction_id)
    if transaction is None:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    if transaction.sender_id != current_user.id and transaction.recipient_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to generate NFT for this transaction")
    
    # Only completed transactions can have NFT receipts
    if transaction.status != TransactionStatus.COMPLETED:
        raise HTTPException(status_code=400, detail="Only completed transactions can have NFT receipts")
    
    # Check if NFT receipt already exists
    existing_receipt = crud.get_nft_receipt_by_transaction(db, transaction_id=transaction_id)
    if existing_receipt:
        return existing_receipt
    
    # Create NFT receipt - recipient is the owner
    return crud.create_nft_receipt(db, transaction_id=transaction_id, owner_id=transaction.recipient_id)

# Scheduled payments endpoints
@app.post("/scheduled-payments/", response_model=schemas.ScheduledPayment)
def create_scheduled_payment(
    payment: schemas.ScheduledPaymentCreate,
    current_user: schemas.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return crud.create_scheduled_payment(db=db, payment=payment, user_id=current_user.id)

@app.get("/scheduled-payments/", response_model=List[schemas.ScheduledPayment])
def read_scheduled_payments(
    current_user: schemas.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return crud.get_user_scheduled_payments(db, user_id=current_user.id)

@app.delete("/scheduled-payments/{payment_id}")
def delete_scheduled_payment(
    payment_id: int,
    current_user: schemas.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    payment = crud.get_scheduled_payment(db, payment_id=payment_id)
    if payment is None or payment.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Scheduled payment not found")
    
    crud.delete_scheduled_payment(db, payment_id=payment_id)
    return {"detail": "Scheduled payment deleted successfully"}

# Health check endpoint
@app.get("/health")
def health_check():
    return {"status": "healthy"}

# Admin endpoints (protected)
@app.post("/admin/process-scheduled-payments")
def trigger_scheduled_payments(
    background_tasks: BackgroundTasks,
    current_user: schemas.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if user has admin privileges (for simplicity, we'll just check by email)
    if not current_user.email.endswith("@admin.com"):
        raise HTTPException(
            status_code=403,
            detail="You don't have permission to access this endpoint"
        )
    
    # Process scheduled payments in the background
    def process():
        today = date.today()
        crud.process_scheduled_payments(db, today)
    
    background_tasks.add_task(process)
    
    return {"message": "Scheduled payments processing triggered"}

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8001, reload=True) 