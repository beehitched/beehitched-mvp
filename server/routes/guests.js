const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const Guest = require('../models/Guest');
const { authenticateToken } = require('../utils/auth');
const User = require('../models/User');
const Collaborator = require('../models/Collaborator');
const router = express.Router();

// Configure multer for CSV upload
const upload = multer({
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Get all guests for a user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { group, rsvpStatus, search } = req.query;
    
    // Find the user's wedding through collaboration
    const userWedding = await Collaborator.findOne({ 
      userId: req.user._id,
      status: 'accepted'
    }).populate('weddingId');

    if (!userWedding || !userWedding.weddingId) {
      return res.status(404).json({ error: 'No wedding found for user' });
    }
    
    // Handle both old and new guest structures
    // Old guests: user field contains user ID
    // New guests: user field contains wedding ID
    const query = {
      $or: [
        { user: userWedding.weddingId._id }, // New structure: wedding ID
        { user: req.user._id } // Old structure: user ID (for backward compatibility)
      ]
    };
    
    if (group) query.group = group;
    if (rsvpStatus) query.rsvpStatus = rsvpStatus;
    if (search) {
      query.$and = [{
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { group: { $regex: search, $options: 'i' } }
        ]
      }];
    }

    const guests = await Guest.find(query)
      .sort({ name: 1 });

    // Return flat array instead of paginated data
    res.json(guests);
  } catch (error) {
    console.error('Fetch guests error:', error);
    res.status(500).json({ error: 'Failed to fetch guests' });
  }
});

// Get guest statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    // Find the user's wedding through collaboration
    const userWedding = await Collaborator.findOne({ 
      userId: req.user._id,
      status: 'accepted'
    }).populate('weddingId');

    if (!userWedding || !userWedding.weddingId) {
      return res.status(404).json({ error: 'No wedding found for user' });
    }

    const stats = await Guest.aggregate([
      { 
        $match: {
          $or: [
            { user: userWedding.weddingId._id }, // New structure: wedding ID
            { user: req.user._id } // Old structure: user ID (for backward compatibility)
          ]
        }
      },
      {
        $group: {
          _id: '$rsvpStatus',
          count: { $sum: 1 }
        }
      }
    ]);

    const groupStats = await Guest.aggregate([
      { 
        $match: {
          $or: [
            { user: userWedding.weddingId._id }, // New structure: wedding ID
            { user: req.user._id } // Old structure: user ID (for backward compatibility)
          ]
        }
      },
      {
        $group: {
          _id: '$group',
          count: { $sum: 1 },
          attending: {
            $sum: { $cond: [{ $eq: ['$rsvpStatus', 'Attending'] }, 1, 0] }
          }
        }
      }
    ]);

    const totalGuests = await Guest.countDocuments({
      $or: [
        { user: userWedding.weddingId._id }, // New structure: wedding ID
        { user: req.user._id } // Old structure: user ID (for backward compatibility)
      ]
    });
    const attendingGuests = await Guest.countDocuments({ 
      $or: [
        { user: userWedding.weddingId._id }, // New structure: wedding ID
        { user: req.user._id } // Old structure: user ID (for backward compatibility)
      ],
      rsvpStatus: 'Attending' 
    });

    res.json({
      totalGuests,
      attendingGuests,
      rsvpRate: totalGuests > 0 ? (attendingGuests / totalGuests) * 100 : 0,
      rsvpStats: stats,
      groupStats
    });
  } catch (error) {
    console.error('Guest stats error:', error);
    res.status(500).json({ error: 'Failed to fetch guest statistics' });
  }
});

// Create guest
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      rsvpStatus,
      dietaryRestrictions,
      group,
      plusOne,
      tableNumber,
      isVip,
      notes
    } = req.body;

    // Find the user's wedding through collaboration
    const userWedding = await Collaborator.findOne({ 
      userId: req.user._id,
      status: 'accepted'
    }).populate('weddingId');

    if (!userWedding || !userWedding.weddingId) {
      return res.status(404).json({ error: 'No wedding found for user' });
    }

    // Validate rsvpStatus enum value
    const validRsvpStatuses = ['Pending', 'Attending', 'Not Attending', 'Maybe'];
    const finalRsvpStatus = rsvpStatus && validRsvpStatuses.includes(rsvpStatus) ? rsvpStatus : 'Pending';

    const guest = new Guest({
      user: userWedding.weddingId._id, // Store wedding ID instead of user ID
      name,
      email,
      phone,
      rsvpStatus: finalRsvpStatus,
      dietaryRestrictions,
      group,
      plusOne,
      tableNumber,
      isVip,
      notes,
      createdBy: req.user._id
    });

    await guest.save();
    res.status(201).json({ guest });
  } catch (error) {
    console.error('Create guest error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: Object.values(error.errors).map(err => err.message) });
    }
    res.status(500).json({ error: 'Failed to create guest' });
  }
});

