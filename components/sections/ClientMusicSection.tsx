'use client';

import Image from 'next/image';
import type { SectionVariant, PersonaSlug } from '@/lib/personas';
import type { MusicProject, MusicCredit } from '@/lib/content';

interface ClientMusicSectionProps {
  variant: SectionVariant;
  projects: MusicProject[];
  persona?: PersonaSlug;
  /** When true, rendered inside a side-by-side column — no max-width wrapper */
  column?: boolean;
}

const ALL_CREDITS: MusicCredit[] = ['Written', 'Produced', 'Mixed', 'Mastered'];

function CreditBox({ label, active }: { label: MusicCredit; active: boolean }) {
  return (
    <span
      className="inline-flex items-center gap-1 font-mono"
      style={{ fontSize: '0.58rem', letterSpacing: '0.06em', color: active ? 'var(--color-fg)' : 'var(--color-muted)', opacity: active ? 1 : 0.4 }}
    >
      <span
        style={{
          width: 10,
          height: 10,
          border: `1px solid ${active ? 'var(--color-fg)' : 'var(--color-border)'}`,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {active && <span style={{ fontSize: '0.5rem', lineHeight: 1 }}>✕</span>}
      </span>
      {label}
    </span>
  );
}

function TrackRow({ project }: { project: MusicProject }) {
  const name = project.artistName || project.client || '—';
  const credits = project.credits ?? [];

  return (
    <div
      className="flex items-start gap-3 py-4"
      style={{ borderBottom: '1px solid var(--color-border)' }}
    >
      {/* Cover thumbnail */}
      <div
        className="shrink-0 relative overflow-hidden"
        style={{ width: 48, height: 48, backgroundColor: 'var(--color-surface)' }}
      >
        {project.coverImage ? (
          <Image src={project.coverImage} alt={project.title} fill className="object-cover" onError={() => {}} />
        ) : (
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(135deg, var(--color-surface), var(--color-border))' }}
          />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2 mb-0.5">
          <h4
            className="font-bold text-sm text-theme-fg truncate leading-tight"
          >
            {project.isPublic ? project.title : <span className="italic text-theme-muted">Private</span>}
          </h4>
          <span className="font-mono text-[10px] text-theme-muted shrink-0">{project.year}</span>
        </div>
        <p className="text-xs text-theme-muted truncate mb-2">{name}</p>

        {/* Credits checkboxes */}
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          {ALL_CREDITS.map((c) => (
            <CreditBox key={c} label={c} active={credits.includes(c)} />
          ))}
        </div>

        {/* Spotify link */}
        {project.spotifyUrl && project.isPublic && (
          <a
            href={project.spotifyUrl}
            className="inline-flex items-center gap-1 mt-2 font-mono hover:underline"
            style={{ fontSize: '0.6rem', letterSpacing: '0.1em', color: '#1DB954' }}
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            Spotify
          </a>
        )}
      </div>
    </div>
  );
}

function MusicianStudioView({ projects, column }: { projects: MusicProject[]; column?: boolean }) {
  const ownProjects = projects.filter((p) => p.isOwn);
  const forOthers = projects.filter((p) => !p.isOwn);

  const inner = (
    <>
      <div className="section-rule" />
      <div className="mb-10">
        <p className="section-tag mb-4">Production &amp; Composition</p>
        <h2
          className="font-black uppercase text-theme-fg"
          style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)', letterSpacing: '-0.03em', lineHeight: 1 }}
        >
          STUDIO
        </h2>
      </div>

      {/* OWN | FOR OTHERS split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {/* Own */}
        <div>
          <h3
            className="font-mono text-[10px] uppercase tracking-[0.22em] mb-1 pb-3"
            style={{ color: 'var(--color-muted)', borderBottom: '1px solid var(--color-border)' }}
          >
            Own
          </h3>
          {ownProjects.length > 0 ? (
            ownProjects.map((p) => <TrackRow key={p.id} project={p} />)
          ) : (
            <p className="text-xs text-theme-muted py-4 italic">— add own projects —</p>
          )}
        </div>

        {/* For Others */}
        <div>
          <h3
            className="font-mono text-[10px] uppercase tracking-[0.22em] mb-1 pb-3"
            style={{ color: 'var(--color-muted)', borderBottom: '1px solid var(--color-border)' }}
          >
            For Others
          </h3>
          {forOthers.length > 0 ? (
            forOthers.map((p) => <TrackRow key={p.id} project={p} />)
          ) : (
            <p className="text-xs text-theme-muted py-4 italic">— add client projects —</p>
          )}
        </div>
      </div>
    </>
  );

  if (column) {
    return (
      <section id="client-music" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
        <div className="px-6 md:px-8 lg:px-10">{inner}</div>
      </section>
    );
  }

  return (
    <section id="client-music" className="section-featured">
      <div className="max-w-content mx-auto px-6 md:px-10">{inner}</div>
    </section>
  );
}

export default function ClientMusicSection({ variant, projects, persona, column }: ClientMusicSectionProps) {
  if (variant === 'hidden') return null;

  const isMusician = persona === 'musician';

  if (variant === 'compact') {
    return (
      <section id="client-music" className="section-compact border-t border-theme-border">
        <div className="max-w-content mx-auto px-6 md:px-10">
          <div className="compact-strip">
            <span className="compact-strip-label">Music</span>
            <span className="compact-strip-sep">·</span>
            {projects
              .filter((p) => p.isPublic)
              .slice(0, 2)
              .map((p, i) => (
                <span key={p.id}>
                  {p.role} — <span className="italic">{p.title}</span>
                  {i === 0 && <span className="compact-strip-sep ml-1.5">·</span>}
                </span>
              ))}
            <span className="compact-strip-sep">·</span>
            <a href="#client-music" className="hover:text-theme-fg transition-colors text-xs">More →</a>
          </div>
        </div>
      </section>
    );
  }

  if (isMusician) {
    return <MusicianStudioView projects={projects} column={column} />;
  }

  // Default non-musician view
  const isFeatured = variant === 'featured';
  return (
    <section id="client-music" className={isFeatured ? 'section-featured' : 'section-standard'}>
      <div className="max-w-content mx-auto px-6 md:px-10">
        <div className="section-rule" />
        <div className={`mb-10 ${isFeatured ? 'md:mb-14' : 'md:mb-10'}`}>
          <p className="section-tag mb-3">Music Production</p>
          <h2
            className="font-black uppercase text-theme-fg"
            style={{
              fontSize: isFeatured ? 'clamp(2rem, 4vw, 3.5rem)' : 'clamp(1.5rem, 3vw, 2.5rem)',
              letterSpacing: '-0.025em',
              lineHeight: 1,
            }}
          >
            Music Projects
          </h2>
        </div>
        <div className={`grid gap-6 ${isFeatured ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'}`}>
          {projects.map((project) => (
            <div key={project.id} className="border border-theme-border p-6 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono border border-theme-accent text-theme-accent px-2 py-0.5">{project.role}</span>
                <span className="font-mono text-xs text-theme-muted">{project.year}</span>
              </div>
              <h3 className="font-bold text-base text-theme-fg">
                {project.isPublic ? project.title : <span className="italic text-theme-muted">Private Project</span>}
              </h3>
              <p className="text-xs text-theme-muted">{project.artistName || project.client}</p>
              {isFeatured && project.isPublic && (
                <p className="text-sm text-theme-muted leading-relaxed line-clamp-3">{project.description}</p>
              )}
              <div className="flex flex-wrap gap-1.5 mt-auto">
                {project.genres.map((g) => (
                  <span key={g} className="text-xs text-theme-muted border border-theme-border px-2 py-0.5">{g}</span>
                ))}
              </div>
              {(project.spotifyUrl || project.listenUrl) && project.isPublic && (
                <a href={project.spotifyUrl || project.listenUrl} className="text-xs font-mono text-theme-accent hover:underline mt-1">Listen →</a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
