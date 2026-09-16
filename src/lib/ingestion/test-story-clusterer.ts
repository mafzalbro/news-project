import { StoryClusterer } from './clustering/story-clusterer';
import { StoryRepository } from './persistence/story-repository';
import { ArticleRepository } from './persistence/article-repository';
import { prisma } from '../prisma';

async function testStoryClustering() {
  console.log('🧪 TESTING TASK 5: DETERMINISTIC STORY CLUSTERING & TIMELINES...\n');

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

  const clusterer = new StoryClusterer();
  const now = new Date();

  // Test 1: High Similarity Title Match
  const title1 = 'OpenAI Releases New Frontier Agent Model';
  const title2 = 'OpenAI Unveils Latest Frontier AI Agent Model';
  const match1 = clusterer.compareArticles(title1, now, title2, now);
  assert(match1.isMatch && (match1.confidence === 'HIGH' || match1.confidence === 'MEDIUM'), 'Clusterer: High similarity titles correctly matched');

  // Test 2: Low Similarity Title Non-Match
  const title3 = 'Apple Announces M5 MacBook Pro Laptops';
  const match2 = clusterer.compareArticles(title1, now, title3, now);
  assert(!match2.isMatch && match2.confidence === 'NONE', 'Clusterer: Unrelated titles correctly rejected');

  // Test 3: Time Threshold Rejection (> 72h)
  const oldDate = new Date(now.getTime() - 80 * 60 * 60 * 1000); // 80 hours ago
  const match3 = clusterer.compareArticles(title1, now, title1, oldDate);
  assert(!match3.isMatch, 'Clusterer: Articles > 72 hours apart rejected from same event cluster');

  // Test 4: Incremental Story Persistence & Multi-Publisher Linking
  const articleRepo = new ArticleRepository();
  const storyRepo = new StoryRepository();
  const uniqueKey = Math.random().toString(36).substring(2, 9);

  // Ingest Article A (TechCrunch)
  const normA = {
    title: `ClusterTestA_${uniqueKey} Superconducting Qubit Benchmark Discovery`,
    description: 'Researchers demonstrate room-temperature superconductor magnet containment.',
    content: 'Researchers demonstrate room-temperature superconductor magnet containment.',
    sourceName: 'TechCrunch',
    sourceUrl: `https://techcrunch.com/2026/03/fusion-magnet-${uniqueKey}`,
    canonicalUrl: `https://techcrunch.com/2026/03/fusion-magnet-${uniqueKey}`,
    publishedAt: now,
    fetchedAt: now,
    authorName: 'Alex Vance',
    imageUrl: 'https://techcrunch.com/image.jpg',
    categorySlug: 'green-tech',
    tags: ['fusion'],
    contentHash: `hash-fusion-magnet-tc-${uniqueKey}-64chars-long-hash-padding-00000000`,
  };

  const saveA = await articleRepo.saveNormalizedArticle(normA);
  assert(saveA.status === 'SAVED', 'Persistence: Saved Article A (TechCrunch)');

  const clusterResA = await storyRepo.clusterAndLinkArticle(saveA.id!);
  assert(clusterResA !== null && clusterResA.isNewStory, 'StoryRepo: Article A created new Story');

  // Ingest Article B (The Verge - Same Event)
  const normB = {
    title: `ClusterTestA_${uniqueKey} Superconducting Qubit Benchmark Announced`,
    description: 'Researchers demonstrate room-temperature superconductor magnet containment systems.',
    content: 'Researchers demonstrate room-temperature superconductor magnet containment systems.',
    sourceName: 'The Verge',
    sourceUrl: `https://theverge.com/2026/03/fusion-magnet-${uniqueKey}`,
    canonicalUrl: `https://theverge.com/2026/03/fusion-magnet-${uniqueKey}`,
    publishedAt: new Date(now.getTime() + 1000 * 60 * 30), // 30 mins later
    fetchedAt: now,
    authorName: 'Tom Warren',
    imageUrl: 'https://theverge.com/image.jpg',
    categorySlug: 'green-tech',
    tags: ['fusion'],
    contentHash: `hash-fusion-magnet-verge-${uniqueKey}-64chars-long-hash-padding-00000`,
  };

  const saveB = await articleRepo.saveNormalizedArticle(normB);
  assert(saveB.status === 'SAVED', 'Persistence: Saved Article B (The Verge)');

  const clusterResB = await storyRepo.clusterAndLinkArticle(saveB.id!);
  assert(
    clusterResB !== null && !clusterResB.isNewStory && clusterResB.storyId === clusterResA!.storyId,
    'StoryRepo: Article B incrementally linked to Article A\'s existing Story'
  );

  // Check updated Story metrics in Prisma DB
  const updatedStory = await prisma.story.findUnique({
    where: { id: clusterResA!.storyId },
    include: { storyArticles: { include: { article: { include: { source: true } } } } },
  });

  assert(updatedStory !== null && updatedStory.articleCount === 2, 'Story Metrics: articleCount updated to 2');
  assert(updatedStory !== null && updatedStory.sourceCount === 2, 'Story Metrics: sourceCount updated to 2 unique publishers');

  console.log(`\nTASK 5 TEST RESULTS: ${passed}/${total} PASSED\n`);
  if (passed !== total) {
    process.exit(1);
  }
}

testStoryClustering().catch(console.error);
