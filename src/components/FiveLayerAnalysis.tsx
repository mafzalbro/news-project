import React from 'react';
import { FileText, Lightbulb, Users, Flame, Sparkles } from 'lucide-react';

export interface FiveLayerData {
  whatHappened: string;
  whyItMatters: string;
  whoIsAffected: string;
  whatNext: string;
}

export interface FiveLayerAnalysisProps {
  data: FiveLayerData;
  techSignalScore?: number;
}

export function FiveLayerAnalysis({ data, techSignalScore }: FiveLayerAnalysisProps) {
  const layers = [
    {
      step: '01',
      title: 'WHAT HAPPENED',
      badge: 'Fact Context',
      badgeColor: 'bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-400 border-blue-200 dark:border-blue-800/80',
      text: data.whatHappened,
      icon: <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />,
    },
    {
      step: '02',
      title: 'WHY IT MATTERS',
      badge: 'Core Signal',
      badgeColor: 'bg-cyan-100 dark:bg-cyan-950/80 text-cyan-800 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800/80',
      text: data.whyItMatters,
      icon: <Lightbulb className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />,
    },
    {
      step: '03',
      title: 'WHO IS AFFECTED',
      badge: 'Impact Radius',
      badgeColor: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/80',
      text: data.whoIsAffected,
      icon: <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
    },
    {
      step: '04',
      title: 'TECH SIGNAL SCORE',
      badge: 'Proprietary Index',
      badgeColor: 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-400 border-amber-200 dark:border-amber-800/80',
      text: techSignalScore
        ? `Quantified velocity score of ${techSignalScore.toFixed(1)}/100 calculated using real-time search velocity, multi-source news momentum, and evaluated human & business impact.`
        : 'High momentum search signal detected with verified primary source documentation.',
      icon: <Flame className="w-4 h-4 text-amber-600 dark:text-amber-400 fill-current" />,
    },
    {
      step: '05',
      title: 'WHAT HAPPENS NEXT',
      badge: '30-90 Day Outlook',
      badgeColor: 'bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-400 border-purple-200 dark:border-purple-800/80',
      text: data.whatNext,
      icon: <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />,
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm my-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-200 dark:border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold uppercase tracking-wider bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800">
              INTELLIGENCE BRIEF
            </span>
            <span className="text-xs text-slate-500 font-mono">TechSignal Decision Framework</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
            5-Layer Structured Context
          </h2>
        </div>

        {techSignalScore && (
          <div className="flex items-center space-x-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-4 py-2.5 rounded-xl">
            <Flame className="w-6 h-6 text-rose-500 fill-current" />
            <div>
              <div className="text-[10px] font-mono uppercase text-slate-500">Tech Signal</div>
              <div className="text-lg font-extrabold text-cyan-600 dark:text-cyan-400 font-mono">
                {techSignalScore.toFixed(1)} <span className="text-xs text-slate-400 font-normal">/ 100</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5">
        {layers.map((layer) => (
          <div
            key={layer.step}
            className="p-5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 hover:border-cyan-300 dark:hover:border-cyan-800 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2.5">
                <span className="font-mono text-xs font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/80 border border-cyan-200 dark:border-cyan-800 px-2 py-0.5 rounded">
                  {layer.step}
                </span>
                <span>{layer.icon}</span>
                <h3 className="font-mono text-xs font-bold tracking-wider text-slate-900 dark:text-slate-200 uppercase">
                  {layer.title}
                </h3>
              </div>
              <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border ${layer.badgeColor}`}>
                {layer.badge}
              </span>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed pt-1">
              {layer.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
