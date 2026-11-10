import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Flame, Globe, GitCommit, TrendingUp, Clock, Activity } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { Navbar, Footer } from '@/components/Navigation';
import { ArticleCard } from '@/components/ArticleCard';

export const revalidate = 60;

export default async function HomePage() {
  const [categories, featuredArticles, trendingArticles, topTrends, countryStats] = await Promise.all([
    prisma.category.findMany({ take: 6 }),
    prisma.article.findMany({
      where: { isFeatured: true },
      include: { category: true, signal: true, countries: true },
      orderBy: { publishedAt: 'desc' },
      take: 2,
    }),
    prisma.article.findMany({
      where: { isTrending: true },
      include: { category: true, signal: true },
      orderBy: { publishedAt: 'desc' },
      take: 6,
    }),
    prisma.trend.findMany({
      orderBy: { score: 'desc' },
      take: 6,
      include: { countries: true },
    }),
    prisma.country.findMany({
      take: 5,
      include: {
        _count: {
          select: { articles: true, trends: true },
        },
      },
    }),
  ]);

  const lead = featuredArticles[0];
  const secondary = featuredArticles[1];

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors">
      <Navbar categories={categories} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Trending ticker */}
        {topTrends.length > 0 && (
          <div className="flex items-center gap-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-full px-4 py-2 shadow-xs">
            <span className="label !text-[10px] text-accent shrink-0">
              <Flame className="w-3 h-3 fill-current" />
              Trending
            </span>
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
              {topTrends.map((trend) => (
                <Link
                  key={trend.id}
                  href={`/trends#${trend.slug}`}
                  className="shrink-0 px-3 py-1 rounded-full text-xs font-medium text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors whitespace-nowrap"
                >
                  {trend.title}
                  <span className="ml-1.5 text-accent font-semibold">+{trend.searchVelocity.toFixed(0)}%</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Lead story */}
        {lead && (
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <Link href={`/news/${lead.slug}`} className="lg:col-span-7 group block">
              <div className="relative h-64 sm:h-80 lg:h-[420px] rounded-3xl overflow-hidden border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-800">
                {lead.imageUrl ? (
                  <Image
                    src={lead.imageUrl}
                    alt={lead.title}
                    fill
                    priority
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-stone-100 to-stone-200 dark:from-stone-800 dark:to-stone-900" />
                )}
              </div>
            </Link>

            <div className="lg:col-span-5 flex flex-col gap-4 lg:pt-2">
              <div className="flex items-center gap-3">
                <span className="kicker">Lead Story</span>
                {lead.signal && (
                  <span className="label !text-[10px] px-2.5 py-1 rounded-full bg-accent-soft text-accent border border-accent">
                    Signal {lead.signal.overallScore.toFixed(0)}/100
                  </span>
                )}
              </div>

              <Link href={`/news/${lead.slug}`} className="group">
                <h1 className="font-serif-display text-3xl sm:text-4xl lg:text-[2.75rem] font-bold leading-[1.15] tracking-tight text-stone-900 dark:text-stone-50 group-hover:text-accent transition-colors">
                  {lead.title}
                </h1>
              </Link>

              <p className="text-base text-stone-600 dark:text-stone-400 leading-relaxed">
                {lead.description}
              </p>

              <div className="flex items-center gap-3 text-sm text-stone-500 dark:text-stone-400">
                <span className="font-medium text-stone-700 dark:text-stone-300">{lead.authorName}</span>
                <span className="w-1 h-1 rounded-full bg-stone-300 dark:bg-stone-600" />
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {new Date(lead.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                </span>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  href={`/news/${lead.slug}`}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-sm font-semibold hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors"
                >
                  Read the story
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/trends"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-stone-300 dark:border-stone-700 text-sm font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                >
                  <TrendingUp className="w-4 h-4" />
                  Trend Tracker
                </Link>
              </div>

              {/* Live signal panel */}
              {lead.signal && (
                <div className="mt-2 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="label !text-[10px] text-stone-500 dark:text-stone-400">
                      <Activity className="w-3.5 h-3.5" />
                      Live Signal
                    </span>
                    <span className="text-lg font-bold text-accent">
                      {lead.signal.overallScore.toFixed(1)}
                      <span className="text-xs text-stone-400 font-normal"> / 100</span>
                    </span>
                  </div>
                  {[
                    { label: 'Search Velocity', value: lead.signal.searchVelocity ?? 0 },
                    { label: 'News Momentum', value: lead.signal.newsMomentum ?? 0 },
                    { label: 'Human Impact', value: lead.signal.humanImpact ?? 0 },
                  ].map((row) => (
                    <div key={row.label} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-stone-500 dark:text-stone-400">{row.label}</span>
                        <span className="font-semibold text-stone-800 dark:text-stone-200">{row.value}/100</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-accent"
                          style={{ width: `${Math.min(100, row.value)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Featured analysis */}
        {featuredArticles.length > 1 && (
          <section className="space-y-6">
            <div className="section-rule pb-3 flex items-end justify-between">
              <div>
                <h2 className="font-serif-display text-2xl font-bold text-stone-900 dark:text-stone-50">
                  Top Signal Analysis
                </h2>
                <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
                  High-velocity stories with verified primary-source documentation.
                </p>
              </div>
              <Link href="/news" className="link-accent text-sm font-semibold shrink-0 flex items-center gap-1">
                All stories
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featuredArticles.slice(1).map((article) => (
                <ArticleCard
                  key={article.id}
                  id={article.id}
                  slug={article.slug}
                  title={article.title}
                  summary={article.description}
                  category={article.category}
                  imageUrl={article.imageUrl}
                  publishedAt={article.publishedAt}
                  techSignal={article.signal}
                  fiveLayer={{
                    whatHappened: article.whatHappened,
                    whyItMatters: article.whyItMatters,
                    whoIsAffected: article.whoIsAffected,
                    whatsNext: article.whatsNext,
                  }}
                />
              ))}
            </div>
          </section>
        )}

        {/* Feed + sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <section className="lg:col-span-8 space-y-6">
            <div className="section-rule pb-3 flex items-end justify-between">
              <h2 className="font-serif-display text-2xl font-bold text-stone-900 dark:text-stone-50">
                Trending Now
              </h2>
              <span className="text-xs text-stone-400 dark:text-stone-500">Sorted by signal score</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {trendingArticles.map((article) => (
                <ArticleCard
                  key={article.id}
                  id={article.id}
                  slug={article.slug}
                  title={article.title}
                  summary={article.description}
                  category={article.category}
                  imageUrl={article.imageUrl}
                  publishedAt={article.publishedAt}
                  techSignal={article.signal}
                  compact
                  fiveLayer={{
                    whatHappened: article.whatHappened,
                    whyItMatters: article.whyItMatters,
                    whoIsAffected: article.whoIsAffected,
                    whatsNext: article.whatsNext,
                  }}
                />
              ))}
            </div>
          </section>

          <aside className="lg:col-span-4 space-y-8">
            {/* Global pulse */}
            <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 space-y-4">
              <div className="section-rule pb-3 flex items-center justify-between">
                <h3 className="label text-stone-900 dark:text-stone-100">
                  <Globe className="w-4 h-4" />
                  Global Tech Pulse
                </h3>
                <Link href="/countries" className="link-accent text-xs font-semibold">
                  View map
                </Link>
              </div>
              <div className="space-y-1">
                {countryStats.map((country, i) => (
                  <Link
                    key={country.id}
                    href={`/countries#${country.code}`}
                    className="flex items-center gap-3 p-2 -mx-2 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800/60 transition-colors"
                  >
                    <span className="w-5 text-center text-xs font-bold text-stone-400 dark:text-stone-500">{i + 1}</span>
                    <span className="text-[11px] font-bold text-stone-500 dark:text-stone-400 w-7">{country.code}</span>
                    <span className="flex-1 text-sm font-medium text-stone-800 dark:text-stone-200 truncate">{country.name}</span>
                    <span className="text-xs text-stone-400 dark:text-stone-500">{country._count.articles}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Timelines promo */}
            <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 space-y-3">
              <span className="label !text-[10px] px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-900">
                Evolving Threads
              </span>
              <h3 className="font-serif-display text-lg font-bold text-stone-900 dark:text-stone-50">
                Chronological Timelines
              </h3>
              <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
                Multi-day breaking stories tracked day by day, so you never lose the thread.
              </p>
              <Link
                href="/timeline"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:gap-2.5 transition-all"
              >
                <GitCommit className="w-4 h-4" />
                Browse timelines
              </Link>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
