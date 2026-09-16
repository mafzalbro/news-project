export interface ClusterMatchResult {
  isMatch: boolean;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE';
  similarityScore: number; // 0.0 - 1.0
  reason: string;
}

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 'be', 'been',
  'being', 'in', 'on', 'at', 'to', 'for', 'with', 'by', 'about', 'against', 'between',
  'into', 'through', 'during', 'before', 'after', 'above', 'below', 'from', 'up',
  'down', 'of', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here',
  'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more',
  'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so',
  'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now',
  'new', 'says', 'said', 'report', 'reports', 'techcrunch', 'verge', 'wired', 'first',
]);

export class StoryClusterer {
  /**
   * Compares two normalized article titles and publication dates deterministically.
   */
  compareArticles(
    candidateTitle: string,
    candidatePublishedAt: Date,
    existingTitle: string,
    existingPublishedAt: Date
  ): ClusterMatchResult {
    // 1. Calculate time difference in hours
    const timeDiffMs = Math.abs(candidatePublishedAt.getTime() - existingPublishedAt.getTime());
    const timeDiffHours = timeDiffMs / (1000 * 60 * 60);

    // If publication dates are more than 72 hours apart, do not cluster as same real-time event
    if (timeDiffHours > 72) {
      return {
        isMatch: false,
        confidence: 'NONE',
        similarityScore: 0.0,
        reason: `Publication dates differ by ${timeDiffHours.toFixed(1)} hours (> 72h threshold).`,
      };
    }

    // 2. Tokenize and calculate Jaccard similarity
    const tokensA = this.extractKeyTokens(candidateTitle);
    const tokensB = this.extractKeyTokens(existingTitle);

    const similarity = this.calculateJaccardSimilarity(tokensA, tokensB);

    // 3. Assign confidence tier
    if (similarity >= 0.60) {
      return {
        isMatch: true,
        confidence: 'HIGH',
        similarityScore: Math.round(similarity * 100) / 100,
        reason: `High title token overlap (${(similarity * 100).toFixed(0)}%) within ${timeDiffHours.toFixed(0)} hours.`,
      };
    } else if (similarity >= 0.40) {
      return {
        isMatch: true,
        confidence: 'MEDIUM',
        similarityScore: Math.round(similarity * 100) / 100,
        reason: `Medium title token overlap (${(similarity * 100).toFixed(0)}%) within ${timeDiffHours.toFixed(0)} hours.`,
      };
    } else if (similarity >= 0.30 && timeDiffHours <= 24) {
      return {
        isMatch: true,
        confidence: 'LOW',
        similarityScore: Math.round(similarity * 100) / 100,
        reason: `Low title overlap (${(similarity * 100).toFixed(0)}%) compensated by close time proximity (${timeDiffHours.toFixed(0)}h).`,
      };
    }

    return {
      isMatch: false,
      confidence: 'NONE',
      similarityScore: Math.round(similarity * 100) / 100,
      reason: `Insufficient token similarity (${(similarity * 100).toFixed(0)}%).`,
    };
  }

  private extractKeyTokens(title: string): Set<string> {
    const cleaned = title
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .trim();

    const words = cleaned.split(/\s+/);
    const tokens = new Set<string>();

    for (const word of words) {
      if (word.length >= 2 && !STOP_WORDS.has(word)) {
        tokens.add(word);
      }
    }

    return tokens;
  }

  private calculateJaccardSimilarity(setA: Set<string>, setB: Set<string>): number {
    if (setA.size === 0 || setB.size === 0) return 0.0;

    let intersectionSize = 0;
    for (const token of setA) {
      if (setB.has(token)) {
        intersectionSize++;
      }
    }

    const unionSize = setA.size + setB.size - intersectionSize;
    if (unionSize === 0) return 0.0;

    return intersectionSize / unionSize;
  }
}
