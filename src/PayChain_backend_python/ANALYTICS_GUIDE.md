# Analytics Guide

This guide provides detailed information about the Analytics features in the PayChain application.

## Overview

The Analytics module provides users with valuable insights into their transaction history, spending patterns, and financial behavior. This powerful feature helps users:

- Track spending by category
- Analyze transaction history
- Monitor payment trends
- Visualize financial activity
- Identify unusual transactions

## Available Analytics

### Transaction Summary

The Transaction Summary provides an overview of a user's financial activity for a specified time period, including:

- Total amount sent
- Total amount received
- Net balance change
- Transaction count
- Average transaction value
- Largest transaction
- Most frequent recipient

#### Endpoint

```
GET /analytics/summary/?period=month
```

#### Query Parameters

- `period`: The time period for the summary (day, week, month, year, all)
- `start_date`: Optional start date to create a custom period (YYYY-MM-DD)
- `end_date`: Optional end date to create a custom period (YYYY-MM-DD)

#### Response Example

```json
{
  "period": "month",
  "start_date": "2025-03-01",
  "end_date": "2025-03-31",
  "total_sent": 1250.75,
  "total_received": 876.40,
  "net_change": -374.35,
  "transaction_count": 17,
  "sent_count": 10,
  "received_count": 7,
  "average_transaction": 125.12,
  "largest_transaction": {
    "id": "transaction-uuid",
    "amount": 500.00,
    "recipient": "Jane Smith",
    "date": "2025-03-15T14:30:00Z",
    "description": "Monthly rent"
  },
  "most_frequent_recipient": {
    "name": "Coffee Shop",
    "count": 5,
    "total_amount": 28.75
  }
}
```

### Spending by Category

This analysis breaks down spending by transaction categories, helping users understand where their money is going.

#### Endpoint

```
GET /analytics/spending-by-category/?period=month
```

#### Query Parameters

- `period`: The time period for the analysis (day, week, month, year, all)
- `start_date`: Optional start date to create a custom period (YYYY-MM-DD)
- `end_date`: Optional end date to create a custom period (YYYY-MM-DD)
- `include_uncategorized`: Whether to include uncategorized transactions (default: true)

#### Response Example

```json
{
  "period": "month",
  "start_date": "2025-03-01",
  "end_date": "2025-03-31",
  "categories": [
    {
      "category": "Housing",
      "amount": 800.00,
      "percentage": 64.0,
      "transaction_count": 2
    },
    {
      "category": "Food",
      "amount": 250.75,
      "percentage": 20.0,
      "transaction_count": 8
    },
    {
      "category": "Transportation",
      "amount": 125.00,
      "percentage": 10.0,
      "transaction_count": 5
    },
    {
      "category": "Entertainment",
      "amount": 75.00,
      "percentage": 6.0,
      "transaction_count": 3
    }
  ],
  "total_amount": 1250.75,
  "total_transactions": 18
}
```

### Transaction Trends

This analysis shows how spending and income have changed over time, with data points grouped by day, week, or month.

#### Endpoint

```
GET /analytics/trends/?period=year&interval=month
```

#### Query Parameters

- `period`: The overall time period (month, quarter, year, all)
- `interval`: The grouping interval (day, week, month)
- `start_date`: Optional start date to create a custom period
- `end_date`: Optional end date to create a custom period
- `include_scheduled`: Whether to include scheduled payments (default: true)

#### Response Example

```json
{
  "period": "year",
  "interval": "month",
  "start_date": "2025-01-01",
  "end_date": "2025-12-31",
  "data_points": [
    {
      "date": "2025-01-01",
      "sent": 1200.50,
      "received": 2500.00,
      "net": 1299.50,
      "transaction_count": 12
    },
    {
      "date": "2025-02-01",
      "sent": 1350.25,
      "received": 2500.00,
      "net": 1149.75,
      "transaction_count": 15
    },
    {
      "date": "2025-03-01",
      "sent": 1250.75,
      "received": 2500.00,
      "net": 1249.25,
      "transaction_count": 17
    }
    // Additional months...
  ]
}
```

### Recipient Analysis

This analysis provides insights into your payment patterns with specific recipients.

#### Endpoint

```
GET /analytics/recipient-analysis/?recipient_id=user-uuid
```

#### Query Parameters

- `recipient_id`: The ID of the recipient to analyze
- `period`: Optional time period (month, quarter, year, all)

#### Response Example

```json
{
  "recipient": {
    "id": "user-uuid",
    "name": "Jane Smith",
    "principal": "jane.smith"
  },
  "first_transaction_date": "2024-01-15T09:30:00Z",
  "total_transactions": 15,
  "total_amount": 12500.00,
  "average_amount": 833.33,
  "largest_amount": 1500.00,
  "smallest_amount": 50.00,
  "frequency": "Monthly",
  "most_common_description": "Rent payment",
  "recent_transactions": [
    {
      "id": "transaction-uuid",
      "date": "2025-03-15T14:30:00Z",
      "amount": 900.00,
      "description": "Rent payment"
    },
    {
      "id": "transaction-uuid",
      "date": "2025-02-15T12:15:00Z",
      "amount": 900.00,
      "description": "Rent payment"
    }
    // Additional transactions...
  ]
}
```

### Scheduled Payment Analysis

This analysis provides insights into recurring payments and their impact on your finances.

#### Endpoint

```
GET /analytics/scheduled-payments-analysis/
```

#### Query Parameters

- `include_inactive`: Whether to include inactive scheduled payments (default: false)

#### Response Example

