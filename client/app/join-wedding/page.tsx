'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { motion } from 'framer-motion'
import { Heart, Users, ArrowLeft, QrCode } from 'lucide-react'

export default function JoinWeddingPage() {
  const router = useRouter()
  const { user, token } = useAuth()
  const [weddingId, setWeddingId] = useState('')
  const [role, setRole] = useState('Friend') // Default role for joining
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!user) {
    router.push('/login')
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!weddingId.trim()) {
      setError('Please enter a wedding ID')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/collaboration/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          weddingId: weddingId.trim(),
          role: role
        })
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Joined wedding:', data)
        router.push('/dashboard')
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to join wedding')
      }
    } catch (error) {
      console.error('Join wedding error:', error)
      setError('Failed to join wedding')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
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
            Join a Wedding
          </h1>
          <p className="text-gray-600">
            Enter the wedding ID to join as a collaborator
          </p>
        </div>

        {/* Join Wedding Form */}
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

            {/* Wedding ID */}
            <div>
              <label htmlFor="weddingId" className="block text-sm font-medium text-gray-700 mb-2">
                Wedding ID *
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  id="weddingId"
                  name="weddingId"
                  value={weddingId}
                  onChange={(e) => setWeddingId(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter the wedding ID"
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Ask the wedding organizer for the wedding ID or scan the QR code if available.
              </p>
            </div>

            {/* Role Selection */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                Your Role *
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  id="role"
                  name="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="Friend">Friend</option>
                  <option value="Bride">Bride</option>
                  <option value="Groom">Groom</option>
                  <option value="Planner">Wedding Planner</option>
                  <option value="Parent">Parent</option>
                  <option value="Maid of Honor">Maid of Honor</option>
                  <option value="Best Man">Best Man</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Select your role in the wedding planning process.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? 'Joining Wedding...' : 'Join Wedding'}
            </button>
          </form>

          {/* Info Section */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-sm font-medium text-blue-900 mb-2">
              How to get a Wedding ID:
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Ask the wedding organizer for the wedding ID</li>
              <li>• Look for the QR code on wedding invitations</li>
              <li>• Check your email for wedding invitation links</li>
            </ul>
          </div>

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