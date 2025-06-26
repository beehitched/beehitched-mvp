const mongoose = require('mongoose');

const weddingRoleSchema = new mongoose.Schema({
  weddingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    enum: ['Owner', 'Bride', 'Groom', 'Planner', 'Maid of Honor', 'Best Man', 'Parent', 'Sibling', 'Friend', 'Other']
  },
  color: {
    type: String,
    required: true,
    default: '#8B5CF6' // Purple
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
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
weddingRoleSchema.index({ weddingId: 1, name: 1 });

module.exports = mongoose.model('WeddingRole', weddingRoleSchema); 