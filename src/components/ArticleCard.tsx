import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Flame, ArrowRight, Clock, Layers } from 'lucide-react';

export interface ArticleCardProps {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: { name: string; slug: string };
  imageUrl?: string | null;
  publishedAt: Date | string;
  techSignal?: {
    overallScore: number;
    searchVelocity?: number;
    humanImpact?: number;
  } | null;
  fiveLayer?: {
    whatHappened: string;
    whyItMatters: string;
    whoIsAffected: string;
    whatsNext: string;
  } | null;
  compact?: boolean;
}

export function ArticleCard({
  slug,
  title,
  summary,
  category,
  imageUrl,
  publishedAt,
  techSignal,
  fiveLayer,
  compact = false,
}: ArticleCardProps) {
  const formattedDate = new Date(publishedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <article className="group bg-white dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800/80 rounded-xl overflow-hidden shadow-xs hover:shadow-md hover:border-cyan-500/30 dark:hover:border-cyan-500/40 transition-all duration-200 flex flex-col h-full">
      {/* Image Header with Compact Badge Overlay */}
      <div className={`relative ${compact ? 'h-36' : 'h-44'} w-full bg-slate-100 dark:bg-slate-900 overflow-hidden shrink-0`}>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover group-hover:scale-103 transition-transform duration-300 ease-out"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-cyan-950/40 via-slate-900 to-slate-950 flex items-center justify-center font-mono text-cyan-400/80 text-xs font-semibold tracking-wider">
            TECHSIGNAL INTELLIGENCE
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent"></div>

        {/* Category & Date Overlay */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          <Link
            href={`/topics/${category.slug}`}
            className="pointer-events-auto bg-slate-950/80 hover:bg-slate-900 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded backdrop-blur-md transition-colors"
          >
            {category.name}
          </Link>
          <span className="text-[10px] font-mono text-slate-300/90 bg-slate-950/70 border border-slate-800/80 px-2 py-0.5 rounded backdrop-blur-md flex items-center space-x-1">
            <Clock className="w-2.5 h-2.5 inline mr-1 text-slate-400" />
            {formattedDate}
          </span>
        </div>

        {/* Signal Score Badge */}
        {techSignal && (
          <div className="absolute bottom-2.5 left-2.5 flex items-center space-x-1.5 bg-slate-950/90 text-white px-2 py-0.5 rounded border border-rose-500/40 text-[11px] font-mono font-bold backdrop-blur-md shadow-xs">
            <Flame className="w-3 h-3 text-rose-400 fill-current" />
            <span>{techSignal.overallScore.toFixed(1)}</span>
            <span className="text-[9px] text-slate-400 font-normal">/100</span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <Link href={`/news/${slug}`}>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors leading-snug line-clamp-2">
              {title}
            </h3>
          </Link>
          <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
            {summary}
          </p>
        </div>

        {/* Five Layer Teaser Box */}
        {fiveLayer && !compact && (
          <div className="bg-slate-50 dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800/80 rounded-lg p-2.5 text-[11px] space-y-1">
            <div className="flex items-start space-x-1.5">
              <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400 shrink-0 uppercase text-[10px]">
                Why It Matters:
              </span>
              <span className="text-slate-700 dark:text-slate-300 line-clamp-1">{fiveLayer.whyItMatters}</span>
            </div>
          </div>
        )}

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-mono">
          <Link
            href={`/news/${slug}`}
            className="text-[11px] font-bold text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 flex items-center space-x-1 group-hover:translate-x-0.5 transition-transform"
          >
            <span>5-Layer Analysis</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
          {fiveLayer && (
            <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center space-x-1">
              <Layers className="w-3 h-3" />
              <span>Full Brief</span>
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

