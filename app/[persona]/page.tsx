import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PERSONAS, PERSONA_SLUGS, isValidPersona } from '@/lib/personas';
import Navigation from '@/components/Navigation';
import SectionRenderer from '@/components/SectionRenderer';
import { PersonaSaveEffect } from '@/components/PersonaSaveEffect';
import Footer from '@/components/Footer';
import GalleryGate from '@/components/GalleryGate';

interface PersonaPageProps {
  params: { persona: string };
}

export async function generateStaticParams() {
  return PERSONA_SLUGS.map((persona) => ({ persona }));
}

export async function generateMetadata({ params }: PersonaPageProps): Promise<Metadata> {
  if (!isValidPersona(params.persona)) return {};
  const config = PERSONAS[params.persona];
  const title = `Juan Michel — ${config.label}`;
  return {
    title,
    description: config.tagline,
    openGraph: {
      title,
      description: config.tagline,
      url: `https://whoisjuanmichel.com/${params.persona}`,
    },
  };
}

export default function PersonaPage({ params }: PersonaPageProps) {
  if (!isValidPersona(params.persona)) notFound();

  const config = PERSONAS[params.persona];

  const pageContent = (
    <div
      data-persona={config.slug}
      className="min-h-screen"
      style={{
        backgroundColor: config.theme.background,
        color: config.theme.foreground,
      }}
    >
      {/* Save to localStorage */}
      <PersonaSaveEffect slug={config.slug} />

      {/* Navigation — fixed, 56px height */}
      <Navigation mode="persona" persona={config.slug} />

      {/* Content starts right after nav — no hero, no intro */}
      <main style={{ paddingTop: '56px' }}>
        <SectionRenderer config={config} />
      </main>

      {config.slug !== 'artist' && <Footer persona={config.slug} />}
    </div>
  );

  // Artist gallery is gated — edit components/GalleryGate.tsx to toggle or change the message
  if (config.slug === 'artist') {
    return <GalleryGate>{pageContent}</GalleryGate>;
  }

  return pageContent;
}
