'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

import { Clock, TrendingUp, Sparkles, Dumbbell, Star, Zap, CreditCard, Check } from 'lucide-react';

import { type Service } from '@/data/content';

import { Button } from '@/components/ui/button';

import { cn } from '@/lib/utils';

import React from 'react';

import Link from 'next/link';



interface ServiceCardProps {

  service: Service;

  index: number;

}



export function ServiceCard({ service, index }: ServiceCardProps) {

  const isCoaching = service.category === 'Coaching';



  // 3D Tilt Logic (Simplified for performance)

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



  return (

    <motion.div

      initial={{ opacity: 0, y: 50 }}

      whileInView={{ opacity: 1, y: 0 }}

      viewport={{ once: true, margin: "-50px" }}

      transition={{ delay: index * 0.1, duration: 0.6, type: "spring" }}

      style={{ perspective: 1000 }}

      className="h-full flex flex-col"

    >

      <motion.div

        style={{ rotateX, rotateY }}

        onMouseMove={handleMouseMove}

        onMouseLeave={handleMouseLeave}

        className={cn(

          "group relative h-full bg-white rounded-[2rem] border p-8 flex flex-col overflow-hidden transition-all duration-300",

          "hover:shadow-2xl hover:shadow-slate-200",

          (isPopular || isBestValue) ? "border-2 shadow-lg scale-[1.02]" : "border-slate-100",

          (isPopular || isBestValue) && isCoaching ? "border-training/30 shadow-training/10" : "",

          (isPopular || isBestValue) && !isCoaching ? "border-care/30 shadow-care/10" : ""

        )}

      >

        {/* MARKETING BADGES */}

        {isPopular && (

          <div className="absolute top-0 right-0 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-bl-2xl flex items-center gap-1 z-20">

            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />

            Top Choix

          </div>

        )}

        {isBestValue && (

          <div className="absolute top-0 right-0 bg-gradient-to-r from-accent-mint to-teal-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-bl-2xl flex items-center gap-1 z-20">

            <Zap className="w-3 h-3 fill-white" />

            Best Value

          </div>

        )}



        {/* Gradient Blob Background on Hover */}

        <div 

            className="absolute -right-20 -top-20 w-64 h-64 rounded-full blur-[80px] opacity-0 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none"

            style={{ backgroundColor: accentColor }}

        />



        {/* Header */}

        <div className="relative z-10 flex justify-between items-start mb-6">

          <div className={cn("p-3 rounded-2xl text-white shadow-lg transition-transform group-hover:scale-110 duration-300", iconBg)}>

            <Icon className="w-6 h-6" />

          </div>

          {service.duration && (

            <div className="flex items-center text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full mt-1 mr-2">

              <Clock className="w-3 h-3 mr-1.5" />

              {service.duration}

            </div>

          )}

        </div>



        <div className="relative z-10 space-y-2 mb-6">

            <h3 className="text-2xl font-black text-slate-900 leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-slate-900 group-hover:to-slate-600 transition-all">

              {service.title}

            </h3>

            <div className="w-12 h-1 rounded-full bg-slate-100 group-hover:w-full transition-all duration-500" style={{ backgroundColor: isCoaching ? '#EFF6FF' : '#FFF1F2' }}>

                <div className="h-full w-0 group-hover:w-1/3 transition-all duration-700 delay-100 rounded-full" style={{ backgroundColor: accentColor }} />

            </div>

        </div>



                {/* Description */}



                {service.note && (



                  <div className="relative z-10 mb-4 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-xs font-bold flex items-center gap-2">



                     <span>{service.note}</span>



                  </div>



                )}



        



                <p className="relative z-10 text-slate-500 text-sm mb-8 flex-grow leading-relaxed font-medium">



                  {service.description}



                </p>



        



                {/* Features List (For SaaS/Premium offers) */}



                {service.features && (



                  <div className="relative z-10 mb-8 space-y-3">



                    {service.features.map((feature, i) => (



                      <div key={i} className="flex items-start gap-3">



                        <div className={cn("p-1 rounded-full shrink-0 mt-0.5", bgLight)}>



                          <Check className="w-3 h-3" style={{ color: accentColor }} />



                        </div>



                        <span className="text-sm text-slate-700">



                          {feature.includes('**') ? (



                            <span className="font-black text-slate-900">



                              {feature.replace(/\*\*/g, '')}



                            </span>



                          ) : (



                            <span className="font-semibold">{feature}</span>



                          )}



                        </span>



                      </div>



                    ))}



                  </div>



                )}



        



                {/* Objective Box (Only if no features list to avoid clutter) */}



                {service.objective && !service.features && (



                  <div className={cn("relative z-10 mb-8 p-4 rounded-xl border border-transparent group-hover:border-white/50 transition-colors", bgLight)}>



                    <div className="flex items-start gap-3">



                      <TrendingUp className="w-5 h-5 shrink-0 mt-0.5" style={{ color: accentColor }} />



                      <p className="text-sm text-slate-700 font-semibold italic">



                        {service.objective}



                      </p>



                    </div>



                  </div>



                )}



        



                {/* Footer with Price and Action */}



                <div className="relative z-10 mt-auto pt-6 border-t border-slate-100 flex flex-col gap-4">



                  <div className="flex items-center justify-between">



                     <div className="text-left">



                        {(service.originalPrice || isBestValue) && (



                            <span className="block text-xs text-slate-400 line-through decoration-red-400 decoration-2">



                                {service.originalPrice || (isBestValue ? '500 €' : '')}



                            </span>



                        )}



                        <span className={cn("text-2xl font-black tracking-tight", isBestValue ? "text-teal-600" : "text-slate-900")}>



                            {service.price}



                        </span>



                     </div>



                  </div>



        

          

          {service.paymentLink ? (

             <Button className="w-full rounded-xl font-bold tracking-wide shadow-lg hover:scale-[1.02] transition-transform" style={{ backgroundColor: accentColor }} asChild>

                <a href={service.paymentLink} target="_blank" rel="noopener noreferrer">

                   <CreditCard className="w-4 h-4 mr-2" />

                   {service.features ? 'Démarrer l\'essai' : 'Commander'}

                </a>

             </Button>

          ) : (

             <Button variant="outline" className="w-full rounded-xl font-bold tracking-wide border-slate-200 text-slate-600 hover:bg-slate-50" asChild>

                <Link href="#contact">

                   Réserver

                </Link>

             </Button>

          )}

        </div>

      </motion.div>

    </motion.div>

  );

}


