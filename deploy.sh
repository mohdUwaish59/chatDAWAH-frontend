#!/bin/bash

# ChatLANTERN Frontend Deployment Script

echo "🚀 ChatLANTERN Deployment"
echo "========================"
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null
then
    echo "❌ Vercel CLI not found"
    echo "📦 Installing Vercel CLI..."
    npm i -g vercel
fi

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "⚠️  .env.local not found"
    echo "📝 Creating from .env.example..."
    cp .env.example .env.local
    echo ""
    echo "⚠️  Please update NEXT_PUBLIC_API_URL in .env.local"
    echo "   Then run this script again"
    exit 1
fi

# Build locally first
echo "🔨 Building locally..."
pnpm build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build successful"
echo ""

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Set NEXT_PUBLIC_API_URL in Vercel dashboard"
echo "   2. Redeploy if needed"
echo "   3. Test your deployment"
echo ""
echo "🔗 Vercel Dashboard: https://vercel.com/dashboard"
