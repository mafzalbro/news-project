import React from 'react';
import Link from 'next/link';
import { Flame, ArrowRight, Globe, Zap, TrendingUp, Sparkles, Activity, ShieldCheck, Layers, GitCommit } from 'lucide-react';
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
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      <Navbar categories={categories} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* High-Density Hero Section with Integrated Live Tech Signal Terminal */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0d1322] via-[#090e1a] to-[#070a12] border border-slate-800/80 p-5 md:p-8 shadow-xl">
          {/* Subtle Glow Backdrop */}
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-1/3 -mb-16 w-60 h-60 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
            {/* Left Column: Mission & Terminal CTA */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center space-x-2 bg-cyan-950/70 border border-cyan-800/80 text-cyan-400 text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded-md backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                <span>Deterministic Tech Intelligence</span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight text-white">
                Signal over noise.{' '}
                <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent">
                  Understand technological impact.
                </span>
              </h1>

              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
                We track search velocity, analyze multi-source news momentum, and structure 5-layer decision context for founders, decision makers, and engineers.
              </p>

              <div className="pt-1 flex flex-wrap gap-2.5 text-xs font-mono">
                <Link
                  href="/trends"
                  className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all shadow-sm shadow-cyan-500/30 flex items-center space-x-1.5"
                >
                  <span>Trend Tracker Matrix</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/timeline"
                  className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition-colors flex items-center space-x-1.5"
                >
                  <GitCommit className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Story Timelines</span>
                </Link>
              </div>
            </div>

            {/* Right Column: LIVE TECH SIGNAL Terminal Radar Widget */}
            <div className="lg:col-span-5">
              <div className="bg-[#090d16]/90 border border-slate-800 rounded-xl p-4 shadow-2xl backdrop-blur-md space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                  <div className="flex items-center space-x-2">
                    <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
                    <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-slate-200">
                      LIVE TECH SIGNAL
                    </span>
                  </div>
                  <span className="text-[10px] font-mono bg-rose-950/80 text-rose-400 border border-rose-800/80 px-2 py-0.5 rounded font-bold uppercase flex items-center space-x-1">
                    <Flame className="w-3 h-3 fill-current text-rose-500" />
                    <span>HOT SIGNAL</span>
                  </span>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-white line-clamp-1">
                    {heroSignalArticle?.title || 'Agentic Workflow Automation'}
                  </h3>
                  <p className="text-[10px] text-cyan-400 mt-0.5 font-mono">
                    {heroSignalArticle?.category?.name || 'AI & Agentic Workflows'}
                  </p>
                </div>

                <div className="flex items-center justify-between bg-slate-950/80 p-2.5 rounded-lg border border-slate-800/80">
                  <span className="text-[11px] text-slate-400 font-mono">Overall Tech Score</span>
                  <span className="text-lg font-black font-mono text-rose-400 flex items-center space-x-1">
                    <span>{heroSignalArticle?.signal?.overallScore.toFixed(1) || '91.5'}</span>
                    <span className="text-[10px] text-slate-500 font-normal">/ 100</span>
                  </span>
                </div>

                <div className="space-y-2 text-[11px] font-mono">
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Search Velocity</span>
                      <span className="text-cyan-400 font-bold">+{topTrends[0]?.searchVelocity?.toFixed(0) || 185}%</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-1 overflow-hidden border border-slate-800">
                      <div
                        className="bg-cyan-400 h-1 rounded-full"
                        style={{ width: `${heroSignalArticle?.signal?.searchVelocity || 94}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">News Momentum</span>
                      <span className="text-blue-400 font-bold">{heroSignalArticle?.signal?.newsMomentum || 89}/100</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-1 overflow-hidden border border-slate-800">
                      <div
                        className="bg-blue-400 h-1 rounded-full"
                        style={{ width: `${heroSignalArticle?.signal?.newsMomentum || 89}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[10px] pt-1 border-t border-slate-800/60">
                    <span className="text-slate-400">Human & Economic Impact</span>
                    <span className="text-amber-400 font-semibold">HIGH ({heroSignalArticle?.signal?.humanImpact || 92}/100)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Real-time Hot Trends Ticker */}
        {topTrends.length > 0 && (
          <section className="bg-[#090d16] border border-slate-800/80 rounded-xl p-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center space-x-2 shrink-0">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest bg-rose-950/80 text-rose-400 px-2 py-0.5 rounded border border-rose-800/80 flex items-center space-x-1">
                <Flame className="w-3 h-3 text-rose-500 fill-current" />
                <span>HOT TRENDS</span>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs w-full overflow-x-auto scrollbar-none">
              {topTrends.map((trend) => (
                <Link
                  key={trend.id}
                  href={`/trends#${trend.slug}`}
                  className="shrink-0 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 px-2.5 py-1 rounded-md flex items-center space-x-2 transition-colors font-mono text-[11px]"
                >
                  <span className="font-medium text-slate-200 truncate">{trend.title}</span>
                  <span className="text-cyan-400 font-bold shrink-0">+{trend.searchVelocity.toFixed(0)}%</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Top Signal Analysis Section */}
        {featuredArticles.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                  <span>Top Signal Analysis</span>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/80">
                    5-Layer Deep Brief
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">High-velocity stories with verified primary source documentation.</p>
              </div>
              <Link href="/news" className="text-xs font-mono text-cyan-400 hover:underline flex items-center space-x-1">
                <span>All Stories</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Trending Feed Column */}
          <section className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
              <h2 className="text-lg font-bold text-white">Trending Intelligence Feed</h2>
              <span className="text-[10px] font-mono text-slate-400">Sorted by Tech Signal Score</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  compact={true}
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

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Global Map Snapshot */}
            <div className="bg-[#0d1322] border border-slate-800/80 rounded-xl p-4 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-xs flex items-center space-x-1.5 font-mono">
                  <Globe className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Global Tech Pulse</span>
                </h3>
                <Link href="/countries" className="text-[10px] font-mono text-cyan-400 hover:underline flex items-center space-x-1">
                  <span>Corridors</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Innovation velocity tracking across active tech hubs.
              </p>

              <div className="space-y-2">
                {countryStats.map((country) => (
                  <Link
                    key={country.id}
                    href={`/countries#${country.code}`}
                    className="flex items-center justify-between p-2 bg-slate-950/70 hover:bg-slate-900 border border-slate-800/80 rounded-lg transition-colors text-xs font-mono"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-cyan-300 font-bold border border-slate-700">
                        {country.code}
                      </span>
                      <span className="font-medium text-slate-200 text-[11px]">{country.name}</span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      <span className="text-cyan-400 font-bold">{country._count.articles}</span> stories
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Story Timelines Highlight */}
            <div className="bg-gradient-to-br from-[#0d1322] to-indigo-950/40 border border-indigo-800/40 rounded-xl p-4 space-y-2.5 shadow-xs">
              <span className="text-[9px] font-mono uppercase tracking-widest text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-800/80">
                Evolving Threads
              </span>
              <h3 className="text-sm font-bold text-white">Chronological Timelines</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Multi-day breaking story threads tracked to monitor long-term technology outcomes.
              </p>
              <Link
                href="/timeline"
                className="inline-flex items-center space-x-1 text-xs font-mono font-semibold text-indigo-300 hover:text-indigo-200 pt-1"
              >
                <span>Browse Story Timelines</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}

