import type { Answers, Major, Question } from "./types";
import { TAG_LABELS } from "./questionnaire";
import type { Category } from "./questionnaire";

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

// Generic (any-length) dot/cosine for comparing the answer vector against a
// major's expected-answer signature in `affinity` below.
function dotN(a: number[], b: number[]): number {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i] * b[i];
  return s;
}
function cosineN(a: number[], b: number[]): number {
  const na = Math.sqrt(dotN(a, a));
  const nb = Math.sqrt(dotN(b, b));
  return na && nb ? dotN(a, b) / (na * nb) : 0;
}

// ---------------------------------------------------------------------------
// affinity — the ranking metric. Correlation between how the student answered
// and how this major "would" answer (its expected agreement = direction · major
// position) across the answered questions.
//
// This is magnitude-FREE (a cosine), which `support` was not: support is a raw
// dot product, so large-norm majors (Materials, Nuclear) systematically
// out-scored everyone and broke nearest-neighbor adjacency. Correlation fixes
// that — a student who answers like a major's profile matches that major and
// its geometric neighbors, for every major in the catalog. It also handles
// multiple interests on its own: orthogonal interests (bio + CS) surface as two
// separate best-fits, while axis-conflicts surface the real bridge majors.
// ---------------------------------------------------------------------------
export function affinity(
  majorVec: Vec,
  answers: Answers,
  questions: Question[],
): number {
  const a: number[] = [];
  const sig: number[] = [];
  for (const q of questions) {
    const dir = QUESTION_VECTORS[q.id];
    const ans = answers[q.id];
    if (!dir || ans === undefined || ans === 0) continue;
    a.push(ans);
    sig.push(dot(dir, majorVec));
  }
  return a.length === 0 ? 0 : cosineN(a, sig);
}

export interface RankedMajor {
  major: Major;
  vec: Vec;
  support: number;
  score?: number; // 0-100 display score, filled in by recommend()
  lane?: number; // which interest lane this major represents (multimodal only)
  laneLabel?: string; // human label for that lane
}

// Score and sort every major by affinity (correlation), high → low. The
// `support` field carries the affinity value for display/normalization.
export function rankMajors(
  answers: Answers,
  questions: Question[],
  majors: Major[],
): RankedMajor[] {
  return majors
    .map((major) => {
      const vec = MAJOR_VECTORS[major.name];
      if (!vec) return null;
      return { major, vec, support: affinity(vec, answers, questions) };
    })
    .filter((r): r is RankedMajor => r !== null)
    .sort((a, b) => b.support - a.support);
}

// ---------------------------------------------------------------------------
// LANE DETECTION — used ONLY to label a split recommendation, never to rank.
//
// A "lane" is a cluster of the student's endorsed questions that point at the
// same region of major-space. Two questions can be near-orthogonal as
// directions yet share a lane (q-software loads on the digital axis,
// q-research on the theory axis, but both point at computing majors), so we
// cluster each endorsed question's best-fit major (its "anchor"), not the raw
// directions. Ranking is pure `affinity`; lanes just power the "you leaned in
// two directions" explanation when a student genuinely splits.
// ---------------------------------------------------------------------------

// Endorsed questions whose best-fit majors land within this distance of each
// other join the same lane.
const LANE_MERGE_DIST = 1.6;
// A lane needs at least this much summed agreement to count (keeps a single
// stray answer from spawning a spurious lane).
const MIN_LANE_MASS = 3;
// A second lane must be at least this fraction as strong as the dominant lane
// to count as a genuine competing interest worth labeling.
const SECONDARY_RATIO = 0.55;

export interface Lane {
  questionIds: string[];
  mass: number; // summed agreement of the questions in this lane
  centroid: Vec; // mean anchor-major position, for nearest-lane labeling
}

// The major a question points most strongly toward — the question's "anchor."
function bestMajorVec(qVec: Vec, majors: Major[]): Vec | null {
  let best: Vec | null = null;
  let bestDot = -Infinity;
  for (const m of majors) {
    const v = MAJOR_VECTORS[m.name];
    if (!v) continue;
    const d = dot(qVec, v);
    if (d > bestDot) {
      bestDot = d;
      best = v;
    }
  }
  return best;
}

