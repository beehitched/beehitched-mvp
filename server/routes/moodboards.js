const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Moodboard = require('../models/Moodboard');
const Collaborator = require('../models/Collaborator');
const { authenticateToken } = require('../utils/auth');
const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/moodboards';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'moodboard-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 10 // Max 10 files at once
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files (JPG, PNG, GIF, WebP) are allowed!'));
    }
  }
});

// Helper function to get user's wedding
const getUserWedding = async (userId) => {
  // First try to find an accepted collaborator
  let userWedding = await Collaborator.findOne({ 
    userId: userId,
    status: 'accepted'
  }).populate('weddingId');

  // If not found, try to find any collaborator (for backward compatibility)
  if (!userWedding) {
    userWedding = await Collaborator.findOne({ 
      userId: userId
    }).populate('weddingId');
  }

  if (!userWedding || !userWedding.weddingId) {
    throw new Error('No wedding found for user');
  }

  return userWedding.weddingId._id;
};

// Get all moodboards for a wedding
router.get('/', authenticateToken, async (req, res) => {
  try {
    console.log('Fetching moodboards for user:', req.user._id);
    const weddingId = await getUserWedding(req.user._id);
    console.log('Found wedding ID:', weddingId);
    
    const moodboards = await Moodboard.find({ weddingId })
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    console.log('Found moodboards:', moodboards.length);
    res.json(moodboards);
  } catch (error) {
    console.error('Get moodboards error:', error);
    res.status(500).json({ error: 'Failed to fetch moodboards', details: error.message });
  }
});

// Get moodboards by category
router.get('/category/:category', authenticateToken, async (req, res) => {
  try {
    const { category } = req.params;
    const weddingId = await getUserWedding(req.user._id);
    
    const moodboards = await Moodboard.find({ 
      weddingId, 
      category 
    }).populate('createdBy', 'name');

    res.json(moodboards);
  } catch (error) {
    console.error('Get moodboards by category error:', error);
    res.status(500).json({ error: 'Failed to fetch moodboards' });
  }
});

// Get single moodboard
router.get('/:moodboardId', authenticateToken, async (req, res) => {
  try {
    const { moodboardId } = req.params;
    const weddingId = await getUserWedding(req.user._id);
    
    const moodboard = await Moodboard.findOne({ 
      _id: moodboardId, 
      weddingId 
    }).populate('createdBy', 'name');

    if (!moodboard) {
      return res.status(404).json({ error: 'Moodboard not found' });
    }

    res.json(moodboard);
  } catch (error) {
    console.error('Get moodboard error:', error);
    res.status(500).json({ error: 'Failed to fetch moodboard' });
  }
});

// Create new moodboard
router.post('/', authenticateToken, async (req, res) => {
  try {
    console.log('Creating moodboard for user:', req.user._id);
    console.log('Moodboard data:', req.body);
    
    const { name, description, category } = req.body;
    const weddingId = await getUserWedding(req.user._id);
    console.log('Found wedding ID for creation:', weddingId);

    const moodboard = new Moodboard({
      weddingId,
      name,
      description,
      category: category || 'Other',
      createdBy: req.user._id
    });

    await moodboard.save();
    console.log('Moodboard saved successfully:', moodboard._id);
    
    const populatedMoodboard = await moodboard.populate('createdBy', 'name');
    res.status(201).json(populatedMoodboard);
  } catch (error) {
    console.error('Create moodboard error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: Object.values(error.errors).map(err => err.message) });
    }
    res.status(500).json({ error: 'Failed to create moodboard', details: error.message });
  }
});

// Update moodboard
router.put('/:moodboardId', authenticateToken, async (req, res) => {
  try {
    const { moodboardId } = req.params;
    const { name, description, category, isPublic } = req.body;
    const weddingId = await getUserWedding(req.user._id);

    const moodboard = await Moodboard.findOneAndUpdate(
      { _id: moodboardId, weddingId },
      { name, description, category, isPublic },
      { new: true, runValidators: true }
    ).populate('createdBy', 'name');

    if (!moodboard) {
      return res.status(404).json({ error: 'Moodboard not found' });
    }

    res.json(moodboard);
  } catch (error) {
    console.error('Update moodboard error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: Object.values(error.errors).map(err => err.message) });
    }
    res.status(500).json({ error: 'Failed to update moodboard' });
  }
});

