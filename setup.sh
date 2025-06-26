#!/bin/bash

echo "🎉 Welcome to BeeHitched Wedding Planning App Setup!"
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm version: $(npm --version)"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install client dependencies
echo "📦 Installing client dependencies..."
cd client
npm install
cd ..

# Install server dependencies
echo "📦 Installing server dependencies..."
cd server
npm install
cd ..

# Create environment files
echo "🔧 Setting up environment files..."

# Server environment
if [ ! -f "server/.env" ]; then
    echo "Creating server .env file..."
    cat > server/.env << EOF
MONGODB_URI=mongodb://localhost:27017/beehitched
JWT_SECRET=your-super-secret-jwt-key-change-in-production
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
EOF
    echo "✅ Server .env file created"
else
    echo "✅ Server .env file already exists"
fi

# Client environment
if [ ! -f "client/.env.local" ]; then
    echo "Creating client .env.local file..."
    cat > client/.env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:5000/api
EOF
    echo "✅ Client .env.local file created"
else
    echo "✅ Client .env.local file already exists"
fi

echo ""
echo "🎯 Setup Complete!"
echo "=================="
echo ""
echo "Next steps:"
echo "1. Start MongoDB (if running locally):"
echo "   mongod"
echo ""
echo "2. Seed the database with sample data:"
echo "   cd server && npm run seed"
echo ""
echo "3. Start the development servers:"
echo "   npm run dev"
echo ""
echo "4. Access the application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend: http://localhost:5000"
echo ""
echo "5. Test accounts:"
echo "   Email: sarah@example.com"
echo "   Password: password123"
echo ""
echo "Happy wedding planning! 💕" 