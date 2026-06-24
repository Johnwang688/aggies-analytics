import type { Category } from "./questionnaire";

export interface Major {
  name: string;
  description: string;
  career_paths: string[];
  skills: string[];
  problem_areas: string[];
  interests: string[];
  salary: number;
}

// 5-point Likert scale, stored as a signed weight so it plugs straight into
// the scoring math (Neutral contributes nothing).
export type LikertValue = -2 | -1 | 0 | 1 | 2;

export interface LikertOption {
  value: LikertValue;
  label: string;
}

export const LIKERT_OPTIONS: LikertOption[] = [
  { value: -2, label: "Strongly Disagree" },
  { value: -1, label: "Disagree" },
  { value: 0, label: "Neutral" },
  { value: 1, label: "Agree" },
  { value: 2, label: "Strongly Agree" },
];

export interface Question {
  id: string;
  statement: string;
  category: Category;
  // Canonical tag ids (from lib/questionnaire) this statement maps to.
  tags: string[];
  // Optional custom answer choices. Defaults to LIKERT_OPTIONS. Only meaningful
  // for tag-less "just for fun" questions, since the labels then carry no
  // scoring weight.
  options?: LikertOption[];
}

// Map of question id -> the student's Likert answer.
export type Answers = Record<string, LikertValue>;

export interface MatchBreakdown {
  category: Category;
  contribution: number; // raw points this category added/subtracted
  possible: number; // max points this category could have added
}

export interface MajorMatch {
  major: Major;
  score: number; // 0-100 final match score
  tagScore: number; // 0-100 before the salary factor
  salaryFactor: number; // 0-1 multiplier from the salary preference
  breakdown: MatchBreakdown[];
}
