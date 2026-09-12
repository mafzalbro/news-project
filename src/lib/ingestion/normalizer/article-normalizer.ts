import { createHash } from 'crypto';
import { RawArticle, NormalizedArticle } from '../types';
import { normalizedArticleSchema } from '../schemas/article-schema';

export function normalizeArticle(raw: RawArticle): NormalizedArticle {
  // 1. Title Normalization
  const cleanTitle = cleanText(raw.title || '');
  if (!cleanTitle) {
    throw new Error('Normalization Error: Raw article title is empty or invalid.');
  }

  // 2. URL Normalization & Validation
  const rawUrl = (raw.link || '').trim();
  const canonicalUrl = normalizeUrl(rawUrl);
  if (!canonicalUrl) {
    throw new Error(`Normalization Error: Invalid URL '${rawUrl}'.`);
  }

  // 3. Description & Content Normalization
  const cleanDescription = cleanText(raw.description || '');
  const cleanContent = cleanText(raw.content || cleanDescription);

  // 4. Date Normalization
  let publishedAt: Date;
  if (raw.publishedAt) {
    const parsed = new Date(raw.publishedAt);
    publishedAt = isNaN(parsed.getTime()) ? new Date() : parsed;
  } else {
    publishedAt = new Date();
  }
  const fetchedAt = new Date();

  // 5. Author & Image Normalization
  const authorName = cleanText(raw.author || '') || 'Editorial Team';
  const imageUrl = raw.imageUrl && isValidUrl(raw.imageUrl) ? raw.imageUrl.trim() : null;

  // 6. Category & Tags
  const categorySlug = raw.categories && raw.categories.length > 0
    ? slugify(raw.categories[0])
    : 'general-tech';
  const tags = (raw.categories || []).map((c) => slugify(c)).filter(Boolean);

  // 7. Deterministic SHA-256 Content Hash
  // Generated from canonical normalized title + normalized content + canonical URL
  const hashPayload = `${cleanTitle.toLowerCase()}|${cleanContent.toLowerCase()}|${canonicalUrl.toLowerCase()}`;
  const contentHash = createHash('sha256').update(hashPayload).digest('hex');

  const candidate: NormalizedArticle = {
    title: cleanTitle,
    description: cleanDescription,
    content: cleanContent,
    sourceName: raw.sourceName || 'Unknown Source',
    sourceUrl: rawUrl,
    canonicalUrl,
    publishedAt,
    fetchedAt,
    authorName,
    imageUrl,
    categorySlug,
    tags,
    contentHash,
  };

  // 8. Strict Zod Validation Pass
  return normalizedArticleSchema.parse(candidate);
}

function cleanText(text: string): string {
  if (!text) return '';
  return text
    // Unwrap CDATA
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    // Strip HTML tags
    .replace(/<[^>]*>/g, ' ')
    // Decode HTML entities
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    // Numeric HTML entities decoding
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(Number(dec)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    // Collapse whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeUrl(urlStr: string): string | null {
  if (!urlStr) return null;
  try {
    const cleanUrlStr = urlStr
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .trim();
    const parsed = new URL(cleanUrlStr);
    // Strip common tracking parameters (utm_*, ref, etc.)
    const searchParams = new URLSearchParams(parsed.search);
    const trackingKeys: string[] = [];
    searchParams.forEach((_, key) => {
      if (key.startsWith('utm_') || key === 'ref' || key === 'fbclid') {
        trackingKeys.push(key);
      }
    });
    trackingKeys.forEach((key) => searchParams.delete(key));

    parsed.search = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return parsed.toString();
  } catch {
    return null;
  }
}

function isValidUrl(urlStr: string): boolean {
  try {
    new URL(urlStr);
    return true;
  } catch {
    return false;
  }
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}
