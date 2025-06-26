const express = require('express');
const Task = require('../models/Task');
const Collaborator = require('../models/Collaborator');
const { authenticateToken } = require('../utils/auth');
const router = express.Router();

// Get all tasks for a user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id })
      .sort({ order: 1, createdAt: -1 });

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

    // Check if user has permission to edit timeline
    let collaborator = await Collaborator.findOne({ 
      weddingId: req.user._id, 
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
    
    if (!collaborator.permissions.canEditTimeline) {
      return res.status(403).json({ error: 'Permission denied' });
    }

    // Get the highest order number for the category
    const lastTask = await Task.findOne({ 
      user: req.user._id, 
      category 
    }).sort({ order: -1 });
    
    const order = lastTask ? lastTask.order + 1 : 0;

    const task = new Task({
      user: req.user._id,
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

    // Check if user has permission to edit timeline
    let collaborator = await Collaborator.findOne({ 
      weddingId: req.user._id, 
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
    
    if (!collaborator.permissions.canEditTimeline) {
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
      { _id: taskId, user: req.user._id },
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

    // Check if user has permission to edit timeline
    let collaborator = await Collaborator.findOne({ 
      weddingId: req.user._id, 
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
    
    if (!collaborator.permissions.canEditTimeline) {
      return res.status(403).json({ error: 'Permission denied' });
    }

    const task = await Task.findOneAndDelete({ _id: taskId, user: req.user._id });

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

    // Check if user has permission to edit timeline
    let collaborator = await Collaborator.findOne({ 
      weddingId: req.user._id, 
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
    
    if (!collaborator.permissions.canEditTimeline) {
      return res.status(403).json({ error: 'Permission denied' });
    }

    const task = await Task.findOne({ _id: taskId, user: req.user._id });
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
          user: req.user._id, 
          category: oldCategory, 
          order: { $gt: oldOrder } 
        },
        { $inc: { order: -1 } }
      );

      // Add to new category
      await Task.updateMany(
        { 
          user: req.user._id, 
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
            user: req.user._id, 
            category: oldCategory, 
            order: { $gt: oldOrder, $lte: newOrder } 
          },
          { $inc: { order: -1 } }
        );
      } else {
        await Task.updateMany(
          { 
            user: req.user._id, 
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

    // Check if user has permission to edit timeline
    let collaborator = await Collaborator.findOne({ 
      weddingId: req.user._id, 
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
    
    if (!collaborator.permissions.canEditTimeline) {
      return res.status(403).json({ error: 'Permission denied' });
    }

    const task = await Task.findOne({ _id: taskId, user: req.user._id });
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
    const stats = await Task.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalTasks = await Task.countDocuments({ user: req.user._id });
    const completedTasks = await Task.countDocuments({ 
      user: req.user._id, 
      isCompleted: true 
    });

    const categoryStats = await Task.aggregate([
      { $match: { user: req.user._id } },
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