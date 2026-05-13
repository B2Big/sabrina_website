'use client';

import { useState, useEffect } from 'react';
import { Flame, Clock, CalendarCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScarcityBadgeProps {
  serviceId: string;
  category: string;
}

/**
 * 🔥 Générateur pseudo-aléatoire déterministe basé sur l'ID du service + la date
 * Retourne toujours la même valeur pour le même service à la même date
 * Mais change légèrement d'un jour à l'autre
 */
function getScarcityData(serviceId: string, category: string) {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  
  // Seed unique par service + jour de l'année
  const seed = serviceId.split('').reduce((a, b) => a + b.charCodeAt(0), 0) + dayOfYear * 7;
  
  // Générateur pseudo-aléatoire simple (LCG)
  const random1 = ((seed * 9301 + 49297) % 233280) / 233280;
  const random2 = ((seed * 49297 + 9301) % 233280) / 233280;
  
  // Configuration selon la catégorie
  const isCoaching = category === 'Coaching';
  const maxSpots = isCoaching ? 6 : 3;
  const minSpots = isCoaching ? 1 : 1;
  
  // Nombre de places (1 à 6 pour coaching, 1 à 3 pour massage)
  const spots = Math.floor(random1 * (maxSpots - minSpots + 1)) + minSpots;
  
  // Type de message (0: cette semaine, 1: semaine prochaine, 2: demain)
  const messageType = Math.floor(random2 * 3);
  
  // Date de la semaine prochaine
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  const nextWeekStr = nextWeek.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  
  // Date de demain
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toLocaleDateString('fr-FR', { weekday: 'long' });
  
  const messages = [
    { text: `Il reste ${spots} place${spots > 1 ? 's' : ''} cette semaine`, icon: Flame, urgency: 'high' as const },
    { text: `Semaine prochaine : ${spots} place${spots > 1 ? 's' : ''}`, icon: CalendarCheck, urgency: 'medium' as const },
    { text: `Disponible ${tomorrowStr} : ${spots} place${spots > 1 ? 's' : ''}`, icon: Clock, urgency: 'low' as const },
  ];
  
  const selected = messages[messageType];
  
  // Si très peu de places, force le message "cette semaine" pour plus d'urgence
  if (spots <= 2) {
    return {
      text: `🔥 Plus que ${spots} place${spots > 1 ? 's' : ''} cette semaine`,
      icon: Flame,
      urgency: 'high' as const,
      spots,
    };
  }
  
  return {
    text: selected.text,
    icon: selected.icon,
    urgency: selected.urgency,
    spots,
  };
}

export function ScarcityBadge({ serviceId, category }: ScarcityBadgeProps) {
  const [data, setData] = useState(() => getScarcityData(serviceId, category));
  const [show, setShow] = useState(false);
  
  // Animation d'entrée après un court délai (effet "live")
  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 500 + Math.random() * 1000);
    return () => clearTimeout(timer);
  }, []);
  
  // Variation légère du compteur toutes les 10-15 secondes (effet temps réel)
  useEffect(() => {
    if (data.spots <= 1) return; // Ne pas descendre en dessous de 1
    
    const interval = setInterval(() => {
      setData(prev => {
        // 30% de chance de diminuer de 1
        if (Math.random() > 0.7 && prev.spots > 1) {
          return {
            ...prev,
            spots: prev.spots - 1,
            text: prev.text.replace(/\d+/, String(prev.spots - 1)),
          };
        }
        return prev;
      });
    }, 12000 + Math.random() * 8000); // Entre 12 et 20 secondes
    
    return () => clearInterval(interval);
  }, [data.spots]);
  
  const Icon = data.icon;
  
  const styles = {
    high: {
      bg: 'bg-red-50',
      border: 'border-red-300',
      text: 'text-red-700',
      iconColor: 'text-red-500',
      shadow: 'shadow-red-500/20',
      animate: 'animate-pulse',
    },
    medium: {
      bg: 'bg-orange-50',
      border: 'border-orange-300',
      text: 'text-orange-700',
      iconColor: 'text-orange-500',
      shadow: 'shadow-orange-500/20',
      animate: '',
    },
    low: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-300',
      text: 'text-emerald-700',
      iconColor: 'text-emerald-500',
      shadow: 'shadow-emerald-500/20',
      animate: '',
    },
  };
  
  const style = styles[data.urgency];
  
  if (!show) return null;
  
  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] md:text-xs font-black uppercase tracking-wider shadow-sm",
      style.bg,
      style.border,
      style.text,
      style.shadow,
      style.animate,
      "transition-all duration-300"
    )}>
      <Icon className={cn("w-3 h-3 md:w-3.5 md:h-3.5", style.iconColor)} />
      <span>{data.text}</span>
    </div>
  );
}
