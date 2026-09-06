'use client';

import React, { useState } from 'react';
import { Flame, Zap, TrendingUp, ChevronDown, ChevronUp, Info } from 'lucide-react';

interface SignalBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function TechSignalBadge({ score, size = 'md', showLabel = true }: SignalBadgeProps) {
  let colorClass = 'bg-slate-900 text-slate-300 border-slate-700';
  let icon = <Zap className="w-3.5 h-3.5 fill-current text-slate-400" />;
  let label = 'Signal';

  if (score >= 85) {
    colorClass = 'bg-rose-950/90 text-rose-400 border-rose-800/80';
    icon = <Flame className="w-3.5 h-3.5 fill-current text-rose-500" />;
    label = 'Hot Signal';
  } else if (score >= 70) {
    colorClass = 'bg-amber-950/90 text-amber-400 border-amber-800/80';
    icon = <Zap className="w-3.5 h-3.5 fill-current text-amber-400" />;
    label = 'High Signal';
  } else if (score >= 50) {
    colorClass = 'bg-cyan-950/90 text-cyan-400 border-cyan-800/80';
    icon = <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />;
    label = 'Moderate Signal';
  }

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 space-x-1 border',
    md: 'text-xs px-2.5 py-1 space-x-1.5 border font-semibold',
    lg: 'text-xs px-3 py-1.5 space-x-2 border font-bold',
  };

  return (
    <div className={`inline-flex items-center rounded-md font-mono ${sizeClasses[size]} ${colorClass}`}>
      <span>{icon}</span>
      <span>{score.toFixed(1)}/100</span>
      {showLabel && <span className="text-[9px] uppercase opacity-80 font-sans tracking-wide">({label})</span>}
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
    <div className="bg-[#0d1322] border border-slate-800/80 rounded-xl p-5 space-y-4 shadow-xs transition-all">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div>
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <span>Tech Signal Intelligence</span>
            <span className="text-[10px] font-mono font-normal text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/80">
              Explainable Score
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Deterministic rating based on multi-factor velocity, human impact & primary credibility metrics.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <TechSignalBadge score={overallScore} size="lg" />
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle sub-score breakdown"
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {explanation && (
        <div className="text-xs text-cyan-300 bg-cyan-950/40 border border-cyan-800/60 p-3 rounded-lg leading-relaxed flex items-start space-x-2">
          <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-cyan-200">Signal Rationale:</strong> {explanation}
          </div>
        </div>
      )}

      {isOpen && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
          {factorList.map((f) => (
            <div key={f.label} className="space-y-1.5 bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80">
              <div className="flex justify-between items-center text-slate-300">
                <span className="font-medium text-[11px]">{f.label}</span>
                <span className="font-mono text-cyan-400 font-bold text-[11px]">{f.value}/100</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-blue-500 to-cyan-400 h-1.5 rounded-full"
                  style={{ width: `${Math.min(100, Math.max(0, f.value))}%` }}
                ></div>
              </div>
              <div className="text-[9px] text-slate-500 font-mono flex justify-between">
                <span>Weight: {f.weight}</span>
                <span>Factor Rating</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

