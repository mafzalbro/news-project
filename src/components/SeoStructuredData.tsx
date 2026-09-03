import React from 'react';

interface ArticleSchemaProps {
  article: {
    slug: string;
    title: string;
    description: string;
    publishedAt: Date | string;
    updatedAt: Date | string;
    authorName: string;
    imageUrl?: string | null;
    category: { name: string };
  };
}

export function NewsArticleJsonLd({ article }: ArticleSchemaProps) {
  const siteUrl = process.env.SITE_URL || 'http://localhost:3000';
  const siteName = process.env.SITE_NAME || 'TechSignal';

  const isTeamAuthor = article.authorName.toLowerCase().includes('team') || article.authorName.toLowerCase().includes('editorial');

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/news/${article.slug}`,
    },
    headline: article.title,
    description: article.description,
    image: article.imageUrl ? [article.imageUrl] : [`${siteUrl}/og-image.png`],
    datePublished: new Date(article.publishedAt).toISOString(),
    dateModified: new Date(article.updatedAt).toISOString(),
    author: isTeamAuthor
      ? {
          '@type': 'Organization',
          name: article.authorName,
          url: siteUrl,
        }
      : {
          '@type': 'Person',
          name: article.authorName,
          jobTitle: 'Technology Intelligence Analyst',
        },
    publisher: {
      '@type': 'Organization',
      name: siteName,
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
    articleSection: article.category.name,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function OrganizationJsonLd() {
  const siteUrl = process.env.SITE_URL || 'http://localhost:3000';
  const siteName = process.env.SITE_NAME || 'TechSignal';

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName,
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    sameAs: [
      'https://twitter.com/TechSignalNews',
      'https://linkedin.com/company/techsignal',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
