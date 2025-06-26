# 🚀 BeeHitched Deployment Guide

## Overview
This guide will walk you through deploying BeeHitched to production on www.beehitched.com using Vercel (frontend) and Railway (backend).

## 📋 Prerequisites
- GitHub account
- Vercel account (free)
- Railway account (free)
- MongoDB Atlas account (free)
- Domain: www.beehitched.com

---

## 🗄️ Step 1: Set Up MongoDB Atlas (Database)

### 1.1 Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for a free account
3. Create a new cluster (M0 Free tier)
4. Set up database access:
   - Create a database user with password
   - Add your IP address to IP whitelist (or 0.0.0.0/0 for all IPs)

### 1.2 Get Connection String
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database password
5. Replace `<dbname>` with `beehitched`

**Example:**
```
mongodb+srv://username:password@cluster.mongodb.net/beehitched?retryWrites=true&w=majority
```

---

## 🚂 Step 2: Deploy Backend to Railway

### 2.1 Prepare Backend for Deployment
1. Create a `Procfile` in the `server` directory:
```
web: node server.js
```

2. Update `server/package.json` to include:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "engines": {
    "node": ">=16.0.0"
  }
}
```

### 2.2 Deploy to Railway
1. Go to [Railway](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Connect your GitHub repository
5. Select the `server` directory as the source
6. Add environment variables:
   ```
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_secret_jwt_key_here
   CLIENT_URL=https://www.beehitched.com
   PORT=5000
   ```
7. Deploy the project
8. Note the generated URL (e.g., `https://your-app-name.railway.app`)

---

## ⚡ Step 3: Deploy Frontend to Vercel

### 3.1 Prepare Frontend for Deployment
1. Update `client/.env.local` (create if it doesn't exist):
```
NEXT_PUBLIC_API_URL=https://your-railway-app-url.railway.app/api
NEXT_PUBLIC_SITE_URL=https://www.beehitched.com
```

### 3.2 Deploy to Vercel
1. Go to [Vercel](https://vercel.com)
2. Sign up with GitHub
3. Click "New Project" → "Import Git Repository"
4. Select your repository
5. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
6. Add environment variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-railway-app-url.railway.app/api
   NEXT_PUBLIC_SITE_URL=https://www.beehitched.com
   ```
7. Deploy the project
8. Note the generated URL (e.g., `https://your-app-name.vercel.app`)

---

## 🌐 Step 4: Configure Domain

### 4.1 Point Domain to Vercel
1. In Vercel dashboard, go to your project settings
2. Click "Domains"
3. Add `www.beehitched.com`
4. Vercel will provide DNS records to add to your domain registrar

### 4.2 Update DNS Records
1. Go to your domain registrar (where you bought beehitched.com)
2. Add these DNS records:
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

### 4.3 Add Root Domain Redirect
1. In Vercel, also add `beehitched.com` (without www)
2. This will redirect to www.beehitched.com

---

## 🔧 Step 5: Final Configuration

### 5.1 Update CORS Settings
In your Railway backend, update the CORS configuration in `server/server.js`:
```javascript
app.use(cors({
  origin: ['https://www.beehitched.com', 'https://beehitched.com'],
  credentials: true
}));
```

### 5.2 Test Your Deployment
1. Visit https://www.beehitched.com
2. Test registration/login
3. Test all features (dashboard, settings, etc.)
4. Check that data is being saved to MongoDB Atlas

---

## 🔒 Step 6: Security & Performance

### 6.1 Environment Variables
Ensure these are set in Railway:
- `JWT_SECRET`: Strong random string
- `MONGODB_URI`: Your MongoDB connection string
- `CLIENT_URL`: https://www.beehitched.com

### 6.2 SSL/HTTPS
- Vercel provides automatic SSL
- Railway provides automatic SSL
- Your domain will be secure by default

### 6.3 Performance
- Vercel provides CDN and edge caching
- Railway provides good performance for the backend
- Consider adding a CDN for images later

---

## 🚨 Troubleshooting

### Common Issues:
1. **CORS Errors**: Check that CLIENT_URL is set correctly
2. **Database Connection**: Verify MongoDB Atlas connection string
3. **Environment Variables**: Ensure all variables are set in both Vercel and Railway
4. **Build Errors**: Check the build logs in Vercel

### Debugging:
1. Check Railway logs for backend errors
2. Check Vercel logs for frontend errors
3. Use browser dev tools to check network requests
4. Verify environment variables are loaded correctly

---

## 📊 Monitoring & Maintenance

### 6.1 Set Up Monitoring
- Vercel Analytics (free)
- Railway logs
- MongoDB Atlas monitoring

### 6.2 Regular Maintenance
- Keep dependencies updated
- Monitor database usage
- Check for security updates

---

## 🎉 Launch Checklist

- [ ] MongoDB Atlas database set up
- [ ] Backend deployed to Railway
- [ ] Frontend deployed to Vercel
- [ ] Domain configured and pointing to Vercel
- [ ] Environment variables set correctly
- [ ] CORS configured properly
- [ ] SSL certificates working
- [ ] All features tested
- [ ] Registration/login working
- [ ] Data saving to database

Once you complete this checklist, your BeeHitched app will be live at www.beehitched.com! 🚀

---

## 💰 Cost Breakdown (Monthly)

- **Vercel**: Free tier (Hobby plan)
- **Railway**: Free tier (limited usage)
- **MongoDB Atlas**: Free tier (512MB storage)
- **Domain**: ~$10-15/year
- **Total**: ~$1-2/month

For higher traffic, you may need to upgrade to paid plans. 