// Delete moodboard
router.delete('/:moodboardId', authenticateToken, async (req, res) => {
  try {
    const { moodboardId } = req.params;
    const weddingId = await getUserWedding(req.user._id);

    const moodboard = await Moodboard.findOne({ _id: moodboardId, weddingId });
    
    if (!moodboard) {
      return res.status(404).json({ error: 'Moodboard not found' });
    }

    // Delete associated images from filesystem
    for (const image of moodboard.images) {
      const imagePath = path.join('uploads/moodboards', image.filename);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await moodboard.deleteOne();
    res.json({ message: 'Moodboard deleted successfully' });
  } catch (error) {
    console.error('Delete moodboard error:', error);
    res.status(500).json({ error: 'Failed to delete moodboard' });
  }
});

// Upload images to moodboard
router.post('/:moodboardId/images', authenticateToken, upload.array('images', 10), async (req, res) => {
  try {
    const { moodboardId } = req.params;
    const { notes, sourceUrl, sourceName } = req.body;
    const weddingId = await getUserWedding(req.user._id);

    const moodboard = await Moodboard.findOne({ _id: moodboardId, weddingId });
    
    if (!moodboard) {
      return res.status(404).json({ error: 'Moodboard not found' });
    }

    const uploadedImages = [];
    
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const imageUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/api/uploads/moodboards/${file.filename}`;
        
        const imageData = {
          filename: file.filename,
          originalName: file.originalname,
          url: imageUrl,
          notes: notes || '',
          sourceUrl: sourceUrl || '',
          sourceName: sourceName || '',
          order: moodboard.images.length + uploadedImages.length
        };

        uploadedImages.push(imageData);
      }

      moodboard.images.push(...uploadedImages);
      await moodboard.save();
    }

    const populatedMoodboard = await moodboard.populate('createdBy', 'name');
    res.status(201).json(populatedMoodboard);
  } catch (error) {
    console.error('Upload images error:', error);
    res.status(500).json({ error: 'Failed to upload images' });
  }
});

// Update image details
router.put('/:moodboardId/images/:imageId', authenticateToken, async (req, res) => {
  try {
    const { moodboardId, imageId } = req.params;
    const { notes, sourceUrl, sourceName } = req.body;
    const weddingId = await getUserWedding(req.user._id);

    const moodboard = await Moodboard.findOne({ _id: moodboardId, weddingId });
    
    if (!moodboard) {
      return res.status(404).json({ error: 'Moodboard not found' });
    }

    const image = moodboard.images.id(imageId);
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    if (notes !== undefined) image.notes = notes;
    if (sourceUrl !== undefined) image.sourceUrl = sourceUrl;
    if (sourceName !== undefined) image.sourceName = sourceName;

    await moodboard.save();
    
    const populatedMoodboard = await moodboard.populate('createdBy', 'name');
    res.json(populatedMoodboard);
  } catch (error) {
    console.error('Update image error:', error);
    res.status(500).json({ error: 'Failed to update image' });
  }
});

// Delete image from moodboard
router.delete('/:moodboardId/images/:imageId', authenticateToken, async (req, res) => {
  try {
    const { moodboardId, imageId } = req.params;
    const weddingId = await getUserWedding(req.user._id);

    const moodboard = await Moodboard.findOne({ _id: moodboardId, weddingId });
    
    if (!moodboard) {
      return res.status(404).json({ error: 'Moodboard not found' });
    }

    // Delete image file from filesystem
    const imagePath = path.join('uploads/moodboards', image.filename);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    moodboard.images.pull(imageId);
    await moodboard.save();
    
    const populatedMoodboard = await moodboard.populate('createdBy', 'name');
    res.json(populatedMoodboard);
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

// Update image positions (drag and drop)
router.put('/:moodboardId/reorder', authenticateToken, async (req, res) => {
  try {
    const { moodboardId } = req.params;
    const { imageOrders } = req.body; // Array of { imageId, order, position }
    const weddingId = await getUserWedding(req.user._id);

    const moodboard = await Moodboard.findOne({ _id: moodboardId, weddingId });
    
    if (!moodboard) {
      return res.status(404).json({ error: 'Moodboard not found' });
    }

    // Update each image's order and position
    for (const { imageId, order, position } of imageOrders) {
      const image = moodboard.images.id(imageId);
      if (image) {
        image.order = order;
        if (position) {
          image.position = position;
        }
      }
    }

    await moodboard.save();
    
    const populatedMoodboard = await moodboard.populate('createdBy', 'name');
    res.json(populatedMoodboard);
  } catch (error) {
    console.error('Reorder images error:', error);
    res.status(500).json({ error: 'Failed to reorder images' });
  }
});

// Serve uploaded images
router.get('/uploads/moodboards/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, '../uploads/moodboards', filename);
  
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ error: 'Image not found' });
  }
});

module.exports = router; 