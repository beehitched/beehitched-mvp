'use client'

import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { motion } from 'framer-motion'
import Navigation from '@/components/Navigation'
import { 
  Search,
  MapPin,
  Filter,
  Heart,
  ExternalLink,
  Building2,
  Camera,
  Music,
  Car,
  Flower,
  ChefHat,
  Scissors,
  Gift,
  Sparkles,
  Star,
  ChevronRight,
  Users,
  Palette,
  Diamond,
  UtensilsCrossed
} from 'lucide-react'

interface Vendor {
  id: string
  name: string
  category: string
  description: string
  website: string
  location: string
  rating: number
  priceRange: string
  specialties: string[]
  image?: string
}

const vendorCategories = [
  { 
    name: 'Venues', 
    icon: Building2, 
    color: 'bg-blue-100 text-blue-600',
    description: 'Wedding venues and reception spaces'
  },
  { 
    name: 'Photography', 
    icon: Camera, 
    color: 'bg-purple-100 text-purple-600',
    description: 'Wedding photographers and videographers'
  },
  { 
    name: 'Music & DJs', 
    icon: Music, 
    color: 'bg-green-100 text-green-600',
    description: 'Wedding DJs, bands, and musicians'
  },
  { 
    name: 'Transportation', 
    icon: Car, 
    color: 'bg-orange-100 text-orange-600',
    description: 'Wedding transportation services'
  },
  { 
    name: 'Florists', 
    icon: Flower, 
    color: 'bg-pink-100 text-pink-600',
    description: 'Wedding flowers and floral design'
  },
  { 
    name: 'Catering', 
    icon: UtensilsCrossed, 
    color: 'bg-red-100 text-red-600',
    description: 'Wedding catering and food services'
  },
  { 
    name: 'Beauty', 
    icon: Scissors, 
    color: 'bg-indigo-100 text-indigo-600',
    description: 'Hair, makeup, and beauty services'
  },
  { 
    name: 'Attire', 
    icon: Users, 
    color: 'bg-rose-100 text-rose-600',
    description: 'Wedding dresses and formal wear'
  },
  { 
    name: 'Jewelry', 
    icon: Diamond, 
    color: 'bg-yellow-100 text-yellow-600',
    description: 'Wedding rings and jewelry'
  },
  { 
    name: 'Cakes', 
    icon: Gift, 
    color: 'bg-teal-100 text-teal-600',
    description: 'Wedding cakes and desserts'
  },
  { 
    name: 'Decor', 
    icon: Palette, 
    color: 'bg-cyan-100 text-cyan-600',
    description: 'Wedding decorations and styling'
  },
  { 
    name: 'Favors', 
    icon: Sparkles, 
    color: 'bg-emerald-100 text-emerald-600',
    description: 'Wedding favors and gifts'
  }
]

// Sample vendor data - in a real app, this would come from an API
const sampleVendors: Vendor[] = [
  {
    id: '1',
    name: 'The Grand Ballroom',
    category: 'Venues',
    description: 'Elegant wedding venue with stunning architecture and professional event coordination.',
    website: 'https://thegrandballroom.com',
    location: 'New York, NY',
    rating: 4.8,
    priceRange: '$$$',
    specialties: ['Large Weddings', 'Corporate Events', 'Outdoor Ceremonies']
  },
  {
    id: '2',
    name: 'Capture Moments Photography',
    category: 'Photography',
    description: 'Award-winning wedding photography with a photojournalistic style.',
    website: 'https://capturemoments.com',
    location: 'Los Angeles, CA',
    rating: 4.9,
    priceRange: '$$',
    specialties: ['Photojournalistic', 'Engagement Sessions', 'Destination Weddings']
  },
  {
    id: '3',
    name: 'Harmony Music Group',
    category: 'Music & DJs',
    description: 'Professional DJs and live musicians for unforgettable wedding entertainment.',
    website: 'https://harmonymusicgroup.com',
    location: 'Chicago, IL',
    rating: 4.7,
    priceRange: '$$',
    specialties: ['Live Bands', 'DJ Services', 'Ceremony Music']
  },
  {
    id: '4',
    name: 'Blossom & Bloom Florals',
    category: 'Florists',
    description: 'Artistic floral design creating beautiful wedding arrangements and bouquets.',
    website: 'https://blossomandbloom.com',
    location: 'Miami, FL',
    rating: 4.6,
    priceRange: '$$',
    specialties: ['Bridal Bouquets', 'Ceremony Decor', 'Reception Centerpieces']
  },
  {
    id: '5',
    name: 'Culinary Creations',
    category: 'Catering',
    description: 'Gourmet wedding catering with customizable menus and exceptional service.',
    website: 'https://culinarycreations.com',
    location: 'San Francisco, CA',
    rating: 4.8,
    priceRange: '$$$',
    specialties: ['Plated Dinners', 'Buffet Service', 'Dietary Accommodations']
  }
]