// Update guest
router.put('/:guestId', authenticateToken, async (req, res) => {
  try {
    const { guestId } = req.params;
    const updateData = req.body;

    // Find the user's wedding through collaboration
    const userWedding = await Collaborator.findOne({ 
      userId: req.user._id,
      status: 'accepted'
    }).populate('weddingId');

    if (!userWedding || !userWedding.weddingId) {
      return res.status(404).json({ error: 'No wedding found for user' });
    }

    const guest = await Guest.findOneAndUpdate(
      { 
        _id: guestId, 
        $or: [
          { user: userWedding.weddingId._id }, // New structure: wedding ID
          { user: req.user._id } // Old structure: user ID (for backward compatibility)
        ]
      },
      updateData,
      { new: true, runValidators: true }
    );

    if (!guest) {
      return res.status(404).json({ error: 'Guest not found' });
    }

    res.json({ guest });
  } catch (error) {
    console.error('Update guest error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: Object.values(error.errors).map(err => err.message) });
    }
    res.status(500).json({ error: 'Failed to update guest' });
  }
});

// Delete guest
router.delete('/:guestId', authenticateToken, async (req, res) => {
  try {
    const { guestId } = req.params;

    // Find the user's wedding through collaboration
    const userWedding = await Collaborator.findOne({ 
      userId: req.user._id,
      status: 'accepted'
    }).populate('weddingId');

    if (!userWedding || !userWedding.weddingId) {
      return res.status(404).json({ error: 'No wedding found for user' });
    }

    const guest = await Guest.findOneAndDelete({ 
      _id: guestId, 
      $or: [
        { user: userWedding.weddingId._id }, // New structure: wedding ID
        { user: req.user._id } // Old structure: user ID (for backward compatibility)
      ]
    });

    if (!guest) {
      return res.status(404).json({ error: 'Guest not found' });
    }

    res.json({ message: 'Guest deleted successfully' });
  } catch (error) {
    console.error('Delete guest error:', error);
    res.status(500).json({ error: 'Failed to delete guest' });
  }
});

// Bulk update RSVP status
router.put('/bulk/rsvp', authenticateToken, async (req, res) => {
  try {
    const { guestIds, rsvpStatus } = req.body;

    if (!guestIds || !Array.isArray(guestIds) || !rsvpStatus) {
      return res.status(400).json({ error: 'Guest IDs array and RSVP status are required' });
    }

    // Find the user's wedding through collaboration
    const userWedding = await Collaborator.findOne({ 
      userId: req.user._id,
      status: 'accepted'
    }).populate('weddingId');

    if (!userWedding || !userWedding.weddingId) {
      return res.status(404).json({ error: 'No wedding found for user' });
    }

    const result = await Guest.updateMany(
      { 
        _id: { $in: guestIds }, 
        $or: [
          { user: userWedding.weddingId._id }, // New structure: wedding ID
          { user: req.user._id } // Old structure: user ID (for backward compatibility)
        ]
      },
      { 
        rsvpStatus,
        rsvpDate: rsvpStatus !== 'Pending' ? new Date() : null
      }
    );

    res.json({ 
      message: `Updated ${result.modifiedCount} guests`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Bulk RSVP update error:', error);
    res.status(500).json({ error: 'Failed to update RSVP status' });
  }
});

// Import guests from CSV
router.post('/import', authenticateToken, upload.single('csvFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'CSV file is required' });
    }

    // Find the user's wedding through collaboration
    const userWedding = await Collaborator.findOne({ 
      userId: req.user._id,
      status: 'accepted'
    }).populate('weddingId');

    if (!userWedding || !userWedding.weddingId) {
      return res.status(404).json({ error: 'No wedding found for user' });
    }

    const guests = [];
    const errors = [];

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (row) => {
        // Validate required fields
        if (!row.name) {
          errors.push(`Row missing name: ${JSON.stringify(row)}`);
          return;
        }

        const guest = {
          user: userWedding.weddingId._id, // Store wedding ID instead of user ID
          name: row.name.trim(),
          email: row.email ? row.email.trim() : '',
          phone: row.phone ? row.phone.trim() : '',
          rsvpStatus: row.rsvpStatus || 'Pending',
          dietaryRestrictions: row.dietaryRestrictions ? row.dietaryRestrictions.trim() : '',
          group: row.group ? row.group.trim() : '',
          notes: row.notes ? row.notes.trim() : '',
          createdBy: req.user._id
        };

        // Validate email format
        if (guest.email && !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(guest.email)) {
          errors.push(`Invalid email for ${guest.name}: ${guest.email}`);
          return;
        }

        // Validate rsvpStatus enum value
        const validRsvpStatuses = ['Pending', 'Attending', 'Not Attending', 'Maybe'];
        if (guest.rsvpStatus && !validRsvpStatuses.includes(guest.rsvpStatus)) {
          guest.rsvpStatus = 'Pending';
        }

        guests.push(guest);
      })
      .on('end', async () => {
        try {
          // Clean up uploaded file
          fs.unlinkSync(req.file.path);

          if (guests.length === 0) {
            return res.status(400).json({ 
              error: 'No valid guests found in CSV file',
              errors 
            });
          }

          // Insert guests in batches
          const batchSize = 100;
          let insertedCount = 0;

          for (let i = 0; i < guests.length; i += batchSize) {
            const batch = guests.slice(i, i + batchSize);
            await Guest.insertMany(batch, { ordered: false });
            insertedCount += batch.length;
          }

          res.json({
            message: `Successfully imported ${insertedCount} guests`,
            imported: insertedCount,
            errors: errors.length > 0 ? errors : undefined
          });
        } catch (insertError) {
          console.error('CSV import insert error:', insertError);
          res.status(500).json({ 
            error: 'Failed to import guests',
            details: insertError.message
          });
        }
      })
      .on('error', (error) => {
        // Clean up uploaded file
        if (req.file && fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
        console.error('CSV parsing error:', error);
        res.status(500).json({ error: 'Failed to parse CSV file' });
      });

  } catch (error) {
    // Clean up uploaded file
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    console.error('CSV import error:', error);
    res.status(500).json({ error: 'Failed to import guests' });
  }
});

