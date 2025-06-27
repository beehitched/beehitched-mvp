'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageCircle, 
  X, 
  Send, 
  Users, 
  Minimize2,
  Maximize2
} from 'lucide-react'

interface Message {
  id: string
  senderId: string
  senderName: string
  content: string
  timestamp: Date
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

interface MessagingSystemProps {
  collaborators: Collaborator[]
}

export default function MessagingSystem({ collaborators }: MessagingSystemProps) {
  const { user, token } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [unreadCount, setUnreadCount] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

  // Sample messages for demo - in real app, fetch from API
  useEffect(() => {
    if (isOpen) {
      // Load messages from API
      fetchMessages()
    }
  }, [isOpen])

  const fetchMessages = async () => {
    try {
      console.log('Token:', token)
      console.log('API_URL:', API_URL)
      console.log('Making request to:', `${API_URL}/messages`)
      
      const response = await fetch(`${API_URL}/messages`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      console.log('Response status:', response.status)
      console.log('Response headers:', response.headers)
      
      if (response.ok) {
        const data = await response.json()
        setMessages(data)
      } else {
        const errorData = await response.json()
        console.log('Error response:', errorData)
        // For demo, use sample messages
        setMessages([
          {
            id: '1',
            senderId: 'user1',
            senderName: 'Sarah (Maid of Honor)',
            content: 'Hey everyone! I just confirmed the bridesmaid dress fittings for next week.',
            timestamp: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
          },
          {
            id: '2',
            senderId: 'user2',
            senderName: 'Mom',
            content: 'Perfect! I\'ll make sure everyone knows the schedule.',
            timestamp: new Date(Date.now() - 1000 * 60 * 25) // 25 minutes ago
          },
          {
            id: '3',
            senderId: (user?._id || user?.id || 'currentUser') as string,
            senderName: 'You',
            content: 'Thanks Sarah! That\'s a huge help.',
            timestamp: new Date(Date.now() - 1000 * 60 * 20) // 20 minutes ago
          }
        ])
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const debugCollaborations = async () => {
    try {
      console.log('Debugging collaborations...')
      const response = await fetch(`${API_URL}/messages/debug`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log('Debug data:', data)
        alert(`Debug info logged to console. Collaborations found: ${data.collaborationCount}`)
      } else {
        const errorData = await response.json()
        console.log('Debug error:', errorData)
        alert(`Debug failed: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Debug error:', error)
      alert('Debug failed: ' + error)
    }
  }

  const debugWeddings = async () => {
    try {
      console.log('Debugging all weddings...')
      const response = await fetch(`${API_URL}/messages/debug-weddings`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log('Debug weddings data:', data)
        console.log('Users:', data.users)
        console.log('Collaborations:', data.collaborations)
        
        // Log detailed collaboration info
        data.collaborations.forEach((collab: any, index: number) => {
          console.log(`Collaboration ${index}:`, {
            _id: collab._id,
            weddingId: collab.weddingId,
            userId: collab.userId,
            role: collab.role,
            status: collab.status,
            email: collab.email,
            name: collab.name
          })
        })
        
        alert(`Weddings: ${data.weddingCount}, Collaborations: ${data.collaborationCount}`)
      } else {
        const errorData = await response.json()
        console.log('Debug weddings error:', errorData)
        alert(`Debug weddings failed: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Debug weddings error:', error)
      alert('Debug weddings failed: ' + error)
    }
  }

  const createWedding = async () => {
    try {
      console.log('Creating wedding...')
      const response = await fetch(`${API_URL}/auth/create-wedding`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: `${user?.name || 'Emily'} & David's Wedding`,
          weddingDate: '2025-12-12',
          partnerName: 'David',
          venue: 'Beautiful Garden Venue',
          theme: 'Romantic Garden',
          budget: 25000,
          guestCount: 150
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log('Wedding created:', data)
        alert('Wedding created successfully! Try the messaging system now.')
        // Refresh messages
        fetchMessages()
      } else {
        const errorData = await response.json()
        console.log('Wedding creation error:', errorData)
        alert(`Wedding creation failed: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Wedding creation error:', error)
      alert('Wedding creation failed: ' + error)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim()) return

    const messageData = {
      content: newMessage,
      weddingId: (user as any)?.weddingId || 'demo'
    }

    try {
      const response = await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(messageData)
      })

      if (response.ok) {
        const sentMessage = await response.json()
        setMessages(prev => [...prev, sentMessage])
        setNewMessage('')
      } else {
        // For demo, add message locally
        const demoMessage: Message = {
          id: Date.now().toString(),
          senderId: (user?._id || user?.id || 'currentUser') as string,
          senderName: 'You',
          content: newMessage,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, demoMessage])
        setNewMessage('')
      }
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    })
  }

  const formatDate = (timestamp: Date) => {
    const now = new Date()
    const messageDate = new Date(timestamp)
    
    if (messageDate.toDateString() === now.toDateString()) {
      return 'Today'
    } else if (messageDate.toDateString() === new Date(now.getTime() - 24 * 60 * 60 * 1000).toDateString()) {
      return 'Yesterday'
    } else {
      return messageDate.toLocaleDateString()
    }
  }

  const activeCollaborators = collaborators.filter(c => c.status === 'accepted')

  return (
    <>
      {/* Floating Message Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          setIsOpen(true)
          setIsMinimized(false)
          setUnreadCount(0)
        }}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-50 flex items-center justify-center"
      >
        <MessageCircle className="w-6 h-6" />
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.div>
        )}
      </motion.button>

      {/* Chat Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-end p-6"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setIsOpen(false)
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.8, y: 100 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 100 }}
              className={`bg-white rounded-lg shadow-2xl flex flex-col ${
                isMinimized ? 'w-80 h-16' : 'w-96 h-[500px]'
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-primary-600 text-white rounded-t-lg">
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5" />
                  <div>
                    <h3 className="font-semibold">Wedding Chat</h3>
                    <p className="text-xs opacity-90">
                      {activeCollaborators.length} collaborator{activeCollaborators.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={debugCollaborations}
                    className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors text-xs"
                    title="Debug collaborations"
                  >
                    🐛
                  </button>
                  <button
                    onClick={debugWeddings}
                    className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                    title="Debug weddings"
                  >
                    🎉
                  </button>
                  <button
                    onClick={createWedding}
                    className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                    title="Create wedding"
                  >
                    💒
                  </button>
                  <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                  >
                    {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {!isMinimized && (
                <>
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${message.senderId === (user?._id || user?.id) ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs lg:max-w-md ${message.senderId === (user?._id || user?.id) ? 'order-2' : 'order-1'}`}>
                          <div className={`rounded-lg px-3 py-2 ${
                            message.senderId === (user?._id || user?.id)
                              ? 'bg-primary-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}>
                            <p className="text-sm">{message.content}</p>
                          </div>
                          <div className={`text-xs text-gray-500 mt-1 ${
                            message.senderId === (user?._id || user?.id) ? 'text-right' : 'text-left'
                          }`}>
                            <span className="font-medium">{message.senderName}</span>
                            <span className="ml-2">{formatTime(message.timestamp)}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <input
                        ref={inputRef}
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                      <button
                        onClick={sendMessage}
                        disabled={!newMessage.trim()}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
} 