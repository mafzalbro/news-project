'use client';

import React, { useState } from 'react';
import { Flame, Zap, TrendingUp, ChevronDown, ChevronUp, Info } from 'lucide-react';

interface SignalBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function TechSignalBadge({ score, size = 'md', showLabel = true }: SignalBadgeProps) {
  let colorClass = 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
  let icon = <Zap className="w-3.5 h-3.5 fill-current text-slate-500" />;
  let label = 'Signal';

  if (score >= 85) {
    colorClass = 'bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800/80';
    icon = <Flame className="w-3.5 h-3.5 fill-current text-rose-500" />;
    label = 'Hot Signal';
  } else if (score >= 70) {
    colorClass = 'bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/80';
    icon = <Zap className="w-3.5 h-3.5 fill-current text-amber-500" />;
    label = 'High Signal';
  } else if (score >= 50) {
    colorClass = 'bg-cyan-50 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800/80';
    icon = <TrendingUp className="w-3.5 h-3.5 text-cyan-500" />;
    label = 'Moderate Signal';
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 space-x-1 border',
    md: 'text-xs px-2.5 py-1 space-x-1.5 border font-semibold',
    lg: 'text-sm px-3.5 py-1.5 space-x-2 border font-bold',
  };

  return (
    <div className={`inline-flex items-center rounded-full font-mono ${sizeClasses[size]} ${colorClass}`}>
      <span>{icon}</span>
      <span>{score.toFixed(1)}/100</span>
      {showLabel && <span className="text-[10px] uppercase opacity-80 font-sans tracking-wide">({label})</span>}
    </div>
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
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 md:p-6 space-y-4 shadow-sm transition-all">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <span>Tech Signal Intelligence</span>
            <span className="text-xs font-mono font-normal text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
              Explainable Score
            </span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Deterministic rating based on multi-factor velocity, human impact & primary credibility metrics.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <TechSignalBadge score={overallScore} size="lg" />
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle sub-score breakdown"
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {explanation && (
        <div className="text-xs text-cyan-800 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800/50 p-3 rounded-lg leading-relaxed flex items-start space-x-2">
          <Info className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-cyan-900 dark:text-cyan-200">Signal Rationale:</strong> {explanation}
          </div>
        </div>
      )}

      {isOpen && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2 animate-fadeIn">
          {factorList.map((f) => (
            <div key={f.label} className="space-y-1.5 bg-slate-50 dark:bg-slate-950/60 p-3 rounded-lg border border-slate-200 dark:border-slate-800/80">
              <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                <span className="font-medium">{f.label}</span>
                <span className="font-mono text-cyan-600 dark:text-cyan-400 font-semibold">{f.value}/100</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 h-1.5 rounded-full"
                  style={{ width: `${Math.min(100, Math.max(0, f.value))}%` }}
                ></div>
              </div>
              <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono flex justify-between">
                <span>Weight: {f.weight}</span>
                <span>Factor Score</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
