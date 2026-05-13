'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Clock, TrendingUp, Sparkles, Dumbbell, Star, Zap, Check, Plus, Minus, CreditCard, ShoppingCart, Flame } from 'lucide-react';
import { ScarcityBadge } from './scarcity-badge';
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
          "group relative h-full bg-white rounded-[10px] p-5 md:p-8 flex flex-col overflow-hidden transition-all duration-300",
          (isPopular || isBestValue)
            ? "border-[3px] scale-[1.03]"
            : "border-2",
          (isPopular || isBestValue) && isCoaching ? "border-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.4)]" : "",
          (isPopular || isBestValue) && !isCoaching ? "border-rose-600 shadow-[0_0_20px_rgba(225,29,72,0.4)]" : "",
          !isPopular && !isBestValue ? "border-slate-500 shadow-md hover:shadow-xl hover:border-slate-600" : ""
        )}
      >

        {/* MARKETING BADGES — PLUS AGRESSIFS */}
        {isPopular && (
          <div className="absolute top-0 right-0 bg-gradient-to-r from-slate-900 to-slate-700 text-white text-[11px] font-black uppercase tracking-widest px-5 py-2.5 rounded-bl-2xl flex items-center gap-1.5 z-20 shadow-lg">
            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 animate-pulse" />
            Top Choix
          </div>
        )}
        {isBestValue && (
          <div className="absolute top-0 right-0 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[11px] font-black uppercase tracking-widest px-5 py-2.5 rounded-bl-2xl flex items-center gap-1.5 z-20 shadow-lg">
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
        <div className="relative z-10 flex justify-between items-start mb-4 md:mb-6">
          <div className={cn("p-3.5 rounded-2xl text-white shadow-xl transition-transform group-hover:scale-110 duration-300", iconBg)}>
            <Icon className="w-7 h-7" />
          </div>
          {service.duration && (
            <div className="flex items-center text-xs font-black uppercase tracking-wider text-slate-500 bg-slate-100 px-4 py-2 rounded-full mt-1 mr-2 border border-slate-200">
              <Clock className="w-3.5 h-3.5 mr-1.5" />
              {service.duration}
            </div>
          )}
        </div>

        <div className="relative z-10 space-y-2 mb-3 md:mb-4">
            <h3 className="text-xl md:text-2xl font-black text-slate-900 leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-slate-900 group-hover:to-slate-600 transition-all">
              {service.title}
            </h3>
            <ScarcityBadge serviceId={service.id} category={service.category} />
            <div className="w-16 h-1.5 rounded-full bg-slate-100 group-hover:w-full transition-all duration-500" style={{ backgroundColor: isCoaching ? '#EFF6FF' : '#FFF1F2' }}>
                <div className="h-full w-0 group-hover:w-1/3 transition-all duration-700 delay-100 rounded-full" style={{ backgroundColor: accentColor }} />
            </div>
        </div>

        {/* 💰 BADGE ÉCONOMIE — AGRESSIF */}
        {economie && economie > 0 && (
          <div className="relative z-10 mb-3 md:mb-4">
            <div className="inline-flex items-center gap-1.5 bg-red-50 border-2 border-red-200 rounded-xl px-3 py-1.5 shadow-sm">
              <Flame className="w-3.5 h-3.5 text-red-500 animate-pulse" />
              <span className="text-xs font-black text-red-600 uppercase tracking-wide">
                Économisez {economie} €
              </span>
            </div>
          </div>
        )}

        {/* Description */}
        {service.note && (
          <div className="relative z-10 mb-3 md:mb-4 px-3 py-2 bg-amber-50 border-2 border-amber-200 rounded-xl text-amber-900 text-[10px] md:text-xs font-black flex items-center gap-2 shadow-sm">
             <span>{service.note}</span>
          </div>
        )}

        <p className="relative z-10 text-slate-500 text-sm mb-4 md:mb-8 flex-grow leading-relaxed font-semibold line-clamp-3 md:line-clamp-none">
          {service.description}
        </p>

        {/* Features List */}
        {service.features && (
          <div className="relative z-10 mb-4 md:mb-8 space-y-2 md:space-y-3">
            {service.features.slice(0, 3).map((feature, i) => (
              <div key={i} className="flex items-start gap-2 md:gap-3">
                <div className={cn("p-1 rounded-full shrink-0 mt-0.5 shadow-sm", bgLight)}>
                  <Check className="w-3.5 h-3.5" style={{ color: accentColor }} />
                </div>
                <span className="text-xs md:text-sm text-slate-700">
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
          <div className={cn("relative z-10 mb-4 md:mb-8 p-3 md:p-4 rounded-xl border-2 border-transparent group-hover:border-white/50 transition-colors shadow-sm", bgLight)}>
            <div className="flex items-start gap-2 md:gap-3">
              <TrendingUp className="w-4 h-4 md:w-5 md:h-5 shrink-0 mt-0.5" style={{ color: accentColor }} />
              <p className="text-xs md:text-sm text-slate-700 font-bold italic">
                {service.objective}
              </p>
            </div>
          </div>
        )}

        {/* Footer with Price and Action */}
        <div className="relative z-10 mt-auto pt-4 md:pt-6 border-t-2 border-slate-100 flex flex-col gap-3 md:gap-4">
          <div className="flex items-center justify-between">
             <div className="text-left">
                {service.originalPrice && (
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm text-slate-400 line-through decoration-red-500 decoration-[3px] font-bold">
                            {service.originalPrice}
                        </span>
                        {economie && economie > 0 && (
                            <span className="text-[10px] font-black text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded">
                                -{economie}€
                            </span>
                        )}
                    </div>
                )}
                <span className={cn("text-3xl font-black tracking-tight", isBestValue ? "text-teal-600" : "text-slate-900")}>
                    {service.price}
                </span>
                {showKlarna && (
                    <span className="mt-2 block inline-flex items-center gap-1.5 text-xs font-black text-white bg-gradient-to-r from-pink-500 to-rose-500 px-3 py-1.5 rounded-full shadow-lg shadow-pink-500/30">
                        <CreditCard className="w-3.5 h-3.5" />
                        3x sans frais
                    </span>
                )}
             </div>
          </div>

          <div className="flex items-center gap-3">
             {quantity > 0 ? (
                <div className="flex items-center gap-3 w-full">
                    <Button 
                        size="icon"
                        variant="outline"
                        className="rounded-xl h-14 w-14 border-slate-200 hover:bg-slate-50"
                        onClick={() => removeFromCart(service.id)}
                    >
                        <Minus className="w-5 h-5" />
                    </Button>
                    <span className="font-black text-2xl flex-1 text-center">{quantity}</span>
                    <Button 
                        size="icon"
                        className="rounded-xl h-14 w-14 text-white shadow-lg hover:scale-110 transition-transform"
                        style={{ backgroundColor: accentColor }}
                        onClick={() => addToCart(service)}
                    >
                        <Plus className="w-5 h-5" />
                    </Button>
                </div>
             ) : (
          <Button 
            className={cn(
              "w-full rounded-2xl font-black tracking-wide shadow-xl hover:shadow-2xl hover:scale-[1.03] active:scale-[0.98] transition-all text-white h-14 text-base",
              isPopular && "animate-pulse shadow-yellow-500/20",
              isBestValue && "shadow-emerald-500/20"
            )} 
            style={{ backgroundColor: accentColor }} 
            onClick={() => addToCart(service)}
          >
             <ShoppingCart className="w-5 h-5 mr-2" />
             AJOUTER AU PANIER
          </Button>
             )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
