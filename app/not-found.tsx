import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-theme-bg text-theme-fg">
      <p className="font-mono text-xs uppercase tracking-widest text-theme-muted mb-6">404</p>
      <h1 className="heading-display text-display-md text-theme-fg mb-4">
        Not found
      </h1>
      <p className="text-theme-muted mb-10 max-w-sm">
        This page doesn&apos;t exist. Return to the dashboard and choose a lens.
      </p>
      <Link
        href="/"
        className="border border-theme-border px-6 py-2.5 text-sm font-mono hover:border-theme-accent hover:text-theme-accent transition-colors"
      >
        Back to dashboard →
      </Link>
    </div>
  );
}
