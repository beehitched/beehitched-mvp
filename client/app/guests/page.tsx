'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, 
  Plus, 
  Upload, 
  Download, 
  Search,
  Filter,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  XCircle,
  Clock,
  Edit3,
  Trash2,
  UserPlus,
  QrCode
} from 'lucide-react'
import Navigation from '@/components/Navigation'
import QRCodeGenerator from '@/components/QRCodeGenerator'

interface Guest {
  _id: string
  name: string
  email: string
  phone: string
  address: string
  rsvpStatus: 'Pending' | 'Attending' | 'Not Attending' | 'Maybe'
  plusOne: boolean
  plusOneName: string
  dietaryRestrictions: string
  notes: string
  group: string
  createdAt: string
}

const rsvpStatuses = [
  { value: 'Pending', label: 'Pending', color: 'bg-gray-100 text-gray-800' },
  { value: 'Attending', label: 'Attending', color: 'bg-green-100 text-green-800' },
  { value: 'Not Attending', label: 'Not Attending', color: 'bg-red-100 text-red-800' },
  { value: 'Maybe', label: 'Maybe', color: 'bg-yellow-100 text-yellow-800' }
]

const groups = [
  'Bride Family',
  'Groom Family',
  'Bride Friends',
  'Groom Friends',
  'Work Colleagues',
  'Neighbors',
  'Other'
]

