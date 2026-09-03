import React from 'react';
import Link from 'next/link';
import { Globe, Flame } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { Navbar, Footer } from '@/components/Navigation';

export const revalidate = 60;

export default async function GlobalMapPage() {
  const countries = await prisma.country.findMany({
    include: {
      articles: {
        include: { category: true },
        take: 3,
        orderBy: { publishedAt: 'desc' },
      },
      trends: {
        take: 3,
      },
    },
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-10">
        {/* Global Map Header */}
        <div className="space-y-3 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div className="inline-flex items-center space-x-2 bg-cyan-100 dark:bg-cyan-950 border border-cyan-200 dark:border-cyan-800 text-cyan-800 dark:text-cyan-400 text-xs font-mono uppercase px-2.5 py-0.5 rounded">
            <Globe className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>Global Tech Pulse</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">Global Technology Map & Innovation Hubs</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            Technology is evolving differently around the world. Track local innovations, sovereign policy updates, and regional AI investments outside Silicon Valley.
          </p>
        </div>

        {/* Countries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {countries.map((country) => (
            <div
              key={country.id}
              id={country.code}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-5 shadow-sm dark:shadow-xl hover:border-slate-300 dark:hover:border-slate-700 transition-all"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-cyan-800 dark:text-cyan-400 font-extrabold text-lg bg-cyan-100 dark:bg-cyan-950 border border-cyan-200 dark:border-cyan-800 px-2.5 py-1 rounded">
                    {country.code}
                  </span>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{country.name}</h2>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">{country.region}</span>
                  </div>
                </div>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-950 px-2.5 py-1 rounded border border-slate-200 dark:border-slate-800">
                  {country.articles.length} Stories
                </span>
              </div>

              {/* Regional Trends */}
              {country.trends.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 font-bold tracking-wider flex items-center space-x-1">
                    <Flame className="w-3 h-3 text-rose-500 fill-current" />
                    <span>Regional Trending Topics</span>
                  </span>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {country.trends.map((t) => (
                      <span key={t.id} className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-800 px-2.5 py-1 rounded-lg flex items-center space-x-1.5 font-medium">
                        <span>{t.title}</span>
                        <span className="text-cyan-600 dark:text-cyan-400 font-mono text-[11px]">+{t.searchVelocity.toFixed(0)}%</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Latest Stories in Country */}
              <div className="space-y-3 pt-2">
                <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 font-bold tracking-wider">
                  Latest Intelligence Stories
                </span>
                {country.articles.length > 0 ? (
                  <div className="space-y-2">
                    {country.articles.map((art) => (
                      <Link
                        key={art.id}
                        href={`/news/${art.slug}`}
                        className="p-3 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 rounded-xl block transition-colors group"
                      >
                        <div className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 mb-1">{art.category.name}</div>
                        <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors line-clamp-1">
                          {art.title}
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-slate-400 italic">No region-specific stories tagged yet.</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
