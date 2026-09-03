import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const siteUrl = process.env.SITE_URL || 'http://localhost:3000';
  const siteName = process.env.SITE_NAME || 'TechSignal';

  const article = await prisma.article.findUnique({
    where: { slug },
    select: {
      title: true,
      description: true,
      publishedAt: true,
      authorName: true,
      imageUrl: true,
      category: { select: { name: true } },
    },
  });

  if (!article) {
    return {
      title: 'Article Not Found | ' + siteName,
    };
  }

  const url = `${siteUrl}/news/${slug}`;

  return {
    title: `${article.title} | ${siteName}`,
    description: article.description,
    authors: [{ name: article.authorName }],
    category: article.category.name,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: article.title,
      description: article.description,
      url,
      siteName,
      type: 'article',
      publishedTime: new Date(article.publishedAt).toISOString(),
      authors: [article.authorName],
      images: article.imageUrl ? [{ url: article.imageUrl, alt: article.title }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
      images: article.imageUrl ? [article.imageUrl] : [],
    },
  };
}
