const express = require('express');
const User = require('../models/User');
const Wedding = require('../models/Wedding');
const Collaborator = require('../models/Collaborator');
const Task = require('../models/Task');
const Message = require('../models/Message');
const Moodboard = require('../models/Moodboard');
const { authenticateToken } = require('../utils/auth');
const router = express.Router();

// Middleware to check if user is admin
const requireAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const user = await User.findById(req.user._id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Apply admin middleware to all routes
router.use(authenticateToken, requireAdmin);

// Get dashboard overview
router.get('/dashboard', async (req, res) => {
  try {
    const [
      totalUsers,
      activeUsers,
      totalWeddings,
      totalTasks,
      totalMessages,
      totalMoodboards,
      recentSignups,
      userGrowth
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      Wedding.countDocuments(),
      Task.countDocuments(),
      Message.countDocuments(),
      Moodboard.countDocuments(),
      User.find({ createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } }).countDocuments(),
      User.aggregate([
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
              day: { $dayOfMonth: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
        { $limit: 30 }
      ])
    ]);

    // Get feature usage statistics
    const featureUsage = await Promise.all([
      Wedding.aggregate([
        { $group: { _id: null, total: { $sum: 1 }, withGuests: { $sum: { $cond: [{ $gt: ['$guestCount', 0] }, 1, 0] } } } }
      ]),
      Task.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      Collaborator.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ])
    ]);

    res.json({
      overview: {
        totalUsers,
        activeUsers,
        totalWeddings,
        totalTasks,
        totalMessages,
        totalMoodboards,
        recentSignups
      },
      userGrowth,
      featureUsage: {
        weddings: featureUsage[0][0] || { total: 0, withGuests: 0 },
        tasks: featureUsage[1],
        collaborators: featureUsage[2]
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Get all users with pagination and search
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '', status = 'all' } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (status === 'active') {
      query.isActive = true;
    } else if (status === 'inactive') {
      query.isActive = false;
    }

    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      User.countDocuments(query)
    ]);

    res.json({
      users,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Users fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get user details
router.get('/users/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user's weddings
    const weddings = await Wedding.find({ createdBy: req.params.userId });
    
    // Get user's collaborations
    const collaborations = await Collaborator.find({ userId: req.params.userId }).populate('weddingId');
    
    // Get user's tasks
    const tasks = await Task.find({ assignedTo: req.params.userId });

    res.json({
      user,
      weddings,
      collaborations,
      tasks
    });
  } catch (error) {
    console.error('User details error:', error);
    res.status(500).json({ error: 'Failed to fetch user details' });
  }
});

// Update user status
router.patch('/users/:userId/status', async (req, res) => {
  try {
    const { isActive } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { isActive },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      user
    });
  } catch (error) {
    console.error('User status update error:', error);
    res.status(500).json({ error: 'Failed to update user status' });
  }
});

// Delete user
router.delete('/users/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Soft delete - mark as inactive
    user.isActive = false;
    await user.save();

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('User deletion error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Get analytics data
router.get('/analytics', async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period);
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // User signups over time
    const signups = await User.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    // Wedding creation over time
    const weddings = await Wedding.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    // Task completion over time
    const tasks = await Task.aggregate([
      { $match: { updatedAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            year: { $year: '$updatedAt' },
            month: { $month: '$updatedAt' },
            day: { $dayOfMonth: '$updatedAt' }
          },
          completed: { $sum: { $cond: [{ $eq: ['$status', 'Done'] }, 1, 0] } },
          total: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    // Feature usage statistics
    const featureStats = await Promise.all([
      Wedding.aggregate([
        { $group: { _id: null, total: { $sum: 1 }, avgBudget: { $avg: '$budget' }, avgGuests: { $avg: '$guestCount' } } }
      ]),
      Task.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      Collaborator.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      Message.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        { $group: { _id: null, total: { $sum: 1 } } }
      ])
    ]);

    res.json({
      signups,
      weddings,
      tasks,
      featureStats: {
        weddings: featureStats[0][0] || { total: 0, avgBudget: 0, avgGuests: 0 },
        tasks: featureStats[1],
        collaborators: featureStats[2],
        messages: featureStats[3][0] || { total: 0 }
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Get feature usage details
router.get('/features', async (req, res) => {
  try {
    const { feature } = req.query;

    let data = {};

    switch (feature) {
      case 'timeline':
        data = await Task.aggregate([
          { $group: { _id: '$category', count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ]);
        break;
      
      case 'collaboration':
        data = await Collaborator.aggregate([
          { $group: { _id: '$role', count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ]);
        break;
      
      case 'messaging':
        data = await Message.aggregate([
          { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
          { $sort: { _id: -1 } },
          { $limit: 30 }
        ]);
        break;
      
      case 'moodboard':
        data = await Moodboard.aggregate([
          { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
          { $sort: { _id: -1 } },
          { $limit: 30 }
        ]);
        break;
      
      default:
        data = {
          timeline: await Task.countDocuments(),
          collaboration: await Collaborator.countDocuments(),
          messaging: await Message.countDocuments(),
          moodboard: await Moodboard.countDocuments()
        };
    }

    res.json({ data });
  } catch (error) {
    console.error('Feature usage error:', error);
    res.status(500).json({ error: 'Failed to fetch feature usage' });
  }
});

// Get system health
router.get('/health', async (req, res) => {
  try {
    const stats = await Promise.all([
      User.countDocuments(),
      Wedding.countDocuments(),
      Task.countDocuments(),
      Message.countDocuments(),
      Collaborator.countDocuments(),
      Moodboard.countDocuments()
    ]);

    res.json({
      users: stats[0],
      weddings: stats[1],
      tasks: stats[2],
      messages: stats[3],
      collaborators: stats[4],
      moodboards: stats[5],
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({ error: 'Health check failed' });
  }
});

module.exports = router; 