// Export guests to CSV
router.get('/export', authenticateToken, async (req, res) => {
  try {
    // Find the user's wedding through collaboration
    const userWedding = await Collaborator.findOne({ 
      userId: req.user._id,
      status: 'accepted'
    }).populate('weddingId');

    if (!userWedding || !userWedding.weddingId) {
      return res.status(404).json({ error: 'No wedding found for user' });
    }

    const guests = await Guest.find({
      $or: [
        { user: userWedding.weddingId._id }, // New structure: wedding ID
        { user: req.user._id } // Old structure: user ID (for backward compatibility)
      ]
    }).sort({ name: 1 });

    const csvData = guests.map(guest => ({
      name: guest.name,
      email: guest.email || '',
      phone: guest.phone || '',
      rsvpStatus: guest.rsvpStatus,
      dietaryRestrictions: guest.dietaryRestrictions || '',
      group: guest.group || '',
      tableNumber: guest.tableNumber || '',
      isVip: guest.isVip ? 'Yes' : 'No',
      notes: guest.notes || '',
      invitedDate: guest.invitedDate.toISOString().split('T')[0]
    }));

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=guests.csv');

    // Convert to CSV
    const csvString = [
      Object.keys(csvData[0] || {}).join(','),
      ...csvData.map(row => Object.values(row).map(value => `"${value}"`).join(','))
    ].join('\n');

    res.send(csvString);
  } catch (error) {
    console.error('Export guests error:', error);
    res.status(500).json({ error: 'Failed to export guests' });
  }
});

// Public RSVP submission (for QR code)
router.post('/rsvp/:weddingId', async (req, res) => {
  try {
    const { weddingId } = req.params;
    const {
      name,
      email,
      phone,
      rsvpStatus,
      plusOne,
      plusOneName,
      dietaryRestrictions,
      group,
      notes
    } = req.body;

    // Validate required fields
    if (!name || !rsvpStatus) {
      return res.status(400).json({ error: 'Name and RSVP status are required' });
    }

    // Validate rsvpStatus enum value
    const validRsvpStatuses = ['Pending', 'Attending', 'Not Attending', 'Maybe'];
    const finalRsvpStatus = validRsvpStatuses.includes(rsvpStatus) ? rsvpStatus : 'Pending';

    // Find the user by wedding ID
    const user = await User.findById(weddingId);
    if (!user) {
      return res.status(404).json({ error: 'Wedding not found' });
    }

    // Check if guest already exists
    let existingGuest = null;
    if (email) {
      existingGuest = await Guest.findOne({ 
        user: weddingId, 
        email: email.toLowerCase() 
      });
    }

    if (existingGuest) {
      // Update existing guest
      existingGuest.name = name;
      existingGuest.phone = phone || existingGuest.phone;
      existingGuest.rsvpStatus = finalRsvpStatus;
      existingGuest.plusOne = plusOne;
      existingGuest.plusOneName = plusOneName;
      existingGuest.dietaryRestrictions = dietaryRestrictions;
      existingGuest.group = group;
      existingGuest.notes = notes;
      existingGuest.rsvpDate = new Date();

      await existingGuest.save();
      res.json({ 
        message: 'RSVP updated successfully',
        guest: existingGuest
      });
    } else {
      // Create new guest
      const guest = new Guest({
        user: weddingId,
        name,
        email: email ? email.toLowerCase() : '',
        phone: phone || '',
        rsvpStatus: finalRsvpStatus,
        plusOne,
        plusOneName,
        dietaryRestrictions,
        group,
        notes,
        rsvpDate: new Date(),
        createdBy: weddingId // For public RSVP, use wedding ID as createdBy
      });

      await guest.save();
      res.status(201).json({ 
        message: 'RSVP submitted successfully',
        guest
      });
    }
  } catch (error) {
    console.error('Public RSVP error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: Object.values(error.errors).map(err => err.message) });
    }
    res.status(500).json({ error: 'Failed to submit RSVP' });
  }
});

module.exports = router;