from flask import Flask, jsonify
from sqlalchemy.orm import Session
from setup_database import SessionLocal, User, Transaction, NFTReceipt, ScheduledPayment

app = Flask(__name__)

def get_db():
    db = SessionLocal()
    try:
        return db
    finally:
        db.close()

@app.route('/')
def read_root():
    return jsonify({"message": "Welcome to PayChain API"})

@app.route('/health')
def health_check():
    return jsonify({"status": "healthy"})

@app.route('/users')
def get_users():
    db = get_db()
    users = db.query(User).all()
    return jsonify([
        {
            "id": user.id,
            "email": user.email,
            "principal_id": user.principal_id,
            "balance": user.balance
        }
        for user in users
    ])

@app.route('/transactions')
def get_transactions():
    db = get_db()
    transactions = db.query(Transaction).all()
    return jsonify([
        {
            "id": tx.id,
            "sender_id": tx.sender_id,
            "recipient_id": tx.recipient_id,
            "amount": tx.amount,
            "description": tx.description,
            "status": tx.status,
            "timestamp": str(tx.timestamp)
        }
        for tx in transactions
    ])

@app.route('/nft-receipts')
def get_nft_receipts():
    db = get_db()
    receipts = db.query(NFTReceipt).all()
    return jsonify([
        {
            "id": receipt.id,
            "transaction_id": receipt.transaction_id,
            "owner_id": receipt.owner_id,
            "image_url": receipt.image_url,
            "receipt_metadata": receipt.receipt_metadata,
            "created_at": str(receipt.created_at)
        }
        for receipt in receipts
    ])

@app.route('/scheduled-payments')
def get_scheduled_payments():
    db = get_db()
    payments = db.query(ScheduledPayment).all()
    return jsonify([
        {
            "id": payment.id,
            "user_id": payment.user_id,
            "recipient_principal": payment.recipient_principal,
            "amount": payment.amount,
            "description": payment.description,
            "frequency": payment.frequency,
            "start_date": str(payment.start_date),
            "next_payment_date": str(payment.next_payment_date),
            "is_active": payment.is_active
        }
        for payment in payments
    ])

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=8000) 