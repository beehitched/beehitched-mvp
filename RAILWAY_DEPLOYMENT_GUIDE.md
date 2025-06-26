# 🚂 Railway Deployment Guide for BeeHitched Backend

## Overview
This guide walks you through deploying your BeeHitched Node.js backend to Railway, including MongoDB Atlas setup and environment configuration.

---

## 📋 Prerequisites

### 1. Required Accounts
- [ ] Railway account (railway.app)
- [ ] MongoDB Atlas account (mongodb.com/atlas)
- [ ] GitHub account (for code repository)

### 2. Required Tools
- [ ] Git installed
- [ ] Node.js installed locally
- [ ] Code editor

---

## 🗄️ Step 1: Set Up MongoDB Atlas

### 1.1 Create MongoDB Atlas Account
1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Click "Try Free" and create account
3. Choose "Shared" cluster (free tier)

### 1.2 Create Database Cluster
1. **Cloud Provider**: Choose AWS, Google Cloud, or Azure
2. **Region**: Choose closest to your users (e.g., US East for North America)
3. **Cluster Tier**: Select "M0 Sandbox" (free)
4. Click "Create"

### 1.3 Configure Database Access
1. Go to "Database Access" in left sidebar
2. Click "Add New Database User"
3. **Username**: `beehitched-user`
4. **Password**: Generate a strong password (save it!)
5. **Database User Privileges**: Select "Read and write to any database"
6. Click "Add User"

### 1.4 Configure Network Access
1. Go to "Network Access" in left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for Railway deployment)
4. Click "Confirm"

### 1.5 Get Connection String
1. Go to "Database" in left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. **Replace `<password>` with your actual password**
6. **Replace `<dbname>` with `beehitched`**

**Example connection string:**
```
mongodb+srv://beehitched-user:yourpassword@cluster0.xxxxx.mongodb.net/beehitched?retryWrites=true&w=majority
```

---

## 🚂 Step 2: Deploy to Railway

### 2.1 Connect Railway to GitHub
1. Go to [railway.app](https://railway.app)
2. Sign in with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your BeeHitched repository

### 2.2 Configure Project Settings
1. **Project Name**: `beehitched-backend`
2. **Root Directory**: `server` (since your backend is in the server folder)
3. Click "Deploy Now"

### 2.3 Set Environment Variables
1. Go to your Railway project dashboard
2. Click "Variables" tab
3. Add these environment variables:

```
MONGODB_URI=mongodb+srv://beehitched-user:yourpassword@cluster0.xxxxx.mongodb.net/beehitched?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=production
CLIENT_URL=https://www.beehitched.com
```

**Important Notes:**
- Replace the MongoDB URI with your actual connection string
- Generate a strong JWT_SECRET (you can use: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`)
- Update CLIENT_URL to your actual domain

### 2.4 Deploy and Monitor
1. Railway will automatically detect your Node.js app
2. It will install dependencies from `package.json`
3. It will start your app using the `start` script
4. Monitor the deployment logs for any errors

---

## 🔧 Step 3: Verify Deployment

### 3.1 Check Railway Dashboard
1. Go to your Railway project
2. Check "Deployments" tab for successful deployment
3. Note your app URL (e.g., `https://beehitched-backend-production.up.railway.app`)

### 3.2 Test Your API
1. Open your browser or use Postman
2. Test the health endpoint: `https://your-railway-url.railway.app/api/health`
3. You should see a response like: `{"message": "BeeHitched API is running"}`

### 3.3 Check Logs
1. In Railway dashboard, go to "Deployments"
2. Click on your latest deployment
3. Check logs for any errors or warnings

---

## 🎯 Step 4: Update Frontend Configuration

### 4.1 Update Production Environment
1. Go to your `client/.env.production` file
2. Update the API URL:

```env
NEXT_PUBLIC_API_URL=https://your-railway-url.railway.app/api
NEXT_PUBLIC_SITE_URL=https://www.beehitched.com
```

### 4.2 Test API Connection
1. Start your frontend locally: `npm run dev`
2. Open browser dev tools
3. Check console for any API connection errors
4. Test login/registration functionality

---

## 🚨 Troubleshooting Common Issues

### Issue 1: MongoDB Connection Failed
**Symptoms**: `MongoServerSelectionError` in logs

**Solutions**:
1. Check MongoDB Atlas Network Access allows all IPs
2. Verify connection string is correct
3. Ensure database user has proper permissions
4. Check if MongoDB Atlas cluster is active

### Issue 2: Port Configuration Error
**Symptoms**: App fails to start

**Solutions**:
1. Railway automatically sets `PORT` environment variable
2. Your `server.js` should use: `process.env.PORT || 5000`
3. Check your server.js file uses the correct port configuration

### Issue 3: CORS Errors
**Symptoms**: Frontend can't connect to API

**Solutions**:
1. Update `CLIENT_URL` in Railway environment variables
2. Ensure your server CORS configuration includes your domain
3. Check that `NEXT_PUBLIC_API_URL` is correct in frontend

### Issue 4: JWT Token Issues
**Symptoms**: Authentication fails

**Solutions**:
1. Ensure `JWT_SECRET` is set in Railway environment variables
2. Use the same JWT_SECRET across all environments
3. Check token expiration settings

---

## 📊 Monitoring and Maintenance

### 1. Railway Dashboard Features
- **Logs**: Real-time application logs
- **Metrics**: CPU, memory, and network usage
- **Deployments**: Automatic deployments on git push
- **Variables**: Environment variable management

### 2. Health Checks
- Railway automatically checks if your app is responding
- Set up custom health endpoint in your API
- Monitor uptime and performance

### 3. Scaling (Future)
- Railway can auto-scale based on traffic
- Upgrade to paid plan for more resources
- Set up custom domains

---

## 🔐 Security Best Practices

### 1. Environment Variables
- Never commit secrets to git
- Use strong, unique passwords
- Rotate JWT secrets regularly

### 2. MongoDB Atlas
- Use strong database passwords
- Enable MongoDB Atlas security features
- Set up database backups

### 3. API Security
- Implement rate limiting
- Use HTTPS (Railway provides this)
- Validate all inputs

---

## ✅ Deployment Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user configured
- [ ] Network access configured
- [ ] Connection string obtained
- [ ] Railway project created
- [ ] GitHub repository connected
- [ ] Environment variables set
- [ ] Deployment successful
- [ ] API endpoints tested
- [ ] Frontend configuration updated
- [ ] CORS working correctly
- [ ] Authentication working
- [ ] Logs checked for errors

---

## 🎉 Next Steps

1. **Test your deployed API** thoroughly
2. **Deploy your frontend** to Vercel
3. **Set up custom domain** (www.beehitched.com)
4. **Configure SSL certificates**
5. **Set up monitoring and alerts**
6. **Create backup strategies**

Your BeeHitched backend is now live on Railway! 🚀

---

## 📞 Support Resources

- **Railway Docs**: [docs.railway.app](https://docs.railway.app)
- **MongoDB Atlas Docs**: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)
- **Node.js Docs**: [nodejs.org/docs](https://nodejs.org/docs)

Need help? Check the troubleshooting section above or reach out with specific error messages! 