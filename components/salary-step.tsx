"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SALARY_OPTIONS } from "@/lib/questionnaire";
import { cn } from "@/lib/utils";

interface SalaryStepProps {
  value: number;
  onChange: (value: number) => void;
}

export function SalaryStep({ value, onChange }: SalaryStepProps) {
  return (
    <RadioGroup
      value={value}
      onValueChange={(v) => onChange(Number(v))}
      className="grid gap-2"
    >
      {SALARY_OPTIONS.map((opt) => {
        const selected = value === opt.value;
        return (
          <label
            key={opt.value}
            className={cn(
              "flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm transition-colors",
              selected
                ? "border-primary bg-primary/5 text-foreground"
                : "border-border text-muted-foreground hover:bg-muted",
            )}
          >
            <RadioGroupItem value={opt.value} id={`salary-${opt.value}`} />
            <span className="font-medium">{opt.label}</span>
          </label>
        );
      })}
    </RadioGroup>
  );
}
