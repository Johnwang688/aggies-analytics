import { cn } from "@/lib/utils";

/**
 * Texas A&M "ATM" block-letter mark on a maroon tile.
 * Drawn with uniform-width strokes so the letters stay crisp at any size.
 */
export function TamuLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 800"
      role="img"
      aria-label="Texas A&M University"
      className={cn("size-9", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="40" y="40" width="720" height="720" rx="160" fill="#500000" />
      <g
        fill="none"
        stroke="#ffffff"
        strokeWidth="44"
        strokeLinejoin="miter"
        strokeLinecap="square"
      >
        {/* A */}
        <path d="M120 540 L190 280 L260 540" />
        <path d="M150 455 L230 455" />
        {/* T */}
        <path d="M330 300 L470 300" />
        <path d="M400 300 L400 540" />
        {/* M */}
        <path d="M540 540 L540 280 L610 420 L680 280 L680 540" />
      </g>
    </svg>
  );
}
