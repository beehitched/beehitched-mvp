const mongoose = require('mongoose');

const collaboratorSchema = new mongoose.Schema({
  weddingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wedding',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  role: {
    type: String,
    required: true,
    enum: ['Owner', 'Bride', 'Groom', 'Planner', 'Maid of Honor', 'Best Man', 'Parent', 'Sibling', 'Friend', 'Other']
  },
  email: {
    type: String,
    required: true,
    lowercase: true
  },
  name: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined'],
    default: 'pending'
  },
  invitedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  invitedAt: {
    type: Date,
    default: Date.now
  },
  acceptedAt: {
    type: Date
  },
  permissions: {
    canView: {
      type: Boolean,
      default: true
    },
    canEditTimeline: {
      type: Boolean,
      default: false
    },
    canEditGuests: {
      type: Boolean,
      default: false
    },
    canEditShop: {
      type: Boolean,
      default: false
    },
    canInviteOthers: {
      type: Boolean,
      default: false
    },
    canManageRoles: {
      type: Boolean,
      default: false
    }
  }
});

// Indexes for efficient queries
collaboratorSchema.index({ weddingId: 1, userId: 1 }, { sparse: true });
collaboratorSchema.index({ weddingId: 1, email: 1 }, { unique: true });
collaboratorSchema.index({ userId: 1 }, { sparse: true });

module.exports = mongoose.model('Collaborator', collaboratorSchema); 