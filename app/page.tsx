import Link from "next/link";

import { TamuLogo } from "@/components/tamu-logo";
import { Button } from "@/components/ui/button";
import majorsData from "@/data/majors.json";
import { LIVE_QUESTIONS } from "@/lib/questions";

const QUESTION_COUNT = LIVE_QUESTIONS.length;
const MAJOR_COUNT = majorsData.length;

const STATS = [
  { value: QUESTION_COUNT, label: "Questions" },
  { value: MAJOR_COUNT, label: "Engineering majors" },
  { value: "~3", label: "Minutes to finish" },
];

const STEPS = [
  {
    title: "Get comfortable",
    description:
      "Find a quiet moment. There are no wrong answers — just go with your gut.",
  },
  {
    title: "Answer the questions",
    description: `Respond to ${QUESTION_COUNT} quick statements about your skills, interests, and goals.`,
  },
  {
    title: "See your matches",
    description:
      "Get a ranked list of A&M engineering majors with salary outlooks and the reasons each one fits.",
  },
];

export default function Home() {
  return (
    <div className="relative min-h-full flex-1 overflow-hidden">
      {/* Decorative maroon glass backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-secondary via-background to-secondary" />
      <div className="pointer-events-none absolute -left-32 -top-32 -z-10 size-[28rem] rounded-full bg-primary/25 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 top-1/3 -z-10 size-[32rem] rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/4 -z-10 size-[26rem] rounded-full bg-accent/40 blur-3xl" />

      {/* Nav */}
      <header className="sticky top-0 z-20 border-b border-white/30 bg-background/50 backdrop-blur-xl">
        <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-3.5">
          <Link href="/" className="flex items-center gap-2.5">
            <TamuLogo className="size-9" />
            <span className="text-lg font-semibold tracking-tight">
              Aggie Major Matcher
            </span>
          </Link>
          <Button
            className="h-10 px-5"
            render={<Link href="/quiz">Start the quiz</Link>}
          />
        </nav>
      </header>

      <main className="mx-auto w-full max-w-6xl px-5">
        {/* Hero */}
        <section className="grid items-center gap-10 py-12 sm:py-20 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/40 bg-card/50 p-8 shadow-xl backdrop-blur-xl sm:p-10">
            <div className="mb-4 flex items-center gap-3">
              <TamuLogo className="size-12" />
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                Texas A&amp;M University
              </p>
            </div>

            <h1 className="text-6xl font-semibold tracking-tight sm:text-7xl">
              HOWDY!
            </h1>
            <p className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
              Discover your perfect{" "}
              <span className="text-primary">engineering major</span>
            </p>

            <p className="mt-5 max-w-md text-base text-muted-foreground">
              Find the Texas A&amp;M engineering major that fits you best — based on
              your skills, interests, and goals. No account, no fluff.
            </p>

            <div className="mt-8">
              <Button
                size="lg"
                className="h-12 w-full px-8 text-base sm:w-auto"
                render={<Link href="/quiz">Start the questions</Link>}
              />
              <p className="mt-3 text-xs text-muted-foreground">
                Takes about 3 minutes • No sign-up required
              </p>
            </div>
          </div>

          {/* Glass phone mockup preview */}
          <div className="flex justify-center lg:justify-end">
            <PhoneMockup />
          </div>
        </section>

        {/* Value props */}
        <section className="grid gap-8 py-8 sm:grid-cols-2">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Find your best fit within minutes
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              The matcher gives you personalized, in-depth results so you can plan
              your degree and career at Texas A&amp;M with confidence.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Built for Aggie engineers
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Every answer is scored against {MAJOR_COUNT} real undergraduate
              engineering majors offered at Texas A&amp;M — ranked just for you.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="grid gap-4 py-8 sm:grid-cols-3">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/40 bg-card/50 p-6 shadow-sm backdrop-blur-xl"
            >
              <p className="text-5xl font-semibold tracking-tight text-primary">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </section>

        {/* How it works */}
        <section className="my-12 rounded-3xl border border-white/40 bg-card/50 p-8 shadow-xl backdrop-blur-xl sm:p-12">
          <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            How it works
          </h2>

          <ol className="mt-10 grid gap-8 sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <li key={step.title}>
                <div className="flex size-12 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-lg font-semibold text-primary">
                  {i + 1}
                </div>
                <h3 className="mt-4 text-lg font-semibold tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>

          <Button
            size="lg"
            className="mt-10 h-12 px-8 text-base"
            render={<Link href="/quiz">Start the questions</Link>}
          />
        </section>
      </main>
    </div>
  );
}

/** A glassy phone showing a sample Likert question — echoes the live quiz. */
function PhoneMockup() {
  const scale = [
    { label: "Strongly Disagree", className: "bg-destructive/20" },
    { label: "Disagree", className: "bg-primary/15" },
    { label: "Neutral", className: "bg-muted" },
    { label: "Agree", className: "bg-primary/30" },
    { label: "Strongly Agree", className: "bg-primary/60" },
  ];

  return (
    <div className="w-[300px] rounded-[2.5rem] border-[10px] border-foreground/90 bg-card/70 p-4 shadow-2xl backdrop-blur-xl">
      {/* notch */}
      <div className="mx-auto mb-4 h-1.5 w-16 rounded-full bg-foreground/30" />

      <div className="mb-3 flex items-center gap-2">
        <TamuLogo className="size-6" />
        <div className="leading-tight">
          <p className="text-xs font-semibold">Aggie Major Matcher</p>
          <p className="text-[10px] text-muted-foreground">Created at Texas A&amp;M</p>
        </div>
      </div>

      {/* progress */}
      <div className="mb-1 flex justify-between text-[10px] text-muted-foreground">
        <span>48%</span>
        <span>Step 6 of 12</span>
      </div>
      <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full w-[48%] rounded-full bg-primary" />
      </div>

      <p className="mb-3 text-center text-sm font-semibold">
        How accurately does each statement reflect you?
      </p>

      <div className="mb-4 flex justify-between">
        {scale.map((s) => (
          <div key={s.label} className="flex flex-col items-center gap-1">
            <span className={`size-7 rounded-full border border-border ${s.className}`} />
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-white/40 bg-background/60 p-3 text-center text-sm backdrop-blur">
        I enjoy taking apart machines to see how they work.
      </div>
    </div>
  );
}
