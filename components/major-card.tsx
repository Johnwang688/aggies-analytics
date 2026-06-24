import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CATEGORY_LABELS } from "@/lib/questionnaire";
import type { MajorMatch } from "@/lib/types";

interface MajorCardProps {
  match: MajorMatch;
  rank: number;
}

function scoreTone(score: number): string {
  if (score >= 70) return "bg-primary text-primary-foreground";
  if (score >= 40) return "bg-secondary text-secondary-foreground";
  return "bg-muted text-muted-foreground";
}

// The categories that pulled this major up — highest positive contribution
// relative to what each category could have added. Explains the score.
function strengths(match: MajorMatch): string[] {
  return match.breakdown
    .filter((b) => b.possible > 0 && b.contribution > 0)
    .sort((a, b) => b.contribution / b.possible - a.contribution / a.possible)
    .slice(0, 2)
    .map((b) => CATEGORY_LABELS[b.category]);
}

export function MajorCard({ match, rank }: MajorCardProps) {
  const { major, score } = match;
  const fitAreas = strengths(match);
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <span className="text-muted-foreground tabular-nums">#{rank}</span>
            {major.name}
          </CardTitle>
          <Badge className={scoreTone(score)}>{score}% match</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <Progress value={score} aria-label={`${score}% match`} />
        {fitAreas.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-muted-foreground">Strong fit:</span>
            {fitAreas.map((area) => (
              <Badge key={area} variant="secondary">
                {area}
              </Badge>
            ))}
          </div>
        )}
        <p className="text-sm text-muted-foreground">{major.description}</p>
        <p className="text-xs text-muted-foreground">
          Typical starting salary:{" "}
          <span className="font-medium text-foreground">
            ${major.salary.toLocaleString()}
          </span>
        </p>
      </CardContent>
    </Card>
  );
}
