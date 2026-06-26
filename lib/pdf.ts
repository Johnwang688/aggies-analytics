import { jsPDF } from "jspdf";

import {
  CATEGORY_LABELS,
  type Category,
} from "./questionnaire";
import {
  LIKERT_OPTIONS,
  type Answers,
  type Question,
} from "./types";
import {
  majorExplanation,
  type ExplanationClause,
  type RankedMajor,
} from "./vectors";

// ---------------------------------------------------------------------------
// PDF EXPORT — turns a finished quiz into a 3-page report:
//   1. The three best-fit majors, each with the natural-language "why"
//   2. The full ranking of every major, with match-strength bars
//   3. The student's answers to every question, grouped by category
//
// Everything runs in the browser (jsPDF is client-only); the quiz never leaves
// the device, so we build straight from the in-memory results + answers.
// ---------------------------------------------------------------------------

// Texas A&M brand fonts, embedded so the PDF matches the web app:
//   Open Sans — body copy;  Oswald — headings/titles.
// The TTFs are self-hosted under /public/fonts, so generating a PDF never
// reaches out to a third party (the quiz stays on-device).
const SANS = "OpenSans";
const HEAD = "Oswald";

const FONT_FILES = {
  "OpenSans-Regular.ttf": {
    url: "/fonts/open-sans-v44-latin-regular.ttf",
    family: SANS,
    style: "normal",
  },
  "OpenSans-Bold.ttf": {
    url: "/fonts/open-sans-v44-latin-700.ttf",
    family: SANS,
    style: "bold",
  },
  "Oswald-SemiBold.ttf": {
    url: "/fonts/oswald-v57-latin-600.ttf",
    family: HEAD,
    style: "normal",
  },
} as const;

// Base64-encoded TTFs, fetched once and reused across exports.
let fontCache: Record<string, string> | null = null;

function toBase64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let binary = "";
  const CHUNK = 0x8000; // chunk to stay within String.fromCharCode arg limits
  for (let i = 0; i < bytes.length; i += CHUNK) {
    binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  }
  return btoa(binary);
}

