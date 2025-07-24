# Laravel Payment Backend

This Laravel backend handles payment processing and subscription management using Stripe.

## Setup Instructions

### 1. Install Dependencies
```bash
composer install
```

### 2. Environment Configuration
Add the following to your `.env` file:
```env
STRIPE_PUBLISHABLE_KEY=pk_test_51RoORjJfdX3e7oAIgmAQWTCASKwGOMSI2rd9Krx3XYXl8tYi16WoZYDFtNkJDdP1hCVKLqUmsxBIcC9kffWHwOtL00XFrt4AyF
STRIPE_SECRET_KEY=sk_test_51RoORjJfdX3e7oAItRGqRgiZ0bd9IPPBcHLnxvNkjGsQQZYuYpvm7fhAHkB2vNms78gn1isnk2VRbuc5xasegnMh00uRmSSKj1
```

### 3. Database Setup
```bash
# Create SQLite database
touch database/database.sqlite

# Run migrations
php artisan migrate
```

### 4. Generate Application Key
```bash
php artisan key:generate
```

### 5. Set Permissions
```bash
chmod -R 775 storage bootstrap/cache
```

### 6. Start Server
```bash
php artisan serve
```

The backend will be available at `http://localhost:8000`

## API Endpoints

### Save Payment Method
```
POST /api/save-payment-method
Content-Type: application/json

{
    "payment_method_id": "pm_1234567890",
    "user_info": {
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+1234567890"
    }
}
```

### Create Subscription
```
POST /api/subscribe
Content-Type: application/json

{
    "payment_method_id": "pm_1234567890",
    "plan_name": "Starter",
    "price_id": "price_1234567890"
}
```

### Get Subscription Status
```
GET /api/subscription-status?user_id=1
```

## Database Schema

### Users Table
- `id` - Primary key
- `name` - User's full name
- `email` - User's email (unique)
- `phone` - User's phone number
- `stripe_customer_id` - Stripe customer ID
- `created_at`, `updated_at` - Timestamps

### Subscriptions Table
- `id` - Primary key
- `user_id` - Foreign key to users table
- `stripe_subscription_id` - Stripe subscription ID
- `stripe_price_id` - Stripe price ID
- `plan_name` - Plan name (Starter, Growth, etc.)
- `amount` - Monthly amount
- `status` - Subscription status
- `current_period_start` - Current period start date
- `current_period_end` - Current period end date
- `created_at`, `updated_at` - Timestamps

## Testing

Use Stripe test cards:
- `4242 4242 4242 4242` - Successful payment
- `4000 0000 0000 0002` - Declined payment
- `4000 0000 0000 9995` - Insufficient funds

## Quick Setup

Run the setup script:
```bash
chmod +x setup-payment.sh
./setup-payment.sh
```

## Frontend Integration

Update your frontend proxy to point to this backend:
```json
{
  "proxy": "http://localhost:8000"
}
``` 