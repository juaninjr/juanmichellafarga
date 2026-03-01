'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import type { SectionVariant, PersonaSlug } from '@/lib/personas';
import type { CVEntry, CVEntryType, Course } from '@/lib/content';

interface CVSectionProps {
  variant: SectionVariant;
  entries: CVEntry[];
  courses?: Course[];
  persona?: PersonaSlug;
  isOnCVPage?: boolean;
}

// ── Paper item — string for plain text, object for text + hover detail ──────
type PaperItem = string | { text: string; detail: string };
type PaperSectionDef = { id: string; label: string; items: PaperItem[] };

const PAPER_SECTIONS: PaperSectionDef[] = [
  {
    id: 'academic',
    label: 'ACADEMIC',
    items: [
      { text: 'University of Cambridge · Robinson College', detail: 'BA Architecture · Tripos 2023–2026. Studio, Structures I & II, Materials & Construction, Sustainable Design, Urbanism, Sound in Architecture, Gardens & Landscapes.' },
      { text: 'British Council School · Madrid', detail: 'Technological Bilingual Baccalaureate 2009–2023. English/Spanish bilingual programme. BiBac Prize 2023. Academic Excellence 2017, 2019.' },
    ],
  },
  {
    id: 'experience',
    label: 'EXPERIENCE',
    items: [
      { text: 'Aluminios Cortizo — Arch. & Eng. Intern · Sept 2025', detail: 'Cortizo is European leader for design and production of architectural aluminium structures. During my time there I offered technical assistance to clients on system specs. Learned about validation tests, regulatory compliance (CTE) and trained in software like Orgadata, Cortizolab & Cortizocenter. Duration: 1 month.' },
      { text: 'Carpintery Dimmler · Karlsruhe, 2024', detail: 'Designed and installed countertop in a dental clinic. Built shelving for a school. Flooring and repair in schools, hospitals, and private homes. 1 month.' },
      { text: 'PE Volunteer · Chame, Panama · 2024', detail: 'Delivered sports and games lessons to primary school students in a community school. 1 month.' },
      { text: 'Music & Creative Projects · 2020–present', detail: 'Sound & Production Engineer (Freelance). Produced, mixed and mastered 100+ tracks. 20M+ streams with international artists. Event planning for concerts.' },
    ],
  },
  {
    id: 'skills',
    label: 'SKILLS',
    items: [
      { text: 'CAD & Visualisation', detail: 'Rhino · Grasshopper · AutoCAD · Unreal Engine' },
      { text: 'Image & Video', detail: 'Adobe Photoshop · InDesign · After Effects · Premiere Pro' },
      { text: 'Sound Production', detail: 'Pro Tools · Logic Pro X · Ableton · FL Studio' },
      { text: 'Programming', detail: 'Python · C · SQL · JavaScript' },
    ],
  },
  {
    id: 'languages',
    label: 'LANGUAGES',
    items: [
      { text: 'Spanish', detail: 'Native speaker' },
      { text: 'English', detail: 'Native speaker · C2 certified' },
      { text: 'German', detail: 'Native speaker · C2 certified' },
      { text: 'French', detail: 'Professional working proficiency · B2' },
      { text: 'Catalan', detail: 'Native speaker' },
    ],
  },
  {
    id: 'extras',
    label: 'EXTRAS',
    items: [
      { text: 'Piano · Municipal School of Music, Madrid', detail: '2013–2021. Award for Piano Excellence 2017, 2019.' },
      { text: 'Cambridge Rowing · M1', detail: '2024–2026. Cambridge University Rowing Club, Men\'s 1st team.' },
      { text: 'Harvard CS50x', detail: 'Computer Science course by Harvard University (online). Certificate 2023.' },
      { text: 'RIBA Skill Up', detail: 'Royal Institute of British Architects project. Certificate 2022.' },
      { text: 'Divemaster PADI', detail: 'Professional Association of Diving Instructors. Divemaster certification 2025.' },
    ],
  },
];

