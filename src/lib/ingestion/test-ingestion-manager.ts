import { NewsSource, RawArticle } from './types';
import { IngestionManager } from './ingestion-manager';
import { prisma } from '../prisma';

class SuccessfulSource implements NewsSource {
  name = 'GoodSource';
  type: 'rss' = 'rss';

  async fetchArticles(): Promise<RawArticle[]> {
    return [
      {
        sourceName: this.name,
        sourceType: 'rss',
        title: 'Breakthrough in Autonomous Agent Memory',
        description: 'New memory architectures enable persistent cross-session LLM state.',
        link: 'https://goodsource.com/2026/03/agent-memory-breakthrough',
        publishedAt: new Date('2026-03-30T10:00:00Z'),
        author: 'Elena Vance',
      },
    ];
  }
}

class FailingSource implements NewsSource {
  name = 'FailingSource';
  type: 'rss' = 'rss';

  async fetchArticles(): Promise<RawArticle[]> {
    throw new Error('Network Connection Refused (HTTP 500)');
  }
}

class DuplicateSource implements NewsSource {
  name = 'DuplicateSource';
  type: 'rss' = 'rss';

  async fetchArticles(): Promise<RawArticle[]> {
    return [
      // Duplicate of GoodSource item (same canonical URL & content)
      {
        sourceName: this.name,
        sourceType: 'rss',
        title: 'Breakthrough in Autonomous Agent Memory',
        description: 'New memory architectures enable persistent cross-session LLM state.',
        link: 'https://goodsource.com/2026/03/agent-memory-breakthrough?utm_source=rss',
        publishedAt: new Date('2026-03-30T10:00:00Z'),
      },
      // Malformed item (invalid URL, missing title)
      {
        sourceName: this.name,
        sourceType: 'rss',
        title: '',
        link: 'invalid-url-string',
      },
    ];
  }
}

async function testIngestionManager() {
  console.log('🧪 TESTING TASK 4: INGESTION MANAGER & FAILURE ISOLATION...\n');

  const sources: NewsSource[] = [
    new SuccessfulSource(),
    new FailingSource(),
    new DuplicateSource(),
  ];

  const manager = new IngestionManager(sources, 5000, 2);
  const metrics = await manager.runIngestion();

  console.log('INGESTION MANAGER METRICS SUMMARY:');
  console.log(`  Sources Attempted:  ${metrics.sourcesAttempted} (Expected: 3)`);
  console.log(`  Sources Succeeded:  ${metrics.sourcesSucceeded} (Expected: 2)`);
  console.log(`  Sources Failed:     ${metrics.sourcesFailed} (Expected: 1)`);
  console.log(`  Articles Fetched:   ${metrics.articlesFetched}`);
  console.log(`  Articles Normalized:${metrics.articlesNormalized}`);
  console.log(`  Articles Saved:     ${metrics.articlesSaved}`);
  console.log(`  Duplicates Skipped: ${metrics.duplicatesSkipped}`);
  console.log(`  Validation Errors:  ${metrics.validationErrors}`);

  let passed = true;

  if (metrics.sourcesAttempted !== 3) {
    console.error('❌ Sources attempted mismatch');
    passed = false;
  }

  if (metrics.sourcesFailed !== 1) {
    console.error('❌ Failure isolation failed! Expected 1 source failure.');
    passed = false;
  }

  if (metrics.duplicatesSkipped < 1) {
    console.error('❌ Deduplication failed! Expected at least 1 duplicate skipped.');
    passed = false;
  }

  if (metrics.validationErrors < 1) {
    console.error('❌ Validation error handling failed! Expected 1 malformed item skipped.');
    passed = false;
  }

  // Check IngestionLog in database
  const lastLog = await prisma.ingestionLog.findFirst({
    orderBy: { createdAt: 'desc' },
  });

  if (lastLog) {
    console.log(`\n✅ INGESTION LOG RECORDED IN DATABASE:`);
    console.log(`  ID:                 ${lastLog.id}`);
    console.log(`  SourceName:         ${lastLog.sourceName}`);
    console.log(`  Status:             ${lastLog.status}`);
    console.log(`  Articles Fetched:   ${lastLog.articlesFetched}`);
    console.log(`  Duplicates Skipped: ${lastLog.duplicatesSkipped}`);
  } else {
    console.error('❌ No IngestionLog found in database');
    passed = false;
  }

  if (passed) {
    console.log('\n✅ INGESTION MANAGER TESTS PASSED CLEANLY!\n');
  } else {
    console.error('\n❌ INGESTION MANAGER TESTS FAILED.');
    process.exit(1);
  }
}

testIngestionManager().catch(console.error);
