const express = require('express');
const User = require('../models/User');
const { generateToken, authenticateToken } = require('../utils/auth');
const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, partnerName, weddingDate } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      partnerName,
      weddingDate: weddingDate ? new Date(weddingDate) : null
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        partnerName: user.partnerName,
        weddingDate: user.weddingDate
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: Object.values(error.errors).map(err => err.message) });
    }
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        partnerName: user.partnerName,
        weddingDate: user.weddingDate,
        budget: user.budget,
        guestCount: user.guestCount,
        venue: user.venue,
        theme: user.theme
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        partnerName: req.user.partnerName,
        weddingDate: req.user.weddingDate,
        budget: req.user.budget,
        guestCount: req.user.guestCount,
        venue: req.user.venue,
        theme: req.user.theme,
        lastLogin: req.user.lastLogin
      }
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, partnerName, weddingDate, budget, guestCount, venue, theme } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (partnerName !== undefined) updateData.partnerName = partnerName;
    if (weddingDate !== undefined) updateData.weddingDate = weddingDate ? new Date(weddingDate) : null;
    if (budget !== undefined) updateData.budget = budget;
    if (guestCount !== undefined) updateData.guestCount = guestCount;
    if (venue !== undefined) updateData.venue = venue;
    if (theme !== undefined) updateData.theme = theme;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Profile update error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: Object.values(error.errors).map(err => err.message) });
    }
    res.status(500).json({ error: 'Profile update failed' });
  }
});

// Change password
router.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    // Verify current password
    const user = await User.findById(req.user._id);
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Password change error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: Object.values(error.errors).map(err => err.message) });
    }
    res.status(500).json({ error: 'Password change failed' });
  }
});

// Delete account
router.delete('/account', authenticateToken, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { isActive: false });
    res.json({ message: 'Account deactivated successfully' });
  } catch (error) {
    console.error('Account deletion error:', error);
    res.status(500).json({ error: 'Account deletion failed' });
  }
});

module.exports = router; 