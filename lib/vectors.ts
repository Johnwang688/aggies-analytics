import type { Answers, Major, Question } from "./types";

// ---------------------------------------------------------------------------
// VECTOR-SPACE MATCHER
//
// Every major is a fixed point in a 5-dimensional interpretable space. Every
// question is a *direction* in that same space. We never converge to a single
// student point (that's what manufactured the "bland midpoint" for students
// split across two fields). Instead each major is scored *directly* against
// the student's answers, then we pick a top-3 *set* that COVERS the student
// rather than three near-duplicates of the #1.
//
// All coordinates are centered at 0 and live in roughly [-2, +2]. The origin
// is the "generalist" center of the catalog; the further out along an axis,
// the more strongly a major leans toward that pole.
// ---------------------------------------------------------------------------

export interface Axis {
  key: string;
  pos: string; // what a positive value means
  neg: string; // what a negative value means
}

// Index order is the vector order. Don't reorder without updating every vector.
export const AXES: Axis[] = [
  { key: "medium", pos: "Digital / computational", neg: "Physical / tangible" },
  { key: "subject", pos: "Living / organic", neg: "Inanimate / engineered" },
  { key: "scale", pos: "Micro / molecular", neg: "Macro / large-scale" },
  { key: "orientation", pos: "People / systems", neg: "Things / technical" },
  { key: "mode", pos: "Theory / research", neg: "Hands-on / build & operate" },
];

export const DIM = AXES.length;
export type Vec = number[]; // always length DIM

// ---------------------------------------------------------------------------
// MAJOR_VECTORS — one coordinate per major, keyed by the exact `name` in
// data/majors.json so we can join back to the full record.
//
//        [ medium , subject , scale , orient , mode ]
//          dig/+    liv/+     mic/+   ppl/+    thy/+
//          phy/-    inan/-    mac/-   thg/-    hnd/-
// ---------------------------------------------------------------------------
export const MAJOR_VECTORS: Record<string, Vec> = {
  "Computer Science": [2.0, -1.5, 0.0, -1.0, 1.5],
  "Data Engineering": [2.0, -1.0, 0.0, 0.5, 1.0],
  "Computer Engineering": [1.0, -1.5, 1.0, -1.0, 0.5],
  "Electrical Engineering": [0.0, -2.0, 1.0, -1.0, 1.0],
  "Mechanical Engineering": [-1.5, -1.5, 0.0, -0.5, 0.0],
  "Aerospace Engineering": [-1.5, -2.0, -1.0, -1.0, 1.0],
  "Chemical Engineering": [-1.0, -0.5, 1.5, -0.5, 0.5],
  "Civil Engineering": [-1.5, -1.0, -2.0, 0.5, -0.5],
  "Architectural Engineering": [-1.0, -1.0, -1.5, 0.5, 0.0],
  "Environmental Engineering": [-1.0, 1.5, -1.0, 0.5, 0.0],
  "Biomedical Engineering": [0.0, 2.0, 1.0, -0.5, 0.5],
  "Biological and Agricultural Engineering": [-1.0, 2.0, 0.0, 0.0, -0.5],
  "Materials Science and Engineering": [-1.0, -1.5, 2.0, -1.5, 1.5],
  "Nuclear Engineering": [-1.0, -1.5, 1.5, -1.0, 1.0],
  "Ocean Engineering": [-1.5, -0.5, -1.5, -0.5, 0.0],
  "Petroleum Engineering": [-1.0, -1.0, -0.5, 0.0, 0.0],
  "Industrial Engineering": [0.0, -1.0, -1.5, 2.0, 0.0],
  "Interdisciplinary Engineering": [0.0, 0.0, 0.0, 0.0, 0.5],
  "Electronic Systems Engineering Technology": [-0.5, -2.0, 0.5, -0.5, -2.0],
  "Manufacturing and Mechanical Engineering Technology": [-1.5, -1.5, -0.5, 0.0, -2.0],
  "Multidisciplinary Engineering Technology": [-1.0, -1.5, 0.0, 0.5, -1.5],
  "Industrial Distribution": [0.0, -1.0, -1.0, 2.0, -1.0],
};

// ---------------------------------------------------------------------------
// QUESTION_VECTORS — the direction each LIVE_QUESTIONS statement points when
// the student AGREES with it. Keyed by question id. Agreement pushes credit
// toward majors lying in this direction; disagreement pushes it the other way.
// A zero vector (e.g. the spirit question) contributes nothing.
// ---------------------------------------------------------------------------
export const QUESTION_VECTORS: Record<string, Vec> = {
  // medium, subject, scale, orient, mode
  "q-software": [2.0, 0.0, 0.0, 0.0, 0.5],
  "q-data": [1.5, 0.0, 0.0, 0.5, 0.5],
  "q-circuits": [-0.5, -1.0, 1.0, 0.0, 0.0],
  "q-hardware": [0.5, -1.0, 1.0, 0.0, -0.5],
  "q-machines-hands": [-1.5, -1.0, 0.0, 0.0, -1.5],
  "q-flight": [-1.0, -1.5, -1.0, 0.0, 0.5],
  "q-chemistry": [-0.5, 0.0, 1.5, 0.0, 0.0],
  "q-materials": [-0.5, -1.0, 2.0, 0.0, 0.5],
  "q-bio": [0.0, 2.0, 0.5, 0.0, 0.0],
  "q-physics": [0.5, -0.5, 0.0, 0.0, 1.5],
  "q-structures": [-1.0, -0.5, -2.0, 0.5, -0.5],
  "q-energy": [-0.5, -1.5, 0.5, 0.0, 0.0],
  "q-resources": [-1.0, -1.0, -0.5, 0.0, -0.5],
  "q-environment": [-0.5, 1.5, -1.0, 0.5, 0.0],
  "q-nature": [-0.5, 1.5, -1.0, 0.0, -0.5],
  "q-automation": [0.5, -1.5, 0.5, 0.0, 0.0],
  "q-systems": [0.0, -1.0, -1.0, 2.0, -0.5],
  "q-design": [-0.5, 0.0, 0.0, 0.0, 0.5],
  "q-research": [0.0, 0.0, 0.0, 0.0, 2.0],
  // Orientation-axis questions (people/systems ↔ things/technical).
  "or-team": [0.0, 0.0, 0.0, 2.0, -0.5],
  "or-business": [0.0, -0.5, 0.0, 1.5, -1.0],
  "or-logistics": [0.0, -0.5, -1.0, 1.5, 0.0],
  "or-solo": [0.0, 0.0, 0.5, -2.0, 0.5],
  "q-tamu-spirit": [0.0, 0.0, 0.0, 0.0, 0.0],
};

