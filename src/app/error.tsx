'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled app error:', error);
  }, [error]);

  return (
    <html lang="en" className="light">
      <body
        className="bg-stone-50 text-stone-900 antialiased min-h-screen flex items-center justify-center p-4"
        style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
      >
        <div className="max-w-md w-full bg-white border border-stone-200 p-8 rounded-3xl text-center space-y-6 shadow-sm">
          <span className="inline-flex label px-4 py-1.5 rounded-full bg-red-50 text-red-700 border border-red-200">
            Something went wrong
          </span>

          <h2 className="text-2xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>
            We hit an unexpected error
          </h2>

          <p className="text-sm text-stone-500 leading-relaxed">
            The page failed to load. Our system has logged the issue — try again or head back to the homepage.
          </p>

          <div className="flex justify-center gap-3">
            <button
              onClick={() => reset()}
              className="px-5 py-2.5 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 transition-colors"
            >
              Try again
            </button>
            <Link
              href="/"
              className="px-5 py-2.5 border border-stone-300 rounded-full font-semibold hover:bg-stone-100 transition-colors"
            >
              Back home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
