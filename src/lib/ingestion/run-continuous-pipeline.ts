import { ContinuousPipeline } from './pipeline/continuous-pipeline';

async function main() {
  console.log('====================================================');
  console.log('🚀 TECHSIGNAL AUTOMATED CONTINUOUS PIPELINE RUNNER');
  console.log('====================================================\n');

  const pipeline = new ContinuousPipeline();
  const result = await pipeline.runPipeline();

  if (result.status === 'LOCKED_SKIPPED') {
    console.log('⚠️ PIPELINE EXECUTION SKIPPED: Active lock present.');
    console.log(`  Message: ${result.error}\n`);
    return;
  }

  if (result.status === 'FAILED') {
    console.error('❌ PIPELINE EXECUTION FAILED:');
    console.error(`  Error: ${result.error}\n`);
    return;
  }

  console.log('====================================================');
  console.log('📊 CONTINUOUS PIPELINE EXECUTION METRICS');
  console.log('====================================================');
  console.log(`Status:                  ${result.status}`);
  console.log(`Lock Acquired:           ${result.lockAcquired}`);
  console.log(`Articles Fetched:        ${result.ingestionMetrics?.articlesFetched || 0}`);
  console.log(`Articles Normalized:     ${result.ingestionMetrics?.articlesNormalized || 0}`);
  console.log(`Articles Saved:          ${result.ingestionMetrics?.articlesSaved || 0}`);
  console.log(`Duplicates Skipped:      ${result.ingestionMetrics?.duplicatesSkipped || 0}`);
  console.log(`Articles Clustered:      ${result.articlesClustered}`);
  console.log(`Affected Stories Rescored:${result.affectedStoriesRescored}`);
  console.log(`Total Pipeline Duration: ${(result.durationMs / 1000).toFixed(2)}s`);
  console.log('====================================================\n');

  if (result.diagnostics) {
    const d = result.diagnostics;
    console.log('====================================================');
    console.log('🔬 SCORE DISTRIBUTION DIAGNOSTICS');
    console.log('====================================================');
    console.log(`Total Stories Scored:    ${d.totalScored}`);
    console.log(`Average Score:           ${d.averageScore} / 100`);
    console.log(`Median Score (P50):      ${d.medianScore} / 100`);
    console.log('----------------------------------------------------');
    console.log(`Percentile Breakdown:`);
    console.log(`  P25: ${d.p25Score} | P50: ${d.p50Score} | P75: ${d.p75Score} | P90: ${d.p90Score} | P95: ${d.p95Score}`);
    console.log('----------------------------------------------------');
    console.log(`Tier Distribution:`);
    console.log(`  🔥 FIRE Tier (>= 85):     ${d.tierCounts.FIRE}`);
    console.log(`  ⚡ HIGH Tier (>= 70):     ${d.tierCounts.HIGH}`);
    console.log(`  📈 MODERATE Tier (>= 50): ${d.tierCounts.MODERATE}`);
    console.log(`  ❄️  LOW Tier (< 50):      ${d.tierCounts.LOW}`);
    console.log('----------------------------------------------------');
    console.log(`Factor Averages:`);
    console.log(`  Search Velocity: ${d.factorAverages.searchVelocity} | News Momentum: ${d.factorAverages.newsMomentum} | Credibility: ${d.factorAverages.credibility}`);
    console.log(`  Novelty:         ${d.factorAverages.novelty} | Human Impact: ${d.factorAverages.humanImpact} | Long-Term: ${d.factorAverages.longTermRelevance}`);
    console.log('====================================================\n');
  }
}

main().catch(console.error);
