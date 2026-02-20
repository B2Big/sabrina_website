import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { MobileNav } from "@/components/mobile-nav";
import InstallPrompt from "@/components/pwa/InstallPrompt";
import { CartProvider } from "@/context/cart-context";
import { Toaster } from "sonner";
import { StructuredData } from "@/components/json-ld";

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
  metadataBase: new URL('https://sab-fit.com'),
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
  return (
    <html lang="fr" className="scroll-smooth">
      <head>
        <StructuredData />
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
