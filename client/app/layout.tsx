import React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/contexts/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BeeHitched - Elegant Wedding Planning Made Simple',
  description: 'Plan your perfect wedding with our elegant, intuitive wedding planning platform. Manage tasks, guests, and collaborate with loved ones.',
  keywords: 'wedding planning, wedding organizer, wedding tasks, guest management, wedding collaboration',
  authors: [{ name: 'BeeHitched Team' }],
  icons: {
    icon: '/icon.svg',
  },
  openGraph: {
    title: 'BeeHitched - Wedding Planning Made Simple',
    description: 'Plan your perfect wedding with our elegant, intuitive wedding planning platform.',
    type: 'website',
    locale: 'en_US',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#fff',
                color: '#374151',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                boxShadow: '0 4px 25px -5px rgba(0, 0, 0, 0.1)',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  )
} 