// Group the student's *endorsed* (agreement > 0) questions into interest lanes
// by clustering their anchor majors. Greedy single pass, strongest answers
// first; returns lanes sorted by mass, thin ones dropped.
export function detectLanes(
  answers: Answers,
  questions: Question[],
  majors: Major[],
): Lane[] {
  const items = questions
    .map((q) => {
      const dir = QUESTION_VECTORS[q.id];
      const a = answers[q.id] ?? 0;
      if (!dir || !dir.some((x) => x !== 0) || a <= 0) return null;
      const anchor = bestMajorVec(dir, majors);
      return anchor ? { id: q.id, w: a as number, anchor } : null;
    })
    .filter((x): x is { id: string; w: number; anchor: Vec } => x !== null)
    .sort((a, b) => b.w - a.w);

  const lanes: { ids: string[]; mass: number; count: number; sum: Vec }[] = [];
  for (const it of items) {
    let best: (typeof lanes)[number] | null = null;
    let bestD = LANE_MERGE_DIST;
    for (const ln of lanes) {
      const centroid = ln.sum.map((x) => x / ln.count);
      const d = distance(it.anchor, centroid);
      if (d < bestD) {
        bestD = d;
        best = ln;
      }
    }
    if (best) {
      best.ids.push(it.id);
      best.mass += it.w;
      best.count += 1;
      for (let i = 0; i < DIM; i++) best.sum[i] += it.anchor[i];
    } else {
      lanes.push({ ids: [it.id], mass: it.w, count: 1, sum: [...it.anchor] });
    }
  }

  return lanes
    .filter((l) => l.mass >= MIN_LANE_MASS)
    .sort((a, b) => b.mass - a.mass)
    .map((l) => ({
      questionIds: l.ids,
      mass: l.mass,
      centroid: l.sum.map((x) => x / l.count),
    }));
}

// ---------------------------------------------------------------------------
// coverageTopK — the recommendation entry point.
//
// Ranking is pure `affinity` (correlation), nothing more: a major's geometric
// neighbors come along for free (CS → Data Engineering, Computer Engineering),
// so adjacency holds for EVERY major, and multiple genuine interests surface on
// their own — orthogonal ones (bio + CS) as separate best-fits, axis-conflicts
// as the real bridge majors. We do NOT reshuffle for diversity; that broke
// adjacency. Lanes are computed only to LABEL the picks when a student clearly
// split across two strong interests — they never change the order.
// ---------------------------------------------------------------------------
export function coverageTopK(
  answers: Answers,
  questions: Question[],
  majors: Major[],
  k = 3,
): RankedMajor[] {
  const top = rankMajors(answers, questions, majors).slice(0, k);

  const lanes = detectLanes(answers, questions, majors);
  const strong =
    lanes.length === 0
      ? []
      : lanes.filter(
          (l, i) => i === 0 || l.mass >= SECONDARY_RATIO * lanes[0].mass,
        );

  // Only label when there's a genuine split across ≥2 strong lanes.
  if (strong.length >= 2) {
    for (const r of top) {
      let best = 0;
      let bestD = Infinity;
      strong.forEach((ln, i) => {
        const d = distance(r.vec, ln.centroid);
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      });
      r.lane = best;
      r.laneLabel = laneLabelFor(strong[best].questionIds);
    }
  }

  return top;
}

// Name a lane by its strongest axis: sum the lane's question directions and
// take the pole of the dominant axis (e.g. "Digital / computational").
function laneLabelFor(questionIds: string[]): string {
  const sum = new Array(DIM).fill(0);
  for (const id of questionIds) {
    const v = QUESTION_VECTORS[id];
    if (!v) continue;
    for (let i = 0; i < DIM; i++) sum[i] += v[i];
  }
  let best = 0;
  for (let i = 1; i < DIM; i++) {
    if (Math.abs(sum[i]) > Math.abs(sum[best])) best = i;
  }
  return sum[best] >= 0 ? AXES[best].pos : AXES[best].neg;
}

// ---------------------------------------------------------------------------
// recommend — the display entry point. Runs coverageTopK, then attaches a
// 0-100 score by min-max normalizing support across ALL majors (so the bars
// are stable regardless of how strongly the student answered).
// ---------------------------------------------------------------------------
export function recommend(
  answers: Answers,
  questions: Question[],
  majors: Major[],
  k = 3,
): RankedMajor[] {
  const chosen = coverageTopK(answers, questions, majors, k);
  const all = rankMajors(answers, questions, majors);
  if (all.length === 0) return chosen;

  const max = all[0].support;
  const min = all[all.length - 1].support;
  const span = Math.max(1, max - min);
  for (const c of chosen) {
    c.score = Math.round(((c.support - min) / span) * 100);
  }
  return chosen;
}

