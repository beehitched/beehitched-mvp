const express = require('express');
const Collaborator = require('../models/Collaborator');
const WeddingRole = require('../models/WeddingRole');
const User = require('../models/User');
const { authenticateToken } = require('../utils/auth');
const router = express.Router();

// Get all collaborators for a wedding
router.get('/:weddingId', authenticateToken, async (req, res) => {
  try {
    const { weddingId } = req.params;
    
    // For MVP, treat user ID as wedding ID
    // Check if user has access to this wedding
    const collaborator = await Collaborator.findOne({ 
      weddingId, 
      userId: req.user._id 
    });
    
    // If no collaborator record exists, create one for the user as owner
    if (!collaborator) {
      const newCollaborator = new Collaborator({
        weddingId: req.user._id, // Use user ID as wedding ID
        userId: req.user._id,
        role: 'Owner',
        email: req.user.email,
        name: req.user.name,
        status: 'accepted',
        permissions: {
          canEditTimeline: true,
          canEditGuests: true,
          canInviteOthers: true,
          canManageRoles: true,
          canViewBudget: true
        }
      });
      await newCollaborator.save();
    }

    const collaborators = await Collaborator.find({ weddingId })
      .populate('userId', 'name email')
      .populate('invitedBy', 'name')
      .sort({ createdAt: -1 });

    res.json(collaborators);
  } catch (error) {
    console.error('Get collaborators error:', error);
    res.status(500).json({ error: 'Failed to fetch collaborators' });
  }
});

// Get user's role for a wedding
router.get('/:weddingId/my-role', authenticateToken, async (req, res) => {
  try {
    const { weddingId } = req.params;
    
    let collaborator = await Collaborator.findOne({ 
      weddingId, 
      userId: req.user._id 
    });

    // If no collaborator record exists, create one for the user as owner
    if (!collaborator) {
      collaborator = new Collaborator({
        weddingId: req.user._id, // Use user ID as wedding ID
        userId: req.user._id,
        role: 'Owner',
        email: req.user.email,
        name: req.user.name,
        status: 'accepted',
        permissions: {
          canEditTimeline: true,
          canEditGuests: true,
          canInviteOthers: true,
          canManageRoles: true,
          canViewBudget: true
        }
      });
      await collaborator.save();
    }

    res.json({
      role: collaborator.role,
      permissions: collaborator.permissions,
      status: collaborator.status
    });
  } catch (error) {
    console.error('Get my role error:', error);
    res.status(500).json({ error: 'Failed to fetch role' });
  }
});

// Invite a new collaborator
router.post('/:weddingId/invite', authenticateToken, async (req, res) => {
  try {
    const { weddingId } = req.params;
    const { email, name, role } = req.body;

    // Check if user has permission to invite
    const currentCollaborator = await Collaborator.findOne({ 
      weddingId, 
      userId: req.user._id 
    });
    
    if (!currentCollaborator || !currentCollaborator.permissions.canInviteOthers) {
      return res.status(403).json({ error: 'Permission denied' });
    }

    // Check if user already exists
    let invitedUser = await User.findOne({ email: email.toLowerCase() });
    
    if (!invitedUser) {
      // Create a placeholder user (they'll complete registration when they accept)
      invitedUser = new User({
        email: email.toLowerCase(),
        name: name,
        password: 'placeholder' // They'll set this when they accept
      });
      await invitedUser.save();
    }

    // Check if already a collaborator
    const existingCollaborator = await Collaborator.findOne({ 
      weddingId, 
      userId: invitedUser._id 
    });

    if (existingCollaborator) {
      return res.status(400).json({ error: 'User is already a collaborator' });
    }

    // Set permissions based on role
    const permissions = getRolePermissions(role);

    const collaborator = new Collaborator({
      weddingId,
      userId: invitedUser._id,
      role,
      email: email.toLowerCase(),
      name,
      invitedBy: req.user._id,
      permissions
    });

    await collaborator.save();

    // For MVP, we'll just return success (in production, send email)
    res.status(201).json({ 
      message: 'Invitation sent successfully',
      collaborator: {
        ...collaborator.toObject(),
        userId: invitedUser
      }
    });
  } catch (error) {
    console.error('Invite collaborator error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: Object.values(error.errors).map(err => err.message) });
    }
    res.status(500).json({ error: 'Failed to send invitation' });
  }
});

// Accept invitation
router.post('/:weddingId/accept', authenticateToken, async (req, res) => {
  try {
    const { weddingId } = req.params;
    
    const collaborator = await Collaborator.findOne({ 
      weddingId, 
      userId: req.user._id,
      status: 'pending'
    });

    if (!collaborator) {
      return res.status(404).json({ error: 'No pending invitation found' });
    }

    collaborator.status = 'accepted';
    collaborator.acceptedAt = new Date();
    await collaborator.save();

    res.json({ 
      message: 'Invitation accepted successfully',
      collaborator
    });
  } catch (error) {
    console.error('Accept invitation error:', error);
    res.status(500).json({ error: 'Failed to accept invitation' });
  }
});

// Decline invitation
router.post('/:weddingId/decline', authenticateToken, async (req, res) => {
  try {
    const { weddingId } = req.params;
    
    const collaborator = await Collaborator.findOne({ 
      weddingId, 
      userId: req.user._id,
      status: 'pending'
    });

    if (!collaborator) {
      return res.status(404).json({ error: 'No pending invitation found' });
    }

    collaborator.status = 'declined';
    await collaborator.save();

    res.json({ 
      message: 'Invitation declined successfully'
    });
  } catch (error) {
    console.error('Decline invitation error:', error);
    res.status(500).json({ error: 'Failed to decline invitation' });
  }
});

// Update collaborator role
router.put('/:weddingId/:collaboratorId', authenticateToken, async (req, res) => {
  try {
    const { weddingId, collaboratorId } = req.params;
    const { role } = req.body;

    // Check if user has permission to manage roles
    const currentCollaborator = await Collaborator.findOne({ 
      weddingId, 
      userId: req.user._id 
    });
    
    if (!currentCollaborator || !currentCollaborator.permissions.canManageRoles) {
      return res.status(403).json({ error: 'Permission denied' });
    }

    const collaborator = await Collaborator.findOneAndUpdate(
      { _id: collaboratorId, weddingId },
      { 
        role,
        permissions: getRolePermissions(role)
      },
      { new: true }
    );

    if (!collaborator) {
      return res.status(404).json({ error: 'Collaborator not found' });
    }

    res.json({ 
      message: 'Role updated successfully',
      collaborator
    });
  } catch (error) {
    console.error('Update collaborator error:', error);
    res.status(500).json({ error: 'Failed to update collaborator' });
  }
});

// Remove collaborator
router.delete('/:weddingId/:collaboratorId', authenticateToken, async (req, res) => {
  try {
    const { weddingId, collaboratorId } = req.params;

    // Check if user has permission to manage roles
    const currentCollaborator = await Collaborator.findOne({ 
      weddingId, 
      userId: req.user._id 
    });
    
    if (!currentCollaborator || !currentCollaborator.permissions.canManageRoles) {
      return res.status(403).json({ error: 'Permission denied' });
    }

    const collaborator = await Collaborator.findOneAndDelete({
      _id: collaboratorId,
      weddingId
    });

    if (!collaborator) {
      return res.status(404).json({ error: 'Collaborator not found' });
    }

    res.json({ 
      message: 'Collaborator removed successfully'
    });
  } catch (error) {
    console.error('Remove collaborator error:', error);
    res.status(500).json({ error: 'Failed to remove collaborator' });
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

module.exports = router; 