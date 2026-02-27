'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Set ARTICLE_URL to the Varsity article link.
// Add a screenshot to /public/images/ and set ARTICLE_IMAGE (e.g. '/images/varsity-preview.jpg').
// Leave ARTICLE_IMAGE empty to show a styled text placeholder.
// ─────────────────────────────────────────────────────────────────────────────
const ARTICLE_URL = 'https://www.varsity.co.uk/interviews/30887'; // Replace with the actual Varsity article URL
const ARTICLE_IMAGE = '/images/music/bcn_foto_1.jpg'; // e.g. '/images/varsity-preview.jpg'
// ─────────────────────────────────────────────────────────────────────────────

const BANNER_H = 104;

function Thumbnail({ size }: { size: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        flexShrink: 0,
        overflow: 'hidden',
        backgroundColor: '#181818',
        position: 'relative',
      }}
    >
      {ARTICLE_IMAGE ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={ARTICLE_IMAGE}
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundImage: 'linear-gradient(140deg, #1c1c1c, #2c2c2c)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: size > 60 ? '10px 14px' : '5px 8px',
            gap: '4px',
          }}
        >
          <div style={{ fontFamily: 'serif', fontSize: size > 60 ? '0.7rem' : '0.4rem', fontWeight: 700, color: 'rgba(255,255,255,0.65)', filter: 'blur(1.5px)', lineHeight: 1.2 }}>
            Juan Michel
          </div>
          <div style={{ fontSize: size > 60 ? '0.52rem' : '0.3rem', color: 'rgba(255,255,255,0.32)', filter: 'blur(1.5px)', lineHeight: 1.3 }}>
            Varsity Newspaper
          </div>
        </div>
      )}
      <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.1)' }} />
    </div>
  );
}

// One repeating unit of the marquee
function Segment() {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0,
        flexShrink: 0,
      }}
    >
      <Thumbnail size={BANNER_H} />
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '20px',
          paddingLeft: '28px',
          paddingRight: '60px',
        }}
      >
        <span
          style={{
            fontFamily: 'monospace',
            fontSize: 'clamp(2.8rem, 6vw, 4.2rem)',
            letterSpacing: '-0.02em',
            color: 'rgba(255,255,255,0.95)',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            fontWeight: 700,
            lineHeight: 1,
          }}
        >
          Varsity
        </span>
        <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '1.2rem', lineHeight: 1 }}>·</span>
        <span
          style={{
            fontFamily: 'monospace',
            fontSize: 'clamp(0.55rem, 1.2vw, 0.8rem)',
            letterSpacing: '0.12em',
            color: 'rgba(255,255,255,0.65)',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}
        >
          Read more about Juan
        </span>
        <span style={{ color: 'rgba(255,255,255,0.14)', fontSize: '0.5rem' }}>—</span>
        <span
          style={{
            fontFamily: 'monospace',
            fontSize: 'clamp(0.42rem, 0.9vw, 0.58rem)',
            color: 'rgba(255,255,255,0.3)',
            letterSpacing: '0.1em',
            whiteSpace: 'nowrap',
          }}
        >
          by Jasmine Heddle-Bacon
        </span>
        <span style={{ color: 'rgba(255,255,255,0.08)', fontSize: '0.5rem' }}>·</span>
      </span>
    </span>
  );
}

export default function VarsityPopup() {
  const [dismissed, setDismissed] = useState(false);
  const [showCenter, setShowCenter] = useState(false);

  useEffect(() => {
    const handler = () => {
      if (!dismissed) setShowCenter(window.scrollY > 480);
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, [dismissed]);

  if (dismissed) return null;

  return (
    <>
      {/* ── Sticky rolling banner ── */}
      <div
        style={{
          position: 'sticky',
          top: '56px',
          zIndex: 30,
          height: `${BANNER_H}px`,
          backgroundColor: 'rgba(6,6,6,0.97)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(139,94,60,0.45)',
          boxShadow: '0 2px 24px rgba(139,94,60,0.14), inset 0 -1px 0 rgba(139,94,60,0.22)',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* Scrolling marquee — clicking opens article */}
        <a
          href={ARTICLE_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{ flex: 1, overflow: 'hidden', display: 'flex', alignItems: 'center', height: '100%', textDecoration: 'none' }}
        >
          {/* 8 segments: animate from 0 → -50% for seamless loop */}
          <motion.div
            animate={{ x: '-50%' }}
            initial={{ x: '0%' }}
            transition={{ duration: 55, ease: 'linear', repeat: Infinity }}
            style={{ display: 'inline-flex', alignItems: 'center', width: 'max-content' }}
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <Segment key={i} />
            ))}
          </motion.div>
        </a>

        {/* Fade-out gradient mask before close button */}
        <div
          style={{
            position: 'absolute',
            right: '36px',
            top: 0,
            bottom: 0,
            width: '80px',
            backgroundImage: 'linear-gradient(to right, transparent, rgba(6,6,6,0.97))',
            pointerEvents: 'none',
          }}
        />

        {/* Close button — static, right side */}
        <button
          onClick={() => { setDismissed(true); setShowCenter(false); }}
          style={{
            position: 'relative',
            zIndex: 1,
            marginRight: '12px',
            color: 'rgba(255,255,255,0.22)',
            fontSize: '0.65rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            flexShrink: 0,
            letterSpacing: '0.05em',
            padding: '8px',
            fontFamily: 'monospace',
          }}
          aria-label="Dismiss"
        >
          ✕
        </button>
      </div>

      {/* ── Center popup — minimal, intentional ── */}
      
    </>
  );
}
