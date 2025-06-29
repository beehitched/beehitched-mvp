const mongoose = require('mongoose');

const moodboardImageSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot be more than 500 characters']
  },
  sourceUrl: {
    type: String,
    trim: true
  },
  sourceName: {
    type: String,
    trim: true,
    maxlength: [100, 'Source name cannot be more than 100 characters']
  },
  position: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 }
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const moodboardSchema = new mongoose.Schema({
  weddingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wedding',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Moodboard name is required'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  category: {
    type: String,
    required: true,
    enum: ['Florals', 'Tablescape', 'Venue Inspo', 'Dress Vibes', 'Decor', 'Food', 'Other'],
    default: 'Other'
  },
  images: [moodboardImageSchema],
  isPublic: {
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

// Indexes for efficient queries
moodboardSchema.index({ weddingId: 1, category: 1 });
moodboardSchema.index({ weddingId: 1, createdBy: 1 });

module.exports = mongoose.model('Moodboard', moodboardSchema); 