"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const STARTER_IDEAS = [
  "A pomodoro timer that plants a virtual tree for every finished session",
  "A recipe box that scales ingredients to the pans I actually own",
  "A team photo album that auto-groups shots by event and face",
  "A CLI that turns any CSV into a shareable mini dashboard",
];

interface IdeaEntryProps {
  onSubmit: (idea: string) => void;
}

export function IdeaEntry({ onSubmit }: IdeaEntryProps) {
  const [idea, setIdea] = React.useState("");
  const canSubmit = idea.trim().length > 0;

  const submit = (value: string) => {
    if (!value.trim()) return;
    onSubmit(value.trim());
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-8 px-4 py-16">
      <div className="flex flex-col items-center gap-3 text-center">
        <Badge variant="secondary" className="gap-1.5">
          <Sparkles className="size-3" />
          Spec-Driven Development playground
        </Badge>
        <h1 className="font-heading text-4xl font-semibold tracking-tight text-balance">
          Spec first. Code later.
        </h1>
        <p className="max-w-md text-sm text-muted-foreground text-balance">
          Walk a product idea through the five Spec Kit stages — Constitution,
          Specify, Clarify, Plan, Tasks — and export the markdown artifacts.
        </p>
      </div>

      <form
        className="flex w-full gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          submit(idea);
        }}
      >
        <Input
          autoFocus
          value={idea}
          onChange={(event) => setIdea(event.target.value)}
          placeholder="Describe your product idea in one sentence…"
          aria-label="Product idea"
        />
        <Button type="submit" disabled={!canSubmit}>
          Start
          <ArrowRight data-icon="inline-end" />
        </Button>
      </form>

      <div className="flex flex-col items-center gap-3">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          or try a starter idea
        </span>
        <div className="flex flex-wrap justify-center gap-2">
          {STARTER_IDEAS.map((starter) => (
            <button
              key={starter}
              type="button"
              onClick={() => submit(starter)}
              className="rounded-full border bg-background px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
            >
              {starter}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
