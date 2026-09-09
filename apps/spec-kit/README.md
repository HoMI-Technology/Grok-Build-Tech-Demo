# Spec Kit Playground

A single-user, browser-only playground inspired by [GitHub Spec Kit](https://github.com/github/spec-kit).
Walk a product idea through the five Spec-Driven Development stages — **Constitution → Specify → Clarify → Plan → Tasks** — edit the markdown for each stage, and export the artifacts.

No CLI integration, no LLM generation, no backend: just the workflow.

## Run it

```bash
cd apps/spec-kit
bun install
bun run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Features

- **Idea entry** — describe your product in one sentence, or pick a starter idea chip.
- **Guided stepper** — the five Spec Kit stages, each with a `/speckit.*` command badge.
- **Spec-Kit-inspired templates** — one click inserts an editable markdown template per stage, pre-filled with your idea.
- **Progressive unlock** — a stage counts as complete once it has content, which unlocks the next stage. The checklist and progress bar track the whole spec.
- **Export** — download any stage as a `.md` file, or all stages plus an index `README.md` as a single `.zip` (built client-side with JSZip).
- **Autosave** — the draft persists to `localStorage`, so a refresh doesn't lose work. Reset from the header when you want a clean slate.

## Stack

- [Bun](https://bun.sh) — runtime, package manager, script runner
- [Next.js](https://nextjs.org) (App Router) + TypeScript + Tailwind CSS
- [shadcn/ui](https://ui.shadcn.com) — UI components
- [JSZip](https://stuk.github.io/jszip/) — client-side zip export

## Scripts

| Command         | What it does                     |
| --------------- | -------------------------------- |
| `bun run dev`   | Start the dev server             |
| `bun run build` | Production build                 |
| `bun run start` | Serve the production build       |
| `bun run lint`  | ESLint                           |
