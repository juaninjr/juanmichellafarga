'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { SectionVariant } from '@/lib/personas';
import type { ArtPiece } from '@/lib/content';

interface ArtSectionProps {
  variant: SectionVariant;
  pieces: ArtPiece[];
}

// ─── Gallery Carousel ────────────────────────────────────────────────────────

function GalleryCarousel({ pieces }: { pieces: ArtPiece[] }) {
  const [idx, setIdx] = useState(0);
  const [activeCollection, setActiveCollection] = useState<string>('All');
  const [vw, setVw] = useState(0);
  const [imageDims, setImageDims] = useState<Record<string, { w: number; h: number }>>({});
  const dragStartX = useRef(0);

  // Derive unique collections from series field
  const collections = ['All', ...Array.from(new Set(pieces.map((p) => p.series).filter(Boolean) as string[]))];

  const sorted = [...pieces].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
  const filtered = activeCollection === 'All' ? sorted : sorted.filter((p) => p.series === activeCollection);
  const n = filtered.length;

  // Reset index when collection changes
  useEffect(() => { setIdx(0); }, [activeCollection]);

  useEffect(() => {
    const measure = () => setVw(window.innerWidth);
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // Preload all images and capture natural dimensions
  useEffect(() => {
    pieces.forEach((piece) => {
      const img = new window.Image();
      img.onload = () => {
        setImageDims((prev) => ({ ...prev, [piece.id]: { w: img.naturalWidth, h: img.naturalHeight } }));
      };
      img.src = piece.image;
    });
  }, [pieces]);

  const prev = useCallback(() => setIdx((i) => (i - 1 + n) % n), [n]);
  const next = useCallback(() => setIdx((i) => (i + 1) % n), [n]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [prev, next]);

  const paintW = Math.min(vw * 0.38, 480);
  const sideX = vw * 0.3;
  const MAX_PAINT_H = Math.min(vw * 0.75, 660);

  // Per-piece dims: respect natural ratio, but cap height and reduce width proportionally
  function paintDims(id: string): { w: number; h: number } {
    const d = imageDims[id];
    if (!d) return { w: paintW, h: paintW * 1.2 };
    const ratio = d.h / d.w;
    let w = paintW;
    let h = paintW * ratio;
    if (h > MAX_PAINT_H) {
      h = MAX_PAINT_H;
      w = h / ratio;
    }
    return { w, h };
  }

  // Stage height = tallest painting among all filtered pieces
  const maxPaintH = filtered.reduce((max, p) => Math.max(max, paintDims(p.id).h), paintW * 1.2);
  const stageH = maxPaintH + 60;

  function getSlot(raw: number, id: string) {
    const { w: pw, h: ph } = paintDims(id);
    const centerX = -pw / 2;
    if (raw === 0) return { x: centerX, pw, ph, scale: 1, blur: 0, opacity: 1, zIndex: 3 };
    if (raw === 1) return { x: centerX + sideX, pw, ph, scale: 0.68, blur: 5, opacity: 0.55, zIndex: 2 };
    if (raw === n - 1) return { x: centerX - sideX, pw, ph, scale: 0.68, blur: 5, opacity: 0.55, zIndex: 2 };
    const goRight = raw <= n / 2;
    return {
      x: goRight ? centerX + sideX + pw + 80 : centerX - sideX - pw - 80,
      pw, ph, scale: 0.55, blur: 8, opacity: 0, zIndex: 1,
    };
  }

  const current = filtered[idx];
  if (!current) return null;

  return (
    <section
      id="art"
      className="relative overflow-hidden"
      style={{ backgroundColor: '#f3ede2', minHeight: '100vh' }}
    >
      {/* ── Ceiling rail ── */}
      <div className="absolute top-0 left-0 right-0" style={{ height: 5, backgroundColor: '#ccc5b5' }} />

      {/* ── Header: collections ── */}
      <div className="relative px-8 md:px-16 pt-10 pb-6" style={{ zIndex: 2 }}>
        <p
          className="font-mono uppercase mb-5"
          style={{ fontSize: '0.55rem', letterSpacing: '0.28em', color: 'rgba(0,0,0,0.3)' }}
        >
          Visual Art
        </p>

        {/* Collection tabs */}
        <div className="flex items-center gap-6 flex-wrap">
          {collections.map((col) => (
            <button
              key={col}
              onClick={() => setActiveCollection(col)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                fontFamily: 'inherit',
                fontSize: 'clamp(1rem, 2.2vw, 1.5rem)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: col === activeCollection ? 'rgba(0,0,0,0.85)' : 'rgba(0,0,0,0.2)',
                transition: 'color 0.2s',
              }}
            >
              {col}
            </button>
          ))}
        </div>
      </div>

      {/* ── Paintings stage ── */}
      <div
        className="relative"
        style={{ height: stageH, zIndex: 2, overflow: 'hidden' }}
        onPointerDown={(e) => { dragStartX.current = e.clientX; }}
        onPointerUp={(e) => {
          const delta = e.clientX - dragStartX.current;
          if (Math.abs(delta) > 60) delta < 0 ? next() : prev();
        }}
      >
        {/* Side arrow — left */}
        <button
          onClick={prev}
          aria-label="Previous"
          style={{
            position: 'absolute',
            left: 'clamp(12px, 3vw, 40px)',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            color: 'rgba(0,0,0,0.3)',
            fontSize: 'clamp(1rem, 2vw, 1.4rem)',
            lineHeight: 1,
            fontWeight: 300,
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(0,0,0,0.7)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(0,0,0,0.3)'; }}
        >
          ‹
        </button>

        {/* Side arrow — right */}
        <button
          onClick={next}
          aria-label="Next"
          style={{
            position: 'absolute',
            right: 'clamp(12px, 3vw, 40px)',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            color: 'rgba(0,0,0,0.3)',
            fontSize: 'clamp(1rem, 2vw, 1.4rem)',
            lineHeight: 1,
            fontWeight: 300,
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(0,0,0,0.7)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(0,0,0,0.3)'; }}
        >
          ›
        </button>

        {/* Paintings */}
        {filtered.map((piece, i) => {
          const raw = (i - idx + n) % n;
          const slot = getSlot(raw, piece.id);
          return (
            <motion.div
              key={piece.id}
              animate={{
                x: slot.x,
                scale: slot.scale,
                opacity: slot.opacity,
                filter: `blur(${slot.blur}px)`,
              }}
              transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                translateY: '-50%',
                width: slot.pw,
                height: slot.ph,
                zIndex: slot.zIndex,
                cursor: raw !== 0 ? 'pointer' : 'default',
                overflow: 'hidden',
                boxShadow: raw === 0
                  ? '0 20px 60px rgba(0,0,0,0.22), 0 4px 12px rgba(0,0,0,0.12)'
                  : '0 8px 24px rgba(0,0,0,0.14)',
              }}
              onClick={() => {
                if (raw === n - 1) prev();
                else if (raw === 1) next();
              }}
            >
              {/* Frame */}
              <div
                style={{
                  position: 'absolute', inset: 0,
                  border: '6px solid #e8e0d0',
                  boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.08)',
                  zIndex: 1, pointerEvents: 'none',
                }}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={piece.image}
                alt={piece.title}
                style={{ width: '100%', height: '100%', objectFit: 'fill', display: 'block' }}
              />
            </motion.div>
          );
        })}
      </div>

      {/* ── Caption ── */}
      <div className="relative flex flex-col items-center" style={{ zIndex: 2, paddingTop: '1.5rem', paddingBottom: '1rem', minHeight: 110 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={`caption-${activeCollection}-${idx}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center text-center px-6"
          >
            <h3
              className="font-bold"
              style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.6rem)', letterSpacing: '-0.01em', lineHeight: 1.1, color: 'rgba(0,0,0,0.82)' }}
            >
              {current.title}
            </h3>
            <p
              className="font-mono mt-2"
              style={{ fontSize: '0.6rem', letterSpacing: '0.22em', color: 'rgba(0,0,0,0.4)', textTransform: 'uppercase' }}
            >
              {current.medium}
              {current.series ? ` · ${current.series}` : ''}
              {current.dimensions ? ` · ${current.dimensions}` : ''}
              {` · ${current.year}`}
            </p>
            {current.description && (
              <p className="mt-3" style={{ fontSize: '0.78rem', color: 'rgba(0,0,0,0.45)', maxWidth: '40ch', lineHeight: 1.6 }}>
                {current.description}
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Dot indicators ── */}
      {n > 1 && (
        <div className="relative flex items-center justify-center gap-2 pb-12" style={{ zIndex: 2 }}>
          {filtered.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              aria-label={`Go to painting ${i + 1}`}
              style={{
                width: i === idx ? 18 : 5,
                height: 5,
                background: i === idx ? 'rgba(0,0,0,0.45)' : 'rgba(0,0,0,0.15)',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>
      )}

      {/* ── Floor shadow ── */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{ height: 80, background: 'linear-gradient(to top, rgba(0,0,0,0.05), transparent)', zIndex: 0 }}
      />
    </section>
  );
}

// ─── Export ──────────────────────────────────────────────────────────────────

export default function ArtSection({ variant, pieces }: ArtSectionProps) {
  if (variant === 'hidden') return null;

  if (variant === 'compact') {
    return (
      <section id="art" className="section-compact border-t border-theme-border">
        <div className="max-w-content mx-auto px-6 md:px-10">
          <div className="compact-strip">
            <span className="compact-strip-label">Art</span>
            <span className="compact-strip-sep">·</span>
            <span>{pieces.length} works</span>
            <span className="compact-strip-sep">·</span>
            <a href="#art" className="hover:text-theme-fg transition-colors text-xs">View →</a>
          </div>
        </div>
      </section>
    );
  }

  return <GalleryCarousel pieces={pieces} />;
}
