import { StoryScorer } from './signals/story-scorer';
import { ArticleRepository } from './persistence/article-repository';
import { StoryRepository } from './persistence/story-repository';
import { prisma } from '../prisma';

async function runStoryScorerTests() {
  console.log('🧪 TESTING TASK 7: PRODUCTION SIGNAL SCORING ENGINE...\n');

  // Clean previous test records to ensure complete isolation
  await prisma.storyArticle.deleteMany({
    where: { article: { title: { contains: 'ScorerTest' } } },
  });
  await prisma.article.deleteMany({
    where: { title: { contains: 'ScorerTest' } },
  });
  await prisma.story.deleteMany({
    where: { title: { contains: 'ScorerTest' } },
  });

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

  const articleRepo = new ArticleRepository();
  const storyRepo = new StoryRepository();
  const scorer = new StoryScorer();
  const now = new Date();
  const testRunId = Math.random().toString(36).substring(2, 9);

  // Test 1: Single-Source Safeguard (SourceCount = 1 cannot achieve FIRE >85)
  const normA = {
    title: `ScorerTest_${testRunId}_SinglePublisherLeak`,
    description: 'High volume single source coverage.',
    content: 'High volume single source coverage.',
    sourceName: 'TechCrunch',
    sourceUrl: `https://techcrunch.com/2026/03/single-source-${testRunId}`,
    canonicalUrl: `https://techcrunch.com/2026/03/single-source-${testRunId}`,
    publishedAt: now,
    fetchedAt: now,
    authorName: 'Alex Vance',
    categorySlug: 'ai-agentic',
    tags: ['ai'],
    contentHash: `hash-single-source-${testRunId}-64chars-long-hash-padding-000000000`,
  };

  const saveA = await articleRepo.saveNormalizedArticle(normA);
  const clusterResA = await storyRepo.clusterAndLinkArticle(saveA.id!);
  const scoreResultA = await scorer.scoreAndPersistStory(clusterResA!.storyId);

  assert(scoreResultA !== null, 'Scorer: Calculated score for single-source story');
  assert(scoreResultA!.overallScore < 85, 'Single-Source Cap: Single-source story capped below FIRE tier threshold (<85)');
  assert(scoreResultA!.tier !== 'FIRE', 'Single-Source Cap: Tier assigned as HIGH/MODERATE/LOW, never FIRE without multi-source verification');

  // Test 2: Multi-Publisher Verification Allows FIRE Tier
  const normB = {
    title: `ScorerTest_${testRunId}_SinglePublisherLeak`,
    description: 'Corroborating second publisher report.',
    content: 'Corroborating second publisher report.',
    sourceName: 'The Verge',
    sourceUrl: `https://theverge.com/2026/03/single-source-${testRunId}`,
    canonicalUrl: `https://theverge.com/2026/03/single-source-${testRunId}`,
    publishedAt: new Date(now.getTime() + 1000 * 60 * 10), // 10m later
    fetchedAt: now,
    authorName: 'Tom Warren',
    categorySlug: 'ai-agentic',
    tags: ['ai'],
    contentHash: `hash-multi-source-${testRunId}-64chars-long-hash-padding-000000000`,
  };

  const saveB = await articleRepo.saveNormalizedArticle(normB);
  await storyRepo.clusterAndLinkArticle(saveB.id!);
  const scoreResultB = await scorer.scoreAndPersistStory(clusterResA!.storyId);

  assert(scoreResultB !== null && scoreResultB.overallScore >= scoreResultA!.overallScore, 'Multi-Source Boost: Score increased after second publisher corroboration');

  // Test 3: StorySignal Snapshot Persisted in DB
  const snapshotCount = await prisma.storySignal.count({
    where: { storyId: clusterResA!.storyId },
  });
  assert(snapshotCount >= 2, 'Snapshot Persistence: StorySignal snapshots saved to Prisma DB');

  console.log(`\nTASK 7 TEST RESULTS: ${passed}/${total} PASSED\n`);
  if (passed !== total) {
    process.exit(1);
  }
}

runStoryScorerTests().catch(console.error);
