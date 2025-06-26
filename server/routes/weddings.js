const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Get wedding information by ID (public route for RSVP page)
router.get('/:weddingId', async (req, res) => {
  try {
    const { weddingId } = req.params;
    
    const user = await User.findById(weddingId).select('name partnerName weddingDate venue city brideName groomName');
    
    if (!user) {
      return res.status(404).json({ error: 'Wedding not found' });
    }

    // Format wedding information for RSVP page
    const weddingInfo = {
      _id: user._id,
      brideName: user.brideName || user.name,
      groomName: user.groomName || user.partnerName,
      weddingDate: user.weddingDate,
      venue: user.venue || 'TBD',
      city: user.city || 'TBD'
    };

    res.json(weddingInfo);
  } catch (error) {
    console.error('Get wedding info error:', error);
    res.status(500).json({ error: 'Failed to fetch wedding information' });
  }
});

module.exports = router; 