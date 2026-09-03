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
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 font-sans min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center space-y-6 shadow-2xl">
          <div className="w-12 h-12 rounded-xl bg-rose-950 text-rose-400 border border-rose-800 flex items-center justify-center font-mono font-bold text-lg mx-auto">
            ⚠️
          </div>

          <h2 className="text-xl font-bold text-slate-100">
            Signal Feed Interrupted
          </h2>

          <p className="text-xs text-slate-400 leading-relaxed">
            An unexpected error occurred while processing intelligence data feeds. Our system has logged the issue.
          </p>

          <div className="flex justify-center space-x-3 text-xs font-semibold">
            <button
              onClick={() => reset()}
              className="px-4 py-2 bg-cyan-500 text-slate-950 rounded-lg hover:bg-cyan-400 font-bold transition-colors"
            >
              Retry Load
            </button>
            <Link
              href="/"
              className="px-4 py-2 bg-slate-800 text-slate-200 rounded-lg hover:bg-slate-700 border border-slate-700 transition-colors"
            >
              Back Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
