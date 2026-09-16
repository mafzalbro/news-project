import { RealSignalExtractor, RawStoryData } from './signals/signal-extractor';
import { calculateTechSignal } from '../signal-engine';

async function runSignalExtractorTests() {
  console.log('🧪 TESTING TASK 6: REAL SIGNAL INPUT EXTRACTION...\n');

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

  const extractor = new RealSignalExtractor();
  const now = new Date();

  // Test Fixture 1: Single-Source Isolated Story (Low Velocity)
  const singleSourceStory: RawStoryData = {
    id: 'story-single-001',
    title: 'Local Niche Tech Blog Post',
    firstSeenAt: new Date(now.getTime() - 24 * 60 * 60 * 1000), // 24h ago
    lastSeenAt: new Date(now.getTime() - 24 * 60 * 60 * 1000),
    articleCount: 1,
    sourceCount: 1,
    articles: [{ publishedAt: new Date(now.getTime() - 24 * 60 * 60 * 1000) }],
  };

  // Test Fixture 2: Multi-Publisher Breaking Story (High Velocity)
  const breakingStory: RawStoryData = {
    id: 'story-breaking-002',
    title: 'OpenAI Releases GPT-5 Enterprise Architecture',
    firstSeenAt: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2h ago
    lastSeenAt: now,
    articleCount: 6,
    sourceCount: 5, // 5 unique publishers (TechCrunch, Reuters, Verge, Wired, Bloomberg)
    articles: [
      { publishedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000), publisherName: 'TechCrunch' },
      { publishedAt: new Date(now.getTime() - 90 * 60 * 1000), publisherName: 'Reuters' },
      { publishedAt: new Date(now.getTime() - 60 * 60 * 1000), publisherName: 'The Verge' },
      { publishedAt: new Date(now.getTime() - 45 * 60 * 1000), publisherName: 'Wired' },
      { publishedAt: new Date(now.getTime() - 30 * 60 * 1000), publisherName: 'Bloomberg' },
      { publishedAt: now, publisherName: 'MIT Tech Review' },
    ],
  };

  const signalSingle = extractor.extractFactors(singleSourceStory);
  const signalBreaking = extractor.extractFactors(breakingStory);

  assert(signalBreaking.rawMetrics.sourceCount === 5, 'Extractor: Correctly counts 5 unique sources');
  assert(signalBreaking.rawMetrics.recent6hCount === 6, 'Extractor: Correctly identifies 6 recent articles');
  assert(signalBreaking.factors.credibility > signalSingle.factors.credibility, 'Credibility: Multi-publisher story (5 sources) outranks single-source (1 source)');
  assert(signalBreaking.factors.newsMomentum > signalSingle.factors.newsMomentum, 'News Momentum: Breaking story (6 articles / 2h) outranks stale single article');
  assert(signalBreaking.factors.novelty > signalSingle.factors.novelty, 'Novelty: Fresh 2h story outranks 24h old story');

  // Verify compatibility with TechSignal deterministic scoring engine
  const scoreSingle = calculateTechSignal(signalSingle.factors);
  const scoreBreaking = calculateTechSignal(signalBreaking.factors);

  console.log(`\nCOMPATIBILITY WITH TECHSIGNAL SCORING ENGINE:`);
  console.log(`  Single Source Story Score:   ${scoreSingle.overallScore}/100 (${scoreSingle.signalTier})`);
  console.log(`  Multi-Publisher Story Score: ${scoreBreaking.overallScore}/100 (${scoreBreaking.signalTier})`);

  assert(scoreBreaking.overallScore > scoreSingle.overallScore, 'Engine Compatibility: Breaking story overall score outranks single source story');
  assert(scoreBreaking.signalTier === 'FIRE' || scoreBreaking.signalTier === 'HIGH', 'Tier Assignment: Multi-publisher breaking story achieves HIGH/FIRE tier');

  console.log(`\nTASK 6 TEST RESULTS: ${passed}/${total} PASSED\n`);
  if (passed !== total) {
    process.exit(1);
  }
}

runSignalExtractorTests().catch(console.error);
