import type {
  Answers,
  LikertValue,
  Major,
  MajorMatch,
  MatchBreakdown,
  Question,
} from "./types";
import type { Category } from "./questionnaire";

const CATEGORIES: Category[] = [
  "skills",
  "career_paths",
  "problem_areas",
  "interests",
];

// All canonical tags a major carries, unioned across its category arrays.
function majorTagSet(major: Major): Set<string> {
  return new Set([
    ...major.skills,
    ...major.career_paths,
    ...major.problem_areas,
    ...major.interests,
  ]);
}

// How many of a question's tags this major carries (0 = irrelevant question).
function overlap(question: Question, tags: Set<string>): number {
  return question.tags.reduce((n, t) => n + (tags.has(t) ? 1 : 0), 0);
}

// Salary preference acts as a soft gate: majors at/above the target keep full
// credit; those below are scaled down proportionally rather than removed.
function salaryFactor(major: Major, minSalary: number): number {
  if (minSalary <= 0 || major.salary >= minSalary) return 1;
  return major.salary / minSalary;
}

/**
 * Score every major against the student's Likert answers + salary preference.
 *
 * For each major we sum `likert(answer) * overlap` over all answered
 * questions, then min-max normalize against the all-"Strongly Agree" ceiling
 * so the result lands on 0-100 (50 = every relevant answer was Neutral).
 * The salary factor then scales the tag score. Results are sorted high → low.
 */
export function matchMajors(
  answers: Answers,
  minSalary: number,
  questions: Question[],
  majors: Major[],
): MajorMatch[] {
  return majors
    .map((major) => {
      const tags = majorTagSet(major);

      const byCategory: Record<Category, { contribution: number; possible: number }> =
        {
          skills: { contribution: 0, possible: 0 },
          career_paths: { contribution: 0, possible: 0 },
          problem_areas: { contribution: 0, possible: 0 },
          interests: { contribution: 0, possible: 0 },
        };

      for (const q of questions) {
        const o = overlap(q, tags);
        if (o === 0) continue;
        const answer: LikertValue = answers[q.id] ?? 0;
        byCategory[q.category].contribution += answer * o;
        byCategory[q.category].possible += 2 * o; // ceiling = Strongly Agree
      }

      const raw = CATEGORIES.reduce((s, c) => s + byCategory[c].contribution, 0);
      const maxRaw = CATEGORIES.reduce((s, c) => s + byCategory[c].possible, 0);

      // Center at 50 (all Neutral) and span to 0/100 at the Disagree/Agree poles.
      const tagScore = maxRaw === 0 ? 0 : Math.round(((raw / maxRaw + 1) / 2) * 100);
      const factor = salaryFactor(major, minSalary);
      const score = Math.round(tagScore * factor);

      const breakdown: MatchBreakdown[] = CATEGORIES.map((c) => ({
        category: c,
        contribution: byCategory[c].contribution,
        possible: byCategory[c].possible,
      }));

      return { major, score, tagScore, salaryFactor: factor, breakdown };
    })
    .sort((a, b) => b.score - a.score);
}
