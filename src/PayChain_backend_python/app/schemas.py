from pydantic import BaseModel, EmailStr, Field, validator
from typing import List, Optional, Dict, Any, Union
from datetime import datetime, date
import json
from enum import Enum

from app.models import TransactionStatus, TemplateConditionType, TemplateConditionOperator

# User schemas
class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str
    principal_id: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    full_name: Optional[str] = None
    profile_image: Optional[str] = None
    notification_preferences: Optional[Dict[str, bool]] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(UserBase):
    id: int
    principal_id: str
    is_active: bool
    created_at: datetime
    balance: float
    full_name: Optional[str] = None
    profile_image: Optional[str] = None

    class Config:
        orm_mode = True

# Token schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# Transaction schemas
class TransactionBase(BaseModel):
    recipient_principal: str
    amount: float
    description: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

    @validator('metadata', pre=True)
    def parse_metadata(cls, v):
        if isinstance(v, str):
            try:
                return json.loads(v)
            except json.JSONDecodeError:
                return {}
        return v or {}

class TransactionCreate(TransactionBase):
    category: Optional[str] = None
    tags: Optional[List[str]] = None

class Transaction(TransactionBase):
    id: int
    sender_id: int
    recipient_id: int
    status: TransactionStatus
    timestamp: datetime
    updated_at: Optional[datetime] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    
    # Override recipient_principal for response
    recipient_principal: Optional[str] = None
    
    # Add sender_principal for response
    sender_principal: Optional[str] = None

    class Config:
        orm_mode = True
        fields = {'transaction_metadata': 'metadata'}

# Template condition schemas
class TemplateConditionBase(BaseModel):
    condition_type: TemplateConditionType
    operator: TemplateConditionOperator
    value: str

class TemplateConditionCreate(TemplateConditionBase):
    pass

class TemplateConditionUpdate(BaseModel):
    condition_type: Optional[TemplateConditionType] = None
    operator: Optional[TemplateConditionOperator] = None
    value: Optional[str] = None

class TemplateCondition(TemplateConditionBase):
    id: int
    template_id: int

    class Config:
        orm_mode = True

# Payment template schemas
class PaymentTemplateBase(BaseModel):
    name: str
    description: Optional[str] = None
    recipient_principal: str
    amount: Optional[float] = None
    is_active: bool = True

class PaymentTemplateCreate(PaymentTemplateBase):
    conditions: List[TemplateConditionCreate] = []

class PaymentTemplateUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    recipient_principal: Optional[str] = None
    amount: Optional[float] = None
    is_active: Optional[bool] = None
    conditions: Optional[List[TemplateConditionCreate]] = None

class PaymentTemplate(PaymentTemplateBase):
    id: int
    owner_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    conditions: List[TemplateCondition] = []

    class Config:
        orm_mode = True

# Scheduled payment frequency
class ScheduledPaymentFrequency(str, Enum):
    ONCE = "once"
    DAILY = "daily"
    WEEKLY = "weekly"
    BIWEEKLY = "biweekly"
    MONTHLY = "monthly"
    QUARTERLY = "quarterly"
    YEARLY = "yearly"

# Scheduled payment schemas
class ScheduledPaymentBase(BaseModel):
    recipient_principal: str
    amount: float
    description: Optional[str] = None
    start_date: date
    frequency: ScheduledPaymentFrequency
    end_date: Optional[date] = None
    max_payments: Optional[int] = None
    is_active: bool = True

class ScheduledPaymentCreate(ScheduledPaymentBase):
    pass

class ScheduledPaymentUpdate(BaseModel):
    recipient_principal: Optional[str] = None
    amount: Optional[float] = None
    description: Optional[str] = None
    start_date: Optional[date] = None
    frequency: Optional[ScheduledPaymentFrequency] = None
    end_date: Optional[date] = None
    max_payments: Optional[int] = None
    is_active: Optional[bool] = None

class ScheduledPayment(ScheduledPaymentBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    last_processed: Optional[datetime] = None
    next_payment_date: Optional[date] = None
    payments_made: int = 0

    class Config:
        orm_mode = True

# NFT Receipt schemas
class NFTReceiptBase(BaseModel):
    transaction_id: int
    image_url: str
    metadata: Dict[str, Any]

class NFTReceiptCreate(NFTReceiptBase):
    pass

class NFTReceipt(NFTReceiptBase):
    id: int
    owner_id: int
    created_at: datetime

    class Config:
        orm_mode = True
        
        # Configure field mappings for SQLAlchemy model to Pydantic schema
        fields = {'receipt_metadata': 'metadata'}

# Report schemas
class TransactionSummary(BaseModel):
    total_sent: float
    total_received: float
    transaction_count: int
    net_flow: float
    start_date: datetime
    end_date: datetime
    average_transaction_size: float
    largest_transaction: float
    most_frequent_recipient: Optional[str] = None

class CategorySpending(BaseModel):
    category: str
    amount: float
    percentage: float  # Percentage of total spending

class SpendingByCategory(BaseModel):
    total_spending: float
    categories: List[CategorySpending]
    period: str
    start_date: datetime
    end_date: datetime 