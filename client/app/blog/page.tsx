'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Search, 
  Calendar, 
  User, 
  Clock, 
  Heart, 
  ArrowRight,
  Filter,
  Tag,
  BookOpen,
  Star,
  Eye,
  Share2,
  Bookmark,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import Navigation from '@/components/Navigation'

// Fixed array of authors to prevent hydration mismatches
const authors = [
  'Alexandra Thompson',
  'Marcus Rodriguez',
  'Isabella Chen',
  'Nathaniel Garcia',
  'Sophia Anderson',
  'Gabriel White',
  'Olivia Martinez',
  'Sebastian Lee',
  'Ava Clark',
  'Lucas Walker',
  'Mia Hall',
  'Ethan Allen',
  'Charlotte Young',
  'Noah King',
  'Amelia Wright',
  'William Scott',
  'Harper Torres',
  'James Nguyen',
  'Evelyn Hill',
  'Benjamin Flores'
]

const categories = [
  { name: 'All', count: 24, active: true },
  { name: 'Wedding Planning', count: 8, active: false },
  { name: 'Timeline Tips', count: 6, active: false },
  { name: 'Guest Management', count: 5, active: false },
  { name: 'Vendor Advice', count: 4, active: false },
  { name: 'Budget Tips', count: 3, active: false },
  { name: 'Wedding Trends', count: 4, active: false }
]

const featuredArticles = [
  {
    id: 1,
    title: 'The Ultimate Wedding Planning Timeline: 12 Months to Your Big Day',
    excerpt: 'Planning a wedding can feel overwhelming, but with our comprehensive 12-month timeline, you\'ll have everything organized and stress-free. From booking vendors to final details, we\'ve got you covered.',
    author: authors[0],
    authorImage: '/api/placeholder/40/40',
    publishDate: '2024-01-15',
    readTime: '8 min read',
    category: 'Wedding Planning',
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&h=400&fit=crop&crop=center',
    featured: true,
    views: 2847,
    likes: 156
  },
  {
    id: 2,
    title: '10 Creative Ways to Use QR Codes for Your Wedding RSVPs',
    excerpt: 'Discover innovative ways to incorporate QR codes into your wedding invitations and make RSVP collection effortless. From elegant designs to fun interactive elements.',
    author: authors[1],
    authorImage: '/api/placeholder/40/40',
    publishDate: '2024-01-12',
    readTime: '6 min read',
    category: 'Guest Management',
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&h=400&fit=crop&crop=center',
    featured: true,
    views: 1923,
    likes: 89
  },
  {
    id: 3,
    title: 'How to Delegate Wedding Tasks Without Losing Control',
    excerpt: 'Learn the art of wedding task delegation while maintaining your vision. Our expert tips will help you involve family and friends without creating chaos.',
    author: authors[2],
    authorImage: '/api/placeholder/40/40',
    publishDate: '2024-01-10',
    readTime: '7 min read',
    category: 'Wedding Planning',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop&crop=center',
    featured: true,
    views: 1654,
    likes: 72
  }
]

const recentArticles = [
  {
    id: 4,
    title: '2024 Wedding Trends: What\'s Hot This Year',
    excerpt: 'From sustainable weddings to intimate celebrations, discover the top wedding trends that are shaping 2024 and how to incorporate them into your special day.',
    author: authors[3],
    authorImage: '/api/placeholder/40/40',
    publishDate: '2024-01-08',
    readTime: '5 min read',
    category: 'Wedding Trends',
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=250&fit=crop&crop=center',
    views: 1247,
    likes: 45
  },
  {
    id: 5,
    title: 'Budget-Friendly Wedding Planning: How to Save Without Sacrificing',
    excerpt: 'Planning a beautiful wedding doesn\'t have to break the bank. Learn smart budgeting strategies and creative cost-cutting ideas that won\'t compromise your vision.',
    author: authors[4],
    authorImage: '/api/placeholder/40/40',
    publishDate: '2024-01-05',
    readTime: '9 min read',
    category: 'Budget Tips',
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400&h=250&fit=crop&crop=center',
    views: 987,
    likes: 38
  },
  {
    id: 6,
    title: 'The Complete Guide to Wedding Vendor Contracts',
    excerpt: 'Understanding vendor contracts is crucial for protecting your investment. Learn what to look for, red flags to avoid, and how to negotiate the best terms.',
    author: authors[5],
    authorImage: '/api/placeholder/40/40',
    publishDate: '2024-01-03',
    readTime: '10 min read',
    category: 'Vendor Advice',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=250&fit=crop&crop=center',
    views: 756,
    likes: 29
  },
  {
    id: 7,
    title: 'Creating the Perfect Wedding Timeline with BeeHitched',
    excerpt: 'Master the art of timeline creation using BeeHitched\'s intuitive tools. Learn how to organize tasks, set deadlines, and keep your wedding planning on track.',
    author: authors[6],
    authorImage: '/api/placeholder/40/40',
    publishDate: '2024-01-01',
    readTime: '6 min read',
    category: 'Timeline Tips',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=250&fit=crop&crop=center',
    views: 654,
    likes: 23
  },
  {
    id: 8,
    title: 'Guest List Management: The Do\'s and Don\'ts',
    excerpt: 'Managing your guest list can be one of the most challenging aspects of wedding planning. Learn proven strategies for creating and managing your perfect guest list.',
    author: authors[7],
    authorImage: '/api/placeholder/40/40',
    publishDate: '2023-12-28',
    readTime: '7 min read',
    category: 'Guest Management',
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400&h=250&fit=crop&crop=center',
    views: 543,
    likes: 19
  },
  {
    id: 9,
    title: 'Wedding Photography: How to Choose the Right Photographer',
    excerpt: 'Your wedding photos will last a lifetime. Learn how to select the perfect photographer, what questions to ask, and how to ensure you get the photos of your dreams.',
    author: authors[8],
    authorImage: '/api/placeholder/40/40',
    publishDate: '2023-12-25',
    readTime: '8 min read',
    category: 'Vendor Advice',
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=250&fit=crop&crop=center',
    views: 432,
    likes: 16
  }
]

