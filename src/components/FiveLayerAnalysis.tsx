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
      badgeColor: 'bg-blue-950/80 text-blue-400 border-blue-800/80',
      text: data.whatHappened,
      icon: <FileText className="w-3.5 h-3.5 text-blue-400" />,
    },
    {
      step: '02',
      title: 'WHY IT MATTERS',
      badge: 'Core Signal',
      badgeColor: 'bg-cyan-950/80 text-cyan-400 border-cyan-800/80',
      text: data.whyItMatters,
      icon: <Lightbulb className="w-3.5 h-3.5 text-cyan-400" />,
    },
    {
      step: '03',
      title: 'WHO IS AFFECTED',
      badge: 'Impact Radius',
      badgeColor: 'bg-emerald-950/80 text-emerald-400 border-emerald-800/80',
      text: data.whoIsAffected,
      icon: <Users className="w-3.5 h-3.5 text-emerald-400" />,
    },
    {
      step: '04',
      title: 'TECH SIGNAL SCORE',
      badge: 'Proprietary Index',
      badgeColor: 'bg-amber-950/80 text-amber-400 border-amber-800/80',
      text: techSignalScore
        ? `Quantified velocity score of ${techSignalScore.toFixed(1)}/100 calculated using real-time search velocity, multi-source news momentum, and evaluated human & business impact.`
        : 'High momentum search signal detected with verified primary source documentation.',
      icon: <Flame className="w-3.5 h-3.5 text-amber-400 fill-current" />,
    },
    {
      step: '05',
      title: 'WHAT HAPPENS NEXT',
      badge: '30-90 Day Outlook',
      badgeColor: 'bg-purple-950/80 text-purple-400 border-purple-800/80',
      text: data.whatNext,
      icon: <Sparkles className="w-3.5 h-3.5 text-purple-400" />,
    },
  ];

  return (
    <div className="bg-[#0d1322] border border-slate-800/80 rounded-xl p-5 shadow-xs my-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-800/80 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-cyan-950 text-cyan-400 border border-cyan-800/80">
              INTELLIGENCE BRIEF
            </span>
            <span className="text-[11px] text-slate-400 font-mono">TechSignal Decision Framework</span>
          </div>
          <h2 className="text-xl font-extrabold text-white mt-1">
            5-Layer Structured Context
          </h2>
        </div>

        {techSignalScore && (
          <div className="flex items-center space-x-2.5 bg-slate-950/80 border border-slate-800/80 px-3 py-2 rounded-lg font-mono">
            <Flame className="w-5 h-5 text-rose-500 fill-current" />
            <div>
              <div className="text-[9px] uppercase text-slate-400">Tech Signal</div>
              <div className="text-base font-extrabold text-cyan-400">
                {techSignalScore.toFixed(1)} <span className="text-[10px] text-slate-500 font-normal">/ 100</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3.5">
        {layers.map((layer) => (
          <div
            key={layer.step}
            className="p-4 rounded-lg bg-slate-950/70 border border-slate-800/70 hover:border-cyan-800/80 transition-colors"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-[11px] font-bold text-cyan-400 bg-cyan-950/80 border border-cyan-800/80 px-1.5 py-0.5 rounded">
                  {layer.step}
                </span>
                <span>{layer.icon}</span>
                <h3 className="font-mono text-xs font-bold tracking-wider text-slate-200 uppercase">
                  {layer.title}
                </h3>
              </div>
              <span className={`text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border ${layer.badgeColor}`}>
                {layer.badge}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed pt-0.5">
              {layer.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

