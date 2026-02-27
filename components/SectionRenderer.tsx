import Link from 'next/link';
import type { PersonaConfig, PersonaSlug, SectionId, SectionVariant } from '@/lib/personas';
import {
  studioProjects,
  cvEntries,
  courses,
  musicProjects,
  performances,
  artPieces,
} from '@/lib/content';

import StudioSection from '@/components/sections/StudioSection';
import CVSection from '@/components/sections/CVSection';
import CoursesSection from '@/components/sections/CoursesSection';
import ClientMusicSection from '@/components/sections/ClientMusicSection';
import PerformancesSection from '@/components/sections/PerformancesSection';
import ArtSection from '@/components/sections/ArtSection';
import VarsityPopup from '@/components/VarsityPopup';

interface SectionRendererProps {
  config: PersonaConfig;
}

function getVariant(config: PersonaConfig, id: SectionId): SectionVariant {
  return config.sections.find((s) => s.id === id)?.variant ?? 'hidden';
}

export default function SectionRenderer({ config }: SectionRendererProps) {
  const ordered = [...config.sections].sort((a, b) => a.order - b.order);
  const persona = config.slug as PersonaSlug;
  const isMusician = persona === 'musician';

  // For musician persona, render LIVE + STUDIO side-by-side
  if (isMusician) {
    const perfVariant = getVariant(config, 'performances');
    const musicVariant = getVariant(config, 'client-music');

    return (
      <div>
        {/* ── Musician nav bar: desktop back-to-dashboard + mobile section tabs ── */}
        <div
          className="flex items-center border-b border-theme-border"
          style={{ backgroundColor: 'var(--color-bg)', height: '44px', paddingLeft: '1.5rem', paddingRight: '1.5rem' }}
        >
          {/* Desktop: back to dashboard */}
          <Link
            href="/"
            className="hidden md:inline-flex items-center font-mono text-theme-muted hover:text-theme-fg transition-colors"
            style={{ fontSize: '0.62rem', letterSpacing: '0.14em', textDecoration: 'none' }}
          >
            ← Dashboard
          </Link>
          {/* Mobile only: Live + Studio section tabs */}
          <div className="flex md:hidden items-center" style={{ flex: 1 }}>
            <a
              href="#performances"
              className="font-mono uppercase text-theme-muted hover:text-theme-fg transition-colors"
              style={{ fontSize: '0.6rem', letterSpacing: '0.2em', padding: '0 1rem', height: '44px', display: 'flex', alignItems: 'center', borderRight: '1px solid var(--color-border)', textDecoration: 'none' }}
            >
              Live
            </a>
            <a
              href="#client-music"
              className="font-mono uppercase text-theme-muted hover:text-theme-fg transition-colors"
              style={{ fontSize: '0.6rem', letterSpacing: '0.2em', padding: '0 1rem', height: '44px', display: 'flex', alignItems: 'center', textDecoration: 'none' }}
            >
              Studio
            </a>
          </div>
        </div>
        <VarsityPopup />
        <div className="flex flex-col lg:flex-row" style={{ borderTop: '1px solid var(--color-border)' }}>
          {perfVariant !== 'hidden' && (
            <div className="flex-1 min-w-0 lg:border-r" style={{ borderColor: 'var(--color-border)' }}>
              <PerformancesSection
                variant={perfVariant}
                performances={performances}
                persona={persona}
                column
              />
            </div>
          )}
          {musicVariant !== 'hidden' && (
            <div className="flex-1 min-w-0">
              <ClientMusicSection
                variant={musicVariant}
                projects={musicProjects}
                persona={persona}
                column
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      {ordered.map(({ id }) => {
        const variant = getVariant(config, id);
        if (variant === 'hidden') return null;

        switch (id) {
          case 'studio':
            return (
              <StudioSection
                key={id}
                variant={variant}
                projects={studioProjects}
                persona={persona}
              />
            );
          case 'cv':
            return (
              <CVSection
                key={id}
                variant={variant}
                entries={cvEntries}
                courses={courses}
                persona={persona}
              />
            );
          case 'courses':
            return (
              <CoursesSection
                key={id}
                variant={variant}
                courses={courses}
              />
            );
          case 'client-music':
            return (
              <ClientMusicSection
                key={id}
                variant={variant}
                projects={musicProjects}
                persona={persona}
              />
            );
          case 'performances':
            return (
              <PerformancesSection
                key={id}
                variant={variant}
                performances={performances}
                persona={persona}
              />
            );
          case 'art':
            return (
              <ArtSection
                key={id}
                variant={variant}
                pieces={artPieces}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
