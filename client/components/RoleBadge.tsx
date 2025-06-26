'use client'

import React from 'react'

interface RoleBadgeProps {
  role: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const roleColors = {
  'Owner': 'bg-purple-100 text-purple-800 border-purple-200',
  'Bride': 'bg-pink-100 text-pink-800 border-pink-200',
  'Groom': 'bg-blue-100 text-blue-800 border-blue-200',
  'Planner': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  'Maid of Honor': 'bg-rose-100 text-rose-800 border-rose-200',
  'Best Man': 'bg-indigo-100 text-indigo-800 border-indigo-200',
  'Parent': 'bg-amber-100 text-amber-800 border-amber-200',
  'Sibling': 'bg-teal-100 text-teal-800 border-teal-200',
  'Friend': 'bg-slate-100 text-slate-800 border-slate-200',
  'Other': 'bg-gray-100 text-gray-800 border-gray-200'
}

const sizeClasses = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-base'
}

export default function RoleBadge({ role, size = 'md', className = '' }: RoleBadgeProps) {
  const colorClass = roleColors[role as keyof typeof roleColors] || roleColors['Other']
  const sizeClass = sizeClasses[size]

  return (
    <span className={`
      inline-flex items-center font-medium rounded-full border
      ${colorClass} ${sizeClass} ${className}
    `}>
      {role}
    </span>
  )
} 