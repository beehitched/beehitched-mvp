const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { authenticateToken: auth } = require('../utils/auth');
const Collaborator = require('../models/Collaborator');

// Test route to verify the router is loaded
router.get('/test', (req, res) => {
  res.json({ message: 'Messages router is working!' });
});

// Test endpoint to check if user has any collaborations
router.get('/test-collaboration', auth, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    console.log('Test collaboration - User ID:', userId);
    
    // Find any collaborations for this user
    const collaborations = await Collaborator.find({ 
      userId: userId
    }).populate('weddingId');
    
    console.log('Test collaboration - Found collaborations:', collaborations.length);
    
    res.json({
      userId,
      hasCollaborations: collaborations.length > 0,
      collaborations: collaborations.map(c => ({
        id: c._id,
        weddingId: c.weddingId?._id,
        weddingName: c.weddingId?.name,
        role: c.role,
        status: c.status
      }))
    });
  } catch (error) {
    console.error('Test collaboration error:', error);
    res.status(500).json({ error: 'Test failed', details: error.message });
  }
});

// Debug endpoint to check user collaborations
router.get('/debug', auth, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    console.log('Debug - User ID:', userId);
    console.log('Debug - User object:', req.user);
    
    // Find all collaborations for this user
    const collaborations = await Collaborator.find({ 
      userId: userId
    }).populate('weddingId');
    
    console.log('Debug - Found collaborations:', collaborations);
    
    res.json({
      userId,
      user: req.user,
      collaborations: collaborations,
      collaborationCount: collaborations.length
    });
  } catch (error) {
    console.error('Debug error:', error);
    res.status(500).json({ error: 'Debug failed', details: error.message });
  }
});

// Debug endpoint to check all weddings
router.get('/debug-weddings', auth, async (req, res) => {
  try {
    const Wedding = require('../models/Wedding');
    
    // Find all weddings
    const weddings = await Wedding.find({});
    console.log('Debug - All weddings:', weddings);
    
    // Find all collaborations
    const allCollaborations = await Collaborator.find({}).populate('weddingId userId');
    console.log('Debug - All collaborations:', allCollaborations);
    
    res.json({
      weddings: weddings,
      weddingCount: weddings.length,
      collaborations: allCollaborations,
      collaborationCount: allCollaborations.length
    });
  } catch (error) {
    console.error('Debug weddings error:', error);
    res.status(500).json({ error: 'Debug weddings failed', details: error.message });
  }
});

// Get all messages for a wedding
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    
    // Find the user's wedding through collaboration
    const collaboration = await Collaborator.findOne({ 
      userId: userId,
      status: 'accepted'
    }).populate('weddingId');

    if (!collaboration || !collaboration.weddingId) {
      return res.status(404).json({ error: 'No active wedding collaboration found' });
    }

    const weddingId = collaboration.weddingId._id;

    // Get group messages for this wedding (type: 'group' or no type specified)
    const messages = await Message.find({ 
      weddingId,
      $or: [
        { type: 'group' },
        { type: { $exists: false } }
      ]
    })
      .sort({ timestamp: 1 })
      .limit(100); // Limit to last 100 messages for performance

    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Get individual messages between two users
router.get('/individual/:recipientId', auth, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { recipientId } = req.params;
    
    // Find the user's wedding through collaboration
    const collaboration = await Collaborator.findOne({ 
      userId: userId,
      status: 'accepted'
    }).populate('weddingId');

    if (!collaboration || !collaboration.weddingId) {
      return res.status(404).json({ error: 'No active wedding collaboration found' });
    }

    const weddingId = collaboration.weddingId._id;

    // Verify recipient is also a collaborator for this wedding
    const recipientCollaboration = await Collaborator.findOne({
      userId: recipientId,
      weddingId: weddingId,
      status: 'accepted'
    });

    if (!recipientCollaboration) {
      return res.status(403).json({ error: 'Recipient is not a collaborator for this wedding' });
    }

    // Get individual messages between these two users
    const messages = await Message.find({
      weddingId,
      type: 'individual',
      $or: [
        { senderId: userId, recipientId: recipientId },
        { senderId: recipientId, recipientId: userId }
      ]
    })
      .sort({ timestamp: 1 })
      .limit(100);

    res.json(messages);
  } catch (error) {
    console.error('Error fetching individual messages:', error);
    res.status(500).json({ error: 'Failed to fetch individual messages' });
  }
});

// Send a new message
router.post('/', auth, async (req, res) => {
  try {
    const { content, type = 'group', recipientId } = req.body;
    const userId = req.user._id || req.user.id;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Message content is required' });
    }

    // Find the user's wedding through collaboration
    const collaboration = await Collaborator.findOne({
      userId: userId,
      status: 'accepted'
    }).populate('weddingId');

    if (!collaboration || !collaboration.weddingId) {
      return res.status(403).json({ error: 'Not authorized to send messages - no active wedding collaboration' });
    }

    const weddingId = collaboration.weddingId._id;

    // For individual messages, verify recipient is a collaborator
    if (type === 'individual') {
      if (!recipientId) {
        return res.status(400).json({ error: 'Recipient ID is required for individual messages' });
      }

      const recipientCollaboration = await Collaborator.findOne({
        userId: recipientId,
        weddingId: weddingId,
        status: 'accepted'
      });

      if (!recipientCollaboration) {
        return res.status(403).json({ error: 'Recipient is not a collaborator for this wedding' });
      }
    }

    // Create new message
    const messageData = {
      weddingId,
      senderId: userId,
      senderName: req.user.name,
      content: content.trim(),
      timestamp: new Date(),
      type: type
    };

    // Add recipientId for individual messages
    if (type === 'individual') {
      messageData.recipientId = recipientId;
    }

    const message = new Message(messageData);
    await message.save();

    // Populate sender info for response
    await message.populate('senderId', 'name');

    res.status(201).json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Get unread message count
router.get('/unread', auth, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    
    // Find the user's wedding through collaboration
    const collaboration = await Collaborator.findOne({ 
      userId: userId,
      status: 'accepted'
    }).populate('weddingId');

    if (!collaboration || !collaboration.weddingId) {
      return res.json({ unreadCount: 0 });
    }

    const weddingId = collaboration.weddingId._id;

    // For now, return 0 as we haven't implemented read tracking yet
    // In a full implementation, you'd track which messages each user has read
    res.json({ unreadCount: 0 });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({ error: 'Failed to fetch unread count' });
  }
});

// Mark messages as read (for future implementation)
router.put('/read', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { messageIds } = req.body;

    // In a full implementation, you'd update a read status for these messages
    // For now, just return success
    res.json({ success: true });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ error: 'Failed to mark messages as read' });
  }
});

module.exports = router; 