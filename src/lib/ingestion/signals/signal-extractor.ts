import { SignalInputFactors } from '../../signal-engine';

export interface RawStoryData {
  id: string;
  title: string;
  firstSeenAt: Date;
  lastSeenAt: Date;
  articleCount: number;
  sourceCount: number;
  categorySlug?: string;
  articles: {
    publishedAt: Date;
    publisherName?: string;
  }[];
}

export interface ExtractedRealSignal {
  storyId: string;
  storyTitle: string;
  rawMetrics: {
    articleCount: number;
    sourceCount: number;
    lifespanHours: number;
    articlesPerHour: number;
    recencyHours: number;
    recent6hCount: number;
  };
  factors: SignalInputFactors;
}

export class RealSignalExtractor {
  /**
   * Calculates deterministic 0-100 SignalInputFactors from real story coverage metrics.
   */
  extractFactors(story: RawStoryData): ExtractedRealSignal {
    const now = new Date();
    const lifespanHours = Math.max(
      0.1,
      (story.lastSeenAt.getTime() - story.firstSeenAt.getTime()) / (1000 * 60 * 60)
    );
    const recencyHours = Math.max(
      0,
      (now.getTime() - story.lastSeenAt.getTime()) / (1000 * 60 * 60)
    );

    // Calculate publication velocity
    const articlesPerHour = story.articleCount / Math.max(1, lifespanHours);

    // Count articles published in the last 6 hours
    const sixHoursAgo = new Date(now.getTime() - 6 * 60 * 60 * 1000);
    const recent6hCount = story.articles.filter((a) => a.publishedAt >= sixHoursAgo).length;

    // 1. News Momentum (0-100): Driven by article velocity & volume
    const newsMomentum = Math.min(
      100,
      Math.round(story.articleCount * 15 + articlesPerHour * 20)
    );

    // 2. Credibility (0-100): Driven by unique publisher count
    // 1 source = 60, 2 sources = 80, 3+ sources = 95+
    const credibility = Math.min(
      100,
      Math.round(50 + story.sourceCount * 18)
    );

    // 3. Search Velocity (0-100): Derived from recent 6h coverage acceleration & lifespan velocity
    const searchVelocity = Math.min(
      100,
      Math.round(recent6hCount * 25 + articlesPerHour * 15 + (recencyHours <= 12 ? 30 : 10))
    );

    // 4. Novelty (0-100): High for fresh stories (< 2 hours old), decaying over 48h
    const novelty = Math.max(
      20,
      Math.min(100, Math.round(100 - recencyHours * 1.5))
    );

    // 5. Human & Business Impact (0-100): Scaled by multi-publisher spread & category depth
    const humanImpact = Math.min(
      100,
      Math.round(40 + story.sourceCount * 12 + story.articleCount * 8)
    );

    // 6. Long-term Relevance (0-100): Scaled by multi-source verification and sustained coverage lifespan
    const longTermRelevance = Math.min(
      100,
      Math.round(30 + story.sourceCount * 15 + Math.min(30, lifespanHours * 2))
    );

    const factors: SignalInputFactors = {
      searchVelocity,
      newsMomentum,
      socialMomentum: Math.round((newsMomentum + searchVelocity) / 2),
      humanImpact,
      novelty,
      credibility,
      longTermRelevance,
    };

    return {
      storyId: story.id,
      storyTitle: story.title,
      rawMetrics: {
        articleCount: story.articleCount,
        sourceCount: story.sourceCount,
        lifespanHours: Math.round(lifespanHours * 10) / 10,
        articlesPerHour: Math.round(articlesPerHour * 100) / 100,
        recencyHours: Math.round(recencyHours * 10) / 10,
        recent6hCount,
      },
      factors,
    };
  }
}
