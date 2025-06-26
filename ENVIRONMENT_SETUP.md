# 🌍 Environment Variables Setup Guide

## Overview
This guide explains how to set up environment variables for BeeHitched in both development and production environments.

---

## 📁 Environment Files Structure

### Development Files (Local)
```
client/
├── .env.local          # Local development (gitignored)
├── .env.example        # Template for other developers
└── .env.production     # Production defaults
```

### Production Files (Vercel)
- Environment variables set in Vercel dashboard
- No files needed on server

---

## 🔧 Development Setup

### 1. Create `.env.local` (for local development)

Create a file called `.env.local` in your `client` directory:

```env
# Development Environment Variables
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 2. Create `.env.production` (for production defaults)

Create a file called `.env.production` in your `client` directory:

```env
# Production Environment Variables
NEXT_PUBLIC_API_URL=https://your-railway-app-url.railway.app/api
NEXT_PUBLIC_SITE_URL=https://www.beehitched.com
```

**Note**: Replace `your-railway-app-url.railway.app` with your actual Railway URL after deployment.

---

## 🚀 Production Setup (Vercel)

### 1. Set Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Click "Settings" → "Environment Variables"
3. Add these variables:

```
Name: NEXT_PUBLIC_API_URL
Value: https://your-railway-app-url.railway.app/api
Environment: Production

Name: NEXT_PUBLIC_SITE_URL  
Value: https://www.beehitched.com
Environment: Production
```

### 2. Environment Variable Priority

Next.js loads variables in this order:
1. `.env.production.local` (highest)
2. `.env.production`
3. `.env.local`
4. `.env`

**For production**: Vercel dashboard settings override file settings.

---

## 🔒 Security Notes

### ✅ Safe to Commit
- `.env.example` - Template file
- `.env.production` - Production defaults (no secrets)

### ❌ Never Commit
- `.env.local` - Contains local secrets
- `.env.production.local` - Contains production secrets

### 🔐 Sensitive Data
- Never put API keys or secrets in `NEXT_PUBLIC_*` variables
- These are exposed to the browser
- Only use for public configuration

---

## 📋 Environment Variables Reference

| Variable | Development | Production | Description |
|----------|-------------|------------|-------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:5000/api` | `https://your-railway-url.railway.app/api` | Backend API endpoint |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | `https://www.beehitched.com` | Frontend site URL |

---

## 🧪 Testing Environment Variables

### 1. Check if variables are loaded

Add this to any component to debug:

```javascript
console.log('API URL:', process.env.NEXT_PUBLIC_API_URL)
console.log('Site URL:', process.env.NEXT_PUBLIC_SITE_URL)
```

### 2. Verify in browser

1. Open browser dev tools
2. Go to Console tab
3. Check the logged values

---

## 🚨 Troubleshooting

### Common Issues:

1. **Variables not loading**
   - Restart your development server
   - Check file names (must be exact)
   - Verify variable names start with `NEXT_PUBLIC_`

2. **Production variables not working**
   - Check Vercel dashboard settings
   - Redeploy after changing variables
   - Verify environment is set to "Production"

3. **CORS errors**
   - Check that `NEXT_PUBLIC_API_URL` is correct
   - Verify backend CORS settings include your domain

---

## 📝 Quick Commands

### Create environment files:

```bash
# Development
echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > client/.env.local
echo "NEXT_PUBLIC_SITE_URL=http://localhost:3000" >> client/.env.local

# Production template
echo "NEXT_PUBLIC_API_URL=https://your-railway-app-url.railway.app/api" > client/.env.production
echo "NEXT_PUBLIC_SITE_URL=https://www.beehitched.com" >> client/.env.production
```

### Check current variables:

```bash
# In your component
console.log('Environment:', process.env.NODE_ENV)
console.log('API URL:', process.env.NEXT_PUBLIC_API_URL)
```

---

## ✅ Checklist

- [ ] Created `.env.local` for development
- [ ] Created `.env.production` for production defaults
- [ ] Set variables in Vercel dashboard
- [ ] Tested variables in development
- [ ] Verified variables in production
- [ ] Checked CORS settings
- [ ] Tested API connections

---

## 🎯 Next Steps

1. **Create the environment files** as shown above
2. **Deploy your backend** to Railway first
3. **Get your Railway URL** and update `.env.production`
4. **Deploy frontend** to Vercel
5. **Set production variables** in Vercel dashboard
6. **Test everything** works in production

Your environment setup will be complete! 🚀 