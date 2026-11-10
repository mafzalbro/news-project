import React from 'react';
import Link from 'next/link';
import { Flame, ArrowRight, TrendingUp } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { Navbar, Footer } from '@/components/Navigation';
import { TechSignalBadge } from '@/components/TechSignalComponents';

export const revalidate = 60;

export default async function TrendsPage() {
  const trends = await prisma.trend.findMany({
    orderBy: { score: 'desc' },
    include: {
      articles: {
        include: { category: true, signal: true },
        take: 3,
      },
      countries: true,
    },
  });

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col transition-colors">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-10">
        <header className="section-rule pb-8 space-y-3 max-w-3xl">
          <span className="kicker">
            <Flame className="w-3.5 h-3.5 fill-current" />
            Trend Tracker
          </span>
          <h1 className="font-serif-display text-4xl sm:text-5xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
            Global Tech Signals &amp; Velocity
          </h1>
          <p className="text-base text-stone-600 dark:text-stone-400 leading-relaxed">
            Real-time search momentum combined with news volume and human-impact analysis. Detect emerging shifts before they hit mainstream headlines.
          </p>
        </header>

        <div className="space-y-8">
          {trends.map((trend) => (
            <article
              key={trend.id}
              id={trend.slug}
              className="scroll-mt-32 rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 md:p-8 space-y-6 shadow-xs"
            >
              <div className="flex flex-wrap items-start justify-between gap-5 border-b border-stone-100 dark:border-stone-800 pb-6">
                <div className="space-y-2.5 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="label !text-[10px] px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300">
                      {trend.category}
                    </span>
                    <span className="label !text-[10px] px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-900">
                      {trend.status}
                    </span>
                  </div>
                  <h2 className="font-serif-display text-2xl font-bold text-stone-900 dark:text-stone-50">
                    {trend.title}
                  </h2>
                  <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">{trend.description}</p>
                </div>

                <div className="flex items-center gap-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 px-5 py-3">
                  <div>
                    <div className="label !text-[10px] text-stone-400 dark:text-stone-500">Velocity</div>
                    <div className="text-xl font-bold text-accent flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      +{trend.searchVelocity.toFixed(0)}%
                    </div>
                  </div>
                  <div className="h-9 w-px bg-stone-200 dark:bg-stone-800" />
                  <div>
                    <div className="label !text-[10px] text-stone-400 dark:text-stone-500">Trend Score</div>
                    <div className="text-xl font-bold text-stone-900 dark:text-stone-50">{trend.score.toFixed(1)}<span className="text-xs text-stone-400 font-normal">/100</span></div>
                  </div>
                </div>
              </div>

              {trend.countries.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="label !text-[10px] text-stone-400 dark:text-stone-500">Key regions</span>
                  {trend.countries.map((c) => (
                    <span
                      key={c.id}
                      className="px-2.5 py-1 rounded-full text-xs font-medium bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300"
                    >
                      {c.name} ({c.code})
                    </span>
                  ))}
                </div>
              )}

              {trend.articles.length > 0 && (
                <div className="space-y-4">
                  <h3 className="label text-stone-500 dark:text-stone-400">
                    Related Stories ({trend.articles.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {trend.articles.map((art) => (
                      <Link
                        key={art.id}
                        href={`/news/${art.slug}`}
                        className="group flex flex-col justify-between gap-3 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 p-4 hover:border-stone-300 dark:hover:border-stone-700 transition-colors"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">{art.category.name}</span>
                            {art.signal && <TechSignalBadge score={art.signal.overallScore} size="sm" showLabel={false} />}
                          </div>
                          <h4 className="font-serif-display font-bold text-stone-900 dark:text-stone-100 group-hover:text-accent transition-colors text-sm leading-snug line-clamp-2">
                            {art.title}
                          </h4>
                        </div>
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent group-hover:gap-2.5 transition-all">
                          Read analysis
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