export default function GuestsPage() {
  const { user, token } = useAuth()
  const [guests, setGuests] = useState<Guest[]>([])
  const [filteredGuests, setFilteredGuests] = useState<Guest[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [showQRModal, setShowQRModal] = useState(false)
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [groupFilter, setGroupFilter] = useState<string>('all')
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [importPreview, setImportPreview] = useState<any[]>([])

  const [newGuest, setNewGuest] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    rsvpStatus: 'Pending' as const,
    plusOne: false,
    plusOneName: '',
    dietaryRestrictions: '',
    notes: '',
    group: 'Other'
  })

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

  useEffect(() => {
    fetchGuests()
  }, [])

  useEffect(() => {
    filterGuests()
  }, [guests, searchTerm, statusFilter, groupFilter])

  const fetchGuests = async () => {
    try {
      console.log('Fetching guests with token:', token ? 'Token present' : 'No token')
      console.log('API URL:', `${API_URL}/guests`)
      
      const response = await fetch(`${API_URL}/guests`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      console.log('Response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('Guests data:', data)
        setGuests(Array.isArray(data) ? data : [])
      } else {
        const errorText = await response.text()
        console.error('Failed to fetch guests:', response.status, response.statusText)
        console.error('Error response:', errorText)
        setGuests([])
      }
    } catch (error) {
      console.error('Error fetching guests:', error)
      setGuests([])
    } finally {
      setLoading(false)
    }
  }

  const filterGuests = () => {
    if (!Array.isArray(guests)) {
      setFilteredGuests([])
      return
    }

    let filtered = guests

    if (searchTerm) {
      filtered = filtered.filter(guest =>
        guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guest.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guest.plusOneName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(guest => guest.rsvpStatus === statusFilter)
    }

    if (groupFilter !== 'all') {
      filtered = filtered.filter(guest => guest.group === groupFilter)
    }

    setFilteredGuests(filtered)
  }

  const handleAddGuest = async () => {
    try {
      const response = await fetch(`${API_URL}/guests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newGuest)
      })

      if (response.ok) {
        const responseData = await response.json()
        console.log('Guest added successfully:', responseData)
        
        // Extract the guest data from the nested structure
        const addedGuest = responseData.guest || responseData
        
        setGuests(prevGuests => [...prevGuests, addedGuest])
        setShowAddModal(false)
        setNewGuest({
          name: '',
          email: '',
          phone: '',
          address: '',
          rsvpStatus: 'Pending',
          plusOne: false,
          plusOneName: '',
          dietaryRestrictions: '',
          notes: '',
          group: 'Other'
        })
      } else {
        console.error('Failed to add guest:', response.status, response.statusText)
        const errorData = await response.json().catch(() => ({}))
        console.error('Error details:', errorData)
      }
    } catch (error) {
      console.error('Error adding guest:', error)
    }
  }

  const handleUpdateGuest = async (guestId: string, updates: Partial<Guest>) => {
    try {
      const response = await fetch(`${API_URL}/guests/${guestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      })

      if (response.ok) {
        setGuests(guests.map(guest => 
          guest._id === guestId ? { ...guest, ...updates } : guest
        ))
        setEditingGuest(null)
      }
    } catch (error) {
      console.error('Error updating guest:', error)
    }
  }

  const handleDeleteGuest = async (guestId: string) => {
    try {
      const response = await fetch(`${API_URL}/guests/${guestId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setGuests(guests.filter(guest => guest._id !== guestId))
      }
    } catch (error) {
      console.error('Error deleting guest:', error)
    }
  }

  const handleCsvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === 'text/csv') {
      setCsvFile(file)
      parseCsvFile(file)
    }
  }

  const parseCsvFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const lines = text.split('\n')
      const headers = lines[0].split(',')
      const data = lines.slice(1).map(line => {
        const values = line.split(',')
        const row: any = {}
        headers.forEach((header, index) => {
          row[header.trim()] = values[index]?.trim() || ''
        })
        return row
      })
      setImportPreview(data.slice(0, 5)) // Show first 5 rows
    }
    reader.readAsText(file)
  }

  const handleImportGuests = async () => {
    if (!csvFile) return

    try {
      const formData = new FormData()
      formData.append('csv', csvFile)

      const response = await fetch(`${API_URL}/guests/import`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (response.ok) {
        const importedGuests = await response.json()
        setGuests([...guests, ...importedGuests])
        setShowImportModal(false)
        setCsvFile(null)
        setImportPreview([])
      }
    } catch (error) {
      console.error('Error importing guests:', error)
    }
  }

  const exportGuests = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Address', 'RSVP Status', 'Plus One', 'Plus One Name', 'Dietary Restrictions', 'Notes', 'Group'],
      ...guests.map(guest => [
        guest.name,
        guest.email,
        guest.phone,
        guest.address,
        guest.rsvpStatus,
        guest.plusOne ? 'Yes' : 'No',
        guest.plusOneName,
        guest.dietaryRestrictions,
        guest.notes,
        guest.group
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'wedding-guests.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const getRsvpStats = () => {
    const total = guests.length
    const attending = guests.filter(g => g.rsvpStatus === 'Attending').length
    const declined = guests.filter(g => g.rsvpStatus === 'Not Attending').length
    const pending = guests.filter(g => g.rsvpStatus === 'Pending').length
    const maybe = guests.filter(g => g.rsvpStatus === 'Maybe').length

    return { total, attending, declined, pending, maybe }
  }

  const stats = getRsvpStats()

  if (!user) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <Users className="w-16 h-16 text-primary-600 mx-auto mb-4" />
          <h1 className="text-2xl font-serif font-bold text-gray-900 mb-2">
            Guest Management
          </h1>
          <p className="text-gray-600">Please sign in to access your guest list.</p>
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
                Guest Management
              </h1>
              <p className="text-gray-600">
                Manage your wedding guest list and track RSVPs.
              </p>
            </div>
            <div className="flex space-x-3 mt-4 md:mt-0">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowQRModal(true)}
                className="btn-secondary"
              >
                <QrCode className="w-5 h-5 mr-2" />
                RSVP QR Code
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowImportModal(true)}
                className="btn-secondary"
              >
                <Upload className="w-5 h-5 mr-2" />
                Import CSV
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={exportGuests}
                className="btn-secondary"
              >
                <Download className="w-5 h-5 mr-2" />
                Export
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddModal(true)}
                className="btn-primary"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Add Guest
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
        >
          <div className="card p-4 text-center">
            <h3 className="text-2xl font-bold text-gray-900">{stats.total}</h3>
            <p className="text-sm text-gray-600">Total Guests</p>
          </div>
          <div className="card p-4 text-center">
            <h3 className="text-2xl font-bold text-green-600">{stats.attending}</h3>
            <p className="text-sm text-gray-600">Attending</p>
          </div>
          <div className="card p-4 text-center">
            <h3 className="text-2xl font-bold text-red-600">{stats.declined}</h3>
            <p className="text-sm text-gray-600">Declined</p>
          </div>
          <div className="card p-4 text-center">
            <h3 className="text-2xl font-bold text-yellow-600">{stats.maybe}</h3>
            <p className="text-sm text-gray-600">Maybe</p>
          </div>
          <div className="card p-4 text-center">
            <h3 className="text-2xl font-bold text-gray-600">{stats.pending}</h3>
            <p className="text-sm text-gray-600">Pending</p>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search guests..."
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
              <option value="all">All RSVP Status</option>
              {rsvpStatuses.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>

            <select
              value={groupFilter}
              onChange={(e) => setGroupFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Groups</option>
              {groups.map(group => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>

            <button
              onClick={() => {
                setSearchTerm('')
                setStatusFilter('all')
                setGroupFilter('all')
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </motion.div>

        {/* Guests List */}
        <div className="space-y-4">
          <AnimatePresence>
            {filteredGuests.map((guest, index) => (
              <motion.div
                key={guest._id || `${guest.name}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="card p-6 hover:shadow-medium transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-primary-600" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {guest.name}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          rsvpStatuses.find(s => s.value === guest.rsvpStatus)?.color
                        }`}>
                          {rsvpStatuses.find(s => s.value === guest.rsvpStatus)?.label}
                        </span>
                        {guest.plusOne && (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                            +1
                          </span>
                        )}
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {guest.group}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-2" />
                          {guest.email}
                        </div>
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-2" />
                          {guest.phone}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          {guest.address}
                        </div>
                        {guest.plusOne && guest.plusOneName && (
                          <div className="flex items-center">
                            <UserPlus className="w-4 h-4 mr-2" />
                            Plus One: {guest.plusOneName}
                          </div>
                        )}
                      </div>
                      
                      {guest.dietaryRestrictions && (
                        <div className="mt-2 text-sm text-gray-600">
                          <strong>Dietary:</strong> {guest.dietaryRestrictions}
                        </div>
                      )}
                      
                      {guest.notes && (
                        <div className="mt-2 text-sm text-gray-600">
                          <strong>Notes:</strong> {guest.notes}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => setEditingGuest(guest)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteGuest(guest._id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {filteredGuests.length === 0 && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No guests found</h3>
              <p className="text-gray-600">Add your first guest or import from CSV to get started!</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Add Guest Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-xl font-semibold mb-4">Add New Guest</h2>
            
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Guest name"
                value={newGuest.name}
                onChange={(e) => setNewGuest({...newGuest, name: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              
              <input
                type="email"
                placeholder="Email address"
                value={newGuest.email}
                onChange={(e) => setNewGuest({...newGuest, email: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              
              <input
                type="tel"
                placeholder="Phone number"
                value={newGuest.phone}
                onChange={(e) => setNewGuest({...newGuest, phone: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              
              <input
                type="text"
                placeholder="Address"
                value={newGuest.address}
                onChange={(e) => setNewGuest({...newGuest, address: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              
              <div className="grid grid-cols-2 gap-4">
                <select
                  value={newGuest.rsvpStatus}
                  onChange={(e) => setNewGuest({...newGuest, rsvpStatus: e.target.value as any})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {rsvpStatuses.map(status => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
                
                <select
                  value={newGuest.group}
                  onChange={(e) => setNewGuest({...newGuest, group: e.target.value})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {groups.map(group => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="plusOne"
                  checked={newGuest.plusOne}
                  onChange={(e) => setNewGuest({...newGuest, plusOne: e.target.checked})}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <label htmlFor="plusOne" className="text-sm text-gray-700">Plus One</label>
              </div>
              
              {newGuest.plusOne && (
                <input
                  type="text"
                  placeholder="Plus one name"
                  value={newGuest.plusOneName}
                  onChange={(e) => setNewGuest({...newGuest, plusOneName: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              )}
              
              <input
                type="text"
                placeholder="Dietary restrictions"
                value={newGuest.dietaryRestrictions}
                onChange={(e) => setNewGuest({...newGuest, dietaryRestrictions: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              
              <textarea
                placeholder="Notes"
                value={newGuest.notes}
                onChange={(e) => setNewGuest({...newGuest, notes: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows={3}
              />
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddGuest}
                className="flex-1 btn-primary"
              >
                Add Guest
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Import CSV Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-xl font-semibold mb-4">Import Guests from CSV</h2>
            
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleCsvUpload}
                  className="hidden"
                  id="csv-upload"
                />
                <label htmlFor="csv-upload" className="btn-primary cursor-pointer">
                  Choose CSV File
                </label>
                <p className="text-sm text-gray-600 mt-2">
                  CSV should include columns: Name, Email, Phone, Address, RSVP Status, Plus One, Plus One Name, Dietary Restrictions, Notes, Group
                </p>
              </div>
              
              {importPreview.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Preview (first 5 rows):</h3>
                  <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr>
                          {Object.keys(importPreview[0]).map(key => (
                            <th key={key} className="text-left p-2 border-b">{key}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {importPreview.map((row, index) => (
                          <tr key={index}>
                            {Object.values(row).map((value, i) => (
                              <td key={`${index}-${i}`} className="p-2 border-b">{String(value)}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowImportModal(false)
                  setCsvFile(null)
                  setImportPreview([])
                }}
                className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleImportGuests}
                disabled={!csvFile}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Import Guests
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* QR Code Modal */}
      {showQRModal && (
        <QRCodeGenerator
          weddingId={user._id || user.id}
          weddingName={user.brideName && user.groomName ? `${user.brideName} & ${user.groomName}` : user.name}
          onClose={() => setShowQRModal(false)}
        />
      )}
    </div>
  )
} 