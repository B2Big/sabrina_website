'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Clock, TrendingUp, Sparkles, Dumbbell, Star, Zap, Check, Plus, Minus, CreditCard, ShoppingCart, Flame } from 'lucide-react';
import { type Service } from '@/data/content';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import React from 'react';
import { useCart } from '@/context/cart-context';

interface ServiceCardProps {
  service: Service;
  index: number;
}

// 🔥 Calcule l'économie en euros entre originalPrice et price
function calcEconomie(price: string, originalPrice?: string): number | null {
  if (!originalPrice) return null;
  const p = parseInt(price.replace(/\s/g, '').replace(/[^0-9]/g, '')) || 0;
  const o = parseInt(originalPrice.replace(/\s/g, '').replace(/[^0-9]/g, '')) || 0;
  return o > p ? o - p : null;
}

export function ServiceCard({ service, index }: ServiceCardProps) {
  const isCoaching = service.category === 'Coaching';
  const { items, addToCart, removeFromCart } = useCart();
  const cartItem = items.find(i => i.id === service.id);
  const quantity = cartItem?.quantity || 0;

  // 3D Tilt Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => { x.set(0); y.set(0); };

  // Styles
  const accentColor = isCoaching ? "var(--color-training)" : "var(--color-care)";
  const bgLight = isCoaching ? "bg-training-light" : "bg-care-light";
  const iconBg = isCoaching ? "bg-training" : "bg-care";
  const Icon = isCoaching ? Dumbbell : Sparkles;

  // Marketing Badges
  const isPopular = service.popular;
  const isBestValue = service.bestValue;
  const economie = calcEconomie(service.price, service.originalPrice);

  // 💳 Klarna 3x — visible si prix >= 35€
  const numericPrice = parseInt(service.price.replace(/\s/g, '').replace(/[^0-9]/g, '')) || 0;
  const showKlarna = numericPrice >= 35;

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.92 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.08, duration: 0.5, type: "spring", stiffness: 120 }}
      style={{ perspective: 1000 }}
      className="h-full flex flex-col"
    >
      <motion.div
        style={{ rotateX, rotateY }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "group relative h-full bg-white p-3 md:p-5 lg:p-8 flex flex-col overflow-hidden transition-all duration-300 sketch-card",
          (isPopular || isBestValue)
            ? "border-[3px] z-10"
            : "",
          (isPopular || isBestValue) && isCoaching ? "border-blue-600 shadow-[0_0_30px_rgba(37,99,235,0.35)]" : "",
          (isPopular || isBestValue) && !isCoaching ? "border-rose-600 shadow-[0_0_30px_rgba(225,29,72,0.35)]" : ""
        )}
      >

        {/* MARKETING BADGES — PLUS AGRESSIFS */}
        {isPopular && (
          <div className="absolute top-0 right-0 bg-gradient-to-r from-indigo-400 to-purple-400 text-white text-[11px] font-black uppercase tracking-widest px-5 py-2.5 rounded-bl-2xl flex items-center gap-1.5 z-20 shadow-lg">
            <Star className="w-3.5 h-3.5 text-yellow-200 fill-yellow-200 animate-pulse" />
            Top Choix
          </div>
        )}
        {isBestValue && (
          <div className="absolute top-0 right-0 bg-gradient-to-r from-emerald-300 to-teal-300 text-white text-[11px] font-black uppercase tracking-widest px-5 py-2.5 rounded-bl-2xl flex items-center gap-1.5 z-20 shadow-lg">
            <Zap className="w-3.5 h-3.5 fill-white animate-pulse" />
            Best Value
          </div>
        )}

        {/* Gradient Blob Background on Hover */}
        <div 
            className="absolute -right-20 -top-20 w-64 h-64 rounded-full blur-[80px] opacity-0 group-hover:opacity-50 transition-opacity duration-500 pointer-events-none"
            style={{ backgroundColor: accentColor }}
        />

        {/* Header */}
        <div className="relative z-10 flex justify-between items-start mb-2 md:mb-4 lg:mb-6">
          <div className={cn("p-2 md:p-3 lg:p-3.5 rounded-xl md:rounded-2xl text-white shadow-xl transition-transform group-hover:scale-110 duration-300", iconBg)}>
            <Icon className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7" />
          </div>
          {service.duration && (
            <div className="flex items-center text-[9px] md:text-xs font-black uppercase tracking-wider text-slate-500 bg-slate-100 px-2 md:px-4 py-1 md:py-2 rounded-full mt-1 mr-1 md:mr-2 border border-slate-200">
              <Clock className="w-3 h-3 md:w-3.5 md:h-3.5 mr-1 md:mr-1.5" />
              {service.duration}
            </div>
          )}
        </div>

        <div className="relative z-10 space-y-1 md:space-y-2 mb-2 md:mb-3 lg:mb-4">
            <h3 className="text-base md:text-xl lg:text-2xl font-black text-slate-900 leading-tight line-clamp-2 md:line-clamp-none group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-slate-900 group-hover:to-slate-600 transition-all">
              {service.title}
            </h3>
            <div className="hidden md:block w-16 h-1.5 rounded-full bg-slate-100 group-hover:w-full transition-all duration-500" style={{ backgroundColor: isCoaching ? '#EFF6FF' : '#FFF1F2' }}>
                <div className="h-full w-0 group-hover:w-1/3 transition-all duration-700 delay-100 rounded-full" style={{ backgroundColor: accentColor }} />
            </div>
        </div>

        {/* 💰 BADGE ÉCONOMIE — AGRESSIF */}
        {economie && economie > 0 && (
          <div className="relative z-10 mb-2 md:mb-3 lg:mb-4">
            <div className="inline-flex items-center gap-1 bg-red-50 border border-red-200 md:border-2 rounded-lg md:rounded-xl px-2 md:px-3 py-1 md:py-1.5 shadow-sm">
              <Flame className="w-3 h-3 md:w-3.5 md:h-3.5 text-red-500 animate-pulse" />
              <span className="text-[11px] md:text-xs font-black text-red-600 uppercase tracking-wide">
                -{economie}€
              </span>
            </div>
          </div>
        )}

        {/* Description */}
        {service.note && (
          <div className="relative z-10 mb-2 md:mb-3 lg:mb-4 px-2 md:px-3 py-1 md:py-2 bg-amber-50 border border-amber-200 md:border-2 rounded-lg md:rounded-xl text-amber-900 text-[8px] md:text-xs font-black flex items-center gap-1.5 md:gap-2 shadow-sm">
             <span>{service.note}</span>
          </div>
        )}

        <p className="relative z-10 text-slate-500 text-xs md:text-sm mb-2 md:mb-8 flex-grow leading-relaxed font-semibold">
          {service.description}
        </p>

        {/* Features List */}
        {service.features && (
          <div className="relative z-10 mb-2 md:mb-4 lg:mb-8 space-y-1 md:space-y-2 lg:space-y-3">
            {service.features.slice(0, 3).map((feature, i) => (
              <div key={i} className="flex items-start gap-1.5 md:gap-2 lg:gap-3">
                <div className={cn("p-0.5 md:p-1 rounded-full shrink-0 mt-0.5 shadow-sm", bgLight)}>
                  <Check className="w-3 h-3 md:w-3.5 md:h-3.5" style={{ color: accentColor }} />
                </div>
                <span className="text-[10px] md:text-xs lg:text-sm text-slate-700">
                  {feature.includes('**') ? (
                    <span className="font-black text-slate-900">
                      {feature.replace(/\*\*/g, '')}
                    </span>
                  ) : (
                    <span className="font-bold">{feature}</span>
                  )}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Objective Box */}
        {service.objective && !service.features && (
          <div className={cn("relative z-10 mb-2 md:mb-4 lg:mb-8 p-2 md:p-3 lg:p-4 rounded-lg md:rounded-xl border-2 border-transparent group-hover:border-white/50 transition-colors shadow-sm", bgLight)}>
            <div className="flex items-start gap-1.5 md:gap-2 lg:gap-3">
              <TrendingUp className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 shrink-0 mt-0.5" style={{ color: accentColor }} />
              <p className="text-[10px] md:text-xs lg:text-sm text-slate-700 font-bold italic line-clamp-2">
                {service.objective}
              </p>
            </div>
          </div>
        )}

        {/* Footer with Price and Action */}
        <div className="relative z-10 mt-auto pt-2 md:pt-4 lg:pt-6 border-t-2 border-slate-100 flex flex-col gap-2 md:gap-3 lg:gap-4">
          <div className="text-left">
             {service.originalPrice && (
                 <div className="flex items-center gap-1 md:gap-2 mb-0.5 md:mb-1">
                     <span className="text-[10px] md:text-sm text-slate-400 line-through decoration-red-500 decoration-[3px] font-bold">
                         {service.originalPrice}
                     </span>
                     {economie && economie > 0 && (
                         <span className="text-[8px] md:text-[10px] font-black text-red-600 bg-red-50 border border-red-200 px-1 py-0.5 rounded">
                             -{economie}€
                         </span>
                     )}
                 </div>
             )}
             <div className="flex items-center gap-2 flex-wrap">
               <span className={cn("text-xl md:text-2xl lg:text-3xl font-black tracking-tight", isBestValue ? "text-teal-600" : "text-slate-900")}>
                   {service.price}
               </span>
               {showKlarna && (
                   <span className="inline-flex items-center gap-1 md:gap-1.5 text-[7px] md:text-xs font-black text-white bg-gradient-to-r from-rose-300 to-pink-400 px-1.5 md:px-3 py-0.5 md:py-1.5 rounded-full shadow-lg shadow-rose-300/30">
                       <CreditCard className="w-2.5 h-2.5 md:w-3.5 md:h-3.5" />
                       3x sans frais
                   </span>
               )}
             </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
             {quantity > 0 ? (
                <div className="flex items-center gap-2 md:gap-3 w-full">
                    <Button 
                        size="icon"
                        variant="outline"
                        className="rounded-lg md:rounded-xl h-10 w-10 md:h-14 md:w-14 border-slate-200 hover:bg-slate-50"
                        onClick={() => removeFromCart(service.id)}
                    >
                        <Minus className="w-4 h-4 md:w-5 md:h-5" />
                    </Button>
                    <span className="font-black text-xl md:text-2xl flex-1 text-center">{quantity}</span>
                    <Button 
                        size="icon"
                        className="rounded-lg md:rounded-xl h-10 w-10 md:h-14 md:w-14 text-white shadow-lg hover:scale-110 transition-transform"
                        style={{ backgroundColor: accentColor }}
                        onClick={() => addToCart(service)}
                    >
                        <Plus className="w-4 h-4 md:w-5 md:h-5" />
                    </Button>
                </div>
             ) : (
          <Button 
            className={cn(
              "w-full sketch-button font-black tracking-wide text-white h-9 md:h-14 text-[11px] md:text-base px-2 md:px-4",
              isPopular && "animate-pulse",
              isBestValue && ""
            )} 
            style={{ backgroundColor: accentColor }} 
            onClick={() => addToCart(service)}
          >
             <ShoppingCart className="w-3.5 h-3.5 md:w-5 md:h-5 mr-1 md:mr-2" />
             <span className="hidden md:inline">AJOUTER AU PANIER</span>
             <span className="md:hidden">Ajouter</span>
          </Button>
             )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
