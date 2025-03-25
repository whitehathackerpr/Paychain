import os
import sys
from sqlalchemy.orm import Session

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import models, schemas, crud
from app.database import engine, SessionLocal
from app.auth import get_password_hash

# Create database tables
models.Base.metadata.create_all(bind=engine)

def init_db():
    db = SessionLocal()
    try:
        # Check if we already have users
        user_count = db.query(models.User).count()
        if user_count > 0:
            print("Database already initialized, skipping...")
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
            }
        ]
        
        created_users = []
        for user_data in users:
            user = models.User(
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
                "status": models.TransactionStatus.COMPLETED,
            },
            {
                "sender_id": created_users[1].id,
                "recipient_id": created_users[0].id,
                "amount": 25.0,
                "description": "Movie tickets",
                "status": models.TransactionStatus.COMPLETED,
            },
            {
                "sender_id": created_users[0].id,
                "recipient_id": created_users[2].id,
                "amount": 100.0,
                "description": "Rent share",
                "status": models.TransactionStatus.COMPLETED,
            }
        ]
        
        for tx_data in transactions:
            tx = models.Transaction(**tx_data)
            db.add(tx)
            db.commit()
            db.refresh(tx)
            print(f"Created transaction: {tx.id} amount: {tx.amount} {tx.description}")
        
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
            template = models.PaymentTemplate(**template_data)
            db.add(template)
            db.commit()
            db.refresh(template)
            
            # Add a condition to the template
            condition = models.TemplateCondition(
                template_id=template.id,
                condition_type=models.TemplateConditionType.TIME,
                operator=models.TemplateConditionOperator.EQUALS,
                value="9"  # 9 AM
            )
            db.add(condition)
            db.commit()
            print(f"Created template: {template.name} with amount: {template.amount}")
        
        print("Database initialized successfully!")
    except Exception as e:
        print(f"Error initializing database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    print("Initializing database...")
    init_db() 