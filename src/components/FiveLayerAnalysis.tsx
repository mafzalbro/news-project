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
      title: 'What Happened',
      tag: 'The Facts',
      text: data.whatHappened,
      icon: <FileText className="w-4 h-4" />,
    },
    {
      step: '02',
      title: 'Why It Matters',
      tag: 'The Stakes',
      text: data.whyItMatters,
      icon: <Lightbulb className="w-4 h-4" />,
    },
    {
      step: '03',
      title: 'Who Is Affected',
      tag: 'The Impact',
      text: data.whoIsAffected,
      icon: <Users className="w-4 h-4" />,
    },
    {
      step: '04',
      title: 'Tech Signal Score',
      tag: 'The Index',
      text: techSignalScore
        ? `Quantified velocity score of ${techSignalScore.toFixed(1)}/100, calculated from real-time search velocity, multi-source news momentum, and evaluated human & business impact.`
        : 'High-momentum search signal detected with verified primary-source documentation.',
      icon: <Flame className="w-4 h-4 fill-current" />,
    },
    {
      step: '05',
      title: 'What Happens Next',
      tag: 'The Outlook',
      text: data.whatNext,
      icon: <Sparkles className="w-4 h-4" />,
    },
  ];

  return (
    <section className="rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 md:p-8 space-y-6 shadow-xs">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 dark:border-stone-800 pb-5">
        <div className="space-y-1">
          <span className="label text-red-600 dark:text-red-400">Intelligence Brief</span>
          <h2 className="font-serif-display text-2xl font-bold text-stone-900 dark:text-stone-50">
            The 5-Layer Context
          </h2>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            Everything you need to understand this story, in five labeled layers.
          </p>
        </div>

        {techSignalScore && (
          <div className="flex items-center gap-3 rounded-2xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 px-4 py-2.5">
            <Flame className="w-5 h-5 text-red-500 fill-current" />
            <div>
              <div className="label !text-[10px] text-stone-400 dark:text-stone-500">Signal</div>
              <div className="text-lg font-bold text-stone-900 dark:text-stone-50">
                {techSignalScore.toFixed(1)} <span className="text-xs text-stone-400 font-normal">/ 100</span>
              </div>
            </div>
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {layers.map((layer, i) => (
          <div
            key={layer.step}
            className={`rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 p-5 space-y-2.5 ${
              i === layers.length - 1 ? 'md:col-span-2' : ''
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-red-600 dark:text-red-400">
                  {layer.icon}
                </span>
                <h3 className="font-serif-display font-bold text-base text-stone-900 dark:text-stone-50">
                  {layer.title}
                </h3>
              </div>
              <span className="label !text-[10px] px-2.5 py-1 rounded-full bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-500 dark:text-stone-400">
                {layer.tag}
              </span>
            </div>
            <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">{layer.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
