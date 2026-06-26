import { AdaptiveMatcher } from "@/components/adaptive-matcher";
import { TamuLogo } from "@/components/tamu-logo";
import majorsData from "@/data/majors.json";
import { LIVE_QUESTIONS } from "@/lib/questions";
import type { Major } from "@/lib/types";

const majors = majorsData as Major[];

export default function QuizPage() {
  return (
    <main className="w-full flex-1 px-5 py-14 sm:px-10 sm:py-20 lg:px-[4vw] lg:py-28">
      {/* Brand header — mirrors the landing page's quiz preview mockup. */}
      <header className="mb-10 flex items-center justify-center gap-4">
        <TamuLogo className="size-12 sm:size-14" />
        <p className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Aggie Engineering Matcher
        </p>
      </header>

      <AdaptiveMatcher questions={LIVE_QUESTIONS} majors={majors} />
    </main>
  );
}
