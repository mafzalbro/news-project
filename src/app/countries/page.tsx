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
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col transition-colors">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-10">
        <header className="section-rule pb-8 space-y-3 max-w-3xl">
          <span className="kicker">
            <Globe className="w-3.5 h-3.5" />
            Global Tech Pulse
          </span>
          <h1 className="font-serif-display text-4xl sm:text-5xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
            Global Technology Map
          </h1>
          <p className="text-base text-stone-600 dark:text-stone-400 leading-relaxed">
            Technology is evolving differently around the world. Track local innovation, sovereign policy updates, and regional AI investments beyond Silicon Valley.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {countries.map((country) => (
            <section
              key={country.id}
              id={country.code}
              className="scroll-mt-32 rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 space-y-5 shadow-xs hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between gap-3 border-b border-stone-100 dark:border-stone-800 pb-4">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-11 h-11 rounded-2xl bg-stone-100 dark:bg-stone-800 text-sm font-bold text-stone-700 dark:text-stone-300">
                    {country.code}
                  </span>
                  <div>
                    <h2 className="font-serif-display text-xl font-bold text-stone-900 dark:text-stone-50">{country.name}</h2>
                    <span className="text-xs text-stone-400 dark:text-stone-500">{country.region}</span>
                  </div>
                </div>
                <span className="label !text-[10px] px-2.5 py-1 rounded-full bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-300">
                  {country.articles.length} stories
                </span>
              </div>

              {country.trends.length > 0 && (
                <div className="space-y-2.5">
                  <span className="label !text-[10px] text-stone-500 dark:text-stone-400">
                    <Flame className="w-3 h-3 fill-red-500 text-red-500" />
                    Trending here
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {country.trends.map((t) => (
                      <span
                        key={t.id}
                        className="px-3 py-1.5 rounded-full text-xs font-medium bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300"
                      >
                        {t.title}
                        <span className="ml-1.5 text-accent font-semibold">+{t.searchVelocity.toFixed(0)}%</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2.5">
                <span className="label !text-[10px] text-stone-500 dark:text-stone-400">Latest stories</span>
                {country.articles.length > 0 ? (
                  <div className="space-y-2">
                    {country.articles.map((art) => (
                      <Link
                        key={art.id}
                        href={`/news/${art.slug}`}
                        className="group block rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 p-3.5 hover:border-stone-300 dark:hover:border-stone-700 transition-colors"
                      >
                        <div className="kicker !text-[10px] mb-1">{art.category.name}</div>
                        <div className="font-serif-display font-bold text-sm text-stone-800 dark:text-stone-200 group-hover:text-accent transition-colors line-clamp-1">
                          {art.title}
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-stone-400 dark:text-stone-500 italic">
                    No region-specific stories tagged yet.
                  </p>
                )}
              </div>
            </section>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
