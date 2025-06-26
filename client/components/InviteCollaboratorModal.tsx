'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, UserPlus, Crown, Users, Calendar, MapPin } from 'lucide-react'

interface InviteCollaboratorModalProps {
  weddingId: string
  onClose: () => void
  onInvite: (inviteData: { email: string; name: string; role: string }) => Promise<void>
}

const roles = [
  { value: 'Bride', label: 'Bride', icon: Crown, description: 'Primary wedding planner' },
  { value: 'Groom', label: 'Groom', icon: Crown, description: 'Primary wedding planner' },
  { value: 'Planner', label: 'Wedding Planner', icon: Calendar, description: 'Professional planner' },
  { value: 'Maid of Honor', label: 'Maid of Honor', icon: Users, description: 'Bride\'s main attendant' },
  { value: 'Best Man', label: 'Best Man', icon: Users, description: 'Groom\'s main attendant' },
  { value: 'Parent', label: 'Parent', icon: Users, description: 'Parent of bride or groom' },
  { value: 'Sibling', label: 'Sibling', icon: Users, description: 'Sibling of bride or groom' },
  { value: 'Friend', label: 'Friend', icon: Users, description: 'Close friend helping out' },
  { value: 'Other', label: 'Other', icon: Users, description: 'Other collaborator' }
]

export default function InviteCollaboratorModal({ weddingId, onClose, onInvite }: InviteCollaboratorModalProps) {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    role: 'Friend'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await onInvite(formData)
      onClose()
    } catch (error: any) {
      setError(error.message || 'Failed to send invitation')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Invite Collaborator</h2>
              <p className="text-sm text-gray-600">Add someone to help plan your wedding</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="collaborator@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Role *
            </label>
            <div className="grid grid-cols-1 gap-3">
              {roles.map((role) => {
                const IconComponent = role.icon
                return (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => setFormData({...formData, role: role.value})}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${
                      formData.role === role.value
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <IconComponent className="w-5 h-5" />
                      <div>
                        <div className="font-medium">{role.label}</div>
                        <div className="text-sm text-gray-600">{role.description}</div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">What happens next?</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• An invitation will be sent to their email</li>
              <li>• They can accept and create an account</li>
              <li>• They'll have access based on their role</li>
              <li>• You can manage their permissions later</li>
            </ul>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4" />
                  <span>Send Invitation</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
} 