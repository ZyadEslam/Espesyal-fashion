# Stripe Payment Integration Setup

This guide explains how to set up Stripe payment integration for the e-commerce application.

## Overview

The application now supports two payment methods:
1. **Cash on Delivery** - Pay when you receive your order
2. **Stripe (Visa/Mastercard)** - Secure card payment processing

## Prerequisites

1. A Stripe account (sign up at https://stripe.com)
2. Stripe API keys (available in your Stripe Dashboard)

## Environment Variables

Add the following environment variables to your `.env.local` file:

```env
# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

### Getting Your Stripe Keys

1. Log in to your [Stripe Dashboard](https://dashboard.stripe.com)
2. Go to **Developers** > **API keys**
3. Copy your **Publishable key** (starts with `pk_test_` or `pk_live_`)
4. Copy your **Secret key** (starts with `sk_test_` or `sk_live_`)

**Note:** Use test keys (`pk_test_` and `sk_test_`) for development and live keys (`pk_live_` and `sk_live_`) for production.

## Features

### Payment Flow

1. User adds items to cart
2. User proceeds to checkout from cart page
3. User selects payment method (Cash on Delivery or Card Payment)
4. If card payment is selected:
   - Stripe payment form is displayed
   - User enters card details
   - Payment is processed securely
5. Order is placed and saved to database

### Order Model Updates

The Order model now includes:
- `paymentMethod`: "cash_on_delivery" or "stripe"
- `paymentStatus`: "pending", "paid", or "failed"
- `stripePaymentIntentId`: Stripe payment intent ID (for card payments)

## Testing with Stripe

### Test Card Numbers

Use these test card numbers in the Stripe payment form:

- **Success:** `4242 4242 4242 4242`
- **Decline:** `4000 0000 0000 0002`
- **Requires Authentication:** `4000 0025 0000 3155`

Use any future expiry date, any 3-digit CVC, and any postal code.

### Testing the Integration

1. Start your development server: `npm run dev`
2. Add items to cart
3. Go to checkout page
4. Select "Card Payment"
5. Enter test card number: `4242 4242 4242 4242`
6. Complete the payment

## API Routes

### `/api/stripe/create-payment-intent`

Creates a Stripe payment intent for processing card payments.

**Request:**
```json
{
  "amount": 5000  // Amount in cents (e.g., 5000 = $50.00)
}
```

**Response:**
```json
{
  "clientSecret": "pi_..."
}
```

### `/api/order`

Updated to accept payment method and Stripe payment intent ID.

**Request:**
```json
{
  "userId": "...",
  "addressId": "...",
  "products": [...],
  "totalPrice": 50.00,
  "paymentMethod": "stripe" | "cash_on_delivery",
  "stripePaymentIntentId": "pi_..." // Optional, required for Stripe payments
}
```

## Components

### `StripePaymentForm`

Located at `app/components/checkoutComponents/StripePaymentForm.tsx`

Handles the Stripe payment form UI and payment processing.

### `CheckoutPage`

Located at `app/[locale]/checkout/page.tsx`

Main checkout page where users select payment method and complete their order.

## Localization

All checkout and payment strings are localized in:
- `messages/en.json` - English translations
- `messages/ar.json` - Arabic translations

## Security Notes

1. **Never expose your secret key** - Keep `STRIPE_SECRET_KEY` server-side only
2. **Use HTTPS in production** - Required for secure payment processing
3. **Validate payments server-side** - Always verify payment status on your server
4. **Use webhooks** - Set up Stripe webhooks for payment status updates (recommended for production)

## Troubleshooting

### Payment form not loading

- Check that `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set correctly
- Verify the key starts with `pk_test_` or `pk_live_`
- Check browser console for errors

### Payment intent creation fails

- Verify `STRIPE_SECRET_KEY` is set correctly
- Check that the key starts with `sk_test_` or `sk_live_`
- Ensure the amount is at least $0.50 (50 cents)

### Payment succeeds but order not created

- Check server logs for errors
- Verify database connection
- Ensure all required order fields are provided

## Production Deployment

Before going live:

1. Switch to live Stripe keys (`pk_live_` and `sk_live_`)
2. Set up Stripe webhooks for payment status updates
3. Enable HTTPS on your production domain
4. Test the complete payment flow
5. Set up proper error monitoring and logging

## Support

For Stripe-specific issues, refer to:
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe API Reference](https://stripe.com/docs/api)
- [Stripe Support](https://support.stripe.com)

