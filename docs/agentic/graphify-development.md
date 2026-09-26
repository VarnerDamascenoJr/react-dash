# Graphify Development Flow

Graphify is part of the development workflow for this project, but its generated
graph, logs and metadata stay outside the repository. Do not commit
`graphify-out`, graph JSON, local Graphify config, hooks or generated metadata.

## Purpose

Use Graphify to understand structure, dependencies, hubs and impact before
changing the React dashboard. Treat it as an analysis aid, then verify important
conclusions in source files.

## Local Commands

Run Graphify through the local wrapper from outside the project configuration:

```bash
~/.codex/skills/graphify-local/scripts/graphify-local.sh index /home/varner/aprendizagem/projetos/react-dash
~/.codex/skills/graphify-local/scripts/graphify-local.sh query /home/varner/aprendizagem/projetos/react-dash "What are the main dashboard entry points and dependency hubs?"
~/.codex/skills/graphify-local/scripts/graphify-local.sh affected /home/varner/aprendizagem/projetos/react-dash "SalesAnalyticsDocument"
~/.codex/skills/graphify-local/scripts/graphify-local.sh explain /home/varner/aprendizagem/projetos/react-dash "Home()"
~/.codex/skills/graphify-local/scripts/graphify-local.sh update /home/varner/aprendizagem/projetos/react-dash
```

## Development Pipeline

Use this pipeline for non-trivial changes:

1. **Graph pass before work**
   - Run `index` or `update`.
   - Query likely entry points, dependency hubs and affected symbols.
   - Capture conclusions in the working notes or final handoff, not as generated
     Graphify output committed to the repo.
2. **Source verification**
   - Open the files Graphify identified.
   - Confirm behavior in current source before editing.
3. **Implementation**
   - Keep analytics logic in `src/analytics`.
   - Keep UI rendering in `src/pages/home/components`.
   - Keep orchestration changes intentional in `src/pages/home/Home.tsx`.
4. **Graph pass after work**
   - Run `update`.
   - For contract or orchestration changes, query affected symbols again.
5. **Validation**
   - Run the relevant npm checks and `git diff --check`.

## React Expert Checkpoints

For React expert tasks, combine Graphify with
[react-expert-skills.md](react-expert-skills.md):

- `Home()` is the current orchestration hub.
- `SalesAnalyticsDocument` is the central contract type.
- `src/analytics/transformers.ts` should remain the main data-shaping boundary.
- `src/pages/home/components/` should stay mostly presentational.
- `playwright.config.ts` and `tests/e2e/` cover user-visible dashboard flows.

## What Not To Do

- Do not add `.graphifyignore`.
- Do not add Graphify hooks.
- Do not commit generated graph files.
- Do not add Graphify as an npm dependency for this app.
- Do not treat graph answers as authoritative without source verification.

