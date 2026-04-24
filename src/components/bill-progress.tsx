import { Check } from "lucide-react";
import { STAGES, stageIndex, type BillStage } from "@/lib/stages";
import { cn } from "@/lib/utils";

export function BillProgress({
  stage,
  size = "md",
  showLabels = true,
}: {
  stage: BillStage;
  size?: "sm" | "md";
  showLabels?: boolean;
}) {
  const currentIdx = stageIndex(stage);
  const total = STAGES.length;
  // Fill stops at the current marker (proportional position).
  const fillPct = total === 1 ? 0 : (currentIdx / (total - 1)) * 100;
  const isLaw = stage === "law";

  const dot = size === "sm" ? "h-2.5 w-2.5" : "h-3 w-3";
  const dotDone = size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5";
  const dotCurrent = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";

  return (
    <div className="w-full" aria-label={`Progress: ${STAGES[currentIdx]?.label}`}>
      <div className="relative">
        {/* Track */}
        <div
          className={cn(
            "absolute left-0 right-0 top-1/2 -translate-y-1/2 rounded-full bg-border",
            size === "sm" ? "h-1" : "h-1.5",
          )}
        />
        {/* Fill */}
        <div
          className={cn(
            "absolute left-0 top-1/2 -translate-y-1/2 rounded-full transition-all",
            isLaw ? "bg-success" : "bg-gold",
            size === "sm" ? "h-1" : "h-1.5",
          )}
          style={{ width: `${fillPct}%` }}
        />

        {/* Markers */}
        <ol className="relative flex items-center justify-between">
          {STAGES.map((s, i) => {
            const done = i < currentIdx;
            const current = i === currentIdx;
            return (
              <li key={s.key} className="relative z-10 flex flex-col items-center">
                <span
                  className={cn(
                    "flex items-center justify-center rounded-full border-2 transition-colors",
                    done && "border-gold bg-gold text-gold-foreground",
                    current && !isLaw && "border-gold bg-card text-gold ring-4 ring-gold/20",
                    current && isLaw && "border-success bg-success text-success-foreground ring-4 ring-success/20",
                    !done && !current && "border-border bg-card",
                    done ? dotDone : current ? dotCurrent : dot,
                  )}
                >
                  {done && <Check className="h-2.5 w-2.5" strokeWidth={3} />}
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      {showLabels && (
        <ol className="mt-2 flex items-start justify-between text-[10px] uppercase tracking-wider">
          {STAGES.map((s, i) => {
            const done = i < currentIdx;
            const current = i === currentIdx;
            return (
              <li
                key={s.key}
                className={cn(
                  "flex-1 text-center",
                  current
                    ? "font-semibold text-foreground"
                    : done
                      ? "text-muted-foreground"
                      : "text-muted-foreground/60",
                )}
              >
                <span className="hidden sm:inline">{s.short}</span>
                <span className="sm:hidden">{i + 1}</span>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
