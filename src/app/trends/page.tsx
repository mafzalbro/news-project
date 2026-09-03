import React from 'react';
import Link from 'next/link';
import { Flame, ArrowRight } from 'lucide-react';
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-10">
        {/* Trends Header */}
        <div className="space-y-3 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div className="inline-flex items-center space-x-2 bg-cyan-100 dark:bg-cyan-950 border border-cyan-200 dark:border-cyan-800 text-cyan-800 dark:text-cyan-400 text-xs font-mono uppercase px-2.5 py-0.5 rounded">
            <Flame className="w-3.5 h-3.5 text-rose-500 fill-current" />
            <span>Proprietary Trend Tracker</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">Global Tech Signals & Velocity</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            Real-time search momentum combined with news volume and human impact analysis. Detect emerging shifts before they hit mainstream headlines.
          </p>
        </div>

        {/* Trends List */}
        <div className="space-y-8">
          {trends.map((trend) => (
            <div
              key={trend.id}
              id={trend.slug}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-sm dark:shadow-xl"
            >
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-mono font-semibold uppercase text-cyan-800 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-950 border border-cyan-200 dark:border-cyan-800 px-2 py-0.5 rounded">
                      {trend.category}
                    </span>
                    <span className="text-xs font-mono text-emerald-800 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded">
                      Status: {trend.status}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 pt-1">{trend.title}</h2>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-w-3xl">{trend.description}</p>
                </div>

                <div className="flex items-center space-x-4 bg-slate-50 dark:bg-slate-950/80 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="text-center font-mono">
                    <div className="text-[10px] text-slate-500 uppercase">Velocity</div>
                    <div className="text-lg font-bold text-cyan-600 dark:text-cyan-400">+{trend.searchVelocity.toFixed(0)}%</div>
                  </div>
                  <div className="h-8 w-px bg-slate-200 dark:bg-slate-800"></div>
                  <div className="text-center font-mono">
                    <div className="text-[10px] text-slate-500 uppercase">Trend Score</div>
                    <div className="text-lg font-bold text-slate-900 dark:text-slate-100">{trend.score.toFixed(1)}/100</div>
                  </div>
                </div>
              </div>

              {/* Geographic Footprint */}
              {trend.countries.length > 0 && (
                <div className="flex items-center space-x-2 text-xs font-mono text-slate-500 dark:text-slate-400">
                  <span className="text-slate-400 uppercase">Key Regions:</span>
                  {trend.countries.map((c) => (
                    <span key={c.id} className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                      {c.name} ({c.code})
                    </span>
                  ))}
                </div>
              )}

              {/* Connected Articles */}
              {trend.articles.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">
                    Associated Intelligence Stories ({trend.articles.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {trend.articles.map((art) => (
                      <Link
                        key={art.id}
                        href={`/news/${art.slug}`}
                        className="p-4 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 rounded-xl transition-all flex flex-col justify-between group"
                      >
                        <div>
                          <div className="flex items-center justify-between text-[11px] mb-2">
                            <span className="text-cyan-600 dark:text-cyan-400 font-mono">{art.category.name}</span>
                            {art.signal && <TechSignalBadge score={art.signal.overallScore} size="sm" showLabel={false} />}
                          </div>
                          <h4 className="font-semibold text-slate-900 dark:text-slate-200 group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors text-sm line-clamp-2">
                            {art.title}
                          </h4>
                        </div>
                        <span className="text-[11px] text-cyan-600 dark:text-cyan-400 font-medium pt-3 group-hover:translate-x-1 transition-transform inline-flex items-center space-x-1">
                          <span>Read analysis</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
