const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['hero', 'story', 'event-details', 'rsvp', 'gallery', 'registry', 'contact', 'timeline', 'bridal-party', 'accommodations', 'travel', 'faq']
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  isEnabled: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    required: true
  },
  settings: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
});

const weddingWebsiteSchema = new mongoose.Schema({
  weddingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wedding',
    required: true,
    unique: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens']
  },
  customDomain: {
    type: String,
    lowercase: true,
    trim: true
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  theme: {
    name: {
      type: String,
      default: 'classic'
    },
    colors: {
      primary: { type: String, default: '#E6397E' },
      secondary: { type: String, default: '#F8F9FA' },
      accent: { type: String, default: '#FFD700' },
      text: { type: String, default: '#333333' },
      background: { type: String, default: '#FFFFFF' }
    },
    fonts: {
      heading: { type: String, default: 'Playfair Display' },
      body: { type: String, default: 'Inter' }
    },
    style: {
      type: String,
      enum: ['classic', 'modern', 'romantic', 'minimal', 'rustic', 'elegant'],
      default: 'classic'
    }
  },
  sections: [sectionSchema],
  settings: {
    showCountdown: { type: Boolean, default: true },
    showGuestBook: { type: Boolean, default: false },
    allowPublicRSVP: { type: Boolean, default: true },
    requireRSVPCode: { type: Boolean, default: false },
    showGuestList: { type: Boolean, default: false },
    enableSharing: { type: Boolean, default: true },
    analytics: { type: Boolean, default: false }
  },
  seo: {
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    keywords: { type: String, default: '' },
    ogImage: { type: String, default: '' }
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
  publishedAt: {
    type: Date
  }
});

// Update the updatedAt field on save
weddingWebsiteSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Indexes for efficient queries
weddingWebsiteSchema.index({ slug: 1 }, { unique: true });
weddingWebsiteSchema.index({ customDomain: 1 }, { sparse: true });
weddingWebsiteSchema.index({ weddingId: 1 });
weddingWebsiteSchema.index({ isPublished: 1 });

module.exports = mongoose.model('WeddingWebsite', weddingWebsiteSchema); 