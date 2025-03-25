# Scheduled Payments Guide

This guide provides detailed information about the Scheduled Payments feature in the PayChain application.

## Overview

Scheduled Payments allow users to set up automated, recurring payments to other users. This feature is useful for:

- Rent payments
- Subscription services
- Regular bills
- Allowances
- Any payment that needs to happen on a regular schedule

## How It Works

1. **Creating a Scheduled Payment**: Users define a recipient, amount, frequency, and start date
2. **Payment Processing**: The system automatically processes due payments according to the schedule
3. **Tracking**: All scheduled payments are tracked with payment history and statistics

## Payment Frequencies

The following payment frequencies are supported:

- **Once**: One-time future payment
- **Daily**: Every day
- **Weekly**: Every 7 days
- **Biweekly**: Every 14 days
- **Monthly**: Same day each month
- **Quarterly**: Every 3 months
- **Yearly**: Same day and month each year

## Creating a Scheduled Payment

To create a scheduled payment, make a POST request to `/scheduled-payments/` with the following data:

```json
{
  "recipient_principal": "user-recipient-id",
  "amount": 100.0,
  "description": "Monthly rent",
  "start_date": "2025-04-01",
  "frequency": "monthly",
  "end_date": "2025-12-31",
  "max_payments": 9,
  "is_active": true
}
```

### Required Fields

- `recipient_principal`: The unique ID of the recipient
- `amount`: Payment amount
- `start_date`: Date of the first payment (ISO format)
- `frequency`: Payment frequency (one of the supported frequencies)

### Optional Fields

- `description`: Description of the payment
- `end_date`: Date after which payments should stop (ISO format)
- `max_payments`: Maximum number of payments to make
- `is_active`: Whether the scheduled payment is active (default: true)

## Managing Scheduled Payments

### Listing Scheduled Payments

To view all your scheduled payments, make a GET request to `/scheduled-payments/`.

### Deactivating a Scheduled Payment

To temporarily pause a scheduled payment, update the `is_active` field to `false` by making a PUT request to `/scheduled-payments/{payment_id}`:

```json
{
  "is_active": false
}
```

### Deleting a Scheduled Payment

To permanently delete a scheduled payment, make a DELETE request to `/scheduled-payments/{payment_id}`.

## Payment Processing

Scheduled payments are processed in two ways:

1. **Automatic Processing**: A background task runs daily to process all due payments
2. **Manual Processing**: Administrators can trigger processing via the admin API endpoint

### Processing Rules

- A payment is processed if its `next_payment_date` is today or earlier
- After processing, the `next_payment_date` is updated based on the frequency
- If `max_payments` is reached, the scheduled payment is deactivated
- If `end_date` is reached, the scheduled payment is deactivated
- One-time payments are deactivated after processing

## Payment Transactions

When a scheduled payment is processed, it creates a normal transaction with:

- The same amount as specified in the scheduled payment
- A description that includes the scheduled payment description and payment number
- The status set to "completed"

## Best Practices

1. **Set End Conditions**: Always set either an end date or a maximum number of payments
2. **Description**: Include clear descriptions to help track the purpose of each payment
3. **Balance**: Ensure sufficient balance for scheduled payments to avoid failures
4. **Review Regularly**: Periodically review active scheduled payments

## Scheduled Payment Lifecycle

1. **Creation**: User creates scheduled payment with start date and frequency
2. **Pending**: Payment awaits its first due date
3. **Active**: Regular payments are made according to the schedule
4. **Completed**: Payment reaches its end date or maximum number of payments
5. **Deactivated**: User manually deactivates the payment

## API Endpoints

- `POST /scheduled-payments/`: Create a new scheduled payment
- `GET /scheduled-payments/`: List all scheduled payments
- `GET /scheduled-payments/{payment_id}`: Get details of a specific scheduled payment
- `PUT /scheduled-payments/{payment_id}`: Update a scheduled payment
- `DELETE /scheduled-payments/{payment_id}`: Delete a scheduled payment
- `POST /admin/process-scheduled-payments`: Trigger payment processing (admin only)

## Example Scenarios

### Monthly Rent Payment

```json
{
  "recipient_principal": "user-landlord-id",
  "amount": 1200.0,
  "description": "Monthly apartment rent",
  "start_date": "2025-04-01",
  "frequency": "monthly",
  "is_active": true
}
```

### Weekly Allowance

```json
{
  "recipient_principal": "user-child-id",
  "amount": 25.0,
  "description": "Weekly allowance",
  "start_date": "2025-03-29",
  "frequency": "weekly",
  "is_active": true
}
```

### Annual Subscription

```json
{
  "recipient_principal": "user-service-id",
  "amount": 99.0,
  "description": "Annual software subscription",
  "start_date": "2025-04-15",
  "frequency": "yearly",
  "is_active": true
}
```

## Troubleshooting

### Payment Not Processed

If a scheduled payment wasn't processed as expected:

1. Check if the scheduled payment is active (`is_active` is true)
2. Verify the `next_payment_date` is today or earlier
3. Ensure the sender has sufficient balance
4. Check if `max_payments` has been reached
5. Verify the `end_date` hasn't passed

### Incorrect Next Payment Date

If the next payment date doesn't seem correct:

1. Check the frequency setting
2. Verify the last processed date
3. For monthly or longer frequencies, check for correct month-end handling

## Technical Implementation

The system uses a daily scheduler to process all due payments:

1. Finds all active scheduled payments with `next_payment_date` today or earlier
2. For each due payment:
   - Creates a transaction from sender to recipient
   - Updates the payment record with new `next_payment_date`
   - Increments the `payments_made` counter
   - Sets `last_processed` to the current timestamp
   - Deactivates if needed (one-time, max reached, or end date passed)

This process can be triggered manually by administrators via the admin API. 