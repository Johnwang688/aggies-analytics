"use client";

import { LikertQuestion } from "@/components/likert-question";
import { Badge } from "@/components/ui/badge";
import {
  CATEGORY_LABELS,
  TAG_LABELS,
  type Category,
} from "@/lib/questionnaire";
import type { Question } from "@/lib/types";

const CATEGORY_ORDER: Category[] = [
  "skills",
  "career_paths",
  "problem_areas",
  "interests",
];

interface QuestionReviewProps {
  questions: Question[];
}

export function QuestionReview({ questions }: QuestionReviewProps) {
  return (
    <div className="space-y-8">
      {CATEGORY_ORDER.map((category) => {
        const group = questions.filter((q) => q.category === category);
        if (group.length === 0) return null;
        return (
          <section key={category} className="space-y-3">
            <h2 className="text-lg font-semibold">
              {CATEGORY_LABELS[category]}{" "}
              <span className="text-sm font-normal text-muted-foreground">
                ({group.length})
              </span>
            </h2>
            <div className="space-y-4">
              {group.map((q) => (
                <div key={q.id} className="space-y-2">
                  <LikertQuestion id={q.id} statement={q.statement} readOnly />
                  <div className="flex flex-wrap items-center gap-1.5 pl-1">
                    <span className="text-xs text-muted-foreground">
                      Maps to:
                    </span>
                    {q.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="font-normal">
                        {TAG_LABELS[tag] ?? tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
