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
// This set spans the full College of Engineering — all 22 undergraduate
// programs, from Computer Science to Petroleum to the Engineering Technology
// and Industrial Distribution degrees. The digital dimensions (software,
// data, hardware) are kept to the minimum needed to separate Computer
// Science / Data Engineering / Computer Engineering, so the quiz isn't skewed
// toward computing; the physical, life-science, materials, energy, marine,
// environmental and systems dimensions carry the rest.
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
    tags: ["data-analysis", "data-patterns", "data-statistics", "data-ml"],
  },
  {
    id: "q-circuits",
    statement: "I like understanding how electricity, circuits, and electronic devices work.",
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
    id: "q-machines-hands",
    statement:
      "I'm curious how machines work, and I learn best by building and tinkering with my hands.",
    category: "skills",
    tags: ["hands-on", "machines-mechanical", "manufacturing", "cars-machines"],
  },
  {
    id: "q-flight",
    statement:
      "I'm drawn to flight, space, and the challenge of high-performance vehicles.",
    category: "interests",
    tags: ["aerospace-defense", "flight-space", "space-aviation"],
  },
  {
    id: "q-chemistry",
    statement: "I'm fascinated by chemistry and how substances react and transform.",
    category: "interests",
    tags: ["chemistry", "chemistry-materials", "chemical-processes", "biotech-pharma"],
  },
  {
    id: "q-materials",
    statement:
      "I'm curious how the materials around us, such as metals, polymers, and ceramics, are engineered.",
    category: "problem_areas",
    tags: ["materials-science", "materials", "materials-development"],
  },
  {
    id: "q-bio",
    statement: "I'm interested in biology, medicine, and how the human body works.",
    category: "skills",
    tags: ["biology", "human-health", "medicine-health", "healthcare-medical"],
  },
  {
    id: "q-physics",
    statement: "I like using the laws of physics and math to explain how the world behaves.",
    category: "skills",
    tags: ["physics", "math"],
  },
  {
    id: "q-structures",
    statement:
      "I'm interested in how large structures and the built environment come together.",
    category: "interests",
    tags: ["structures-buildings", "buildings-architecture", "construction-infrastructure"],
  },
  {
    id: "q-energy",
    statement: "I'm interested in how we generate, store, and deliver energy and power.",
    category: "interests",
    tags: ["energy", "power-energy", "nuclear-energy"],
  },
  {
    id: "q-resources",
    statement:
      "I'd like to work with natural energy resources like oil, gas, and what lies beneath the earth.",
    category: "career_paths",
    tags: ["oil-gas", "energy-resources"],
  },
  {
    id: "q-environment",
    statement: "I want my work to protect the environment, water, and the natural world.",
    category: "problem_areas",
    tags: ["sustainability-environment", "environment-sustainability"],
  },
  {
    id: "q-nature",
    statement:
      "I'd enjoy work connected to nature, agriculture, oceans, or the outdoors.",
    category: "career_paths",
    tags: ["agriculture-food", "nature-agriculture", "ocean-coastal", "ocean-marine", "marine-offshore"],
  },
  {
    id: "q-automation",
    statement: "I'm excited by robots, automation, and systems that run themselves.",
    category: "career_paths",
    tags: ["robotics", "robotics-automation", "automation-control"],
  },
  {
    id: "q-systems",
    statement:
      "I enjoy organizing people, processes, and logistics to make complex systems run efficiently.",
    category: "skills",
    tags: ["systems-optimization", "efficiency-systems", "business-logistics", "communication"],
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
  // Orientation axis (people/systems ↔ things/technical). Added to close the
  // coverage gap on this axis — without these, Industrial Engineering and
  // Industrial Distribution rest on a single question. The last one anchors
  // the "things" pole so disagreement is informative too.
  {
    id: "or-team",
    statement:
      "I'd rather coordinate a team and keep a project on track than do the technical work alone.",
    category: "skills",
    tags: ["communication", "systems-optimization"],
  },
  {
    id: "or-business",
    statement:
      "I'm drawn to the business, sales, and customer side of how products get made and sold.",
    category: "interests",
    tags: ["business-logistics"],
  },
  {
    id: "or-logistics",
    statement:
      "I like optimizing how people, money, and resources flow through a large operation.",
    category: "problem_areas",
    tags: ["systems-optimization", "efficiency-systems"],
  },
  {
    id: "or-solo",
    statement:
      "I'd rather go deep on one hard technical problem by myself than manage lots of moving people.",
    category: "skills",
    tags: ["problem-solving"],
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
  {
    // Fun closer #2 (question 25). Like the spirit question: no tags, no vector,
    // so it scores nothing for/against any major. Every option just says "yes".
    id: "q-dr-young",
    statement: "Dr. Young is the best professor at TAMU.",
    category: "interests",
    tags: [],
    options: [
      { value: 2, label: "Absolutely Agree" },
      { value: 1, label: "Definitely Agree" },
      { value: 0, label: "Agree" },
      { value: -1, label: "Strongly Agree" },
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
