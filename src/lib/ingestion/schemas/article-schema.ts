import { z } from 'zod';

export const normalizedArticleSchema = z.object({
  title: z.string().min(1, 'Title cannot be empty'),
  description: z.string(),
  content: z.string(),
  sourceName: z.string().min(1, 'Source name cannot be empty'),
  sourceUrl: z.string().url('Invalid source URL'),
  canonicalUrl: z.string().url('Invalid canonical URL'),
  publishedAt: z.coerce.date(),
  fetchedAt: z.coerce.date(),
  authorName: z.string(),
  imageUrl: z.string().url('Invalid image URL').optional().nullable(),
  categorySlug: z.string(),
  tags: z.array(z.string()),
  contentHash: z.string().length(64, 'Content hash must be a 64-character hex string'),
});

export type NormalizedArticleFromSchema = z.infer<typeof normalizedArticleSchema>;
