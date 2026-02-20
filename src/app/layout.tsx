import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CONTACT_INFO } from "@/data/content";
import { MobileNav } from "@/components/mobile-nav";
import InstallPrompt from "@/components/pwa/InstallPrompt";
import { CartProvider } from "@/context/cart-context";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const viewport: Viewport = {
  themeColor: "#3B82F6",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // App-like feel
};

export const metadata: Metadata = {
  metadataBase: new URL('https://sabrina-coaching-massage.fr'),
  title: "Sab-Fit | Coaching Fitness & Massage Var (83) - Domicile",
  description: "Coaching sportif personnalisé et massages bien-être à domicile dans le Var (83). Sab-Fit : programmes fitness sur mesure, madérothérapie, récupération sportive.",
  keywords: ["coaching sportif var", "massage bien-être 83", "coach fitness domicile", "madérothérapie var", "préparation physique", "récupération sportive", "massage drainant", "bien-être toulon"],
  authors: [{ name: "Sabrina" }],
  creator: "Sabrina",
  manifest: "/manifest.json",
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Sabrina",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://sabrina-coaching-massage.fr",
    title: "Sabrina Coaching & Massage | Bien-être dans le Var",
    description: "Coaching sportif et massages bien-être pour harmoniser corps et esprit.",
    siteName: "Sabrina Coaching & Massage",
    images: [
      {
        url: "/img/sabrina/sabrina-1.jpg",
        width: 1200,
        height: 1500,
        alt: "Sabrina Coaching & Wellness",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "SportsActivityLocation"],
    "name": "Sab-Fit Coaching & Massage",
    "alternateName": "Sabrina Coaching Sportif Var",
    "image": ["https://sabrina-coaching-massage.fr/img/sabrina/sab.webp", "https://sabrina-coaching-massage.fr/logo.svg"],
    "telephone": CONTACT_INFO.phone,
    "email": CONTACT_INFO.email,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Domicile ou Cabinet sur le Var",
      "addressLocality": "Toulon",
      "addressRegion": "Provence-Alpes-Côte d'Azur",
      "postalCode": "83000",
      "addressCountry": "FR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 43.1242,
      "longitude": 5.9280
    },
    "url": "https://sabrina-coaching-massage.fr",
    "priceRange": "€€",
    "description": "Coaching sportif personnalisé et massages bien-être à domicile dans le Var (83). Programmes fitness, perte de poids, récupération sportive.",
    "areaServed": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": 43.1242,
        "longitude": 5.9280
      },
      "geoRadius": 50000
    },
    "serviceType": ["Coaching Sportif", "Massage Bien-être", "Préparation Physique", "Récupération Sportive"],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Services Sab-Fit",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Coaching Sportif Personnalisé"
          }
        },
        {
          "@type": "Offer", 
          "itemOffered": {
            "@type": "Service",
            "name": "Massage Madérothérapie"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service", 
            "name": "Massage Sportif"
          }
        }
      ]
    }
  };

  return (
    <html lang="fr" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning={true} className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-stone-50 text-stone-900`}>
        <CartProvider>
          {children}
          <InstallPrompt />
          <MobileNav />
          <Toaster position="top-center" />
        </CartProvider>
      </body>
    </html>
  );
}
