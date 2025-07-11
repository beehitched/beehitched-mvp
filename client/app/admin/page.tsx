'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users,
  Calendar,
  MessageSquare,
  Image,
  TrendingUp,
  Activity,
  Shield,
  Settings,
  Eye,
  EyeOff,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  BarChart3,
  PieChart,
  LineChart,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  Heart,
  Gift,
  Camera,
  Music,
  Car,
  FileText
} from 'lucide-react'
import Navigation from '@/components/Navigation'

interface DashboardData {
  overview: {
    totalUsers: number
    activeUsers: number
    totalWeddings: number
    totalTasks: number
    totalMessages: number
    totalMoodboards: number
    recentSignups: number
  }
  userGrowth: Array<{
    _id: {
      year: number
      month: number
      day: number
    }
    count: number
  }>
  featureUsage: {
    weddings: {
      total: number
      withGuests: number
    }
    tasks: Array<{
      _id: string
      count: number
    }>
    collaborators: Array<{
      _id: string
      count: number
    }>
  }
}

interface User {
  _id: string
  name: string
  email: string
  role: string
  isActive: boolean
  createdAt: string
  lastLogin: string
}

interface AnalyticsData {
  signups: Array<{
    _id: {
      year: number
      month: number
      day: number
    }
    count: number
  }>
  weddings: Array<{
    _id: {
      year: number
      month: number
      day: number
    }
    count: number
  }>
  tasks: Array<{
    _id: {
      year: number
      month: number
      day: number
    }
    completed: number
    total: number
  }>
  featureStats: {
    weddings: {
      total: number
      avgBudget: number
      avgGuests: number
    }
    tasks: Array<{
      _id: string
      count: number
    }>
    collaborators: Array<{
      _id: string
      count: number
    }>
    messages: {
      total: number
    }
  }
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export default function AdminDashboard() {
  const { user, token } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedPeriod, setSelectedPeriod] = useState('30')
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    // Check if user is admin
    if (user && user.role !== 'admin') {
      router.push('/dashboard')
      return
    }

