'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Heart, 
  Users, 
  Shield, 
  Sparkles, 
  Target, 
  Award,
  Calendar,
  MessageSquare,
  QrCode,
  Building2,
  ArrowRight,
  Star,
  CheckCircle,
  Globe,
  Zap
} from 'lucide-react'
import Navigation from '@/components/Navigation'

const values = [
  {
    icon: Heart,
    title: 'Love-First Design',
    description: 'Every feature is designed with love and care, understanding that your wedding is one of the most important days of your life.'
  },
  {
    icon: Users,
    title: 'Collaboration at Core',
    description: 'We believe wedding planning should bring people together, not create stress. Our platform makes collaboration seamless and joyful.'
  },
  {
    icon: Shield,
    title: 'Privacy & Security',
    description: 'Your wedding data is precious. We use enterprise-grade security to protect every detail of your special day.'
  },
  {
    icon: Sparkles,
    title: 'Elegant Simplicity',
    description: 'Beautiful design shouldn\'t be complicated. We make powerful wedding planning tools that are intuitive and delightful to use.'
  }
]

const stats = [
  { number: '100+', label: 'Happy Couples', icon: Heart },
  { number: '10,000+', label: 'Guests Managed', icon: Users },
  { number: '5,000+', label: 'Tasks Completed', icon: CheckCircle },
  { number: '99.9%', label: 'Uptime', icon: Shield }
]

const team = [
  {
    name: 'Elle Witzer',
    role: 'Founder & CEO',
    bio: 'Former wedding planner turned tech entrepreneur. Elle founded BeeHitched after experiencing the chaos of traditional wedding planning firsthand.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face'
  },
  {
    name: 'Sarah Johnson',
    role: 'Head of Product',
    bio: 'Product designer with 8+ years building user-centered experiences. Passionate about making complex workflows feel effortless.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
  },
  {
    name: 'David Rodriguez',
    role: 'Lead Engineer',
    bio: 'Full-stack developer who believes technology should solve real problems. Built BeeHitched\'s robust backend and real-time features.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  },
  {
    name: 'Michael Davis',
    role: 'Head of Design',
    bio: 'UI/UX designer focused on creating beautiful, accessible interfaces. Ensures every interaction with BeeHitched feels magical.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  }
]

const milestones = [
  {
    year: '2024',
    title: 'The Beginning',
    description: 'BeeHitched was born from a simple idea: wedding planning should be beautiful, collaborative, and stress-free.'
  },
  {
    year: '2025',
    title: 'First 100 Couples',
    description: 'Reached our first milestone of helping 100 couples plan their perfect weddings with our platform.'
  },
  {
    year: '2025',
    title: 'QR Code Innovation',
    description: 'Launched our revolutionary QR code RSVP system, making guest management effortless for couples.'
  },
  {
    year: '2025',
    title: 'Growing Strong',
    description: 'Now serving 100+ couples worldwide with plans to expand our features and reach.'
  }
]

export default function AboutPage() {
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
              About BeeHitched
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              We're on a mission to make wedding planning beautiful, collaborative, and stress-free for every couple.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-serif font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                BeeHitched was born from a simple yet powerful realization: wedding planning should bring people together, not create stress and chaos.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Our founder, Elle, was a wedding planner who saw firsthand how traditional planning methods left couples overwhelmed and disconnected from their loved ones. She dreamed of a platform that would make wedding planning collaborative, beautiful, and actually enjoyable.
              </p>
              <p className="text-lg text-gray-600">
                Today, BeeHitched serves hundreds of couples worldwide, helping them create not just perfect weddings, but beautiful memories of the planning journey itself.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="card p-8 bg-gradient-to-br from-primary-50 to-gold-50">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                    <Heart className="w-8 h-8 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900">Our Mission</h3>
                    <p className="text-gray-600">Making wedding planning magical</p>
                  </div>
                </div>
                <p className="text-lg text-gray-700 italic">
                  "We believe every couple deserves to enjoy their wedding planning journey. Our platform transforms what's often a stressful experience into a collaborative celebration of love."
                </p>
                <div className="mt-6 text-sm text-gray-600">
                  — Elle Witzer, Founder & CEO
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 gradient-bg">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              These core principles guide everything we do at BeeHitched.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card p-6 text-center"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">
              By the Numbers
            </h2>
            <p className="text-xl text-gray-600">
              The impact we've made in helping couples plan their perfect weddings.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-primary-600" />
                </div>
                <div className="text-4xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 gradient-bg">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-gray-600">
              Key milestones in the BeeHitched story.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-primary-200"></div>
              
              {milestones.map((milestone, index) => (
                <motion.div
                  key={`${milestone.year}-${milestone.title}`}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="relative flex items-start mb-12"
                >
                  <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-8 relative z-10">
                    {milestone.year}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {milestone.title}
                    </h3>
                    <p className="text-gray-600">
                      {milestone.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The passionate people behind BeeHitched who are dedicated to making your wedding planning journey magical.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card p-6 text-center"
              >
                <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-primary-600 font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-gray-600 text-sm">
                  {member.bio}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Highlight Section */}
      <section className="py-20 gradient-bg">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">
              What Makes BeeHitched Special
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover the unique features that set us apart from traditional wedding planning methods.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="card p-8"
            >
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-6">
                <Calendar className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Beautiful Timeline Planning
              </h3>
              <p className="text-gray-600 mb-6">
                Our intuitive drag-and-drop timeline makes organizing your wedding tasks feel effortless and enjoyable.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-primary-600 mr-2" />
                  Visual task management
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-primary-600 mr-2" />
                  Progress tracking
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-primary-600 mr-2" />
                  Deadline reminders
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="card p-8"
            >
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-6">
                <MessageSquare className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Seamless Collaboration
              </h3>
              <p className="text-gray-600 mb-6">
                Invite family and friends to help with planning while maintaining full control over your special day.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-primary-600 mr-2" />
                  Role-based permissions
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-primary-600 mr-2" />
                  Real-time messaging
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-primary-600 mr-2" />
                  Task delegation
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="card p-8"
            >
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-6">
                <QrCode className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Smart Guest Management
              </h3>
              <p className="text-gray-600 mb-6">
              Generate QR codes for instant RSVP collection and manage your guest list with powerful analytics.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-primary-600 mr-2" />
                  QR code RSVPs
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-primary-600 mr-2" />
                  Real-time tracking
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-primary-600 mr-2" />
                  Dietary preferences
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-serif font-bold text-gray-900 mb-6">
              Ready to Start Your Wedding Planning Journey?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of couples who are already planning their perfect wedding with BeeHitched.
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