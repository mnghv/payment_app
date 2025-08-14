# Payment Application

A complete payment processing application with React frontend and Laravel backend, featuring subscription management and secure payment processing.

## Project Screenshot

Below is an example of the pricing page interface, showing the bookkeeping services with four distinct pricing tiers:

The application displays a clean, modern pricing page with navigation tabs for "Software Plans", "Bookkeeping Services" (highlighted), and "Bookkeepers & Firms".

The main section features four pricing cards:

1. **Starter**: $299/month for monthly expenses $0 - $15k
2. **Growth**: $449/month for monthly expenses $15k - $50k  
3. **Scaling**: $649/month for monthly expenses $50k - $100k
4. **Enterprise**: $899/month for monthly expenses $100k+

Each card includes a "Get Started" button and the page features a detailed comparison table showing features like bookkeeping type, financial packages, and support options across all plans.

## Features

- **React Frontend**: Modern UI with Stripe Elements integration
- **Laravel Backend**: Secure API endpoints for payment processing
- **Pricing Table**: Beautiful subscription plans display
- **Payment Form**: Secure credit card collection with Stripe Elements
- **Subscription Management**: Create and manage Stripe subscriptions
- **User Profile Management**: Save and update user information

## Project Structure

```
payment_app/
├── src/                    # React frontend source
│   ├── components/         # React components
│   │   ├── PricingTable.tsx
│   │   ├── PaymentForm.tsx
│   │   └── UserProfile.tsx
│   ├── utils/              # Utility functions
│   │   └── userUtils.ts
│   ├── App.tsx
│   ├── global.scss
│   └── index.tsx
├── backends/               # Laravel backend
│   ├── app/
│   │   ├── Http/Controllers/
│   │   │   └── PaymentController.php
│   │   ├── Http/Requests/
│   │   │   ├── PaymentRequest.php
│   │   │   ├── SubscriptionRequest.php
│   │   │   ├── UserCheckRequest.php
│   │   │   └── SubscriptionStatusRequest.php
│   │   └── Models/
│   │       ├── User.php
│   │       └── Subscription.php
│   ├── routes/
│   │   └── api.php
│   └── composer.json
├── package.json
├── public/
│   └── index.html
└── README.md
```

## Prerequisites

- Node.js (v16 or higher)
- PHP (v8.1 or higher)
- Composer
- Stripe account with API keys

## Setup Instructions

### Option 1: Using Docker (Recommended)

This project can be run entirely using Docker for easy setup and deployment.

#### Prerequisites for Docker
- Docker Desktop installed and running
- `docker-compose` (usually comes with Docker Desktop)

#### Quick Start with Docker

1. **Create environment file:**
   Create `docker.env` in the root directory:
   ```env
   # Frontend Environment Variables
   REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
   REACT_APP_API_URL=http://localhost:80

   # Backend Environment Variables
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
   STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here

   # Database Configuration
   DB_HOST=mysql
   DB_DATABASE=payment_app
   DB_USERNAME=root
   DB_PASSWORD=password
   DB_PORT=3306
   ```

2. **Run the project:**
   ```bash
   chmod +x run-docker.sh
   ./run-docker.sh
   ```

3. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:80

4. **Stop the project:**
   ```bash
   docker-compose down
   ```

### Option 2: Traditional Setup

#### 1. Frontend Setup (React)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create environment file:**
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```
   The React app will run on `http://localhost:3000`

#### 2. Backend Setup (Laravel)

1. **Navigate to backend directory:**
   ```bash
   cd backends
   ```

2. **Install dependencies:**
   ```bash
   composer install
   ```

3. **Create environment file:**
   Copy `.env.example` to `.env` and configure:
   ```env
   APP_NAME="Payment Application"
   APP_ENV=local
   APP_KEY=base64:your_generated_key_here
   APP_DEBUG=true
   APP_URL=http://localhost
   
   # Stripe Configuration
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
   STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
   
   ```

4. **Generate application key:**
   ```bash
   php artisan key:generate
   ```

5. **Start the Laravel server:**
   ```bash
   php artisan serve
   ```
   The Laravel API will run on `http://localhost`

### 3. Stripe Configuration

1. **Get your Stripe API keys:**
   - Go to [Stripe Dashboard](https://dashboard.stripe.com/)
   - Navigate to Developers > API keys
   - Copy your publishable and secret keys

2. **Create Price IDs in Stripe:**
   You'll need to create price IDs for each subscription plan:
   - `price_starter` - $299/month
   - `price_growth` - $449/month
   - `price_scaling` - $649/month
   - `price_enterprise` - $899/month

3. **Update the PaymentForm.tsx:**
   Replace the price IDs in `src/components/PaymentForm.tsx` with your actual Stripe price IDs.

## API Endpoints

### POST /api/save-payment-method
Saves a payment method to Stripe and associates it with a customer.

**Request Body:**
```json
{
  "payment_method_id": "pm_...",
  "user_info": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment method saved successfully",
  "customer_id": "cus_...",
  "payment_method_id": "pm_..."
}
```

### POST /api/subscribe
Creates a subscription using the saved payment method.

**Request Body:**
```json
{
  "payment_method_id": "pm_...",
  "plan_name": "Starter",
  "price_id": "price_starter"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Subscription created successfully",
  "subscription_id": "sub_...",
  "subscription_status": "active",
  "plan_name": "Starter"
}
```

## Frontend Components

### PricingTable
- Displays subscription plans in a grid layout
- Features comparison table
- Navigation tabs for different service categories
- "Get Started" buttons that navigate to payment form

### PaymentForm
- Collects user personal information
- Integrates Stripe Elements for secure card input
- Shows order summary
- Handles payment processing and subscription creation
- Displays success/error messages

## Styling

The app uses a custom CSS theme with:
- Light green accent color (#4ade80)
- Clean, modern design
- Responsive layout
- Custom Stripe Elements styling
- Hover effects and transitions

## Security Features

- Stripe Elements for secure card data collection
- Server-side payment processing
- API key protection (never exposed to frontend)
- Input validation and sanitization
- Error handling and user feedback

## Testing

### Test Cards
Use these Stripe test card numbers:
- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **Requires Authentication**: 4000 0025 0000 3155

### Test Mode
The app is configured for Stripe test mode by default. For production:
1. Replace test keys with live keys
2. Update price IDs to live price IDs
3. Test the application

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure the Laravel backend is running on port 80
2. **Stripe Errors**: Verify your API keys are correct and in test mode
3. **Price ID Errors**: Make sure the price IDs in PaymentForm.tsx match your Stripe dashboard

### Debug Mode
Enable debug mode in Laravel by setting `APP_DEBUG=true` in your `.env` file.

## Support

For technical support or questions, please contact your system administrator.

## Version

Current version: 1.0.0 