export interface Reason {
  question: Question;
  agreement: number; // the student's Likert answer (signed)
  contribution: number; // how much this answer pulled the major up
}

// ---------------------------------------------------------------------------
// majorReasons — WHY a major matched. Each answered question contributes
// `agreement · (questionDir · majorVec)` to the major's fit; the answers with
// the largest positive contribution are the ones that pulled it up (you agreed
// with something the major is about, or disagreed with something it isn't).
// Returns the strongest few, for a human-readable explanation.
// ---------------------------------------------------------------------------
export function majorReasons(
  majorName: string,
  answers: Answers,
  questions: Question[],
  n = 3,
): Reason[] {
  const vec = MAJOR_VECTORS[majorName];
  if (!vec) return [];
  return questions
    .map((question) => {
      const dir = QUESTION_VECTORS[question.id];
      const agreement = answers[question.id];
      if (!dir || agreement === undefined || agreement === 0) return null;
      return {
        question,
        agreement: agreement as number,
        contribution: agreement * dot(dir, vec),
      };
    })
    .filter((r): r is Reason => r !== null && r.contribution > 0)
    .sort((a, b) => b.contribution - a.contribution)
    .slice(0, n);
}

// How each kind of question reads in the explanation sentence.
const CATEGORY_NOUN: Record<Category, string> = {
  interests: "interest in",
  skills: "skills in",
  career_paths: "career interest in",
  problem_areas: "interest in solving",
};
const CLAUSE_ORDER: Category[] = [
  "interests",
  "skills",
  "career_paths",
  "problem_areas",
];

function tagLabel(tag: string): string {
  return (
    TAG_LABELS[tag] ??
    tag.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

export interface ExplanationClause {
  category: Category;
  noun: string; // e.g. "interest in"
  suffix: string; // " problems" for problem areas, else ""
  topics: string[]; // human-readable topic labels
}

// ---------------------------------------------------------------------------
// majorExplanation — natural-language WHY, specific to each major. We take the
// tags the student endorsed (questions they agreed with, weighted by how
// strongly) and intersect them with THIS major's own skills / interests /
// career paths / problems. Each category becomes a clause, so the UI renders:
//
//   "Petroleum Engineering matches your interest in Energy, your skills in
//    Physics and Math, and your career interest in Oil, gas & energy resources."
//
// Using the major's own tags (not the raw question topics) keeps each
// explanation distinct and accurate. Falls back to the major's defining
// interests & skills if the student endorsed none of its tags directly.
// ---------------------------------------------------------------------------
export function majorExplanation(
  major: Major,
  answers: Answers,
  questions: Question[],
  maxClauses = 3,
  perCategory = 2,
): ExplanationClause[] {
  // Strength of each tag = summed positive agreement of the questions carrying
  // it; stronger agreement surfaces that tag first.
  const strength = new Map<string, number>();
  for (const q of questions) {
    const a = answers[q.id] ?? 0;
    if (a <= 0) continue;
    for (const t of q.tags) strength.set(t, (strength.get(t) ?? 0) + a);
  }

  const categoryTags: Record<Category, string[]> = {
    interests: major.interests,
    skills: major.skills,
    career_paths: major.career_paths,
    problem_areas: major.problem_areas,
  };
  const toClause = (c: Category, topics: string[]): ExplanationClause => ({
    category: c,
    noun: CATEGORY_NOUN[c],
    suffix: c === "problem_areas" ? " problems" : "",
    topics,
  });
  const endorsed = (tags: string[]) =>
    tags
      .filter((t) => (strength.get(t) ?? 0) > 0)
      .sort((x, y) => (strength.get(y) ?? 0) - (strength.get(x) ?? 0))
      .slice(0, perCategory)
      .map(tagLabel);

  let clauses = CLAUSE_ORDER.map((c) => {
    const topics = endorsed(categoryTags[c]);
    return topics.length ? toClause(c, topics) : null;
  }).filter((x): x is ExplanationClause => x !== null);

  // Fallback: the major's own primary interests & skills.
  if (clauses.length === 0) {
    clauses = (["interests", "skills"] as const)
      .map((c) =>
        categoryTags[c].length
          ? toClause(c, categoryTags[c].slice(0, perCategory).map(tagLabel))
          : null,
      )
      .filter((x): x is ExplanationClause => x !== null);
  }

  return clauses.slice(0, maxClauses);
}
