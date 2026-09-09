"use client";

import { Check, Lock } from "lucide-react";

import { STAGES, type StageId } from "@/lib/stages";
import { cn } from "cn";

export type StageStatus = "locked" | "unlocked" | "complete";

interface StageStepperProps {
  activeStage: StageId;
  statuses: Record<StageId, StageStatus>;
  onSelect: (id: StageId) => void;
}

export function StageStepper({ activeStage, statuses, onSelect }: StageStepperProps) {
  return (
    <nav aria-label="Spec stages" className="w-full overflow-x-auto">
      <ol className="flex min-w-max items-start gap-0">
        {STAGES.map((stage, index) => {
          const status = statuses[stage.id];
          const isActive = stage.id === activeStage;
          const isLocked = status === "locked";
          return (
            <li key={stage.id} className="flex items-start">
              {index > 0 && (
                <div
                  aria-hidden
                  className={cn(
                    "mx-1 mt-4 h-px w-6 sm:w-10",
                    status === "locked" ? "bg-border" : "bg-primary/40",
                  )}
                />
              )}
              <button
                type="button"
                disabled={isLocked}
                onClick={() => onSelect(stage.id)}
                aria-current={isActive ? "step" : undefined}
                className={cn(
                  "group flex w-20 flex-col items-center gap-1.5 rounded-lg px-1 py-1 text-center outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-24",
                  isLocked ? "cursor-not-allowed opacity-50" : "cursor-pointer",
                )}
              >
                <span
                  className={cn(
                    "flex size-8 items-center justify-center rounded-full border text-xs font-semibold transition-colors",
                    status === "complete" &&
                      "border-primary bg-primary text-primary-foreground",
                    status === "unlocked" &&
                      !isActive &&
                      "border-foreground/25 bg-background text-foreground",
                    status === "unlocked" &&
                      isActive &&
                      "border-primary bg-background text-primary ring-2 ring-primary/30",
                    status === "locked" && "border-border bg-muted text-muted-foreground",
                    status === "complete" && isActive && "ring-2 ring-primary/30",
                  )}
                >
                  {status === "complete" ? (
                    <Check className="size-4" />
                  ) : status === "locked" ? (
                    <Lock className="size-3.5" />
                  ) : (
                    index + 1
                  )}
                </span>
                <span
                  className={cn(
                    "text-xs font-medium",
                    isActive ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {stage.title}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
