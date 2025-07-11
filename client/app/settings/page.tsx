'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { motion } from 'framer-motion'
import { 
  Settings, 
  User, 
  Heart, 
  Calendar,
  MapPin,
  Mail,
  Phone,
  Lock,
  Bell,
  Palette,
  Save,
  Camera,
  Users,
  UserPlus,
  MessageCircle,
  CheckCircle
} from 'lucide-react'
import Navigation from '@/components/Navigation'
import InviteCollaboratorModal from '@/components/InviteCollaboratorModal'
import RoleBadge from '@/components/RoleBadge'

interface WeddingDetails {
  weddingDate: string
  venue: string
  venueAddress: string
  ceremonyTime: string
  receptionTime: string
  guestCount: number
  budget: number
  theme: string
  colors: string[]
}

interface UserProfile {
  name: string
  email: string
  phone: string
  avatar: string
  partnerName: string
  partnerEmail: string
  partnerPhone: string
}

interface NotificationSettings {
  emailNotifications: boolean
  pushNotifications: boolean
  taskReminders: boolean
  guestUpdates: boolean
  budgetAlerts: boolean
  weeklyDigest: boolean
}

interface Collaborator {
  _id: string
  userId?: {
    _id: string
    name: string
    email: string
  }
  name: string
  email: string
  role: string
  status: 'pending' | 'accepted' | 'declined'
  invitedAt: string
  acceptedAt?: string
  invitedBy: {
    name: string
  }
}

