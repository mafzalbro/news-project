import { prisma } from '../../prisma';
import { IngestionManager, IngestionMetrics } from '../ingestion-manager';
import { StoryRepository } from '../persistence/story-repository';
import { StoryScorer, ScoredStoryResult } from '../signals/story-scorer';

export interface ScoreDistributionDiagnostics {
  totalScored: number;
  averageScore: number;
  medianScore: number;
  p25Score: number;
  p50Score: number;
  p75Score: number;
  p90Score: number;
  p95Score: number;
  tierCounts: { FIRE: number; HIGH: number; MODERATE: number; LOW: number };
  factorAverages: {
    searchVelocity: number;
    newsMomentum: number;
    socialMomentum: number;
    humanImpact: number;
    novelty: number;
    credibility: number;
    longTermRelevance: number;
  };
}

export interface ContinuousPipelineResult {
  status: 'SUCCESS' | 'LOCKED_SKIPPED' | 'FAILED';
  lockAcquired: boolean;
  ingestionMetrics?: IngestionMetrics;
  articlesClustered: number;
  affectedStoriesRescored: number;
  diagnostics?: ScoreDistributionDiagnostics;
  durationMs: number;
  error?: string;
}

export class ContinuousPipeline {
  private ingestionManager: IngestionManager;
  private storyRepo: StoryRepository;
  private scorer: StoryScorer;
  private lockKey: string;
  private lockDurationMs: number;

  constructor(lockKey = 'global-ingestion-lock', lockDurationMs = 15 * 60 * 1000) {
    this.ingestionManager = new IngestionManager();
    this.storyRepo = new StoryRepository();
    this.scorer = new StoryScorer();
    this.lockKey = lockKey;
    this.lockDurationMs = lockDurationMs;
  }

  /**
   * Executes continuous automated ingestion, incremental story clustering,
   * story re-scoring, snapshot persistence, and score distribution diagnostics.
   */
  async runPipeline(): Promise<ContinuousPipelineResult> {
    const startTime = Date.now();

    // 1. Attempt SQLite Atomic Execution Lock
    const acquired = await this.acquireLock();
    if (!acquired) {
      return {
        status: 'LOCKED_SKIPPED',
        lockAcquired: false,
        articlesClustered: 0,
        affectedStoriesRescored: 0,
        durationMs: Date.now() - startTime,
        error: 'Pipeline execution skipped: Another ingestion run is currently in progress.',
      };
    }

    try {
      // 2. Ingest Multi-Source Articles
      const ingestionMetrics = await this.ingestionManager.runIngestion();

      // 3. Incremental Story Clustering for Unclustered Articles
      const unclusteredArticles = await prisma.article.findMany({
        where: { storyArticles: { none: {} } },
        select: { id: true },
      });

      const affectedStoryIds = new Set<string>();
      let articlesClustered = 0;

      for (const art of unclusteredArticles) {
        const clusterRes = await this.storyRepo.clusterAndLinkArticle(art.id);
        if (clusterRes) {
          articlesClustered++;
          affectedStoryIds.add(clusterRes.storyId);
        }
      }

      // 4. Re-score Affected Stories & Create StorySignal Snapshots
      let affectedStoriesRescored = 0;
      for (const storyId of affectedStoryIds) {
        const scoreRes = await this.scorer.scoreAndPersistStory(storyId);
        if (scoreRes) {
          affectedStoriesRescored++;
        }
      }

      // 5. Generate Score Distribution Diagnostics across all stories
      const diagnostics = await this.generateScoreDiagnostics();

      return {
        status: 'SUCCESS',
        lockAcquired: true,
        ingestionMetrics,
        articlesClustered,
        affectedStoriesRescored,
        diagnostics,
        durationMs: Date.now() - startTime,
      };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      return {
        status: 'FAILED',
        lockAcquired: true,
        articlesClustered: 0,
        affectedStoriesRescored: 0,
        durationMs: Date.now() - startTime,
        error: errorMessage,
      };
    } finally {
      // 6. Release Execution Lock
      await this.releaseLock();
    }
  }

  /**
   * Calculates score distribution diagnostics (P25, P50, P75, P90, P95, factor averages).
   */
  async generateScoreDiagnostics(): Promise<ScoreDistributionDiagnostics> {
    const stories = await prisma.story.findMany({
      select: { id: true },
    });

    const scores: number[] = [];
    const tierCounts = { FIRE: 0, HIGH: 0, MODERATE: 0, LOW: 0 };
    const factorSums = {
      searchVelocity: 0,
      newsMomentum: 0,
      socialMomentum: 0,
      humanImpact: 0,
      novelty: 0,
      credibility: 0,
      longTermRelevance: 0,
    };

    for (const story of stories) {
      const res = await this.scorer.scoreAndPersistStory(story.id);
      if (res) {
        scores.push(res.overallScore);
        tierCounts[res.tier]++;
        factorSums.searchVelocity += res.factors.searchVelocity;
        factorSums.newsMomentum += res.factors.newsMomentum;
        factorSums.socialMomentum += res.factors.socialMomentum;
        factorSums.humanImpact += res.factors.humanImpact;
        factorSums.novelty += res.factors.novelty;
        factorSums.credibility += res.factors.credibility;
        factorSums.longTermRelevance += res.factors.longTermRelevance;
      }
    }

    scores.sort((a, b) => a - b);
    const count = scores.length || 1;

    const getPercentile = (pct: number): number => {
      if (scores.length === 0) return 0;
      const index = Math.min(scores.length - 1, Math.floor((pct / 100) * scores.length));
      return scores[index];
    };

    const totalSum = scores.reduce((sum, val) => sum + val, 0);

    return {
      totalScored: scores.length,
      averageScore: Math.round((totalSum / count) * 10) / 10,
      medianScore: getPercentile(50),
      p25Score: getPercentile(25),
      p50Score: getPercentile(50),
      p75Score: getPercentile(75),
      p90Score: getPercentile(90),
      p95Score: getPercentile(95),
      tierCounts,
      factorAverages: {
        searchVelocity: Math.round((factorSums.searchVelocity / count) * 10) / 10,
        newsMomentum: Math.round((factorSums.newsMomentum / count) * 10) / 10,
        socialMomentum: Math.round((factorSums.socialMomentum / count) * 10) / 10,
        humanImpact: Math.round((factorSums.humanImpact / count) * 10) / 10,
        novelty: Math.round((factorSums.novelty / count) * 10) / 10,
        credibility: Math.round((factorSums.credibility / count) * 10) / 10,
        longTermRelevance: Math.round((factorSums.longTermRelevance / count) * 10) / 10,
      },
    };
  }

  private async acquireLock(): Promise<boolean> {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + this.lockDurationMs);

    // Clean up expired lock if present
    await prisma.ingestionLock.deleteMany({
      where: { key: this.lockKey, expiresAt: { lt: now } },
    });

    try {
      await prisma.ingestionLock.create({
        data: {
          key: this.lockKey,
          acquiredAt: now,
          expiresAt,
        },
      });
      return true;
    } catch {
      // Lock creation failed due to unique key constraint (active lock exists)
      return false;
    }
  }

  private async releaseLock(): Promise<void> {
    try {
      await prisma.ingestionLock.deleteMany({
        where: { key: this.lockKey },
      });
    } catch {
      // Lock cleanup failure silent catch
    }
  }
}
