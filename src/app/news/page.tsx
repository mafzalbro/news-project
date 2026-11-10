import React from 'react';
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
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col transition-colors">
      <Navbar categories={categories} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-10">
        <header className="section-rule pb-8 space-y-3 max-w-3xl">
          <span className="kicker">The Latest</span>
          <h1 className="font-serif-display text-4xl sm:text-5xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
            Breaking News &amp; Intelligence
          </h1>
          <p className="text-base text-stone-600 dark:text-stone-400 leading-relaxed">
            Real-time, human-centered analysis across key global technology sectors — updated continuously.
          </p>
        </header>

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
