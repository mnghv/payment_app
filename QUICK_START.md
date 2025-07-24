# Quick Start Guide

## Prerequisites
- Node.js (v16+)
- PHP (v8.1+)
- Composer
- Stripe account

## 1. Install Dependencies

```bash
# Install React dependencies
npm install

# Install Laravel dependencies
cd backend
composer install
cd ..
```

## 2. Setup Environment

```bash
# Run automated setup (recommended)
./setup.sh

# Or manually create .env files:
```

### Frontend (.env in root)
```env
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
```

### Backend (backend/.env)
```env
APP_NAME="Payment Application"
APP_ENV=local
APP_KEY=base64:your_generated_key
APP_DEBUG=true
APP_URL=http://localhost

STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
```

## 3. Get Stripe API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Navigate to Developers > API keys
3. Copy your test keys
4. Update both .env files

## 4. Create Stripe Price IDs

In your Stripe Dashboard:
1. Go to Products > Add Product
2. Create 4 products with these prices:
   - Starter: $299/month
   - Growth: $449/month  
   - Scaling: $649/month
   - Enterprise: $899/month
3. Copy the price IDs (price_xxx...)
4. Update `src/components/PaymentForm.tsx` with your price IDs

## 5. Start the Application

```bash
# Terminal 1: Start React frontend
npm start

# Terminal 2: Start Laravel backend
cd backend
php artisan serve
```

## 6. Test the Application

1. Open http://localhost:3000
2. Click "Get Started" on any plan
3. Fill in the payment form
4. Use test card: 4242 4242 4242 4242
5. Complete the subscription

## What You'll See

- **Pricing Table**: Subscription plans with feature comparison
- **Payment Form**: Secure payment processing with Stripe Elements
- **Success Flow**: Complete subscription creation
- **Error Handling**: Proper validation and error messages

## Troubleshooting

### CORS Issues
- Ensure backend runs on port 80
- Check proxy setting in package.json

### Stripe Errors
- Verify API keys are in test mode
- Check price IDs match your Stripe dashboard

### Laravel Issues
- Run `php artisan key:generate` in backend directory
- Check .env file configuration

## Features Implemented

✅ React frontend with modern UI  
✅ Stripe Elements integration  
✅ Laravel API endpoints  
✅ Payment method saving  
✅ Subscription creation  
✅ Error handling  
✅ Responsive design  
✅ Custom styling  

## UI Features

- **Navigation Tabs**: Software Plans, Bookkeeping Services, Bookkeepers & Firms
- **Pricing Cards**: Hover effects, clean design
- **Feature Table**: Comparison grid with checkmarks
- **Payment Form**: Multi-step with order summary
- **Success/Error States**: Clear user feedback

## Security

- Stripe Elements for secure card input
- Server-side payment processing
- API key protection
- Input validation
- Error sanitization

---

**Ready to go!** 