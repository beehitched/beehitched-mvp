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
  rsvpStatus: 'pending' | 'attending' | 'declined'
  isChild: boolean
  dietaryRestrictions: string
  plusOne: boolean
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
  const [tasks, setTasks] = useState<Task[]>([])
  const [guests, setGuests] = useState<Guest[]>([])
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [myRole, setMyRole] = useState<any>(null)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

  useEffect(() => {
    if (user && token) {
      fetchDashboardData()
    }
  }, [user, token])

  const fetchDashboardData = async () => {
    try {
      const [tasksRes, guestsRes, collaboratorsRes, roleRes] = await Promise.all([
        fetch(`${API_URL}/timeline`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_URL}/guests`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_URL}/collaboration/${user?._id || user?.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_URL}/collaboration/${user?._id || user?.id}/my-role`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ])

      if (tasksRes.ok) {
        const tasksData = await tasksRes.json()
        setTasks(tasksData)
      }

      if (guestsRes.ok) {
        const guestsData = await guestsRes.json()
        setGuests(guestsData)
      }

      if (collaboratorsRes.ok) {
        const collaboratorsData = await collaboratorsRes.json()
        setCollaborators(collaboratorsData)
      }

      if (roleRes.ok) {
        const roleData = await roleRes.json()
        setMyRole(roleData)
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
    attending: guests.filter(g => g.rsvpStatus === 'attending').length,
    pending: guests.filter(g => g.rsvpStatus === 'pending').length,
    declined: guests.filter(g => g.rsvpStatus === 'declined').length,
    adults: guests.filter(g => !g.isChild).length,
    children: guests.filter(g => g.isChild).length,
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
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
            Welcome back, {user.name}!
          </h1>
          <p className="text-gray-600">
            Here's your wedding planning overview.
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
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Wedding Date</p>
                      <p className="font-semibold text-gray-900">
                        {user.weddingDate ? 
                          new Date(user.weddingDate).toLocaleDateString('en-US', { 
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
                        {user.weddingDate ? 'TBD' : 'Not set'}
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
                        {user.venue || 'Not booked'}
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
                        {user.venue ? 'Address TBD' : 'Not set'}
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
                      <span className="text-sm text-gray-600">Adults</span>
                      <span className="font-medium text-gray-900">{guestStats.adults}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Children</span>
                      <span className="font-medium text-gray-900">{guestStats.children}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Dietary Notes</span>
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
                    ${user.budget ? Math.round((user.budget * 0.34)) : 0} / ${user.budget || 0}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Days Until Wedding</span>
                  <span className="font-medium text-gray-900">
                    {user.weddingDate ? 
                      Math.ceil((new Date(user.weddingDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 
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
                <button className="w-full btn-secondary text-left flex items-center space-x-3">
                  <Heart className="w-5 h-5" />
                  <span>View Shop</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
} 