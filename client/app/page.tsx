'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Heart, 
  Calendar, 
  Users, 
  ShoppingBag, 
  CheckCircle, 
  Star,
  ArrowRight,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

const features = [
  {
    icon: Calendar,
    title: 'Timeline Planning',
    description: 'Organize your wedding tasks with our intuitive drag-and-drop timeline board.'
  },
  {
    icon: Users,
    title: 'Guest Management',
    description: 'Keep track of RSVPs, dietary restrictions, and seating arrangements.'
  },
  {
    icon: ShoppingBag,
    title: 'Wedding Shop',
    description: 'Discover beautiful wedding essentials from invitations to decor.'
  },
  {
    icon: CheckCircle,
    title: 'Task Tracking',
    description: 'Never miss a deadline with our comprehensive task management system.'
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
    text: 'We found everything we needed in the wedding shop. The quality and selection are amazing!',
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
              Everything You Need to Plan Your Wedding
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From timeline management to guest coordination, we've got you covered.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card-hover p-6 text-center"
              >
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
                <li><Link href="/shop" className="hover:text-white transition-colors">Wedding Shop</Link></li>
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