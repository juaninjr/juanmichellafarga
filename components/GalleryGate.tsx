'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

// ─────────────────────────────────────────────────────────────────────────────
// TOGGLE: Set GALLERY_ENABLED to true when the gallery is ready to go live.
// When false, visitors see the COMING_SOON_MESSAGE below instead of the gallery.
// ─────────────────────────────────────────────────────────────────────────────
const GALLERY_ENABLED = false;

// Preview access — visit /artist?access=jm-preview-2026 to unlock.
// The key is saved to localStorage so the gallery stays unlocked on return visits.
const ACCESS_KEY = 'jm-preview-2026';
const STORAGE_KEY = 'jm_gallery_access';

// ─────────────────────────────────────────────────────────────────────────────
// COMING SOON MESSAGE — edit this string to change what blocked visitors see.
// ─────────────────────────────────────────────────────────────────────────────
const COMING_SOON_MESSAGE = 'The gallery is not yet set up, try in a few days.';

export default function GalleryGate({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState<boolean | null>(null);

  useEffect(() => {
    if (GALLERY_ENABLED) { setUnlocked(true); return; }

    // Check URL param — e.g. /artist?access=jm-preview-2026
    const params = new URLSearchParams(window.location.search);
    if (params.get('access') === ACCESS_KEY) {
      localStorage.setItem(STORAGE_KEY, ACCESS_KEY);
      setUnlocked(true);
      return;
    }

    // Check previously stored key
    if (localStorage.getItem(STORAGE_KEY) === ACCESS_KEY) {
      setUnlocked(true);
      return;
    }

    setUnlocked(false);
  }, []);

  // Neutral loading state — show background while checking
  if (unlocked === null) {
    return <div className="min-h-screen" style={{ backgroundColor: '#f8f7f3' }} />;
  }

  // Unlocked — show the actual gallery
  if (unlocked) return <>{children}</>;

  // Blocked — coming soon page
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ backgroundColor: '#f8f7f3', color: '#1a1a18' }}
    >
      <div style={{ maxWidth: '440px' }}>
        <p
          className="font-mono uppercase mb-6"
          style={{ fontSize: '0.55rem', letterSpacing: '0.3em', color: '#aaa' }}
        >
          The Artist
        </p>
        <h1
          className="font-black uppercase mb-6"
          style={{ fontSize: 'clamp(1.8rem, 6vw, 3.2rem)', letterSpacing: '-0.03em', lineHeight: 1.05, color: '#1a1a18' }}
        >
          Coming Soon
        </h1>
        <p
          className="leading-relaxed mb-10"
          style={{ fontSize: '0.9rem', color: '#666' }}
        >
          {COMING_SOON_MESSAGE}
        </p>
        <Link
          href="/architect"
          className="font-mono uppercase inline-block"
          style={{ fontSize: '0.6rem', letterSpacing: '0.2em', padding: '10px 26px', border: '1px solid #1a1a18', color: '#1a1a18', textDecoration: 'none' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = '#1a1a18'; (e.currentTarget as HTMLElement).style.color = '#f8f7f3'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#1a1a18'; }}
        >
          Try the architecture portfolio →
        </Link>
      </div>
    </div>
  );
}
