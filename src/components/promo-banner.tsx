'use client'

import { Marquee } from '@/components/ui/marquee'
import { ArrowRight, Tag } from 'lucide-react'
import Link from 'next/link'

interface PromoBannerProps {
  promotions: { text: string | null; link?: string | null }[]
}

export function PromoBanner({ promotions }: PromoBannerProps) {
  if (!promotions || promotions.length === 0) return null

  // Filter out items without text and prepare list
  const items = promotions
    .filter(p => p.text) // Keep only promos with text
    .map(p => ({
      text: p.text!,
      link: p.link
    }))

  if (items.length === 0) return null

  return (
    <div className="relative bg-red-600 text-white z-[60] py-2 overflow-hidden border-b border-red-800 shadow-xl">
       {/* Background Flash Effect */}
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
                {/* Separator */}
                <div className="text-red-300/50 text-xs">●</div>
             </div>
          ))}
       </Marquee>
    </div>
  )
}
