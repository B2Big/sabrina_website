import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CONTACT_INFO } from "@/data/content";
import { MobileNav } from "@/components/mobile-nav";
import InstallPrompt from "@/components/pwa/InstallPrompt";

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
  title: "Sabrina Coaching & Massage | Bien-être dans le Var (83)",
  description: "Coaching sportif personnalisé et massages bien-être (Madérothérapie, Californien, Sportif) dans le Var. Retrouvez votre équilibre corps et esprit.",
  keywords: ["coaching sportif", "massage var", "madérothérapie", "bien-être 83", "coach sportif domicile", "massage drainage lymphatique"],
  authors: [{ name: "Sabrina" }],
  creator: "Sabrina",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Sabrina Run",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://sabrina-coaching-massage.fr", // À remplacer par l'URL finale
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
    "@type": "LocalBusiness",
    "name": "Sabrina Coaching & Massage",
    "image": "https://sabrina-coaching-massage.fr/logo.png", // À définir
    "telephone": CONTACT_INFO.phone,
    "email": CONTACT_INFO.email,
    "address": {
      "@type": "PostalAddress",
      "addressRegion": "Var",
      "addressCountry": "FR"
    },
    "url": "https://sabrina-coaching-massage.fr",
    "priceRange": "€€",
    "description": "Services de coaching sportif et massages bien-être dans le Var."
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
        {children}
        <InstallPrompt />
        <MobileNav />
      </body>
    </html>
  );
}