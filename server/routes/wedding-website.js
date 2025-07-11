const express = require('express');
const WeddingWebsite = require('../models/WeddingWebsite');
const Wedding = require('../models/Wedding');
const { authenticateToken } = require('../utils/auth');
const router = express.Router();

// Get wedding website by wedding ID (for builder)
router.get('/wedding/:weddingId', authenticateToken, async (req, res) => {
  try {
    const { weddingId } = req.params;
    
    // Check if user has access to this wedding
    const wedding = await Wedding.findById(weddingId);
    if (!wedding) {
      return res.status(404).json({ error: 'Wedding not found' });
    }

    // Check if user is wedding owner or collaborator
    const isOwner = wedding.createdBy.toString() === req.user._id.toString();
    if (!isOwner) {
      return res.status(403).json({ error: 'Access denied' });
    }

    let website = await WeddingWebsite.findOne({ weddingId });
    
    if (!website) {
      // Create default website if it doesn't exist
      website = new WeddingWebsite({
        weddingId,
        slug: generateDefaultSlug(wedding.name),
        createdBy: req.user._id,
        sections: getDefaultSections(wedding)
      });
      await website.save();
    }

    res.json(website);
  } catch (error) {
    console.error('Get wedding website error:', error);
    res.status(500).json({ error: 'Failed to fetch wedding website' });
  }
});

// Get public wedding website by slug
router.get('/public/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    const website = await WeddingWebsite.findOne({ 
      slug, 
      isPublished: true 
    }).populate('weddingId');

    if (!website) {
      return res.status(404).json({ error: 'Wedding website not found' });
    }

    res.json(website);
  } catch (error) {
    console.error('Get public website error:', error);
    res.status(500).json({ error: 'Failed to fetch wedding website' });
  }
});

// Update wedding website
router.put('/wedding/:weddingId', authenticateToken, async (req, res) => {
  try {
    const { weddingId } = req.params;
    const updateData = req.body;

    // Check if user has access to this wedding
    const wedding = await Wedding.findById(weddingId);
    if (!wedding) {
      return res.status(404).json({ error: 'Wedding not found' });
    }

    const isOwner = wedding.createdBy.toString() === req.user._id.toString();
    if (!isOwner) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // If slug is being updated, validate uniqueness
    if (updateData.slug) {
      const existingWebsite = await WeddingWebsite.findOne({ 
        slug: updateData.slug,
        weddingId: { $ne: weddingId }
      });
      
      if (existingWebsite) {
        return res.status(400).json({ error: 'This URL is already taken. Please choose a different one.' });
      }
    }

    const website = await WeddingWebsite.findOneAndUpdate(
      { weddingId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!website) {
      return res.status(404).json({ error: 'Wedding website not found' });
    }

    res.json(website);
  } catch (error) {
    console.error('Update wedding website error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: Object.values(error.errors).map(err => err.message) });
    }
    res.status(500).json({ error: 'Failed to update wedding website' });
  }
});

// Validate slug availability
router.post('/validate-slug', authenticateToken, async (req, res) => {
  try {
    const { slug, weddingId } = req.body;

    if (!slug) {
      return res.status(400).json({ error: 'Slug is required' });
    }

    // Check if slug matches pattern
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return res.status(400).json({ error: 'Slug can only contain lowercase letters, numbers, and hyphens' });
    }

    // Check if slug is reserved
    const reservedSlugs = ['admin', 'api', 'login', 'register', 'dashboard', 'settings', 'preview'];
    if (reservedSlugs.includes(slug)) {
      return res.status(400).json({ error: 'This URL is reserved and cannot be used' });
    }

    // Check if slug already exists
    const existingWebsite = await WeddingWebsite.findOne({ 
      slug,
      weddingId: { $ne: weddingId }
    });

    if (existingWebsite) {
      return res.json({ available: false, message: 'This URL is already taken' });
    }

    res.json({ available: true, message: 'URL is available' });
  } catch (error) {
    console.error('Validate slug error:', error);
    res.status(500).json({ error: 'Failed to validate slug' });
  }
});

// Publish/unpublish website
router.post('/wedding/:weddingId/publish', authenticateToken, async (req, res) => {
  try {
    const { weddingId } = req.params;
    const { isPublished } = req.body;

    // Check if user has access to this wedding
    const wedding = await Wedding.findById(weddingId);
    if (!wedding) {
      return res.status(404).json({ error: 'Wedding not found' });
    }

    const isOwner = wedding.createdBy.toString() === req.user._id.toString();
    if (!isOwner) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const website = await WeddingWebsite.findOneAndUpdate(
      { weddingId },
      { 
        isPublished,
        publishedAt: isPublished ? new Date() : null
      },
      { new: true }
    );

    if (!website) {
      return res.status(404).json({ error: 'Wedding website not found' });
    }

    res.json(website);
  } catch (error) {
    console.error('Publish website error:', error);
    res.status(500).json({ error: 'Failed to update website status' });
  }
});

// Get website analytics (basic)
router.get('/wedding/:weddingId/analytics', authenticateToken, async (req, res) => {
  try {
    const { weddingId } = req.params;
    
    // Check if user has access to this wedding
    const wedding = await Wedding.findById(weddingId);
    if (!wedding) {
      return res.status(404).json({ error: 'Wedding not found' });
    }

    const isOwner = wedding.createdBy.toString() === req.user._id.toString();
    if (!isOwner) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const website = await WeddingWebsite.findOne({ weddingId });
    if (!website) {
      return res.status(404).json({ error: 'Wedding website not found' });
    }

    // Basic analytics (you can expand this later)
    const analytics = {
      isPublished: website.isPublished,
      publishedAt: website.publishedAt,
      lastUpdated: website.updatedAt,
      sectionsCount: website.sections.length,
      enabledSectionsCount: website.sections.filter(s => s.isEnabled).length,
      hasCustomDomain: !!website.customDomain,
      slug: website.slug
    };

    res.json(analytics);
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Helper functions
function generateDefaultSlug(weddingName) {
  const baseSlug = weddingName
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '')
    .substring(0, 20);
  
  return `${baseSlug}${Date.now().toString().slice(-4)}`;
}

function getDefaultSections(wedding) {
  return [
    {
      type: 'hero',
      title: 'Welcome to Our Wedding',
      order: 1,
      content: {
        headline: `${wedding.name}`,
        subtitle: 'We\'re getting married!',
        date: wedding.weddingDate,
        venue: wedding.venue || '',
        backgroundImage: ''
      },
      isEnabled: true
    },
    {
      type: 'story',
      title: 'Our Story',
      order: 2,
      content: {
        story: 'Share your love story here...',
        photos: []
      },
      isEnabled: true
    },
    {
      type: 'event-details',
      title: 'Event Details',
      order: 3,
      content: {
        ceremony: {
          time: '',
          location: '',
          address: '',
          description: ''
        },
        reception: {
          time: '',
          location: '',
          address: '',
          description: ''
        }
      },
      isEnabled: true
    },
    {
      type: 'rsvp',
      title: 'RSVP',
      order: 4,
      content: {
        message: 'Please RSVP by [date]',
        deadline: '',
        allowPlusOne: true
      },
      isEnabled: true
    },
    {
      type: 'gallery',
      title: 'Photo Gallery',
      order: 5,
      content: {
        photos: [],
        layout: 'grid'
      },
      isEnabled: false
    },
    {
      type: 'registry',
      title: 'Registry',
      order: 6,
      content: {
        message: 'Your presence is our present, but if you\'d like to give a gift...',
        links: []
      },
      isEnabled: false
    }
  ];
}

module.exports = router; 