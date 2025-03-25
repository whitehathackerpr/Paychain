# NFT Receipts Guide

This guide provides detailed information about the NFT Receipts feature in the PayChain application.

## Overview

NFT Receipts allow users to generate unique digital receipts for their transactions in the form of Non-Fungible Tokens (NFTs). These receipts serve as:

- Proof of payment
- Digital collectibles
- Transaction history verification
- Visual representation of significant payments

## How NFT Receipts Work

1. **Generation**: NFTs are created when a user completes a transaction and chooses to generate an NFT receipt
2. **Ownership**: Each NFT is owned by the transaction recipient and stored on their account
3. **Metadata**: NFTs contain transaction details including amount, sender, recipient, timestamp, and description
4. **Uniqueness**: Each NFT has a unique identifier and cannot be duplicated

## Benefits of NFT Receipts

- **Immutable Proof**: Provides tamper-proof evidence of transactions
- **Digital Collection**: Users can build a collection of significant payment receipts
- **Visual History**: Offers a visual way to track important transactions
- **Gift Enhancement**: Makes gifts more memorable with visual representations

## Creating an NFT Receipt

NFT receipts can be generated in two ways:

1. **Automatic Generation**: For transactions above a certain amount threshold
2. **Manual Generation**: By making a POST request to `/nft-receipts/generate/{transaction_id}` after completing a transaction

### Manual NFT Receipt Generation

To create an NFT receipt for a transaction, make a POST request to `/nft-receipts/generate/{transaction_id}` with the following optional data:

```json
{
  "custom_image": "base64_encoded_image_data",
  "custom_metadata": {
    "occasion": "Birthday Gift",
    "message": "Happy Birthday! Enjoy your gift!",
    "additional_field": "any_custom_value"
  }
}
```

### Required Parameters

- `transaction_id`: The ID of the transaction (included in the URL path)

### Optional Parameters

- `custom_image`: Base64-encoded image data for a custom NFT image
- `custom_metadata`: Additional metadata to include with the NFT receipt

## Viewing NFT Receipts

### Listing All Your NFT Receipts

To view all your NFT receipts, make a GET request to `/nft-receipts/`.

### Viewing a Specific NFT Receipt

To view details of a specific NFT receipt, make a GET request to `/nft-receipts/{receipt_id}`.

## NFT Receipt Structure

Each NFT receipt contains the following information:

```json
{
  "id": "nft-receipt-uuid",
  "transaction_id": "transaction-uuid",
  "owner_id": "user-recipient-id",
  "created_at": "2025-04-01T15:30:45Z",
  "image_url": "https://paychain.com/nft-images/receipt-image-uuid.png",
  "receipt_metadata": {
    "amount": 250.00,
    "timestamp": "2025-04-01T15:30:00Z",
    "sender": "user-sender-id",
    "sender_name": "John Doe",
    "recipient": "user-recipient-id",
    "recipient_name": "Jane Smith",
    "description": "Birthday gift",
    "custom_fields": {
      "occasion": "Birthday Gift",
      "message": "Happy Birthday! Enjoy your gift!"
    }
  }
}
```

## NFT Image Generation

NFT images are generated using the following methods:

1. **Default Template**: A visually appealing template with transaction details
2. **Custom Image**: User-provided image with transaction details overlay
3. **Generated Art**: Algorithmically generated art based on transaction data

### Default Template Components

- Transaction amount (prominently displayed)
- Sender and recipient names
- Transaction date and time
- Transaction description
- Visual elements based on transaction amount
- Unique visual hash pattern for verification

## Best Practices

1. **Generate for Significant Transactions**: Create NFT receipts for important or memorable transactions
2. **Add Custom Metadata**: Enhance NFTs with occasion details and personal messages
3. **Use Custom Images**: For special occasions, use relevant images to make NFTs more meaningful
4. **Share with Recipients**: Let recipients know they've received an NFT receipt for their transaction

## Technical Implementation

The system generates NFT receipts through the following process:

1. Receives a request to generate an NFT for a transaction
2. Verifies the transaction exists and the requester is authorized
3. Retrieves transaction details including sender, recipient, amount, and timestamp
4. Creates an image either using the default template, custom image, or generated art
5. Stores the image and creates a database record linking the NFT to the transaction
6. Returns the NFT details including image URL and metadata

## NFT Storage and Display

- NFT images are stored securely and served via content delivery networks
- NFT metadata is stored in the database and linked to both transaction and user records
- The frontend application provides a gallery view for users to browse their NFT collection
- Individual NFTs can be viewed in detail, showing the image and all associated metadata

## API Endpoints

- `GET /nft-receipts/`: List all NFT receipts owned by the current user
- `GET /nft-receipts/{receipt_id}`: Get details of a specific NFT receipt
- `POST /nft-receipts/generate/{transaction_id}`: Generate a new NFT receipt for a transaction
- `GET /nft-receipts/transaction/{transaction_id}`: Check if a transaction has an NFT receipt

## Example Use Cases

### Birthday Gift

When sending a birthday gift payment, generate an NFT receipt with:
- A birthday-themed custom image
- Custom metadata including a birthday message
- Details of the gift amount and occasion

### Home Purchase Down Payment

For significant transactions like a home down payment:
- Generate an NFT with an image of the new home
- Include custom metadata with property details
- Store as a memento of the important financial milestone

### Business Transaction Receipt

For business transactions:
- Generate an NFT with company logos
- Include invoice numbers and business details in metadata
- Use as an immutable receipt for accounting purposes

## Future Enhancements

The NFT Receipt system may be expanded in the future to include:

1. **NFT Sharing**: Ability to share NFT receipts on social media
2. **NFT Collections**: Grouping NFTs into themed collections
3. **Enhanced Visualizations**: More sophisticated algorithmic art generation
4. **Blockchain Integration**: Optional storage on public blockchains for additional verification
5. **NFT Marketplaces**: Potential for trading or showcasing significant NFT receipts

## Troubleshooting

### NFT Generation Failed

If NFT generation fails:

1. Verify the transaction exists and is completed
2. Check that the requester is either the sender or recipient of the transaction
3. Ensure any custom image data is properly formatted and encoded
4. Verify the system has sufficient storage for new NFT images

### NFT Image Not Displaying

If the NFT image doesn't display:

1. Check the image URL is accessible
2. Verify the image format is supported by the viewer
3. Ensure content delivery networks are functioning properly 