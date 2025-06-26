#!/bin/bash

echo "🚀 BeeHitched Deployment Helper"
echo "================================"
echo ""

echo "📋 Prerequisites Check:"
echo "1. Do you have a GitHub account? (y/n)"
read -r has_github

echo "2. Do you have a Vercel account? (y/n)"
read -r has_vercel

echo "3. Do you have a Railway account? (y/n)"
read -r has_railway

echo "4. Do you have a MongoDB Atlas account? (y/n)"
read -r has_mongodb

echo "5. Do you own the domain www.beehitched.com? (y/n)"
read -r has_domain

echo ""
echo "📝 Next Steps:"
echo "=============="
echo ""

if [ "$has_github" != "y" ]; then
    echo "1. Create a GitHub account at https://github.com"
fi

if [ "$has_vercel" != "y" ]; then
    echo "2. Create a Vercel account at https://vercel.com"
fi

if [ "$has_railway" != "y" ]; then
    echo "3. Create a Railway account at https://railway.app"
fi

if [ "$has_mongodb" != "y" ]; then
    echo "4. Create a MongoDB Atlas account at https://www.mongodb.com/atlas"
fi

if [ "$has_domain" != "y" ]; then
    echo "5. Purchase the domain beehitched.com from a registrar (GoDaddy, Namecheap, etc.)"
fi

echo ""
echo "📖 Follow the detailed guide in DEPLOYMENT_GUIDE.md"
echo "🔗 Quick Links:"
echo "   - MongoDB Atlas: https://www.mongodb.com/atlas"
echo "   - Railway: https://railway.app"
echo "   - Vercel: https://vercel.com"
echo ""
echo "💰 Estimated Cost: ~$1-2/month (mostly domain cost)"
echo ""
echo "🎉 Good luck with your deployment!" 