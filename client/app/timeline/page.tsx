'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Calendar, 
  Clock, 
  CheckCircle, 
  Circle,
  Edit3,
  Trash2,
  Filter,
  Search,
  MapPin,
  Users,
  Camera,
  Music,
  Flower,
  Car,
  Hotel,
  FileText,
  Plane,
  Gift
} from 'lucide-react'
import Navigation from '@/components/Navigation'
import RoleBadge from '@/components/RoleBadge'

interface Task {
  _id: string
  title: string
  description: string
  status: 'To Do' | 'In Progress' | 'Done'
  priority: 'Low' | 'Medium' | 'High' | 'Urgent'
  dueDate: string
  category: string
  assignedTo: string
  assignedRoles: string[]
  createdAt: string
  completionDetails?: {
    vendorName: string
    vendorContact: string
    cost: string
    dateCompleted: string
    notes: string
    attachments: string[]
  }
  completedDate?: string
}

const categories = [
  'Venue',
  'Food',
  'Decor',
  'Attire',
  'Photography',
  'Music',
  'Transportation',
  'Other'
]

const categoryIcons = {
  'Venue': MapPin,
  'Food': Gift,
  'Decor': Flower,
  'Attire': Users,
  'Photography': Camera,
  'Music': Music,
  'Transportation': Car,
  'Other': FileText
}

const roles = [
  'Owner',
  'Bride',
  'Groom',
  'Planner',
  'Maid of Honor',
  'Best Man',
  'Parent',
  'Sibling',
  'Friend',
  'Other'
]

