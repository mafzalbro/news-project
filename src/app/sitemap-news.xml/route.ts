import { prisma } from '@/lib/prisma';

export async function GET() {
  const baseUrl = process.env.SITE_URL || 'http://localhost:3000';
  const siteName = process.env.SITE_NAME || 'TechSignal';

  // Google News Sitemap requires articles published in the last 48 hours
  const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);

  const recentArticles = await prisma.article.findMany({
    where: {
      publishedAt: {
        gte: fortyEightHoursAgo,
      },
    },
    include: {
      category: true,
    },
    orderBy: {
      publishedAt: 'desc',
    },
  });

  const xmlItems = recentArticles
    .map((article) => {
      return `
    <url>
      <loc>${baseUrl}/news/${article.slug}</loc>
      <news:news>
        <news:publication>
          <news:name>${siteName}</news:name>
          <news:language>en</news:language>
        </news:publication>
        <news:publication_date>${new Date(article.publishedAt).toISOString()}</news:publication_date>
        <news:title>${escapeXml(article.title)}</news:title>
      </news:news>
    </url>`;
    })
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  ${xmlItems}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case '\'':
        return '&apos;';
      case '"':
        return '&quot;';
      default:
        return c;
    }
  });
}
