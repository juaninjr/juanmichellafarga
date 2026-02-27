import type { Metadata } from 'next';
import Navigation from '@/components/Navigation';
import CVSection from '@/components/sections/CVSection';
import Footer from '@/components/Footer';
import { cvEntries, courses } from '@/lib/content';

export const metadata: Metadata = {
  title: 'CV — Juan Michel',
  description: 'Education, experience, awards and courses.',
};

export default function CVPage() {
  return (
    <div style={{ backgroundColor: '#f8f7f3', color: '#0a0a0a', minHeight: '100vh' }}>
      <Navigation mode="landing" />
      <main className="pt-14">
        <CVSection variant="featured" entries={cvEntries} courses={courses} persona="architect" isOnCVPage />
      </main>
      <Footer />
    </div>
  );
}
