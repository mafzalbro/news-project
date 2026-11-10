'use client';

import React, { useEffect, useState } from 'react';
import { Paintbrush, X, Check } from 'lucide-react';

const THEMES = [
  { id: 'red', label: 'Signal Red', color: '#dc2626' },
  { id: 'blue', label: 'Editorial Blue', color: '#2563eb' },
  { id: 'violet', label: 'Violet', color: '#7c3aed' },
  { id: 'emerald', label: 'Emerald', color: '#059669' },
  { id: 'amber', label: 'Amber', color: '#d97706' },
  { id: 'slate', label: 'Ink Slate', color: '#334155' },
];

/**
 * Dev-only floating tool: switches the global accent color by setting
 * data-accent on <html>. Hidden in production builds.
 */
export function ThemeStudio() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('red');
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      setEnabled(true);
      const saved = localStorage.getItem('accent') || 'red';
      setActive(saved);
      document.documentElement.dataset.accent = saved;
    }
  }, []);

  if (!enabled) return null;

  const pick = (id: string) => {
    setActive(id);
    document.documentElement.dataset.accent = id;
    localStorage.setItem('accent', id);
  };

  return (
    <div className="fixed bottom-5 right-5 z-[60] flex flex-col items-end gap-2.5">
      {open && (
        <div className="w-52 rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 shadow-xl p-3 space-y-1">
          <div className="label !text-[10px] text-stone-400 dark:text-stone-500 px-1 pb-1.5">
            Dev · Accent theme
          </div>
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => pick(t.id)}
              className={`w-full flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm transition-colors cursor-pointer ${
                active === t.id
                  ? 'bg-stone-100 dark:bg-stone-800 font-semibold text-stone-900 dark:text-stone-100'
                  : 'text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800/60'
              }`}
            >
              <span
                className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                style={{ backgroundColor: t.color }}
              />
              <span className="flex-1 text-left">{t.label}</span>
              {active === t.id && <Check className="w-3.5 h-3.5" />}
            </button>
          ))}
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        aria-label="Toggle dev theme studio"
        title="Dev theme studio"
        className="w-11 h-11 rounded-full bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-transform cursor-pointer"
      >
        {open ? <X className="w-5 h-5" /> : <Paintbrush className="w-5 h-5" />}
      </button>
    </div>
  );
}
