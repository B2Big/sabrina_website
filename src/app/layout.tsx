import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CONTACT_INFO } from "@/data/content";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Sabrina Coaching & Massage | Bien-être dans le Var (83)",
  description: "Coaching sportif personnalisé et massages bien-être (Madérothérapie, Californien, Sportif) dans le Var. Retrouvez votre équilibre corps et esprit.",
  keywords: ["coaching sportif", "massage var", "madérothérapie", "bien-être 83", "coach sportif domicile", "massage drainage lymphatique"],
  authors: [{ name: "Sabrina" }],
  creator: "Sabrina",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://sabrina-coaching-massage.fr", // À remplacer par l'URL finale
    title: "Sabrina Coaching & Massage | Bien-être dans le Var",
    description: "Coaching sportif et massages bien-être pour harmoniser corps et esprit.",
    siteName: "Sabrina Coaching & Massage",
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
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-stone-50 text-stone-900`}>
        {children}
      </body>
    </html>
  );
}