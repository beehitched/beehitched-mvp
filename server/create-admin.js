const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function createAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/beehitched', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.email);
      return;
    }

    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@beehitched.com',
      password: 'admin123456',
      role: 'admin'
    });

    await adminUser.save();
    console.log('Admin user created successfully:', adminUser.email);
    console.log('Email: admin@beehitched.com');
    console.log('Password: admin123456');

  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Function to convert existing user to admin
async function convertToAdmin(email) {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/beehitched', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found with email:', email);
      return;
    }

    // Update user role to admin
    user.role = 'admin';
    await user.save();
    console.log('User converted to admin successfully:', user.email);

  } catch (error) {
    console.error('Error converting user to admin:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Check command line arguments
const args = process.argv.slice(2);
if (args.length > 0 && args[0] === 'convert') {
  if (args[1]) {
    convertToAdmin(args[1]);
  } else {
    console.log('Please provide an email address: node create-admin.js convert user@example.com');
  }
} else {
  createAdmin();
} 