async function loadFonts(): Promise<Record<string, string>> {
  if (fontCache) return fontCache;
  const entries = await Promise.all(
    Object.entries(FONT_FILES).map(async ([vfsName, { url }]) => {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to load font ${url}`);
      return [vfsName, toBase64(await res.arrayBuffer())] as const;
    }),
  );
  fontCache = Object.fromEntries(entries);
  return fontCache;
}

// Register the embedded TTFs onto a jsPDF instance (VFS is per-document).
function registerFonts(doc: jsPDF, fonts: Record<string, string>) {
  for (const [vfsName, { family, style }] of Object.entries(FONT_FILES)) {
    doc.addFileToVFS(vfsName, fonts[vfsName]);
    doc.addFont(vfsName, family, style);
  }
}

// Aggie Maroon (#500000) — the brand primary, reused from globals.css.
const MAROON: [number, number, number] = [80, 0, 0];
const INK: [number, number, number] = [30, 25, 25];
const MUTED: [number, number, number] = [120, 110, 110];
const HAIRLINE: [number, number, number] = [225, 218, 218];
const BAR_TRACK: [number, number, number] = [235, 230, 230];

const PAGE_W = 210; // A4 portrait, millimetres
const PAGE_H = 297;
const MARGIN = 18;
const CONTENT_W = PAGE_W - MARGIN * 2;

const CATEGORY_ORDER: Category[] = [
  "skills",
  "career_paths",
  "problem_areas",
  "interests",
];

// Join a list into prose: ["a"] -> "a", ["a","b"] -> "a and b",
// ["a","b","c"] -> "a, b, and c".
function joinProse(items: string[]): string {
  if (items.length <= 1) return items.join("");
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

// Flatten the explanation clauses into the same sentence the results card
// renders, e.g. "Computer Science matches your interest in Software and AI,
// and your skills in Programming."
function whySentence(majorName: string, clauses: ExplanationClause[]): string {
  if (clauses.length === 0) return "";
  const parts = clauses.map(
    (cl) => `your ${cl.noun} ${joinProse(cl.topics)}${cl.suffix}`,
  );
  return `${majorName} matches ${joinProse(parts)}.`;
}

function answerLabel(q: Question, value: number | undefined): string {
  if (value === undefined) return "Not answered";
  const opts = q.options ?? LIKERT_OPTIONS;
  return opts.find((o) => o.value === value)?.label ?? "—";
}

export async function generateResultsPdf(
  results: RankedMajor[],
  answers: Answers,
  answered: Question[],
): Promise<void> {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  registerFonts(doc, await loadFonts());
  let y = MARGIN;

  const setColor = (c: [number, number, number]) =>
    doc.setTextColor(c[0], c[1], c[2]);

  // Move down, breaking to a fresh page (re-running the banner) if `needed`
  // millimetres won't fit before the bottom margin.
  const ensure = (needed: number) => {
    if (y + needed > PAGE_H - MARGIN) {
      doc.addPage();
      y = MARGIN;
      return true;
    }
    return false;
  };

  // Maroon banner + page title; returns with the cursor below it.
  const pageHeader = (title: string, subtitle?: string) => {
    doc.setFillColor(...MAROON);
    doc.rect(0, 0, PAGE_W, 4, "F");
    y = MARGIN;
    setColor(MAROON);
    doc.setFont(HEAD, "normal");
    doc.setFontSize(9);
    doc.text("AGGIE ENGINEERING MATCHER", MARGIN, y);
    y += 8;
    setColor(INK);
    doc.setFont(HEAD, "normal");
    doc.setFontSize(20);
    doc.text(title, MARGIN, y);
    y += 7;
    if (subtitle) {
      setColor(MUTED);
      doc.setFont(SANS, "normal");
      doc.setFontSize(10);
      const lines = doc.splitTextToSize(subtitle, CONTENT_W);
      doc.text(lines, MARGIN, y);
      y += lines.length * 5;
    }
    y += 4;
  };

  // Wrapped paragraph helper. Returns the new cursor position.
  const paragraph = (
    text: string,
    opts: {
      size?: number;
      color?: [number, number, number];
      style?: "normal" | "bold" | "italic";
      x?: number;
      width?: number;
      lineH?: number;
    } = {},
  ) => {
    const {
      size = 10,
      color = INK,
      style = "normal",
      x = MARGIN,
      width = CONTENT_W,
      lineH = 5,
    } = opts;
    doc.setFont(SANS, style);
    doc.setFontSize(size);
    setColor(color);
    const lines = doc.splitTextToSize(text, width);
    for (const line of lines) {
      ensure(lineH);
      doc.text(line, x, y);
      y += lineH;
    }
  };

  // ---- PAGE 1 — top 3 matches + why ---------------------------------------
  const top = results.slice(0, 3);
  pageHeader(
    "Your best-fit majors",
    "Based on your answers, these three Texas A&M engineering majors fit you best — and here's why each one rose to the top.",
  );

  top.forEach((r, i) => {
    const clauses = majorExplanation(r.major, answers, answered);
    const why = whySentence(r.major.name, clauses);

    // Estimate card height so the whole card stays on one page.
    doc.setFontSize(10);
    const whyLines = why ? doc.splitTextToSize(why, CONTENT_W - 12).length : 0;
    const descLines = doc.splitTextToSize(
      r.major.description,
      CONTENT_W - 12,
    ).length;
    const cardH = 22 + whyLines * 5 + descLines * 5 + 10;
    ensure(cardH + 4);

    const cardTop = y;
    doc.setDrawColor(...HAIRLINE);
    doc.setFillColor(252, 250, 250);
    doc.roundedRect(MARGIN, cardTop, CONTENT_W, cardH, 2.5, 2.5, "FD");

    const innerX = MARGIN + 6;
    y = cardTop + 9;

    // Rank + name
    setColor(MUTED);
    doc.setFont(SANS, "bold");
    doc.setFontSize(12);
    doc.text(`#${i + 1}`, innerX, y);
    setColor(INK);
    doc.setFontSize(13);
    doc.text(r.major.name, innerX + 10, y);

    // Match badge, right-aligned
    const pct = `${r.score ?? 0}% match`;
    doc.setFontSize(10);
    doc.setFont(SANS, "bold");
    const badgeW = doc.getTextWidth(pct) + 8;
    const badgeX = MARGIN + CONTENT_W - 6 - badgeW;
    doc.setFillColor(...MAROON);
    doc.roundedRect(badgeX, y - 5, badgeW, 7, 1.5, 1.5, "F");
    setColor([255, 255, 255]);
    doc.text(pct, badgeX + 4, y);

    y += 8;

    if (why) {
      paragraph(why, { x: innerX, width: CONTENT_W - 12, color: INK });
      y += 1;
    }
    paragraph(r.major.description, {
      x: innerX,
      width: CONTENT_W - 12,
      color: MUTED,
      size: 9,
    });
    y += 1;
    paragraph(`Median salary: $${r.major.salary.toLocaleString()}`, {
      x: innerX,
      width: CONTENT_W - 12,
      color: MUTED,
      size: 9,
      style: "bold",
    });

    y = cardTop + cardH + 6;
  });

  // ---- PAGE 2 — full ranking breakdown ------------------------------------
  doc.addPage();
  pageHeader(
    "Full ranking breakdown",
    `How all ${results.length} engineering majors scored against your answers, strongest match first.`,
  );

  const rowH = 9;
  const numW = 8;
  const pctW = 14;
  const barW = 46;
  const barX = MARGIN + CONTENT_W - pctW - barW - 4;
  const nameX = MARGIN + numW + 2;
  const nameW = barX - nameX - 4;

  results.forEach((r, i) => {
    ensure(rowH);
    const rowMid = y + 1;
    const score = r.score ?? 0;

    setColor(MUTED);
    doc.setFont(SANS, "normal");
    doc.setFontSize(9);
    doc.text(`${i + 1}`, MARGIN + numW - 2, rowMid, { align: "right" });

    setColor(INK);
    doc.setFontSize(10);
    const name = doc.splitTextToSize(r.major.name, nameW)[0];
    doc.text(name, nameX, rowMid);

    // Match-strength bar
    doc.setFillColor(...BAR_TRACK);
    doc.roundedRect(barX, rowMid - 2.6, barW, 2.6, 1.3, 1.3, "F");
    if (score > 0) {
      doc.setFillColor(...MAROON);
      doc.roundedRect(
        barX,
        rowMid - 2.6,
        Math.max(1.4, (barW * score) / 100),
        2.6,
        1.3,
        1.3,
        "F",
      );
    }

    setColor(MUTED);
    doc.setFont(SANS, "bold");
    doc.setFontSize(9);
    doc.text(`${score}%`, MARGIN + CONTENT_W, rowMid, { align: "right" });

    y += rowH;
    if (i < results.length - 1) {
      doc.setDrawColor(...HAIRLINE);
      doc.line(MARGIN, y - 4, MARGIN + CONTENT_W, y - 4);
    }
  });

  // ---- PAGE 3 — the student's answers -------------------------------------
  doc.addPage();
  pageHeader(
    "Your answers",
    "Every question you answered, grouped by category.",
  );

  // Only the scored questions carry a category we group by; fun closers have
  // none of these, so they naturally fall out.
  for (const category of CATEGORY_ORDER) {
    const group = answered.filter((q) => q.category === category);
    if (group.length === 0) continue;

    ensure(14);
    setColor(MAROON);
    doc.setFont(HEAD, "normal");
    doc.setFontSize(11);
    doc.text(CATEGORY_LABELS[category].toUpperCase(), MARGIN, y);
    y += 6;

    for (const q of group) {
      const value = answers[q.id];
      const label = answerLabel(q, value);
      doc.setFontSize(10);
      const stmtLines = doc.splitTextToSize(q.statement, CONTENT_W);
      ensure(stmtLines.length * 5 + 6);

      setColor(INK);
      doc.setFont(SANS, "normal");
      doc.text(stmtLines, MARGIN, y);
      y += stmtLines.length * 5;

      // Answer chip
      doc.setFont(SANS, "bold");
      doc.setFontSize(9);
      const chipW = doc.getTextWidth(label) + 7;
      doc.setDrawColor(...HAIRLINE);
      doc.setFillColor(248, 245, 245);
      doc.roundedRect(MARGIN, y - 3.6, chipW, 6, 1.5, 1.5, "FD");
      setColor(value === undefined ? MUTED : MAROON);
      doc.text(label, MARGIN + 3.5, y);
      y += 8;
    }
    y += 2;
  }

  // ---- Footers on every page ----------------------------------------------
  const pageCount = doc.getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    setColor(MUTED);
    doc.setFont(SANS, "normal");
    doc.setFontSize(8);
    doc.text(
      "Texas A&M University · Aggie Engineering Matcher",
      MARGIN,
      PAGE_H - 10,
    );
    doc.text(`Page ${p} of ${pageCount}`, PAGE_W - MARGIN, PAGE_H - 10, {
      align: "right",
    });
  }

  doc.save("aggie-engineering-matcher-results.pdf");
}
