import { prisma } from '../prisma';
import { StoryScorer } from './signals/story-scorer';

async function runStoryScoringRunner() {
  console.log('====================================================');
  console.log('🚀 TECHSIGNAL CANONICAL STORY SCORING RUNNER');
  console.log('====================================================\n');

  const scorer = new StoryScorer();

  const stories = await prisma.story.findMany({
    select: { id: true, title: true },
  });

  console.log(`Processing canonical scoring for ${stories.length} database stories...\n`);

  const results = [];
  const tierCounts = { FIRE: 0, HIGH: 0, MODERATE: 0, LOW: 0 };

  for (const story of stories) {
    const res = await scorer.scoreAndPersistStory(story.id);
    if (res) {
      results.push(res);
      tierCounts[res.tier]++;
    }
  }

  // Sort scored stories descending by overallScore
  results.sort((a, b) => b.overallScore - a.overallScore);

  console.log('====================================================');
  console.log('📊 PRODUCTION STORY SCORING & TIER DISTRIBUTION');
  console.log('====================================================');
  console.log(`Total Scored Stories: ${results.length}`);
  console.log(`  🔥 FIRE Tier (>= 85):     ${tierCounts.FIRE}`);
  console.log(`  ⚡ HIGH Tier (>= 70):     ${tierCounts.HIGH}`);
  console.log(`  📈 MODERATE Tier (>= 50): ${tierCounts.MODERATE}`);
  console.log(`  ❄️  LOW Tier (< 50):      ${tierCounts.LOW}`);
  console.log('====================================================\n');

  console.log('🔥 TOP RANKED PRODUCTION TECH SIGNALS:');
  results.slice(0, 10).forEach((item, idx) => {
    console.log(`${idx + 1}. [${item.tier}] ${item.title}`);
    console.log(`   Overall Score: ${item.overallScore} / 100 | Snapshot ID: ${item.snapshotId}`);
    console.log(`   Rationale:     ${item.explanation}\n`);
  });
}

runStoryScoringRunner().catch(console.error);
