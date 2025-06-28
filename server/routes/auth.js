const express = require('express');
const User = require('../models/User');
const Wedding = require('../models/Wedding');
const Collaborator = require('../models/Collaborator');
const { generateToken, authenticateToken } = require('../utils/auth');
const { sendMail } = require('../utils/email');
const crypto = require('crypto');
const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password
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
        email: user.email
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
        email: user.email
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
    const { name, email } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        lastLogin: updatedUser.lastLogin
      }
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

// Create wedding for existing user
router.post('/create-wedding', authenticateToken, async (req, res) => {
  try {
    const { name, weddingDate, partnerName, venue, theme, budget, guestCount, role } = req.body;

    // Create new wedding
    const wedding = new Wedding({
      name: name || `${req.user.name} & ${partnerName || 'Partner'}'s Wedding`,
      weddingDate: weddingDate ? new Date(weddingDate) : null,
      venue: venue || '',
      theme: theme || '',
      budget: budget || 0,
      guestCount: guestCount || 0,
      description: `${req.user.name} and ${partnerName || 'Partner'}'s special day`,
      createdBy: req.user._id
    });

    await wedding.save();

    // Get permissions based on role
    const permissions = getRolePermissions(role || 'Owner');

    // Create initial collaboration (user as owner of their wedding)
    const collaboration = new Collaborator({
      weddingId: wedding._id,
      userId: req.user._id,
      role: role || 'Owner',
      email: req.user.email,
      name: req.user.name,
      status: 'accepted',
      invitedBy: req.user._id,
      acceptedAt: new Date(),
      permissions
    });

    await collaboration.save();

    res.status(201).json({
      message: 'Wedding created successfully',
      wedding: {
        id: wedding._id,
        name: wedding.name,
        weddingDate: wedding.weddingDate,
        venue: wedding.venue,
        theme: wedding.theme,
        budget: wedding.budget,
        guestCount: wedding.guestCount
      }
    });
  } catch (error) {
    console.error('Create wedding error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: Object.values(error.errors).map(err => err.message) });
    }
    res.status(500).json({ error: 'Failed to create wedding' });
  }
});

// Helper function to get permissions based on role
function getRolePermissions(role) {
  const permissions = {
    canView: true,
    canEditTimeline: false,
    canEditGuests: false,
    canEditShop: false,
    canInviteOthers: false,
    canManageRoles: false
  };

  switch (role) {
    case 'Owner':
      permissions.canEditTimeline = true;
      permissions.canEditGuests = true;
      permissions.canEditShop = true;
      permissions.canInviteOthers = true;
      permissions.canManageRoles = true;
      break;
    case 'Bride':
    case 'Groom':
      permissions.canEditTimeline = true;
      permissions.canEditGuests = true;
      permissions.canEditShop = true;
      permissions.canInviteOthers = true;
      break;
    case 'Planner':
      permissions.canEditTimeline = true;
      permissions.canEditGuests = true;
      permissions.canEditShop = true;
      permissions.canInviteOthers = true;
      break;
    case 'Maid of Honor':
    case 'Best Man':
      permissions.canEditTimeline = true;
      permissions.canEditGuests = false;
      permissions.canEditShop = false;
      break;
    case 'Parent':
      permissions.canEditTimeline = false;
      permissions.canEditGuests = true;
      permissions.canEditShop = false;
      break;
    default:
      // Friend, Sibling, Other - view only
      break;
  }

  return permissions;
}

// Forgot password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if user exists or not for security
      return res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    // Save reset token to user
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();

    // Create reset URL
    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

    // Send email
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">BeeHitched</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Password Reset Request</p>
        </div>
        <div style="padding: 40px; background: white;">
          <h2 style="color: #333; margin-bottom: 20px;">Hello ${user.name},</h2>
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            You requested a password reset for your BeeHitched account. Click the button below to reset your password:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
              Reset Password
            </a>
          </div>
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            If you didn't request this password reset, you can safely ignore this email. The link will expire in 1 hour.
          </p>
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            If the button doesn't work, copy and paste this link into your browser:
          </p>
          <p style="color: #667eea; word-break: break-all; font-size: 14px;">
            ${resetUrl}
          </p>
        </div>
        <div style="background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px;">
          <p style="margin: 0;">© 2024 BeeHitched. All rights reserved.</p>
        </div>
      </div>
    `;

    await sendMail({
      to: user.email,
      subject: 'Reset Your BeeHitched Password',
      html: emailHtml,
      text: `Hello ${user.name},\n\nYou requested a password reset for your BeeHitched account. Please visit this link to reset your password: ${resetUrl}\n\nThis link will expire in 1 hour.\n\nIf you didn't request this reset, please ignore this email.\n\nBest regards,\nThe BeeHitched Team`
    });

    res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Failed to process password reset request' });
  }
});

// Reset password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password are required' });
    }

    // Find user with valid reset token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    // Update password and clear reset token
    user.password = newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: Object.values(error.errors).map(err => err.message) });
    }
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

module.exports = router; 