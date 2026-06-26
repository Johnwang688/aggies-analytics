import type { Answers, Major, Question } from "./types";
import {
  MAJOR_VECTORS,
  QUESTION_VECTORS,
  affinity,
  cosine,
  dot,
  type Vec,
} from "./vectors";

// ---------------------------------------------------------------------------
// ADAPTIVE MCL — sequential question selection.
//
// With only 22 fixed majors, the "particle cloud" is simply a belief
// distribution over those 22 points; there's no need to simulate thousands of
// continuous particles. Each round:
//
//   1. RESAMPLE — recompute each major's support from the answers so far and
//      softmax it into a belief weight (how plausible this major still is).
//   2. SELECT   — pick the next batch of questions that best DISCRIMINATE
//      among the still-plausible majors (highest belief-weighted spread of
//      their projection onto the question's direction), spread across axes so
//      we don't ask five near-identical questions.
//   3. STOP early once the top-3 set stops changing between rounds.
//
// Asking the questions and recording answers is the UI's job; this module is
// the pure decision layer.
// ---------------------------------------------------------------------------

export interface AdaptiveConfig {
  perRound: number; // questions per resample batch
  maxRounds: number; // hard cap on rounds
  temperature: number; // softmax temp on support → belief (higher = flatter)
  diversityLambda: number; // 0..1, how hard to spread the batch across axes
}

export const DEFAULT_ADAPTIVE: AdaptiveConfig = {
  perRound: 5,
  maxRounds: 4,
  // affinity is a magnitude-aware correlation (roughly [-1.5, 1.5]); the softmax
  // temperature stays small so belief still concentrates on the leaders.
  temperature: 0.2,
  diversityLambda: 0.5,
};

export interface BeliefEntry {
  major: Major;
  vec: Vec;
  support: number;
  weight: number; // belief, sums to 1 across majors
}

// Softmax of affinity → a belief distribution over the majors. Subtracting the
// max keeps exp() stable; temperature controls how sharply belief concentrates.
export function belief(
  answers: Answers,
  questions: Question[],
  majors: Major[],
  temperature = DEFAULT_ADAPTIVE.temperature,
): BeliefEntry[] {
  const rows = majors
    .map((major) => {
      const vec = MAJOR_VECTORS[major.name];
      if (!vec) return null;
      return { major, vec, support: affinity(vec, answers, questions) };
    })
    .filter((r): r is Omit<BeliefEntry, "weight"> => r !== null);

  if (rows.length === 0) return [];

  const maxS = Math.max(...rows.map((r) => r.support));
  const exps = rows.map((r) => Math.exp((r.support - maxS) / temperature));
  const z = exps.reduce((s, e) => s + e, 0) || 1;

  return rows.map((r, i) => ({ ...r, weight: exps[i] / z }));
}

// Expected information a question carries RIGHT NOW: the belief-weighted
// variance of how the still-plausible majors project onto its direction. A
// question everyone in contention answers the same way (low spread) teaches us
// nothing; one that splits them (high spread) is worth asking.
export function discrimination(qVec: Vec, bel: BeliefEntry[]): number {
  let mean = 0;
  for (const b of bel) mean += b.weight * dot(qVec, b.vec);
  let variance = 0;
  for (const b of bel) {
    const p = dot(qVec, b.vec);
    variance += b.weight * (p - mean) * (p - mean);
  }
  return variance;
}

// Pick the next batch of unasked questions. Greedy by discrimination, with an
// MMR-style penalty so the batch spans different axes instead of piling onto
// whichever axis happens to be most informative.
export function pickNextQuestions(
  answers: Answers,
  askedIds: Set<string>,
  bank: Question[],
  majors: Major[],
  config: AdaptiveConfig = DEFAULT_ADAPTIVE,
): Question[] {
  const bel = belief(answers, bank, majors, config.temperature);

  const candidates = bank
    .filter((q) => !askedIds.has(q.id))
    .map((q) => ({ q, vec: QUESTION_VECTORS[q.id] }))
    .filter((c): c is { q: Question; vec: Vec } => {
      // Skip tag-less / zero-direction questions (e.g. the spirit closer).
      return !!c.vec && c.vec.some((x) => x !== 0);
    })
    .map((c) => ({ ...c, info: discrimination(c.vec, bel) }));

  if (candidates.length === 0) return [];

  const maxInfo = Math.max(...candidates.map((c) => c.info)) || 1;
  const picked: { q: Question; vec: Vec }[] = [];

  while (picked.length < config.perRound && candidates.length > picked.length) {
    let best: (typeof candidates)[number] | null = null;
    let bestScore = -Infinity;
    for (const c of candidates) {
      if (picked.some((p) => p.q.id === c.q.id)) continue;
      let maxSim = 0;
      for (const p of picked) {
        const sim = Math.abs(cosine(c.vec, p.vec)); // same axis, either pole
        if (sim > maxSim) maxSim = sim;
      }
      // Normalize info to 0..1 so diversityLambda trades off cleanly.
      const score = c.info / maxInfo - config.diversityLambda * maxSim;
      if (score > bestScore) {
        bestScore = score;
        best = c;
      }
    }
    if (!best) break;
    picked.push({ q: best.q, vec: best.vec });
  }

  return picked.map((p) => p.q);
}

// Top-3 by raw support, as plain major names — used for the early-stop check.
export function top3Names(
  answers: Answers,
  questions: Question[],
  majors: Major[],
): string[] {
  return belief(answers, questions, majors)
    .sort((a, b) => b.support - a.support)
    .slice(0, 3)
    .map((b) => b.major.name);
}

// The top-3 set (order-independent) has stopped changing → we can stop asking.
export function top3Stable(prev: string[], cur: string[]): boolean {
  if (prev.length < 3 || cur.length < 3) return false;
  const a = new Set(prev);
  return cur.every((n) => a.has(n));
}
