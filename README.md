# BeeHitched - Wedding Planning Made Simple

A modern, full-stack wedding planning web application built with Next.js, Express.js, and MongoDB. Designed to help couples plan their perfect wedding with an elegant, intuitive interface.

## 🎯 Features

### ✨ Core Features
- **Timeline Planning**: Drag-and-drop task management with categories
- **Guest Management**: RSVP tracking, dietary restrictions, seating arrangements
- **Wedding Shop**: Curated products for wedding essentials
- **Dashboard**: Progress tracking and wedding statistics
- **User Authentication**: Secure login/registration with JWT

### 🎨 Design & UX
- **Mobile-First**: Responsive design that works on all devices
- **Wedding Theme**: Soft blush tones, elegant typography, romantic aesthetics
- **Smooth Animations**: Framer Motion for delightful interactions
- **Modern UI**: Tailwind CSS with custom wedding-themed components

### 🔧 Technical Features
- **Full-Stack**: Next.js frontend + Express.js backend
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based auth with secure password hashing
- **State Management**: Zustand for client-side state
- **Real-time Updates**: Optimistic UI updates with error handling

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Lucide React** - Beautiful icons
- **Zustand** - Lightweight state management
- **React Hook Form** - Form handling
- **Axios** - HTTP client

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Multer** - File upload handling

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd beehitched-mvp
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install client dependencies
   cd client && npm install
   
   # Install server dependencies
   cd ../server && npm install
   ```

3. **Environment Setup**
   
   Create `.env` file in the server directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/beehitched
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   PORT=5000
   NODE_ENV=development
   ```

   Create `.env.local` file in the client directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

4. **Database Setup**
   ```bash
   # Start MongoDB (if running locally)
   mongod
   
   # Seed the database with sample data
   cd server && npm run seed
   ```

5. **Start Development Servers**
   ```bash
   # From root directory - starts both client and server
   npm run dev
   
   # Or start individually:
   # Terminal 1: Start server
   npm run server
   
   # Terminal 2: Start client
   npm run client
   ```

6. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - API Health Check: http://localhost:5000/api/health

## 📁 Project Structure

```
beehitched-mvp/
├── client/                 # Next.js frontend
│   ├── app/               # App Router pages
│   ├── components/        # Reusable components
│   ├── contexts/          # React contexts
│   ├── lib/              # Utility functions
│   └── types/            # TypeScript types
├── server/                # Express.js backend
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── utils/            # Utility functions
│   └── seed.js           # Database seeder
├── package.json          # Root package.json
└── README.md            # This file
```

## 🎨 Design System

### Colors
- **Primary**: Soft blush pink (#ec4899)
- **Gold**: Elegant gold accents (#f59e0b)
- **Neutral**: Clean grays and whites
- **Success**: Emerald green (#10b981)
- **Error**: Red (#ef4444)

### Typography
- **Serif**: Playfair Display (headings)
- **Sans**: Inter (body text)
- **Script**: Dancing Script (accent text)

### Components
- **Cards**: Soft shadows, rounded corners
- **Buttons**: Gradient backgrounds, hover effects
- **Forms**: Clean inputs with focus states
- **Animations**: Smooth transitions and micro-interactions

## 🔐 Authentication

The app uses JWT-based authentication with the following features:
- Secure password hashing with bcrypt
- Token-based session management
- Protected routes and API endpoints
- Automatic token refresh
- Secure logout functionality

## 📊 Database Models

### User
- Basic info (name, email, password)
- Wedding details (date, partner, budget, venue, theme)
- Account settings and preferences

### Task
- Wedding planning tasks with categories
- Due dates, priorities, and status tracking
- Linked products and notes
- Drag-and-drop ordering

### Guest
- Guest information and RSVP status
- Dietary restrictions and seating
- Group assignments and VIP status
- Plus-one management

### Product
- Wedding shop products
- Categories, pricing, and inventory
- Images, descriptions, and reviews
- Featured and active status

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables
3. Deploy automatically on push

### Backend (Railway/Heroku)
1. Set up MongoDB Atlas cluster
2. Configure environment variables
3. Deploy Express.js app
4. Update frontend API URL

### Environment Variables
```env
# Production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-production-secret
NODE_ENV=production
CLIENT_URL=https://your-domain.com
```

## 🧪 Testing

### Sample Data
The seed script creates:
- 2 sample users with full profiles
- 18 wedding planning tasks across 8 categories
- 10 guest records with RSVP data
- 10 shop products with images and pricing

### Test Accounts
- **User 1**: sarah@example.com / password123
- **User 2**: emily@example.com / password123

## 🔧 Development

### Available Scripts
```bash
# Root level
npm run dev          # Start both client and server
npm run install-all  # Install all dependencies
npm run build        # Build client for production

# Client
npm run client       # Start Next.js dev server
npm run build        # Build for production

# Server
npm run server       # Start Express.js dev server
npm run seed         # Seed database with sample data
```

### Code Style
- **TypeScript**: Strict mode enabled
- **ESLint**: Next.js recommended config
- **Prettier**: Consistent code formatting
- **Tailwind**: Utility-first CSS approach

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support or questions:
- Create an issue in the repository
- Check the documentation
- Review the code comments

## 🎉 Acknowledgments

- **Icons**: Lucide React
- **Fonts**: Google Fonts
- **Images**: Unsplash
- **Design Inspiration**: Modern wedding planning tools

---

**BeeHitched** - Making wedding planning beautiful and stress-free 💕 