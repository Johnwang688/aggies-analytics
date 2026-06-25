"use client";

import Image from "next/image";
import Link from "next/link";
import { useReducedMotion } from "motion/react";

import { TamuLogo } from "@/components/tamu-logo";
import { Button } from "@/components/ui/button";
import { DEFAULT_ADAPTIVE } from "@/lib/adaptive";
import {
  CountUp,
  DriftingOrb,
  Float,
  MotionCard,
  Reveal,
  motion,
  EASE,
} from "@/components/landing/motion";

// The number of questions a student actually answers in the live quiz.
const QUIZ_LENGTH = DEFAULT_ADAPTIVE.perRound * DEFAULT_ADAPTIVE.maxRounds;
// A representative mid-quiz step for the preview mockup.
const PREVIEW_STEP = Math.round(QUIZ_LENGTH / 2);
const PREVIEW_PCT = Math.round((PREVIEW_STEP / QUIZ_LENGTH) * 100);

interface LandingProps {
  questionCount: number;
  majorCount: number;
}

export function Landing({ questionCount, majorCount }: LandingProps) {
  const reduce = useReducedMotion();

  const stats: { value: number | string; label: string }[] = [
    { value: questionCount, label: "Questions" },
    { value: majorCount, label: "Engineering majors" },
    { value: "~3", label: "Minutes to finish" },
  ];

  const steps = [
    {
      title: "Get comfortable",
      description:
        "Find a quiet moment. There are no wrong answers, so just go with your gut.",
    },
    {
      title: "Answer the questions",
      description: `Respond to ${questionCount} quick statements about your skills, interests, and goals.`,
    },
    {
      title: "See your matches",
      description:
        "Get a ranked list of A&M engineering majors with salary outlooks and the reasons each one fits.",
    },
  ];

  // Hero entrance: stagger each piece into place on load.
  const heroContainer = {
    hidden: {},
    show: { transition: { staggerChildren: 0.09, delayChildren: 0.08 } },
  };
  const heroItem = {
    hidden: { opacity: 0, y: 22 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
  };
  const heroTitle = {
    hidden: { opacity: 0, y: 22, scale: 0.94 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: EASE },
    },
  };

  return (
    <div className="relative min-h-full flex-1 overflow-hidden">
      {/* Decorative maroon glass backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-secondary via-background to-secondary" />
      <DriftingOrb
        className="-left-32 -top-32 size-[28rem] bg-primary/25"
        drift={[0, 40, 0]}
        rise={[0, 30, 0]}
        duration={20}
      />
      <DriftingOrb
        className="-right-40 top-1/3 size-[32rem] bg-primary/15"
        drift={[0, -36, 0]}
        rise={[0, 28, 0]}
        duration={24}
      />
      <DriftingOrb
        className="bottom-0 left-1/4 size-[26rem] bg-accent/40"
        drift={[0, 28, 0]}
        rise={[0, -22, 0]}
        duration={22}
      />

      {/* Nav */}
      <motion.header
        className="sticky top-0 z-20 border-b border-white/30 bg-background/50 backdrop-blur-xl"
        initial={reduce ? false : { opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <nav className="flex w-full items-center justify-between px-5 py-3.5 sm:px-10 lg:px-[4vw]">
          <Link href="/" className="flex items-center gap-2.5">
            <TamuLogo className="size-9" />
            <span className="text-lg font-semibold tracking-tight">
              Aggie Major Matcher
            </span>
          </Link>
          <motion.div
            whileHover={reduce ? undefined : { scale: 1.04 }}
            whileTap={reduce ? undefined : { scale: 0.97 }}
          >
            <Button
              className="h-10 px-5"
              render={<Link href="/quiz">Start the quiz</Link>}
            />
          </motion.div>
        </nav>
      </motion.header>

      {/* Hero — fixed-height first screen so it never resizes on scroll */}
      <section className="relative flex h-[calc(100svh-4.5rem)] w-full items-center overflow-hidden px-5 sm:px-10 lg:px-[4vw]">
        {/* Always-on bottom fade so the seam into the next section is soft */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-40 bg-gradient-to-b from-transparent to-background" />
        <div className="grid w-full items-stretch gap-10 py-12 lg:grid-cols-2">
          <motion.div
            className="rounded-3xl border border-white/40 bg-card/50 p-8 shadow-xl backdrop-blur-xl sm:p-10"
            variants={heroContainer}
            initial={reduce ? false : "hidden"}
            animate="show"
          >
            <motion.div variants={heroItem} className="mb-4 flex items-center gap-3">
              <TamuLogo className="size-12" />
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                Texas A&amp;M University
              </p>
            </motion.div>

            <motion.h1
              variants={heroTitle}
              className="text-6xl font-semibold tracking-tight sm:text-7xl"
            >
              HOWDY!
            </motion.h1>
            <motion.p
              variants={heroItem}
              className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl"
            >
              Discover your perfect{" "}
              <span className="text-primary">engineering major</span>
            </motion.p>

            <motion.p
              variants={heroItem}
              className="mt-5 max-w-md text-base text-muted-foreground"
            >
              Find the Texas A&amp;M engineering major that fits you best based on
              your skills, interests, and goals.
            </motion.p>

            <motion.div variants={heroItem} className="mt-8">
              <motion.div
                className="inline-block w-full sm:w-auto"
                whileHover={reduce ? undefined : { scale: 1.03 }}
                whileTap={reduce ? undefined : { scale: 0.98 }}
              >
                <Button
                  size="lg"
                  className="h-12 w-full px-8 text-base sm:w-auto"
                  render={<Link href="/quiz">Start the questions</Link>}
                />
              </motion.div>
              
            </motion.div>
          </motion.div>

          {/* Glass browser mockup preview */}
          <motion.div
            className="flex justify-center lg:justify-end"
            initial={reduce ? false : { opacity: 0, x: 48 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
          >
            <Float className="w-full max-w-[650px]">
              <BrowserMockup />
            </Float>
          </motion.div>
        </div>
      </section>

      {/* Below the fold — fixed-height second screen; nothing crosses the seam */}
      <section className="relative flex h-svh w-full flex-col justify-center gap-10 overflow-hidden px-5 py-16 sm:px-10 lg:px-[4vw]">
        {/* Photo is confined to this section (no bleed) and fades in on scroll. */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          {...(reduce
            ? {}
            : {
                initial: { opacity: 0 },
                whileInView: { opacity: 1 },
                viewport: { once: true, amount: 0.15 },
                transition: { duration: 0.4, ease: "easeOut" },
              })}
        >
          <Image
            src="/tamu-school-of-engineering.png"
            alt=""
            fill
            sizes="100vw"
            className="scale-110 object-cover"
          />
          {/* Even wash for readability + a top fade that blends the photo's
              top edge into the page background at the seam. */}
          <div className="absolute inset-0 bg-background/75" />
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background to-transparent" />
        </motion.div>

        {/* Value props */}
        <div className="grid gap-8 sm:grid-cols-2">
          <Reveal>
            <h2 className="text-xl font-semibold tracking-tight">
              Find your best fit within minutes
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              The matcher gives you personalized, in-depth results so you can plan
              your degree and career at TAMU with confidence.
            </p>
          </Reveal>
          <Reveal delay={0.12}>
            <h2 className="text-xl font-semibold tracking-tight">
              Built for Aggie engineers
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Every answer is scored against the {majorCount} undergraduate
              engineering majors offered at TAMU and ranked just for you.
            </p>
          </Reveal>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          {stats.map((stat, i) => (
            <MotionCard
              key={stat.label}
              delay={i * 0.1}
              className="rounded-2xl border border-white/40 bg-card/50 p-6 shadow-sm backdrop-blur-xl"
            >
              <p className="text-5xl font-semibold tracking-tight text-primary">
                {typeof stat.value === "number" ? (
                  <CountUp to={stat.value} />
                ) : (
                  stat.value
                )}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </MotionCard>
          ))}
        </div>

        {/* How it works */}
        <MotionCard className="rounded-3xl border border-white/40 bg-card/50 p-8 shadow-xl backdrop-blur-xl sm:p-12">
          <Reveal>
            <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              How it works
            </h2>
          </Reveal>

          <ol className="mt-10 grid gap-8 sm:grid-cols-3">
            {steps.map((step, i) => (
              <Reveal key={step.title} delay={0.15 + i * 0.12} className="contents">
                <li>
                  <motion.div
                    className="flex size-12 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-lg font-semibold text-primary"
                    initial={reduce ? false : { scale: 0, rotate: -30 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 16,
                      delay: 0.2 + i * 0.12,
                    }}
                  >
                    {i + 1}
                  </motion.div>
                  <h3 className="mt-4 text-lg font-semibold tracking-tight">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </li>
              </Reveal>
            ))}
          </ol>

          <Reveal delay={0.5}>
            <motion.div
              className="mt-10 inline-block"
              whileHover={reduce ? undefined : { scale: 1.03 }}
              whileTap={reduce ? undefined : { scale: 0.98 }}
            >
              <Button
                size="lg"
                className="h-12 px-8 text-base"
                render={<Link href="/quiz">Start the questions</Link>}
              />
            </motion.div>
          </Reveal>
        </MotionCard>
      </section>
    </div>
  );
}

/** A glassy macOS browser window showing a sample question, echoing the quiz. */
function BrowserMockup() {
  const reduce = useReducedMotion();
  const scale = [
    { label: "Strongly Disagree", className: "bg-destructive/20" },
    { label: "Disagree", className: "bg-primary/15" },
    { label: "Neutral", className: "bg-muted" },
    { label: "Agree", className: "bg-primary/30" },
    { label: "Strongly Agree", className: "bg-primary/60" },
  ];

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-foreground/15 bg-card/70 shadow-2xl backdrop-blur-xl">
      {/* Title bar with traffic-light controls + address bar */}
      <div className="flex items-center gap-3 border-b border-border/70 bg-muted/60 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="size-3 rounded-full bg-[#ff5f57]" />
          <span className="size-3 rounded-full bg-[#febc2e]" />
          <span className="size-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="ml-2 flex h-7 flex-1 items-center gap-2 rounded-md border border-border/60 bg-background/70 px-3 text-xs text-muted-foreground">
          <svg viewBox="0 0 24 24" className="size-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="5" y="11" width="14" height="10" rx="2" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
          </svg>
          <span className="truncate">aggiemajormatcher.tamu.edu/quiz</span>
        </div>
      </div>

      {/* Page content */}
      <div className="flex flex-1 flex-col justify-center p-6">
        <div className="mb-4 flex items-center gap-2.5">
          <TamuLogo className="size-7" />
          <div className="leading-tight">
            <p className="text-sm font-semibold">Aggie Major Matcher</p>
            <p className="text-xs text-muted-foreground">Created at Texas A&amp;M</p>
          </div>
        </div>

        {/* progress */}
        <div className="mb-1 flex justify-between text-xs text-muted-foreground">
          <span>
            Question {PREVIEW_STEP} of {QUIZ_LENGTH}
          </span>
          <span>{PREVIEW_PCT}%</span>
        </div>
        <div className="mb-5 h-2 w-full overflow-hidden rounded-full bg-muted">
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={reduce ? false : { width: 0 }}
            whileInView={{ width: `${PREVIEW_PCT}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.6, ease: EASE }}
            style={reduce ? { width: `${PREVIEW_PCT}%` } : undefined}
          />
        </div>

        <p className="mb-4 text-center text-base font-semibold">
          How accurately does each statement reflect you?
        </p>

        <div className="mb-5 flex justify-between">
          {scale.map((s, i) => (
            <motion.span
              key={s.label}
              className={`size-9 rounded-full border border-border ${s.className}`}
              initial={reduce ? false : { scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{
                type: "spring",
                stiffness: 320,
                damping: 18,
                delay: 0.7 + i * 0.08,
              }}
            />
          ))}
        </div>

        <div className="rounded-xl border border-white/40 bg-background/60 p-4 text-center text-base backdrop-blur">
          I&apos;m curious how machines work, and I learn best by building and
          tinkering with my hands.
        </div>
      </div>
    </div>
  );
}
