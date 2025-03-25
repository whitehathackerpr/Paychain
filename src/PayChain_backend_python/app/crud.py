from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, func, desc
from datetime import datetime, timedelta, date
from typing import List, Optional, Dict, Any
from collections import defaultdict
import json

from app import models, schemas
from app.auth import get_password_hash

# User operations
def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_user_by_principal(db: Session, principal_id: str):
    return db.query(models.User).filter(models.User.principal_id == principal_id).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        principal_id=user.principal_id,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user(db: Session, user_id: int, user_update: schemas.UserUpdate):
    db_user = get_user(db, user_id)
    if not db_user:
        return None
    
    update_data = user_update.dict(exclude_unset=True)
    
    # Hash the password if it's being updated
    if "password" in update_data and update_data["password"]:
        update_data["hashed_password"] = get_password_hash(update_data["password"])
        del update_data["password"]
    
    for key, value in update_data.items():
        setattr(db_user, key, value)
    
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_balance(db: Session, user_id: int):
    user = get_user(db, user_id)
    if not user:
        return 0
    return user.balance

def update_user_balance(db: Session, user_id: int, amount: float, is_increase: bool = True):
    user = get_user(db, user_id)
    if not user:
        return None
    
    if is_increase:
        user.balance += amount
    else:
        user.balance -= amount
    
    db.commit()
    db.refresh(user)
    return user

# Tag operations
def get_tag_by_name(db: Session, name: str):
    return db.query(models.Tag).filter(models.Tag.name == name).first()

def create_tag(db: Session, name: str):
    db_tag = models.Tag(name=name)
    db.add(db_tag)
    db.commit()
    db.refresh(db_tag)
    return db_tag

def get_or_create_tag(db: Session, name: str):
    db_tag = get_tag_by_name(db, name)
    if db_tag:
        return db_tag
    return create_tag(db, name)

# Transaction operations
def create_transaction(db: Session, transaction: schemas.TransactionCreate, user_id: int):
    # Find recipient by principal ID
    recipient = get_user_by_principal(db, transaction.recipient_principal)
    
    if not recipient:
        # Create a placeholder recipient if not found (for demo purposes)
        temp_password = get_password_hash("temporary")
        recipient = models.User(
            email=f"{transaction.recipient_principal}@placeholder.com",
            principal_id=transaction.recipient_principal,
            hashed_password=temp_password
        )
        db.add(recipient)
        db.commit()
        db.refresh(recipient)
    
    # Convert metadata to string for storage
    metadata_json = None
    if transaction.metadata:
        metadata_json = json.dumps(transaction.metadata)
    
    # Create transaction record
    db_transaction = models.Transaction(
        sender_id=user_id,
        recipient_id=recipient.id,
        amount=transaction.amount,
        description=transaction.description,
        transaction_metadata=metadata_json,
        category=transaction.category,
        status=models.TransactionStatus.COMPLETED  # Mark as completed for simplicity
    )
    
    db.add(db_transaction)
    
    # Add tags if provided
    if transaction.tags:
        for tag_name in transaction.tags:
            tag = get_or_create_tag(db, tag_name)
            db_transaction.tags.append(tag)
    
    # Update balances
    update_user_balance(db, user_id, transaction.amount, is_increase=False)
    update_user_balance(db, recipient.id, transaction.amount, is_increase=True)
    
    db.commit()
    db.refresh(db_transaction)
    
    # Create NFT receipt
    create_nft_receipt(db, db_transaction.id, user_id)
    
    # Add principal IDs to response
    db_transaction.sender_principal = get_user(db, user_id).principal_id
    db_transaction.recipient_principal = recipient.principal_id
    
    return db_transaction

def get_user_transactions(
    db: Session, 
    user_id: int, 
    skip: int = 0, 
    limit: int = 100,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None
):
    query = db.query(models.Transaction).filter(
        (models.Transaction.sender_id == user_id) | 
        (models.Transaction.recipient_id == user_id)
    )
    
    if start_date:
        query = query.filter(models.Transaction.timestamp >= start_date)
    
    if end_date:
        query = query.filter(models.Transaction.timestamp <= end_date)
    
    query = query.order_by(desc(models.Transaction.timestamp))
    transactions = query.offset(skip).limit(limit).all()
    
    # Add principal IDs to all transactions
    for tx in transactions:
        tx.sender_principal = get_user(db, tx.sender_id).principal_id
        tx.recipient_principal = get_user(db, tx.recipient_id).principal_id
    
    return transactions

