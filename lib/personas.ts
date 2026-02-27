// ─── TYPES ───────────────────────────────────────────────────────────────────

export type PersonaSlug = 'architect' | 'musician' | 'artist';

export type SectionId =
  | 'studio'
  | 'cv'
  | 'courses'
  | 'client-music'
  | 'performances'
  | 'art';

export type SectionVariant = 'featured' | 'standard' | 'compact' | 'hidden';

export interface PersonaTheme {
  accent: string;
  background: string;
  foreground: string;
  isDark: boolean;
  headingFont: 'cormorant' | 'spacemono';
}

export interface SectionConfig {
  id: SectionId;
  variant: SectionVariant;
  order: number;
}

export interface PersonaConfig {
  slug: PersonaSlug;
  label: string;
  shortLabel: string;
  tagline: string;
  symbol: string;
  lensDesc: string;
  theme: PersonaTheme;
  sections: SectionConfig[];
}

// ─── PERSONA RECORDS ─────────────────────────────────────────────────────────

export const PERSONAS: Record<PersonaSlug, PersonaConfig> = {
  architect: {
    slug: 'architect',
    label: 'The Architect',
    shortLabel: 'Architect',
    tagline: 'Designing space, structure, and experience.',
    symbol: '⬡',
    lensDesc: 'Studio portfolio & CV',
    theme: {
      accent: '#2c4a6e',
      background: '#f8f7f3',
      foreground: '#1a1a18',
      isDark: false,
      headingFont: 'cormorant',
    },
    sections: [
      { id: 'studio',        variant: 'featured',  order: 1 },
      { id: 'cv',            variant: 'compact',   order: 2 },
      { id: 'courses',       variant: 'hidden',    order: 3 },
      { id: 'client-music',  variant: 'hidden',    order: 4 },
      { id: 'performances',  variant: 'hidden',    order: 5 },
      { id: 'art',           variant: 'hidden',    order: 6 },
    ],
  },

  musician: {
    slug: 'musician',
    label: 'The Musician',
    shortLabel: 'Musician',
    tagline: 'Composition, performance, and sonic craft.',
    symbol: '◐',
    lensDesc: 'Composition, production & performance',
    theme: {
      accent: '#8b5e3c',
      background: '#f8f7f3',
      foreground: '#1a1a18',
      isDark: false,
      headingFont: 'cormorant',
    },
    sections: [
      { id: 'performances',  variant: 'featured',  order: 1 },
      { id: 'client-music',  variant: 'featured',  order: 2 },
      { id: 'cv',            variant: 'hidden',    order: 3 },
      { id: 'studio',        variant: 'hidden',    order: 4 },
      { id: 'art',           variant: 'hidden',    order: 5 },
      { id: 'courses',       variant: 'hidden',    order: 6 },
    ],
  },

  artist: {
    slug: 'artist',
    label: 'The Artist',
    shortLabel: 'Artist',
    tagline: 'Visual work, across media and scale.',
    symbol: '◈',
    lensDesc: 'Visual art & personal portfolio',
    theme: {
      accent: '#c45c3a',
      background: '#f8f7f3',
      foreground: '#1a1a18',
      isDark: false,
      headingFont: 'cormorant',
    },
    sections: [
      { id: 'art',           variant: 'featured',  order: 1 },
      { id: 'studio',        variant: 'hidden',    order: 2 },
      { id: 'cv',            variant: 'hidden',    order: 3 },
      { id: 'client-music',  variant: 'hidden',    order: 4 },
      { id: 'courses',       variant: 'hidden',    order: 5 },
      { id: 'performances',  variant: 'hidden',    order: 6 },
    ],
  },
};

export const PERSONA_SLUGS = Object.keys(PERSONAS) as PersonaSlug[];

export const STORAGE_KEY = 'jm_persona';

export function isValidPersona(slug: string): slug is PersonaSlug {
  return slug in PERSONAS;
}

// Section labels used in navigation
export const SECTION_LABELS: Record<SectionId, string> = {
  studio: 'Studio',
  cv: 'CV',
  courses: 'Courses',
  'client-music': 'Music',
  performances: 'Performances',
  art: 'Art',
};
