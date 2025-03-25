from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float, DateTime, Text, Enum, Date, JSON, Table
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum

from app.database import Base

# Many-to-many relationship for transactions and tags
transaction_tags = Table(
    'transaction_tags',
    Base.metadata,
    Column('transaction_id', Integer, ForeignKey('transactions.id')),
    Column('tag_id', Integer, ForeignKey('tags.id'))
)

class TransactionStatus(str, enum.Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    principal_id = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    balance = Column(Float, default=1000.0)  # Initial balance for demo
    
    # User profile information
    full_name = Column(String, nullable=True)
    profile_image = Column(String, nullable=True)
    notification_preferences = Column(JSON, nullable=True)

    transactions_sent = relationship("Transaction", foreign_keys="Transaction.sender_id", back_populates="sender")
    transactions_received = relationship("Transaction", foreign_keys="Transaction.recipient_id", back_populates="recipient")
    templates = relationship("PaymentTemplate", back_populates="owner")
    scheduled_payments = relationship("ScheduledPayment", back_populates="user")
    nft_receipts = relationship("NFTReceipt", back_populates="owner")

class Tag(Base):
    __tablename__ = "tags"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    
    transactions = relationship("Transaction", secondary=transaction_tags, back_populates="tags")

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id"))
    recipient_id = Column(Integer, ForeignKey("users.id"))
    amount = Column(Float)
    description = Column(Text, nullable=True)
    status = Column(Enum(TransactionStatus), default=TransactionStatus.PENDING)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # For additional categorization
    category = Column(String, nullable=True)
    
    # For metadata or additional info
    transaction_metadata = Column(Text, nullable=True)
    
    # Relationships
    sender = relationship("User", foreign_keys=[sender_id], back_populates="transactions_sent")
    recipient = relationship("User", foreign_keys=[recipient_id], back_populates="transactions_received")
    tags = relationship("Tag", secondary=transaction_tags, back_populates="transactions")
    nft_receipt = relationship("NFTReceipt", back_populates="transaction", uselist=False)

class TemplateConditionType(str, enum.Enum):
    AMOUNT = "amount"
    FREQUENCY = "frequency"
    TIME = "time"
    CATEGORY = "category"
    TAG = "tag"
    METADATA = "metadata"

class TemplateConditionOperator(str, enum.Enum):
    EQUALS = "equals"
    GREATER_THAN = "greater_than"
    LESS_THAN = "less_than"
    CONTAINS = "contains"

class PaymentTemplate(Base):
    __tablename__ = "payment_templates"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String)
    description = Column(Text, nullable=True)
    recipient_principal = Column(String)
    amount = Column(Float, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    owner = relationship("User", back_populates="templates")
    conditions = relationship("TemplateCondition", back_populates="template", cascade="all, delete-orphan")

class TemplateCondition(Base):
    __tablename__ = "template_conditions"

    id = Column(Integer, primary_key=True, index=True)
    template_id = Column(Integer, ForeignKey("payment_templates.id"))
    condition_type = Column(Enum(TemplateConditionType))
    operator = Column(Enum(TemplateConditionOperator))
    value = Column(String)
    
    template = relationship("PaymentTemplate", back_populates="conditions")

class ScheduledPaymentFrequency(str, enum.Enum):
    ONCE = "once"
    DAILY = "daily"
    WEEKLY = "weekly"
    BIWEEKLY = "biweekly"
    MONTHLY = "monthly"
    QUARTERLY = "quarterly"
    YEARLY = "yearly"

class ScheduledPayment(Base):
    __tablename__ = "scheduled_payments"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    recipient_principal = Column(String)
    amount = Column(Float)
    description = Column(Text, nullable=True)
    
    # Scheduling details
    start_date = Column(Date, nullable=False)
    frequency = Column(Enum(ScheduledPaymentFrequency), nullable=False)
    end_date = Column(Date, nullable=True)
    max_payments = Column(Integer, nullable=True)
    is_active = Column(Boolean, default=True)
    
    # Tracking
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_processed = Column(DateTime(timezone=True), nullable=True)
    next_payment_date = Column(Date, nullable=True)
    payments_made = Column(Integer, default=0)
    
    # Relationships
    user = relationship("User", back_populates="scheduled_payments")
    transactions = relationship("Transaction", secondary="scheduled_payment_transactions")

# Association table for scheduled payments and transactions
class ScheduledPaymentTransaction(Base):
    __tablename__ = "scheduled_payment_transactions"
    
    scheduled_payment_id = Column(Integer, ForeignKey("scheduled_payments.id"), primary_key=True)
    transaction_id = Column(Integer, ForeignKey("transactions.id"), primary_key=True)
    processed_at = Column(DateTime(timezone=True), server_default=func.now())

class NFTReceipt(Base):
    __tablename__ = "nft_receipts"
    
    id = Column(Integer, primary_key=True, index=True)
    transaction_id = Column(Integer, ForeignKey("transactions.id"), unique=True)
    owner_id = Column(Integer, ForeignKey("users.id"))
    image_url = Column(String)
    receipt_metadata = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    transaction = relationship("Transaction", back_populates="nft_receipt")
    owner = relationship("User", back_populates="nft_receipts") 