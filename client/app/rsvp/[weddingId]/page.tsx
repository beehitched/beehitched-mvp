'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Heart, 
  Users, 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle, 
  XCircle, 
  Clock,
  Send,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'

interface WeddingInfo {
  _id: string
  brideName: string
  groomName: string
  weddingDate: string
  venue: string
  city: string
}

interface RSVPForm {
  name: string
  email: string
  phone: string
  rsvpStatus: 'attending' | 'declined' | 'maybe'
  plusOne: boolean
  plusOneName: string
  dietaryRestrictions: string
  group: string
  notes: string
}

export default function RSVPPage({ params }: { params: { weddingId: string } }) {
  const [weddingInfo, setWeddingInfo] = useState<WeddingInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState<RSVPForm>({
    name: '',
    email: '',
    phone: '',
    rsvpStatus: 'attending',
    plusOne: false,
    plusOneName: '',
    dietaryRestrictions: '',
    group: 'Other',
    notes: ''
  })

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

  useEffect(() => {
    fetchWeddingInfo()
  }, [])

  const fetchWeddingInfo = async () => {
    try {
      const response = await fetch(`${API_URL}/weddings/${params.weddingId}`)
      if (response.ok) {
        const data = await response.json()
        setWeddingInfo(data)
      } else {
        setError('Wedding not found')
      }
    } catch (error) {
      console.error('Error fetching wedding info:', error)
      setError('Unable to load wedding information')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const response = await fetch(`${API_URL}/guests/rsvp/${params.weddingId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      })

      if (response.ok) {
        setSubmitted(true)
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to submit RSVP')
      }
    } catch (error) {
      console.error('Error submitting RSVP:', error)
      setError('Failed to submit RSVP. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (error && !weddingInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-serif font-bold text-gray-900 mb-2">Wedding Not Found</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link href="/" className="text-primary-600 hover:text-primary-700">
            Return to Home
          </Link>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-lg p-8 max-w-md w-full text-center shadow-lg"
        >
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-serif font-bold text-gray-900 mb-2">Thank You!</h1>
          <p className="text-gray-600 mb-6">
            Your RSVP has been submitted successfully. We can't wait to celebrate with you!
          </p>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-800">
              You will receive a confirmation email shortly.
            </p>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <Heart className="w-8 h-8 text-primary-600 mx-auto mb-2" />
            <h1 className="text-2xl font-serif font-bold text-gray-900">
              {weddingInfo?.brideName} & {weddingInfo?.groomName}
            </h1>
            <p className="text-gray-600">
              {new Date(weddingInfo?.weddingDate || '').toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {weddingInfo?.venue}, {weddingInfo?.city}
            </p>
          </div>
        </div>
      </div>

      {/* RSVP Form */}
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <Users className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">
                RSVP
              </h2>
              <p className="text-gray-600">
                Please let us know if you'll be joining us on our special day
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                  Personal Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({...form, name: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Your full name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({...form, email: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({...form, phone: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>

              {/* RSVP Status */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                  Will you attend?
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    type="button"
                    onClick={() => setForm({...form, rsvpStatus: 'attending'})}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      form.rsvpStatus === 'attending'
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <CheckCircle className="w-6 h-6 mx-auto mb-2" />
                    <span className="font-medium">Attending</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setForm({...form, rsvpStatus: 'maybe'})}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      form.rsvpStatus === 'maybe'
                        ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Clock className="w-6 h-6 mx-auto mb-2" />
                    <span className="font-medium">Maybe</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setForm({...form, rsvpStatus: 'declined'})}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      form.rsvpStatus === 'declined'
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <XCircle className="w-6 h-6 mx-auto mb-2" />
                    <span className="font-medium">Declined</span>
                  </button>
                </div>
              </div>

              {/* Plus One */}
              {form.rsvpStatus === 'attending' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                    Plus One
                  </h3>
                  
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="plusOne"
                      checked={form.plusOne}
                      onChange={(e) => setForm({...form, plusOne: e.target.checked})}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <label htmlFor="plusOne" className="text-sm font-medium text-gray-700">
                      I will bring a plus one
                    </label>
                  </div>
                  
                  {form.plusOne && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Plus One Name
                      </label>
                      <input
                        type="text"
                        value={form.plusOneName}
                        onChange={(e) => setForm({...form, plusOneName: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Plus one's full name"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Additional Information */}
              {form.rsvpStatus === 'attending' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                    Additional Information
                  </h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dietary Restrictions
                    </label>
                    <textarea
                      value={form.dietaryRestrictions}
                      onChange={(e) => setForm({...form, dietaryRestrictions: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      rows={3}
                      placeholder="Any dietary restrictions or allergies..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Group
                    </label>
                    <select
                      value={form.group}
                      onChange={(e) => setForm({...form, group: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="Bride Family">Bride Family</option>
                      <option value="Groom Family">Groom Family</option>
                      <option value="Bride Friends">Bride Friends</option>
                      <option value="Groom Friends">Groom Friends</option>
                      <option value="Work Colleagues">Work Colleagues</option>
                      <option value="Neighbors">Neighbors</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Notes
                    </label>
                    <textarea
                      value={form.notes}
                      onChange={(e) => setForm({...form, notes: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      rows={3}
                      placeholder="Any additional notes or special requests..."
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full btn-primary flex items-center justify-center space-x-2"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Submit RSVP</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 