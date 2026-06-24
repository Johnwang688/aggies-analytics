"use client";

import { AnswerSummary } from "@/components/answer-summary";
import { MajorCard } from "@/components/major-card";
import { Button } from "@/components/ui/button";
import type { Answers, MajorMatch, Question } from "@/lib/types";

interface ResultsListProps {
  matches: MajorMatch[];
  questions: Question[];
  answers: Answers;
  onRestart: () => void;
}

export function ResultsList({
  matches,
  questions,
  answers,
  onRestart,
}: ResultsListProps) {
  const top = matches.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h2 className="text-2xl font-semibold">Your best-fit majors</h2>
        <p className="text-sm text-muted-foreground">
          Ranked by how well each Texas A&M engineering major matches your answers.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
        {/* Left: what you told us */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">
            Your answers
          </h3>
          <AnswerSummary questions={questions} answers={answers} />
        </div>

        {/* Right: the majors those answers matched */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">
            Matching majors
          </h3>
          <div className="space-y-3">
            {top.map((match, i) => (
              <MajorCard key={match.major.name} match={match} rank={i + 1} />
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-2">
        <Button variant="outline" onClick={onRestart}>
          Start over
        </Button>
      </div>
    </div>
  );
}
