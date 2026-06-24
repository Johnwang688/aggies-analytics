// Canonical vocabulary shared by majors.json and the questionnaire.
// Every tag a question references, and every tag a major carries, must come
// from one of the lists below so the matcher can line them up.

export type Category = "skills" | "career_paths" | "problem_areas" | "interests";

export interface Tag {
  id: string;
  label: string;
}

export const SKILLS: Tag[] = [
  { id: "programming", label: "Writing & debugging code" },
  { id: "math", label: "Advanced math (calculus, etc.)" },
  { id: "data-analysis", label: "Data analysis & statistics" },
  { id: "physics", label: "Physics" },
  { id: "chemistry", label: "Chemistry" },
  { id: "design-cad", label: "Design & CAD / drafting" },
  { id: "circuits", label: "Circuits & electronics" },
  { id: "hands-on", label: "Hands-on building & tinkering" },
  { id: "communication", label: "Communication & teamwork" },
  { id: "problem-solving", label: "General problem solving" },
];

export const CAREER_PATHS: Tag[] = [
  { id: "software-dev", label: "Software development" },
  { id: "data-ml", label: "Data science & machine learning" },
  { id: "robotics-automation", label: "Robotics & automation" },
  { id: "power-energy", label: "Power & energy" },
  { id: "aerospace-defense", label: "Aerospace & defense" },
  { id: "manufacturing", label: "Manufacturing & product design" },
  { id: "construction-infrastructure", label: "Construction & infrastructure" },
  { id: "biotech-pharma", label: "Biotech & pharmaceuticals" },
  { id: "research-academia", label: "Research & academia" },
];

export const PROBLEM_AREAS: Tag[] = [
  { id: "algorithms-software", label: "Algorithms & software" },
  { id: "data-patterns", label: "Finding patterns in data" },
  { id: "machines-mechanical", label: "Machines & mechanical systems" },
  { id: "electrical-systems", label: "Electrical & electronic systems" },
  { id: "flight-space", label: "Aircraft & spacecraft" },
  { id: "chemical-processes", label: "Chemical processes & materials" },
  { id: "structures-buildings", label: "Structures & buildings" },
  { id: "sustainability-environment", label: "Sustainability & environment" },
  { id: "automation-control", label: "Automation & control" },
];

export const INTERESTS: Tag[] = [
  { id: "technology-computers", label: "Technology & computers" },
  { id: "space-aviation", label: "Space & aviation" },
  { id: "cars-machines", label: "Cars & machines" },
  { id: "electronics-gadgets", label: "Electronics & gadgets" },
  { id: "environment-sustainability", label: "Environment & sustainability" },
  { id: "chemistry-materials", label: "Chemistry & materials" },
  { id: "buildings-architecture", label: "Buildings & architecture" },
  { id: "data-statistics", label: "Data & statistics" },
  { id: "robotics", label: "Robotics" },
  { id: "energy", label: "Energy" },
];

export const CATEGORY_TAGS: Record<Category, Tag[]> = {
  skills: SKILLS,
  career_paths: CAREER_PATHS,
  problem_areas: PROBLEM_AREAS,
  interests: INTERESTS,
};

export const CATEGORY_LABELS: Record<Category, string> = {
  skills: "Skills",
  career_paths: "Career Paths",
  problem_areas: "Problems to Solve",
  interests: "Interests",
};

// Flat id -> label lookup across every category, for rendering tags anywhere.
export const TAG_LABELS: Record<string, string> = Object.fromEntries(
  [...SKILLS, ...CAREER_PATHS, ...PROBLEM_AREAS, ...INTERESTS].map((t) => [
    t.id,
    t.label,
  ]),
);

export interface SalaryOption {
  value: number;
  label: string;
}

// Preferred *minimum* starting salary the student is aiming for.
export const SALARY_OPTIONS: SalaryOption[] = [
  { value: 0, label: "No preference" },
  { value: 60000, label: "$60k+" },
  { value: 70000, label: "$70k+" },
  { value: 80000, label: "$80k+" },
  { value: 90000, label: "$90k+" },
];

export const DEFAULT_MIN_SALARY = 0;
