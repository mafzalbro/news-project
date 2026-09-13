import { NewsSource } from './types';
import { normalizeArticle } from './normalizer/article-normalizer';
import { ArticleRepository } from './persistence/article-repository';
import { getRegisteredNewsSources } from './sources/source-registry';

export interface IngestionMetrics {
  sourcesAttempted: number;
  sourcesSucceeded: number;
  sourcesFailed: number;
  articlesFetched: number;
  articlesNormalized: number;
  articlesSaved: number;
  duplicatesSkipped: number;
  validationErrors: number;
  durationMs: number;
  errors: { sourceName: string; error: string }[];
}

export class IngestionManager {
  private repository: ArticleRepository;
  private sources: NewsSource[];
  private timeoutMs: number;
  private concurrencyLimit: number;

  constructor(
    sources: NewsSource[] = getRegisteredNewsSources(),
    timeoutMs = 10000,
    concurrencyLimit = 3
  ) {
    this.repository = new ArticleRepository();
    this.sources = sources;
    this.timeoutMs = timeoutMs;
    this.concurrencyLimit = concurrencyLimit;
  }

  /**
   * Runs the complete ingestion pipeline across all configured sources with failure isolation.
   */
  async runIngestion(): Promise<IngestionMetrics> {
    const startTime = Date.now();

    const metrics: IngestionMetrics = {
      sourcesAttempted: this.sources.length,
      sourcesSucceeded: 0,
      sourcesFailed: 0,
      articlesFetched: 0,
      articlesNormalized: 0,
      articlesSaved: 0,
      duplicatesSkipped: 0,
      validationErrors: 0,
      durationMs: 0,
      errors: [],
    };

    // Process sources in controlled concurrent batches
    for (let i = 0; i < this.sources.length; i += this.concurrencyLimit) {
      const batch = this.sources.slice(i, i + this.concurrencyLimit);
      await Promise.all(
        batch.map((source) => this.processSingleSource(source, metrics))
      );
    }

    metrics.durationMs = Date.now() - startTime;

    // Log overall run metrics into IngestionLog table
    await this.repository.logIngestionRun({
      sourceName: `MultiSourceRun (${this.sources.length} sources)`,
      status: metrics.sourcesFailed === 0 ? 'SUCCESS' : metrics.sourcesSucceeded > 0 ? 'PARTIAL' : 'FAILED',
      articlesFetched: metrics.articlesFetched,
      articlesNormalized: metrics.articlesNormalized,
      articlesSaved: metrics.articlesSaved,
      duplicatesSkipped: metrics.duplicatesSkipped,
      errorLog: metrics.errors.length > 0 ? JSON.stringify(metrics.errors) : undefined,
    });

    return metrics;
  }

  private async processSingleSource(source: NewsSource, metrics: IngestionMetrics): Promise<void> {
    try {
      // 1. Fetch articles with strict timeout
      const rawArticles = await this.fetchWithTimeout(source);
      metrics.sourcesSucceeded++;
      metrics.articlesFetched += rawArticles.length;

      // 2. Normalize, Validate, and Persist each article
      for (const raw of rawArticles) {
        try {
          const normalized = normalizeArticle(raw);
          metrics.articlesNormalized++;

          const saveResult = await this.repository.saveNormalizedArticle(normalized);
          if (saveResult.status === 'SAVED') {
            metrics.articlesSaved++;
          } else if (saveResult.status === 'DUPLICATE_SKIPPED') {
            metrics.duplicatesSkipped++;
          }
        } catch {
          // Normalization or validation failure
          metrics.validationErrors++;
        }
      }
    } catch (err: unknown) {
      metrics.sourcesFailed++;
      const errorMessage = err instanceof Error ? err.message : String(err);
      metrics.errors.push({ sourceName: source.name, error: errorMessage });
    }
  }

  private fetchWithTimeout(source: NewsSource): Promise<import('./types').RawArticle[]> {
    return Promise.race([
      source.fetchArticles(),
      new Promise<import('./types').RawArticle[]>((_, reject) =>
        setTimeout(
          () => reject(new Error(`Fetch timeout exceeded (${this.timeoutMs}ms) for ${source.name}`)),
          this.timeoutMs
        )
      ),
    ]);
  }
}
