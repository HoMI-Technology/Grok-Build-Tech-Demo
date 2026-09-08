# Tech Demos monorepo

Sticky playground for weekday X-bookmark demos. One app per pick under `apps/<slug>/`.

## Layout

- `apps/<slug>/` — self-contained demo (Bun: `bun install && bun run dev`)
- `skills/project-planning/` — vendored planning skill for cloud agents
- `tracking/seen-bookmarks.json` — proposed/built bookmark ids (never re-propose)

## Cloud agent rules

- Only add/update `apps/<kebab-slug>/` for a given demo
- Use model claude-fable-5 (Fable 5) unless the owner asks otherwise
- Open one PR; attach at least one screenshot AND one video of the running app
- Never create a new GitHub repository per demo
- Prefer Bun + shadcn; follow `skills/project-planning/`