const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  weddingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wedding',
    required: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  senderName: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 1000
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  type: {
    type: String,
    enum: ['group', 'individual'],
    default: 'group'
  },
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function() {
      return this.type === 'individual';
    }
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
messageSchema.index({ weddingId: 1, timestamp: -1 });
messageSchema.index({ weddingId: 1, type: 1 });
messageSchema.index({ senderId: 1, recipientId: 1 });
messageSchema.index({ recipientId: 1, senderId: 1 });

module.exports = mongoose.model('Message', messageSchema); 