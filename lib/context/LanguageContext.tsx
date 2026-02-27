'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export type Locale = 'en' | 'es';

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

// ─── TRANSLATIONS ─────────────────────────────────────────────────────────────
// Add Spanish translations here when ready.
const translations: Record<Locale, Record<string, string>> = {
  en: {
    // Navigation
    'nav.viewingAs': 'Viewing as',
    'nav.switchView': 'Switch view',
    'nav.fullEcosystem': 'Full dashboard',
    // Landing
    'landing.title': 'Juan Michel',
    'landing.subtitle': 'A dashboard of disciplines',
    'landing.whoAreYou': 'Who are you looking for?',
    'landing.welcomeBack': 'Welcome back —',
    'landing.continueAs': 'Continue as',
    'landing.dismiss': 'Dismiss',
    // Sections
    'section.studio': 'Studio',
    'section.papers': 'Papers',
    'section.cv': 'CV & Timeline',
    'section.courses': 'Courses & Certifications',
    'section.client-music': 'Music Projects',
    'section.performances': 'Performances',
    'section.art': 'Art',
    'section.emisito': 'emisito',
    // Section tags
    'tag.studio': 'University Portfolio',
    'tag.papers': 'Academic Writing',
    'tag.cv': 'Background',
    'tag.courses': 'Continuing Education',
    'tag.client-music': 'Music Production',
    'tag.performances': 'Live Music',
    'tag.art': 'Visual Art',
    'tag.emisito': 'Music Brand',
    // CV categories
    'cv.education': 'Education',
    'cv.experience': 'Experience',
    'cv.awards': 'Awards',
    'cv.all': 'All',
    'cv.download': 'Download CV (PDF)',
    // Misc
    'misc.viewAll': 'View all',
    'misc.read': 'Read',
    'misc.listen': 'Listen',
    'misc.present': 'Present',
    'misc.private': 'Private Project',
  },
  es: {
    // Navigation
    'nav.viewingAs': 'Viendo como',
    'nav.switchView': 'Cambiar vista',
    'nav.fullEcosystem': 'Ecosistema completo',
    // Landing
    'landing.title': 'Juan Michel',
    'landing.subtitle': 'Un ecosistema de disciplinas',
    'landing.whoAreYou': '¿Quién buscas?',
    'landing.welcomeBack': 'Bienvenido de vuelta —',
    'landing.continueAs': 'Continuar como',
    'landing.dismiss': 'Descartar',
    // Sections
    'section.studio': 'Estudio',
    'section.papers': 'Publicaciones',
    'section.cv': 'CV y Trayectoria',
    'section.courses': 'Cursos y Certificaciones',
    'section.client-music': 'Proyectos Musicales',
    'section.performances': 'Actuaciones',
    'section.art': 'Arte',
    'section.emisito': 'emisito',
    // Section tags
    'tag.studio': 'Portfolio Universitario',
    'tag.papers': 'Escritura Académica',
    'tag.cv': 'Trayectoria',
    'tag.courses': 'Educación Continua',
    'tag.client-music': 'Producción Musical',
    'tag.performances': 'Música en Vivo',
    'tag.art': 'Arte Visual',
    'tag.emisito': 'Marca Musical',
    // CV categories
    'cv.education': 'Educación',
    'cv.experience': 'Experiencia',
    'cv.awards': 'Reconocimientos',
    'cv.all': 'Todo',
    'cv.download': 'Descargar CV (PDF)',
    // Misc
    'misc.viewAll': 'Ver todo',
    'misc.read': 'Leer',
    'misc.listen': 'Escuchar',
    'misc.present': 'Actualidad',
    'misc.private': 'Proyecto Privado',
  },
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en');

  const t = (key: string): string => {
    return translations[locale][key] ?? translations['en'][key] ?? key;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
