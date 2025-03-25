# PayChain API Documentation

This document provides detailed information about the PayChain API endpoints, request/response formats, and authentication.

## Base URL

All API endpoints are relative to:

```
http://localhost:8000
```

## Authentication

The API uses JSON Web Token (JWT) authentication. To access protected endpoints, you must include a valid token in the Authorization header:

```
Authorization: Bearer <your_access_token>
```

### Getting a Token

**Endpoint:** `POST /login/`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "your_password"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

## User Management

### Register New User

**Endpoint:** `POST /users/`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "your_password",
  "principal_id": "user-unique-id"
}
```

**Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "principal_id": "user-unique-id",
  "is_active": true,
  "created_at": "2025-03-25T01:25:38",
  "balance": 1000.0
}
```

### Get Current User

**Endpoint:** `GET /users/me/`

**Authentication:** Required

**Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "principal_id": "user-unique-id",
  "is_active": true,
  "created_at": "2025-03-25T01:25:38",
  "balance": 1000.0,
  "full_name": null,
  "profile_image": null
}
```

### Update User Profile

**Endpoint:** `PUT /users/me/`

**Authentication:** Required

**Request Body:**
```json
{
  "email": "updated@example.com",
  "full_name": "John Doe",
  "profile_image": "https://example.com/profile.jpg",
  "notification_preferences": {
    "email_notifications": true,
    "push_notifications": false
  }
}
```

**Response:**
```json
{
  "id": 1,
  "email": "updated@example.com",
  "principal_id": "user-unique-id",
  "is_active": true,
  "created_at": "2025-03-25T01:25:38",
  "balance": 1000.0,
  "full_name": "John Doe",
  "profile_image": "https://example.com/profile.jpg",
  "notification_preferences": {
    "email_notifications": true,
    "push_notifications": false
  }
}
```

## Transaction Management

### Create Transaction

**Endpoint:** `POST /transactions/`

**Authentication:** Required

**Request Body:**
```json
{
  "recipient_principal": "user-bob-789012",
  "amount": 50.0,
  "description": "Payment for lunch",
  "category": "Food",
  "tags": ["lunch", "friends"],
  "metadata": {
    "location": "New York",
    "notes": "Great pizza place"
  }
}
```

**Response:**
```json
{
  "id": 4,
  "sender_id": 1,
  "recipient_id": 2,
  "amount": 50.0,
  "description": "Payment for lunch",
  "status": "completed",
  "timestamp": "2025-03-25T01:45:38",
  "category": "Food",
  "tags": ["lunch", "friends"],
  "metadata": {
    "location": "New York",
    "notes": "Great pizza place"
  },
  "sender_principal": "user-alice-123456",
  "recipient_principal": "user-bob-789012"
}
```

### List User Transactions

**Endpoint:** `GET /transactions/`

**Authentication:** Required

**Query Parameters:**
- `skip` (optional): Number of records to skip (default: 0)
- `limit` (optional): Maximum number of records to return (default: 100)
- `start_date` (optional): Filter by start date (ISO format)
- `end_date` (optional): Filter by end date (ISO format)

**Response:**
```json
[
  {
    "id": 1,
    "sender_id": 1,
    "recipient_id": 2,
    "amount": 50.0,
    "description": "Lunch payment",
    "status": "completed",
    "timestamp": "2025-03-25T01:25:38",
    "category": null,
    "tags": [],
    "metadata": {},
    "sender_principal": "user-alice-123456",
    "recipient_principal": "user-bob-789012"
  },
  {
    "id": 2,
    "sender_id": 2,
    "recipient_id": 1,
    "amount": 25.0,
    "description": "Movie tickets",
    "status": "completed",
    "timestamp": "2025-03-25T01:25:38",
    "category": null,
    "tags": [],
    "metadata": {},
    "sender_principal": "user-bob-789012",
    "recipient_principal": "user-alice-123456"
  }
]
```

### Get Transaction Details

**Endpoint:** `GET /transactions/{transaction_id}`

**Authentication:** Required

**Response:**
```json
{
  "id": 1,
  "sender_id": 1,
  "recipient_id": 2,
  "amount": 50.0,
  "description": "Lunch payment",
  "status": "completed",
  "timestamp": "2025-03-25T01:25:38",
  "category": null,
  "tags": [],
  "metadata": {},
  "sender_principal": "user-alice-123456",
  "recipient_principal": "user-bob-789012"
}
```

## Scheduled Payments

### Create Scheduled Payment

**Endpoint:** `POST /scheduled-payments/`

**Authentication:** Required

**Request Body:**
```json
{
  "recipient_principal": "user-bob-789012",
  "amount": 100.0,
  "description": "Monthly rent",
  "start_date": "2025-04-01",
  "frequency": "monthly",
  "end_date": "2025-12-31",
  "max_payments": 12,
  "is_active": true
}
```

**Response:**
```json
{
  "id": 3,
  "user_id": 1,
  "recipient_principal": "user-bob-789012",
  "amount": 100.0,
  "description": "Monthly rent",
  "start_date": "2025-04-01",
  "frequency": "monthly",
  "end_date": "2025-12-31",
  "max_payments": 12,
  "is_active": true,
  "created_at": "2025-03-25T01:55:38",
  "updated_at": "2025-03-25T01:55:38",
  "last_processed": null,
  "next_payment_date": "2025-04-01",
  "payments_made": 0
}
```

### List Scheduled Payments

**Endpoint:** `GET /scheduled-payments/`

**Authentication:** Required

**Response:**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "recipient_principal": "user-bob-789012",
    "amount": 20.0,
    "description": "Weekly lunch",
    "start_date": "2025-03-25",
    "frequency": "weekly",
    "end_date": null,
    "max_payments": null,
    "is_active": true,
    "next_payment_date": "2025-04-01",
    "payments_made": 0
  }
]
```