const popularTags = [
  'Wedding Planning', 'Timeline', 'Budget', 'Vendors', 'Guests', 'RSVP', 'Photography', 'Venue', 'Catering', 'Decorations'
]

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)

  const filteredArticles = [...featuredArticles, ...recentArticles].filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.author.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="hero-gradient py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-6">
              Wedding Planning Blog
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              Expert tips, inspiration, and advice to help you plan your perfect wedding.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search articles, tips, and advice..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/90 backdrop-blur-sm rounded-lg border-0 focus:ring-2 focus:ring-white focus:outline-none text-gray-900 placeholder-gray-600"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category, index) => (
              <motion.button
                key={category.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                onClick={() => setSelectedCategory(category.name)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category.name
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name} ({category.count})
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Articles Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">
              Featured Articles
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our most popular and comprehensive wedding planning guides to help you get started.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {featuredArticles.map((article, index) => (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card overflow-hidden hover:shadow-xl transition-shadow group"
              >
                <div className="relative">
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-primary-600 text-white text-xs font-medium rounded-full">
                      Featured
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <button className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                      <Bookmark className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs font-medium">
                      {article.category}
                    </span>
                    <span className="mx-2">•</span>
                    <span>{formatDate(article.publishDate)}</span>
                    <span className="mx-2">•</span>
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {article.readTime}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                    {article.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                        <User className="w-4 h-4 text-gray-500" />
                      </div>
                      <span className="text-sm text-gray-700">{article.author}</span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Eye className="w-3 h-3 mr-1" />
                        {article.views}
                      </span>
                      <span className="flex items-center">
                        <Heart className="w-3 h-3 mr-1" />
                        {article.likes}
                      </span>
                    </div>
                  </div>
                  
                  <Link 
                    href={`/blog/${article.id}`}
                    className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium mt-4 group"
                  >
                    Read More
                    <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Articles Section */}
      <section className="py-16 gradient-bg">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">
              Latest Articles
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Fresh insights and tips to help you plan your perfect wedding.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentArticles.map((article, index) => (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card overflow-hidden hover:shadow-lg transition-shadow group bg-white"
              >
                <div className="relative">
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 bg-primary-600 text-white text-xs font-medium rounded">
                      {article.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <span>{formatDate(article.publishDate)}</span>
                    <span className="mx-2">•</span>
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {article.readTime}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3 text-sm">
                    {article.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center mr-2">
                        <User className="w-3 h-3 text-gray-500" />
                      </div>
                      <span className="text-sm text-gray-700">{article.author}</span>
                    </div>
                    
                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                      <span className="flex items-center">
                        <Eye className="w-3 h-3 mr-1" />
                        {article.views}
                      </span>
                      <span className="flex items-center">
                        <Heart className="w-3 h-3 mr-1" />
                        {article.likes}
                      </span>
                    </div>
                  </div>
                  
                  <Link 
                    href={`/blog/${article.id}`}
                    className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium mt-4 text-sm group"
                  >
                    Read More
                    <ArrowRight className="ml-1 w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Tags Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">
              Popular Topics
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore articles by topic to find exactly what you need.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3 justify-center">
            {popularTags.map((tag, index) => (
              <motion.button
                key={tag}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-primary-100 hover:text-primary-700 transition-colors"
              >
                #{tag}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 gradient-bg">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">
                Stay Updated
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Get the latest wedding planning tips, trends, and advice delivered to your inbox.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button className="btn-primary px-6 py-3 whitespace-nowrap">
                  Subscribe
                </button>
              </div>
              
              <p className="text-sm text-gray-500 mt-4">
                No spam, unsubscribe at any time. We respect your privacy.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">
              Ready to Start Planning?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Put these tips into action with BeeHitched's powerful wedding planning tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="btn-primary text-lg px-8 py-4 inline-flex items-center">
                Start Planning Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link href="/login" className="btn-secondary text-lg px-8 py-4">
                Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-serif font-bold mb-4">BeeHitched</h3>
              <p className="text-gray-400">
                Making wedding planning beautiful and stress-free.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms</Link></li>
                <li><Link href="/cookies" className="hover:text-white transition-colors">Cookies</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 BeeHitched. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 