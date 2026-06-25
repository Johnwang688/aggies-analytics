import { Landing } from "@/components/landing/landing";
import majorsData from "@/data/majors.json";
import { DEFAULT_ADAPTIVE } from "@/lib/adaptive";

// The quiz adaptively serves up to perRound × maxRounds scored questions, so
// that's how many a student actually answers (the fun closers don't count).
const QUESTION_COUNT = DEFAULT_ADAPTIVE.perRound * DEFAULT_ADAPTIVE.maxRounds;

export default function Home() {
  return (
    <Landing questionCount={QUESTION_COUNT} majorCount={majorsData.length} />
  );
}
