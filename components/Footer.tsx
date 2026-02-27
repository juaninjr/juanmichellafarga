'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { PersonaSlug } from '@/lib/personas';

const EMAIL = 'juanmichellafarga@gmail.com';

interface FooterProps {
  persona?: PersonaSlug;
}

export default function Footer({}: FooterProps) {
  const [showEmail, setShowEmail] = useState(false);

  return (
    <footer className="border-t border-theme-border mt-20">
      <div className="max-w-content mx-auto px-6 md:px-10 py-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="font-mono text-sm text-theme-fg">Juan Michel</p>
            <p className="text-xs text-theme-muted mt-1">
              Architecture · Music · Art
            </p>
          </div>

          <div className="flex items-center gap-6">
            {/* Spotify */}
            <a
              href="https://open.spotify.com/artist/5GodXx8Ksi0sI9nr4CJAle?si=0r2M6b0PS_OLDpI46gDbLA"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-theme-muted hover:text-theme-fg transition-colors font-mono"
            >
              Spotify
            </a>

            {/* Email — shows popup on click */}
            <div className="relative">
              <button
                onClick={() => setShowEmail((v) => !v)}
                className="text-xs text-theme-muted hover:text-theme-fg transition-colors font-mono"
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                Email
              </button>
              {showEmail && (
                <>
                  {/* Backdrop to close */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowEmail(false)}
                  />
                  <div
                    className="absolute bottom-full right-0 mb-2 z-50"
                    style={{
                      backgroundColor: 'var(--color-bg)',
                      border: '1px solid var(--color-border)',
                      padding: '10px 14px',
                      whiteSpace: 'nowrap',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                    }}
                  >
                    <p className="font-mono text-xs" style={{ color: 'var(--color-fg)' }}>
                      {EMAIL}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-theme-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <p className="text-xs text-theme-muted font-mono">
            © {new Date().getFullYear()} Juan Michel
          </p>
          <Link
            href="/"
            className="text-xs text-theme-muted hover:text-theme-fg transition-colors font-mono"
          >
            Full dashboard →
          </Link>
        </div>
      </div>
    </footer>
  );
}
