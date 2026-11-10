import React from 'react';
import Link from 'next/link';
import { GitCommit, ArrowRight } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { Navbar, Footer } from '@/components/Navigation';

export const revalidate = 60;

export default async function StoryTimelinePage() {
  const timelines = await prisma.storyTimeline.findMany({
    orderBy: { updatedAt: 'desc' },
    include: {
      articles: {
        orderBy: { publishedAt: 'asc' },
        include: { category: true },
      },
    },
  });

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col transition-colors">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-12">
        <header className="section-rule pb-8 space-y-3 max-w-3xl">
          <span className="kicker">
            <GitCommit className="w-3.5 h-3.5" />
            Story Timelines
          </span>
          <h1 className="font-serif-display text-4xl sm:text-5xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
            Evolving Technology Stories
          </h1>
          <p className="text-base text-stone-600 dark:text-stone-400 leading-relaxed">
            News is fragmented; stories evolve over weeks and months. Follow chronological breakthroughs, responses, and regulatory shifts in one continuous thread.
          </p>
        </header>

        <div className="space-y-12">
          {timelines.map((timeline) => (
            <section
              key={timeline.id}
              id={timeline.slug}
              className="scroll-mt-32 rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 md:p-8 space-y-8 shadow-xs"
            >
              <header className="space-y-2.5 border-b border-stone-100 dark:border-stone-800 pb-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="label !text-[10px] px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-900">
                    {timeline.status}
                  </span>
                  <span className="text-xs text-stone-400 dark:text-stone-500">
                    {timeline.articles.length} connected events
                  </span>
                </div>
                <h2 className="font-serif-display text-2xl font-bold text-stone-900 dark:text-stone-50">
                  {timeline.title}
                </h2>
                <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">{timeline.summary}</p>
              </header>

              {/* Vertical timeline */}
              <div className="relative ml-3 pl-8 space-y-8 border-l-2 border-stone-200 dark:border-stone-800">
                {timeline.articles.map((art, index) => (
                  <div key={art.id} className="relative group">
                    <div className="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-white dark:bg-stone-900 border-2 border-accent flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    </div>

                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <span className="label !text-[10px] text-stone-500 dark:text-stone-400">
                          Event {index + 1} · {art.category.name}
                        </span>
                        <span className="text-stone-400 dark:text-stone-500">
                          {new Date(art.publishedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>

                      <h3 className="font-serif-display text-lg font-bold leading-snug text-stone-900 dark:text-stone-100 group-hover:text-accent transition-colors">
                        <Link href={`/news/${art.slug}`}>{art.title}</Link>
                      </h3>

                      <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed line-clamp-2">
                        {art.description}
                      </p>

                      {art.whyItMatters && (
                        <blockquote className="rounded-xl border-l-4 border-accent bg-stone-50 dark:bg-stone-950 p-3.5">
                          <span className="label !text-[10px] text-stone-500 dark:text-stone-400 block mb-1">Why it matters</span>
                          <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed">{art.whyItMatters}</p>
                        </blockquote>
                      )}

                      <Link
                        href={`/news/${art.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:gap-2.5 transition-all"
                      >
                        Read full event
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
