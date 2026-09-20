import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Clock } from 'lucide-react';

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

function signalStyle(score: number) {
  if (score >= 85) return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/60 dark:text-red-300 dark:border-red-900';
  if (score >= 70) return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-900';
  return 'bg-stone-50 text-stone-600 border-stone-200 dark:bg-stone-900 dark:text-stone-300 dark:border-stone-700';
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
    <article className="group flex flex-col h-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden shadow-xs hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
      {/* Image */}
      <Link href={`/news/${slug}`} className="relative block w-full h-44 shrink-0 overflow-hidden bg-stone-100 dark:bg-stone-800">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-stone-100 to-stone-200 dark:from-stone-800 dark:to-stone-900 flex items-center justify-center">
            <span className="font-serif-display italic text-sm text-stone-400 dark:text-stone-500">TechSignal</span>
          </div>
        )}
        {/* Signal score chip */}
        {techSignal && (
          <span
            className={`absolute top-3 right-3 label !text-[10px] px-2 py-1 rounded-full border backdrop-blur-sm bg-white/90 dark:bg-stone-950/90 ${signalStyle(techSignal.overallScore)}`}
          >
            Signal {techSignal.overallScore.toFixed(0)}
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-2.5">
        <div className="flex items-center justify-between gap-2">
          <Link
            href={`/topics/${category.slug}`}
            className="kicker hover:underline underline-offset-4"
          >
            {category.name}
          </Link>
          <span className="flex items-center gap-1 text-[11px] text-stone-400 dark:text-stone-500 shrink-0">
            <Clock className="w-3 h-3" />
            {formattedDate}
          </span>
        </div>

        <Link href={`/news/${slug}`}>
          <h3 className="font-serif-display text-lg font-bold leading-snug text-stone-900 dark:text-stone-50 group-hover:text-accent transition-colors line-clamp-2">
            {title}
          </h3>
        </Link>

        {!compact && (
          <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed line-clamp-2">
            {summary}
          </p>
        )}

        {fiveLayer && !compact && (
          <div className="mt-auto pt-3 border-t border-stone-100 dark:border-stone-800">
            <p className="text-xs leading-relaxed text-stone-500 dark:text-stone-400 line-clamp-2">
              <span className="label !text-[10px] text-stone-700 dark:text-stone-300 mr-1.5">Why it matters</span>
              {fiveLayer.whyItMatters}
            </p>
          </div>
        )}

        <Link
          href={`/news/${slug}`}
          className="mt-auto inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:gap-2.5 transition-all"
        >
          {fiveLayer ? 'Read the analysis' : 'Read story'}
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </article>
  );
}
