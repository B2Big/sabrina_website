import Image from 'next/image';
import { ComponentProps } from 'react';

interface OptimizedImageProps extends Omit<ComponentProps<typeof Image>, 'src' | 'alt'> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
  quality?: number;
  className?: string;
  caption?: string;
}

/**
 * Composant Image optimisé pour SEO et accessibilité
 * 
 * Règles appliquées:
 * - Alt descriptif obligatoire
 * - Loading lazy par défaut (sauf si priority=true)
 * - Sizes responsive pour optimisation mobile
 * - Quality ajustée (80% par défaut pour équilibre qualité/poids)
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quality = 80,
  className = '',
  caption,
  ...props
}: OptimizedImageProps) {
  // Validation: alt ne doit pas être vide pour l'accessibilité
  if (!alt || alt.trim() === '') {
    console.warn(`⚠️ Image sans alt descriptif: ${src}`);
  }

  return (
    <figure className={className}>
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        priority={priority}
        loading={priority ? 'eager' : 'lazy'}
        sizes={sizes}
        quality={quality}
        {...props}
      />
      {caption && (
        <figcaption className="sr-only">{caption}</figcaption>
      )}
    </figure>
  );
}

/**
 * Génère un alt text SEO-friendly pour les images de services
 */
export function generateServiceAlt(
  serviceName: string,
  serviceType: 'coaching' | 'massage',
  location: string = 'dans le Var'
): string {
  const action = serviceType === 'coaching' ? 'séance de' : 'massage';
  return `${action} ${serviceName} ${location} - Sab-Fit Coaching & Massage`;
}

/**
 * Génère un alt text pour les photos de la galerie
 */
export function generateGalleryAlt(
  index: number,
  activity: string
): string {
  const activities = [
    'coaching fitness personnalisé',
    'massage bien-être et récupération',
    'séance de sport à domicile',
    'massage madérothérapie sculptant',
    'entraînement physique sur mesure',
    'relaxation et détente profonde',
    'préparation physique complète',
    'drainage lymphatique détoxifiant',
    'coaching remise en forme',
    'massage sportif récupération',
    'bien-être et équilibre corps-esprit'
  ];
  
  const activity_text = activities[index % activities.length] || activity;
  return `Sabrina - ${activity_text} dans le Var (83)`;
}