// ── Individual paper item — plain text or text + hover detail ─────────────────
function PaperSectionItem({ item }: { item: PaperItem }) {
  const [hovered, setHovered] = useState(false);

  if (typeof item === 'string') {
    if (item === '—') {
      return <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.07)', margin: '7px 0' }} />;
    }
    return (
      <p className="font-mono" style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.9, letterSpacing: '0.04em' }}>
        {item}
      </p>
    );
  }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ marginBottom: '1px' }}
    >
      <p
        className="font-mono"
        style={{
          fontSize: '0.6rem',
          color: hovered ? '#fff' : 'rgba(255,255,255,0.65)',
          lineHeight: 1.9,
          letterSpacing: '0.04em',
          transition: 'color 0.15s ease',
          cursor: 'default',
        }}
      >
        {item.text}
      </p>
      {hovered && (
        <p
          className="font-mono"
          style={{
            fontSize: '0.5rem',
            color: 'rgba(255,255,255,0.38)',
            letterSpacing: '0.04em',
            lineHeight: 1.6,
            paddingLeft: '8px',
            borderLeft: '1px solid rgba(255,255,255,0.15)',
            marginBottom: '4px',
          }}
        >
          {item.detail}
        </p>
      )}
    </div>
  );
}

// ── Paper section — click to toggle open/close ─────────────────────────────────
function PaperSection({ label, items }: Omit<PaperSectionDef, 'id'>) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      style={{ cursor: 'pointer' }}
      onClick={() => setOpen((o) => !o)}
    >
      <div className="flex items-center gap-3">
        <span
          className="font-black uppercase shrink-0"
          style={{
            fontSize: 'clamp(1.35rem, 3.2vw, 2.6rem)',
            letterSpacing: '-0.025em',
            lineHeight: 1.05,
            color: open ? '#000' : '#1c1c1c',
            transition: 'color 0.15s ease',
          }}
        >
          {label}
        </span>
        <div
          style={{
            flex: 1,
            height: '1px',
            backgroundColor: open ? '#0a0a0a' : '#c8c4bb',
            transition: 'background-color 0.15s ease',
          }}
        />
        <span
          style={{
            color: '#888',
            fontSize: '0.9rem',
            display: 'inline-block',
            transition: 'transform 0.2s ease',
            transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
          }}
        >
          +
        </span>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 6 }}
            exit={{ opacity: 0, y: -8, transition: { duration: 0.1 } }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              zIndex: 60,
              backgroundColor: '#0a0a0a',
              border: '1px solid rgba(255,255,255,0.1)',
              padding: '12px 16px',
              minWidth: '290px',
              maxWidth: '360px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.7), 0 2px 8px rgba(0,0,0,0.5)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '-5px',
                right: '1.75rem',
                width: '8px',
                height: '8px',
                backgroundColor: '#0a0a0a',
                borderTop: '1px solid rgba(255,255,255,0.1)',
                borderLeft: '1px solid rgba(255,255,255,0.1)',
                transform: 'rotate(45deg)',
              }}
            />
            {items.map((item, i) => (
              <PaperSectionItem key={i} item={item} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Full CV modal (PDF embed) ──────────────────────────────────────────────────
function FullCVModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
      style={{ backgroundColor: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(14px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 18, transition: { duration: 0.15 } }}
        transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#0c0c0c',
          border: '1px solid rgba(255,255,255,0.07)',
          width: '100%',
          maxWidth: '820px',
          height: '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem 1.5rem',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            flexShrink: 0,
          }}
        >
          <span className="font-mono uppercase tracking-[0.22em]" style={{ fontSize: '0.52rem', color: 'rgba(255,255,255,0.28)' }}>
            Juan Michel Lafarga — Curriculum Vitae
          </span>
          <div className="flex items-center gap-3">
            <a
              href="/docs/cvfeb26.pdf"
              download="Juan_Michel_Lafarga_CV.pdf"
              className="font-mono uppercase tracking-widest transition-all"
              style={{ fontSize: '0.52rem', letterSpacing: '0.2em', padding: '6px 14px', border: '1px solid rgba(255,255,255,0.13)', color: 'rgba(255,255,255,0.55)', textDecoration: 'none' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.38)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.9)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.13)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.55)'; }}
            >
              Download PDF ↓
            </a>
            <button
              onClick={onClose}
              className="font-mono transition-all"
              style={{ color: 'rgba(255,255,255,0.22)', fontSize: '1rem', lineHeight: 1, background: 'none', border: 'none', cursor: 'pointer' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.75)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.22)'; }}
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>
        <iframe src="/docs/cvfeb26.pdf" style={{ flex: 1, height: 0, minHeight: 0, border: 'none', width: '100%', backgroundColor: '#fff' }} title="Juan Michel Lafarga — CV" />
      </motion.div>
    </motion.div>
  );
}

