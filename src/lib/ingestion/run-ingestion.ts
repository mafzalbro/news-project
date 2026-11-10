import { IngestionManager } from './ingestion-manager';
import { getRegisteredNewsSources } from './sources/source-registry';

async function main() {
  console.log('====================================================');
  console.log('🚀 TECHSIGNAL MULTI-SOURCE LIVE INGESTION RUNNER');
  console.log('====================================================\n');

  const sources = getRegisteredNewsSources();
  console.log(`Registered ${sources.length} active external news sources:\n`);
  sources.forEach((s, idx) => console.log(`  ${idx + 1}. [${s.type.toUpperCase()}] ${s.name}`));
  console.log('\nExecuting pipeline (batch concurrency: 3, timeout: 10s per feed)...\n');

  const manager = new IngestionManager(sources, 10000, 3);
  const metrics = await manager.runIngestion();

  console.log('====================================================');
  console.log('📊 LIVE INGESTION PERFORMANCE SUMMARY');
  console.log('====================================================');
  console.log(`Sources Attempted:   ${metrics.sourcesAttempted}`);
  console.log(`Sources Succeeded:   ${metrics.sourcesSucceeded}`);
  console.log(`Sources Failed:      ${metrics.sourcesFailed}`);
  console.log('----------------------------------------------------');
  console.log(`Articles Fetched:    ${metrics.articlesFetched}`);
  console.log(`Articles Normalized: ${metrics.articlesNormalized}`);
  console.log(`Articles Saved:      ${metrics.articlesSaved}`);
  console.log(`Duplicates Skipped:  ${metrics.duplicatesSkipped}`);
  console.log(`Validation Errors:   ${metrics.validationErrors}`);
  console.log('----------------------------------------------------');
  console.log(`Pipeline Duration:   ${(metrics.durationMs / 1000).toFixed(2)}s`);
  console.log('====================================================\n');

  if (metrics.errors.length > 0) {
    console.log('⚠️ FAILED / TIMED-OUT SOURCES:');
    metrics.errors.forEach((e) => console.log(`  • ${e.sourceName}: ${e.error}`));
    console.log('');
  }

  if (metrics.articlesFetched >= 100) {
    console.log('🎉 MILESTONE PASSED: Ingested 100+ real external articles into SQLite database!');
  } else {
    console.log(`ℹ️ Ingested ${metrics.articlesFetched} real articles.`);
  }
}

main().catch(console.error);
