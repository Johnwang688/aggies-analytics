import type { Question } from "./types";

// ---------------------------------------------------------------------------
// LIVE_QUESTIONS — the real student-facing quiz (20 questions).
//
// Every question probes a broad *underlying dimension* of an engineer's
// interests and aptitudes rather than naming a major or its products. No
// single answer points at one major — it's the student's *pattern* across
// these dimensions that triangulates the best fit; several majors share any
// given dimension, and the combination is what separates them.
//
// The digital dimensions (data, software, hardware) are intentionally kept to
// the minimum needed to separate Computer Science / Data Engineering /
// Computer Engineering from one another, so the question set isn't skewed
// toward computing. The physical, structural, materials, energy and
// environmental dimensions carry the bulk of the quiz.
//
// A few tags (hardware-systems, embedded-systems, electronics) are the
// non-canonical tags Computer Engineering carries in majors.json, included so
// the hardware dimension can reach it.
// ---------------------------------------------------------------------------
export const LIVE_QUESTIONS: Question[] = [
  {
    id: "q-software",
    statement: "I enjoy working with computers, software, and technology.",
    category: "interests",
    tags: ["programming", "algorithms-software", "software-dev", "technology-computers"],
  },
  {
    id: "q-data",
    statement: "I'm drawn to finding patterns and meaning in data and information.",
    category: "problem_areas",
    tags: ["data-analysis", "data-patterns", "data-statistics"],
  },
  {
    id: "q-circuits",
    statement: "I like understanding how electricity and electronic devices work.",
    category: "problem_areas",
    tags: ["circuits", "electrical-systems", "electronics-gadgets", "electronics"],
  },
  {
    id: "q-hardware",
    statement:
      "I'm interested in the hardware and embedded systems that bring devices to life.",
    category: "career_paths",
    tags: ["hardware-systems", "embedded-systems", "hardware-dev", "electronics"],
  },
  {
    id: "q-build-hands",
    statement: "I learn best by building, testing, and working with my hands.",
    category: "skills",
    tags: ["hands-on", "machines-mechanical", "manufacturing"],
  },
  {
    id: "q-machines",
    statement: "I'm curious about how machines and moving parts actually work.",
    category: "interests",
    tags: ["machines-mechanical", "cars-machines", "robotics-automation"],
  },
  {
    id: "q-motion",
    statement:
      "I'm drawn to vehicles and the challenge of motion, flight, and transportation.",
    category: "interests",
    tags: ["aerospace-defense", "flight-space", "space-aviation", "cars-machines"],
  },
  {
    id: "q-materials",
    statement: "I'm fascinated by materials and how substances react and transform.",
    category: "interests",
    tags: ["chemistry", "chemistry-materials", "chemical-processes", "biotech-pharma"],
  },
  {
    id: "q-physics",
    statement: "I like using the laws of physics to explain how the world behaves.",
    category: "skills",
    tags: ["physics", "math"],
  },
  {
    id: "q-natural",
    statement: "I enjoy understanding how the natural and physical world works.",
    category: "problem_areas",
    tags: ["physics", "chemistry", "chemistry-materials"],
  },
  {
    id: "q-structures",
    statement:
      "I'm interested in how large structures and the built environment come together.",
    category: "interests",
    tags: ["structures-buildings", "buildings-architecture", "construction-infrastructure"],
  },
  {
    id: "q-tangible",
    statement: "I want my work to produce large, tangible things that people rely on.",
    category: "career_paths",
    tags: ["construction-infrastructure", "structures-buildings", "manufacturing"],
  },
  {
    id: "q-energy",
    statement: "I'm interested in how we generate, store, and use energy.",
    category: "interests",
    tags: ["energy", "power-energy"],
  },
  {
    id: "q-environment",
    statement: "I want my work to protect the environment and support sustainability.",
    category: "problem_areas",
    tags: ["sustainability-environment", "environment-sustainability"],
  },
  {
    id: "q-outdoors",
    statement: "I'd enjoy work that takes me outdoors and connects me with nature.",
    category: "career_paths",
    tags: ["environment-sustainability", "sustainability-environment", "construction-infrastructure"],
  },
  {
    id: "q-automation",
    statement: "I'm excited by robots, automation, and systems that run themselves.",
    category: "career_paths",
    tags: ["robotics", "robotics-automation", "automation-control"],
  },
  {
    id: "q-teamwork",
    statement: "I enjoy collaborating and communicating closely with a team.",
    category: "skills",
    tags: ["communication"],
  },
  {
    id: "q-design",
    statement: "I like designing and visualizing ideas before they're built.",
    category: "skills",
    tags: ["design-cad"],
  },
  {
    id: "q-research",
    statement:
      "I'm motivated by research, discovery, and pushing the limits of what's possible.",
    category: "career_paths",
    tags: ["research-academia"],
  },
  {
    // Aggie spirit closer — purely for fun. No tags, so the matcher skips it
    // and it scores nothing for/against any major regardless of the answer.
    // Every option just says "yes"; the underlying values are distinct only so
    // the radio buttons stay individually selectable.
    id: "q-tamu-spirit",
    statement: "TAMU is the best university.",
    category: "interests",
    tags: [],
    options: [
      { value: 2, label: "Strongly Agree" },
      { value: 1, label: "Agree" },
      { value: 0, label: "Absolutely Agree" },
      { value: -1, label: "Definitely Agree" },
      { value: -2, label: "100% Agree" },
    ],
  },
];

