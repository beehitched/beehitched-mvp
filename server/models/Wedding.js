const mongoose = require('mongoose');

const weddingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  weddingDate: {
    type: Date,
    required: true
  },
  venue: {
    type: String,
    trim: true
  },
  theme: {
    type: String,
    trim: true
  },
  budget: {
    type: Number,
    min: 0
  },
  guestCount: {
    type: Number,
    min: 0
  },
  description: {
    type: String,
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

// Update the updatedAt field on save
weddingSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Indexes for efficient queries
weddingSchema.index({ createdBy: 1 });
weddingSchema.index({ weddingDate: 1 });
weddingSchema.index({ isActive: 1 });

module.exports = mongoose.model('Wedding', weddingSchema); 