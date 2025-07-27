#!/bin/bash

# ChainMind Setup Script
# This script helps you set up the ChainMind project

echo "🧠 ChainMind Setup Script"
echo "========================="

# Check if required tools are installed
check_dependency() {
    if ! command -v $1 &> /dev/null; then
        echo "❌ $1 is not installed. Please install it first."
        exit 1
    else
        echo "✅ $1 is installed"
    fi
}

echo "Checking dependencies..."
check_dependency "node"
check_dependency "npm"
check_dependency "git"

# Check for optional tools
if command -v forge &> /dev/null; then
    echo "✅ Foundry is installed"
    FOUNDRY_AVAILABLE=true
else
    echo "⚠️  Foundry not found. You'll need it to deploy smart contracts."
    FOUNDRY_AVAILABLE=false
fi

echo ""
echo "Setting up project..."

# Install AI Agent dependencies
echo "📦 Installing AI Agent dependencies..."
cd ai-agent
npm install
cd ..

# Install Frontend dependencies
echo "📦 Installing Frontend dependencies..."
cd frontend
npm install
cd ..

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📄 Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your API keys and configuration"
else
    echo "✅ .env file already exists"
fi

# Create logs directory
mkdir -p ai-agent/logs
echo "✅ Created logs directory"

# Initialize Foundry project if available
if [ "$FOUNDRY_AVAILABLE" = true ]; then
    echo "🔨 Setting up Foundry project..."
    forge init --no-git --no-commit contracts-foundry 2>/dev/null || echo "Foundry project structure ready"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your API keys"
echo "2. Deploy smart contracts: npm run deploy"
echo "3. Start AI agent: npm run start:ai"
echo "4. Start frontend: npm run start:frontend"
echo ""
echo "For more information, see README.md"
