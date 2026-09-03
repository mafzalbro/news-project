import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Link2, ArrowRight } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { Navbar, Footer } from '@/components/Navigation';
import { FiveLayerAnalysis } from '@/components/FiveLayerAnalysis';
import { SignalBreakdownCard, TechSignalBadge } from '@/components/TechSignalComponents';
import { NewsArticleJsonLd } from '@/components/SeoStructuredData';

export const revalidate = 60;

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const siteUrl = process.env.SITE_URL || 'http://localhost:3000';
  const siteName = process.env.SITE_NAME || 'TechSignal';

  const article = await prisma.article.findUnique({
    where: { slug },
    select: {
      title: true,
      description: true,
      publishedAt: true,
      authorName: true,
      imageUrl: true,
      category: { select: { name: true } },
    },
  });

  if (!article) {
    return { title: 'Article Not Found | ' + siteName };
  }

  const url = `${siteUrl}/news/${slug}`;

  return {
    title: `${article.title} | ${siteName}`,
    description: article.description,
    authors: [{ name: article.authorName }],
    category: article.category.name,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: article.title,
      description: article.description,
      url,
      siteName,
      type: 'article',
      publishedTime: new Date(article.publishedAt).toISOString(),
      authors: [article.authorName],
      images: article.imageUrl ? [{ url: article.imageUrl, alt: article.title }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
      images: article.imageUrl ? [article.imageUrl] : [],
    },
  };
}

export default async function ArticleDetailPage({ params }: ArticlePageProps) {
  const { slug } = await params;

  const article = await prisma.article.findUnique({
    where: { slug },
    include: {
      category: true,
      signal: true,
      timeline: {
        include: {
          articles: {
            orderBy: { publishedAt: 'asc' },
            select: { id: true, slug: true, title: true, publishedAt: true },
          },
        },
      },
      topics: true,
      companies: true,
      people: true,
      countries: true,
      trends: true,
      sources: true,
    },
  });

  if (!article) {
    notFound();
  }

  const publishedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      <NewsArticleJsonLd article={article} />
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-10">
        {/* Article Header */}
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={`/topics/${article.category.slug}`}
              className="text-xs font-mono uppercase tracking-wider text-cyan-800 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-950 border border-cyan-200 dark:border-cyan-800 px-3 py-1 rounded-full font-semibold hover:bg-cyan-200 dark:hover:bg-cyan-900 transition-colors"
            >
              {article.category.name}
            </Link>
            {article.signal && <TechSignalBadge score={article.signal.overallScore} size="md" />}
            <span className="text-xs text-slate-500 font-mono">• {publishedDate}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
            {article.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-normal border-l-2 border-slate-300 dark:border-slate-700 pl-4 py-1">
            {article.description}
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center font-bold text-slate-800 dark:text-slate-200">
                {article.authorName[0]}
              </div>
              <div>
                <div className="font-semibold text-slate-900 dark:text-slate-200">{article.authorName}</div>
                <div className="text-slate-500 text-[11px]">{article.authorRole}</div>
              </div>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {article.imageUrl && (
          <div className="space-y-2">
            <div className="relative h-72 sm:h-96 md:h-[420px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900">
              <Image
                src={article.imageUrl}
                alt={article.title}
                fill
                className="object-cover"
                priority
              />
            </div>
            {article.imageCaption && (
              <p className="text-xs text-slate-500 text-center font-mono">
                {article.imageCaption}
              </p>
            )}
          </div>
        )}

        {/* 5-Layer Structured Analysis Block */}
        <section>
          <FiveLayerAnalysis
            data={{
              whatHappened: article.whatHappened,
              whyItMatters: article.whyItMatters,
              whoIsAffected: article.whoIsAffected,
              whatNext: article.whatsNext,
            }}
            techSignalScore={article.signal?.overallScore}
          />
        </section>

        {/* Tech Signal Breakdown */}
        {article.signal && (
          <section>
            <SignalBreakdownCard
              factors={{
                searchVelocity: article.signal.searchVelocity,
                newsMomentum: article.signal.newsMomentum,
                socialMomentum: article.signal.socialMomentum,
                humanImpact: article.signal.humanImpact,
                novelty: article.signal.novelty,
                credibility: article.signal.credibility,
                longTermRelevance: article.signal.longTermRelevance,
              }}
              overallScore={article.signal.overallScore}
              explanation={article.signal.explanation}
            />
          </section>
        )}

        {/* Article Full Editorial Content */}
        <article className="bg-white dark:bg-slate-900/40 p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-2 mb-4">
            In-Depth Analysis & Intelligence Report
          </h2>
          {article.content.split('\n\n').map((paragraph, idx) => (
            <p key={idx} className="text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
              {paragraph}
            </p>
          ))}
        </article>

        {/* Story Timeline Connection */}
        {article.timeline && (
          <section className="bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800/50 rounded-2xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-800 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-950 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
                  Part of Story Timeline
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-1">
                  {article.timeline.title}
                </h3>
              </div>
              <Link
                href={`/timeline#${article.timeline.slug}`}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1"
              >
                <span>View full timeline</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">{article.timeline.summary}</p>

            <div className="space-y-2 border-t border-slate-200 dark:border-slate-800 pt-3">
              {article.timeline.articles.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-xs py-1">
                  <Link
                    href={`/news/${item.slug}`}
                    className={`hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors line-clamp-1 ${
                      item.slug === article.slug ? 'font-bold text-cyan-600 dark:text-cyan-400' : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    • {item.title}
                  </Link>
                  <span className="text-slate-400 dark:text-slate-500 font-mono text-[10px] shrink-0 ml-2">
                    {new Date(item.publishedAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related Primary Sources */}
        {article.sources.length > 0 && (
          <section className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-3 shadow-sm">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">
              Primary Sources & Research Statements
            </h3>
            <ul className="space-y-2 text-xs">
              {article.sources.map((src) => (
                <li key={src.id} className="flex items-center justify-between">
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-600 dark:text-cyan-400 hover:underline font-medium flex items-center space-x-1.5"
                  >
                    <Link2 className="w-3.5 h-3.5" />
                    <span>{src.title}</span>
                  </a>
                  <span className="text-slate-400 dark:text-slate-500 text-[11px] font-mono">{src.publisher}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