// --- small vector helpers ---------------------------------------------------

export function dot(a: Vec, b: Vec): number {
  let s = 0;
  for (let i = 0; i < DIM; i++) s += a[i] * b[i];
  return s;
}

export function distance(a: Vec, b: Vec): number {
  let s = 0;
  for (let i = 0; i < DIM; i++) {
    const d = a[i] - b[i];
    s += d * d;
  }
  return Math.sqrt(s);
}

export function cosine(a: Vec, b: Vec): number {
  const na = Math.sqrt(dot(a, a));
  const nb = Math.sqrt(dot(b, b));
  if (na === 0 || nb === 0) return 0;
  return dot(a, b) / (na * nb);
}

// How hard a misaligned answer counts against a major. A major banks FULL
// credit for endorsed directions it serves, but is only lightly penalized for
// directions it doesn't — the additive form of "each major owns the answers in
// its own lane." Without this, a student's strongest interest produces large
// negative dot-products that actively bury a genuine *second*, conflicting
// interest (e.g. loving both abstract theory and hands-on shop work), and the
// minor lane never surfaces. Set to 1 for symmetric scoring; 0 to ignore
// disagreement entirely. ~0.3 keeps "I dislike X" mildly informative without
// letting the majority interest suppress the minority.
const NEGATIVE_DAMPING = 0.3;

// ---------------------------------------------------------------------------
// support — how well major `m` explains the student's answers.
//
// For each answered question we add  agreement · (question_direction · major),
// damping the contribution when it's negative (see NEGATIVE_DAMPING). This is
// per-major and additive, so a student split across two fields lifts BOTH
// specialists instead of collapsing to a centrist compromise.
// ---------------------------------------------------------------------------
export function support(
  majorVec: Vec,
  answers: Answers,
  questions: Question[],
): number {
  let s = 0;
  for (const q of questions) {
    const dir = QUESTION_VECTORS[q.id];
    if (!dir) continue;
    const agreement = answers[q.id] ?? 0;
    if (agreement === 0) continue;
    const c = agreement * dot(dir, majorVec);
    s += c < 0 ? c * NEGATIVE_DAMPING : c;
  }
  return s;
}

export interface RankedMajor {
  major: Major;
  vec: Vec;
  support: number;
}

// Score and sort every major by raw support, high → low.
export function rankMajors(
  answers: Answers,
  questions: Question[],
  majors: Major[],
): RankedMajor[] {
  return majors
    .map((major) => {
      const vec = MAJOR_VECTORS[major.name];
      if (!vec) return null;
      return { major, vec, support: support(vec, answers, questions) };
    })
    .filter((r): r is RankedMajor => r !== null)
    .sort((a, b) => b.support - a.support);
}

// ---------------------------------------------------------------------------
// selectTopK — coverage-aware pick via Maximal Marginal Relevance.
//
//   pick #1  = highest support
//   pick #n  = argmax [ support(m) − λ · maxSimilarityTo(already picked) ]
//
// λ = 0 reproduces plain top-K (great for a committed, single-interest
// student). λ in ~0.3–0.6 penalizes near-duplicates so a split student gets
// the best major from EACH side instead of three flavors of the same cluster.
// Similarity is cosine between major vectors (direction of interest), scaled
// by the support range so the penalty is commensurate with the scores.
// ---------------------------------------------------------------------------
export function selectTopK(
  answers: Answers,
  questions: Question[],
  majors: Major[],
  k = 3,
  lambda = 0.45,
): RankedMajor[] {
  const ranked = rankMajors(answers, questions, majors);
  if (ranked.length === 0) return [];

  // Scale the diversity penalty to the spread of support scores so λ is
  // meaningful regardless of how strongly the student answered.
  const top = ranked[0].support;
  const spread = Math.max(1, top - ranked[ranked.length - 1].support);

  const selected: RankedMajor[] = [ranked[0]];
  const pool = ranked.slice(1);

  while (selected.length < k && pool.length > 0) {
    let bestIdx = 0;
    let bestScore = -Infinity;
    for (let i = 0; i < pool.length; i++) {
      const cand = pool[i];
      let maxSim = 0;
      for (const s of selected) {
        const sim = cosine(cand.vec, s.vec); // -1..1
        if (sim > maxSim) maxSim = sim;
      }
      const mmr = cand.support - lambda * maxSim * spread;
      if (mmr > bestScore) {
        bestScore = mmr;
        bestIdx = i;
      }
    }
    selected.push(pool.splice(bestIdx, 1)[0]);
  }

  return selected;
}
