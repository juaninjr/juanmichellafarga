'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import type { PersonaSlug, SectionId } from '@/lib/personas';
import { PERSONAS, SECTION_LABELS } from '@/lib/personas';
import { PersonaSwitcher, LanguageToggle } from '@/components/PersonaSwitcher';

interface NavigationProps {
  mode: 'landing' | 'persona';
  persona?: PersonaSlug;
}

const EMAIL = 'juanmichellafarga@gmail.com';

export default function Navigation({ mode, persona }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false);
  const [showEmail, setShowEmail] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Visible sections for persona nav (non-hidden)
  // Architect: only show CV in nav, not Studio (studio fills the whole page)
  const navSections: SectionId[] = persona
    ? PERSONAS[persona].sections
        .filter((s) => s.variant !== 'hidden')
        .filter((s) => !(persona === 'architect' && s.id === 'studio'))
        .filter(() => persona !== 'artist')
        .sort((a, b) => a.order - b.order)
        .slice(0, 5)
        .map((s) => s.id)
    : [];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-theme-bg/95 backdrop-blur-sm border-b border-theme-border'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-content mx-auto px-6 md:px-10 h-14 flex items-center justify-between">
        {/* Brand */}
        <Link
          href="/"
          className="font-mono text-sm tracking-widest uppercase hover:text-theme-accent transition-colors"
        >
          Juan Michel
        </Link>

        {/* Center links (persona mode) */}
        {mode === 'persona' && persona && (
          <div className="hidden md:flex items-center gap-6">
            {navSections.map((id) =>
              // Architect CV → full /cv page, not scroll-to-anchor
              persona === 'architect' && id === 'cv' ? (
                <Link
                  key={id}
                  href="/cv"
                  className="text-xs tracking-wide text-theme-muted hover:text-theme-fg transition-colors"
                >
                  {SECTION_LABELS[id]}
                </Link>
              ) : (
                <a
                  key={id}
                  href={`#${id}`}
                  className="text-xs tracking-wide text-theme-muted hover:text-theme-fg transition-colors"
                >
                  {SECTION_LABELS[id]}
                </a>
              )
            )}
          </div>
        )}

        {/* Right side */}
        <div className="flex items-center gap-4">
          <LanguageToggle />
          {mode === 'persona' && persona && (
            <PersonaSwitcher currentSlug={persona} />
          )}
          {mode === 'landing' && (
            <div className="relative">
              <button
                onClick={() => setShowEmail((v) => !v)}
                className="text-xs font-mono tracking-wide text-theme-muted hover:text-theme-fg transition-colors"
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                Contact
              </button>
              {showEmail && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowEmail(false)} />
                  <div
                    className="absolute top-full right-0 mt-2 z-50"
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
          )}
        </div>
      </div>
    </nav>
  );
}
