import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Navbar, Footer } from '@/components/Navigation';
import { ArticleCard } from '@/components/ArticleCard';

export const revalidate = 60;

export default async function NewsPage() {
  const [articles, categories] = await Promise.all([
    prisma.article.findMany({
      include: { category: true, signal: true },
      orderBy: { publishedAt: 'desc' },
    }),
    prisma.category.findMany(),
  ]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      <Navbar categories={categories} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
        <div className="space-y-2 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div className="inline-flex items-center space-x-2 bg-cyan-100 dark:bg-cyan-950 border border-cyan-200 dark:border-cyan-800 text-cyan-800 dark:text-cyan-400 text-xs font-mono uppercase px-2.5 py-0.5 rounded">
            <span>Global Tech Stream</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">Breaking News & Intelligence</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
            Real-time human-centered analysis across key global technology sectors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
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
      </main>

      <Footer />
    </div>
  );
}
