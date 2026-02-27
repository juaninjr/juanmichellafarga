import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter, Space_Mono } from 'next/font/google';
import { LanguageProvider } from '@/lib/context/LanguageContext';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  variable: '--font-spacemono',
  weight: ['400', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Juan Michel',
  description: 'Architecture · Music · Art — a dashboard of disciplines.',
  openGraph: {
    title: 'Juan Michel',
    description: 'Architecture · Music · Art — a dashboard of disciplines.',
    url: 'https://whoisjuanmichel.com',
    siteName: 'Juan Michel',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Juan Michel',
    description: 'Architecture · Music · Art — a dashboard of disciplines.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} ${spaceMono.variable}`}
    >
      <body className="bg-theme-bg text-theme-fg font-inter antialiased">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
