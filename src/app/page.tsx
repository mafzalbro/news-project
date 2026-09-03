import React from 'react';
import Link from 'next/link';
import { Flame, ArrowRight, Globe, Zap, TrendingUp } from 'lucide-react';
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
      take: 5,
      include: { countries: true },
    }),
    prisma.country.findMany({
      take: 6,
      include: {
        _count: {
          select: { articles: true, trends: true },
        },
      },
    }),
  ]);

  const heroSignalArticle = featuredArticles[0];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      <Navbar categories={categories} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Hero Section with Live Tech Signal Widget */}
        <section className="bg-gradient-to-r from-white via-slate-50 to-cyan-50 dark:from-slate-900 dark:via-slate-900/90 dark:to-cyan-950/40 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 md:p-10 lg:p-12 relative overflow-hidden shadow-sm dark:shadow-2xl">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Column: Messaging & CTAs */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center space-x-1.5 bg-cyan-100/80 dark:bg-cyan-950/80 border border-cyan-200 dark:border-cyan-800 text-cyan-800 dark:text-cyan-400 text-[11px] font-mono font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-md">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
                <span>Global Tech Intelligence</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-slate-900 dark:text-slate-100">
                Don&apos;t just know what happened.{' '}
                <span className="bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-500 bg-clip-text text-transparent">
                  Understand why it matters.
                </span>
              </h1>

              <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
                We measure technology trends. We track emerging search signals, analyze real-world human & business impact, and deliver 5-layer structured tech intelligence for founders, decision makers, and engineers.
              </p>

              <div className="pt-2 flex flex-wrap gap-3 sm:gap-4 text-xs font-semibold">
                <Link
                  href="/trends"
                  className="px-5 py-2.5 rounded-xl bg-cyan-600 dark:bg-cyan-500 text-white dark:text-slate-950 font-bold hover:bg-cyan-700 dark:hover:bg-cyan-400 transition-colors shadow-md shadow-cyan-500/20 flex items-center space-x-1.5"
                >
                  <span>Explore Trend Tracker</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/timeline"
                  className="px-5 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 transition-colors"
                >
                  View Story Timelines
                </Link>
              </div>
            </div>

            {/* Right Column: LIVE TECH SIGNAL Widget */}
            <div className="lg:col-span-5">
              <div className="bg-slate-900/90 dark:bg-slate-900/95 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-sm space-y-4 text-slate-100">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                    <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-slate-300">
                      LIVE TECH SIGNAL
                    </span>
                  </div>
                  <span className="text-[10px] font-mono bg-rose-950/80 text-rose-400 border border-rose-800/80 px-2 py-0.5 rounded font-bold uppercase flex items-center space-x-1">
                    <Flame className="w-3 h-3 fill-current text-rose-500" />
                    <span>HOT SIGNAL</span>
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white line-clamp-1">
                    {heroSignalArticle?.title || 'Agentic Workflow Automation'}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                    {heroSignalArticle?.category?.name || 'AI & Agentic Workflows'}
                  </p>
                </div>

                <div className="flex items-baseline justify-between bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
                  <span className="text-xs text-slate-400 font-mono">Overall Tech Signal</span>
                  <span className="text-xl font-black font-mono text-rose-400 flex items-center space-x-1">
                    <span>{heroSignalArticle?.signal?.overallScore.toFixed(1) || '91.5'}</span>
                    <span className="text-xs text-slate-500 font-normal">/ 100</span>
                  </span>
                </div>

                <div className="space-y-2.5 text-xs font-mono">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">Search Velocity</span>
                      <span className="text-cyan-400 font-bold">+{topTrends[0]?.searchVelocity?.toFixed(0) || 185}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-cyan-400 h-1.5 rounded-full"
                        style={{ width: `${heroSignalArticle?.signal?.searchVelocity || 94}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">News Momentum</span>
                      <span className="text-blue-400 font-bold">{heroSignalArticle?.signal?.newsMomentum || 89}/100</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-blue-400 h-1.5 rounded-full"
                        style={{ width: `${heroSignalArticle?.signal?.newsMomentum || 89}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[11px] pt-0.5">
                    <span className="text-slate-400">Human & Economic Impact</span>
                    <span className="text-amber-400 font-semibold">HIGH ({heroSignalArticle?.signal?.humanImpact || 92}/100)</span>
                  </div>
                </div>

                {heroSignalArticle?.countries && heroSignalArticle.countries.length > 0 && (
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Rising Globally:</span>
                    <div className="flex items-center space-x-1.5 font-mono text-slate-200">
                      {heroSignalArticle.countries.slice(0, 5).map((c) => (
                        <span key={c.code} className="bg-slate-800 px-1.5 py-0.5 rounded text-[10px] font-bold border border-slate-700">
                          {c.code}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Real-time Trend Ticker Bar */}
        {topTrends.length > 0 && (
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center space-x-2 shrink-0">
              <span className="text-xs font-mono font-bold uppercase tracking-widest bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-400 px-2.5 py-1 rounded border border-rose-200 dark:border-rose-800 flex items-center space-x-1">
                <Flame className="w-3.5 h-3.5 text-rose-500 fill-current" />
                <span>Hot Trends</span>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 text-xs w-full overflow-x-auto pb-1 md:pb-0">
              {topTrends.map((trend) => (
                <Link
                  key={trend.id}
                  href={`/trends#${trend.slug}`}
                  className="shrink-0 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-lg flex items-center space-x-2 transition-colors max-w-full"
                >
                  <span className="font-medium text-slate-800 dark:text-slate-200 truncate">{trend.title}</span>
                  <span className="text-cyan-600 dark:text-cyan-400 font-mono text-[11px] font-bold shrink-0">+{trend.searchVelocity.toFixed(0)}%</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Featured Stories Grid */}
        {featuredArticles.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                  <span>Top Signal Analysis</span>
                  <span className="text-xs font-mono font-normal text-cyan-800 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-950 px-2 py-0.5 rounded border border-cyan-200 dark:border-cyan-800">
                    High Impact
                  </span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Deep 5-layer intelligence on high-velocity stories.</p>
              </div>
              <Link href="/news" className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center space-x-1">
                <span>View all stories</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featuredArticles.map((article) => (
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

        {/* Main Content Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* High-Velocity Stories Column */}
          <section className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Trending Intelligence Feed</h2>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">Sorted by Tech Signal</span>
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

          {/* Sidebar: Global Tech Map & Signals */}
          <aside className="lg:col-span-4 space-y-8">
            {/* Global Map Snapshot */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-cyan-500" />
                  <span>Global Tech Pulse</span>
                </h3>
                <Link href="/countries" className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 hover:underline flex items-center space-x-1">
                  <span>Full Map</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Technology developments evolving across key global innovation corridors.
              </p>

              <div className="space-y-2.5">
                {countryStats.map((country) => (
                  <Link
                    key={country.id}
                    href={`/countries#${country.code}`}
                    className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-950/70 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800/80 rounded-xl transition-colors text-xs"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-slate-500 dark:text-slate-400 uppercase font-bold text-[10px] bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                        {country.code}
                      </span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">{country.name}</span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                      <span className="text-cyan-600 dark:text-cyan-400 font-semibold">{country._count.articles}</span> stories
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Story Timelines Highlight */}
            <div className="bg-gradient-to-br from-indigo-50 to-white dark:from-slate-900 dark:to-indigo-950/50 border border-indigo-200 dark:border-indigo-800/40 rounded-2xl p-6 space-y-3 shadow-sm">
              <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-800 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-950 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
                Evolving Stories
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Chronological Timelines</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Single evolving threads tracking multi-day breaking developments so you never miss what happens next.
              </p>
              <Link
                href="/timeline"
                className="inline-flex items-center space-x-1 text-xs font-semibold text-indigo-600 dark:text-indigo-300 hover:underline pt-2"
              >
                <span>Browse Story Timelines</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
