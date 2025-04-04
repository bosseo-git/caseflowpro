#!/bin/bash

# Display header
echo "============================================="
echo "      CaseFlowPro Setup and Test Script       "
echo "============================================="

# Check for required tools
if ! [ -x "$(command -v npm)" ]; then
  echo "Error: npm is not installed." >&2
  exit 1
fi

if ! [ -x "$(command -v npx)" ]; then
  echo "Error: npx is not installed." >&2
  exit 1
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Check if .env.local exists, if not, copy from .env.example
if [ ! -f .env.local ]; then
  echo "Creating .env.local from .env.example..."
  cp .env.example .env.local
  echo "⚠️  Please edit .env.local with your actual values!"
  echo "   particularly the GoHighLevel credentials."
fi

# Set up the database
echo "Setting up the database..."
npx prisma db push

# Build the application
echo "Building the application..."
npm run build

echo "============================================="
echo "Setup complete! You can now start the development server with:"
echo "npm run dev"
echo "============================================="
echo ""
echo "Next steps:"
echo "1. Edit .env.local with your GoHighLevel credentials"
echo "2. Start the server with 'npm run dev'"
echo "3. Create an account at http://localhost:3000/signup"
echo "4. Configure GoHighLevel settings at http://localhost:3000/dashboard/settings"
echo "5. Generate your widget at http://localhost:3000/dashboard/script-generator"
echo ""
echo "For testing the widget with ngrok, run:"
echo "npx ngrok http 3000"
echo "Then use the ngrok URL in your GoHighLevel webhook configuration" 