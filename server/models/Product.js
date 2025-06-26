const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Invitations', 'Decor', 'Tableware', 'Signage', 'Party Favors', 'Attire', 'Photography', 'Music', 'Other'],
    default: 'Other'
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  image: {
    type: String,
    required: [true, 'Product image is required']
  },
  images: [{
    type: String
  }],
  inStock: {
    type: Boolean,
    default: true
  },
  stockQuantity: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }],
  rating: {
    type: Number,
    min: [0, 'Rating cannot be less than 0'],
    max: [5, 'Rating cannot be more than 5'],
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  vendor: {
    type: String,
    trim: true,
    maxlength: [100, 'Vendor name cannot be more than 100 characters']
  },
  shippingInfo: {
    type: String,
    trim: true,
    maxlength: [200, 'Shipping info cannot be more than 200 characters']
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    unit: {
      type: String,
      enum: ['cm', 'inch'],
      default: 'cm'
    }
  },
  weight: {
    value: Number,
    unit: {
      type: String,
      enum: ['g', 'kg', 'lb', 'oz'],
      default: 'g'
    }
  }
}, {
  timestamps: true
});

// Index for efficient queries
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ price: 1 });
productSchema.index({ isFeatured: 1, isActive: 1 });
productSchema.index({ tags: 1 });

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return 0;
});

// Ensure virtual fields are serialized
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema); 