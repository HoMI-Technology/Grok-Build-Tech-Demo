"use client";

import { Check, FolderArchive, Pencil, RotateCcw } from "lucide-react";
import * as React from "react";

import { IdeaEntry } from "@/components/idea-entry";
import { StageEditor } from "@/components/stage-editor";
import { StageStepper, type StageStatus } from "@/components/stage-stepper";
import { Button } from "@/components/ui/button";
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  clearDraft,
  emptyDraft,
  loadDraft,
  saveDraft,
  type Draft,
} from "@/lib/draft";
import { downloadMarkdown, downloadZip } from "@/lib/export";
import { STAGES, getStage, stageTemplate, type StageId } from "@/lib/stages";
import { cn } from "cn";

function computeStatuses(draft: Draft): Record<StageId, StageStatus> {
  const statuses = {} as Record<StageId, StageStatus>;
  let previousComplete = true;
  for (const stage of STAGES) {
    const hasContent = draft.contents[stage.id].trim().length > 0;
    if (hasContent) {
      statuses[stage.id] = "complete";
    } else if (previousComplete) {
      statuses[stage.id] = "unlocked";
    } else {
      statuses[stage.id] = "locked";
    }
    previousComplete = hasContent;
  }
  return statuses;
}

export function Playground() {
  const [draft, setDraft] = React.useState<Draft | null>(null);

  React.useEffect(() => {
    // localStorage is only available after mount; hydrating the draft in an
    // effect keeps the server and first client render identical.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDraft(loadDraft() ?? emptyDraft());
  }, []);

  React.useEffect(() => {
    if (draft) saveDraft(draft);
  }, [draft]);

  if (!draft) {
    return (
      <div className="flex flex-1 items-center justify-center py-24 text-sm text-muted-foreground">
        Loading draft…
      </div>
    );
  }

  if (!draft.ideaSubmitted) {
    return (
      <IdeaEntry
        onSubmit={(idea) =>
          setDraft({ ...draft, idea, ideaSubmitted: true, activeStage: "constitution" })
        }
      />
    );
  }

  const statuses = computeStatuses(draft);
  const completedCount = STAGES.filter(
    (stage) => statuses[stage.id] === "complete",
  ).length;
  const activeIndex = STAGES.findIndex((stage) => stage.id === draft.activeStage);
  const activeStage = getStage(draft.activeStage);
  const nextStage = STAGES[activeIndex + 1];
  const prevStage = STAGES[activeIndex - 1];

  const setStageContent = (id: StageId, value: string) =>
    setDraft({ ...draft, contents: { ...draft.contents, [id]: value } });

  const goTo = (id: StageId) => setDraft({ ...draft, activeStage: id });

  const resetDraft = () => {
    if (!window.confirm("Discard this draft and start over? This cannot be undone.")) {
      return;
    }
    clearDraft();
    setDraft(emptyDraft());
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-1">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Product idea
          </span>
          <div className="flex items-center gap-2">
            <h1 className="font-heading truncate text-lg font-semibold" title={draft.idea}>
              {draft.idea}
            </h1>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Edit idea"
              onClick={() => setDraft({ ...draft, ideaSubmitted: false })}
            >
              <Pencil />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={resetDraft}>
            <RotateCcw data-icon="inline-start" />
            Reset draft
          </Button>
          <Button
            size="sm"
            onClick={() => downloadZip(draft.idea, draft.contents)}
            disabled={completedCount === 0}
          >
            <FolderArchive data-icon="inline-start" />
            Export all (.zip)
          </Button>
        </div>
      </header>

      <Progress value={(completedCount / STAGES.length) * 100} className="gap-2">
        <ProgressLabel className="text-xs text-muted-foreground">
          Spec progress
        </ProgressLabel>
        <ProgressValue className="text-xs">
          {() => `${completedCount} / ${STAGES.length} stages`}
        </ProgressValue>
      </Progress>

      <StageStepper
        activeStage={draft.activeStage}
        statuses={statuses}
        onSelect={goTo}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_240px]">
        <StageEditor
          stage={activeStage}
          content={draft.contents[activeStage.id]}
          hasNext={Boolean(nextStage)}
          hasPrev={Boolean(prevStage)}
          nextUnlocked={statuses[activeStage.id] === "complete"}
          onChange={(value) => setStageContent(activeStage.id, value)}
          onInsertTemplate={() =>
            setStageContent(activeStage.id, stageTemplate(activeStage.id, draft.idea))
          }
          onDownload={() =>
            downloadMarkdown(activeStage.filename, draft.contents[activeStage.id])
          }
          onNext={() => nextStage && goTo(nextStage.id)}
          onPrev={() => prevStage && goTo(prevStage.id)}
        />

        <aside className="flex flex-col gap-3">
          <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Checklist
          </h2>
          <ol className="flex flex-col gap-1">
            {STAGES.map((stage) => {
              const status = statuses[stage.id];
              const isActive = stage.id === draft.activeStage;
              return (
                <li key={stage.id}>
                  <button
                    type="button"
                    disabled={status === "locked"}
                    onClick={() => goTo(stage.id)}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition-colors",
                      status === "locked"
                        ? "cursor-not-allowed text-muted-foreground/50"
                        : "cursor-pointer hover:bg-muted",
                      isActive && "bg-muted font-medium",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-4 shrink-0 items-center justify-center rounded-full border",
                        status === "complete"
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border",
                      )}
                    >
                      {status === "complete" && <Check className="size-3" />}
                    </span>
                    <span className="truncate">{stage.title}</span>
                    <span className="ml-auto font-mono text-[10px] text-muted-foreground">
                      {stage.filename}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
          <Separator />
          <p className="text-xs leading-relaxed text-muted-foreground">
            A stage counts as complete once it has content, which unlocks the next
            one. Your draft autosaves to this browser.
          </p>
        </aside>
      </div>
    </div>
  );
}
