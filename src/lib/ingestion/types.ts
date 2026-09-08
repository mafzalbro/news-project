import { z } from 'zod';
import { normalizedArticleSchema } from './schemas/article-schema';

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

export type NormalizedArticle = z.infer<typeof normalizedArticleSchema>;

export interface NewsSource {
  name: string;
  type: 'rss' | 'api' | 'google-news';
  fetchArticles(): Promise<RawArticle[]>;
}
