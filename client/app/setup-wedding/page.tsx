'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { motion } from 'framer-motion'
import { Heart, Users, Plus, ArrowRight, ArrowLeft } from 'lucide-react'

export default function SetupWeddingPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [choice, setChoice] = useState<'join' | 'create' | null>(null)

  if (!user) {
    router.push('/login')
    return null
  }

  const handleChoice = (selectedChoice: 'join' | 'create') => {
    setChoice(selectedChoice)
    if (selectedChoice === 'create') {
      router.push('/create-wedding')
    } else {
      router.push('/join-wedding')
    }
  }

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-soft mb-4"
          >
            <Heart className="w-8 h-8 text-primary-600" />
          </motion.div>
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
            Welcome to BeeHitched, {user.name?.split(' ')[0]}!
          </h1>
          <p className="text-gray-600">
            Let's get your wedding planning started
          </p>
        </div>

        {/* Choice Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Create Wedding */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="card p-8 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleChoice('create')}
          >
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                <Plus className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Create a New Wedding
              </h3>
              <p className="text-gray-600 mb-6">
                Start planning your own wedding and invite collaborators to help you organize everything.
              </p>
              <div className="flex items-center justify-center text-primary-600 font-medium">
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </div>
          </motion.div>

          {/* Join Wedding */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="card p-8 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleChoice('join')}
          >
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Join an Existing Wedding
              </h3>
              <p className="text-gray-600 mb-6">
                Join a wedding as a collaborator to help with planning, coordination, or as a guest.
              </p>
              <div className="flex items-center justify-center text-green-600 font-medium">
                <span>Join Wedding</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Back to Dashboard */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8"
        >
          <Link 
            href="/dashboard"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Skip for now, go to dashboard
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
} 