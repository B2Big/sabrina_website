'use client';

import { Home, Dumbbell, Sparkles, Mail, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function MobileNav() {
  const pathname = usePathname();

  // Only show on mobile
  // Sticky bottom
  // Glassmorphism effect

  const NAV_ITEMS = [
    { label: 'Accueil', icon: Home, href: '/' },
    { label: 'Coaching', icon: Dumbbell, href: '#coaching' },
    { label: 'Massage', icon: Sparkles, href: '#massage' },
    { label: 'Contact', icon: Mail, href: '#contact' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden pb-safe">
      <div className="bg-white/90 backdrop-blur-lg border-t border-slate-200 px-6 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <nav className="flex justify-between items-center max-w-sm mx-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href.startsWith('#') && false); // Hash active handling is complex, sticking to simple visual
            // Simple visual active state could be handled if we tracked scroll section, 
            // for now we make them all equal/clickable.
            
            return (
              <Link 
                key={item.label} 
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-xl transition-colors",
                  "text-slate-400 hover:text-slate-900 active:scale-95"
                )}
              >
                <item.icon className="w-6 h-6" />
                <span className="text-[10px] font-bold uppercase tracking-wide">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
