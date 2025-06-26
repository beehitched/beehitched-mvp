'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShoppingBag, 
  Search,
  Filter,
  Star,
  Heart,
  ShoppingCart,
  Plus,
  Minus,
  X,
  Tag,
  DollarSign
} from 'lucide-react'
import Navigation from '@/components/Navigation'

interface Product {
  _id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  category: string
  image: string
  rating: number
  reviews: number
  inStock: boolean
  tags: string[]
  vendor: string
}

interface CartItem {
  product: Product
  quantity: number
}

const categories = [
  'All',
  'Decorations',
  'Attire',
  'Jewelry',
  'Stationery',
  'Gifts',
  'Beauty',
  'Photography',
  'Music',
  'Other'
]

const priceRanges = [
  { label: 'All Prices', min: 0, max: Infinity },
  { label: 'Under $50', min: 0, max: 50 },
  { label: '$50 - $100', min: 50, max: 100 },
  { label: '$100 - $200', min: 100, max: 200 },
  { label: '$200 - $500', min: 200, max: 500 },
  { label: 'Over $500', min: 500, max: Infinity }
]

export default function ShopPage() {
  const { user, token } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState<CartItem[]>([])
  const [showCart, setShowCart] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [priceFilter, setPriceFilter] = useState(0)
  const [sortBy, setSortBy] = useState('featured')
  const [wishlist, setWishlist] = useState<string[]>([])

  useEffect(() => {
    if (token) {
      fetchProducts()
    }
  }, [token])

  useEffect(() => {
    filterProducts()
  }, [products, searchTerm, categoryFilter, priceFilter, sortBy])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/shop', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      // Fallback to mock data
      setProducts([
        {
          _id: '1',
          name: 'Elegant Wedding Arch',
          description: 'Beautiful white floral arch perfect for outdoor ceremonies',
          price: 299.99,
          originalPrice: 399.99,
          category: 'Decorations',
          image: '/api/shop/images/arch.jpg',
          rating: 4.8,
          reviews: 127,
          inStock: true,
          tags: ['outdoor', 'ceremony', 'floral'],
          vendor: 'Elegant Events'
        },
        {
          _id: '2',
          name: 'Pearl Wedding Necklace',
          description: 'Stunning freshwater pearl necklace with crystal accents',
          price: 89.99,
          category: 'Jewelry',
          image: '/api/shop/images/necklace.jpg',
          rating: 4.9,
          reviews: 89,
          inStock: true,
          tags: ['pearl', 'crystal', 'elegant'],
          vendor: 'Pearl Paradise'
        },
        {
          _id: '3',
          name: 'Custom Wedding Invitations',
          description: 'Personalized wedding invitations with matching RSVP cards',
          price: 149.99,
          category: 'Stationery',
          image: '/api/shop/images/invitations.jpg',
          rating: 4.7,
          reviews: 203,
          inStock: true,
          tags: ['custom', 'personalized', 'elegant'],
          vendor: 'Paper Dreams'
        },
        {
          _id: '4',
          name: 'Bridal Makeup Set',
          description: 'Complete bridal makeup collection with long-lasting formulas',
          price: 79.99,
          originalPrice: 99.99,
          category: 'Beauty',
          image: '/api/shop/images/makeup.jpg',
          rating: 4.6,
          reviews: 156,
          inStock: true,
          tags: ['bridal', 'long-lasting', 'complete'],
          vendor: 'Beauty Bliss'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const filterProducts = () => {
    let filtered = products

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    if (categoryFilter !== 'All') {
      filtered = filtered.filter(product => product.category === categoryFilter)
    }

    if (priceFilter > 0) {
      const range = priceRanges[priceFilter]
      filtered = filtered.filter(product => 
        product.price >= range.min && product.price <= range.max
      )
    }

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case 'reviews':
        filtered.sort((a, b) => b.reviews - a.reviews)
        break
      default:
        // Featured - keep original order
        break
    }

    setFilteredProducts(filtered)
  }

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product._id === product._id)
      if (existingItem) {
        return prevCart.map(item =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prevCart, { product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product._id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.product._id === productId
          ? { ...item, quantity }
          : item
      )
    )
  }

  const toggleWishlist = (productId: string) => {
    setWishlist(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0)
  }

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : i < rating
            ? 'text-yellow-400 fill-current opacity-50'
            : 'text-gray-300'
        }`}
      />
    ))
  }

  if (!user) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-primary-600 mx-auto mb-4" />
          <h1 className="text-2xl font-serif font-bold text-gray-900 mb-2">
            Wedding Shop
          </h1>
          <p className="text-gray-600">Please sign in to browse our wedding products.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
                Wedding Shop
              </h1>
              <p className="text-gray-600">
                Discover beautiful products for your special day.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCart(true)}
              className="btn-primary mt-4 md:mt-0 relative"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Cart
              {getCartCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(Number(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {priceRanges.map((range, index) => (
                <option key={index} value={index}>{range.label}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="reviews">Most Reviews</option>
            </select>

            <button
              onClick={() => {
                setSearchTerm('')
                setCategoryFilter('All')
                setPriceFilter(0)
                setSortBy('featured')
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="card p-4 hover:shadow-medium transition-shadow"
              >
                <div className="relative mb-4">
                  <div className="aspect-square bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                    <Tag className="w-12 h-12 text-gray-400" />
                  </div>
                  <button
                    onClick={() => toggleWishlist(product._id)}
                    className={`absolute top-2 right-2 p-2 rounded-full transition-colors ${
                      wishlist.includes(product._id)
                        ? 'bg-red-500 text-white'
                        : 'bg-white text-gray-400 hover:text-red-500'
                    }`}
                  >
                    <Heart className="w-4 h-4" />
                  </button>
                  {product.originalPrice && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                      Sale
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900 line-clamp-2">
                    {product.name}
                  </h3>
                  
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {renderStars(product.rating)}
                      <span className="text-sm text-gray-600 ml-1">
                        ({product.reviews})
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-gray-900">
                        ${product.price.toFixed(2)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          ${product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => addToCart(product)}
                      disabled={!product.inStock}
                      className="btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add to Cart
                    </motion.button>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{product.vendor}</span>
                    <span className={product.inStock ? 'text-green-600' : 'text-red-600'}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        
        {filteredProducts.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your filters to find what you're looking for.</p>
          </motion.div>
        )}
      </div>

      {/* Shopping Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Shopping Cart</h2>
              <button
                onClick={() => setShowCart(false)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {cart.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-600">Add some products to get started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map(item => (
                  <div key={item.product._id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Tag className="w-8 h-8 text-gray-400" />
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                      <p className="text-sm text-gray-600">${item.product.price.toFixed(2)}</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <button
                      onClick={() => removeFromCart(item.product._id)}
                      className="p-1 text-red-400 hover:text-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-lg font-bold">${getCartTotal().toFixed(2)}</span>
                  </div>
                  
                  <button className="w-full btn-primary">
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  )
} 