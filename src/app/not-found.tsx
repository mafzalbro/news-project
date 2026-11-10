import React from 'react';
import Link from 'next/link';
import { Navbar, Footer } from '@/components/Navigation';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col transition-colors">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 text-center py-24 space-y-6 flex flex-col items-center justify-center">
        <span className="label px-4 py-1.5 rounded-full bg-accent-soft text-accent border border-accent">
          Error 404
        </span>

        <h1 className="font-serif-display text-4xl sm:text-5xl font-bold tracking-tight">
          This story doesn&apos;t exist
        </h1>

        <p className="text-base text-stone-600 dark:text-stone-400 max-w-md leading-relaxed">
          The page you&apos;re looking for may have been moved, renamed, or never published. Try the latest news instead.
        </p>

        <div className="pt-4 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="px-5 py-2.5 rounded-full btn-accent font-semibold transition-colors"
          >
            Back to homepage
          </Link>
          <Link
            href="/news"
            className="px-5 py-2.5 rounded-full border border-stone-300 dark:border-stone-700 font-semibold hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            Latest news
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
