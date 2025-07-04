const express = require('express');
const Task = require('../models/Task');
const Collaborator = require('../models/Collaborator');
const { authenticateToken } = require('../utils/auth');
const router = express.Router();

// Get all tasks for a user
router.get('/', authenticateToken, async (req, res) => {
  try {
    // Find the user's wedding through collaboration
    const userWedding = await Collaborator.findOne({ 
      userId: req.user._id,
      status: 'accepted'
    }).populate('weddingId');

    if (!userWedding || !userWedding.weddingId) {
      return res.status(404).json({ error: 'No wedding found for user' });
    }

    // Get all tasks for this wedding (handle both old and new task structure)
    // Old tasks: user field contains user ID
    // New tasks: user field contains wedding ID
    const tasks = await Task.find({
      $or: [
        { user: userWedding.weddingId._id }, // New structure: wedding ID
        { user: req.user._id } // Old structure: user ID (for backward compatibility)
      ]
    }).sort({ order: 1, createdAt: -1 });

    // Return flat array instead of grouped data
    res.json(tasks);
  } catch (error) {
    console.error('Fetch tasks error:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Create new task
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      status,
      priority,
      dueDate,
      budget,
      assignedTo,
      assignedRoles,
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

    // Check if user has permission to edit timeline
    if (!userWedding.permissions.canEditTimeline) {
      return res.status(403).json({ error: 'Permission denied' });
    }

    // Get the highest order number for the category
    const lastTask = await Task.findOne({ 
      user: req.user._id, 
      category 
    }).sort({ order: -1 });
    
    const order = lastTask ? lastTask.order + 1 : 0;

    const task = new Task({
      user: userWedding.weddingId._id,
      title,
      description,
      category,
      status,
      priority,
      dueDate: dueDate ? new Date(dueDate) : null,
      budget,
      assignedTo,
      assignedRoles: assignedRoles || [],
      notes,
      order,
      createdBy: req.user._id
    });

    await task.save();
    res.status(201).json({ task });
  } catch (error) {
    console.error('Create task error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: Object.values(error.errors).map(err => err.message) });
    }
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Update task
router.put('/:taskId', authenticateToken, async (req, res) => {
  try {
    const { taskId } = req.params;
    const updateData = req.body;

    // Find the user's wedding through collaboration
    const userWedding = await Collaborator.findOne({ 
      userId: req.user._id,
      status: 'accepted'
    }).populate('weddingId');

    if (!userWedding || !userWedding.weddingId) {
      return res.status(404).json({ error: 'No wedding found for user' });
    }

    // Check if user has permission to edit timeline
    if (!userWedding.permissions.canEditTimeline) {
      return res.status(403).json({ error: 'Permission denied' });
    }

    // Convert dueDate to Date object if provided
    if (updateData.dueDate) {
      updateData.dueDate = new Date(updateData.dueDate);
    }

    // Convert dateCompleted to Date object if provided
    if (updateData.completionDetails && updateData.completionDetails.dateCompleted) {
      updateData.completionDetails.dateCompleted = new Date(updateData.completionDetails.dateCompleted);
    }

    const task = await Task.findOneAndUpdate(
      { 
        _id: taskId, 
        $or: [
          { user: userWedding.weddingId._id }, // New structure: wedding ID
          { user: req.user._id } // Old structure: user ID (for backward compatibility)
        ]
      },
      updateData,
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ task });
  } catch (error) {
    console.error('Update task error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: Object.values(error.errors).map(err => err.message) });
    }
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Delete task
router.delete('/:taskId', authenticateToken, async (req, res) => {
  try {
    const { taskId } = req.params;

    // Find the user's wedding through collaboration
    const userWedding = await Collaborator.findOne({ 
      userId: req.user._id,
      status: 'accepted'
    }).populate('weddingId');

    if (!userWedding || !userWedding.weddingId) {
      return res.status(404).json({ error: 'No wedding found for user' });
    }

    // Check if user has permission to edit timeline
    if (!userWedding.permissions.canEditTimeline) {
      return res.status(403).json({ error: 'Permission denied' });
    }

    const task = await Task.findOneAndDelete({ 
      _id: taskId, 
      $or: [
        { user: userWedding.weddingId._id }, // New structure: wedding ID
        { user: req.user._id } // Old structure: user ID (for backward compatibility)
      ]
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// Update task order (for drag and drop)
router.put('/:taskId/order', authenticateToken, async (req, res) => {
  try {
    const { taskId } = req.params;
    const { newOrder, newCategory } = req.body;

    // Find the user's wedding through collaboration
    const userWedding = await Collaborator.findOne({ 
      userId: req.user._id,
      status: 'accepted'
    }).populate('weddingId');

    if (!userWedding || !userWedding.weddingId) {
      return res.status(404).json({ error: 'No wedding found for user' });
    }

    // Check if user has permission to edit timeline
    if (!userWedding.permissions.canEditTimeline) {
      return res.status(403).json({ error: 'Permission denied' });
    }

    const task = await Task.findOne({ 
      _id: taskId, 
      $or: [
        { user: userWedding.weddingId._id }, // New structure: wedding ID
        { user: req.user._id } // Old structure: user ID (for backward compatibility)
      ]
    });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const oldCategory = task.category;
    const oldOrder = task.order;

    // If category changed, reorder tasks in both categories
    if (newCategory && newCategory !== oldCategory) {
      // Remove from old category
      await Task.updateMany(
        { 
          $or: [
            { user: userWedding.weddingId._id }, // New structure: wedding ID
            { user: req.user._id } // Old structure: user ID (for backward compatibility)
          ],
          category: oldCategory, 
          order: { $gt: oldOrder } 
        },
        { $inc: { order: -1 } }
      );

      // Add to new category
      await Task.updateMany(
        { 
          $or: [
            { user: userWedding.weddingId._id }, // New structure: wedding ID
            { user: req.user._id } // Old structure: user ID (for backward compatibility)
          ],
          category: newCategory, 
          order: { $gte: newOrder } 
        },
        { $inc: { order: 1 } }
      );

      task.category = newCategory;
    } else {
      // Same category, just reorder
      if (newOrder > oldOrder) {
        await Task.updateMany(
          { 
            $or: [
              { user: userWedding.weddingId._id }, // New structure: wedding ID
              { user: req.user._id } // Old structure: user ID (for backward compatibility)
            ],
            category: oldCategory, 
            order: { $gt: oldOrder, $lte: newOrder } 
          },
          { $inc: { order: -1 } }
        );
      } else {
        await Task.updateMany(
          { 
            $or: [
              { user: userWedding.weddingId._id }, // New structure: wedding ID
              { user: req.user._id } // Old structure: user ID (for backward compatibility)
            ],
            category: oldCategory, 
            order: { $gte: newOrder, $lt: oldOrder } 
          },
          { $inc: { order: 1 } }
        );
      }
    }

    task.order = newOrder;
    await task.save();

    res.json({ task });
  } catch (error) {
    console.error('Reorder task error:', error);
    res.status(500).json({ error: 'Failed to reorder task' });
  }
});

// Mark task as completed
router.put('/:taskId/complete', authenticateToken, async (req, res) => {
  try {
    const { taskId } = req.params;
    const { isCompleted } = req.body;

    // Find the user's wedding through collaboration
    const userWedding = await Collaborator.findOne({ 
      userId: req.user._id,
      status: 'accepted'
    }).populate('weddingId');

    if (!userWedding || !userWedding.weddingId) {
      return res.status(404).json({ error: 'No wedding found for user' });
    }

    // Check if user has permission to edit timeline
    if (!userWedding.permissions.canEditTimeline) {
      return res.status(403).json({ error: 'Permission denied' });
    }

    const task = await Task.findOne({ 
      _id: taskId, 
      $or: [
        { user: userWedding.weddingId._id }, // New structure: wedding ID
        { user: req.user._id } // Old structure: user ID (for backward compatibility)
      ]
    });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    task.isCompleted = isCompleted;
    task.status = isCompleted ? 'Done' : 'To Do';
    task.completedDate = isCompleted ? new Date() : null;

    await task.save();
    res.json({ task });
  } catch (error) {
    console.error('Complete task error:', error);
    res.status(500).json({ error: 'Failed to update task completion' });
  }
});

// Get task statistics
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

    const stats = await Task.aggregate([
      { $match: { user: userWedding.weddingId._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalTasks = await Task.countDocuments({ user: userWedding.weddingId._id });
    const completedTasks = await Task.countDocuments({ 
      user: userWedding.weddingId._id, 
      isCompleted: true 
    });

    const categoryStats = await Task.aggregate([
      { $match: { user: userWedding.weddingId._id } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          completed: {
            $sum: { $cond: ['$isCompleted', 1, 0] }
          }
        }
      }
    ]);

    res.json({
      totalTasks,
      completedTasks,
      completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
      statusStats: stats,
      categoryStats
    });
  } catch (error) {
    console.error('Task stats error:', error);
    res.status(500).json({ error: 'Failed to fetch task statistics' });
  }
});

module.exports = router; 