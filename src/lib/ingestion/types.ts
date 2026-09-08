export interface RawArticle {
  sourceName: string;
  sourceType: 'rss' | 'api' | 'google-news';
  rawId?: string;
  title: string;
  description?: string;
  link: string;
  publishedAt?: Date | string;
  author?: string;
  content?: string;
  imageUrl?: string;
  categories?: string[];
  rawPayload?: Record<string, unknown>;
}

export interface NormalizedArticle {
  title: string;
  description: string;
  content: string;
  sourceName: string;
  sourceUrl: string;
  canonicalUrl: string;
  publishedAt: Date;
  fetchedAt: Date;
  authorName: string;
  imageUrl?: string;
  categorySlug: string;
  tags: string[];
  contentHash: string;
}

export interface NewsSource {
  name: string;
  type: 'rss' | 'api' | 'google-news';
  fetchArticles(): Promise<RawArticle[]>;
}