def get_transaction(db: Session, transaction_id: int):
    return db.query(models.Transaction).filter(models.Transaction.id == transaction_id).first()

# Template operations
def create_payment_template(db: Session, template: schemas.PaymentTemplateCreate, user_id: int):
    db_template = models.PaymentTemplate(
        owner_id=user_id,
        name=template.name,
        description=template.description,
        recipient_principal=template.recipient_principal,
        amount=template.amount,
        is_active=template.is_active
    )
    db.add(db_template)
    db.commit()
    db.refresh(db_template)
    
    # Add conditions
    for condition in template.conditions:
        db_condition = models.TemplateCondition(
            template_id=db_template.id,
            condition_type=condition.condition_type,
            operator=condition.operator,
            value=condition.value
        )
        db.add(db_condition)
    
    db.commit()
    db.refresh(db_template)
    return db_template

def get_user_templates(db: Session, user_id: int):
    return db.query(models.PaymentTemplate).filter(models.PaymentTemplate.owner_id == user_id).all()

def get_template(db: Session, template_id: int):
    return db.query(models.PaymentTemplate).filter(models.PaymentTemplate.id == template_id).first()

def update_payment_template(db: Session, template_id: int, template: schemas.PaymentTemplateUpdate):
    db_template = get_template(db, template_id)
    if not db_template:
        return None
    
    update_data = template.dict(exclude_unset=True)
    
    # Handle conditions separately
    conditions = update_data.pop("conditions", None)
    
    # Update basic fields
    for key, value in update_data.items():
        setattr(db_template, key, value)
    
    # Update conditions if provided
    if conditions is not None:
        # Remove existing conditions
        db.query(models.TemplateCondition).filter(
            models.TemplateCondition.template_id == template_id
        ).delete()
        
        # Add new conditions
        for condition in conditions:
            db_condition = models.TemplateCondition(
                template_id=template_id,
                condition_type=condition.condition_type,
                operator=condition.operator,
                value=condition.value
            )
            db.add(db_condition)
    
    db.commit()
    db.refresh(db_template)
    return db_template

def delete_template(db: Session, template_id: int):
    db_template = get_template(db, template_id)
    if db_template:
        db.delete(db_template)
        db.commit()
    return db_template

# Scheduled Payment operations
def create_scheduled_payment(db: Session, payment: schemas.ScheduledPaymentCreate, user_id: int):
    # Calculate next payment date
    next_payment_date = payment.start_date
    
    db_payment = models.ScheduledPayment(
        user_id=user_id,
        recipient_principal=payment.recipient_principal,
        amount=payment.amount,
        description=payment.description,
        start_date=payment.start_date,
        frequency=payment.frequency,
        end_date=payment.end_date,
        max_payments=payment.max_payments,
        is_active=payment.is_active,
        next_payment_date=next_payment_date
    )
    
    db.add(db_payment)
    db.commit()
    db.refresh(db_payment)
    return db_payment

def get_user_scheduled_payments(db: Session, user_id: int):
    return db.query(models.ScheduledPayment).filter(
        models.ScheduledPayment.user_id == user_id
    ).all()

def get_scheduled_payment(db: Session, payment_id: int):
    return db.query(models.ScheduledPayment).filter(
        models.ScheduledPayment.id == payment_id
    ).first()

def update_scheduled_payment(db: Session, payment_id: int, payment: schemas.ScheduledPaymentUpdate):
    db_payment = get_scheduled_payment(db, payment_id)
    if not db_payment:
        return None
    
    update_data = payment.dict(exclude_unset=True)
    
    for key, value in update_data.items():
        setattr(db_payment, key, value)
    
    # Recalculate next payment date if start date or frequency changed
    if "start_date" in update_data or "frequency" in update_data:
        if db_payment.last_processed:
            # Calculate from last processed date if available
            db_payment.next_payment_date = calculate_next_payment_date(
                db_payment.last_processed.date(),
                db_payment.frequency
            )
        else:
            # Calculate from start date
            db_payment.next_payment_date = db_payment.start_date
    
    db.commit()
    db.refresh(db_payment)
    return db_payment

def delete_scheduled_payment(db: Session, payment_id: int):
    db_payment = get_scheduled_payment(db, payment_id)
    if db_payment:
        db.delete(db_payment)
        db.commit()
    return db_payment

