import { prisma } from './prisma';

export interface IngestedStoryDraft {
  slug: string;
  title: string;
  description: string;
  content: string;
  authorName: string;
  authorRole: string;
  imageUrl?: string;
  imageCaption?: string;
  categorySlug: string;
  whatHappened: string;
  whyItMatters: string;
  whoIsAffected: string;
  whatsNext: string;
  signalFactors: {
    searchVelocity: number;
    newsMomentum: number;
    socialMomentum: number;
    humanImpact: number;
    novelty: number;
    credibility: number;
    longTermRelevance: number;
  };
  sources: { title: string; url: string; publisher: string }[];
  topicSlugs?: string[];
  companySlugs?: string[];
  countryCodes?: string[];
  trendSlugs?: string[];
  timelineSlug?: string;
  isFeatured?: boolean;
  isTrending?: boolean;
}

export interface IntelligenceDataSource {
  getStories(): Promise<IngestedStoryDraft[]>;
}

class MockDataSource implements IntelligenceDataSource {
  async getStories(): Promise<IngestedStoryDraft[]> {
    // Return sample mock intelligence story for pipeline testing
    return [
      {
        slug: 'green-data-centers-geothermal-ai-expansion',
        title: 'Next-Gen AI Compute Infrastructure Shifts to Next-Gen Geothermal Energy',
        description: 'With data center energy demand doubling, hyperscalers are forging direct power purchase agreements with deep geothermal energy pioneers.',
        content: `The explosive growth of AI workload training and inference is confronting a hard physical constraint: power grid capacity. To mitigate carbon emissions and energy bottlenecks, major cloud providers are investing directly in next-generation geothermal energy installations located adjacent to high-density server campuses.`,
        authorName: 'Marcus Vance',
        authorRole: 'Energy & Infrastructure Analyst',
        imageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1200&q=80',
        imageCaption: 'Geothermal energy plant supplying dedicated clean energy to server campus.',
        categorySlug: 'green-tech',
        whatHappened: 'Tech leaders partnered with geothermal energy developers to deploy zero-carbon, continuous baseload power for AI server farms.',
        whyItMatters: 'Intermittent renewables like solar and wind cannot meet 24/7 high-density compute needs, making geothermal a critical scalable baseline for sustainable AI development.',
        whoIsAffected: 'Cloud providers, chipmakers, energy regulators, local communities, and enterprise AI consumers.',
        whatsNext: 'Initial pilot plants are slated to go live in Q4, with energy output targets scaled for multi-gigawatt campuses.',
        signalFactors: {
          searchVelocity: 88,
          newsMomentum: 85,
          socialMomentum: 80,
          humanImpact: 94,
          novelty: 91,
          credibility: 95,
          longTermRelevance: 96,
        },
        sources: [
          { title: 'Global Sustainable Computing Initiative Report', url: 'https://greencompute.org', publisher: 'Green Tech Research' },
        ],
        countryCodes: ['US', 'FR'],
        isFeatured: false,
        isTrending: true,
      },
    ];
  }
}

export class DataIngestionManager {
  private dataSource: IntelligenceDataSource;

  constructor() {
    const mode = process.env.DATA_SOURCE_MODE || 'mock';
    if (mode === 'mock') {
      this.dataSource = new MockDataSource();
    } else {
      // Configurable live API integration fallback
      this.dataSource = new MockDataSource();
    }
  }

  async runPipeline() {
    const drafts = await this.dataSource.getStories();
    const results = [];

    for (const draft of drafts) {
      // Find category
      const category = await prisma.category.findUnique({
        where: { slug: draft.categorySlug },
      });

      if (!category) continue;

      // Compute Tech Signal
      const overall =
        draft.signalFactors.searchVelocity * 0.25 +
        draft.signalFactors.newsMomentum * 0.20 +
        draft.signalFactors.humanImpact * 0.20 +
        draft.signalFactors.novelty * 0.15 +
        draft.signalFactors.credibility * 0.10 +
        draft.signalFactors.longTermRelevance * 0.10;

      const roundedScore = Math.round(overall * 10) / 10;

      const createdSignal = await prisma.techSignal.create({
        data: {
          overallScore: roundedScore,
          searchVelocity: draft.signalFactors.searchVelocity,
          newsMomentum: draft.signalFactors.newsMomentum,
          socialMomentum: draft.signalFactors.socialMomentum,
          humanImpact: draft.signalFactors.humanImpact,
          novelty: draft.signalFactors.novelty,
          credibility: draft.signalFactors.credibility,
          longTermRelevance: draft.signalFactors.longTermRelevance,
          explanation: `Automated pipeline signal calculation score: ${roundedScore}/100`,
        },
      });

      // Upsert Article
      const article = await prisma.article.upsert({
        where: { slug: draft.slug },
        update: {
          title: draft.title,
          description: draft.description,
          content: draft.content,
          whatHappened: draft.whatHappened,
          whyItMatters: draft.whyItMatters,
          whoIsAffected: draft.whoIsAffected,
          whatsNext: draft.whatsNext,
          imageUrl: draft.imageUrl,
          imageCaption: draft.imageCaption,
          isFeatured: draft.isFeatured ?? false,
          isTrending: draft.isTrending ?? true,
        },
        create: {
          slug: draft.slug,
          title: draft.title,
          description: draft.description,
          content: draft.content,
          authorName: draft.authorName,
          authorRole: draft.authorRole,
          imageUrl: draft.imageUrl,
          imageCaption: draft.imageCaption,
          whatHappened: draft.whatHappened,
          whyItMatters: draft.whyItMatters,
          whoIsAffected: draft.whoIsAffected,
          whatsNext: draft.whatsNext,
          categoryId: category.id,
          signalId: createdSignal.id,
          isFeatured: draft.isFeatured ?? false,
          isTrending: draft.isTrending ?? true,
          sources: {
            create: draft.sources,
          },
        },
      });

      results.push(article);
    }

    return results;
  }
}
