#!/bin/bash

echo "Setting up Laravel Payment Backend..."

# Install dependencies
composer install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    cp .env.example .env
    echo "Created .env file"
fi

# Generate application key
php artisan key:generate

# Create SQLite database
touch database/database.sqlite
echo "Created SQLite database"

# Run migrations
php artisan migrate

# Set proper permissions
chmod -R 775 storage bootstrap/cache

echo "Laravel Payment Backend setup complete!"
echo "Don't forget to add your Stripe keys to .env file:"
echo "STRIPE_PUBLISHABLE_KEY=***"
echo "STRIPE_SECRET_KEY=***"
echo ""
echo "You can now start the server with: php artisan serve" 