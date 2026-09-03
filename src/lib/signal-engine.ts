export interface SignalInputFactors {
  searchVelocity: number;    // 0 - 100
  newsMomentum: number;      // 0 - 100
  socialMomentum: number;    // 0 - 100
  humanImpact: number;       // 0 - 100
  novelty: number;           // 0 - 100
  credibility: number;       // 0 - 100
  longTermRelevance: number; // 0 - 100
}

export interface ComputedTechSignal {
  overallScore: number;
  factors: SignalInputFactors;
  explanation: string;
  signalTier: 'FIRE' | 'HIGH' | 'MODERATE' | 'LOW';
}

// Configurable weights as defined in strategy requirements
const FACTOR_WEIGHTS = {
  searchVelocity: 0.25,
  newsMomentum: 0.20,
  humanImpact: 0.20,
  novelty: 0.15,
  credibility: 0.10,
  longTermRelevance: 0.10,
};

/**
 * Calculates deterministic Tech Signal score and builds explainable rationale.
 */
export function calculateTechSignal(factors: SignalInputFactors): ComputedTechSignal {
  const overall =
    factors.searchVelocity * FACTOR_WEIGHTS.searchVelocity +
    factors.newsMomentum * FACTOR_WEIGHTS.newsMomentum +
    factors.humanImpact * FACTOR_WEIGHTS.humanImpact +
    factors.novelty * FACTOR_WEIGHTS.novelty +
    factors.credibility * FACTOR_WEIGHTS.credibility +
    factors.longTermRelevance * FACTOR_WEIGHTS.longTermRelevance;

  const roundedScore = Math.round(overall * 10) / 10;

  let signalTier: 'FIRE' | 'HIGH' | 'MODERATE' | 'LOW' = 'LOW';
  if (roundedScore >= 85) signalTier = 'FIRE';
  else if (roundedScore >= 70) signalTier = 'HIGH';
  else if (roundedScore >= 50) signalTier = 'MODERATE';

  // Construct transparent, explainable rationale
  const keyDrivers: string[] = [];
  if (factors.searchVelocity >= 85) keyDrivers.push(`high search velocity (${factors.searchVelocity}/100)`);
  if (factors.humanImpact >= 85) keyDrivers.push(`significant human & economic impact (${factors.humanImpact}/100)`);
  if (factors.novelty >= 85) keyDrivers.push(`high technological novelty (${factors.novelty}/100)`);
  if (factors.credibility >= 90) keyDrivers.push(`verified primary sources (${factors.credibility}/100)`);

  const explanation = keyDrivers.length > 0
    ? `Score driven by ${keyDrivers.join(', ')}.`
    : `Balanced score calculated across 6 deterministic intelligence factors.`;

  return {
    overallScore: roundedScore,
    factors,
    explanation,
    signalTier,
  };
}