// ── 3D paper view (standalone /cv + non-architect) ─────────────────────────────
function PaperView({ onOpenModal }: { onOpenModal: () => void }) {
  return (
    <section
      id="cv"
      className="relative flex items-center justify-center"
      style={{
        backgroundColor: '#060606',
        minHeight: '100vh',
        padding: '6rem 1.5rem 6rem',
        backgroundImage: 'radial-gradient(ellipse 65% 70% at 50% 45%, #111 0%, #060606 100%)',
      }}
    >
      <button
        onClick={onOpenModal}
        className="absolute font-mono uppercase transition-all"
        style={{ top: '1.5rem', right: '2rem', fontSize: '0.52rem', letterSpacing: '0.22em', color: 'rgba(255,255,255,0.22)', border: '1px solid rgba(255,255,255,0.08)', padding: '7px 16px', background: 'none', cursor: 'pointer' }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.8)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.3)'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.22)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'; }}
      >
        View Full CV ↗
      </button>

      <div style={{ perspective: '1100px', width: '100%', maxWidth: '700px' }}>
        <motion.div
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror' }}
        >
          <div
            style={{
              backgroundColor: '#f7f4ee',
              transform: 'rotateX(7deg) rotateY(-5deg) rotateZ(0.8deg)',
              transformOrigin: 'center center',
              boxShadow: ['3px 5px 10px rgba(0,0,0,0.6)', '8px 18px 40px rgba(0,0,0,0.55)', '16px 44px 88px rgba(0,0,0,0.45)', '24px 70px 130px rgba(0,0,0,0.3)'].join(', '),
              padding: 'clamp(2rem, 5vw, 3.5rem)',
            }}
          >
            <div style={{ marginBottom: '2rem', paddingBottom: '1.25rem', borderBottom: '2px solid #0a0a0a' }}>
              <h1 className="font-black uppercase" style={{ fontSize: 'clamp(2rem, 5.5vw, 4rem)', letterSpacing: '-0.035em', lineHeight: 1, color: '#0a0a0a' }}>
                Juan Michel
              </h1>
              <p className="font-mono uppercase" style={{ fontSize: '0.55rem', color: '#888', letterSpacing: '0.22em', marginTop: '0.6rem' }}>
                Architecture · Music · Art · Cambridge, UK
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              {PAPER_SECTIONS.map((s) => (
                <PaperSection key={s.id} label={s.label} items={s.items} />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ── Clickable course tag pill with expandable description ─────────────────────
function CourseTag({ course }: { course: Course }) {
  const [open, setOpen] = useState(false);
  const hasDesc = !!course.description;

  return (
    <div>
      <button
        onClick={() => hasDesc && setOpen((o) => !o)}
        className="font-mono"
        style={{
          fontSize: '0.6rem',
          padding: '4px 10px',
          border: `1px solid ${open ? '#999' : '#ddd'}`,
          color: open ? '#0a0a0a' : '#555',
          background: open ? '#f5f2ed' : 'none',
          cursor: hasDesc ? 'pointer' : 'default',
          transition: 'border-color 0.15s ease, color 0.15s ease, background 0.15s ease',
        }}
      >
        {course.title}
        {hasDesc && (
          <span style={{ marginLeft: 5, color: '#bbb', display: 'inline-block', transition: 'transform 0.2s ease', transform: open ? 'rotate(45deg)' : 'rotate(0deg)' }}>+</span>
        )}
      </button>
      <AnimatePresence initial={false}>
        {open && course.description && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <p
              className="font-mono"
              style={{ fontSize: '0.55rem', color: '#888', lineHeight: 1.6, padding: '6px 4px 4px 10px', borderLeft: '1px solid #e0dbd4', marginTop: 4, maxWidth: '34ch' }}
            >
              {course.provider} · {course.year}
            </p>
            <p
              className="text-sm"
              style={{ fontSize: '0.58rem', color: '#666', lineHeight: 1.6, padding: '0 4px 4px 10px', borderLeft: '1px solid #e0dbd4', maxWidth: '34ch' }}
            >
              {course.description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Collapsible section wrapper for ArchitectTimeline ─────────────────────────
function CollapsibleTimelineSection({ label, defaultOpen, children }: { label: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen ?? true);

  return (
    <div className="mb-8">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between font-mono uppercase mb-4"
        style={{ fontSize: '0.58rem', letterSpacing: '0.2em', color: '#999', background: 'none', borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderBottom: '1px solid #e8e4de', cursor: 'pointer', padding: '0 0 0.5rem 0', width: '100%' }}
      >
        {label}
        <span style={{ fontSize: '0.75rem', color: '#bbb', userSelect: 'none', transition: 'transform 0.2s ease', display: 'inline-block', transform: open ? 'rotate(45deg)' : 'rotate(0deg)' }}>
          +
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ overflow: 'hidden' }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Expandable certification row (identical expand behaviour to TimelineRow) ───
function CertRow({ cert, isLast }: { cert: Course; isLast: boolean }) {
  const [open, setOpen] = useState(false);
  const hasDesc = !!cert.description;

  return (
    <div
      className="pb-6 min-w-0"
      onClick={() => hasDesc && setOpen((o) => !o)}
      style={{ cursor: hasDesc ? 'pointer' : 'default', borderBottom: isLast ? 'none' : '1px solid #f0ece6' }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-bold leading-snug" style={{ fontSize: '0.92rem', color: '#0a0a0a' }}>{cert.title}</h3>
          <p className="font-mono mt-0.5" style={{ fontSize: '0.58rem', color: '#999' }}>{cert.provider} · {cert.year}</p>
        </div>
        {hasDesc && (
          <span style={{ color: '#bbb', fontSize: '0.75rem', flexShrink: 0, marginTop: 2, userSelect: 'none' }}>
            {open ? '−' : '+'}
          </span>
        )}
      </div>
      {open && cert.description && (
        <p className="text-sm mt-3 leading-relaxed" style={{ color: '#666', maxWidth: '52ch' }}>
          {cert.description}
        </p>
      )}
    </div>
  );
}

// ── LinkedIn-style timeline (architect persona inline) ─────────────────────────
function dur(start: number, end: number | 'present'): string {
  const e = end === 'present' ? new Date().getFullYear() : end;
  const y = e - start;
  if (y === 0) return '< 1 yr';
  return y === 1 ? '1 yr' : `${y} yrs`;
}

const DOT_COLOR: Record<CVEntryType, string> = {
  education: '#2c4a6e',
  experience: '#5a3a28',
  award: '#5a5a28',
};

function TimelineRow({ entry, isLast }: { entry: CVEntry; isLast: boolean }) {
  const [open, setOpen] = useState(false);
  const endLabel = entry.endYear === 'present' ? 'Present' : String(entry.endYear);
  const hasDesc = !!entry.description;

  // Date display: use periodLabel+durationLabel if set, otherwise year range
  const dateDisplay = entry.periodLabel
    ? entry.durationLabel
      ? `${entry.periodLabel} · ${entry.durationLabel}`
      : entry.periodLabel
    : `${entry.startYear}–${endLabel} · ${dur(entry.startYear, entry.endYear)}`;

  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center shrink-0" style={{ width: '20px' }}>
        <div style={{ width: 9, height: 9, borderRadius: '50%', backgroundColor: DOT_COLOR[entry.type], marginTop: 4, flexShrink: 0 }} />
        {!isLast && <div style={{ flex: 1, width: 1, backgroundColor: '#e2ddd5', minHeight: '2rem', marginTop: 4 }} />}
      </div>
      <div
        className="pb-6 min-w-0 flex-1"
        onClick={() => hasDesc && setOpen((o) => !o)}
        style={{ cursor: hasDesc ? 'pointer' : 'default' }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-bold leading-snug" style={{ fontSize: '0.92rem', color: '#0a0a0a' }}>{entry.title}</h3>
            <p className="text-sm mt-0.5" style={{ color: '#555' }}>
              {entry.institution}
              {entry.location ? <span style={{ color: '#999' }}> · {entry.location}</span> : null}
            </p>
            <p className="font-mono mt-1" style={{ fontSize: '0.62rem', color: '#aaa', letterSpacing: '0.08em' }}>
              {dateDisplay}
            </p>
          </div>
          {hasDesc && (
            <span style={{ color: '#bbb', fontSize: '0.75rem', flexShrink: 0, marginTop: 2, userSelect: 'none' }}>
              {open ? '−' : '+'}
            </span>
          )}
        </div>
        {open && entry.description && (
          <p className="text-sm mt-3 leading-relaxed" style={{ color: '#666', maxWidth: '52ch' }}>
            {entry.description}
          </p>
        )}
      </div>
    </div>
  );
}

function ArchitectTimeline({ entries, courses, isOnCVPage }: { entries: CVEntry[]; courses?: Course[]; isOnCVPage?: boolean }) {
  const [cvModalOpen, setCvModalOpen] = useState(false);
  const router = useRouter();
  const education = entries.filter((e) => e.type === 'education');
  const experience = entries.filter((e) => e.type === 'experience');
  const skills = (courses ?? []).filter((c) => !c.certificateUrl);
  const certs = (courses ?? []).filter((c) => !!c.certificateUrl);

  return (
    <section id="cv" className="pt-12 pb-16 border-t border-theme-border">
      <div className="max-w-content mx-auto px-6 md:px-10">
        {/* Back to dashboard — only shown on /cv page */}
        {isOnCVPage && (
          <div style={{ marginBottom: '1.5rem' }}>
            <button
              onClick={() => { setCvModalOpen(false); router.push('/'); }}
              className="font-mono transition-all"
              style={{ fontSize: '0.6rem', letterSpacing: '0.14em', color: '#999', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#0a0a0a'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#999'; }}
            >
              ← Dashboard
            </button>
          </div>
        )}
        {/* Header */}
        <div className="flex items-start justify-between mb-10 gap-4">
          <div>
            <p className="section-tag mb-2">Background</p>
            <h2 className="font-black uppercase" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', letterSpacing: '-0.025em', color: '#0a0a0a', lineHeight: 1 }}>
              CV
            </h2>
          </div>
          <div className="flex items-center gap-2 shrink-0 pt-1">
            {isOnCVPage ? (
              <button
                onClick={() => setCvModalOpen(true)}
                className="font-mono uppercase transition-all inline-block"
                style={{ fontSize: '0.52rem', letterSpacing: '0.18em', padding: '7px 13px', border: '1px solid #0a0a0a', color: '#0a0a0a', background: 'none', cursor: 'pointer' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = '#0a0a0a'; (e.currentTarget as HTMLElement).style.color = '#f8f7f3'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#0a0a0a'; }}
              >
                Open PDF ↗
              </button>
            ) : (
              <Link
                href="/cv"
                className="font-mono uppercase transition-all inline-block"
                style={{ fontSize: '0.52rem', letterSpacing: '0.18em', padding: '7px 13px', border: '1px solid #0a0a0a', color: '#0a0a0a', textDecoration: 'none' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = '#0a0a0a'; (e.currentTarget as HTMLElement).style.color = '#f8f7f3'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#0a0a0a'; }}
              >
                Full CV ↗
              </Link>
            )}
            <a
              href="/docs/cvfeb26.pdf"
              download="Juan_Michel_Lafarga_CV.pdf"
              className="font-mono uppercase transition-all inline-block"
              style={{ fontSize: '0.52rem', letterSpacing: '0.18em', padding: '7px 13px', border: '1px solid #ccc', color: '#777', textDecoration: 'none' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#0a0a0a'; (e.currentTarget as HTMLElement).style.color = '#0a0a0a'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#ccc'; (e.currentTarget as HTMLElement).style.color = '#777'; }}
            >
              PDF ↓
            </a>
          </div>
        </div>
        <AnimatePresence>
          {cvModalOpen && <FullCVModal onClose={() => setCvModalOpen(false)} />}
        </AnimatePresence>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
          {/* Left: Timeline */}
          <div>
            {education.length > 0 && (
              <CollapsibleTimelineSection label="Education" defaultOpen>
                {education.map((e, i) => <TimelineRow key={e.id} entry={e} isLast={i === education.length - 1} />)}
              </CollapsibleTimelineSection>
            )}
            {experience.length > 0 && (
              <CollapsibleTimelineSection label="Experience" defaultOpen>
                {experience.map((e, i) => <TimelineRow key={e.id} entry={e} isLast={i === experience.length - 1} />)}
              </CollapsibleTimelineSection>
            )}
          </div>

          {/* Right: Skills + Certs */}
          <div>
            {skills.length > 0 && (
              <div className="mb-8">
                <p className="font-mono uppercase mb-4" style={{ fontSize: '0.58rem', letterSpacing: '0.2em', color: '#999', borderBottom: '1px solid #e8e4de', paddingBottom: '0.5rem' }}>
                  Skills &amp; Courses
                </p>
                <div className="flex flex-wrap gap-2">
                  {skills.map((c) => (
                    <CourseTag key={c.id} course={c} />
                  ))}
                </div>
              </div>
            )}
            {certs.length > 0 && (
              <CollapsibleTimelineSection label="Certifications" defaultOpen>
                <div>
                  {certs.map((c, i) => (
                    <CertRow key={c.id} cert={c} isLast={i === certs.length - 1} />
                  ))}
                </div>
              </CollapsibleTimelineSection>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Main export ────────────────────────────────────────────────────────────────
export default function CVSection({ variant, entries, courses, persona, isOnCVPage }: CVSectionProps) {
  const [modalOpen, setModalOpen] = useState(false);

  if (variant === 'hidden') return null;

  if (variant === 'compact') {
    // Architect bottom: 2 action buttons replacing the compact strip
    if (persona === 'architect') {
      return (
        <section className="border-t border-theme-border" style={{ padding: '2.5rem 0' }}>
          <div className="max-w-content mx-auto px-6 md:px-10 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {/* TODO: replace /docs/portfolio.pdf with the actual portfolio PDF path */}
            <a
              href="/docs/Full_Portfolio_JuanMichel.pdf"
              download="Juan_Michel_Lafarga_Portfolio.pdf"
              className="font-mono uppercase transition-all"
              style={{ fontSize: '0.62rem', letterSpacing: '0.18em', padding: '11px 22px', border: '1px solid #0a0a0a', color: '#0a0a0a', textDecoration: 'none', display: 'inline-block' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = '#0a0a0a'; (e.currentTarget as HTMLElement).style.color = '#f8f7f3'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#0a0a0a'; }}
            >
              Download Portfolio PDF ↓
            </a>
            <Link
              href="/cv"
              className="font-mono uppercase transition-all"
              style={{ fontSize: '0.62rem', letterSpacing: '0.18em', padding: '11px 22px', border: '1px solid #ccc', color: '#777', textDecoration: 'none', display: 'inline-block' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#0a0a0a'; (e.currentTarget as HTMLElement).style.color = '#0a0a0a'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#ccc'; (e.currentTarget as HTMLElement).style.color = '#777'; }}
            >
              See CV ↗
            </Link>
          </div>
        </section>
      );
    }
    const edu = entries.find((e) => e.type === 'education');
    const exp = entries.find((e) => e.type === 'experience');
    return (
      <section id="cv" className="section-compact border-t border-theme-border">
        <div className="max-w-content mx-auto px-6 md:px-10">
          <div className="compact-strip">
            <span className="compact-strip-label">CV</span>
            <span className="compact-strip-sep">·</span>
            {edu && <span>{edu.institution}</span>}
            {exp && <><span className="compact-strip-sep">·</span><span>{exp.title}</span></>}
            <span className="compact-strip-sep">·</span>
            <a href="/cv" className="hover:text-theme-fg transition-colors text-xs">Full CV →</a>
          </div>
        </div>
      </section>
    );
  }

  // Architect → always use LinkedIn timeline (inline on persona page, full on /cv)
  if (persona === 'architect') {
    return <ArchitectTimeline entries={entries} courses={courses} isOnCVPage={isOnCVPage} />;
  }

  // All other cases → 3D paper
  return (
    <>
      <PaperView onOpenModal={() => setModalOpen(true)} />
      <AnimatePresence>
        {modalOpen && <FullCVModal onClose={() => setModalOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
