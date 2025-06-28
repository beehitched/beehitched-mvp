'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { motion } from 'framer-motion'
import { 
  Calendar, 
  Users, 
  CheckCircle, 
  Clock, 
  DollarSign,
  Heart,
  TrendingUp,
  AlertCircle,
  MapPin,
  UserPlus,
  Building2,
  Camera,
  Music,
  Car,
  Flower,
  ChefHat,
  Scissors,
  Gift,
  Star,
  ChevronRight
} from 'lucide-react'
import Navigation from '@/components/Navigation'
import Link from 'next/link'
import MessagingSystem from '@/components/MessagingSystem'

interface Task {
  _id: string
  title: string
  status: string
  dueDate: string
  category: string
  assignedRoles: string[]
}

interface Guest {
  _id: string
  name: string
  email: string
  phone: string
  rsvpStatus: 'Pending' | 'Attending' | 'Not Attending' | 'Maybe'
  plusOne: boolean
  plusOneName: string
  dietaryRestrictions: string
  notes: string
  group: string
  createdAt: string
}

interface Collaborator {
  _id: string
  userId: {
    _id: string
    name: string
    email: string
  }
  role: string
  status: 'pending' | 'accepted' | 'declined'
}

interface VendorStatus {
  name: string
  icon: any
  category: string
  status: 'booked' | 'not-booked'
  taskId?: string
}

