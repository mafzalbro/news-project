import { prisma } from '../prisma';
import { RealSignalExtractor } from './signals/signal-extractor';
import { calculateTechSignal } from '../signal-engine';

async function runSignalExtractionRunner() {
  console.log('====================================================');
  console.log('⚡ TECHSIGNAL REAL SIGNAL EXTRACTION & RANKING');
  console.log('====================================================\n');

  const extractor = new RealSignalExtractor();

  // Fetch all stories from database with linked articles and publisher info
  const stories = await prisma.story.findMany({
    include: {
      storyArticles: {
        include: {
          article: {
            select: { id: true, title: true, publishedAt: true, source: { select: { name: true } } },
          },
        },
      },
    },
  });

  console.log(`Extracting real signal metrics across ${stories.length} database stories...\n`);

  const rankedStories = stories.map((story) => {
    const rawData = {
      id: story.id,
      title: story.title,
      firstSeenAt: story.firstSeenAt,
      lastSeenAt: story.lastSeenAt,
      articleCount: story.articleCount,
      sourceCount: story.sourceCount,
      articles: story.storyArticles.map((sa) => ({
        publishedAt: sa.article.publishedAt,
        publisherName: sa.article.source?.name,
      })),
    };

    const extracted = extractor.extractFactors(rawData);
    const computedSignal = calculateTechSignal(extracted.factors);

    return {
      storyId: story.id,
      title: story.title,
      articleCount: story.articleCount,
      sourceCount: story.sourceCount,
      overallScore: computedSignal.overallScore,
      signalTier: computedSignal.signalTier,
      explanation: computedSignal.explanation,
      factors: extracted.factors,
      rawMetrics: extracted.rawMetrics,
    };
  });

  // Sort stories by computed Tech Signal overall score descending
  rankedStories.sort((a, b) => b.overallScore - a.overallScore);

  console.log('====================================================');
  console.log('🔥 TOP RANKED REAL-WORLD TECH SIGNALS IN DATABASE');
  console.log('====================================================\n');

  rankedStories.slice(0, 10).forEach((item, idx) => {
    console.log(`${idx + 1}. [${item.signalTier}] ${item.title}`);
    console.log(`   Overall Score:  ${item.overallScore} / 100`);
    console.log(`   Publisher Spread: ${item.sourceCount} unique source(s), ${item.articleCount} article(s)`);
    console.log(`   Velocity:       ${item.rawMetrics.articlesPerHour} articles/hr | Recency: ${item.rawMetrics.recencyHours}h ago`);
    console.log(`   Factors:        Search Velocity=${item.factors.searchVelocity}, News Momentum=${item.factors.newsMomentum}, Credibility=${item.factors.credibility}`);
    console.log(`   Rationale:      ${item.explanation}\n`);
  });

  console.log('====================================================');
  console.log(`✅ Extracted and calculated real signal scores for ${rankedStories.length} database stories.`);
  console.log('====================================================\n');
}

runSignalExtractionRunner().catch(console.error);
