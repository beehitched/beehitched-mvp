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
  Maximize2,
  Search,
  MoreVertical,
  Phone,
  Video,
  Smile,
  Paperclip,
  ArrowLeft,
  User,
  Crown,
  Star,
  ChevronRight
} from 'lucide-react'

interface Message {
  _id?: string
  id?: string
  senderId: string
  senderName: string
  content: string
  timestamp: Date | string
  type?: 'group' | 'individual'
  recipientId?: string
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
}

interface MessagingSystemProps {
  collaborators: Collaborator[]
}

type ChatType = 'group' | 'individual'

export default function MessagingSystem({ collaborators }: MessagingSystemProps) {
  const { user, token } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [unreadCount, setUnreadCount] = useState(0)
  const [chatType, setChatType] = useState<ChatType>('group')
  const [selectedCollaborator, setSelectedCollaborator] = useState<Collaborator | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

  useEffect(() => {
    if (isOpen) {
      fetchMessages()
    }
  }, [isOpen, chatType, selectedCollaborator])

  const fetchMessages = async () => {
    try {
      console.log('Fetching messages...')
      
      const endpoint = chatType === 'group' ? '/messages' : `/messages/individual/${selectedCollaborator?.userId?._id}`
      const response = await fetch(`${API_URL}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log('Messages fetched:', data)
        setMessages(data)
      } else {
        const errorData = await response.json()
        console.error('Failed to fetch messages:', errorData)
        setMessages([])
        if (errorData.error === 'No active wedding collaboration found') {
          console.log('No wedding collaboration found - user needs to be part of a wedding')
        }
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
      setMessages([])
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim()) return

    const messageData = {
      content: newMessage,
      type: chatType,
      ...(chatType === 'individual' && selectedCollaborator?.userId && {
        recipientId: selectedCollaborator.userId._id
      })
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
        const errorData = await response.json()
        console.error('Failed to send message:', errorData)
        alert(`Failed to send message: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message. Please try again.')
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

  const formatTime = (timestamp: Date | string) => {
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp)
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    })
  }

  const formatDate = (timestamp: Date | string) => {
    const now = new Date()
    const messageDate = timestamp instanceof Date ? timestamp : new Date(timestamp)
    
    if (messageDate.toDateString() === now.toDateString()) {
      return 'Today'
    } else if (messageDate.toDateString() === new Date(now.getTime() - 24 * 60 * 60 * 1000).toDateString()) {
      return 'Yesterday'
    } else {
      return messageDate.toLocaleDateString()
    }
  }

  const activeCollaborators = collaborators.filter(c => c.status === 'accepted' && c.userId)
  const filteredCollaborators = activeCollaborators.filter(c => 
    (c.userId?.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    c.role.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case 'owner':
      case 'bride':
      case 'groom':
        return <Crown className="w-3 h-3 text-yellow-500" />
      case 'planner':
        return <Star className="w-3 h-3 text-blue-500" />
      default:
        return <User className="w-3 h-3 text-gray-500" />
    }
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

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
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-pink-100 to-pink-400 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 z-50 flex items-center justify-center group"
      >
        <MessageCircle className="w-7 h-7 group-hover:scale-110 transition-transform duration-200" />
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg"
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-end p-6"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setIsOpen(false)
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.8, y: 100, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: 100, opacity: 0 }}
              className={`bg-white rounded-2xl shadow-2xl flex flex-col border border-gray-100 ${
                isMinimized ? 'w-80 h-16' : 'w-[500px] h-[600px]'
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-pink-100 via-pink-200 to-pink-400 text-gray-800 rounded-t-2xl">
                <div className="flex items-center space-x-3">
                  {chatType === 'individual' && selectedCollaborator && (
                    <button
                      onClick={() => {
                        setChatType('group')
                        setSelectedCollaborator(null)
                      }}
                      className="p-1 hover:bg-white/20 rounded-full transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                  )}
                  <div className="w-10 h-10 bg-gradient-to-r from-pink-100 via-pink-200 to-pink-400 rounded-full flex items-center justify-center text-gray-800 font-bold">
                    {chatType === 'group' ? (
                      <Users className="w-5 h-5" />
                    ) : (
                      <span className="text-sm font-bold">
                        {getInitials(selectedCollaborator?.userId?.name || '')}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      {chatType === 'group' ? 'Wedding Chat' : selectedCollaborator?.userId?.name}
                    </h3>
                    <p className="text-xs opacity-90">
                      {chatType === 'group' 
                        ? `${activeCollaborators.length} collaborator${activeCollaborators.length !== 1 ? 's' : ''}`
                        : selectedCollaborator?.role
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  >
                    {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {!isMinimized && (
                <>
                  {/* Chat Type Selector */}
                  {!selectedCollaborator && (
                    <div className="flex p-2 bg-gray-50 border-b">
                      <button
                        onClick={() => setChatType('group')}
                        className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                          chatType === 'group'
                            ? 'bg-white text-pink-600 shadow-sm'
                            : 'text-gray-600 hover:bg-white/50'
                        }`}
                      >
                        <Users className="w-4 h-4 inline mr-2" />
                        Group Chat
                      </button>
                      <button
                        onClick={() => setChatType('individual')}
                        className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                          chatType === 'individual'
                            ? 'bg-white text-pink-600 shadow-sm'
                            : 'text-gray-600 hover:bg-white/50'
                        }`}
                      >
                        <User className="w-4 h-4 inline mr-2" />
                        Direct Messages
                      </button>
                    </div>
                  )}

                  {/* Individual Chat - Collaborator List */}
                  {chatType === 'individual' && !selectedCollaborator && (
                    <div className="flex-1 overflow-y-auto p-4">
                      <div className="mb-4">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type="text"
                            placeholder="Search collaborators..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        {filteredCollaborators.map((collaborator) => (
                          <motion.button
                            key={collaborator._id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedCollaborator(collaborator)}
                            className="w-full p-3 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-all duration-200 text-left collaborator-card-hover"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-r from-pink-100 via-pink-200 to-pink-400 rounded-full flex items-center justify-center text-gray-800 font-bold">
                                {getInitials(collaborator.userId?.name || '')}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium text-gray-900">{collaborator.userId?.name}</span>
                                  {getRoleIcon(collaborator.role)}
                                </div>
                                <p className="text-sm text-gray-600">{collaborator.role}</p>
                              </div>
                              <ChevronRight className="w-4 h-4 text-gray-400" />
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Messages */}
                  {((chatType === 'group') || (chatType === 'individual' && selectedCollaborator)) && (
                    <>
                      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
                        {messages.length === 0 ? (
                          <div className="flex flex-col items-center justify-center h-full text-gray-500">
                            <MessageCircle className="w-12 h-12 mb-4 opacity-50" />
                            <p className="text-lg font-medium">No messages yet</p>
                            <p className="text-sm">Start the conversation!</p>
                          </div>
                        ) : (
                          messages.map((message) => (
                            <motion.div
                              key={message._id || message.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={`flex ${message.senderId === (user?._id || user?.id) ? 'justify-end' : 'justify-start'}`}
                            >
                              <div className={`max-w-xs lg:max-w-md ${message.senderId === (user?._id || user?.id) ? 'order-2' : 'order-1'}`}>
                                <div className={`rounded-2xl px-4 py-3 shadow-sm ${
                                  message.senderId === (user?._id || user?.id)
                                    ? 'bg-gradient-to-r from-pink-100 via-pink-200 to-pink-400 text-gray-800'
                                    : 'bg-white text-gray-900 border border-gray-100'
                                }`}>
                                  <p className="text-sm leading-relaxed">{message.content}</p>
                                </div>
                                <div className={`text-xs text-gray-500 mt-2 ${
                                  message.senderId === (user?._id || user?.id) ? 'text-right' : 'text-left'
                                }`}>
                                  <span className="font-medium">{message.senderName}</span>
                                  <span className="ml-2">{formatTime(message.timestamp)}</span>
                                </div>
                              </div>
                            </motion.div>
                          ))
                        )}
                        <div ref={messagesEndRef} />
                      </div>

                      {/* Input */}
                      <div className="p-4 border-t border-gray-100 bg-white">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            className="p-2 text-gray-500 hover:text-pink-600 hover:bg-pink-50 rounded-full transition-colors"
                          >
                            <Smile className="w-5 h-5" />
                          </button>
                          <button className="p-2 text-gray-500 hover:text-pink-600 hover:bg-pink-50 rounded-full transition-colors">
                            <Paperclip className="w-5 h-5" />
                          </button>
                          <input
                            ref={inputRef}
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type your message..."
                            className="flex-1 px-4 py-3 border border-gray-200 rounded-full focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-gray-50 input-focus-effect"
                          />
                          <button
                            onClick={sendMessage}
                            disabled={!newMessage.trim()}
                            className="p-3 bg-gradient-to-r from-pink-100 via-pink-200 to-pink-400 text-gray-800 rounded-full hover:from-pink-200 hover:via-pink-300 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl send-button-pulse"
                          >
                            <Send className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
} 