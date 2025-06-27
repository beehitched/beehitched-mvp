'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { motion } from 'framer-motion'
import { Heart, Calendar, MapPin, Users, DollarSign, Palette, ArrowLeft } from 'lucide-react'

export default function CreateWeddingPage() {
  const router = useRouter()
  const { user, token } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    weddingDate: '',
    venue: '',
    theme: '',
    budget: '',
    guestCount: '',
    partnerName: '',
    description: '',
    role: 'Bride' // Default role for wedding creator
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!user) {
    router.push('/login')
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.name || !formData.weddingDate || !formData.partnerName) {
      setError('Please fill in all required fields')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/create-wedding`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          weddingDate: formData.weddingDate,
          venue: formData.venue,
          theme: formData.theme,
          budget: parseInt(formData.budget) || 0,
          guestCount: parseInt(formData.guestCount) || 0,
          partnerName: formData.partnerName,
          description: formData.description,
          role: formData.role
        })
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Wedding created:', data)
        router.push('/dashboard')
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to create wedding')
      }
    } catch (error) {
      console.error('Create wedding error:', error)
      setError('Failed to create wedding')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-soft mb-4"
          >
            <Heart className="w-8 h-8 text-primary-600" />
          </motion.div>
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
            Create Your Wedding
          </h1>
          <p className="text-gray-600">
            Let's set up your wedding details to get started
          </p>
        </div>

        {/* Wedding Creation Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
              >
                {error}
              </motion.div>
            )}

            {/* Wedding Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Wedding Name *
              </label>
              <div className="relative">
                <Heart className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Sarah & Michael's Wedding"
                />
              </div>
            </div>

            {/* Partner Name */}
            <div>
              <label htmlFor="partnerName" className="block text-sm font-medium text-gray-700 mb-2">
                Partner's Name *
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  id="partnerName"
                  name="partnerName"
                  value={formData.partnerName}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter your partner's name"
                />
              </div>
            </div>

            {/* Your Role */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                Your Role *
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="Bride">Bride</option>
                  <option value="Groom">Groom</option>
                  <option value="Planner">Wedding Planner</option>
                  <option value="Parent">Parent</option>
                  <option value="Maid of Honor">Maid of Honor</option>
                  <option value="Best Man">Best Man</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Friend">Friend</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Wedding Date */}
            <div>
              <label htmlFor="weddingDate" className="block text-sm font-medium text-gray-700 mb-2">
                Wedding Date *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="date"
                  id="weddingDate"
                  name="weddingDate"
                  value={formData.weddingDate}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Venue */}
            <div>
              <label htmlFor="venue" className="block text-sm font-medium text-gray-700 mb-2">
                Venue
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  id="venue"
                  name="venue"
                  value={formData.venue}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., The Grand Ballroom"
                />
              </div>
            </div>

            {/* Theme */}
            <div>
              <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-2">
                Wedding Theme
              </label>
              <div className="relative">
                <Palette className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  id="theme"
                  name="theme"
                  value={formData.theme}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Romantic Garden, Modern Minimalist"
                />
              </div>
            </div>

            {/* Budget and Guest Count Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Budget */}
              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                  Budget
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    min="0"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="25000"
                  />
                </div>
              </div>

              {/* Guest Count */}
              <div>
                <label htmlFor="guestCount" className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Guest Count
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    id="guestCount"
                    name="guestCount"
                    value={formData.guestCount}
                    onChange={handleChange}
                    min="0"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="150"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Wedding Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Tell us about your special day..."
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? 'Creating Wedding...' : 'Create Wedding'}
            </button>
          </form>

          {/* Back Link */}
          <div className="text-center mt-6">
            <Link 
              href="/setup-wedding"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to setup options
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
} 