"use client";

import { ArrowLeft, ArrowRight, Download, FileText, WandSparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import type { StageDefinition } from "@/lib/stages";

interface StageEditorProps {
  stage: StageDefinition;
  content: string;
  hasNext: boolean;
  hasPrev: boolean;
  nextUnlocked: boolean;
  onChange: (value: string) => void;
  onInsertTemplate: () => void;
  onDownload: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export function StageEditor({
  stage,
  content,
  hasNext,
  hasPrev,
  nextUnlocked,
  onChange,
  onInsertTemplate,
  onDownload,
  onNext,
  onPrev,
}: StageEditorProps) {
  const isEmpty = content.trim().length === 0;
  const wordCount = isEmpty ? 0 : content.trim().split(/\s+/).length;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {stage.title}
          <Badge variant="outline" className="font-mono text-[10px]">
            {stage.command}
          </Badge>
        </CardTitle>
        <CardDescription>{stage.description}</CardDescription>
        <CardAction>
          <div className="flex items-center gap-1.5">
            <Button variant="outline" size="sm" onClick={onInsertTemplate}>
              <WandSparkles data-icon="inline-start" />
              {isEmpty ? "Start from template" : "Reset to template"}
            </Button>
            <Button variant="outline" size="sm" onClick={onDownload} disabled={isEmpty}>
              <Download data-icon="inline-start" />
              {stage.filename}
            </Button>
          </div>
        </CardAction>
      </CardHeader>
      <CardContent>
        {isEmpty && (
          <button
            type="button"
            onClick={onInsertTemplate}
            className="mb-3 flex w-full cursor-pointer items-center gap-3 rounded-lg border border-dashed p-4 text-left text-sm text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
          >
            <FileText className="size-5 shrink-0" />
            <span>
              This stage is empty. Insert the Spec-Kit-inspired{" "}
              <span className="font-medium">{stage.title.toLowerCase()} template</span>{" "}
              and edit it, or write your own markdown below.
            </span>
          </button>
        )}
        <Textarea
          value={content}
          onChange={(event) => onChange(event.target.value)}
          placeholder={`Write ${stage.filename} in markdown…`}
          spellCheck={false}
          className="min-h-[420px] resize-y font-mono text-[13px] leading-relaxed"
          aria-label={`${stage.title} markdown`}
        />
      </CardContent>
      <CardFooter className="justify-between gap-2">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onPrev} disabled={!hasPrev}>
            <ArrowLeft data-icon="inline-start" />
            Previous
          </Button>
          <span className="text-xs text-muted-foreground tabular-nums">
            {wordCount} {wordCount === 1 ? "word" : "words"}
          </span>
        </div>
        {hasNext && (
          <Button size="sm" onClick={onNext} disabled={!nextUnlocked}>
            {nextUnlocked ? "Next stage" : "Add content to unlock"}
            <ArrowRight data-icon="inline-end" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