export default function VendorsPage() {
  const { user } = useAuth()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [favorites, setFavorites] = useState<string[]>([])

  const filteredVendors = sampleVendors.filter(vendor => {
    const matchesCategory = selectedCategory === 'all' || vendor.category === selectedCategory
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.location.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const toggleFavorite = (vendorId: string) => {
    setFavorites(prev => 
      prev.includes(vendorId) 
        ? prev.filter(id => id !== vendorId)
        : [...prev, vendorId]
    )
  }

  const getPriceRangeDisplay = (range: string) => {
    switch (range) {
      case '$': return 'Budget'
      case '$$': return 'Mid-Range'
      case '$$$': return 'Premium'
      case '$$$$': return 'Luxury'
      default: return range
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <Building2 className="w-16 h-16 text-primary-600 mx-auto mb-4" />
          <h1 className="text-2xl font-serif font-bold text-gray-900 mb-2">
            Vendor Discovery
          </h1>
          <p className="text-gray-600">Please sign in to access vendor recommendations.</p>
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
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
            Find Your Perfect Vendors
          </h1>
          <p className="text-gray-600">
            Discover trusted vendors for your special day. We've curated a list of reputable professionals to help bring your vision to life.
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search vendors by name, location, or specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            
            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">All Categories</option>
                {vendorCategories.map(category => (
                  <option key={category.name} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Vendor Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {vendorCategories.map((category, index) => {
              const IconComponent = category.icon
              return (
                <motion.button
                  key={category.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`p-6 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
                    selectedCategory === category.name
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 bg-white hover:border-primary-300'
                  }`}
                >
                  <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                  <p className="text-sm text-gray-600 text-center">{category.description}</p>
                </motion.button>
              )
            })}
          </div>
        </motion.div>

        {/* Vendor Results */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-serif font-bold text-gray-900">
              {selectedCategory === 'all' ? 'All Vendors' : `${selectedCategory} Vendors`}
            </h2>
            <p className="text-gray-600">
              {filteredVendors.length} vendor{filteredVendors.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {filteredVendors.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVendors.map((vendor, index) => (
                <motion.div
                  key={vendor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="card p-6 hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{vendor.name}</h3>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <MapPin className="w-4 h-4 mr-1" />
                        {vendor.location}
                      </div>
                      <div className="flex items-center mb-2">
                        <div className="flex items-center mr-3">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(vendor.rating) 
                                  ? 'text-yellow-400 fill-current' 
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">{vendor.rating}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleFavorite(vendor.id)}
                      className={`p-2 rounded-full transition-colors ${
                        favorites.includes(vendor.id)
                          ? 'text-red-500 bg-red-50'
                          : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${
                        favorites.includes(vendor.id) ? 'fill-current' : ''
                      }`} />
                    </button>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-3">{vendor.description}</p>

                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2 py-1 bg-primary-100 text-primary-800 text-sm rounded-full">
                      {getPriceRangeDisplay(vendor.priceRange)}
                    </span>
                    <span className="text-sm text-gray-500">{vendor.category}</span>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Specialties:</h4>
                    <div className="flex flex-wrap gap-1">
                      {vendor.specialties.map((specialty, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  <a
                    href={vendor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary w-full inline-flex items-center justify-center"
                  >
                    Visit Website
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No vendors found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
} 