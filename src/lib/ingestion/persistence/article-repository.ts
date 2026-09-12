import { prisma } from '../../prisma';
import { NormalizedArticle } from '../types';

export interface SaveResult {
  status: 'SAVED' | 'DUPLICATE_SKIPPED';
  id?: string;
  slug?: string;
  reason?: string;
}

export class ArticleRepository {
  /**
   * Persists a normalized article into the database with strict duplicate prevention.
   */
  async saveNormalizedArticle(article: NormalizedArticle): Promise<SaveResult> {
    // 1. Check Level 1: Canonical URL exact match
    const existingByUrl = await prisma.article.findFirst({
      where: { canonicalUrl: article.canonicalUrl },
      select: { id: true, slug: true },
    });

    if (existingByUrl) {
      return {
        status: 'DUPLICATE_SKIPPED',
        id: existingByUrl.id,
        slug: existingByUrl.slug,
        reason: `Article with canonicalUrl '${article.canonicalUrl}' already exists.`,
      };
    }

    // 2. Check Level 2: Content Hash match
    const existingByHash = await prisma.article.findFirst({
      where: { contentHash: article.contentHash },
      select: { id: true, slug: true },
    });

    if (existingByHash) {
      return {
        status: 'DUPLICATE_SKIPPED',
        id: existingByHash.id,
        slug: existingByHash.slug,
        reason: `Article with contentHash '${article.contentHash}' already exists.`,
      };
    }

    // 3. Find or create Publisher Source
    const sourceSlug = this.slugify(article.sourceName);
    const source = await prisma.source.upsert({
      where: { slug: sourceSlug },
      update: { name: article.sourceName, updatedAt: new Date() },
      create: {
        slug: sourceSlug,
        name: article.sourceName,
        url: article.sourceUrl,
        type: 'rss',
      },
    });

    // 4. Find or fallback Category
    let category = await prisma.category.findFirst({
      where: { slug: article.categorySlug },
    });

    if (!category) {
      category = await prisma.category.findFirst({
        where: { slug: 'ai-agentic' },
      });
    }

    if (!category) {
      // Create fallback category if database has no categories yet
      category = await prisma.category.create({
        data: {
          slug: 'general-tech',
          name: 'General Technology',
          description: 'Global technology developments and signal intelligence.',
        },
      });
    }

    // 5. Generate Unique Slug
    const baseSlug = this.slugify(article.title);
    let finalSlug = baseSlug;
    let counter = 1;

    while (await prisma.article.findUnique({ where: { slug: finalSlug } })) {
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    // 6. Create Article in Prisma DB
    const savedArticle = await prisma.article.create({
      data: {
        slug: finalSlug,
        title: article.title,
        description: article.description,
        content: article.content,
        canonicalUrl: article.canonicalUrl,
        contentHash: article.contentHash,
        publishedAt: article.publishedAt,
        fetchedAt: article.fetchedAt,
        authorName: article.authorName,
        authorRole: 'External Publisher Coverage',
        imageUrl: article.imageUrl,

        categoryId: category.id,
        sourceId: source.id,

        sources: {
          create: [
            {
              title: article.title,
              url: article.sourceUrl,
              publisher: article.sourceName,
            },
          ],
        },
      },
    });

    return {
      status: 'SAVED',
      id: savedArticle.id,
      slug: savedArticle.slug,
    };
  }

  /**
   * Logs pipeline execution metrics into IngestionLog table.
   */
  async logIngestionRun(log: {
    sourceName: string;
    status: 'SUCCESS' | 'PARTIAL' | 'FAILED';
    articlesFetched: number;
    articlesNormalized: number;
    articlesSaved: number;
    duplicatesSkipped: number;
    errorLog?: string;
  }) {
    return prisma.ingestionLog.create({
      data: {
        sourceName: log.sourceName,
        status: log.status,
        articlesFetched: log.articlesFetched,
        articlesNormalized: log.articlesNormalized,
        articlesSaved: log.articlesSaved,
        duplicatesSkipped: log.duplicatesSkipped,
        errorLog: log.errorLog,
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
    return slug || 'untitled';
  }
}
