from setup_database import SessionLocal, User, Transaction, Tag, TransactionStatus, PaymentTemplate, TemplateCondition, TemplateConditionType, TemplateConditionOperator, ScheduledPayment, ScheduledPaymentFrequency, NFTReceipt
from sqlalchemy.orm import Session
import bcrypt
from datetime import date, datetime, timedelta
import json

def get_password_hash(password):
    # Hash and salt the password using bcrypt
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    return hashed_password.decode('utf-8')

def seed_data():
    db = SessionLocal()
    try:
        # Check if we already have users
        user_count = db.query(User).count()
        if user_count > 0:
            print("Database already has data, skipping seeding...")
            return
        
        # Create sample users
        users = [
            {
                "email": "alice@example.com",
                "principal_id": "user-alice-123456",
                "password": "password123"
            },
            {
                "email": "bob@example.com",
                "principal_id": "user-bob-789012",
                "password": "password123"
            },
            {
                "email": "charlie@example.com",
                "principal_id": "user-charlie-345678",
                "password": "password123"
            },
            {
                "email": "admin@admin.com",
                "principal_id": "user-admin-999999",
                "password": "adminpass"
            }
        ]
        
        created_users = []
        for user_data in users:
            user = User(
                email=user_data["email"],
                principal_id=user_data["principal_id"],
                hashed_password=get_password_hash(user_data["password"]),
                balance=1000.0  # Start with 1000 balance
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            created_users.append(user)
            print(f"Created user: {user.email} with principal: {user.principal_id}")
        
        # Create some sample transactions
        transactions = [
            {
                "sender_id": created_users[0].id,
                "recipient_id": created_users[1].id,
                "amount": 50.0,
                "description": "Lunch payment",
                "status": TransactionStatus.COMPLETED,
            },
            {
                "sender_id": created_users[1].id,
                "recipient_id": created_users[0].id,
                "amount": 25.0,
                "description": "Movie tickets",
                "status": TransactionStatus.COMPLETED,
            },
            {
                "sender_id": created_users[0].id,
                "recipient_id": created_users[2].id,
                "amount": 100.0,
                "description": "Rent share",
                "status": TransactionStatus.COMPLETED,
            }
        ]
        
        for tx_data in transactions:
            tx = Transaction(**tx_data)
            db.add(tx)
            db.commit()
            db.refresh(tx)
            print(f"Created transaction: {tx.id} amount: {tx.amount} {tx.description}")
            
            # Generate NFT receipt for each transaction
            receipt_metadata = {
                "amount": tx.amount,
                "timestamp": tx.timestamp.timestamp(),
                "sender": created_users[0].principal_id,
                "recipient": created_users[1].principal_id,
                "description": tx.description,
                "blockHeight": 1000000 + tx.id,
                "confirmations": 15 + (tx.id % 30)
            }
            
            receipt = NFTReceipt(
                transaction_id=tx.id,
                owner_id=tx.recipient_id,
                image_url=f"https://picsum.photos/200/300?random={tx.id}",
                receipt_metadata=receipt_metadata
            )
            db.add(receipt)
            db.commit()
            print(f"Created NFT receipt for transaction {tx.id}")
        
        # Create sample payment templates
        templates = [
            {
                "owner_id": created_users[0].id,
                "name": "Monthly Rent",
                "description": "Pay landlord on the 1st",
                "recipient_principal": created_users[2].principal_id,
                "amount": 500.0,
                "is_active": True,
            },
            {
                "owner_id": created_users[1].id,
                "name": "Coffee Subscription",
                "description": "Weekly coffee delivery",
                "recipient_principal": created_users[0].principal_id,
                "amount": 15.0,
                "is_active": True,
            }
        ]
        
        for template_data in templates:
            template = PaymentTemplate(**template_data)
            db.add(template)
            db.commit()
            db.refresh(template)
            
            # Add a condition to the template
            condition = TemplateCondition(
                template_id=template.id,
                condition_type=TemplateConditionType.TIME,
                operator=TemplateConditionOperator.EQUALS,
                value="9"  # 9 AM
            )
            db.add(condition)
            db.commit()
            print(f"Created template: {template.name} with amount: {template.amount}")
            
        # Create sample scheduled payments
        today = date.today()
        scheduled_payments = [
            {
                "user_id": created_users[0].id,
                "recipient_principal": created_users[1].principal_id,
                "amount": 20.0,
                "description": "Weekly lunch",
                "start_date": today,
                "frequency": ScheduledPaymentFrequency.WEEKLY,
                "is_active": True,
                "next_payment_date": today + timedelta(days=7)
            },
            {
                "user_id": created_users[1].id,
                "recipient_principal": created_users[2].principal_id,
                "amount": 50.0,
                "description": "Monthly subscription",
                "start_date": today,
                "frequency": ScheduledPaymentFrequency.MONTHLY,
                "is_active": True,
                "next_payment_date": today + timedelta(days=30)
            }
        ]
        
        for payment_data in scheduled_payments:
            payment = ScheduledPayment(**payment_data)
            db.add(payment)
            db.commit()
            db.refresh(payment)
            print(f"Created scheduled payment: {payment.amount} {payment.description} frequency: {payment.frequency}")
        
        print("Database seeded successfully!")
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("Seeding database with sample data...")
    seed_data()
    print("Seeding completed.") 