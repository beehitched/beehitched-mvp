const express = require('express');
const Collaborator = require('../models/Collaborator');
const WeddingRole = require('../models/WeddingRole');
const User = require('../models/User');
const { authenticateToken } = require('../utils/auth');
const { sendMail } = require('../utils/email');
const Wedding = require('../models/Wedding');
const router = express.Router();

// Check if user has a wedding
router.get('/user/has-wedding', authenticateToken, async (req, res) => {
  try {
    const collaborator = await Collaborator.findOne({ 
      userId: req.user._id,
      status: 'accepted'
    }).populate('weddingId');

    if (collaborator && collaborator.weddingId) {
      res.json({
        hasWedding: true,
        wedding: {
          id: collaborator.weddingId._id,
          name: collaborator.weddingId.name,
          weddingDate: collaborator.weddingId.weddingDate,
          venue: collaborator.weddingId.venue,
          theme: collaborator.weddingId.theme
        },
        role: collaborator.role,
        permissions: collaborator.permissions
      });
    } else {
      res.json({ hasWedding: false });
    }
  } catch (error) {
    console.error('Check wedding status error:', error);
    res.status(500).json({ error: 'Failed to check wedding status' });
  }
});

// Get all collaborators for a wedding
router.get('/:weddingId', authenticateToken, async (req, res) => {
  try {
    const { weddingId } = req.params;
    
    // First check if user is the wedding owner
    const wedding = await Wedding.findById(weddingId);
    const isOwner = wedding && wedding.createdBy.toString() === req.user._id.toString();
    
    if (isOwner) {
      // User is the wedding owner, they can access all collaborators
      const collaborators = await Collaborator.find({ weddingId })
        .populate('userId', 'name email')
        .populate('invitedBy', 'name')
        .sort({ createdAt: -1 });

      return res.json(collaborators);
    }
    
    // Find the user's wedding through collaboration
    const userWedding = await Collaborator.findOne({ 
      userId: req.user._id,
      status: 'accepted'
    }).populate('weddingId');

    if (!userWedding || !userWedding.weddingId) {
      return res.status(404).json({ error: 'No wedding found for user' });
    }

    const actualWeddingId = userWedding.weddingId._id;
    
    // Check if the requested wedding ID matches the user's actual wedding
    if (actualWeddingId.toString() !== weddingId) {
      return res.status(403).json({ error: 'Access denied to this wedding' });
    }
    
    // Check if user has access to this wedding
    const collaborator = await Collaborator.findOne({ 
      weddingId: actualWeddingId, 
      userId: req.user._id 
    });
    
    // If no collaborator record exists, use the user's existing collaboration
    if (!collaborator) {
      // This shouldn't happen since we already found userWedding above
      return res.status(404).json({ error: 'No collaboration found for user' });
    }

    const collaborators = await Collaborator.find({ weddingId: actualWeddingId })
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
    
    // First, check if user has any collaboration for this specific wedding
    let collaborator = await Collaborator.findOne({ 
      weddingId, 
      userId: req.user._id 
    });

    // If no collaborator record exists for this wedding, check if user is the wedding owner
    if (!collaborator) {
      const wedding = await Wedding.findById(weddingId);
      const isOwner = wedding && wedding.createdBy.toString() === req.user._id.toString();
      
      if (isOwner) {
        // User is the wedding owner, return owner permissions
        return res.json({
          role: 'Owner',
          permissions: getRolePermissions('Owner'),
          status: 'accepted'
        });
      }
      
      // Check if user has any wedding through collaboration
      const userWedding = await Collaborator.findOne({ 
        userId: req.user._id,
        status: 'accepted'
      }).populate('weddingId');

      if (userWedding && userWedding.weddingId) {
        // Check if the requested wedding ID matches the user's actual wedding
        if (userWedding.weddingId._id.toString() === weddingId) {
          // Use the existing collaboration record
          collaborator = userWedding;
        } else {
          // User is trying to access a different wedding than their own
          return res.status(403).json({ error: 'Access denied to this wedding' });
        }
      } else {
        return res.status(404).json({ error: 'No wedding found for user' });
      }
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

    // Check if wedding exists
    const wedding = await Wedding.findById(weddingId);
    if (!wedding) {
      return res.status(404).json({ error: 'Wedding not found' });
    }

    // Check if user is the wedding owner
    const isOwner = wedding.createdBy.toString() === req.user._id.toString();

    // Check if user has permission to invite
    const currentCollaborator = await Collaborator.findOne({ 
      weddingId, 
      userId: req.user._id 
    });
    
    // Allow if user is owner or has invite permissions
    if (!isOwner) {
      if (!currentCollaborator) {
        return res.status(403).json({ error: 'Access denied - you are not a collaborator for this wedding' });
      }
      
      if (!currentCollaborator.permissions || !currentCollaborator.permissions.canInviteOthers) {
        return res.status(403).json({ error: 'Permission denied - you cannot invite others to this wedding' });
      }
    }

    // Check if user already exists
    let invitedUser = await User.findOne({ email: email.toLowerCase() });
    let userId = null;
    
    if (invitedUser) {
      // User exists, use their ID
      userId = invitedUser._id;
    }
    // If user doesn't exist, we'll create the collaborator record without a userId
    // The userId will be set when they register and accept the invitation

    // Check if already a collaborator (by email for pending invites, by userId for existing users)
    let existingCollaborator;
    
    // First check by email (this catches both existing users and pending invites)
    existingCollaborator = await Collaborator.findOne({ 
      weddingId, 
      email: email.toLowerCase() 
    });

    if (existingCollaborator) {
      return res.status(400).json({ error: 'User is already a collaborator' });
    }

    // If user exists, also check by userId to be extra safe
    if (userId) {
      existingCollaborator = await Collaborator.findOne({ 
        weddingId, 
        userId: userId 
      });
      
      if (existingCollaborator) {
        return res.status(400).json({ error: 'User is already a collaborator' });
      }
    }

    // Set permissions based on role
    const permissions = getRolePermissions(role);

    const collaborator = new Collaborator({
      weddingId,
      userId: userId, // Will be null for new users
      role,
      email: email.toLowerCase(),
      name,
      invitedBy: req.user._id,
      permissions,
      status: userId ? 'accepted' : 'pending' // Auto-accept if user exists
    });

    await collaborator.save();

    // Fetch inviter's name
    const inviter = await User.findById(req.user._id);
    // Get recipient's first name
    const recipientFirstName = name.split(' ')[0];
    // Build join link (now to login page)
    const loginUrl = `${process.env.CLIENT_URL || 'https://www.beehitched.com'}/login`;

    // Build email content
    const subject = `You're invited to collaborate on a wedding with BeeHitched!`;
    const html = `
      <div style="font-family: sans-serif; color: #222;">
        <p>Hi ${recipientFirstName},</p>
        <p>You've been invited by <b>${inviter.name}</b> to collaborate on their wedding planning journey using <b>BeeHitched</b> — a beautifully simple platform to organize timelines, assign tasks, and keep everything wedding-related in one place.</p>
        <p>Whether you're helping plan, making decisions, or just staying in the loop, everything you need is right here.</p>
        <ul>
          <li>View and manage the wedding timeline</li>
          <li>See what tasks are assigned to you</li>
          <li>Share notes and updates in real-time</li>
          <li>Help keep the big day organized and stress-free</li>
        </ul>
        <p style="margin: 32px 0 16px 0; font-size: 1.1em;">👉 <b>Get Started:</b></p>
        <a href="${loginUrl}" style="display: inline-block; background: #E6397E; color: #fff; padding: 14px 28px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 1.1em;">Accept Your Invitation</a>
        <p style="margin: 24px 0 8px 0; font-size: 1em; color: #444;">After signing in, if you don't have an account, please sign up. Then, use the Wedding ID below to join the wedding:</p>
        <div style="background: #f3f4f6; color: #E6397E; font-weight: bold; padding: 12px 18px; border-radius: 6px; font-size: 1.1em; letter-spacing: 1px; margin-bottom: 24px; display: inline-block;">${weddingId}</div>
        <p style="margin-top: 32px;">If you have any questions, we're always here to help at <a href="mailto:hello@beehitched.com">hello@beehitched.com</a>.</p>
        <p>Let's make wedding planning smoother (and way more fun) — together. 💍🐝</p>
        <p style="margin-top: 32px;">Warmly,<br/>The BeeHitched Team<br/><a href="https://www.beehitched.com">www.beehitched.com</a></p>
      </div>
    `;
    const text = `Hi ${recipientFirstName},\n\nYou've been invited by ${inviter.name} to collaborate on their wedding planning journey using BeeHitched — a beautifully simple platform to organize timelines, assign tasks, and keep everything wedding-related in one place.\n\nWhether you're helping plan, making decisions, or just staying in the loop, everything you need is right here.\n\n- View and manage the wedding timeline\n- See what tasks are assigned to you\n- Share notes and updates in real-time\n- Help keep the big day organized and stress-free\n\nGet Started:\nAccept your invitation: ${loginUrl}\n\nAfter signing in, if you don't have an account, please sign up. Then, use the Wedding ID below to join the wedding:\n${weddingId}\n\nIf you have any questions, we're always here to help at hello@beehitched.com.\n\nLet's make wedding planning smoother (and way more fun) — together. 💍🐝\n\nWarmly,\nThe BeeHitched Team\nwww.beehitched.com`;

    // Send the invitation email
    await sendMail({
      to: email,
      subject,
      html,
      text
    });

    res.status(201).json({ 
      message: 'Invitation sent successfully',
      collaborator: {
        ...collaborator.toObject(),
        userId: invitedUser ? {
          _id: invitedUser._id,
          name: invitedUser.name,
          email: invitedUser.email
        } : null
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

// Join wedding by ID
router.post('/join', authenticateToken, async (req, res) => {
  try {
    const { weddingId, role } = req.body;

    if (!weddingId) {
      return res.status(400).json({ error: 'Wedding ID is required' });
    }

    // Check if wedding exists
    const Wedding = require('../models/Wedding');
    const wedding = await Wedding.findById(weddingId);
    if (!wedding) {
      return res.status(404).json({ error: 'Wedding not found' });
    }

    // Check if user is already a collaborator for this wedding
    const existingCollaborator = await Collaborator.findOne({
      weddingId,
      userId: req.user._id
    });

    if (existingCollaborator) {
      if (existingCollaborator.status === 'accepted') {
        return res.status(400).json({ error: 'You are already a collaborator for this wedding' });
      } else if (existingCollaborator.status === 'pending') {
        return res.status(400).json({ error: 'You already have a pending invitation for this wedding' });
      }
    }

    // Check if there's a pending invitation for this user's email
    const pendingInvitation = await Collaborator.findOne({
      weddingId,
      email: req.user.email.toLowerCase(),
      status: 'pending',
      userId: null
    });

    if (pendingInvitation) {
      // Link the pending invitation to this user
      pendingInvitation.userId = req.user._id;
      pendingInvitation.status = 'accepted';
      pendingInvitation.acceptedAt = new Date();
      await pendingInvitation.save();

      res.status(200).json({
        message: 'Successfully accepted invitation and joined wedding',
        wedding: {
          id: wedding._id,
          name: wedding.name,
          weddingDate: wedding.weddingDate,
          venue: wedding.venue,
          theme: wedding.theme
        },
        collaborator: {
          role: pendingInvitation.role,
          status: pendingInvitation.status,
          permissions: pendingInvitation.permissions
        }
      });
      return;
    }

    // Get permissions based on role
    const permissions = getRolePermissions(role || 'Friend');

    // Create new collaboration
    const collaborator = new Collaborator({
      weddingId,
      userId: req.user._id,
      role: role || 'Friend', // Default role, can be changed by wedding owner
      email: req.user.email,
      name: req.user.name,
      status: 'accepted', // Auto-accept for now (in production, might require approval)
      invitedBy: wedding.createdBy,
      invitedAt: new Date(),
      acceptedAt: new Date(),
      permissions
    });

    await collaborator.save();

    res.status(201).json({
      message: 'Successfully joined wedding',
      wedding: {
        id: wedding._id,
        name: wedding.name,
        weddingDate: wedding.weddingDate,
        venue: wedding.venue,
        theme: wedding.theme
      },
      collaborator: {
        role: collaborator.role,
        status: collaborator.status,
        permissions: collaborator.permissions
      }
    });
  } catch (error) {
    console.error('Join wedding error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: Object.values(error.errors).map(err => err.message) });
    }
    res.status(500).json({ error: 'Failed to join wedding' });
  }
});

// New: Get all weddings the user is a collaborator on
router.get('/user/weddings', authenticateToken, async (req, res) => {
  try {
    const collaborations = await Collaborator.find({
      userId: req.user._id,
      status: 'accepted'
    }).populate('weddingId');

    const weddings = collaborations
      .filter(collab => collab.weddingId) // Only include if weddingId is populated
      .map(collab => ({
        id: collab.weddingId._id,
        name: collab.weddingId.name,
        weddingDate: collab.weddingId.weddingDate,
        venue: collab.weddingId.venue,
        theme: collab.weddingId.theme,
        role: collab.role,
        status: collab.status
      }));

    res.json({ weddings });
  } catch (error) {
    console.error('Get user weddings error:', error);
    res.status(500).json({ error: 'Failed to fetch user weddings' });
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