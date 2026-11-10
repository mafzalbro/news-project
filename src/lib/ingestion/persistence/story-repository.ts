import { prisma } from '../../prisma';
import { StoryClusterer } from '../clustering/story-clusterer';

export interface ClusterLinkResult {
  storyId: string;
  storySlug: string;
  isNewStory: boolean;
  confidence: string;
  matchedSimilarity: number;
}

export class StoryRepository {
  private clusterer: StoryClusterer;

  constructor() {
    this.clusterer = new StoryClusterer();
  }

  /**
   * Incrementally processes an unclustered article, matching it to an existing Story
   * or creating a new Story record if no match passes confidence thresholds.
   */
  async clusterAndLinkArticle(articleId: string): Promise<ClusterLinkResult | null> {
    const article = await prisma.article.findUnique({
      where: { id: articleId },
      include: { source: true },
    });

    if (!article) return null;

    // Check if article is already linked to a story
    const existingStoryLink = await prisma.storyArticle.findFirst({
      where: { articleId: article.id },
      include: { story: true },
    });

    if (existingStoryLink) {
      return {
        storyId: existingStoryLink.storyId,
        storySlug: existingStoryLink.story.slug,
        isNewStory: false,
        confidence: existingStoryLink.confidence,
        matchedSimilarity: existingStoryLink.similarity,
      };
    }

    // Find candidate stories active within 72 hours of this article's publication date
    const seventyTwoHoursBefore = new Date(article.publishedAt.getTime() - 72 * 60 * 60 * 1000);
    const seventyTwoHoursAfter = new Date(article.publishedAt.getTime() + 72 * 60 * 60 * 1000);

    const candidateStories = await prisma.story.findMany({
      where: {
        lastSeenAt: { gte: seventyTwoHoursBefore, lte: seventyTwoHoursAfter },
      },
      include: {
        storyArticles: {
          include: {
            article: {
              select: { id: true, title: true, publishedAt: true, sourceId: true },
            },
          },
        },
      },
    });

    let bestMatchStoryId: string | null = null;
    let bestMatchSlug: string | null = null;
    let bestConfidence: 'HIGH' | 'MEDIUM' | 'LOW' = 'HIGH';
    let maxSimilarity = 0.0;

    // Evaluate candidate stories deterministically
    for (const story of candidateStories) {
      for (const link of story.storyArticles) {
        const matchResult = this.clusterer.compareArticles(
          article.title,
          article.publishedAt,
          link.article.title,
          link.article.publishedAt
        );

        if (matchResult.isMatch && matchResult.similarityScore > maxSimilarity) {
          maxSimilarity = matchResult.similarityScore;
          bestMatchStoryId = story.id;
          bestMatchSlug = story.slug;
          bestConfidence = matchResult.confidence as 'HIGH' | 'MEDIUM' | 'LOW';
        }
      }
    }

    // Incremental Match Found: Link to existing story
    if (bestMatchStoryId && bestMatchSlug) {
      await prisma.storyArticle.create({
        data: {
          storyId: bestMatchStoryId,
          articleId: article.id,
          confidence: bestConfidence,
          similarity: maxSimilarity,
        },
      });

      // Recalculate story counts & lastSeenAt
      await this.updateStoryMetrics(bestMatchStoryId, article.publishedAt);

      return {
        storyId: bestMatchStoryId,
        storySlug: bestMatchSlug,
        isNewStory: false,
        confidence: bestConfidence,
        matchedSimilarity: maxSimilarity,
      };
    }

    // No Match Found: Create new Story record
    const baseSlug = this.slugify(article.title);
    let finalSlug = baseSlug;
    let counter = 1;

    while (await prisma.story.findUnique({ where: { slug: finalSlug } })) {
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const newStory = await prisma.story.create({
      data: {
        slug: finalSlug,
        title: article.title,
        summary: article.description,
        firstSeenAt: article.publishedAt,
        lastSeenAt: article.publishedAt,
        articleCount: 1,
        sourceCount: article.sourceId ? 1 : 1,
        storyArticles: {
          create: [
            {
              articleId: article.id,
              confidence: 'HIGH',
              similarity: 1.0,
            },
          ],
        },
      },
    });

    return {
      storyId: newStory.id,
      storySlug: newStory.slug,
      isNewStory: true,
      confidence: 'HIGH',
      matchedSimilarity: 1.0,
    };
  }

  /**
   * Recalculates story articleCount, unique sourceCount, and lastSeenAt.
   */
  private async updateStoryMetrics(storyId: string, articleDate: Date) {
    const storyArticles = await prisma.storyArticle.findMany({
      where: { storyId },
      include: { article: { select: { sourceId: true, publishedAt: true } } },
    });

    const articleCount = storyArticles.length;
    const uniqueSourceIds = new Set(
      storyArticles.map((sa) => sa.article.sourceId).filter(Boolean)
    );
    const sourceCount = Math.max(1, uniqueSourceIds.size);

    const latestDate = storyArticles.reduce((latest, current) => {
      return current.article.publishedAt > latest ? current.article.publishedAt : latest;
    }, articleDate);

    await prisma.story.update({
      where: { id: storyId },
      data: {
        articleCount,
        sourceCount,
        lastSeenAt: latestDate,
        updatedAt: new Date(),
      },
    });
  }

  private slugify(text: string): string {
    const slug = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    return slug || 'untitled-story';
  }
}
