# Spec Kit demo — PLAN

## Goal

A single-user browser playground that walks GitHub Spec Kit’s Spec-Driven stages (constitution → specify → clarify → plan → tasks) and exports markdown artifacts — without running Spec Kit CLI or writing app code.

## Single-user MVP

**In**
- Start from a short product idea (text input + a few starter examples)
- Guided stepper for: Constitution → Specify → Clarify → Plan → Tasks
- Editable markdown panels per stage with sensible templates inspired by Spec Kit
- Progress indicator and stage checklist
- Export: download individual `.md` files or one zip of all stages
- Persist draft in `localStorage` so a refresh doesn’t wipe work
- Self-contained under `apps/spec-kit/`: `bun install && bun run dev`

**Out**
- Calling Spec Kit CLI / `specify` binary
- LLM auto-generation of specs (manual editing only for v1)
- Multi-user auth, cloud sync, or team collaboration
- Generating real application code from the plan
- Cloudflare/Pages deploy wiring for this PR

## Outcome-oriented tasks

1. **Scaffold** — `bunx create-next-app` (App Router, TypeScript, Tailwind, no initial install flags as needed) inside `apps/spec-kit/`; add root `bunfig.toml` with `[install] minimumReleaseAge = 259200`; then `bun install`
2. **UI kit** — `bunx shadcn@latest init` (minimalist) + add button, card, textarea, tabs/stepper, badge as needed
3. **Stage model** — typed stage list + default templates for constitution/spec/clarify/plan/tasks; localStorage load/save
4. **Playground UI** — idea entry → stepper → per-stage editor → “next stage” unlocks when current has content
5. **Export** — client-side download of each markdown file + zip of the set
6. **Polish** — empty states, starter idea chips, README with run instructions
7. **Validate** — `bun run build` (or `bun run dev` smoke); capture ≥1 screenshot and ≥1 short video of the running app for the PR

## Stack

| Choice | Why |
| --- | --- |
| Bun | Monorepo default runtime / package manager |
| Next.js (App Router) via `create-next-app` | Opinionated app shell; one framework |
| TypeScript + Tailwind | Scaffold defaults |
| shadcn/ui | Minimal, on-demand components |
| localStorage | Zero-backend persistence for one user |
| JSZip (or similar) | Client-side zip export |

## Deferred

- LLM-assisted fill of each stage
- Import/export Spec Kit CLI project layout
- Sharing a read-only link
- Pages deploy path under the monorepo Cloudflare project

## Source

- Bookmark: https://x.com/0xJokker/status/2097121742456041961
- Spec Kit: https://github.com/github/spec-kit