import { STAGE_IDS, type StageId } from "@/lib/stages";

export interface Draft {
  idea: string;
  ideaSubmitted: boolean;
  contents: Record<StageId, string>;
  activeStage: StageId;
}

const STORAGE_KEY = "spec-kit-playground-draft-v1";

export function emptyContents(): Record<StageId, string> {
  return {
    constitution: "",
    specify: "",
    clarify: "",
    plan: "",
    tasks: "",
  };
}

export function emptyDraft(): Draft {
  return {
    idea: "",
    ideaSubmitted: false,
    contents: emptyContents(),
    activeStage: "constitution",
  };
}

export function loadDraft(): Draft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Draft>;
    const base = emptyDraft();
    const contents = emptyContents();
    for (const id of STAGE_IDS) {
      const value = parsed.contents?.[id];
      if (typeof value === "string") contents[id] = value;
    }
    return {
      idea: typeof parsed.idea === "string" ? parsed.idea : base.idea,
      ideaSubmitted: parsed.ideaSubmitted === true,
      contents,
      activeStage: STAGE_IDS.includes(parsed.activeStage as StageId)
        ? (parsed.activeStage as StageId)
        : base.activeStage,
    };
  } catch {
    return null;
  }
}

export function saveDraft(draft: Draft): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  } catch {
    // Quota errors are non-fatal; the in-memory draft still works.
  }
}

export function clearDraft(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}
