import { ContinuousPipeline } from './pipeline/continuous-pipeline';
import { prisma } from '../prisma';

async function runContinuousPipelineTests() {
  console.log('🧪 TESTING TASK 8: CONTINUOUS PIPELINE & EXECUTION LOCKING...\n');

  let passed = 0;
  let total = 0;

  function assert(condition: boolean, testName: string) {
    total++;
    if (condition) {
      passed++;
      console.log(`  ✅ [PASS] ${testName}`);
    } else {
      console.error(`  ❌ [FAIL] ${testName}`);
    }
  }

  // Clean existing locks for test isolation
  await prisma.ingestionLock.deleteMany({ where: { key: 'test-pipeline-lock' } });

  const pipeline1 = new ContinuousPipeline('test-pipeline-lock', 60000);
  const pipeline2 = new ContinuousPipeline('test-pipeline-lock', 60000);

  // Test 1: Atomic Execution Lock Acquisition & Rejection
  // Manually insert lock into DB to simulate active background run
  await prisma.ingestionLock.create({
    data: {
      key: 'test-pipeline-lock',
      acquiredAt: new Date(),
      expiresAt: new Date(Date.now() + 60000),
    },
  });

  const runResult2 = await pipeline2.runPipeline();
  assert(
    runResult2.status === 'LOCKED_SKIPPED' && !runResult2.lockAcquired,
    'Lock Safety: Second concurrent pipeline run correctly rejected when lock is active'
  );

  // Clean lock to allow next test
  await prisma.ingestionLock.deleteMany({ where: { key: 'test-pipeline-lock' } });

  // Test 2: Successful Execution & Score Distribution Diagnostics
  const diagnostics = await pipeline1.generateScoreDiagnostics();

  assert(diagnostics.totalScored > 0, 'Diagnostics: Total scored stories > 0');
  assert(diagnostics.averageScore >= 0 && diagnostics.averageScore <= 100, 'Diagnostics: Valid average score calculated');
  assert(diagnostics.p50Score >= 0 && diagnostics.p95Score >= diagnostics.p50Score, 'Diagnostics: Percentiles (P50, P95) logically ordered');
  assert(diagnostics.factorAverages.newsMomentum >= 0, 'Diagnostics: Factor averages computed');

  console.log(`\nSCORE DISTRIBUTION DIAGNOSTICS SUMMARY:`);
  console.log(`  Total Stories Scored: ${diagnostics.totalScored}`);
  console.log(`  Average Score:        ${diagnostics.averageScore}`);
  console.log(`  Median Score (P50):   ${diagnostics.medianScore}`);
  console.log(`  Percentiles:          P25=${diagnostics.p25Score}, P50=${diagnostics.p50Score}, P75=${diagnostics.p75Score}, P90=${diagnostics.p90Score}, P95=${diagnostics.p95Score}`);
  console.log(`  Factor Averages:      Velocity=${diagnostics.factorAverages.searchVelocity}, Momentum=${diagnostics.factorAverages.newsMomentum}, Credibility=${diagnostics.factorAverages.credibility}`);

  console.log(`\nTASK 8 TEST RESULTS: ${passed}/${total} PASSED\n`);
  if (passed !== total) {
    process.exit(1);
  }
}

runContinuousPipelineTests().catch(console.error);
