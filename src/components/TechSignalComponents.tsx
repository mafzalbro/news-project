'use client';

import React, { useState } from 'react';
import { Flame, Zap, TrendingUp, ChevronDown, ChevronUp, Info } from 'lucide-react';

interface SignalBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function TechSignalBadge({ score, size = 'md', showLabel = true }: SignalBadgeProps) {
  let style = 'bg-stone-100 text-stone-600 border-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-700';
  let icon = <Zap className="w-3 h-3 fill-current" />;
  let label = 'Signal';

  if (score >= 85) {
    style = 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/60 dark:text-red-300 dark:border-red-900';
    icon = <Flame className="w-3 h-3 fill-current" />;
    label = 'Hot Signal';
  } else if (score >= 70) {
    style = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-900';
    icon = <Zap className="w-3 h-3 fill-current" />;
    label = 'High Signal';
  } else if (score >= 50) {
    style = 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-900';
    icon = <TrendingUp className="w-3 h-3" />;
    label = 'Moderate Signal';
  }

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-semibold',
    lg: 'text-xs px-3 py-1.5 gap-2 font-bold',
  };

  return (
    <span className={`inline-flex items-center rounded-full border ${sizeClasses[size]} ${style}`}>
      {icon}
      <span>{score.toFixed(1)}/100</span>
      {showLabel && <span className="opacity-75 font-medium">{label}</span>}
    </span>
  );
}

interface SignalBreakdownProps {
  factors: {
    searchVelocity: number;
    newsMomentum: number;
    socialMomentum?: number;
    humanImpact: number;
    novelty: number;
    credibility: number;
    longTermRelevance: number;
  };
  overallScore: number;
  explanation?: string | null;
  defaultOpen?: boolean;
}

export function SignalBreakdownCard({ factors, overallScore, explanation, defaultOpen = true }: SignalBreakdownProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const factorList = [
    { label: 'Search Velocity', value: factors.searchVelocity, weight: '25%' },
    { label: 'News Momentum', value: factors.newsMomentum, weight: '20%' },
    { label: 'Human & Business Impact', value: factors.humanImpact, weight: '20%' },
    { label: 'Technological Novelty', value: factors.novelty, weight: '15%' },
    { label: 'Source Credibility', value: factors.credibility, weight: '10%' },
    { label: 'Long-term Relevance', value: factors.longTermRelevance, weight: '10%' },
  ];

  return (
    <div className="rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 space-y-5 shadow-xs">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-stone-100 dark:border-stone-800 pb-4">
        <div className="space-y-1">
          <h3 className="font-serif-display text-xl font-bold text-stone-900 dark:text-stone-50">
            Tech Signal Score
          </h3>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            A deterministic rating from search velocity, news momentum, human impact, and source credibility.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <TechSignalBadge score={overallScore} size="lg" />
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle sub-score breakdown"
            className="p-1.5 rounded-full border border-stone-200 dark:border-stone-700 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors cursor-pointer"
          >
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {explanation && (
        <div className="flex items-start gap-2.5 rounded-2xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 p-4">
          <Info className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
          <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
            <strong className="text-stone-800 dark:text-stone-100 font-semibold">Why this score: </strong>
            {explanation}
          </p>
        </div>
      )}

      {isOpen && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {factorList.map((f) => (
            <div key={f.label} className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-stone-700 dark:text-stone-300">{f.label}</span>
                <span className="text-sm font-bold text-stone-900 dark:text-stone-100">{f.value}<span className="text-xs text-stone-400 font-normal">/100</span></span>
              </div>
              <div className="h-1.5 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-red-500 dark:bg-red-400"
                  style={{ width: `${Math.min(100, Math.max(0, f.value))}%` }}
                />
              </div>
              <div className="text-[11px] text-stone-400 dark:text-stone-500">Weight: {f.weight}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
