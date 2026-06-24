import Link from "next/link";

import { QuestionReview } from "@/components/question-review";
import { Button } from "@/components/ui/button";
import { PROPOSED_QUESTIONS } from "@/lib/questions";

export default function ReviewPage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-10 sm:py-16">
      <header className="mb-8 space-y-2">
        <p className="text-sm font-medium text-primary">Question approval</p>
        <h1 className="text-3xl font-semibold tracking-tight">
          Proposed questionnaire
        </h1>
        <p className="text-sm text-muted-foreground">
          Below are the {PROPOSED_QUESTIONS.length} proposed Likert questions
          exactly as they&apos;ll appear to students, grouped by category, with the
          major attributes each one feeds into. Review the wording and mappings
          before we ship these to production.
        </p>
      </header>

      <QuestionReview questions={PROPOSED_QUESTIONS} />

      <div className="mt-10 flex justify-center">
        <Button variant="outline" render={<Link href="/quiz">Back to the quiz</Link>} />
      </div>
    </main>
  );
}
