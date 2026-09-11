export type StageId = "constitution" | "specify" | "clarify" | "plan" | "tasks";

export interface StageDefinition {
  id: StageId;
  title: string;
  command: string;
  tagline: string;
  description: string;
  filename: string;
}

export const STAGES: readonly StageDefinition[] = [
  {
    id: "constitution",
    title: "Constitution",
    command: "/speckit.constitution",
    tagline: "Establish project principles",
    description:
      "Create the governing principles and development guidelines that every later decision must respect.",
    filename: "constitution.md",
  },
  {
    id: "specify",
    title: "Specify",
    command: "/speckit.specify",
    tagline: "Describe what and why",
    description:
      "Describe what you want to build and why. Focus on user journeys and outcomes, not the tech stack.",
    filename: "spec.md",
  },
  {
    id: "clarify",
    title: "Clarify",
    command: "/speckit.clarify",
    tagline: "De-risk the underspecified",
    description:
      "Work through open questions and ambiguities before planning. Every [NEEDS CLARIFICATION] gets an answer.",
    filename: "clarify.md",
  },
  {
    id: "plan",
    title: "Plan",
    command: "/speckit.plan",
    tagline: "Choose the how",
    description:
      "Pick the tech stack and architecture, and explain how the spec will be implemented within the constitution.",
    filename: "plan.md",
  },
  {
    id: "tasks",
    title: "Tasks",
    command: "/speckit.tasks",
    tagline: "Break it down",
    description:
      "Break the plan into an ordered, actionable task list that could be handed to an engineer or an agent.",
    filename: "tasks.md",
  },
] as const;

export const STAGE_IDS: readonly StageId[] = STAGES.map((stage) => stage.id);

export function getStage(id: StageId): StageDefinition {
  const stage = STAGES.find((candidate) => candidate.id === id);
  if (!stage) throw new Error(`Unknown stage: ${id}`);
  return stage;
}

function ideaHeading(idea: string): string {
  return idea.trim() || "Untitled product idea";
}

export function stageTemplate(id: StageId, idea: string): string {
  const subject = ideaHeading(idea);
  switch (id) {
    case "constitution":
      return `# Constitution — ${subject}

> Non-negotiable principles that govern every spec, plan, and task for this project.

## Core principles

### I. Simplicity first
Start with the smallest thing that could work. Complexity must be justified in writing before it is added.

### II. User outcomes over tech choices
Every feature traces back to a user journey. Technology is a means, never the goal.

### III. Test what matters
Critical logic and user-facing flows get tests. Boilerplate does not.

## Constraints

- Single-user MVP first; multi-user concerns are deferred.
- Prefer boring, well-documented tools over novel ones.

## Governance

Amendments to this constitution require a written rationale in the plan stage.
`;
    case "specify":
      return `# Feature specification — ${subject}

**Status**: Draft
**Input**: "${subject}"

## User scenarios

### Primary user story
As a [user], I want to [action] so that [outcome].

### Acceptance scenarios
1. **Given** [initial state], **When** [action], **Then** [expected outcome].
2. **Given** [initial state], **When** [action], **Then** [expected outcome].

## Functional requirements

- **FR-001**: The system MUST [capability].
- **FR-002**: The system MUST [capability].
- **FR-003**: Users MUST be able to [interaction].
- **FR-004**: [NEEDS CLARIFICATION: open question about scope or behavior]

## Key entities

- **[Entity]**: what it represents and its key attributes.

## Out of scope

- [Explicitly excluded capability]
`;
    case "clarify":
      return `# Clarification log — ${subject}

> Resolve every ambiguity before planning. One question, one decision, one rationale.

## Session ${new Date().toISOString().slice(0, 10)}

### Q1: [Question pulled from a NEEDS CLARIFICATION marker]
- **Options considered**: A) [option], B) [option]
- **Decision**: [chosen option]
- **Rationale**: [why]

### Q2: [Next ambiguity]
- **Options considered**: A) [option], B) [option]
- **Decision**: [chosen option]
- **Rationale**: [why]

## Deferred questions

- [Question that can safely wait until after the MVP]
`;
    case "plan":
      return `# Implementation plan — ${subject}

**Prerequisites**: constitution.md, spec.md, clarify.md

## Technical context

- **Language / runtime**: [e.g. TypeScript on Bun]
- **Framework**: [e.g. Next.js App Router]
- **Storage**: [e.g. localStorage, SQLite, Postgres]
- **Testing**: [e.g. bun test for core logic]

## Architecture

Describe the major pieces and how data flows between them:

1. [Component / layer] — [responsibility]
2. [Component / layer] — [responsibility]

## Constitution check

- [ ] Every choice above honors the constitution's principles.
- [ ] No complexity was added without written justification.

## Risks

- [Risk] → [mitigation]
`;
    case "tasks":
      return `# Task list — ${subject}

**Input**: plan.md

## Phase 1 — Setup

- [ ] T001 Scaffold the project and install dependencies
- [ ] T002 Configure linting, formatting, and scripts

## Phase 2 — Core

- [ ] T003 [Build the first vertical slice of the primary user story]
- [ ] T004 [Wire persistence]
- [ ] T005 [P] [Parallelizable task — no dependency on T003/T004]

## Phase 3 — Polish

- [ ] T006 Empty states and error handling
- [ ] T007 README with run instructions

## Dependencies

- T003 blocks T004
- Tasks marked [P] can run in parallel
`;
    default: {
      const exhaustive: never = id;
      throw new Error(`Unhandled stage: ${exhaustive}`);
    }
  }
}
