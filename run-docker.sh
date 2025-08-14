#!/bin/bash

echo "🚀 Starting Payment App with Docker..."
echo "======================================"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Build and start all services
echo "🔨 Building and starting services..."
docker-compose up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Run Laravel migrations
echo "🗄️  Running database migrations..."
docker-compose exec backend php artisan migrate --force

# Show service status
echo "📊 Service Status:"
docker-compose ps

echo ""
echo "🎉 Payment App is now running!"
echo ""
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:80"
echo "📧 Mailpit: http://localhost:8025"
echo "🔍 Meilisearch: http://localhost:7700"
echo ""
echo "📋 Useful commands:"
echo "  - View logs: docker-compose logs -f"
echo "  - Stop services: docker-compose down"
echo "  - Restart services: docker-compose restart"
echo ""
echo "⚠️  Don't forget to update your Stripe API keys in docker.env file!"
