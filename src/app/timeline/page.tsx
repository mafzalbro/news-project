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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-10">
        {/* Timeline Header */}
        <div className="space-y-3 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div className="inline-flex items-center space-x-2 bg-indigo-100 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 text-indigo-800 dark:text-indigo-400 text-xs font-mono uppercase px-2.5 py-0.5 rounded">
            <GitCommit className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Story Timeline Engine</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">Evolving Technology Stories</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            News is fragmented; story entities evolve over weeks and months. Follow chronological breakthroughs, responses, and regulatory shifts in a single continuous thread.
          </p>
        </div>

        {/* Timelines List */}
        <div className="space-y-12">
          {timelines.map((timeline) => (
            <div
              key={timeline.id}
              id={timeline.slug}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-sm dark:shadow-2xl"
            >
              <div className="border-b border-slate-200 dark:border-slate-800 pb-4 space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded">
                    Status: {timeline.status}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    {timeline.articles.length} Connected Events
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{timeline.title}</h2>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{timeline.summary}</p>
              </div>

              {/* Vertical Timeline Nodes */}
              <div className="relative border-l-2 border-indigo-200 dark:border-indigo-900/60 ml-4 pl-6 space-y-8 my-4">
                {timeline.articles.map((art, index) => (
                  <div key={art.id} className="relative group">
                    {/* Circle Node */}
                    <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-white dark:bg-slate-950 border-2 border-indigo-500 group-hover:scale-125 transition-transform"></div>

                    <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-cyan-600 dark:text-cyan-400 font-mono font-semibold">
                          Event {index + 1}: {art.category.name}
                        </span>
                        <span className="text-slate-400 dark:text-slate-500 font-mono text-[11px]">
                          {new Date(art.publishedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                        <Link href={`/news/${art.slug}`}>{art.title}</Link>
                      </h3>

                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                        {art.description}
                      </p>

                      {art.whyItMatters && (
                        <div className="text-xs bg-white dark:bg-slate-900 border-l-2 border-cyan-500 p-2.5 rounded-r text-slate-700 dark:text-slate-300 font-medium border border-slate-200 dark:border-slate-800">
                          <span className="text-cyan-600 dark:text-cyan-400 font-bold block text-[10px] uppercase font-mono">Why It Matters</span>
                          {art.whyItMatters}
                        </div>
                      )}

                      <div className="pt-2">
                        <Link
                          href={`/news/${art.slug}`}
                          className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline inline-flex items-center space-x-1"
                        >
                          <span>Read Event Analysis</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