export default function DashboardPage() {
  const { user, token } = useAuth()
  const [loading, setLoading] = useState(true)
  const [hasWedding, setHasWedding] = useState(false)
  const [wedding, setWedding] = useState<any>(null)
  const [weddings, setWeddings] = useState<any[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [guests, setGuests] = useState<Guest[]>([])
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [myRole, setMyRole] = useState<any>(null)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

  useEffect(() => {
    if (user && token) {
      fetchUserWeddings()
    }
  }, [user, token])

  useEffect(() => {
    if (wedding?.id) {
      fetchDashboardData()
    }
  }, [wedding])

  // Fetch all weddings the user is a collaborator on
  const fetchUserWeddings = async () => {
    try {
      const response = await fetch(`${API_URL}/collaboration/user/weddings`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setWeddings(data.weddings)
        if (data.weddings.length > 0) {
          setHasWedding(true)
          setWedding(data.weddings[0]) // Default to first wedding
          setMyRole({
            role: data.weddings[0].role,
            status: data.weddings[0].status
          })
        } else {
          setHasWedding(false)
          setWedding(null)
        }
      } else {
        setHasWedding(false)
        setWedding(null)
      }
      setLoading(false)
    } catch (error) {
      setHasWedding(false)
      setWedding(null)
      setLoading(false)
    }
  }

  // When user selects a different wedding
  const handleWeddingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value
    const selectedWedding = weddings.find(w => w.id === selectedId)
    if (selectedWedding) {
      setWedding(selectedWedding)
      setMyRole({
        role: selectedWedding.role,
        status: selectedWedding.status
      })
      setLoading(true)
    }
  }

  const fetchDashboardData = async () => {
    try {
      const [tasksRes, guestsRes, collaboratorsRes] = await Promise.all([
        fetch(`${API_URL}/timeline`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_URL}/guests`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_URL}/collaboration/${wedding.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ])

      if (tasksRes.ok) {
        const tasksData = await tasksRes.json()
        setTasks(tasksData)
      } else {
        console.error('Failed to fetch tasks:', tasksRes.status)
      }

      if (guestsRes.ok) {
        const guestsData = await guestsRes.json()
        setGuests(guestsData)
      } else {
        console.error('Failed to fetch guests:', guestsRes.status)
      }

      if (collaboratorsRes.ok) {
        const collaboratorsData = await collaboratorsRes.json()
        setCollaborators(collaboratorsData)
      } else {
        console.error('Failed to fetch collaborators:', collaboratorsRes.status)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Calculate guest statistics
  const guestStats = {
    total: guests.length,
    attending: guests.filter(g => g.rsvpStatus === 'Attending').length,
    pending: guests.filter(g => g.rsvpStatus === 'Pending').length,
    declined: guests.filter(g => g.rsvpStatus === 'Not Attending').length,
    maybe: guests.filter(g => g.rsvpStatus === 'Maybe').length,
    withDietaryRestrictions: guests.filter(g => g.dietaryRestrictions).length
  }

  // Calculate timeline progress
  const timelineStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'Done').length,
    inProgress: tasks.filter(t => t.status === 'In Progress').length,
    upcoming: tasks.filter(t => t.status === 'To Do' && new Date(t.dueDate) > new Date()).length
  }

  // Get upcoming tasks (top 5 due soonest)
  const upcomingTasks = tasks
    .filter(t => t.status === 'To Do' && new Date(t.dueDate) > new Date())
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5)

  // Vendor tracking
  const vendorCategories = [
    { name: 'Venue', icon: Building2, category: 'Venue' },
    { name: 'Photographer', icon: Camera, category: 'Photography' },
    { name: 'DJ/Music', icon: Music, category: 'Entertainment' },
    { name: 'Transportation', icon: Car, category: 'Transportation' },
    { name: 'Florist', icon: Flower, category: 'Decorations' },
    { name: 'Caterer', icon: ChefHat, category: 'Food' },
    { name: 'Hair & Makeup', icon: Scissors, category: 'Beauty' },
    { name: 'Wedding Favors', icon: Gift, category: 'Party Favors' }
  ]

  const getVendorStatus = (vendorCategory: string) => {
    const task = tasks.find(t => 
      t.category === vendorCategory && 
      (t.status === 'Done' || t.status === 'In Progress')
    )
    return {
      status: task ? 'booked' : 'not-booked',
      taskId: task?._id
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-16 h-16 text-primary-600 mx-auto mb-4" />
          <h1 className="text-2xl font-serif font-bold text-gray-900 mb-2">
            Welcome to BeeHitched
          </h1>
          <p className="text-gray-600">Please sign in to access your dashboard.</p>
        </div>
      </div>
    )
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <Heart className="w-16 h-16 text-primary-600 mx-auto mb-4 animate-pulse" />
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  // Show setup flow for users without weddings
  if (!hasWedding) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-8"
            >
              <Heart className="w-16 h-16 text-primary-600 mx-auto mb-6" />
              <h1 className="text-3xl font-serif font-bold text-gray-900 mb-4">
                Welcome to BeeHitched, {user.name}!
              </h1>
              <p className="text-gray-600 mb-8">
                Let's get your wedding planning started. You can either create a new wedding or join an existing one.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <Link 
                  href="/create-wedding"
                  className="bg-primary-600 text-white py-3 px-6 rounded-lg hover:bg-primary-700 transition-colors font-medium"
                >
                  Create New Wedding
                </Link>
                <Link 
                  href="/join-wedding"
                  className="bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Join Existing Wedding
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Wedding Selector */}
        {weddings.length > 1 && (
          <div className="mb-6 flex items-center space-x-3">
            <label htmlFor="wedding-selector" className="text-gray-700 font-medium">Select Wedding:</label>
            <select
              id="wedding-selector"
              value={wedding?.id || ''}
              onChange={handleWeddingChange}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500"
            >
              {weddings.map(w => (
                <option key={w.id} value={w.id}>
                  {w.name} ({w.role})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-serif font-bold text-gray-900">
              Welcome back, {user.name}!
            </h1>
            {myRole?.role && (
              <div className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
                {myRole.role}
              </div>
            )}
          </div>
          <p className="text-gray-600">
            {wedding?.name ? `Planning: ${wedding.name}` : 'Here\'s your wedding planning overview.'}
          </p>
        </motion.div>

        {/* Main Dashboard Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event Details Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Event Details</h2>
                <Calendar className="w-6 h-6 text-primary-600" />
              </div>
              
              {/* Settings Note */}
              {(!wedding?.weddingDate || !wedding?.venue) && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-blue-900 mb-1">
                        Complete Your Wedding Details
                      </p>
                      <p className="text-sm text-blue-700 mb-3">
                        {!wedding?.weddingDate && !wedding?.venue 
                          ? "Add your wedding date and venue to get the most out of your planning experience."
                          : !wedding?.weddingDate 
                          ? "Set your wedding date to enable timeline planning and deadline tracking."
                          : "Add your venue details to help with guest coordination and vendor planning."
                        }
                      </p>
                      <a 
                        href="/settings" 
                        className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        Go to Settings
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </a>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Wedding Date</p>
                      <p className="font-semibold text-gray-900">
                        {wedding?.weddingDate ? 
                          new Date(wedding.weddingDate).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          }) : 'Not set'
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Time</p>
                      <p className="font-semibold text-gray-900">
                        {wedding?.weddingDate ? 'TBD' : 'Not set'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Venue</p>
                      <p className="font-semibold text-gray-900">
                        {wedding?.venue || 'Not booked'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gold-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-gold-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-semibold text-gray-900">
                        {wedding?.venue ? 'Address TBD' : 'Not set'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Guest Summary Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Guest Summary</h2>
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-gray-900">
                      {loading ? '...' : guestStats.total}
                    </span>
                    <span className="text-sm text-gray-600">Total Invited</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">RSVPs Received</span>
                      <span className="font-medium text-gray-900">
                        {guestStats.attending + guestStats.declined}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Attending</span>
                      <span className="font-medium text-green-600">
                        {guestStats.attending}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Pending</span>
                      <span className="font-medium text-yellow-600">
                        {guestStats.pending}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Breakdown</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Total Guests</span>
                      <span className="font-medium text-gray-900">{guestStats.total}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">With Dietary Notes</span>
                      <span className="font-medium text-gray-900">{guestStats.withDietaryRestrictions}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Vendor Tracker */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Vendor Tracker</h2>
                <Building2 className="w-6 h-6 text-green-600" />
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {vendorCategories.map((vendor, index) => {
                  const status = getVendorStatus(vendor.category)
                  const IconComponent = vendor.icon
                  
                  return (
                    <div key={vendor.name} className="text-center">
                      <div className={`w-12 h-12 mx-auto mb-2 rounded-lg flex items-center justify-center ${
                        status.status === 'booked' 
                          ? 'bg-green-100' 
                          : 'bg-gray-100'
                      }`}>
                        <IconComponent className={`w-6 h-6 ${
                          status.status === 'booked' 
                            ? 'text-green-600' 
                            : 'text-gray-400'
                        }`} />
                      </div>
                      <p className="text-sm font-medium text-gray-900 mb-1">
                        {vendor.name}
                      </p>
                      <div className="flex items-center justify-center space-x-1">
                        {status.status === 'booked' ? (
                          <>
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-xs text-green-600">Booked</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-4 h-4 text-gray-400" />
                            <span className="text-xs text-gray-500">Not Booked</span>
                          </>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>

            {/* Timeline Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Timeline Progress</h2>
                <CheckCircle className="w-6 h-6 text-primary-600" />
              </div>
              
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Overall Progress</span>
                  <span className="text-sm font-medium text-gray-900">
                    {timelineStats.total > 0 
                      ? Math.round((timelineStats.completed / timelineStats.total) * 100)
                      : 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-primary-600 h-3 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${timelineStats.total > 0 
                        ? (timelineStats.completed / timelineStats.total) * 100 
                        : 0}%` 
                    }}
                  ></div>
                </div>
                <div className="flex justify-between mt-2 text-sm text-gray-600">
                  <span>{timelineStats.completed} completed</span>
                  <span>{timelineStats.inProgress} in progress</span>
                  <span>{timelineStats.upcoming} upcoming</span>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Upcoming Tasks</h4>
                <div className="space-y-2">
                  {upcomingTasks.length > 0 ? (
                    upcomingTasks.map((task) => (
                      <div key={task._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{task.title}</p>
                          <p className="text-sm text-gray-600">
                            Due {new Date(task.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No upcoming tasks</p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Collaborator Snapshot */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Collaborators</h2>
                <UserPlus className="w-6 h-6 text-purple-600" />
              </div>
              
              <div className="space-y-4">
                {collaborators.length > 0 ? (
                  collaborators.map((collaborator) => (
                    <div key={collaborator._id} className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-purple-600">
                          {collaborator.userId.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {collaborator.userId.name}
                        </p>
                        <p className="text-sm text-gray-600">{collaborator.role}</p>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs ${
                        collaborator.status === 'accepted' 
                          ? 'bg-green-100 text-green-800'
                          : collaborator.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {collaborator.status}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No collaborators yet</p>
                )}
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="card p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Stats</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Budget Used</span>
                  <span className="font-medium text-gray-900">
                    ${wedding?.budget ? Math.round((wedding.budget * 0.34)) : 0} / ${wedding?.budget || 0}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Days Until Wedding</span>
                  <span className="font-medium text-gray-900">
                    {wedding?.weddingDate ? 
                      Math.ceil((new Date(wedding.weddingDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 
                      'Not set'
                    }
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Your Role</span>
                  <span className="font-medium text-gray-900">
                    {myRole?.role || 'Owner'}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="card p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
              
              <div className="space-y-3">
                <button className="w-full btn-primary text-left flex items-center space-x-3">
                  <Calendar className="w-5 h-5" />
                  <span>Add New Task</span>
                </button>
                <button className="w-full btn-secondary text-left flex items-center space-x-3">
                  <Users className="w-5 h-5" />
                  <span>Add Guest</span>
                </button>
                <button className="w-full btn-secondary text-left flex items-center space-x-3">
                  <UserPlus className="w-5 h-5" />
                  <span>Invite Collaborator</span>
                </button>
                <Link href="/vendors" className="w-full btn-secondary text-left flex items-center space-x-3">
                  <Building2 className="w-5 h-5" />
                  <span>Find Vendors</span>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Messaging System */}
      <MessagingSystem collaborators={collaborators} />
    </div>
  )
} 