    if (token) {
      fetchDashboardData()
      fetchAnalytics()
      fetchUsers()
    }
  }, [user, token, router])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setDashboardData(data)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    }
  }

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/analytics?period=${selectedPeriod}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setAnalyticsData(data)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    }
  }

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        search: searchTerm,
        status: statusFilter
      })

      const response = await fetch(`${API_URL}/admin/users?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
        setTotalPages(data.totalPages)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUserStatusToggle = async (userId: string, isActive: boolean) => {
    try {
      const response = await fetch(`${API_URL}/admin/users/${userId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isActive })
      })
      if (response.ok) {
        fetchUsers()
        fetchDashboardData()
      }
    } catch (error) {
      console.error('Error updating user status:', error)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return

    try {
      const response = await fetch(`${API_URL}/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        fetchUsers()
        fetchDashboardData()
      }
    } catch (error) {
      console.error('Error deleting user:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Done': return 'bg-green-100 text-green-800'
      case 'In Progress': return 'bg-blue-100 text-blue-800'
      case 'To Do': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
            <p className="text-gray-600">You don't have permission to access this page.</p>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
                Admin Dashboard
              </h1>
              <p className="text-gray-600">
                Manage your BeeHitched platform and monitor user activity.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  fetchDashboardData()
                  fetchAnalytics()
                }}
                className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp },
              { id: 'features', label: 'Features', icon: Activity }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Overview Cards */}
              {dashboardData && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="card p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Users</p>
                        <p className="text-2xl font-bold text-gray-900">{dashboardData.overview.totalUsers}</p>
                      </div>
                      <Users className="w-8 h-8 text-primary-500" />
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">
                        {dashboardData.overview.activeUsers} active users
                      </p>
                    </div>
                  </div>

                  <div className="card p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Weddings</p>
                        <p className="text-2xl font-bold text-gray-900">{dashboardData.overview.totalWeddings}</p>
                      </div>
                      <Calendar className="w-8 h-8 text-primary-500" />
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">
                        {dashboardData.featureUsage.weddings.withGuests} with guest lists
                      </p>
                    </div>
                  </div>

                  <div className="card p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                        <p className="text-2xl font-bold text-gray-900">{dashboardData.overview.totalTasks}</p>
                      </div>
                      <FileText className="w-8 h-8 text-primary-500" />
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">
                        Across all weddings
                      </p>
                    </div>
                  </div>

                  <div className="card p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Recent Signups</p>
                        <p className="text-2xl font-bold text-gray-900">{dashboardData.overview.recentSignups}</p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-primary-500" />
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">
                        Last 7 days
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Feature Usage */}
              {dashboardData && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="card p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Status Distribution</h3>
                    <div className="space-y-3">
                      {dashboardData.featureUsage.tasks.map((task) => (
                        <div key={task._id} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{task._id}</span>
                          <span className="text-sm font-medium text-gray-900">{task.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="card p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Collaboration Status</h3>
                    <div className="space-y-3">
                      {dashboardData.featureUsage.collaborators.map((collab) => (
                        <div key={collab._id} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{collab._id}</span>
                          <span className="text-sm font-medium text-gray-900">{collab.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'users' && (
            <motion.div
              key="users"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* User Filters */}
              <div className="card p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>

                  <button
                    onClick={fetchUsers}
                    className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    Search
                  </button>
                </div>
              </div>

              {/* Users Table */}
              <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Joined
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                              user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {user.isActive ? (
                                <>
                                  <UserCheck className="w-3 h-3 mr-1" />
                                  Active
                                </>
                              ) : (
                                <>
                                  <UserX className="w-3 h-3 mr-1" />
                                  Inactive
                                </>
                              )}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(user.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleUserStatusToggle(user._id, !user.isActive)}
                                className={`p-1 rounded transition-colors ${
                                  user.isActive 
                                    ? 'text-red-600 hover:text-red-800' 
                                    : 'text-green-600 hover:text-green-800'
                                }`}
                                title={user.isActive ? 'Deactivate' : 'Activate'}
                              >
                                {user.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user._id)}
                                className="p-1 text-red-600 hover:text-red-800 rounded transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="px-6 py-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-700">
                        Page {currentPage} of {totalPages}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50"
                        >
                          Previous
                        </button>
                        <button
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                          className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Period Selector */}
              <div className="card p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Analytics Period</h3>
                  <select
                    value={selectedPeriod}
                    onChange={(e) => {
                      setSelectedPeriod(e.target.value)
                      fetchAnalytics()
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="7">Last 7 days</option>
                    <option value="30">Last 30 days</option>
                    <option value="90">Last 90 days</option>
                  </select>
                </div>
              </div>

              {/* Analytics Cards */}
              {analyticsData && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="card p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Weddings</p>
                        <p className="text-2xl font-bold text-gray-900">{analyticsData.featureStats.weddings.total}</p>
                      </div>
                      <Calendar className="w-8 h-8 text-primary-500" />
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">
                        Avg budget: ${analyticsData.featureStats.weddings.avgBudget?.toFixed(0) || 0}
                      </p>
                    </div>
                  </div>

                  <div className="card p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {analyticsData.featureStats.tasks.reduce((sum, task) => sum + task.count, 0)}
                        </p>
                      </div>
                      <FileText className="w-8 h-8 text-primary-500" />
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">
                        Across all categories
                      </p>
                    </div>
                  </div>

                  <div className="card p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Messages</p>
                        <p className="text-2xl font-bold text-gray-900">{analyticsData.featureStats.messages.total}</p>
                      </div>
                      <MessageSquare className="w-8 h-8 text-primary-500" />
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">
                        In selected period
                      </p>
                    </div>
                  </div>

                  <div className="card p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Collaborations</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {analyticsData.featureStats.collaborators.reduce((sum, collab) => sum + collab.count, 0)}
                        </p>
                      </div>
                      <Users className="w-8 h-8 text-primary-500" />
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">
                        Team members
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'features' && (
            <motion.div
              key="features"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Feature Usage Overview</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <Calendar className="w-5 h-5 text-primary-500 mr-3" />
                        <span className="font-medium">Wedding Planning</span>
                      </div>
                      <span className="text-sm text-gray-600">Active</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <FileText className="w-5 h-5 text-primary-500 mr-3" />
                        <span className="font-medium">Timeline Management</span>
                      </div>
                      <span className="text-sm text-gray-600">Active</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <Users className="w-5 h-5 text-primary-500 mr-3" />
                        <span className="font-medium">Collaboration</span>
                      </div>
                      <span className="text-sm text-gray-600">Active</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <MessageSquare className="w-5 h-5 text-primary-500 mr-3" />
                        <span className="font-medium">Messaging</span>
                      </div>
                      <span className="text-sm text-gray-600">Active</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <Image className="w-5 h-5 text-primary-500 mr-3" />
                        <span className="font-medium">Moodboards</span>
                      </div>
                      <span className="text-sm text-gray-600">Active</span>
                    </div>
                  </div>
                </div>

                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Database</span>
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        <span className="text-sm text-green-600">Healthy</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">API</span>
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        <span className="text-sm text-green-600">Online</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">File Storage</span>
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        <span className="text-sm text-green-600">Available</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Email Service</span>
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        <span className="text-sm text-green-600">Connected</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
} 