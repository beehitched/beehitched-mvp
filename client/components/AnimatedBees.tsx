'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface BeeProps {
  delay?: number
  duration?: number
  size?: number
  startX?: number
  startY?: number
}

const Bee: React.FC<BeeProps> = ({ 
  delay = 0, 
  duration = 8, 
  size = 16, 
  startX = 0, 
  startY = 0 
}) => {
  // Create different flight patterns that work across all screen sizes
  const flightPatterns = [
    // Pattern 1: Left to right diagonal
    {
      x: [-10, 110],
      y: [10, 90]
    },
    // Pattern 2: Right to left diagonal
    {
      x: [110, -10],
      y: [90, 10]
    },
    // Pattern 3: Top to bottom with curve
    {
      x: [50, 90, 10, 50],
      y: [-10, 30, 70, 110]
    },
    // Pattern 4: Bottom to top with curve
    {
      x: [10, 90, 50, 10],
      y: [110, 70, 30, -10]
    },
    // Pattern 5: S-curve across screen
    {
      x: [-10, 30, 70, 110],
      y: [50, 10, 90, 50]
    },
    // Pattern 6: Figure 8 pattern
    {
      x: [10, 90, 10, 90, 10],
      y: [50, 10, 50, 90, 50]
    },
    // Pattern 7: Horizontal sweep
    {
      x: [-10, 25, 50, 75, 110],
      y: [30, 60, 40, 70, 30]
    },
    // Pattern 8: Vertical sweep
    {
      x: [40, 60, 30, 70, 40],
      y: [-10, 25, 50, 75, 110]
    }
  ]
  
  const pattern = flightPatterns[Math.floor(Math.random() * flightPatterns.length)]

  return (
    <motion.div
      className="absolute pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: 1,
        x: pattern.x.map(x => `${x}vw`),
        y: pattern.y.map(y => `${y}vh`),
        rotate: [0, 5, -5, 3, -3, 2, 0]
      }}
      transition={{ 
        delay, 
        duration: 1,
        x: { duration, repeat: Infinity, ease: "easeInOut", delay },
        y: { duration, repeat: Infinity, ease: "easeInOut", delay },
        rotate: { duration, repeat: Infinity, ease: "easeInOut", delay }
      }}
      style={{
        position: 'absolute',
        left: `${startX}%`,
        top: `${startY}%`,
        width: size,
        height: size
      }}
    >
      {/* Bee body */}
      <div className="relative w-full h-full">
        {/* Main body */}
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-yellow-400 rounded-full shadow-sm" />
        
        {/* Wings */}
        <div className="absolute -top-1 -left-1 w-3 h-2 bg-white/80 rounded-full bee-wing-left" />
        <div className="absolute -top-1 -right-1 w-3 h-2 bg-white/80 rounded-full bee-wing-right" />
        
        {/* Stripes */}
        <div className="absolute top-1/4 left-1/4 right-1/4 h-0.5 bg-black/20 rounded-full" />
        <div className="absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-black/20 rounded-full" />
        <div className="absolute top-3/4 left-1/4 right-1/4 h-0.5 bg-black/20 rounded-full" />
        
        {/* Glow effect */}
        <div className="absolute inset-0 bg-yellow-200/30 rounded-full blur-sm bee-glow" />
      </div>


    </motion.div>
  )
}

const AnimatedBees: React.FC = () => {
  const bees = [
    // Top Left Corner (10 bees)
    { delay: 0, duration: 25, size: 14, startX: -15, startY: -10 },
    { delay: 2.5, duration: 22, size: 12, startX: -10, startY: -5 },
    { delay: 5, duration: 28, size: 16, startX: -5, startY: -15 },
    { delay: 7.5, duration: 24, size: 13, startX: -20, startY: -8 },
    { delay: 10, duration: 26, size: 15, startX: -12, startY: -12 },
    { delay: 12.5, duration: 21, size: 11, startX: -8, startY: -18 },
    { delay: 15, duration: 30, size: 14, startX: -18, startY: -6 },
    { delay: 17.5, duration: 23, size: 13, startX: -6, startY: -10 },
    { delay: 20, duration: 27, size: 12, startX: -14, startY: -14 },
    { delay: 22.5, duration: 29, size: 15, startX: -16, startY: -9 },
    
    // Top Right Corner (10 bees)
    { delay: 1, duration: 25, size: 14, startX: 115, startY: -10 },
    { delay: 3.5, duration: 22, size: 12, startX: 110, startY: -5 },
    { delay: 6, duration: 28, size: 16, startX: 105, startY: -15 },
    { delay: 8.5, duration: 24, size: 13, startX: 120, startY: -8 },
    { delay: 11, duration: 26, size: 15, startX: 112, startY: -12 },
    { delay: 13.5, duration: 21, size: 11, startX: 108, startY: -18 },
    { delay: 16, duration: 30, size: 14, startX: 118, startY: -6 },
    { delay: 18.5, duration: 23, size: 13, startX: 106, startY: -10 },
    { delay: 21, duration: 27, size: 12, startX: 114, startY: -14 },
    { delay: 23.5, duration: 29, size: 15, startX: 116, startY: -9 },
    
    // Bottom Left Corner (10 bees)
    { delay: 0.5, duration: 25, size: 14, startX: -15, startY: 110 },
    { delay: 3, duration: 22, size: 12, startX: -10, startY: 105 },
    { delay: 5.5, duration: 28, size: 16, startX: -5, startY: 115 },
    { delay: 8, duration: 24, size: 13, startX: -20, startY: 108 },
    { delay: 10.5, duration: 26, size: 15, startX: -12, startY: 112 },
    { delay: 13, duration: 21, size: 11, startX: -8, startY: 118 },
    { delay: 15.5, duration: 30, size: 14, startX: -18, startY: 106 },
    { delay: 18, duration: 23, size: 13, startX: -6, startY: 110 },
    { delay: 20.5, duration: 27, size: 12, startX: -14, startY: 114 },
    { delay: 23, duration: 29, size: 15, startX: -16, startY: 109 },
    
    // Bottom Right Corner (10 bees)
    { delay: 1.5, duration: 25, size: 14, startX: 115, startY: 110 },
    { delay: 4, duration: 22, size: 12, startX: 110, startY: 105 },
    { delay: 6.5, duration: 28, size: 16, startX: 105, startY: 115 },
    { delay: 9, duration: 24, size: 13, startX: 120, startY: 108 },
    { delay: 11.5, duration: 26, size: 15, startX: 112, startY: 112 },
    { delay: 14, duration: 21, size: 11, startX: 108, startY: 118 },
    { delay: 16.5, duration: 30, size: 14, startX: 118, startY: 106 },
    { delay: 19, duration: 23, size: 13, startX: 106, startY: 110 },
    { delay: 21.5, duration: 27, size: 12, startX: 114, startY: 114 },
    { delay: 24, duration: 29, size: 15, startX: 116, startY: 109 },
  ]

  return (
    <div className="absolute inset-0 pointer-events-none">
      {bees.map((bee, index) => (
        <Bee
          key={index}
          delay={bee.delay}
          duration={bee.duration}
          size={bee.size}
          startX={bee.startX}
          startY={bee.startY}
        />
      ))}
    </div>
  )
}

export default AnimatedBees 