import React from 'react';
import Link from 'next/link';
import { Navbar, Footer } from '@/components/Navigation';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 text-center py-24 space-y-6 flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-2xl bg-cyan-100 dark:bg-cyan-950 border border-cyan-200 dark:border-cyan-800 flex items-center justify-center text-2xl font-mono text-cyan-600 dark:text-cyan-400 font-bold">
          404
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100">
          Intelligence Story Not Found
        </h1>

        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">
          The requested intelligence story, trend signal, or sector topic page does not exist or may have been consolidated.
        </p>

        <div className="pt-4 flex flex-wrap justify-center gap-3 text-xs font-semibold">
          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl bg-cyan-600 dark:bg-cyan-500 text-white dark:text-slate-950 font-bold hover:bg-cyan-700 dark:hover:bg-cyan-400 transition-colors shadow-sm"
          >
            Return to Homepage
          </Link>
          <Link
            href="/trends"
            className="px-5 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 transition-colors"
          >
            Explore Trend Tracker
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
