'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

interface User {
  id: string
  _id?: string
  name: string
  email: string
  role?: string
  partnerName?: string
  brideName?: string
  groomName?: string
  weddingDate?: string
  budget?: number
  guestCount?: number
  venue?: string
  theme?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => void
  updateProfile: (data: Partial<User>) => Promise<void>
  updateUser: (userData: User) => void
  loading: boolean
}

interface RegisterData {
  name: string
  email: string
  password: string
  partnerName?: string
  weddingDate?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Initialize axios defaults
  useEffect(() => {
    axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
  }, [])

  // Check for existing token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('beehitched_token')
    const storedUser = localStorage.getItem('beehitched_user')
    
    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
    }
    
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('/auth/login', { email, password })
      const { token: newToken, user: userData } = response.data
      
      setToken(newToken)
      setUser(userData)
      
      localStorage.setItem('beehitched_token', newToken)
      localStorage.setItem('beehitched_user', JSON.stringify(userData))
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
      
      toast.success('Welcome back!')
    } catch (error: any) {
      const message = error.response?.data?.error || 'Login failed'
      toast.error(message)
      throw error
    }
  }

  const register = async (userData: RegisterData) => {
    try {
      const response = await axios.post('/auth/register', userData)
      const { token: newToken, user: newUser } = response.data
      
      setToken(newToken)
      setUser(newUser)
      
      localStorage.setItem('beehitched_token', newToken)
      localStorage.setItem('beehitched_user', JSON.stringify(newUser))
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
      
      toast.success('Welcome to BeeHitched!')
    } catch (error: any) {
      const message = error.response?.data?.error || 'Registration failed'
      toast.error(message)
      throw error
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('beehitched_token')
    localStorage.removeItem('beehitched_user')
    delete axios.defaults.headers.common['Authorization']
    toast.success('Logged out successfully')
  }

  const updateProfile = async (data: Partial<User>) => {
    try {
      const response = await axios.put('/auth/profile', data)
      const updatedUser = response.data.user
      
      setUser(updatedUser)
      localStorage.setItem('beehitched_user', JSON.stringify(updatedUser))
      
      toast.success('Profile updated successfully')
    } catch (error: any) {
      const message = error.response?.data?.error || 'Profile update failed'
      toast.error(message)
      throw error
    }
  }

  const updateUser = (userData: User) => {
    setUser(userData)
    localStorage.setItem('beehitched_user', JSON.stringify(userData))
    toast.success('User updated successfully')
  }

  const value = {
    user,
    token,
    login,
    register,
    logout,
    updateProfile,
    updateUser,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 