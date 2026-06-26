"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { Download } from "lucide-react";

import { AnswerSummary } from "@/components/answer-summary";
import { LikertQuestion } from "@/components/likert-question";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CATEGORY_LABELS } from "@/lib/questionnaire";
import {
  DEFAULT_ADAPTIVE,
  pickNextQuestions,
  top3Stable,
} from "@/lib/adaptive";
import { majorExplanation, recommend, type RankedMajor } from "@/lib/vectors";
import { LIKERT_OPTIONS } from "@/lib/types";
import type { Answers, LikertValue, Major, Question } from "@/lib/types";

interface AdaptiveMatcherProps {
  questions: Question[]; // the question bank to draw from
  majors: Major[];
}

const { perRound, maxRounds } = DEFAULT_ADAPTIVE;
const MAX_QUESTIONS = perRound * maxRounds;

export function AdaptiveMatcher({ questions, majors }: AdaptiveMatcherProps) {
  const [answers, setAnswers] = useState<Answers>({});
  // Questions presented so far, in order. Grows one adaptive batch at a time;
  // seeded with the fixed opening battery (most discriminating under a uniform
  // belief), which is deterministic from props.
  const [served, setServed] = useState<Question[]>(() =>
    pickNextQuestions({}, new Set(), questions, majors),
  );
  const [stepIndex, setStepIndex] = useState(0);
  const [rounds, setRounds] = useState(1);
  const [prevTop3, setPrevTop3] = useState<string[]>([]);
  // True once the fun closers have been appended; the next "Next" finishes.
  const [finishing, setFinishing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [stepIndex, showResults]);

  const current = served[stepIndex];
  const answered = !!current && answers[current.id] !== undefined;
  const progress = Math.min(
    95,
    Math.round((Object.keys(answers).length / MAX_QUESTIONS) * 100),
  );

  // Full ranking (all majors). The first three are the headline picks; the
  // rest sit behind a "see more" toggle.
  const results = useMemo(
    () =>
      showResults ? recommend(answers, questions, majors, majors.length) : [],
    [showResults, answers, questions, majors],
  );

  function advance() {
    // Still inside the current batch — just step forward.
    if (stepIndex < served.length - 1) {
      setStepIndex((i) => i + 1);
      return;
    }

    // We were on the last fun closer — done.
    if (finishing) {
      setShowResults(true);
      return;
    }

    // End of a batch — resample, then decide whether to ask more or stop.
    const askedIds = new Set(served.map((q) => q.id));
    const curTop3 = recommend(answers, questions, majors).map(
      (r) => r.major.name,
    );

    const stabilized = rounds >= 2 && top3Stable(prevTop3, curTop3);
    const next =
      rounds >= maxRounds || stabilized
        ? []
        : pickNextQuestions(answers, askedIds, questions, majors);

    if (next.length === 0) {
      // Scored questions are done. Append the fun closers (no scoring vector,
      // so pickNextQuestions never serves them) as the final questions.
      const funQs = questions.filter(
        (q) => q.tags.length === 0 && !askedIds.has(q.id),
      );
      if (funQs.length > 0) {
        setServed((s) => [...s, ...funQs]);
        setStepIndex((i) => i + 1);
        setFinishing(true);
        return;
      }
      setShowResults(true);
      return;
    }

    setServed((s) => [...s, ...next]);
    setStepIndex((i) => i + 1);
    setRounds((r) => r + 1);
    setPrevTop3(curTop3);
  }

  // Keyboard shortcuts: 1-5 pick the answer (Strongly Disagree → Strongly
  // Agree, by position), ← goes back, → / Enter advance.
  useEffect(() => {
    if (showResults || !current) return;
    const options = current.options ?? LIKERT_OPTIONS;

    function onKeyDown(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const num = Number(e.key);
      if (Number.isInteger(num) && num >= 1 && num <= options.length) {
        e.preventDefault();
        const value = options[num - 1].value;
        setAnswers((prev) => ({ ...prev, [current!.id]: value }));
        return;
      }

      if (e.key === "ArrowLeft") {
        if (stepIndex > 0) {
          e.preventDefault();
          setStepIndex((i) => Math.max(0, i - 1));
        }
        return;
      }

      if (e.key === "ArrowRight" || e.key === "Enter") {
        if (answered) {
          e.preventDefault();
          advance();
        }
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showResults, current, answered, stepIndex, advance]);

  function restart() {
    setAnswers({});
    setServed(pickNextQuestions({}, new Set(), questions, majors));
    setStepIndex(0);
    setRounds(1);
    setPrevTop3([]);
    setFinishing(false);
    setShowResults(false);
  }

  if (showResults) {
    return (
      <div ref={topRef} className="scroll-mt-6">
        <AdaptiveResults
          results={results}
          answers={answers}
          answered={served}
          onRestart={restart}
        />
      </div>
    );
  }

  if (!current) {
    return <div ref={topRef} className="scroll-mt-6" />;
  }

  return (
    <div ref={topRef} className="w-full scroll-mt-6 space-y-8">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Question {stepIndex + 1}</span>
          <span>{progress}%</span>
        </div>
        <Progress value={progress} />
      </div>

      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          {CATEGORY_LABELS[current.category]}
        </p>
        <LikertQuestion
          key={current.id}
          id={current.id}
          statement={current.statement}
          value={answers[current.id]}
          options={current.options}
          onChange={(value: LikertValue) =>
            setAnswers((prev) => ({ ...prev, [current.id]: value }))
          }
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="lg"
            className="h-14 px-12 text-lg"
            onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
            disabled={stepIndex === 0}
          >
            Back
          </Button>
          <Button
            size="lg"
            className="h-14 px-12 text-lg"
            onClick={advance}
            disabled={!answered}
          >
            Next
          </Button>
        </div>
        {!answered && (
          <p className="text-right text-xs text-muted-foreground">
            Choose an option to continue.
          </p>
        )}
      </div>
    </div>
  );
}

function scoreTone(score: number): string {
  if (score >= 70) return "bg-primary text-primary-foreground";
  if (score >= 40) return "bg-secondary text-secondary-foreground";
  return "bg-muted text-muted-foreground";
}

function AdaptiveResults({
  results,
  answers,
  answered,
  onRestart,
}: {
  results: RankedMajor[];
  answers: Answers;
  answered: Question[];
  onRestart: () => void;
}) {
  const [downloading, setDownloading] = useState(false);

  async function downloadPdf() {
    setDownloading(true);
    try {
      // jsPDF is browser-only and heavy, so load it on demand.
      const { generateResultsPdf } = await import("@/lib/pdf");
      await generateResultsPdf(results, answers, answered);
    } finally {
      setDownloading(false);
    }
  }

  const top = results.slice(0, 3);
  // The fun closers carry no tags and don't affect matching, so the headline
  // count reflects only the scored questions.
  const scoredCount = answered.filter((q) => q.tags.length > 0).length;

  // Distinct lanes across the headline picks (the "you're split" story).
  const lanes = Array.from(
    new Set(top.map((r) => r.laneLabel).filter(Boolean)),
  ) as string[];

  return (
    <div className="space-y-8">
      <div className="space-y-3 text-center">
        <h2 className="text-2xl font-semibold">Your best-fit majors</h2>
        <p className="text-sm text-muted-foreground">
          Matched from {scoredCount} questions.
          {lanes.length > 1
            ? ` You leaned toward two directions — ${lanes.join(" and ")} — so we covered both.`
            : ""}
        </p>
        <div className="flex justify-center">
          <Button onClick={downloadPdf} disabled={downloading}>
            <Download className="size-4" />
            {downloading ? "Preparing PDF…" : "Download results (PDF)"}
          </Button>
        </div>
      </div>

      {/* Split screen: the three headline picks on the left, the full
          ranking on the right — together they fill the width. */}
      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        {/* Left: top three */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">
            Top three matches
          </h3>
          {top.map((r, i) => {
          const clauses = majorExplanation(r.major, answers, answered);
          return (
            <Card key={r.major.name}>
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <span className="text-muted-foreground tabular-nums">
                      #{i + 1}
                    </span>
                    {r.major.name}
                  </CardTitle>
                  <Badge className={scoreTone(r.score ?? 0)}>
                    {r.score ?? 0}% match
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Progress
                  value={r.score ?? 0}
                  aria-label={`${r.score ?? 0}% match`}
                />
                {lanes.length > 1 && r.laneLabel && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-xs text-muted-foreground">
                      Matched your interest in:
                    </span>
                    <Badge variant="secondary">{r.laneLabel}</Badge>
                  </div>
                )}
                {clauses.length > 0 && (
                  <p className="rounded-md bg-muted/50 p-3 text-sm leading-relaxed text-muted-foreground">
                    <span className="font-medium text-foreground">
                      {r.major.name}
                    </span>{" "}
                    matches{" "}
                    {clauses.map((cl, ci) => (
                      <Fragment key={cl.category}>
                        {ci > 0 &&
                          (ci === clauses.length - 1
                            ? clauses.length > 2
                              ? ", and "
                              : " and "
                            : ", ")}
                        your {cl.noun}{" "}
                        {cl.topics.map((t, ti) => (
                          <Fragment key={t}>
                            {ti > 0 &&
                              (ti === cl.topics.length - 1 ? " and " : ", ")}
                            <span className="font-medium text-foreground">
                              {t}
                            </span>
                          </Fragment>
                        ))}
                        {cl.suffix}
                      </Fragment>
                    ))}
                    .
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  {r.major.description}
                </p>
                <p className="text-xs text-muted-foreground">
                  Median salary:{" "}
                  <span className="font-medium text-foreground">
                    ${r.major.salary.toLocaleString()}
                  </span>
                </p>
              </CardContent>
            </Card>
          );
        })}
        </div>

        {/* Right: the full ranking of every major */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">
            Full ranking
          </h3>
          <ol className="space-y-2 rounded-lg border border-border bg-card p-4">
            {results.map((r, i) => (
              <li
                key={r.major.name}
                className="flex items-center gap-3 text-sm"
              >
                <span className="w-6 shrink-0 text-right tabular-nums text-muted-foreground">
                  {i + 1}
                </span>
                <span className="flex-1 truncate">{r.major.name}</span>
                <div className="hidden h-1.5 w-24 shrink-0 overflow-hidden rounded-full bg-muted sm:block">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${r.score ?? 0}%` }}
                  />
                </div>
                <span className="w-9 shrink-0 text-right tabular-nums text-muted-foreground">
                  {r.score ?? 0}%
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Below the split: the questions and the student's responses */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">
          Your questions &amp; responses
        </h3>
        <AnswerSummary questions={answered} answers={answers} />
      </div>

      <div className="flex justify-center pt-2">
        <Button size="lg" className="h-14 px-12 text-lg" onClick={onRestart}>
          Start over
        </Button>
      </div>
    </div>
  );
}
