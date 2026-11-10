import { RssNewsSource } from './sources/rss-source';
import { normalizeArticle } from './normalizer/article-normalizer';
import { NormalizedArticle } from './types';

async function runLiveIntegrationTest() {
  console.log('🧪 RUNNING TICKET 2: LIVE RSS NORMALIZATION INTEGRATION TEST...\n');

  const source = new RssNewsSource('TechCrunch', 'https://techcrunch.com/feed/');
  console.log(`Fetching live feed from ${source.name}...`);

  const rawArticles = await source.fetchArticles();
  console.log(`Fetched ${rawArticles.length} raw articles.`);

  const normalizedArticles: NormalizedArticle[] = [];
  let errorCount = 0;

  for (const raw of rawArticles) {
    try {
      const normalized = normalizeArticle(raw);
      normalizedArticles.push(normalized);
    } catch (err) {
      errorCount++;
      console.warn('  ⚠️ Normalization skipped item:', err);
    }
  }

  console.log(`\nINTEGRATION VERIFICATION:`);
  console.log(`  Raw Fetched:     ${rawArticles.length}`);
  console.log(`  Normalized:      ${normalizedArticles.length}`);
  console.log(`  Validation Err:  ${errorCount}`);
  console.log(`  Hash Generated:  ${normalizedArticles.filter((a) => a.contentHash.length === 64).length}`);

  if (normalizedArticles.length > 0) {
    console.log('\n--- SAMPLE CANONICAL NORMALIZED ARTICLE ---');
    const sample = normalizedArticles[0];
    console.log(`Title:        ${sample.title}`);
    console.log(`CanonicalUrl: ${sample.canonicalUrl}`);
    console.log(`Author:       ${sample.authorName}`);
    console.log(`CategorySlug: ${sample.categorySlug}`);
    console.log(`PublishedAt:  ${sample.publishedAt.toISOString()}`);
    console.log(`ContentHash:  ${sample.contentHash}`);
    console.log(`Description:  ${sample.description.slice(0, 120)}...`);
    console.log('--------------------------------------------\n');
  }

  if (rawArticles.length > 0 && normalizedArticles.length === 0) {
    console.error('❌ Integration test failed: 0 normalized articles produced.');
    process.exit(1);
  } else {
    console.log('✅ LIVE INTEGRATION VERIFICATION PASSED SUCCESSFULLY!\n');
  }
}

runLiveIntegrationTest().catch(console.error);
