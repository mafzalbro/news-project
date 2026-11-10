import { RssNewsSource } from './sources/rss-source';
import { normalizeArticle } from './normalizer/article-normalizer';
import { ArticleRepository } from './persistence/article-repository';
import { prisma } from '../prisma';

async function testPersistence() {
  console.log('🧪 TESTING TICKET 3: PERSISTENCE REPOSITORY & DEDUPLICATION...\n');

  const repository = new ArticleRepository();

  // Fetch and normalize sample feed item
  const source = new RssNewsSource('TechCrunch', 'https://techcrunch.com/feed/');
  const rawArticles = await source.fetchArticles();

  if (rawArticles.length === 0) {
    console.error('❌ Could not fetch raw articles for persistence test.');
    process.exit(1);
  }

  const normalized = normalizeArticle(rawArticles[0]);
  console.log(`Normalizing article: '${normalized.title}'...`);
  console.log(`Canonical URL:     ${normalized.canonicalUrl}`);
  console.log(`Content Hash:      ${normalized.contentHash}`);

  // Test 1: First Save -> SAVED
  const res1 = await repository.saveNormalizedArticle(normalized);
  console.log(`\nTest 1 (Initial Save):`, res1);
  if (res1.status !== 'SAVED' && res1.status !== 'DUPLICATE_SKIPPED') {
    console.error('❌ Initial save failed:', res1);
    process.exit(1);
  }

  // Test 2: Repeat Save -> DUPLICATE_SKIPPED
  const res2 = await repository.saveNormalizedArticle(normalized);
  console.log(`Test 2 (Duplicate Attempt):`, res2);

  if (res2.status !== 'DUPLICATE_SKIPPED') {
    console.error('❌ Duplicate detection failed! Expected DUPLICATE_SKIPPED, got:', res2);
    process.exit(1);
  } else {
    console.log('✅ Level 1/2 Deduplication verified: Duplicate canonicalUrl/contentHash successfully skipped.');
  }

  // Test 3: Ingestion Log Verification
  const log = await repository.logIngestionRun({
    sourceName: normalized.sourceName,
    status: 'SUCCESS',
    articlesFetched: rawArticles.length,
    articlesNormalized: rawArticles.length,
    articlesSaved: 1,
    duplicatesSkipped: rawArticles.length - 1,
  });

  console.log(`\nTest 3 (Ingestion Log Created): ID=${log.id}, Status=${log.status}`);

  // Verify DB record existence via Prisma
  const savedDbArticle = await prisma.article.findFirst({
    where: { canonicalUrl: normalized.canonicalUrl },
    include: { source: true },
  });

  if (savedDbArticle) {
    console.log(`\n✅ DATABASE PERSISTENCE VERIFIED:`);
    console.log(`  Article ID:     ${savedDbArticle.id}`);
    console.log(`  Slug:           ${savedDbArticle.slug}`);
    console.log(`  Title:          ${savedDbArticle.title}`);
    console.log(`  Canonical URL:  ${savedDbArticle.canonicalUrl}`);
    console.log(`  Publisher:      ${savedDbArticle.source?.name}`);
  } else {
    console.error('❌ Article not found in database.');
    process.exit(1);
  }

  console.log('\n✅ PERSISTENCE REPOSITORY TESTS PASSED SUCCESSFULLY!\n');
}

testPersistence().catch(console.error);
