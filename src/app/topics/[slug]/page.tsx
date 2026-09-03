import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Navbar, Footer } from '@/components/Navigation';
import { ArticleCard } from '@/components/ArticleCard';

export const revalidate = 60;

interface TopicPageProps {
  params: Promise<{ slug: string }>;
}

export default async function TopicCategoryPage({ params }: TopicPageProps) {
  const { slug } = await params;

  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      articles: {
        include: { category: true, signal: true },
        orderBy: { publishedAt: 'desc' },
      },
    },
  });

  if (!category) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
        <div className="space-y-3 border border-slate-200 dark:border-slate-800 pb-6 bg-white dark:bg-slate-900/40 p-6 rounded-2xl shadow-sm">
          <div className="inline-flex items-center space-x-2 bg-cyan-100 dark:bg-cyan-950 border border-cyan-200 dark:border-cyan-800 text-cyan-800 dark:text-cyan-400 text-xs font-mono uppercase px-2.5 py-0.5 rounded">
            <span>Category Sector</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">{category.name}</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
            {category.description}
          </p>
        </div>

        {category.articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {category.articles.map((article) => (
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
        ) : (
          <div className="text-center py-16 bg-white dark:bg-slate-900/30 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-sm">
            No intelligence stories published under this topic yet.
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
