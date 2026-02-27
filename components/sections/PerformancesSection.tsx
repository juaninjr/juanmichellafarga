'use client';

import Image from 'next/image';
import type { SectionVariant, PersonaSlug } from '@/lib/personas';
import type { Performance } from '@/lib/content';

interface PerformancesSectionProps {
  variant: SectionVariant;
  performances: Performance[];
  persona?: PersonaSlug;
  /** When true, rendered inside a side-by-side column — no max-width wrapper */
  column?: boolean;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function FeaturedEventCard({ perf }: { perf: Performance }) {
  return (
    <div
      className="relative overflow-hidden mb-6"
      style={{ aspectRatio: '16/9', backgroundColor: 'var(--color-surface)' }}
    >
      {perf.photo ? (
        <Image
          src={perf.photo}
          alt={perf.title}
          fill
          className="object-cover"
          onError={() => {}}
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, #1a1a1a, #2c2c2c)' }}
        />
      )}

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 60%)' }}
      />

      {/* Info overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
          {formatDate(perf.date)} · {perf.city}
        </p>
        <h4
          className="font-bold text-white leading-tight"
          style={{ fontSize: 'clamp(0.9rem, 2vw, 1.2rem)' }}
        >
          {perf.title}
        </h4>
        <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
          {perf.venue} · {perf.role}
        </p>
        {perf.videoUrl && (
          <a href={perf.videoUrl} className="font-mono text-xs mt-2 block hover:underline" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Watch ↗
          </a>
        )}
      </div>
    </div>
  );
}

function MusicianLiveView({ performances, column }: { performances: Performance[]; column?: boolean }) {
  const featured = performances.filter((p) => p.isFeatured);
  const rest = performances.filter((p) => !p.isFeatured);

  const inner = (
    <>
      <div className="section-rule" />
      <div className="mb-10">
        <p className="section-tag mb-4">Live Performance</p>
        <h2
          className="font-black uppercase text-theme-fg"
          style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)', letterSpacing: '-0.03em', lineHeight: 1 }}
        >
          LIVE
        </h2>
      </div>

      {/* Featured events — large photo cards */}
      {featured.length > 0 && (
        <div className="mb-8">
          {featured.map((perf) => (
            <FeaturedEventCard key={perf.id} perf={perf} />
          ))}
        </div>
      )}

      {/* Remaining events — compact list */}
      {rest.length > 0 && (
        <div>
          <h3
            className="font-mono text-[10px] uppercase tracking-[0.2em] mb-4 pb-2"
            style={{ color: 'var(--color-muted)', borderBottom: '1px solid var(--color-border)' }}
          >
            Other Events
          </h3>
          <div className="space-y-4">
            {rest.map((perf) => (
              <div key={perf.id} className="flex items-baseline gap-4">
                <span className="font-mono text-[11px] text-theme-muted shrink-0 w-20">{formatDate(perf.date)}</span>
                <div className="min-w-0">
                  <h4 className="text-sm font-medium text-theme-fg leading-tight">{perf.title}</h4>
                  <p className="text-xs text-theme-muted mt-0.5">{perf.venue} · {perf.city}</p>
                  {perf.program && perf.program.length > 0 && (
                    <p className="text-xs text-theme-muted italic mt-0.5">{perf.program.slice(0, 2).join(', ')}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );

  if (column) {
    return (
      <section id="performances" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
        <div className="px-6 md:px-8 lg:px-10">{inner}</div>
      </section>
    );
  }

  return (
    <section id="performances" className="section-featured">
      <div className="max-w-content mx-auto px-6 md:px-10">{inner}</div>
    </section>
  );
}

export default function PerformancesSection({ variant, performances, persona, column }: PerformancesSectionProps) {
  if (variant === 'hidden') return null;

  const isMusician = persona === 'musician';
  const pianoPerfs = performances.filter((p) => p.type === 'recital' || p.type === 'competition');
  const bandPerfs = performances.filter((p) => p.type === 'band' || p.type === 'session');

  if (variant === 'compact') {
    return (
      <section id="performances" className="section-compact border-t border-theme-border">
        <div className="max-w-content mx-auto px-6 md:px-10">
          <div className="compact-strip">
            <span className="compact-strip-label">Performances</span>
            <span className="compact-strip-sep">·</span>
            <span>{pianoPerfs.length} recitals</span>
            <span className="compact-strip-sep">·</span>
            <span>{bandPerfs.length} shows</span>
            <span className="compact-strip-sep">·</span>
            <a href="#performances" className="hover:text-theme-fg transition-colors text-xs">History →</a>
          </div>
        </div>
      </section>
    );
  }

  if (isMusician) {
    return <MusicianLiveView performances={performances} column={column} />;
  }

  const isFeatured = variant === 'featured';
  return (
    <section id="performances" className={isFeatured ? 'section-featured' : 'section-standard'}>
      <div className="max-w-content mx-auto px-6 md:px-10">
        <div className="section-rule" />
        <div className={`mb-10 ${isFeatured ? 'md:mb-14' : 'md:mb-10'}`}>
          <p className="section-tag mb-3">Live Music</p>
          <h2
            className="font-black uppercase text-theme-fg"
            style={{
              fontSize: isFeatured ? 'clamp(2rem, 4vw, 3.5rem)' : 'clamp(1.5rem, 3vw, 2.5rem)',
              letterSpacing: '-0.025em',
              lineHeight: 1,
            }}
          >
            Performance History
          </h2>
        </div>
        <div className={`${isFeatured ? 'grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16' : 'space-y-10'}`}>
          <div>
            <h3 className="text-xs font-mono uppercase tracking-widest text-theme-muted mb-6">Piano</h3>
            <div className="space-y-6">
              {pianoPerfs.map((perf) => (
                <div key={perf.id} className="flex gap-4">
                  <span className="font-mono text-xs text-theme-muted w-20 shrink-0 pt-0.5">{formatDate(perf.date)}</span>
                  <div>
                    <h4 className="text-sm font-medium text-theme-fg">{perf.title}</h4>
                    <p className="text-xs text-theme-muted mt-0.5">{perf.venue} · {perf.city}</p>
                    {isFeatured && perf.program && perf.program.length > 0 && (
                      <ul className="mt-2 space-y-0.5">
                        {perf.program.map((piece, i) => (
                          <li key={i} className="text-xs text-theme-muted italic">{piece}</li>
                        ))}
                      </ul>
                    )}
                    {perf.videoUrl && (
                      <a href={perf.videoUrl} className="text-xs font-mono text-theme-accent hover:underline mt-1 block">Watch ↗</a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xs font-mono uppercase tracking-widest text-theme-muted mb-6">Bands &amp; Ensembles</h3>
            <div className="space-y-6">
              {bandPerfs.map((perf) => (
                <div key={perf.id} className="flex gap-4">
                  <span className="font-mono text-xs text-theme-muted w-20 shrink-0 pt-0.5">{formatDate(perf.date)}</span>
                  <div>
                    <h4 className="text-sm font-medium text-theme-fg">{perf.title}</h4>
                    <p className="text-xs text-theme-muted mt-0.5">
                      {perf.ensemble && <span className="mr-1">{perf.ensemble} ·</span>}
                      {perf.role} · {perf.city}
                    </p>
                    {isFeatured && perf.program && perf.program.length > 0 && (
                      <p className="text-xs text-theme-muted italic mt-1">{perf.program.join(', ')}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
