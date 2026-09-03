import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.SITE_URL || 'http://localhost:3000';

  const [articles, categories, trends, timelines] = await Promise.all([
    prisma.article.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.category.findMany({ select: { slug: true } }),
    prisma.trend.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.storyTimeline.findMany({ select: { slug: true, updatedAt: true } }),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: 'always', priority: 1.0 },
    { url: `${baseUrl}/news`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: `${baseUrl}/trends`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: `${baseUrl}/timeline`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/countries`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
  ];

  const articlePages: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${baseUrl}/news/${a.slug}`,
    lastModified: new Date(a.updatedAt),
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  const categoryPages: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${baseUrl}/topics/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.7,
  }));

  return [...staticPages, ...articlePages, ...categoryPages];
}
