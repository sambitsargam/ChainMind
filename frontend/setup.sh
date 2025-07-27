#!/bin/bash

# ChainMind Frontend Setup Script
echo "🧠 Setting up ChainMind Frontend..."

# Change to frontend directory
cd "$(dirname "$0")"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Copy environment file if it doesn't exist
if [ ! -f .env ]; then
    echo "📄 Creating .env file..."
    cp .env.example .env
fi

echo "✅ Frontend setup complete!"
echo ""
echo "To start development server:"
echo "npm run dev"
