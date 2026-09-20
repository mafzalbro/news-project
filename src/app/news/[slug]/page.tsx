import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Link2, ArrowRight, Clock } from 'lucide-react';
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
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col transition-colors">
      <NewsArticleJsonLd article={article} />
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-10">
        {/* Article header */}
        <header className="space-y-5">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={`/topics/${article.category.slug}`}
              className="kicker hover:underline underline-offset-4"
            >
              {article.category.name}
            </Link>
            {article.signal && <TechSignalBadge score={article.signal.overallScore} size="md" />}
          </div>

          <h1 className="font-serif-display text-4xl sm:text-5xl font-bold tracking-tight leading-[1.12] text-stone-900 dark:text-stone-50">
            {article.title}
          </h1>

          <p className="text-lg sm:text-xl text-stone-600 dark:text-stone-400 leading-relaxed font-serif-display italic">
            {article.description}
          </p>

          {/* Byline */}
          <div className="flex items-center justify-between border-y border-stone-200 dark:border-stone-800 py-3.5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-stone-200 dark:bg-stone-800 flex items-center justify-center font-bold text-stone-700 dark:text-stone-300">
                {article.authorName[0]}
              </div>
              <div>
                <div className="text-sm font-semibold text-stone-900 dark:text-stone-100">{article.authorName}</div>
                <div className="text-xs text-stone-500 dark:text-stone-400">{article.authorRole}</div>
              </div>
            </div>
            <span className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400">
              <Clock className="w-3.5 h-3.5" />
              {publishedDate}
            </span>
          </div>
        </header>

        {/* Featured image */}
        {article.imageUrl && (
          <figure className="space-y-2">
            <div className="relative h-72 sm:h-96 md:h-[440px] rounded-3xl overflow-hidden border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-800">
              <Image src={article.imageUrl} alt={article.title} fill className="object-cover" priority />
            </div>
            {article.imageCaption && (
              <figcaption className="text-xs text-stone-400 dark:text-stone-500 text-center">
                {article.imageCaption}
              </figcaption>
            )}
          </figure>
        )}

        {/* Structured analysis */}
        <FiveLayerAnalysis
          data={{
            whatHappened: article.whatHappened,
            whyItMatters: article.whyItMatters,
            whoIsAffected: article.whoIsAffected,
            whatNext: article.whatsNext,
          }}
          techSignalScore={article.signal?.overallScore}
        />

        {/* Signal breakdown */}
        {article.signal && (
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
        )}

        {/* Body */}
        <article className="space-y-5">
          <h2 className="label text-stone-500 dark:text-stone-400">Full Report</h2>
          {article.content.split('\n\n').map((paragraph, idx) => (
            <p key={idx} className="text-base leading-[1.8] text-stone-700 dark:text-stone-300">
              {paragraph}
            </p>
          ))}
        </article>

        {/* Timeline connection */}
        {article.timeline && (
          <section className="rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 space-y-4 shadow-xs">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-1">
                <span className="label !text-[10px] text-indigo-600 dark:text-indigo-400">Part of a story timeline</span>
                <h3 className="font-serif-display text-lg font-bold text-stone-900 dark:text-stone-50">
                  {article.timeline.title}
                </h3>
              </div>
              <Link
                href={`/timeline#${article.timeline.slug}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:gap-2.5 transition-all"
              >
                View full timeline
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">{article.timeline.summary}</p>

            <ol className="space-y-1 border-t border-stone-100 dark:border-stone-800 pt-3">
              {article.timeline.articles.map((item) => (
                <li key={item.id} className="flex items-center justify-between gap-3 text-sm py-1.5">
                  <Link
                    href={`/news/${item.slug}`}
                    className={`truncate transition-colors ${
                      item.slug === article.slug
                        ? 'font-bold text-accent'
                        : 'text-stone-600 dark:text-stone-300 hover:text-accent'
                    }`}
                  >
                    {item.title}
                  </Link>
                  <span className="text-xs text-stone-400 dark:text-stone-500 shrink-0">
                    {new Date(item.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* Sources */}
        {article.sources.length > 0 && (
          <section className="rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 space-y-3 shadow-xs">
            <h3 className="label text-stone-500 dark:text-stone-400">Primary Sources</h3>
            <ul className="space-y-2.5">
              {article.sources.map((src) => (
                <li key={src.id} className="flex items-center justify-between gap-3 text-sm">
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline underline-offset-4 font-medium flex items-center gap-1.5 truncate"
                  >
                    <Link2 className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{src.title}</span>
                  </a>
                  <span className="text-xs text-stone-400 dark:text-stone-500 shrink-0">{src.publisher}</span>
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
