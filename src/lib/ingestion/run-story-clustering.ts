import { prisma } from '../prisma';
import { StoryRepository } from './persistence/story-repository';

async function runStoryClusteringRunner() {
  console.log('====================================================');
  console.log('⚡ TECHSIGNAL DETERMINISTIC STORY CLUSTERING RUNNER');
  console.log('====================================================\n');

  const storyRepo = new StoryRepository();

  // Fetch all articles ordered chronologically by publication date
  const articles = await prisma.article.findMany({
    orderBy: { publishedAt: 'asc' },
    select: { id: true, title: true, publishedAt: true },
  });

  console.log(`Processing ${articles.length} total database articles through Story Clustering Engine...`);

  let newlyClusteredCount = 0;
  let linkedToExistingCount = 0;

  for (const article of articles) {
    const res = await storyRepo.clusterAndLinkArticle(article.id);
    if (res) {
      if (res.isNewStory) {
        newlyClusteredCount++;
      } else {
        linkedToExistingCount++;
      }
    }
  }

  // Gather overall story metrics from database
  const totalArticlesCount = await prisma.article.count();
  const totalStoriesCount = await prisma.story.count();

  const multiSourceStories = await prisma.story.findMany({
    where: { sourceCount: { gte: 2 } },
    include: {
      storyArticles: {
        include: { article: { include: { source: true } } },
      },
    },
    orderBy: { sourceCount: 'desc' },
  });

  const singleSourceStoriesCount = await prisma.story.count({
    where: { sourceCount: 1 },
  });

  console.log('\n====================================================');
  console.log('📊 STORY CLUSTERING & TIMELINE METRICS');
  console.log('====================================================');
  console.log(`Total Articles:       ${totalArticlesCount}`);
  console.log(`Total Stories:        ${totalStoriesCount}`);
  console.log(`Multi-Source Stories: ${multiSourceStories.length}`);
  console.log(`Single-Source Stories:${singleSourceStoriesCount}`);
  console.log('----------------------------------------------------');
  console.log(`Newly Created Stories:${newlyClusteredCount}`);
  console.log(`Linked to Existing:   ${linkedToExistingCount}`);
  console.log('====================================================\n');

  if (multiSourceStories.length > 0) {
    console.log('🔥 SAMPLE MULTI-SOURCE CLUSTERED STORIES:');
    multiSourceStories.slice(0, 5).forEach((story, idx) => {
      console.log(`\nStory #${idx + 1}: "${story.title}"`);
      console.log(`  Articles (${story.articleCount}), Publishers (${story.sourceCount}):`);
      story.storyArticles.forEach((sa) => {
        console.log(`   • [${sa.article.source?.name || 'Publisher'}] ${sa.article.title} (Confidence: ${sa.confidence}, Similarity: ${(sa.similarity * 100).toFixed(0)}%)`);
      });
    });
    console.log('');
  }
}

runStoryClusteringRunner().catch(console.error);
