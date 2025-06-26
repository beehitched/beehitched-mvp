const express = require('express');
const Product = require('../models/Product');
const { authenticateToken, optionalAuth } = require('../utils/auth');
const router = express.Router();

// Get all products (public)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 12, 
      category, 
      search, 
      minPrice, 
      maxPrice, 
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query = { isActive: true };
    
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const products = await Product.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Product.countDocuments(query);

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Fetch products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get featured products
router.get('/featured', async (req, res) => {
  try {
    const products = await Product.find({ 
      isActive: true, 
      isFeatured: true 
    }).limit(8);

    res.json({ products });
  } catch (error) {
    console.error('Fetch featured products error:', error);
    res.status(500).json({ error: 'Failed to fetch featured products' });
  }
});

// Get product by ID
router.get('/:productId', async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findOne({ 
      _id: productId, 
      isActive: true 
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ product });
  } catch (error) {
    console.error('Fetch product error:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Get product categories
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Product.distinct('category', { isActive: true });
    
    const categoryStats = await Product.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({ categories, categoryStats });
  } catch (error) {
    console.error('Fetch categories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Search products
router.get('/search/suggestions', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
      return res.json({ suggestions: [] });
    }

    const suggestions = await Product.find({
      isActive: true,
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ]
    })
    .select('name category tags')
    .limit(10);

    res.json({ suggestions });
  } catch (error) {
    console.error('Search suggestions error:', error);
    res.status(500).json({ error: 'Failed to get search suggestions' });
  }
});

// Get related products
router.get('/:productId/related', async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const relatedProducts = await Product.find({
      _id: { $ne: productId },
      isActive: true,
      $or: [
        { category: product.category },
        { tags: { $in: product.tags } }
      ]
    })
    .limit(6);

    res.json({ products: relatedProducts });
  } catch (error) {
    console.error('Fetch related products error:', error);
    res.status(500).json({ error: 'Failed to fetch related products' });
  }
});

// Admin routes (protected)
// Create product (admin only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      price,
      originalPrice,
      image,
      images,
      stockQuantity,
      tags,
      vendor,
      shippingInfo,
      isFeatured,
      dimensions,
      weight
    } = req.body;

    const product = new Product({
      name,
      description,
      category,
      price,
      originalPrice,
      image,
      images: images || [],
      stockQuantity,
      tags: tags || [],
      vendor,
      shippingInfo,
      isFeatured: isFeatured || false,
      dimensions,
      weight
    });

    await product.save();
    res.status(201).json({ product });
  } catch (error) {
    console.error('Create product error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: Object.values(error.errors).map(err => err.message) });
    }
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Update product (admin only)
router.put('/:productId', authenticateToken, async (req, res) => {
  try {
    const { productId } = req.params;
    const updateData = req.body;

    const product = await Product.findByIdAndUpdate(
      productId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ product });
  } catch (error) {
    console.error('Update product error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: Object.values(error.errors).map(err => err.message) });
    }
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product (admin only)
router.delete('/:productId', authenticateToken, async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findByIdAndUpdate(
      productId,
      { isActive: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deactivated successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Get product statistics (admin only)
router.get('/admin/stats', authenticateToken, async (req, res) => {
  try {
    const stats = await Product.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' },
          totalValue: { $sum: '$price' }
        }
      }
    ]);

    const totalProducts = await Product.countDocuments({ isActive: true });
    const featuredProducts = await Product.countDocuments({ 
      isActive: true, 
      isFeatured: true 
    });
    const lowStockProducts = await Product.countDocuments({ 
      isActive: true, 
      stockQuantity: { $lt: 10 } 
    });

    res.json({
      totalProducts,
      featuredProducts,
      lowStockProducts,
      categoryStats: stats
    });
  } catch (error) {
    console.error('Product stats error:', error);
    res.status(500).json({ error: 'Failed to fetch product statistics' });
  }
});

module.exports = router; 