def calculate_next_payment_date(current_date: date, frequency: models.ScheduledPaymentFrequency) -> date:
    """Calculate the next payment date based on frequency"""
    if frequency == models.ScheduledPaymentFrequency.ONCE:
        return None  # No next payment for one-time payments
    
    today = date.today() if not current_date else current_date
    
    if frequency == models.ScheduledPaymentFrequency.DAILY:
        return today + timedelta(days=1)
    elif frequency == models.ScheduledPaymentFrequency.WEEKLY:
        return today + timedelta(days=7)
    elif frequency == models.ScheduledPaymentFrequency.BIWEEKLY:
        return today + timedelta(days=14)
    elif frequency == models.ScheduledPaymentFrequency.MONTHLY:
        # Handle month logic (may need more sophisticated handling for 31->30 day months)
        next_month = today.month + 1
        next_year = today.year
        if next_month > 12:
            next_month = 1
            next_year += 1
        # Handle end of month cases
        month_days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
        if today.month == 2 and today.day == 29:  # Leap year
            day = min(today.day, month_days[next_month-1])
        else:
            day = min(today.day, month_days[next_month-1])
        return date(next_year, next_month, day)
    elif frequency == models.ScheduledPaymentFrequency.QUARTERLY:
        # Add 3 months
        next_month = today.month + 3
        next_year = today.year
        if next_month > 12:
            next_month = next_month - 12
            next_year += 1
        month_days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
        day = min(today.day, month_days[next_month-1])
        return date(next_year, next_month, day)
    elif frequency == models.ScheduledPaymentFrequency.YEARLY:
        return date(today.year + 1, today.month, today.day)
    else:
        return None

def process_scheduled_payments(db: Session, current_date: Optional[date] = None):
    """Process all due scheduled payments"""
    today = date.today() if not current_date else current_date
    
    # Find all active scheduled payments that are due
    due_payments = db.query(models.ScheduledPayment).filter(
        models.ScheduledPayment.is_active == True,
        models.ScheduledPayment.next_payment_date <= today
    ).all()
    
    for payment in due_payments:
        # Skip if max payments reached
        if payment.max_payments and payment.payments_made >= payment.max_payments:
            payment.is_active = False
            db.commit()
            continue
        
        # Skip if end date passed
        if payment.end_date and payment.end_date < today:
            payment.is_active = False
            db.commit()
            continue
        
        # Process the payment
        try:
            recipient = get_user_by_principal(db, payment.recipient_principal)
            
            if not recipient:
                continue  # Skip if recipient not found
            
            # Check if user has enough balance
            user_balance = get_user_balance(db, payment.user_id)
            if user_balance < payment.amount:
                continue  # Skip if insufficient funds
            
            # Create transaction
            tx = models.Transaction(
                sender_id=payment.user_id,
                recipient_id=recipient.id,
                amount=payment.amount,
                description=f"{payment.description} (Automated payment #{payment.payments_made + 1})",
                status=models.TransactionStatus.COMPLETED
            )
            
            db.add(tx)
            db.commit()
            db.refresh(tx)
            
            # Create association record
            association = models.ScheduledPaymentTransaction(
                scheduled_payment_id=payment.id,
                transaction_id=tx.id
            )
            db.add(association)
            
            # Update balances
            update_user_balance(db, payment.user_id, payment.amount, is_increase=False)
            update_user_balance(db, recipient.id, payment.amount, is_increase=True)
            
            # Update payment record
            payment.payments_made += 1
            payment.last_processed = datetime.utcnow()
            payment.next_payment_date = calculate_next_payment_date(today, payment.frequency)
            
            # Deactivate if it was a one-time payment
            if payment.frequency == models.ScheduledPaymentFrequency.ONCE:
                payment.is_active = False
            
            # Deactivate if max payments reached
            if payment.max_payments and payment.payments_made >= payment.max_payments:
                payment.is_active = False
            
            db.commit()
            
        except Exception as e:
            print(f"Error processing scheduled payment {payment.id}: {str(e)}")
            db.rollback()
    
    return due_payments

