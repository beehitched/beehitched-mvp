'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Script from 'next/script'
import { 
  Heart, 
  Calendar, 
  Users, 
  CheckCircle, 
  Star,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  Shield,
  MessageSquare,
  Clock,
  ChevronDown
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import AnimatedBees from '@/components/AnimatedBees'

const features = [
  {
    icon: Calendar,
    title: 'Step 1: Create Your Wedding',
    description: 'Sign up and create your wedding profile. Add your wedding date, venue, and theme to get started.'
  },
  {
    icon: UserPlus,
    title: 'Step 2: Invite Collaborators',
    description: 'Invite family, friends, and wedding party members to help with planning. Set roles and permissions.'
  },
  {
    icon: CheckCircle,
    title: 'Step 3: Build Your Timeline',
    description: 'Create tasks, set due dates, and organize everything in our intuitive timeline board.'
  },
  {
    icon: Users,
    title: 'Step 4: Manage Guests',
    description: 'Add guests, generate QR codes for RSVPs, and track responses in real-time.'
  }
]

const testimonials = [
  {
    name: 'Sarah & Michael',
    location: 'New York, NY',
    text: 'BeeHitched made our wedding planning so much easier! The timeline feature kept us organized and stress-free. We loved how we could collaborate with our families and keep everyone in the loop.',
    rating: 5,
    weddingDate: 'June 2024',
    avatar: 'SM'
  },
  {
    name: 'Emily & David',
    location: 'Los Angeles, CA',
    text: 'The guest management system saved us hours of work. The QR codes were a game-changer - our guests loved how easy it was to RSVP, and everything was perfectly organized for our big day.',
    rating: 5,
    weddingDate: 'August 2024',
    avatar: 'ED'
  },
  {
    name: 'Jessica & Chris',
    location: 'Chicago, IL',
    text: 'The collaboration features made planning with our families so much easier. Everyone could contribute while we stayed in control. The moodboard feature helped us visualize our perfect day!',
    rating: 5,
    weddingDate: 'September 2024',
    avatar: 'JC'
  },
  {
    name: 'Amanda & Ryan',
    location: 'Austin, TX',
    text: 'As a busy couple, we needed something that could keep us organized without adding stress. BeeHitched delivered exactly that - intuitive, beautiful, and incredibly helpful.',
    rating: 5,
    weddingDate: 'October 2024',
    avatar: 'AR'
  },
  {
    name: 'Sophie & James',
    location: 'Seattle, WA',
    text: 'The vendor sharing features are incredible! Our florist and photographer loved being able to see our moodboards and vision. It made communication so much smoother.',
    rating: 5,
    weddingDate: 'July 2024',
    avatar: 'SJ'
  }
]

export default function HomePage() {
  const { user } = useAuth()
  const [currentTestimonial, setCurrentTestimonial] = React.useState(0)
  const [showMailerLitePopup, setShowMailerLitePopup] = useState(false)

  // MailerLite popup logic - show for every visitor
  useEffect(() => {
    // Show popup almost immediately for every visitor
    setTimeout(() => {
      console.log('Triggering MailerLite popup...')
      setShowMailerLitePopup(true)
      
      // Trigger popup immediately and with multiple attempts
      const triggerPopup = () => {
        console.log('Attempting to trigger popup...')
        
        // Method 1: Direct window.ml call
        if (typeof window !== 'undefined' && (window as any).ml) {
          console.log('Method 1: Direct window.ml call')
          ;(window as any).ml('show', '159606328378001195')
        }
        
        // Method 2: Check if ml function exists globally
        if (typeof (window as any).ml !== 'undefined') {
          console.log('Method 2: Global ml function')
          ;(window as any).ml('show', '159606328378001195')
        }
      }
      
      // Trigger immediately
      triggerPopup()
      
      // Also trigger after a short delay to ensure script is loaded
      setTimeout(() => {
        if (typeof window !== 'undefined' && (window as any).ml) {
          console.log('Method 3: Delayed window.ml call')
          ;(window as any).ml('show', '159606328378001195')
        }
      }, 500) // Reduced from 1000ms to 500ms
    }, 500) // Reduced from 2000ms to 500ms for faster appearance
  }, [])

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const scrollToFeatures = () => {
    const featuresSection = document.querySelector('#features-section')
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <AnimatedBees />
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6">
                Plan Your Perfect
                <span className="block text-gold-200">Wedding</span>
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
                Elegant, intuitive wedding planning that makes your special day stress-free and beautiful.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                {user ? (
                  <Link href="/dashboard" className="btn-primary text-lg px-8 py-4">
                    Go to Dashboard
                  </Link>
                ) : (
                  <>
                    <Link href="/register" className="btn-primary text-lg px-8 py-4">
                      Start Planning Free
                    </Link>
                    <Link href="/login" className="btn-secondary text-lg px-8 py-4">
                      Sign In
                    </Link>
                  </>
                )}
              </div>
              
              {/* Animated Scroll Down CTA */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="flex flex-col items-center"
              >
                <motion.button
                  onClick={scrollToFeatures}
                  className="group flex flex-col items-center text-white/80 hover:text-white transition-colors cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-sm font-medium mb-2 group-hover:text-gold-200 transition-colors">
                    Learn More
                  </span>
                  <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="w-6 h-6"
                  >
                    <ChevronDown className="w-6 h-6" />
                  </motion.div>
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </div>
        
        {/* Floating elements */}
        <motion.div
          className="absolute top-20 left-10 text-white/20"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Heart size={40} />
        </motion.div>
        <motion.div
          className="absolute bottom-20 right-10 text-white/20"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <Heart size={30} />
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features-section" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">
              How to Use BeeHitched
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started in just 4 simple steps. From creating your wedding to managing guests, we'll guide you through everything.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card-hover p-6 text-center relative"
              >
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Timeline Planning Section */}
      <section className="py-20 gradient-bg relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 bg-primary-200 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-gold-200 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-purple-200 rounded-full blur-2xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-5xl font-serif font-bold text-gray-900 mb-6">
                Beautiful Timeline Planning
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Transform your wedding planning with our elegant, intuitive timeline interface. 
                Organize tasks, track progress, and ensure nothing falls through the cracks.
              </p>
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {/* Feature highlights */}
              <div className="space-y-6">
                <div className="flex items-start group">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mr-4 mt-1 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Drag & Drop Simplicity</h3>
                    <p className="text-gray-600">Move tasks between categories with intuitive drag-and-drop. Reorganize your timeline effortlessly as your plans evolve.</p>
                  </div>
                </div>

                <div className="flex items-start group">
                  <div className="w-12 h-12 bg-gradient-to-br from-gold-500 to-gold-600 rounded-xl flex items-center justify-center mr-4 mt-1 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Categories</h3>
                    <p className="text-gray-600">Organize tasks by venue, vendors, attire, and more. Our intelligent categorization keeps everything perfectly organized.</p>
                  </div>
                </div>

                <div className="flex items-start group">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mr-4 mt-1 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Progress Tracking</h3>
                    <p className="text-gray-600">Visual progress bars and completion percentages help you stay on track. Celebrate milestones as you check off completed tasks.</p>
                  </div>
                </div>

                <div className="flex items-start group">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-4 mt-1 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Due Date Management</h3>
                    <p className="text-gray-600">Set realistic deadlines and receive gentle reminders. Never miss an important milestone in your wedding planning journey.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Link href="/register" className="btn-primary inline-flex items-center text-lg px-8 py-4">
                  Start Your Timeline
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              {/* Enhanced Timeline Preview */}
              <div className="card p-8 bg-white/90 backdrop-blur-sm border border-gray-200 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-serif font-bold text-gray-900">Wedding Timeline</h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Live Preview</span>
                  </div>
                </div>

                {/* Progress Overview */}
                <div className="mb-6 p-4 bg-gradient-to-r from-primary-50 to-gold-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">Overall Progress</span>
                    <span className="text-2xl font-bold text-primary-600">68%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <motion.div 
                      className="bg-gradient-to-r from-primary-500 to-gold-500 h-3 rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: "68%" }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    ></motion.div>
                  </div>
                </div>

                {/* Timeline Categories */}
                <div className="space-y-4">
                  {/* Venue Category */}
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-white flex items-center">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          Venue & Location
                        </h4>
                        <span className="text-white/90 text-sm">3 tasks</span>
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      <motion.div 
                        className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500 hover:shadow-md transition-shadow cursor-pointer"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-medium text-gray-900">Book ceremony venue</div>
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        </div>
                        <div className="text-sm text-gray-600 mt-1">Completed • March 15</div>
                      </motion.div>
                      <motion.div 
                        className="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500 hover:shadow-md transition-shadow cursor-pointer"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-medium text-gray-900">Book reception venue</div>
                          <Clock className="w-5 h-5 text-yellow-500" />
                        </div>
                        <div className="text-sm text-gray-600 mt-1">Due: April 1</div>
                      </motion.div>
                      <motion.div 
                        className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500 hover:shadow-md transition-shadow cursor-pointer"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-medium text-gray-900">Finalize catering</div>
                          <Clock className="w-5 h-5 text-blue-500" />
                        </div>
                        <div className="text-sm text-gray-600 mt-1">Due: April 15</div>
                      </motion.div>
                    </div>
                  </div>

                  {/* Vendors Category */}
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-gold-500 to-gold-600 px-4 py-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-white flex items-center">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          Vendors & Services
                        </h4>
                        <span className="text-white/90 text-sm">2 tasks</span>
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      <motion.div 
                        className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500 hover:shadow-md transition-shadow cursor-pointer"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-medium text-gray-900">Hire photographer</div>
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        </div>
                        <div className="text-sm text-gray-600 mt-1">Completed • March 10</div>
                      </motion.div>
                      <motion.div 
                        className="p-3 bg-purple-50 rounded-lg border-l-4 border-purple-500 hover:shadow-md transition-shadow cursor-pointer"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-medium text-gray-900">Book florist</div>
                          <Clock className="w-5 h-5 text-purple-500" />
                        </div>
                        <div className="text-sm text-gray-600 mt-1">Due: March 25</div>
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="mt-6 grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">8</div>
                    <div className="text-xs text-gray-600">Completed</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">3</div>
                    <div className="text-xs text-gray-600">In Progress</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">12</div>
                    <div className="text-xs text-gray-600">Total Tasks</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Collaborators Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="card p-8 bg-gradient-to-br from-primary-50 to-gold-50 border border-primary-100">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                    <UserPlus className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Invite Collaborators</h3>
                    <p className="text-sm text-gray-600">Share the planning journey</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center p-3 bg-white/60 rounded-lg">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-sm font-semibold text-primary-600">S</span>
                    </div>
                    <div>
                      <div className="font-medium text-sm">Sarah (Maid of Honor)</div>
                      <div className="text-xs text-gray-500">Managing bridesmaid coordination</div>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-white/60 rounded-lg">
                    <div className="w-8 h-8 bg-gold-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-sm font-semibold text-gold-600">M</span>
                    </div>
                    <div>
                      <div className="font-medium text-sm">Mom (Wedding Coordinator)</div>
                      <div className="text-xs text-gray-500">Overseeing vendor management</div>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-white/60 rounded-lg">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-sm font-semibold text-green-600">J</span>
                    </div>
                    <div>
                      <div className="font-medium text-sm">James (Best Man)</div>
                      <div className="text-xs text-gray-500">Handling groomsmen logistics</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-serif font-bold text-gray-900 mb-6">
                Plan Together with Loved Ones
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Invite family, friends, and wedding party members to collaborate on your special day. 
                Everyone can contribute while you maintain full control.
              </p>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-4 mt-1">
                    <Users className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Delegate Tasks</h3>
                    <p className="text-gray-600">Assign specific responsibilities to trusted family members and friends. Let your maid of honor handle bridesmaid coordination while your mom manages vendor communications.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-gold-100 rounded-full flex items-center justify-center mr-4 mt-1">
                    <MessageSquare className="w-5 h-5 text-gold-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Real-time Communication</h3>
                    <p className="text-gray-600">Keep everyone in the loop with built-in messaging and updates. No more endless group texts or missed information.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-1">
                    <Shield className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Maintain Control</h3>
                    <p className="text-gray-600">You decide who sees what. Set permissions for each collaborator and approve changes before they go live.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-1">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Save Time</h3>
                    <p className="text-gray-600">Distribute the workload and focus on what matters most. Your wedding planning becomes a team effort, not a solo mission.</p>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <Link href="/register" className="btn-primary inline-flex items-center">
                  Start Collaborating
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Guest Management Section */}
      <section className="py-20 gradient-bg">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-serif font-bold text-gray-900 mb-6">
                Smart Guest Management with QR Codes
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Make RSVP collection effortless with our innovative QR code system. 
                Guests can respond instantly, and everything syncs automatically to your BeeHitched dashboard.
              </p>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-4 mt-1">
                    <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Instant QR Code Generation</h3>
                    <p className="text-gray-600">Generate beautiful, custom QR codes for your invitations. Each code links directly to your personalized RSVP page with your wedding details.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-1">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Mobile-First RSVP Experience</h3>
                    <p className="text-gray-600">Guests simply scan the QR code with their phone camera and instantly access your RSVP form. No apps to download, no accounts to create.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-1">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Real-Time Sync</h3>
                    <p className="text-gray-600">Every RSVP response instantly appears in your BeeHitched dashboard. Track attendance, dietary restrictions, and guest preferences in real-time.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-4 mt-1">
                    <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Comprehensive Analytics</h3>
                    <p className="text-gray-600">Get detailed insights into your guest responses. Track RSVP rates, dietary preferences, and generate seating charts automatically.</p>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <Link href="/register" className="btn-primary inline-flex items-center">
                  Start Managing Guests
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="card p-8 bg-white/90 backdrop-blur-sm border border-gray-200">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Sarah & Michael's Wedding</h3>
                  <p className="text-sm text-gray-600">Scan to RSVP</p>
                </div>
                
                {/* QR Code Placeholder */}
                <div className="flex justify-center mb-6">
                  <div className="w-48 h-48 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                    <div className="text-center">
                      <svg className="w-16 h-16 text-gray-400 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z"/>
                      </svg>
                      <p className="text-sm text-gray-500">QR Code</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <div>
                      <div className="font-medium text-sm">Confirmed</div>
                      <div className="text-xs text-gray-600">RSVP responses</div>
                    </div>
                    <div className="text-2xl font-bold text-green-600">127</div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <div>
                      <div className="font-medium text-sm">Pending</div>
                      <div className="text-xs text-gray-600">Awaiting response</div>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">23</div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <div>
                      <div className="font-medium text-sm">Dietary Needs</div>
                      <div className="text-xs text-gray-600">Special requirements</div>
                    </div>
                    <div className="text-2xl font-bold text-purple-600">8</div>
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  <p className="text-xs text-gray-500">
                    QR codes automatically sync with your BeeHitched dashboard
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Moodboard Feature Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 right-20 w-40 h-40 bg-pink-200 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-32 h-32 bg-purple-200 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 right-1/4 w-28 h-28 bg-rose-200 rounded-full blur-2xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-5xl font-serif font-bold text-gray-900 mb-6">
                Visualize Your Dream Wedding
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Create stunning moodboards to capture your wedding vision. 
                Collect inspiration, share ideas with vendors, and bring your dream wedding to life.
              </p>
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              {/* Moodboard Preview */}
              <div className="card p-8 bg-white/90 backdrop-blur-sm border border-gray-200 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-serif font-bold text-gray-900">Wedding Moodboard</h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Live Preview</span>
                  </div>
                </div>

                {/* Color Palette */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Color Palette</h4>
                  <div className="flex space-x-2">
                    <div className="w-12 h-12 bg-rose-200 rounded-lg border-2 border-white shadow-sm"></div>
                    <div className="w-12 h-12 bg-pink-200 rounded-lg border-2 border-white shadow-sm"></div>
                    <div className="w-12 h-12 bg-purple-200 rounded-lg border-2 border-white shadow-sm"></div>
                    <div className="w-12 h-12 bg-indigo-200 rounded-lg border-2 border-white shadow-sm"></div>
                    <div className="w-12 h-12 bg-slate-200 rounded-lg border-2 border-white shadow-sm"></div>
                  </div>
                </div>

                {/* Image Grid Preview */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Inspiration Collection</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <motion.div 
                      className="aspect-square bg-gradient-to-br from-rose-100 to-pink-100 rounded-lg border-2 border-white shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </motion.div>
                    <motion.div 
                      className="aspect-square bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg border-2 border-white shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </motion.div>
                    <motion.div 
                      className="aspect-square bg-gradient-to-br from-pink-100 to-rose-100 rounded-lg border-2 border-white shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </motion.div>
                    <motion.div 
                      className="aspect-square bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg border-2 border-white shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </motion.div>
                    <motion.div 
                      className="aspect-square bg-gradient-to-br from-slate-100 to-gray-100 rounded-lg border-2 border-white shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </motion.div>
                    <motion.div 
                      className="aspect-square bg-gradient-to-br from-rose-50 to-pink-50 rounded-lg border-2 border-dashed border-rose-200 hover:shadow-md transition-shadow cursor-pointer flex items-center justify-center"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <svg className="w-6 h-6 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </motion.div>
                  </div>
                </div>

                {/* Moodboard Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-pink-50 rounded-lg">
                    <div className="text-2xl font-bold text-pink-600">24</div>
                    <div className="text-xs text-gray-600">Images</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">5</div>
                    <div className="text-xs text-gray-600">Colors</div>
                  </div>
                  <div className="text-center p-3 bg-indigo-50 rounded-lg">
                    <div className="text-2xl font-bold text-indigo-600">3</div>
                    <div className="text-xs text-gray-600">Boards</div>
                  </div>
                </div>

                {/* Share Options */}
                <div className="mt-6 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-3">Share with Vendors</h4>
                  <div className="flex space-x-2">
                    <button className="px-3 py-2 bg-white rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors border border-gray-200">
                      Florist
                    </button>
                    <button className="px-3 py-2 bg-white rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors border border-gray-200">
                      Photographer
                    </button>
                    <button className="px-3 py-2 bg-white rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors border border-gray-200">
                      Decorator
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {/* Moodboard Features */}
              <div className="space-y-6">
                <div className="flex items-start group">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center mr-4 mt-1 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Beautiful Image Collections</h3>
                    <p className="text-gray-600">Upload and organize your favorite wedding inspiration photos. Create multiple moodboards for different aspects of your wedding.</p>
                  </div>
                </div>

                <div className="flex items-start group">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center mr-4 mt-1 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Share with Vendors</h3>
                    <p className="text-gray-600">Send your moodboards directly to vendors to ensure they understand your vision. Perfect for florists, photographers, and decorators.</p>
                  </div>
                </div>

                <div className="flex items-start group">
                  <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl flex items-center justify-center mr-4 mt-1 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Color Palette Tools</h3>
                    <p className="text-gray-600">Extract and save color palettes from your inspiration images. Create cohesive color schemes that flow throughout your wedding.</p>
                  </div>
                </div>

                <div className="flex items-start group">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mr-4 mt-1 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Collaborative Planning</h3>
                    <p className="text-gray-600">Invite family and friends to contribute to your moodboards. Get feedback and suggestions from your wedding party and loved ones.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Link href="/register" className="btn-primary inline-flex items-center text-lg px-8 py-4">
                  Start Creating Moodboards
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-40 h-40 bg-gold-200 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-32 h-32 bg-primary-200 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/3 w-28 h-28 bg-purple-200 rounded-full blur-2xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-5xl font-serif font-bold text-gray-900 mb-6">
                What Couples Are Saying
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Join thousands of happy couples who planned their perfect wedding with us. 
                See how BeeHitched transformed their wedding planning experience.
              </p>
            </motion.div>
          </div>
          
          <div className="max-w-6xl mx-auto">
            {/* Main Testimonial */}
            <div className="relative mb-12">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="card p-10 text-center bg-white/80 backdrop-blur-sm border border-gray-200 shadow-2xl"
              >
                {/* Quote Icon */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-gold-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                    </svg>
                  </div>
                </div>

                {/* Rating Stars */}
                <div className="flex justify-center mb-6">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                    >
                      <Star className="w-6 h-6 text-gold-400 fill-current mx-1" />
                    </motion.div>
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-2xl text-gray-700 mb-8 italic leading-relaxed max-w-4xl mx-auto">
                  "{testimonials[currentTestimonial].text}"
                </p>

                {/* Couple Info */}
                <div className="flex items-center justify-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-gold-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {testimonials[currentTestimonial].avatar}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900 text-lg">
                      {testimonials[currentTestimonial].name}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {testimonials[currentTestimonial].location} • {testimonials[currentTestimonial].weddingDate}
                    </p>
                  </div>
                </div>
              </motion.div>
              
              {/* Navigation Buttons */}
              <button
                onClick={prevTestimonial}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all duration-300 hover:scale-110 border border-gray-200"
              >
                <ChevronLeft className="w-6 h-6 text-gray-600" />
              </button>
              <button
                onClick={nextTestimonial}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all duration-300 hover:scale-110 border border-gray-200"
              >
                <ChevronRight className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            
            {/* Testimonial Indicators */}
            <div className="flex justify-center space-x-3 mb-12">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial 
                      ? 'bg-gradient-to-r from-primary-500 to-gold-500 scale-125' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>

            {/* Stats Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid md:grid-cols-4 gap-8"
            >
              <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200">
                <div className="text-3xl font-bold text-primary-600 mb-2">2,500+</div>
                <div className="text-gray-600">Happy Couples</div>
              </div>
              <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200">
                <div className="text-3xl font-bold text-gold-600 mb-2">4.9/5</div>
                <div className="text-gray-600">Average Rating</div>
              </div>
              <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200">
                <div className="text-3xl font-bold text-purple-600 mb-2">98%</div>
                <div className="text-gray-600">Would Recommend</div>
              </div>
              <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200">
                <div className="text-3xl font-bold text-green-600 mb-2">50+</div>
                <div className="text-gray-600">Cities Served</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-bg">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-serif font-bold text-gray-900 mb-6">
              Ready to Start Planning?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of couples who are planning their perfect wedding with BeeHitched.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Link href="/dashboard" className="btn-primary text-lg px-8 py-4 inline-flex items-center">
                  Go to Dashboard
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              ) : (
                <>
                  <Link href="/register" className="btn-primary text-lg px-8 py-4 inline-flex items-center">
                    Start Planning Free
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                  <Link href="/login" className="btn-secondary text-lg px-8 py-4">
                    Sign In
                  </Link>
                </>
              )}
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
            <p>&copy; 2024 BeeHitched. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* MailerLite Script */}
      <Script
        id="mailerlite-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,e,u,f,l,n){w[f]=w[f]||function(){(w[f].q=w[f].q||[])
            .push(arguments);},l=d.createElement(e),l.async=1,l.src=u,
            n=d.getElementsByTagName(e)[0],n.parentNode.insertBefore(l,n);})
            (window,document,'script','https://assets.mailerlite.com/js/universal.js','ml');
            ml('account', '1657165');
          `
        }}
      />

      {/* MailerLite Popup Trigger */}
      {showMailerLitePopup && (
        <Script
          id="mailerlite-popup-trigger"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              // Trigger MailerLite popup for new users
              console.log('MailerLite popup trigger script executing...');
              if (typeof ml !== 'undefined') {
                console.log('ml function found, triggering popup...');
                ml('show', '159606328378001195');
              } else {
                console.log('ml function not found');
              }
            `
          }}
        />
      )}
    </div>
  )
} 