"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  LIKERT_OPTIONS,
  type LikertOption,
  type LikertValue,
} from "@/lib/types";
import { cn } from "@/lib/utils";

interface LikertQuestionProps {
  id: string;
  statement: string;
  value?: LikertValue;
  onChange?: (value: LikertValue) => void;
  /** Custom answer choices; defaults to the standard 5-point Likert scale. */
  options?: LikertOption[];
  /** Read-only preview (used on the review page). */
  readOnly?: boolean;
}

export function LikertQuestion({
  id,
  statement,
  value,
  onChange,
  options = LIKERT_OPTIONS,
  readOnly = false,
}: LikertQuestionProps) {
  return (
    <fieldset className="rounded-lg border border-border bg-card p-6 sm:p-10">
      <legend className="sr-only">{statement}</legend>
      <p className="mb-6 text-lg font-medium text-card-foreground sm:mb-8 sm:text-2xl">
        {statement}
      </p>
      <RadioGroup
        value={value ?? null}
        onValueChange={(v) => onChange?.(Number(v) as LikertValue)}
        disabled={readOnly}
        className="grid grid-cols-1 gap-3 sm:grid-cols-5"
      >
        {options.map((opt) => {
          const selected = value === opt.value;
          return (
            <label
              key={opt.value}
              className={cn(
                "flex cursor-pointer items-center gap-2.5 rounded-md border p-4 text-sm transition-colors sm:flex-col sm:gap-2 sm:p-5 sm:text-center sm:text-sm",
                selected
                  ? "border-primary bg-primary/10 font-semibold text-foreground ring-1 ring-primary"
                  : "border-border text-muted-foreground hover:bg-muted hover:text-foreground",
                readOnly && "cursor-default hover:bg-transparent hover:text-muted-foreground",
              )}
            >
              <RadioGroupItem value={opt.value} id={`${id}-${opt.value}`} />
              <span className="leading-tight">{opt.label}</span>
            </label>
          );
        })}
      </RadioGroup>
    </fieldset>
  );
}
