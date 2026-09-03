import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Flame, ArrowRight } from 'lucide-react';

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
}: ArticleCardProps) {
  const formattedDate = new Date(publishedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <article className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col h-full">
      {/* Image Header with Badge Overlay */}
      <div className="relative h-48 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center font-mono text-cyan-600 dark:text-cyan-400 font-semibold">
            TechSignal Intelligence
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>

        {/* Category Overlay */}
        <div className="absolute top-3 left-3 flex items-center space-x-2">
          <Link
            href={`/topics/${category.slug}`}
            className="bg-white/90 dark:bg-slate-900/90 text-cyan-800 dark:text-cyan-400 border border-slate-200 dark:border-slate-700/80 text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md backdrop-blur-sm hover:bg-white dark:hover:bg-slate-800 transition-colors"
          >
            {category.name}
          </Link>
        </div>

        {/* Signal Score Badge */}
        {techSignal && (
          <div className="absolute bottom-3 left-3 flex items-center space-x-1.5 bg-slate-900/90 text-white px-2.5 py-1 rounded-md border border-cyan-500/40 text-xs font-mono font-bold backdrop-blur-sm">
            <Flame className="w-3.5 h-3.5 text-rose-400 fill-current" />
            <span>{techSignal.overallScore.toFixed(1)}/100</span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mb-2">
            {formattedDate}
          </div>
          <Link href={`/news/${slug}`}>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors leading-snug line-clamp-2">
              {title}
            </h3>
          </Link>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
            {summary}
          </p>
        </div>

        {/* Five Layer Teaser Box */}
        {fiveLayer && (
          <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 rounded-lg p-3 space-y-2">
            <div className="flex items-start space-x-2 text-xs">
              <span className="font-semibold text-cyan-700 dark:text-cyan-400 shrink-0 font-mono">Why It Matters:</span>
              <span className="text-slate-700 dark:text-slate-300 line-clamp-2">{fiveLayer.whyItMatters}</span>
            </div>
          </div>
        )}

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
          <Link
            href={`/news/${slug}`}
            className="font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 flex items-center space-x-1 group-hover:translate-x-0.5 transition-transform"
          >
            <span>Read 5-Layer Analysis</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