```json
{
  "active_count": 5,
  "inactive_count": 2,
  "total_monthly_outflow": 1250.00,
  "scheduled_payments": [
    {
      "id": "scheduled-payment-uuid",
      "recipient_name": "Landlord",
      "amount": 900.00,
      "frequency": "monthly",
      "next_payment_date": "2025-04-15T00:00:00Z",
      "description": "Apartment rent",
      "monthly_impact": 900.00
    },
    {
      "id": "scheduled-payment-uuid",
      "recipient_name": "Streaming Service",
      "amount": 14.99,
      "frequency": "monthly",
      "next_payment_date": "2025-04-05T00:00:00Z",
      "description": "Video streaming subscription",
      "monthly_impact": 14.99
    }
    // Additional payments...
  ],
  "highest_payment": {
    "recipient": "Landlord",
    "amount": 900.00,
    "description": "Apartment rent"
  },
  "upcoming_payments": [
    {
      "date": "2025-04-05T00:00:00Z",
      "recipient": "Streaming Service",
      "amount": 14.99,
      "description": "Video streaming subscription"
    },
    {
      "date": "2025-04-15T00:00:00Z",
      "recipient": "Landlord",
      "amount": 900.00,
      "description": "Apartment rent"
    }
    // Additional upcoming payments...
  ]
}
```

## Financial Insights

The Financial Insights feature uses transaction data to provide personalized recommendations and observations about the user's financial behavior.

### Endpoint

```
GET /analytics/insights/
```

#### Response Example

```json
{
  "insights": [
    {
      "type": "spending_increase",
      "category": "Food",
      "message": "Your spending on Food has increased by 25% compared to last month.",
      "previous_period": 200.00,
      "current_period": 250.00,
      "recommended_action": "Review your food expenses to identify any unusual spending."
    },
    {
      "type": "frequent_small_transaction",
      "recipient": "Coffee Shop",
      "message": "You made 12 small transactions at Coffee Shop this month, totaling $68.40.",
      "recommended_action": "Consider combining purchases or using a reloadable card to reduce transaction count."
    },
    {
      "type": "recurring_payment_detected",
      "message": "We detected a potential recurring payment of $14.99 to Streaming Service on the 5th of each month.",
      "recommended_action": "If this is a regular payment, consider setting up a scheduled payment for better tracking."
    }
    // Additional insights...
  ]
}
```

## Custom Analytics Queries

For advanced users, PayChain provides a custom analytics query endpoint that allows flexible analysis of transaction data.

### Endpoint

```
POST /analytics/custom-query/
```

### Request Body

```json
{
  "filters": {
    "min_amount": 100.00,
    "max_amount": 500.00,
    "start_date": "2025-01-01",
    "end_date": "2025-03-31",
    "recipients": ["user-uuid-1", "user-uuid-2"],
    "categories": ["Food", "Entertainment"],
    "direction": "sent" // "sent", "received", or "both"
  },
  "grouping": {
    "field": "category", // "category", "recipient", "date", etc.
    "interval": "month" // For date grouping: "day", "week", "month"
  },
  "aggregations": ["sum", "count", "average"] // Metrics to calculate
}
```

### Response Example

```json
{
  "query_details": {
    "filters": { /* filters from request */ },
    "grouping": { /* grouping from request */ },
    "aggregations": ["sum", "count", "average"]
  },
  "results": [
    {
      "group": "Food",
      "sum": 825.50,
      "count": 12,
      "average": 68.79
    },
    {
      "group": "Entertainment",
      "sum": 350.00,
      "count": 5,
      "average": 70.00
    }
  ],
  "summary": {
    "total_sum": 1175.50,
    "total_count": 17,
    "overall_average": 69.15
  }
}
```

## Data Export

Users can export their analytics data for external analysis or record-keeping.

### Endpoint

```
GET /analytics/export/?format=csv&type=transaction_history
```

#### Query Parameters

- `format`: Export format (csv, json, pdf)
- `type`: Data type to export (transaction_history, spending_by_category, summary)
- `period`: Time period (month, quarter, year, all)
- `start_date`: Optional custom start date
- `end_date`: Optional custom end date

#### Response

A file download with the requested data in the specified format.

## Best Practices for Using Analytics

1. **Regular Review**: Check your transaction summary and spending by category at least monthly
2. **Compare Periods**: Use period comparisons to track changes in your financial behavior
3. **Set Budget Targets**: Use the spending by category analysis to establish realistic budget targets
4. **Review Insights**: Pay attention to the automated financial insights for potential issues or opportunities
5. **Export Data**: Periodically export your transaction data for long-term record-keeping

## Technical Implementation

The analytics features are implemented using:

- SQL aggregation queries for efficient data analysis
- Caching of common queries to improve performance
- Background processing for complex analysis requests
- Data visualization libraries for the frontend display
- Secure data handling to protect sensitive financial information

## Limitations

- Analytics data is based solely on transactions processed through PayChain
- Historical data is limited to the user's transaction history within the system
- Complex custom queries may take longer to process
- Very large datasets may be truncated in some views to maintain performance

## Future Analytics Features

We're continuously improving our analytics capabilities. Planned enhancements include:

1. **Predictive Analysis**: Forecasting future spending based on historical patterns
2. **Budget Tracking**: Setting and monitoring budget targets by category
3. **Anomaly Detection**: Identifying unusual transactions that may indicate fraud
4. **Savings Analysis**: Tracking progress toward savings goals
5. **Transaction Categorization**: Improved automatic categorization of transactions
6. **Comparative Analytics**: Comparing your spending patterns with anonymized data from similar users

## API Integration

Analytics data can be integrated with other applications using the PayChain API. See the API documentation for details on authentication and endpoint specifications. 