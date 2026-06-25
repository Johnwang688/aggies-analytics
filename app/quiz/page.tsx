import { AdaptiveMatcher } from "@/components/adaptive-matcher";
import majorsData from "@/data/majors.json";
import { LIVE_QUESTIONS } from "@/lib/questions";
import type { Major } from "@/lib/types";

const majors = majorsData as Major[];

export default function QuizPage() {
  return (
    <main className="w-full flex-1 px-5 py-14 sm:px-10 sm:py-20 lg:px-[4vw] lg:py-28">
      <header className="mb-8 space-y-2 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
          Texas A&amp;M University
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Find your ideal engineering major
        </h1>
        <p className="mx-auto max-w-md text-sm text-muted-foreground">
          Answer a few quick questions about your skills, interests, and goals,
          and we&apos;ll match you with the engineering majors that fit you best.
        </p>
      </header>

      <AdaptiveMatcher questions={LIVE_QUESTIONS} majors={majors} />
    </main>
  );
}
