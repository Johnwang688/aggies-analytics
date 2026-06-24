"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { LikertQuestion } from "@/components/likert-question";
import { ResultsList } from "@/components/results-list";
import { SalaryStep } from "@/components/salary-step";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { matchMajors } from "@/lib/match";
import { CATEGORY_LABELS, DEFAULT_MIN_SALARY } from "@/lib/questionnaire";
import type { Answers, LikertValue, Major, Question } from "@/lib/types";

interface MajorMatcherProps {
  questions: Question[];
  majors: Major[];
}

export function MajorMatcher({ questions, majors }: MajorMatcherProps) {
  const [answers, setAnswers] = useState<Answers>({});
  const [minSalary, setMinSalary] = useState(DEFAULT_MIN_SALARY);
  const [stepIndex, setStepIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  // One question per step; the salary preference is the final step.
  const isSalaryStep = stepIndex === questions.length;
  const currentQuestion = isSalaryStep ? null : questions[stepIndex];

  // Progress tracks the required portion (the questions). Salary is an
  // optional preference, so the bar is already full once every question is in.
  const answeredCount = useMemo(
    () => questions.filter((q) => answers[q.id] !== undefined).length,
    [questions, answers],
  );
  const progress = questions.length
    ? Math.round((answeredCount / questions.length) * 100)
    : 0;

  const results = useMemo(
    () =>
      showResults ? matchMajors(answers, minSalary, questions, majors) : [],
    [showResults, answers, minSalary, questions, majors],
  );

  // Bring the new step into view so users don't land mid-page after Next/Back.
  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [stepIndex, showResults]);

  const restart = () => {
    setAnswers({});
    setMinSalary(DEFAULT_MIN_SALARY);
    setStepIndex(0);
    setShowResults(false);
  };

  if (showResults) {
    return (
      <div ref={topRef} className="scroll-mt-6">
        <ResultsList
          matches={results}
          questions={questions}
          answers={answers}
          onRestart={restart}
        />
      </div>
    );
  }

  const currentAnswered =
    isSalaryStep || (!!currentQuestion && answers[currentQuestion.id] !== undefined);

  return (
    <div ref={topRef} className="mx-auto w-full max-w-2xl scroll-mt-6 space-y-5">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {isSalaryStep
              ? "Final step"
              : `Question ${stepIndex + 1} of ${questions.length}`}
          </span>
          <span>{progress}% complete</span>
        </div>
        <Progress value={progress} />
      </div>

      {currentQuestion ? (
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            {CATEGORY_LABELS[currentQuestion.category]}
          </p>
          <LikertQuestion
            key={currentQuestion.id}
            id={currentQuestion.id}
            statement={currentQuestion.statement}
            value={answers[currentQuestion.id]}
            options={currentQuestion.options}
            onChange={(value: LikertValue) =>
              setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }))
            }
          />
        </div>
      ) : (
        <div className="space-y-3">
          <div>
            <h2 className="text-xl font-semibold">Preferred minimum salary</h2>
            <p className="text-sm text-muted-foreground">
              We&apos;ll favor majors whose typical starting salary meets your goal.
            </p>
          </div>
          <SalaryStep value={minSalary} onChange={setMinSalary} />
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
            disabled={stepIndex === 0}
          >
            Back
          </Button>
          {isSalaryStep ? (
            <Button onClick={() => setShowResults(true)}>See my matches</Button>
          ) : (
            <Button
              onClick={() => setStepIndex((i) => i + 1)}
              disabled={!currentAnswered}
            >
              Next
            </Button>
          )}
        </div>
        {!isSalaryStep && !currentAnswered && (
          <p className="text-right text-xs text-muted-foreground">
            Choose an option to continue.
          </p>
        )}
      </div>
    </div>
  );
}
