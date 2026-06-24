"use client";

import { Badge } from "@/components/ui/badge";
import { CATEGORY_LABELS, type Category } from "@/lib/questionnaire";
import { LIKERT_OPTIONS, type Answers, type Question } from "@/lib/types";
import { cn } from "@/lib/utils";

const CATEGORY_ORDER: Category[] = [
  "skills",
  "career_paths",
  "problem_areas",
  "interests",
];

function answerLabel(q: Question, value: number): string {
  const opts = q.options ?? LIKERT_OPTIONS;
  return opts.find((o) => o.value === value)?.label ?? "—";
}

// Tone the answer chip by sentiment so the summary is skimmable at a glance.
function answerTone(value: number | undefined): string {
  if (value === undefined) return "bg-muted text-muted-foreground";
  if (value > 0) return "border-primary/30 bg-primary/10 text-primary";
  if (value < 0)
    return "border-destructive/30 bg-destructive/10 text-destructive";
  return "bg-muted text-muted-foreground";
}

interface AnswerSummaryProps {
  questions: Question[];
  answers: Answers;
}

export function AnswerSummary({ questions, answers }: AnswerSummaryProps) {
  return (
    <div className="space-y-5 rounded-lg border border-border bg-card p-4">
      {CATEGORY_ORDER.map((category) => {
        const group = questions.filter((q) => q.category === category);
        if (group.length === 0) return null;
        return (
          <section key={category} className="space-y-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              {CATEGORY_LABELS[category]}
            </h4>
            <ul className="space-y-3">
              {group.map((q) => {
                const value = answers[q.id];
                return (
                  <li key={q.id} className="space-y-1.5">
                    <p className="text-sm leading-snug text-foreground">
                      {q.statement}
                    </p>
                    <Badge
                      variant="outline"
                      className={cn("font-normal", answerTone(value))}
                    >
                      {value === undefined ? "Not answered" : answerLabel(q, value)}
                    </Badge>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