const priorities = [
  { value: 'Low', label: 'Low', color: 'bg-green-100 text-green-800' },
  { value: 'Medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'High', label: 'High', color: 'bg-red-100 text-red-800' },
  { value: 'Urgent', label: 'Urgent', color: 'bg-purple-100 text-purple-800' }
]

export default function TimelinePage() {
  const { user, token } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [showCompletionModal, setShowCompletionModal] = useState(false)
  const [completingTask, setCompletingTask] = useState<Task | null>(null)
  const [showCompletionDetails, setShowCompletionDetails] = useState(false)
  const [viewingCompletionDetails, setViewingCompletionDetails] = useState<Task | null>(null)
  const [completionDetails, setCompletionDetails] = useState({
    vendorName: '',
    vendorContact: '',
    cost: '',
    dateCompleted: new Date().toISOString().split('T')[0],
    notes: '',
    attachments: [] as string[]
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [roleFilter, setRoleFilter] = useState<string>('all')

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'To Do' as const,
    priority: 'Medium' as const,
    dueDate: '',
    category: 'Other',
    assignedRoles: [] as string[]
  })

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

  useEffect(() => {
    fetchTasks()
  }, [])

  useEffect(() => {
    filterTasks()
  }, [tasks, searchTerm, statusFilter, categoryFilter, roleFilter])

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_URL}/timeline`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        // Ensure data is an array
        setTasks(Array.isArray(data) ? data : [])
      } else {
        // If API fails, use mock data
        setTasks([
          {
            _id: '1',
            title: 'Book Venue',
            description: 'Research and book the perfect wedding venue',
            status: 'Done',
            priority: 'High',
            dueDate: '2024-01-15',
            category: 'Venue',
            assignedTo: 'Bride',
            assignedRoles: [],
            createdAt: '2024-01-01'
          },
          {
            _id: '2',
            title: 'Hire Photographer',
            description: 'Find and book wedding photographer',
            status: 'In Progress',
            priority: 'High',
            dueDate: '2024-02-01',
            category: 'Photography',
            assignedTo: 'Bride',
            assignedRoles: [],
            createdAt: '2024-01-10'
          },
          {
            _id: '3',
            title: 'Order Wedding Dress',
            description: 'Choose and order wedding dress',
            status: 'To Do',
            priority: 'Medium',
            dueDate: '2024-03-01',
            category: 'Attire',
            assignedTo: 'Bride',
            assignedRoles: [],
            createdAt: '2024-01-15'
          }
        ])
      }
    } catch (error) {
      console.error('Error fetching tasks:', error)
      // Fallback to mock data
      setTasks([
        {
          _id: '1',
          title: 'Book Venue',
          description: 'Research and book the perfect wedding venue',
          status: 'Done',
          priority: 'High',
          dueDate: '2024-01-15',
          category: 'Venue',
          assignedTo: 'Bride',
          assignedRoles: [],
          createdAt: '2024-01-01'
        },
        {
          _id: '2',
          title: 'Hire Photographer',
          description: 'Find and book wedding photographer',
          status: 'In Progress',
          priority: 'High',
          dueDate: '2024-02-01',
          category: 'Photography',
          assignedTo: 'Bride',
          assignedRoles: [],
          createdAt: '2024-01-10'
        },
        {
          _id: '3',
          title: 'Order Wedding Dress',
          description: 'Choose and order wedding dress',
          status: 'To Do',
          priority: 'Medium',
          dueDate: '2024-03-01',
          category: 'Attire',
          assignedTo: 'Bride',
          assignedRoles: [],
          createdAt: '2024-01-15'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const filterTasks = () => {
    let filtered = tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           task.description.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter
      const matchesCategory = categoryFilter === 'all' || task.category === categoryFilter
      const matchesRole = roleFilter === 'all' || 
                         (task.assignedRoles && task.assignedRoles.includes(roleFilter))
      
      return matchesSearch && matchesStatus && matchesCategory && matchesRole
    })
    
    setFilteredTasks(filtered)
  }

  const handleAddTask = async () => {
    if (!newTask.title.trim()) return

    try {
      const response = await fetch(`${API_URL}/timeline`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...newTask,
          dueDate: newTask.dueDate || null
        })
      })

      if (response.ok) {
        const data = await response.json()
        setTasks([...tasks, data.task])
        setNewTask({
          title: '',
          description: '',
          status: 'To Do',
          priority: 'Medium',
          dueDate: '',
          category: 'Other',
          assignedRoles: []
        })
        setShowAddModal(false)
      }
    } catch (error) {
      console.error('Error adding task:', error)
    }
  }

  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      const response = await fetch(`${API_URL}/timeline/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      })

      if (response.ok) {
        const data = await response.json()
        setTasks(tasks.map(task => task._id === taskId ? data.task : task))
      }
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  const handleMarkAsDone = async (taskId: string) => {
    const task = tasks.find(t => t._id === taskId)
    if (task) {
      setCompletingTask(task)
      setShowCompletionModal(true)
    }
  }

  const handleCompletionSubmit = async () => {
    if (!completingTask) return

    try {
      // Update task status to Done
      await handleUpdateTask(completingTask._id, { 
        status: 'Done',
        completionDetails: completionDetails,
        completedDate: new Date().toISOString()
      })

      // Reset form and close modal
      setCompletionDetails({
        vendorName: '',
        vendorContact: '',
        cost: '',
        dateCompleted: new Date().toISOString().split('T')[0],
        notes: '',
        attachments: []
      })
      setCompletingTask(null)
      setShowCompletionModal(false)
    } catch (error) {
      console.error('Error completing task:', error)
    }
  }

  const handleMarkAsInProgress = async (taskId: string) => {
    await handleUpdateTask(taskId, { status: 'In Progress' })
  }

  const handleMarkAsToDo = async (taskId: string) => {
    await handleUpdateTask(taskId, { status: 'To Do' })
  }

  const handleViewCompletionDetails = (task: Task) => {
    setViewingCompletionDetails(task)
    setShowCompletionDetails(true)
  }

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return

    try {
      const response = await fetch(`${API_URL}/timeline/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setTasks(tasks.filter(task => task._id !== taskId))
      }
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Done':
        return <CheckCircle className="w-6 h-6 text-green-500" />
      case 'In Progress':
        return <Clock className="w-6 h-6 text-blue-500" />
      default:
        return <Circle className="w-6 h-6 text-gray-400" />
    }
  }

  const getPriorityColor = (priority: string) => {
    return priorities.find(p => p.value === priority)?.color || 'bg-gray-100 text-gray-800'
  }

  const getCategoryIcon = (category: string) => {
    const IconComponent = categoryIcons[category as keyof typeof categoryIcons] || Gift
    return <IconComponent className="w-5 h-5" />
  }

  const groupTasksByMonth = (tasks: Task[]) => {
    const groups: { [key: string]: Task[] } = {}
    
    tasks.forEach(task => {
      const date = new Date(task.dueDate)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      const monthLabel = date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long' 
      })
      
      if (!groups[monthLabel]) {
        groups[monthLabel] = []
      }
      groups[monthLabel].push(task)
    })
    
    return groups
  }

  const taskGroups = groupTasksByMonth(filteredTasks)

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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
                Wedding Timeline
              </h1>
              <p className="text-gray-600">
                Your wedding journey, beautifully organized by time.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddModal(true)}
              className="btn-primary mt-4 md:mt-0"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Task
            </motion.button>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-4 sm:p-6 mb-8"
        >
          <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="relative sm:col-span-2 lg:col-span-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
            >
              <option value="all">All Status</option>
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
            >
              <option value="all">All Roles</option>
              {roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>

            <button
              onClick={() => {
                setSearchTerm('')
                setStatusFilter('all')
                setCategoryFilter('all')
                setRoleFilter('all')
              }}
              className="w-full sm:w-auto px-4 py-3 sm:py-2 text-gray-600 hover:text-gray-800 transition-colors bg-gray-50 hover:bg-gray-100 rounded-lg text-base"
            >
              Clear Filters
            </button>
          </div>
        </motion.div>

        {/* Timeline View */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-4 sm:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-200 via-primary-300 to-primary-200"></div>
          
          <div className="space-y-8 sm:space-y-12">
            <AnimatePresence>
              {Object.entries(taskGroups).map(([month, monthTasks], monthIndex) => (
                <motion.div
                  key={month}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: monthIndex * 0.1 }}
                  className="relative"
                >
                  {/* Month Header */}
                  <div className="flex items-center mb-4 sm:mb-6">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary-100 rounded-full flex items-center justify-center mr-3 sm:mr-4 border-4 border-white shadow-lg">
                      <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-serif font-bold text-gray-900">{month}</h2>
                      <p className="text-sm sm:text-base text-gray-600">{monthTasks.length} task{monthTasks.length !== 1 ? 's' : ''}</p>
                    </div>
                  </div>

                  {/* Tasks for this month */}
                  <div className="space-y-4 sm:space-y-6 ml-16 sm:ml-20">
                    {monthTasks.map((task, taskIndex) => (
                      <motion.div
                        key={task._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (monthIndex * 0.1) + (taskIndex * 0.05) }}
                        className="relative"
                      >
                        {/* Timeline Node */}
                        <div className="absolute -left-8 sm:-left-12 top-4 sm:top-6 w-4 h-4 sm:w-6 sm:h-6 bg-white border-4 border-primary-400 rounded-full shadow-lg z-10"></div>
                        
                        {/* Task Card */}
                        <div className={`card p-4 sm:p-6 ml-2 sm:ml-4 hover:shadow-medium transition-all duration-300 ${
                          task.status === 'Done' ? 'bg-green-50 border-green-200' : 
                          task.status === 'In Progress' ? 'bg-blue-50 border-blue-200' : 
                          'hover:border-primary-300'
                        }`}>
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                            <div className="flex items-start space-x-3 sm:space-x-4 flex-1">
                              <div className="flex flex-col items-center space-y-2 mt-1">
                                <button
                                  onClick={() => {
                                    if (task.status === 'Done') {
                                      handleMarkAsToDo(task._id)
                                    } else if (task.status === 'In Progress') {
                                      handleMarkAsDone(task._id)
                                    } else {
                                      handleMarkAsInProgress(task._id)
                                    }
                                  }}
                                  className="p-2 sm:p-1 hover:bg-gray-100 rounded transition-colors"
                                  title={task.status === 'Done' ? 'Mark as To Do' : 
                                         task.status === 'In Progress' ? 'Mark as Done' : 
                                         'Mark as In Progress'}
                                >
                                  {getStatusIcon(task.status)}
                                </button>
                                
                                {/* Status Action Buttons */}
                                <div className="flex flex-row sm:flex-col space-x-1 sm:space-x-0 sm:space-y-1">
                                  {task.status !== 'Done' && (
                                    <button
                                      onClick={() => handleMarkAsDone(task._id)}
                                      className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                                      title="Mark as Done"
                                    >
                                      Done
                                    </button>
                                  )}
                                  {task.status !== 'In Progress' && (
                                    <button
                                      onClick={() => handleMarkAsInProgress(task._id)}
                                      className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                                      title="Mark as In Progress"
                                    >
                                      Start
                                    </button>
                                  )}
                                  {task.status !== 'To Do' && (
                                    <button
                                      onClick={() => handleMarkAsToDo(task._id)}
                                      className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                                      title="Mark as To Do"
                                    >
                                      Reset
                                    </button>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-2">
                                  <h3 className={`text-base sm:text-lg font-semibold ${
                                    task.status === 'Done' ? 'line-through text-gray-500' : 'text-gray-900'
                                  }`}>
                                    {task.title}
                                  </h3>
                                  <div className="flex flex-wrap gap-2">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                                      {priorities.find(p => p.value === task.priority)?.label}
                                    </span>
                                    <div className="flex items-center space-x-1 text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                      {getCategoryIcon(task.category)}
                                      <span className="hidden sm:inline">{task.category}</span>
                                      <span className="sm:hidden">{task.category.slice(0, 3)}</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <p className={`text-sm sm:text-base text-gray-600 mb-3 ${
                                  task.status === 'Done' ? 'line-through' : ''
                                }`}>
                                  {task.description}
                                </p>
                                
                                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm text-gray-500">
                                  <div className="flex items-center">
                                    <Calendar className="w-4 h-4 mr-1" />
                                    Due: {new Date(task.dueDate).toLocaleDateString()}
                                  </div>
                                  {task.status === 'Done' && task.completionDetails && (
                                    <button
                                      onClick={() => handleViewCompletionDetails(task)}
                                      className="flex items-center text-green-600 hover:text-green-700 transition-colors"
                                    >
                                      <CheckCircle className="w-4 h-4 mr-1" />
                                      View Details
                                    </button>
                                  )}
                                </div>
                                
                                {/* Role Badges */}
                                {task.assignedRoles && task.assignedRoles.length > 0 && (
                                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 mt-3">
                                    <span className="text-xs text-gray-500">Assigned to:</span>
                                    <div className="flex flex-wrap gap-1">
                                      {task.assignedRoles.map((role, index) => (
                                        <RoleBadge key={index} role={role} size="sm" />
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-end space-x-2 mt-3 sm:mt-0 sm:ml-4">
                              <button
                                onClick={() => setEditingTask(task)}
                                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteTask(task._id)}
                                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {filteredTasks.length === 0 && !loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
                <p className="text-gray-600">Create your first task to start building your wedding timeline!</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Add New Task</h2>
            
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Task title"
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                className="w-full px-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
              />
              
              <textarea
                placeholder="Task description"
                value={newTask.description}
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                className="w-full px-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
                rows={3}
              />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({...newTask, priority: e.target.value as any})}
                  className="px-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
                >
                  {priorities.map(priority => (
                    <option key={priority.value} value={priority.value}>{priority.label}</option>
                  ))}
                </select>
                
                <select
                  value={newTask.category}
                  onChange={(e) => setNewTask({...newTask, category: e.target.value})}
                  className="px-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <input
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                className="w-full px-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assigned Roles
                </label>
                <div className="space-y-2">
                  {roles.map(role => (
                    <label key={role} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newTask.assignedRoles.includes(role)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewTask({
                              ...newTask, 
                              assignedRoles: [...newTask.assignedRoles, role]
                            })
                          } else {
                            setNewTask({
                              ...newTask, 
                              assignedRoles: newTask.assignedRoles.filter(r => r !== role)
                            })
                          }
                        }}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">{role}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="w-full sm:flex-1 px-4 py-3 sm:py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTask}
                className="w-full sm:flex-1 btn-primary text-base"
              >
                Add Task
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit Task Modal */}
      {editingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Edit Task</h2>
            
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Task title"
                value={editingTask.title}
                onChange={(e) => setEditingTask({...editingTask, title: e.target.value})}
                className="w-full px-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
              />
              
              <textarea
                placeholder="Task description"
                value={editingTask.description}
                onChange={(e) => setEditingTask({...editingTask, description: e.target.value})}
                className="w-full px-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
                rows={3}
              />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <select
                  value={editingTask.priority}
                  onChange={(e) => setEditingTask({...editingTask, priority: e.target.value as any})}
                  className="px-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
                >
                  {priorities.map(priority => (
                    <option key={priority.value} value={priority.value}>{priority.label}</option>
                  ))}
                </select>
                
                <select
                  value={editingTask.category}
                  onChange={(e) => setEditingTask({...editingTask, category: e.target.value})}
                  className="px-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <input
                type="date"
                value={editingTask.dueDate}
                onChange={(e) => setEditingTask({...editingTask, dueDate: e.target.value})}
                className="w-full px-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assigned Roles
                </label>
                <div className="space-y-2">
                  {roles.map(role => (
                    <label key={role} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingTask.assignedRoles.includes(role)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setEditingTask({
                              ...editingTask, 
                              assignedRoles: [...editingTask.assignedRoles, role]
                            })
                          } else {
                            setEditingTask({
                              ...editingTask, 
                              assignedRoles: editingTask.assignedRoles.filter(r => r !== role)
                            })
                          }
                        }}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">{role}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 mt-6">
              <button
                onClick={() => setEditingTask(null)}
                className="w-full sm:flex-1 px-4 py-3 sm:py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-base"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleUpdateTask(editingTask._id, editingTask)
                  setEditingTask(null)
                }}
                className="w-full sm:flex-1 btn-primary text-base"
              >
                Update Task
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Task Completion Modal */}
      {showCompletionModal && completingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-semibold">Complete Task</h2>
              <button
                onClick={() => {
                  setShowCompletionModal(false)
                  setCompletingTask(null)
                  setCompletionDetails({
                    vendorName: '',
                    vendorContact: '',
                    cost: '',
                    dateCompleted: new Date().toISOString().split('T')[0],
                    notes: '',
                    attachments: []
                  })
                }}
                className="text-gray-400 hover:text-gray-600 p-2"
              >
                ✕
              </button>
            </div>

            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-1">{completingTask.title}</h3>
              <p className="text-sm text-gray-600">{completingTask.description}</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vendor/Service Provider Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Grand Ballroom Venue, Sarah's Photography"
                  value={completionDetails.vendorName}
                  onChange={(e) => setCompletionDetails({...completionDetails, vendorName: e.target.value})}
                  className="w-full px-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Information
                </label>
                <input
                  type="text"
                  placeholder="Phone, email, or address"
                  value={completionDetails.vendorContact}
                  onChange={(e) => setCompletionDetails({...completionDetails, vendorContact: e.target.value})}
                  className="w-full px-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cost
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., $2,500"
                    value={completionDetails.cost}
                    onChange={(e) => setCompletionDetails({...completionDetails, cost: e.target.value})}
                    className="w-full px-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date Completed
                  </label>
                  <input
                    type="date"
                    value={completionDetails.dateCompleted}
                    onChange={(e) => setCompletionDetails({...completionDetails, dateCompleted: e.target.value})}
                    className="w-full px-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Notes
                </label>
                <textarea
                  placeholder="Any important details, contract terms, or special arrangements..."
                  value={completionDetails.notes}
                  onChange={(e) => setCompletionDetails({...completionDetails, notes: e.target.value})}
                  className="w-full px-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
                  rows={4}
                />
              </div>

              <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                <p className="font-medium mb-1">💡 Tips for good completion details:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Include contract numbers or reference codes</li>
                  <li>• Note any deposits paid or payment schedules</li>
                  <li>• Record any special requests or customizations</li>
                  <li>• Save contact information for future reference</li>
                </ul>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowCompletionModal(false)
                  setCompletingTask(null)
                  setCompletionDetails({
                    vendorName: '',
                    vendorContact: '',
                    cost: '',
                    dateCompleted: new Date().toISOString().split('T')[0],
                    notes: '',
                    attachments: []
                  })
                }}
                className="w-full sm:flex-1 px-4 py-3 sm:py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleCompletionSubmit}
                disabled={!completionDetails.vendorName.trim()}
                className="w-full sm:flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed text-base"
              >
                Mark as Complete
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Completion Details Viewing Modal */}
      {showCompletionDetails && viewingCompletionDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-semibold">Completion Details</h2>
              <button
                onClick={() => {
                  setShowCompletionDetails(false)
                  setViewingCompletionDetails(null)
                }}
                className="text-gray-400 hover:text-gray-600 p-2"
              >
                ✕
              </button>
            </div>

            <div className="mb-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="font-medium text-gray-900 mb-1">{viewingCompletionDetails.title}</h3>
              <p className="text-sm text-gray-600">{viewingCompletionDetails.description}</p>
              <div className="mt-2 text-sm text-green-700">
                ✓ Completed on {viewingCompletionDetails.completionDetails?.dateCompleted ? 
                  new Date(viewingCompletionDetails.completionDetails.dateCompleted).toLocaleDateString() : 
                  'Unknown date'}
              </div>
            </div>
            
            {viewingCompletionDetails.completionDetails && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vendor/Service Provider
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg text-gray-900">
                      {viewingCompletionDetails.completionDetails.vendorName || 'Not specified'}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Information
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg text-gray-900">
                      {viewingCompletionDetails.completionDetails.vendorContact || 'Not specified'}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cost
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg text-gray-900">
                      {viewingCompletionDetails.completionDetails.cost || 'Not specified'}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date Completed
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg text-gray-900">
                      {viewingCompletionDetails.completionDetails.dateCompleted ? 
                        new Date(viewingCompletionDetails.completionDetails.dateCompleted).toLocaleDateString() : 
                        'Not specified'}
                    </div>
                  </div>
                </div>

                {viewingCompletionDetails.completionDetails.notes && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Additional Notes
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg text-gray-900">
                      {viewingCompletionDetails.completionDetails.notes}
                    </div>
                  </div>
                )}

                <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                  <p className="font-medium mb-1">💡 This information will be used for your wedding summary!</p>
                  <p className="text-xs">All completion details are saved and can be viewed later for reference.</p>
                </div>
              </div>
            )}
            
            <div className="flex justify-end mt-6">
              <button
                onClick={() => {
                  setShowCompletionDetails(false)
                  setViewingCompletionDetails(null)
                }}
                className="w-full sm:w-auto px-4 py-3 sm:py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-base"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
} 