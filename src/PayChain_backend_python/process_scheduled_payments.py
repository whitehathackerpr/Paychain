import os
import sys
from datetime import date
import logging
from dotenv import load_dotenv

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("scheduled_payments.log"),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger("scheduled_payments")

# Load environment variables
load_dotenv()

from app import crud
from app.database import SessionLocal

def process_payments():
    """Process all scheduled payments that are due today"""
    logger.info("Starting scheduled payment processing...")
    
    db = SessionLocal()
    try:
        today = date.today()
        logger.info(f"Processing payments due on or before {today}")
        
        # Process all payments due today or earlier
        processed_payments = crud.process_scheduled_payments(db, today)
        
        logger.info(f"Processed {len(processed_payments)} payments")
        
        # Log details about processed payments
        for payment in processed_payments:
            logger.info(f"Payment ID: {payment.id}, User ID: {payment.user_id}, Amount: {payment.amount}, Recipient: {payment.recipient_principal}")
            
        return len(processed_payments)
    except Exception as e:
        logger.error(f"Error processing scheduled payments: {str(e)}")
        db.rollback()
        return 0
    finally:
        db.close()

if __name__ == "__main__":
    count = process_payments()
    sys.exit(0 if count >= 0 else 1) 