// ---------------------------------------------------------------------------
// PROPOSED_QUESTIONS — the REAL drafted set, pending approval on /review.
// Once signed off, swap this in for LIVE_QUESTIONS on the home page.
// ---------------------------------------------------------------------------
export const PROPOSED_QUESTIONS: Question[] = [
  // Skills
  {
    id: "sk-code",
    statement: "I enjoy writing and debugging computer code.",
    category: "skills",
    tags: ["programming"],
  },
  {
    id: "sk-math",
    statement:
      "I'm comfortable with advanced math like calculus and differential equations.",
    category: "skills",
    tags: ["math"],
  },
  {
    id: "sk-data",
    statement: "I like analyzing data sets to find patterns and draw conclusions.",
    category: "skills",
    tags: ["data-analysis"],
  },
  {
    id: "sk-hands-on",
    statement: "I enjoy building, fixing, or tinkering with physical things by hand.",
    category: "skills",
    tags: ["hands-on"],
  },
  {
    id: "sk-chem",
    statement: "I'm good at understanding chemical reactions and materials.",
    category: "skills",
    tags: ["chemistry"],
  },
  {
    id: "sk-cad",
    statement: "I like designing things with CAD or technical drawing tools.",
    category: "skills",
    tags: ["design-cad"],
  },
  // Career paths
  {
    id: "cp-software",
    statement: "I want a career creating software, apps, or websites.",
    category: "career_paths",
    tags: ["software-dev"],
  },
  {
    id: "cp-machines",
    statement: "I'd like to design machines, vehicles, or mechanical systems.",
    category: "career_paths",
    tags: ["robotics-automation", "manufacturing"],
  },
  {
    id: "cp-aero",
    statement: "I'm drawn to working on aircraft, rockets, or space systems.",
    category: "career_paths",
    tags: ["aerospace-defense"],
  },
  {
    id: "cp-infra",
    statement: "I want to help design buildings, bridges, or public infrastructure.",
    category: "career_paths",
    tags: ["construction-infrastructure"],
  },
  {
    id: "cp-energy",
    statement: "I'm interested in working with power, energy, or electrical grids.",
    category: "career_paths",
    tags: ["power-energy"],
  },
  {
    id: "cp-biotech",
    statement: "I'd like to work in biotech, pharmaceuticals, or chemical production.",
    category: "career_paths",
    tags: ["biotech-pharma"],
  },
  // Problems to solve
  {
    id: "pr-algorithms",
    statement: "I'd enjoy solving problems by writing algorithms or programs.",
    category: "problem_areas",
    tags: ["algorithms-software"],
  },
  {
    id: "pr-mechanical",
    statement: "I like figuring out how to make machines move and work efficiently.",
    category: "problem_areas",
    tags: ["machines-mechanical"],
  },
  {
    id: "pr-electrical",
    statement: "I want to solve problems involving electricity, circuits, and electronics.",
    category: "problem_areas",
    tags: ["electrical-systems"],
  },
  {
    id: "pr-sustain",
    statement: "I'm motivated by environmental and sustainability challenges.",
    category: "problem_areas",
    tags: ["sustainability-environment"],
  },
  // Interests
  {
    id: "in-tech",
    statement: "I'm passionate about computers and new technology.",
    category: "interests",
    tags: ["technology-computers"],
  },
  {
    id: "in-space",
    statement: "Space exploration and aviation excite me.",
    category: "interests",
    tags: ["space-aviation"],
  },
  {
    id: "in-cars",
    statement: "I love cars, engines, and how machines are built.",
    category: "interests",
    tags: ["cars-machines"],
  },
  {
    id: "in-buildings",
    statement: "I'm interested in architecture and how buildings are designed.",
    category: "interests",
    tags: ["buildings-architecture"],
  },
];
