import { prisma } from '../../prisma';
import { RealSignalExtractor } from './signal-extractor';
import { calculateTechSignal, ComputedTechSignal, SignalInputFactors } from '../../signal-engine';

export interface ScoredStoryResult {
  storyId: string;
  title: string;
  overallScore: number;
  tier: 'FIRE' | 'HIGH' | 'MODERATE' | 'LOW';
  explanation: string;
  factors: SignalInputFactors;
  snapshotId: string;
  calculatedAt: Date;
}

export class StoryScorer {
  private extractor: RealSignalExtractor;

  constructor() {
    this.extractor = new RealSignalExtractor();
  }

  /**
   * Authoritative canonical scoring path for stories.
   * Calculates score from real metrics, applies single-source safeguards,
   * and persists auditable StorySignal snapshot.
   */
  async scoreAndPersistStory(storyId: string): Promise<ScoredStoryResult | null> {
    const story = await prisma.story.findUnique({
      where: { id: storyId },
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

    if (!story) return null;

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

    // 1. Extract real signal factors
    const extracted = this.extractor.extractFactors(rawData);
    const factors = extracted.factors;

    // 2. Compute deterministic Tech Signal score
    let computed = calculateTechSignal(factors);

    // 3. Safeguard: Single-Source Cap
    // Single-publisher stories cannot achieve FIRE (>85) tier without multi-source cross-verification
    if (story.sourceCount === 1 && computed.overallScore >= 80) {
      const cappedScore = 79.9;
      computed = {
        ...computed,
        overallScore: cappedScore,
        signalTier: 'HIGH',
        explanation: `${computed.explanation} (Single-source cap applied pending multi-publisher corroboration).`,
      };
    }

    // 4. Persist auditable StorySignal snapshot
    const snapshot = await prisma.storySignal.create({
      data: {
        storyId: story.id,
        overallScore: computed.overallScore,
        tier: computed.signalTier,
        searchVelocity: factors.searchVelocity,
        newsMomentum: factors.newsMomentum,
        socialMomentum: factors.socialMomentum,
        humanImpact: factors.humanImpact,
        novelty: factors.novelty,
        credibility: factors.credibility,
        longTermRelevance: factors.longTermRelevance,
        explanation: computed.explanation,
        calculatedAt: new Date(),
      },
    });

    return {
      storyId: story.id,
      title: story.title,
      overallScore: computed.overallScore,
      tier: computed.signalTier,
      explanation: computed.explanation,
      factors,
      snapshotId: snapshot.id,
      calculatedAt: snapshot.calculatedAt,
    };
  }
}
