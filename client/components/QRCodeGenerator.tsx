'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Download, Copy, QrCode, Share2 } from 'lucide-react'

interface QRCodeGeneratorProps {
  weddingId: string
  weddingName: string
  onClose: () => void
}

export default function QRCodeGenerator({ weddingId, weddingName, onClose }: QRCodeGeneratorProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('')

  const rsvpUrl = `${process.env.NEXT_PUBLIC_CLIENT_URL || 'http://localhost:3000'}/rsvp/${weddingId}`

  useEffect(() => {
    setQrCodeUrl(rsvpUrl)
    generateQRCode()
  }, [rsvpUrl])

  const generateQRCode = async () => {
    try {
      // Dynamic import to avoid SSR issues
      const QRCode = (await import('qrcode')).default
      const dataUrl = await QRCode.toDataURL(rsvpUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#7C3AED', // Purple color
          light: '#FFFFFF'
        }
      })
      setQrCodeDataUrl(dataUrl)
    } catch (error) {
      console.error('Error generating QR code:', error)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(rsvpUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const downloadQRCode = () => {
    if (qrCodeDataUrl) {
      const link = document.createElement('a')
      link.download = `${weddingName}-RSVP-QR.png`
      link.href = qrCodeDataUrl
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const shareQRCode = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${weddingName} - RSVP`,
          text: 'Scan this QR code to RSVP for our wedding!',
          url: rsvpUrl
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      copyToClipboard()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg p-6 w-full max-w-md"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">RSVP QR Code</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="text-center mb-6">
          <div className="mb-4">
            <QrCode className="w-8 h-8 text-primary-600 mx-auto mb-2" />
            <h3 className="text-lg font-medium text-gray-900">{weddingName}</h3>
            <p className="text-sm text-gray-600">Scan to RSVP</p>
          </div>

          {qrCodeDataUrl ? (
            <div className="bg-white p-4 rounded-lg border-2 border-gray-200 inline-block">
              <img 
                src={qrCodeDataUrl} 
                alt="RSVP QR Code" 
                className="w-48 h-48"
              />
            </div>
          ) : (
            <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center mx-auto">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
            <input
              type="text"
              value={qrCodeUrl}
              readOnly
              className="flex-1 text-sm bg-transparent border-none outline-none"
            />
            <button
              onClick={copyToClipboard}
              className={`p-2 rounded-lg transition-colors ${
                copied ? 'bg-green-100 text-green-600' : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={downloadQRCode}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
            <button
              onClick={shareQRCode}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>How to use:</strong> Print this QR code and include it in your wedding invitations. 
            Guests can scan it with their phone camera to access the RSVP form.
          </p>
        </div>
      </motion.div>
    </div>
  )
} 