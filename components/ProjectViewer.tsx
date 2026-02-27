'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import type { StudioProject, ArtPiece } from '@/lib/content';

type FolderItem = StudioProject | ArtPiece;

interface ProjectViewerProps {
  item: FolderItem;
  layoutId: string;
  onClose: () => void;
}

function isStudio(item: FolderItem): item is StudioProject {
  return 'coverImage' in item;
}

// Pages are image paths, or 'pdf:/docs/...' for inline PDF pages
function buildPages(item: FolderItem): string[] {
  if (isStudio(item)) {
    const pages = [item.coverImage, ...(item.images ?? [])];
    if (item.pdfUrl) pages.push(`pdf:${item.pdfUrl}`);
    return pages;
  }
  return [item.image];
}

// Subtle half-page slide
const pageVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? '6%' : '-6%',
    opacity: 0,
  }),
  center: {
    x: '0%',
    opacity: 1,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? '-4%' : '4%',
    opacity: 0,
    transition: { duration: 0.25, ease: [0.55, 0, 1, 0.45] as [number, number, number, number] },
  }),
};

export default function ProjectViewer({ item, layoutId, onClose }: ProjectViewerProps) {
  const pages = buildPages(item);
  const [page, setPage] = useState(0);
  const [dir, setDir] = useState(1);

  const next = useCallback(() => {
    if (page < pages.length - 1) { setDir(1); setPage((p) => p + 1); }
  }, [page, pages.length]);

  const prev = useCallback(() => {
    if (page > 0) { setDir(-1); setPage((p) => p - 1); }
  }, [page]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, next, prev]);

  const studio = isStudio(item) ? item : null;
  const artItem = !studio && 'medium' in item ? (item as ArtPiece) : null;
  const hasMultiplePages = pages.length > 1;

  return (
    <motion.div
      layoutId={layoutId}
      className="fixed inset-0 z-50 overflow-y-auto md:overflow-hidden"
      style={{ backgroundColor: '#0a0a0a', color: '#f8f7f3' }}
    >
      {/* ── ESC button — always top-right of the viewer ── */}
      <button
        onClick={onClose}
        className="absolute font-mono text-xs transition-opacity hover:opacity-50"
        style={{ top: '1rem', right: '1rem', zIndex: 60, color: '#555', background: 'none', border: 'none', cursor: 'pointer' }}
        aria-label="Close"
      >
        ESC ✕
      </button>

      <div className="flex flex-col md:flex-row md:h-full">

        {/* ── Image area — LEFT on desktop, TOP on mobile ── */}
        <div className="relative overflow-hidden h-[55vh] md:h-auto md:flex-1">
          <AnimatePresence custom={dir} mode="wait">
            <motion.div
              key={page}
              custom={dir}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0"
            >
              {pages[page].startsWith('pdf:') ? (
                <iframe
                  src={pages[page].slice(4)}
                  className="w-full h-full"
                  style={{ border: 'none', backgroundColor: '#fff' }}
                  title={`${item.title} — PDF`}
                />
              ) : (
                <>
                  <Image
                    src={pages[page]}
                    alt={`${item.title} — ${page + 1}`}
                    fill
                    className="object-contain"
                    onError={() => {}}
                    priority
                  />
                  <div className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(135deg, #111, #1e1e1e)' }} />
                </>
              )}
              {/* Page counter */}
              {hasMultiplePages && (
                <div className="absolute top-5 left-5">
                  <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.28)' }}>
                    {pages[page].startsWith('pdf:') ? 'PDF' : `${page + 1} / ${pages.length}`}
                  </span>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Prev arrow */}
          {hasMultiplePages && (
            <button
              onClick={prev}
              disabled={page === 0}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-14 md:h-14 flex items-center justify-center transition-all duration-200"
              style={{
                backgroundColor: page === 0 ? 'rgba(255,255,255,0.04)' : 'rgba(10,10,10,0.55)',
                border: '1px solid rgba(255,255,255,0.12)',
                backdropFilter: 'blur(6px)',
                color: page === 0 ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.85)',
                cursor: page === 0 ? 'default' : 'pointer',
                fontSize: '1.1rem',
              }}
              aria-label="Previous page"
            >
              ←
            </button>
          )}

          {/* Next arrow */}
          {hasMultiplePages && (
            <button
              onClick={next}
              disabled={page === pages.length - 1}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-14 md:h-14 flex items-center justify-center transition-all duration-200"
              style={{
                backgroundColor: page === pages.length - 1 ? 'rgba(255,255,255,0.04)' : 'rgba(10,10,10,0.55)',
                border: '1px solid rgba(255,255,255,0.12)',
                backdropFilter: 'blur(6px)',
                color: page === pages.length - 1 ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.85)',
                cursor: page === pages.length - 1 ? 'default' : 'pointer',
                fontSize: '1.1rem',
              }}
              aria-label="Next page"
            >
              →
            </button>
          )}
        </div>

        {/* ── Sidebar — RIGHT on desktop, BELOW image on mobile ── */}
        <div
          className="flex flex-col p-6 md:p-10 shrink-0 md:w-[300px] lg:w-[340px] md:h-full md:overflow-y-auto"
          style={{ borderLeft: '1px solid #1a1a1a' }}
        >
          {/* Title — visible on both mobile and desktop */}
          <div className="mb-6 md:mb-8 pr-10 md:pr-0">
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase mb-2" style={{ color: '#555' }}>
              {studio ? studio.studio : artItem?.medium ?? ''}
            </p>
            <h2
              className="font-black uppercase leading-none"
              style={{ fontSize: 'clamp(1rem, 2vw, 1.5rem)', letterSpacing: '-0.02em' }}
            >
              {item.title}
            </h2>
          </div>

          {/* Metadata */}
          <div className="flex-1">
            {/* Studio metadata */}
            {studio && (
              <div className="space-y-6">
                <div>
                  <p className="font-mono text-[10px] tracking-widest uppercase mb-1" style={{ color: '#444' }}>Year</p>
                  <p className="font-bold">{studio.year}</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] tracking-widest uppercase mb-1" style={{ color: '#444' }}>Studio</p>
                  <p style={{ color: '#ccc' }}>{studio.studio}</p>
                </div>
                {studio.description && (
                  <div>
                    <p className="font-mono text-[10px] tracking-widest uppercase mb-1" style={{ color: '#444' }}>Description</p>
                    <p className="text-sm leading-relaxed" style={{ color: '#888' }}>{studio.description}</p>
                  </div>
                )}
                {studio.tags.length > 0 && (
                  <div>
                    <p className="font-mono text-[10px] tracking-widest uppercase mb-2" style={{ color: '#444' }}>Tags</p>
                    <div className="flex flex-wrap gap-1.5">
                      {studio.tags.map((tag) => (
                        <span key={tag} className="font-mono text-[10px] uppercase tracking-wider px-2 py-1" style={{ border: '1px solid #2a2a2a', color: '#666' }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {studio.pdfUrl && (
                  <div>
                    <p className="font-mono text-[10px] tracking-widest uppercase mb-2" style={{ color: '#444' }}>Project PDF</p>
                    <a
                      href={studio.pdfUrl}
                      download
                      className="font-mono text-[10px] uppercase tracking-wider transition-colors"
                      style={{ color: '#555', textDecoration: 'none', borderBottom: '1px solid #333', paddingBottom: '1px' }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#f8f7f3'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#555'; }}
                    >
                      Download PDF ↓
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Art metadata */}
            {artItem && (
              <div className="space-y-6">
                <div>
                  <p className="font-mono text-[10px] tracking-widest uppercase mb-1" style={{ color: '#444' }}>Year</p>
                  <p className="font-bold">{artItem.year}</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] tracking-widest uppercase mb-1" style={{ color: '#444' }}>Medium</p>
                  <p className="capitalize" style={{ color: '#ccc' }}>{artItem.medium}</p>
                </div>
                {artItem.dimensions && (
                  <div>
                    <p className="font-mono text-[10px] tracking-widest uppercase mb-1" style={{ color: '#444' }}>Dimensions</p>
                    <p style={{ color: '#888' }}>{artItem.dimensions}</p>
                  </div>
                )}
                {artItem.description && (
                  <div>
                    <p className="font-mono text-[10px] tracking-widest uppercase mb-1" style={{ color: '#444' }}>Description</p>
                    <p className="text-sm leading-relaxed" style={{ color: '#888' }}>{artItem.description}</p>
                  </div>
                )}
                {artItem.series && (
                  <div>
                    <p className="font-mono text-[10px] tracking-widest uppercase mb-1" style={{ color: '#444' }}>Series</p>
                    <p style={{ color: '#ccc' }}>{artItem.series}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Page indicator */}
          {hasMultiplePages && (
            <div className="flex items-center gap-2 mt-8">
              {pages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setDir(i > page ? 1 : -1); setPage(i); }}
                  aria-label={`Go to page ${i + 1}`}
                  style={{
                    width: i === page ? 20 : 6,
                    height: 2,
                    backgroundColor: i === page ? '#f8f7f3' : '#333',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    transition: 'width 0.25s ease, background-color 0.25s ease',
                  }}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </motion.div>
  );
}
