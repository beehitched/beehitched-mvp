const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wedding',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Venue', 'Food', 'Decor', 'Attire', 'Photography', 'Music', 'Transportation', 'Other'],
    default: 'Other'
  },
  status: {
    type: String,
    enum: ['To Do', 'In Progress', 'Done'],
    default: 'To Do'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium'
  },
  dueDate: {
    type: Date,
    default: null
  },
  completedDate: {
    type: Date,
    default: null
  },
  completionDetails: {
    vendorName: {
      type: String,
      trim: true
    },
    vendorContact: {
      type: String,
      trim: true
    },
    cost: {
      type: String,
      trim: true
    },
    dateCompleted: {
      type: Date
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Completion notes cannot be more than 1000 characters']
    },
    attachments: [{
      type: String
    }]
  },
  budget: {
    type: Number,
    default: 0
  },
  assignedTo: {
    type: String,
    trim: true
  },
  assignedRoles: [{
    type: String,
    enum: ['Owner', 'Bride', 'Groom', 'Planner', 'Maid of Honor', 'Best Man', 'Parent', 'Sibling', 'Friend', 'Other']
  }],
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot be more than 1000 characters']
  },
  linkedProducts: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    quantity: {
      type: Number,
      default: 1
    }
  }],
  order: {
    type: Number,
    default: 0
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for efficient queries (user field stores wedding ID)
taskSchema.index({ user: 1, category: 1, status: 1 }); // weddingId, category, status
taskSchema.index({ user: 1, dueDate: 1 }); // weddingId, dueDate
taskSchema.index({ user: 1, assignedRoles: 1 }); // weddingId, assignedRoles

module.exports = mongoose.model('Task', taskSchema); 