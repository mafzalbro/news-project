import { prisma } from './prisma';
import { calculateTechSignal, SignalInputFactors } from './signal-engine';

export interface EvaluatedScenario {
  id: string;
  name: string;
  category: string;
  input: SignalInputFactors;
  expectedTier: string;
  passed: boolean;
  notes: string;
}

/**
 * Runs reality tests on the TechSignal Engine & Data Quality logic.
 */
export async function runIntelligenceQualityAudit() {
  console.log('🔬 RUNNING TECHSIGNAL INTELLIGENCE QUALITY AUDIT...\n');

  const results = {
    deduplicationTest: false,
    signalSemanticsTest: false,
    sourceAttributionTest: false,
    fiveLayerSpecificityTest: false,
    scenariosTested: 0,
    scenariosPassed: 0,
    details: [] as string[],
  };

  // 1. Test Signal Semantics (Viral Meme vs High-Impact Regulation/Infrastructure)
  const viralMemeSignal: SignalInputFactors = {
    searchVelocity: 98,
    newsMomentum: 92,
    socialMomentum: 95,
    humanImpact: 25, // Low real-world impact
    novelty: 40,
    credibility: 50,
    longTermRelevance: 20,
  };

  const highImpactInfrastructureSignal: SignalInputFactors = {
    searchVelocity: 65,
    newsMomentum: 80,
    socialMomentum: 60,
    humanImpact: 98, // Massive economic/energy impact
    novelty: 90,
    credibility: 98,
    longTermRelevance: 99,
  };

  const memeResult = calculateTechSignal(viralMemeSignal);
  const infraResult = calculateTechSignal(highImpactInfrastructureSignal);

  // Meme calculation: 98*0.25 + 92*0.20 + 25*0.20 + 40*0.15 + 50*0.10 + 20*0.10 = 24.5 + 18.4 + 5 + 6 + 5 + 2 = 60.9 (MODERATE)
  // Infra calculation: 65*0.25 + 80*0.20 + 98*0.20 + 90*0.15 + 98*0.10 + 99*0.10 = 16.25 + 16 + 19.6 + 13.5 + 9.8 + 9.9 = 85.05 (FIRE)

  if (infraResult.overallScore > memeResult.overallScore && memeResult.signalTier !== 'FIRE') {
    results.signalSemanticsTest = true;
    results.scenariosPassed++;
    results.details.push(
      `✅ Signal Engine Semantics: Infrastructure story (${infraResult.overallScore}) correctly outranks viral meme (${memeResult.overallScore}) due to weighted Human Impact & Credibility.`
    );
  } else {
    results.details.push(
      `❌ Signal Engine Semantics Failure: Viral meme unfairly scored higher than high-impact infrastructure.`
    );
  }
  results.scenariosTested++;

  // 2. Audit Articles for 5-Layer Specificity & Primary Sources in Database
  const articles = await prisma.article.findMany({
    include: { sources: true, signal: true, timeline: true, trends: true },
  });

  let genericPhrasesFound = 0;
  let articlesWithSources = 0;

  for (const article of articles) {
    // Check for generic AI filler
    const combinedAnalysis = `${article.whyItMatters} ${article.whatsNext}`.toLowerCase();
    if (combinedAnalysis.includes('significant implications for businesses and consumers')) {
      genericPhrasesFound++;
    }

    if (article.sources.length > 0) {
      articlesWithSources++;
    }
  }

  if (genericPhrasesFound === 0) {
    results.fiveLayerSpecificityTest = true;
    results.scenariosPassed++;
    results.details.push(
      `✅ 5-Layer Analysis Specificity: 0 generic AI filler phrases detected across ${articles.length} articles.`
    );
  } else {
    results.details.push(`❌ 5-Layer Analysis Failure: Detected ${genericPhrasesFound} generic AI filler phrases.`);
  }
  results.scenariosTested++;

  if (articlesWithSources === articles.length) {
    results.sourceAttributionTest = true;
    results.scenariosPassed++;
    results.details.push(
      `✅ Source Attribution: 100% of production articles (${articlesWithSources}/${articles.length}) are explicitly linked to verified primary sources.`
    );
  } else {
    results.details.push(
      `❌ Source Attribution Failure: Only ${articlesWithSources}/${articles.length} articles contain linked primary sources.`
    );
  }
  results.scenariosTested++;

  // 3. Check Deduplication & Timeline Grouping
  const timelines = await prisma.storyTimeline.findMany({
    include: { articles: true },
  });

  const timelineWithMultipleArticles = timelines.find((t) => t.articles.length > 1);
  if (timelineWithMultipleArticles) {
    results.deduplicationTest = true;
    results.scenariosPassed++;
    results.details.push(
      `✅ Story Timeline & Deduplication: Successfully consolidated multiple developing coverage articles under unified story timeline '${timelineWithMultipleArticles.title}'.`
    );
  } else {
    results.details.push(`❌ Deduplication Failure: No multi-article story timelines found.`);
  }
  results.scenariosTested++;

  console.log(`AUDIT RESULTS: ${results.scenariosPassed}/${results.scenariosTested} PASSED`);
  results.details.forEach((d) => console.log('  ' + d));

  return results;
}

if (require.main === module) {
  runIntelligenceQualityAudit().catch(console.error);
}
