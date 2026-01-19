'use client';

import { motion } from 'framer-motion';
import { Clock, TrendingUp } from 'lucide-react';
import { type Service } from '@/data/content';
import { Button } from '@/components/ui/button';

interface ServiceCardProps {
  service: Service;
  index: number;
}

export function ServiceCard({ service, index }: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group relative h-full bg-warrior-dark border border-white/5 hover:border-warrior-red/50 rounded-xl overflow-hidden transition-colors duration-300"
    >
      {/* Hover Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-warrior-red/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative p-6 flex flex-col h-full">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-warrior-red uppercase tracking-wider">
              {service.category}
            </span>
            <h3 className="text-xl font-bold text-white group-hover:text-warrior-red transition-colors">
              {service.title}
            </h3>
          </div>
          {service.duration && (
            <div className="flex items-center text-xs text-gray-500 bg-white/5 px-2 py-1 rounded">
              <Clock className="w-3 h-3 mr-1" />
              {service.duration}
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-400 text-sm mb-6 flex-grow">
          {service.description}
        </p>

        {/* Objective */}
        {service.objective && (
          <div className="mb-6 bg-warrior-black/50 p-3 rounded-lg border-l-2 border-warrior-red/30">
            <div className="flex items-start gap-2">
              <TrendingUp className="w-4 h-4 text-warrior-red shrink-0 mt-0.5" />
              <p className="text-xs text-gray-300 italic">
                &quot;{service.objective}&quot;
              </p>
            </div>
          </div>
        )}

        {/* Price & Action */}
        <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
          <span className="text-lg font-bold text-white">
            {service.price}
          </span>
          <Button variant="ghost" size="sm" className="text-xs hover:text-warrior-red">
             Réserver
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
