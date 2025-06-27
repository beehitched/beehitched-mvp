'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
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
  Clock
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

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
    text: 'BeeHitched made our wedding planning so much easier! The timeline feature kept us organized and stress-free.',
    rating: 5
  },
  {
    name: 'Emily & David',
    text: 'The guest management system saved us hours of work. Everything was perfectly organized for our big day.',
    rating: 5
  },
  {
    name: 'Jessica & Chris',
    text: 'The collaboration features made planning with our families so much easier. Everyone could contribute while we stayed in control.',
    rating: 5
  }
]

export default function HomePage() {
  const { user } = useAuth()
  const [currentTestimonial, setCurrentTestimonial] = React.useState(0)

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
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
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
      <section className="py-20 bg-white">
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

      {/* Preview Section */}
      <section className="py-20 gradient-bg">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-serif font-bold text-gray-900 mb-6">
                Beautiful Timeline Planning
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Organize your wedding tasks with our intuitive drag-and-drop interface. 
                Move tasks between categories, set due dates, and track your progress.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-primary-600 mr-3" />
                  <span>Drag-and-drop task management</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-primary-600 mr-3" />
                  <span>Category organization</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-primary-600 mr-3" />
                  <span>Progress tracking</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="card p-6 bg-white/80 backdrop-blur-sm">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Venue</h3>
                    <span className="text-sm text-gray-500">3 tasks</span>
                  </div>
                  <div className="space-y-2">
                    <div className="p-3 bg-primary-50 rounded-lg border-l-4 border-primary-500">
                      <div className="font-medium">Book ceremony venue</div>
                      <div className="text-sm text-gray-600">Due: March 15</div>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                      <div className="font-medium">Book reception venue</div>
                      <div className="text-sm text-gray-600">Due: April 1</div>
                    </div>
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

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">
              What Couples Are Saying
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of happy couples who planned their perfect wedding with us.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="card p-8 text-center"
              >
                <div className="flex justify-center mb-4">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-gold-400 fill-current" />
                  ))}
                </div>
                <p className="text-xl text-gray-700 mb-6 italic">
                  "{testimonials[currentTestimonial].text}"
                </p>
                <p className="font-semibold text-gray-900">
                  {testimonials[currentTestimonial].name}
                </p>
              </motion.div>
              
              <button
                onClick={prevTestimonial}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-medium flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={nextTestimonial}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-medium flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            
            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentTestimonial ? 'bg-primary-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
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
    </div>
  )
} 