export default function SettingsPage() {
  const { user, token, updateUser } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [initialLoading, setInitialLoading] = useState(true)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [currentWeddingId, setCurrentWeddingId] = useState<string>('')
  
  // Profile settings
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    phone: '',
    avatar: '',
    partnerName: '',
    partnerEmail: '',
    partnerPhone: ''
  })

  // Wedding details
  const [weddingDetails, setWeddingDetails] = useState<WeddingDetails>({
    weddingDate: '',
    venue: '',
    venueAddress: '',
    ceremonyTime: '',
    receptionTime: '',
    guestCount: 0,
    budget: 0,
    theme: '',
    colors: []
  })

  // Notification settings
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    taskReminders: true,
    guestUpdates: true,
    budgetAlerts: true,
    weeklyDigest: false
  })

  // Password change
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // Contact form
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [contactLoading, setContactLoading] = useState(false)
  const [contactSuccess, setContactSuccess] = useState(false)

  // Collaboration
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [myRole, setMyRole] = useState<any>(null)

  const colorOptions = [
    { name: 'Blush Pink', value: '#FCE7F3' },
    { name: 'Sage Green', value: '#D1FAE5' },
    { name: 'Navy Blue', value: '#1E3A8A' },
    { name: 'Gold', value: '#FCD34D' },
    { name: 'Lavender', value: '#E9D5FF' },
    { name: 'Coral', value: '#FED7AA' },
    { name: 'Mint', value: '#A7F3D0' },
    { name: 'Rose Gold', value: '#FBBF24' }
  ]

  const themeOptions = [
    'Rustic Elegance',
    'Modern Minimalist',
    'Vintage Romance',
    'Garden Party',
    'Beach Wedding',
    'Winter Wonderland',
    'Bohemian Chic',
    'Classic Traditional'
  ]

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

  useEffect(() => {
    const loadData = async () => {
      setInitialLoading(true)
      try {
        await fetchCurrentWedding()
        await fetchSettings()
      } catch (error) {
        console.error('Error loading settings data:', error)
      } finally {
        setInitialLoading(false)
      }
    }
    
    loadData()
  }, [user])

  const fetchCurrentWedding = async () => {
    try {
      const response = await fetch(`${API_URL}/collaboration/user/weddings`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        if (data.weddings && data.weddings.length > 0) {
          const weddingId = data.weddings[0].id
          setCurrentWeddingId(weddingId)
          
          // Fetch collaborators and role data for this wedding
          if (user) {
            await Promise.all([
              fetchCollaborators(weddingId),
              fetchMyRole(weddingId)
            ])
          }
        }
      }
    } catch (error) {
      console.error('Error fetching current wedding:', error)
    }
  }

  const fetchSettings = async () => {
    try {
      // For now, we'll use the user data from AuthContext
      // In a real app, you might want to create a dedicated settings endpoint
      if (user) {
        setProfile({
          name: user.name || '',
          email: user.email || '',
          phone: '',
          avatar: '',
          partnerName: user.partnerName || '',
          partnerEmail: '',
          partnerPhone: ''
        })
        
        // Format the wedding date properly for the date input
        let formattedWeddingDate = ''
        if (user.weddingDate) {
          const date = new Date(user.weddingDate)
          formattedWeddingDate = date.toISOString().split('T')[0] // Convert to yyyy-MM-dd format
        }
        
        setWeddingDetails({
          weddingDate: formattedWeddingDate,
          venue: user.venue || '',
          venueAddress: '',
          ceremonyTime: '',
          receptionTime: '',
          guestCount: user.guestCount || 0,
          budget: user.budget || 0,
          theme: user.theme || '',
          colors: []
        })
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    }
  }

  const fetchCollaborators = async (weddingId?: string) => {
    try {
      const targetWeddingId = weddingId || currentWeddingId
      if (!targetWeddingId) return
      
      const response = await fetch(`${API_URL}/collaboration/${targetWeddingId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setCollaborators(data)
      }
    } catch (error) {
      console.error('Error fetching collaborators:', error)
    }
  }

  const fetchMyRole = async (weddingId?: string) => {
    try {
      const targetWeddingId = weddingId || currentWeddingId
      if (!targetWeddingId) return
      
      const response = await fetch(`${API_URL}/collaboration/${targetWeddingId}/my-role`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setMyRole(data)
      }
    } catch (error) {
      console.error('Error fetching my role:', error)
    }
  }

  const handleSave = async () => {
    console.log('handleSave function called!')
    setLoading(true)
    try {
      console.log('Saving settings with data:', {
        name: profile.name,
        partnerName: profile.partnerName,
        weddingDate: weddingDetails.weddingDate,
        budget: weddingDetails.budget,
        guestCount: weddingDetails.guestCount,
        venue: weddingDetails.venue,
        theme: weddingDetails.theme
      })

      const requestBody = {
        name: profile.name,
        partnerName: profile.partnerName,
        weddingDate: weddingDetails.weddingDate || null,
        budget: weddingDetails.budget || 0,
        guestCount: weddingDetails.guestCount || 0,
        venue: weddingDetails.venue || '',
        theme: weddingDetails.theme || ''
      }

      console.log('Making request to:', `${API_URL}/auth/profile`)
      console.log('Request body:', requestBody)

      const response = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      })

      console.log('Response status:', response.status)
      console.log('Response ok:', response.ok)

      if (response.ok) {
        const data = await response.json()
        console.log('Response data:', data)
        
        // Update the user data in AuthContext
        if (data.user) {
          updateUser(data.user)
        }
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      } else {
        const errorText = await response.text()
        console.error('Error response:', errorText)
        let errorMessage = 'Failed to save settings'
        try {
          const errorData = JSON.parse(errorText)
          errorMessage = errorData.error || errorMessage
        } catch (e) {
          console.error('Could not parse error response:', e)
        }
        alert(errorMessage)
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Failed to save settings: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      console.log('Setting loading to false')
      setLoading(false)
    }
  }

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match')
      return
    }

    try {
      const response = await fetch(`${API_URL}/auth/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      })

      if (response.ok) {
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
        alert('Password updated successfully')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to update password')
      }
    } catch (error) {
      console.error('Error updating password:', error)
      alert('Failed to update password')
    }
  }

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfile({ ...profile, avatar: e.target?.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleInviteCollaborator = async (inviteData: { email: string; name: string; role: string }) => {
    try {
      if (!currentWeddingId) {
        throw new Error('No wedding selected')
      }
      
      const response = await fetch(`${API_URL}/collaboration/${currentWeddingId}/invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(inviteData)
      })

      if (response.ok) {
        await fetchCollaborators(currentWeddingId) // Refresh the list
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Failed to send invitation')
      }
    } catch (error: any) {
      throw error
    }
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setContactLoading(true)
    
    try {
      // For now, we'll just simulate sending the email
      // In a real implementation, you'd send this to your backend
      console.log('Contact form submitted:', contactForm)
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setContactSuccess(true)
      setContactForm({ name: '', email: '', subject: '', message: '' })
      
      // Reset success message after 3 seconds
      setTimeout(() => setContactSuccess(false), 3000)
    } catch (error) {
      console.error('Error sending contact form:', error)
    } finally {
      setContactLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <Settings className="w-16 h-16 text-primary-600 mx-auto mb-4" />
          <h1 className="text-2xl font-serif font-bold text-gray-900 mb-2">
            Settings
          </h1>
          <p className="text-gray-600">Please sign in to access your settings.</p>
        </div>
      </div>
    )
  }

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading settings...</p>
            </div>
          </div>
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
                Settings
              </h1>
              <p className="text-gray-600">
                Manage your account and wedding preferences.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              disabled={loading}
              className="btn-primary mt-4 md:mt-0"
            >
              <Save className="w-5 h-5 mr-2" />
              {loading ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
            </motion.button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="card p-4">
              <nav className="space-y-2">
                {[
                  { id: 'profile', label: 'Profile', icon: User },
                  { id: 'wedding', label: 'Wedding Details', icon: Heart },
                  { id: 'notifications', label: 'Notifications', icon: Bell },
                  { id: 'security', label: 'Security', icon: Lock },
                  { id: 'collaboration', label: 'Collaboration', icon: Users },
                  { id: 'contact', label: 'Contact Us', icon: MessageCircle }
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === id
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card p-6"
            >
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-gray-900">Profile Settings</h2>
                  
                  {/* Avatar Upload */}
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                        {profile.avatar ? (
                          <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-12 h-12 text-gray-400" />
                        )}
                      </div>
                      <label className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full cursor-pointer hover:bg-primary-700 transition-colors">
                        <Camera className="w-4 h-4" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Profile Photo</h3>
                      <p className="text-sm text-gray-600">Upload a photo for your profile</p>
                    </div>
                  </div>

                  {/* Personal Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Partner Information */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Partner Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Partner Name
                        </label>
                        <input
                          type="text"
                          value={profile.partnerName}
                          onChange={(e) => setProfile({ ...profile, partnerName: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Partner Email
                        </label>
                        <input
                          type="email"
                          value={profile.partnerEmail}
                          onChange={(e) => setProfile({ ...profile, partnerEmail: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Partner Phone
                        </label>
                        <input
                          type="tel"
                          value={profile.partnerPhone}
                          onChange={(e) => setProfile({ ...profile, partnerPhone: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Wedding Details Tab */}
              {activeTab === 'wedding' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-gray-900">Wedding Details</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Wedding Date
                      </label>
                      <input
                        type="date"
                        value={weddingDetails.weddingDate}
                        onChange={(e) => setWeddingDetails({ ...weddingDetails, weddingDate: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expected Guest Count
                      </label>
                      <input
                        type="number"
                        value={weddingDetails.guestCount}
                        onChange={(e) => setWeddingDetails({ ...weddingDetails, guestCount: Number(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Venue Name
                      </label>
                      <input
                        type="text"
                        value={weddingDetails.venue}
                        onChange={(e) => setWeddingDetails({ ...weddingDetails, venue: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Venue Address
                      </label>
                      <input
                        type="text"
                        value={weddingDetails.venueAddress}
                        onChange={(e) => setWeddingDetails({ ...weddingDetails, venueAddress: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ceremony Time
                      </label>
                      <input
                        type="time"
                        value={weddingDetails.ceremonyTime}
                        onChange={(e) => setWeddingDetails({ ...weddingDetails, ceremonyTime: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Reception Time
                      </label>
                      <input
                        type="time"
                        value={weddingDetails.receptionTime}
                        onChange={(e) => setWeddingDetails({ ...weddingDetails, receptionTime: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Budget
                      </label>
                      <input
                        type="number"
                        value={weddingDetails.budget}
                        onChange={(e) => setWeddingDetails({ ...weddingDetails, budget: Number(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Wedding Theme
                      </label>
                      <select
                        value={weddingDetails.theme}
                        onChange={(e) => setWeddingDetails({ ...weddingDetails, theme: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="">Select a theme</option>
                        {themeOptions.map(theme => (
                          <option key={theme} value={theme}>{theme}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Color Palette */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Color Palette
                    </label>
                    <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                      {colorOptions.map(color => (
                        <button
                          key={color.value}
                          onClick={() => {
                            const newColors = weddingDetails.colors.includes(color.value)
                              ? weddingDetails.colors.filter(c => c !== color.value)
                              : [...weddingDetails.colors, color.value]
                            setWeddingDetails({ ...weddingDetails, colors: newColors })
                          }}
                          className={`w-12 h-12 rounded-lg border-2 transition-all ${
                            weddingDetails.colors.includes(color.value)
                              ? 'border-primary-600 scale-110'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                          style={{ backgroundColor: color.value }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-gray-900">Notification Settings</h2>
                  
                  <div className="space-y-4">
                    {[
                      { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive updates via email' },
                      { key: 'pushNotifications', label: 'Push Notifications', description: 'Get notifications in your browser' },
                      { key: 'taskReminders', label: 'Task Reminders', description: 'Reminders for upcoming tasks' },
                      { key: 'guestUpdates', label: 'Guest Updates', description: 'Notifications about RSVP changes' },
                      { key: 'budgetAlerts', label: 'Budget Alerts', description: 'Alerts when approaching budget limits' },
                      { key: 'weeklyDigest', label: 'Weekly Digest', description: 'Weekly summary of wedding planning progress' }
                    ].map(({ key, label, description }) => (
                      <div key={key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h3 className="font-medium text-gray-900">{label}</h3>
                          <p className="text-sm text-gray-600">{description}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications[key as keyof NotificationSettings] as boolean}
                            onChange={(e) => setNotifications({
                              ...notifications,
                              [key]: e.target.checked
                            })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-gray-900">Security Settings</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Current Password
                          </label>
                          <input
                            type="password"
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            New Password
                          </label>
                          <input
                            type="password"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                        
                        <button
                          onClick={handlePasswordChange}
                          className="btn-primary"
                        >
                          Update Password
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Collaboration Tab */}
              {activeTab === 'collaboration' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold text-gray-900">Collaboration</h2>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowInviteModal(true)}
                      className="btn-primary"
                    >
                      <UserPlus className="w-5 h-5 mr-2" />
                      Invite Collaborator
                    </motion.button>
                  </div>

                  {/* My Role */}
                  {myRole && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-medium text-blue-900 mb-2">Your Role</h3>
                      <div className="flex items-center space-x-3">
                        <RoleBadge role={myRole.role} />
                        <span className="text-sm text-blue-700">
                          {myRole.permissions.canEditTimeline ? 'Can edit timeline' : 'View only'} • 
                          {myRole.permissions.canEditGuests ? ' Can manage guests' : ''} • 
                          {myRole.permissions.canInviteOthers ? ' Can invite others' : ''}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Collaborators List */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Team Members</h3>
                    {collaborators.length === 0 ? (
                      <div className="text-center py-8">
                        <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">No collaborators yet</p>
                        <p className="text-sm text-gray-500">Invite someone to help plan your wedding</p>
                      </div>
                    ) : (
                      collaborators.map(collaborator => (
                        <div key={collaborator._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-gray-500" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {collaborator.userId ? collaborator.userId.name : collaborator.name}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {collaborator.userId ? collaborator.userId.email : collaborator.email}
                              </p>
                              <p className="text-xs text-gray-500">
                                Invited by {collaborator.invitedBy.name} • 
                                {new Date(collaborator.invitedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <RoleBadge role={collaborator.role} />
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              collaborator.status === 'accepted' 
                                ? 'bg-green-100 text-green-800' 
                                : collaborator.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {collaborator.status}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Contact Us Tab */}
              {activeTab === 'contact' && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <MessageCircle className="w-16 h-16 text-primary-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">Contact Us</h2>
                    <p className="text-gray-600 max-w-md mx-auto">
                      Have questions, feedback, or need support? We'd love to hear from you!
                    </p>
                  </div>

                  {contactSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6"
                    >
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-green-800">
                            Message sent successfully!
                          </p>
                          <p className="text-sm text-green-700">
                            We'll get back to you at {contactForm.email} as soon as possible.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <form onSubmit={handleContactSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={contactForm.name}
                          onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                          placeholder="Enter your full name"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subject *
                      </label>
                      <input
                        type="text"
                        required
                        value={contactForm.subject}
                        onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                        placeholder="What's this about?"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message *
                      </label>
                      <textarea
                        required
                        rows={6}
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none"
                        placeholder="Tell us more about your inquiry..."
                      />
                    </div>

                    <div className="flex items-center justify-between pt-4">
                      <p className="text-sm text-gray-500">
                        We typically respond within 24 hours
                      </p>
                      <motion.button
                        type="submit"
                        disabled={contactLoading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="btn-primary px-8 py-3"
                      >
                        {contactLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Sending...
                          </>
                        ) : (
                          <>
                            <Mail className="w-4 h-4 mr-2" />
                            Send Message
                          </>
                        )}
                      </motion.button>
                    </div>
                  </form>

                  <div className="mt-8 pt-8 border-t border-gray-200">
                    <div className="text-center">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Other Ways to Reach Us</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center justify-center space-x-3">
                          <Mail className="w-5 h-5 text-primary-600" />
                          <span className="text-gray-700">hello@beehitched.com</span>
                        </div>
                        <div className="flex items-center justify-center space-x-3">
                          <MessageCircle className="w-5 h-5 text-primary-600" />
                          <span className="text-gray-700">Live Chat (Coming Soon)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Invite Modal */}
              {showInviteModal && (
                <InviteCollaboratorModal
                  weddingId={currentWeddingId}
                  onClose={() => setShowInviteModal(false)}
                  onInvite={handleInviteCollaborator}
                />
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
} 