### Delete Scheduled Payment

**Endpoint:** `DELETE /scheduled-payments/{payment_id}`

**Authentication:** Required

**Response:**
```json
{
  "detail": "Scheduled payment deleted successfully"
}
```

## NFT Receipts

### List NFT Receipts

**Endpoint:** `GET /nft-receipts/`

**Authentication:** Required

**Response:**
```json
[
  {
    "id": 1,
    "transaction_id": 1,
    "owner_id": 2,
    "image_url": "https://picsum.photos/200/300?random=1",
    "metadata": {
      "amount": 50.0,
      "timestamp": 1742855138.0,
      "sender": "user-alice-123456",
      "recipient": "user-bob-789012",
      "description": "Lunch payment",
      "blockHeight": 1000001,
      "confirmations": 16
    },
    "created_at": "2025-03-25T01:25:38"
  }
]
```

### Get NFT Receipt

**Endpoint:** `GET /nft-receipts/{receipt_id}`

**Authentication:** Required

**Response:**
```json
{
  "id": 1,
  "transaction_id": 1,
  "owner_id": 2,
  "image_url": "https://picsum.photos/200/300?random=1",
  "metadata": {
    "amount": 50.0,
    "timestamp": 1742855138.0,
    "sender": "user-alice-123456",
    "recipient": "user-bob-789012",
    "description": "Lunch payment",
    "blockHeight": 1000001,
    "confirmations": 16
  },
  "created_at": "2025-03-25T01:25:38"
}
```

### Generate NFT for Transaction

**Endpoint:** `POST /transactions/{transaction_id}/generate-nft`

**Authentication:** Required

**Response:**
```json
{
  "id": 4,
  "transaction_id": 3,
  "owner_id": 2,
  "image_url": "https://picsum.photos/200/300?random=3",
  "metadata": {
    "amount": 100.0,
    "timestamp": 1742855138.0,
    "sender": "user-alice-123456",
    "recipient": "user-charlie-345678",
    "description": "Rent share",
    "blockHeight": 1000003,
    "confirmations": 18
  },
  "created_at": "2025-03-25T01:58:38"
}
```

## Analytics and Reporting

### Transaction Summary

**Endpoint:** `GET /reports/transaction-summary/`

**Authentication:** Required

**Query Parameters:**
- `period` (optional): Time period - "week", "month", or "year" (default: "month")

**Response:**
```json
{
  "total_sent": 150.0,
  "total_received": 25.0,
  "transaction_count": 3,
  "net_flow": -125.0,
  "start_date": "2025-02-25T01:25:38",
  "end_date": "2025-03-25T01:25:38",
  "average_transaction_size": 58.33,
  "largest_transaction": 100.0,
  "most_frequent_recipient": "user-bob-789012"
}
```

### Spending by Category

**Endpoint:** `GET /reports/spending-categories/`

**Authentication:** Required

**Query Parameters:**
- `period` (optional): Time period - "week", "month", or "year" (default: "month")

**Response:**
```json
{
  "total_spending": 150.0,
  "categories": [
    {
      "category": "Food",
      "amount": 50.0,
      "percentage": 33.33
    },
    {
      "category": "Housing",
      "amount": 100.0,
      "percentage": 66.67
    }
  ],
  "period": "month",
  "start_date": "2025-02-25T01:25:38",
  "end_date": "2025-03-25T01:25:38"
}
```

## System Endpoints

### Health Check

**Endpoint:** `GET /health`

**Response:**
```json
{
  "status": "healthy"
}
```

## Admin Endpoints

### Process Scheduled Payments

**Endpoint:** `POST /admin/process-scheduled-payments`

**Authentication:** Required (admin only)

**Response:**
```json
{
  "message": "Scheduled payments processing triggered"
}
```

## Error Responses

The API uses standard HTTP status codes to indicate the success or failure of a request:

- `200 OK`: The request was successful
- `201 Created`: The resource was successfully created
- `400 Bad Request`: The request was malformed or invalid
- `401 Unauthorized`: Authentication is required or failed
- `403 Forbidden`: The authenticated user does not have permission
- `404 Not Found`: The requested resource was not found
- `500 Internal Server Error`: An error occurred on the server

Error responses will include a JSON body with details:

```json
{
  "detail": "Error message describing what went wrong"
}
``` 