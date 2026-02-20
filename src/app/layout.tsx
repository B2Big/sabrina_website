import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { MobileNav } from "@/components/mobile-nav";
import InstallPrompt from "@/components/pwa/InstallPrompt";
import { CartProvider } from "@/context/cart-context";
import { Toaster } from "sonner";
import { StructuredData } from "@/components/json-ld";

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter",
  display: 'swap', // Optimisation: chargement asynchrone des polices
  preload: true,
});

const playfair = Playfair_Display({ 
  subsets: ["latin"], 
  variable: "--font-playfair",
  display: 'swap',
  preload: true,
});

export const viewport: Viewport = {
  themeColor: "#3B82F6",
  width: "device-width",
  initialScale: 1,
  // Note: userScalable=false pour expérience PWA app-like
  // Les utilisateurs peuvent toujours zoomer avec les paramètres d'accessibilité
  userScalable: false,
  viewportFit: 'cover', // Pour les appareils avec encoche
};

export const metadata: Metadata = {
  metadataBase: new URL('https://sab-fit.com'),
  title: "Sab-Fit | Coaching Fitness & Massage Var (83) - Domicile",
  description: "Coaching sportif personnalisé et massages bien-être à domicile dans le Var (83). Sab-Fit : programmes fitness sur mesure, madérothérapie, récupération sportive.",
  keywords: ["coaching sportif var", "massage bien-être 83", "coach fitness domicile", "madérothérapie var", "préparation physique", "récupération sportive", "massage drainant", "bien-être toulon"],
  authors: [{ name: "Sabrina" }],
  creator: "Sabrina",
  publisher: "Sab-Fit",
  manifest: "/manifest.json",
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
    shortcut: "/logo.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Sab-Fit",
    startupImage: "/img/sabrina/sab.webp",
  },
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://sab-fit.com",
    title: "Sab-Fit Coaching & Massage | Bien-être dans le Var",
    description: "Coaching sportif et massages bien-être pour harmoniser corps et esprit.",
    siteName: "Sab-Fit Coaching & Massage",
    images: [
      {
        url: "/img/sabrina/sab.webp",
        width: 1200,
        height: 1500,
        alt: "Sab-Fit Coaching & Massage bien-être dans le Var",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sab-Fit | Coaching Fitness & Massage Var (83)",
    description: "Coaching sportif personnalisé et massages bien-être à domicile dans le Var (83).",
    images: ["/img/sabrina/sab.webp"],
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
  alternates: {
    canonical: 'https://sab-fit.com',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <head>
        <StructuredData />
        {/* Preconnect pour les ressources externes - optimisation mobile */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://api.stripe.com" />
        <link rel="dns-prefetch" href="https://js.stripe.com" />
      </head>
      <body 
        suppressHydrationWarning={true} 
        className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-stone-50 text-stone-900`}
      >
        {/* Skip to main content - Accessibilité clavier */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-slate-900 focus:text-white focus:rounded-lg"
        >
          Aller au contenu principal
        </a>
        
        <CartProvider>
          <main id="main-content">
            {children}
          </main>
          <InstallPrompt />
          <MobileNav />
          <Toaster position="top-center" />
        </CartProvider>
      </body>
    </html>
  );
}
