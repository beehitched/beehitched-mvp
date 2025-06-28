const mongoose = require('mongoose');

const guestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wedding',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Guest name is required'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  rsvpStatus: {
    type: String,
    enum: ['Pending', 'Attending', 'Not Attending', 'Maybe'],
    default: 'Pending'
  },
  dietaryRestrictions: {
    type: String,
    trim: true,
    maxlength: [200, 'Dietary restrictions cannot be more than 200 characters']
  },
  group: {
    type: String,
    trim: true,
    maxlength: [50, 'Group name cannot be more than 50 characters']
  },
  plusOne: {
    name: {
      type: String,
      trim: true,
      maxlength: [100, 'Plus one name cannot be more than 100 characters']
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    dietaryRestrictions: {
      type: String,
      trim: true,
      maxlength: [200, 'Dietary restrictions cannot be more than 200 characters']
    }
  },
  tableNumber: {
    type: Number,
    default: null
  },
  isVip: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot be more than 500 characters']
  },
  rsvpDate: {
    type: Date,
    default: null
  },
  invitedDate: {
    type: Date,
    default: Date.now
  },
  assignedRoles: [{
    type: String,
    enum: ['Owner', 'Bride', 'Groom', 'Planner', 'Maid of Honor', 'Best Man', 'Parent', 'Sibling', 'Friend', 'Other']
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for efficient queries (user field stores wedding ID)
guestSchema.index({ user: 1, rsvpStatus: 1 }); // weddingId, rsvpStatus
guestSchema.index({ user: 1, group: 1 }); // weddingId, group
guestSchema.index({ user: 1, isVip: 1 }); // weddingId, isVip
guestSchema.index({ user: 1, email: 1 }); // weddingId, email
guestSchema.index({ user: 1, assignedRoles: 1 }); // weddingId, assignedRoles

module.exports = mongoose.model('Guest', guestSchema); 