# NFT Receipt operations
def create_nft_receipt(db: Session, transaction_id: int, owner_id: int):
    # Check if receipt already exists
    existing = db.query(models.NFTReceipt).filter(
        models.NFTReceipt.transaction_id == transaction_id
    ).first()
    
    if existing:
        return existing
    
    # Generate random image URL for demo
    image_url = f"https://picsum.photos/200/300?random={transaction_id}"
    
    # Get transaction details for metadata
    tx = get_transaction(db, transaction_id)
    if not tx:
        return None
    
    metadata = {
        "amount": tx.amount,
        "timestamp": tx.timestamp.timestamp(),
        "sender": get_user(db, tx.sender_id).principal_id,
        "recipient": get_user(db, tx.recipient_id).principal_id,
        "description": tx.description,
        "category": tx.category,
        "blockHeight": 1000000 + transaction_id,  # Mock blockchain data
        "confirmations": 15 + (transaction_id % 30)  # Mock blockchain data
    }
    
    # Create NFT receipt
    nft_receipt = models.NFTReceipt(
        transaction_id=transaction_id,
        owner_id=owner_id,
        image_url=image_url,
        receipt_metadata=metadata
    )
    
    db.add(nft_receipt)
    db.commit()
    db.refresh(nft_receipt)
    return nft_receipt

def get_user_nft_receipts(db: Session, user_id: int):
    return db.query(models.NFTReceipt).filter(
        models.NFTReceipt.owner_id == user_id
    ).all()

def get_nft_receipt(db: Session, receipt_id: int):
    return db.query(models.NFTReceipt).filter(
        models.NFTReceipt.id == receipt_id
    ).first()

def get_nft_receipt_by_transaction(db: Session, transaction_id: int):
    return db.query(models.NFTReceipt).filter(
        models.NFTReceipt.transaction_id == transaction_id
    ).first()

# Analytics and Reporting
def generate_transaction_report(db: Session, user_id: int, start_date: Optional[datetime] = None, end_date: Optional[datetime] = None):
    if not start_date:
        start_date = datetime.utcnow() - timedelta(days=30)
    if not end_date:
        end_date = datetime.utcnow()
    
    # Get transactions in date range
    transactions = db.query(models.Transaction).filter(
        and_(
            (models.Transaction.sender_id == user_id) | (models.Transaction.recipient_id == user_id),
            models.Transaction.timestamp >= start_date,
            models.Transaction.timestamp <= end_date
        )
    ).all()
    
    # Calculate summary statistics
    total_sent = 0
    total_received = 0
    transaction_count = len(transactions)
    largest_transaction = 0
    recipient_counts = defaultdict(int)
    
    for tx in transactions:
        if tx.sender_id == user_id:
            total_sent += tx.amount
            recipient_counts[tx.recipient_id] += 1
        else:
            total_received += tx.amount
        
        largest_transaction = max(largest_transaction, tx.amount)
    
    # Calculate average transaction size
    avg_transaction_size = 0
    if transaction_count > 0:
        avg_transaction_size = (total_sent + total_received) / transaction_count
    
    # Find most frequent recipient
    most_frequent_recipient = None
    if recipient_counts:
        most_frequent_recipient_id = max(recipient_counts.items(), key=lambda x: x[1])[0]
        recipient = get_user(db, most_frequent_recipient_id)
        most_frequent_recipient = recipient.principal_id if recipient else None
    
    return {
        "total_sent": total_sent,
        "total_received": total_received,
        "transaction_count": transaction_count,
        "net_flow": total_received - total_sent,
        "start_date": start_date,
        "end_date": end_date,
        "average_transaction_size": avg_transaction_size,
        "largest_transaction": largest_transaction,
        "most_frequent_recipient": most_frequent_recipient
    }

def get_spending_by_category(db: Session, user_id: int, start_date: Optional[datetime] = None, end_date: Optional[datetime] = None):
    if not start_date:
        start_date = datetime.utcnow() - timedelta(days=30)
    if not end_date:
        end_date = datetime.utcnow()
    
    # Get sent transactions in date range
    transactions = db.query(models.Transaction).filter(
        and_(
            models.Transaction.sender_id == user_id,
            models.Transaction.timestamp >= start_date,
            models.Transaction.timestamp <= end_date
        )
    ).all()
    
    # Calculate spending by category
    category_spending = defaultdict(float)
    total_spending = 0
    
    for tx in transactions:
        category = tx.category or "Uncategorized"
        category_spending[category] += tx.amount
        total_spending += tx.amount
    
    # Format results
    categories = []
    for category, amount in category_spending.items():
        percentage = 0
        if total_spending > 0:
            percentage = (amount / total_spending) * 100
        
        categories.append({
            "category": category,
            "amount": amount,
            "percentage": percentage
        })
    
    # Sort by amount descending
    categories.sort(key=lambda x: x["amount"], reverse=True)
    
    return {
        "total_spending": total_spending,
        "categories": categories,
        "period": "custom",
        "start_date": start_date,
        "end_date": end_date
    } 