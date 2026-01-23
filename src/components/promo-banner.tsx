'use client'

import { Marquee } from '@/components/ui/marquee'
import { ArrowRight, Tag } from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface PromoBannerProps {
  promotions: { text: string | null; link?: string | null }[]
}

export function PromoBanner({ promotions }: PromoBannerProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Auto-rotate for mobile
  useEffect(() => {
    if (!isMobile || !promotions || promotions.length <= 1) return
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % promotions.length)
    }, 4000) // Change every 4 seconds on mobile
    return () => clearInterval(timer)
  }, [isMobile, promotions])

  if (!promotions || promotions.length === 0) return null

  const items = promotions.map(p => ({
      text: p.text || "🔥 OFFRE EXCEPTIONNELLE EN COURS !",
      link: p.link
  }))

  if (items.length === 0) return null

  // --- MOBILE VIEW (Vertical Slider) ---
  if (isMobile) {
    const currentItem = items[currentIndex]
    return (
        <div className="relative bg-red-600 text-white z-[60] h-12 overflow-hidden border-b border-red-800 shadow-xl flex items-center justify-center">
            {/* Background Flash Effect */}
            <div className="absolute inset-0 bg-red-500 animate-pulse opacity-20 pointer-events-none" />
            
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute w-full px-4 flex justify-center"
                >
                    <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wider text-center">
                        <Tag className="w-3 h-3 text-yellow-300 fill-yellow-300 animate-pulse shrink-0" />
                        <span className="truncate max-w-[200px] xs:max-w-none">{currentItem.text}</span>
                        {currentItem.link && (
                            <a href={currentItem.link} target="_blank" className="ml-1 bg-white text-red-600 px-2 py-0.5 rounded-full text-[9px] font-bold shrink-0">
                                GO
                            </a>
                        )}
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Pagination Dots (if multiple) */}
            {items.length > 1 && (
                <div className="absolute bottom-1 flex gap-1">
                    {items.map((_, idx) => (
                        <div key={idx} className={`w-1 h-1 rounded-full transition-colors ${idx === currentIndex ? 'bg-white' : 'bg-white/30'}`} />
                    ))}
                </div>
            )}
        </div>
    )
  }

  // --- DESKTOP VIEW (Marquee) ---
  return (
    <div className="relative bg-red-600 text-white z-[60] py-2 overflow-hidden border-b border-red-800 shadow-xl">
       <div className="absolute inset-0 bg-red-500 animate-pulse opacity-20 pointer-events-none" />

       <Marquee className="py-1" speed={40}>
          {items.map((item, i) => (
             <div key={i} className="flex items-center gap-12 mx-8">
                <div className="flex items-center gap-3 font-black text-sm md:text-base uppercase tracking-widest whitespace-nowrap">
                   <Tag className="w-4 h-4 md:w-5 md:h-5 text-yellow-300 fill-yellow-300 animate-pulse" />
                   {item.text}
                   {item.link ? (
                      <a href={item.link} target="_blank" className="ml-2 bg-white text-red-600 px-3 py-1 rounded-full text-[10px] md:text-xs font-bold hover:scale-105 transition-transform flex items-center gap-1">
                         PROFITER <ArrowRight className="w-3 h-3" />
                      </a>
                   ) : null}
                </div>
                <div className="text-red-300/50 text-xs">●</div>
             </div>
          ))}
       </Marquee>
    </div>
  )
}