# External Docs RAG

This project uses a lightweight, tool-agnostic RAG workflow for external
documentation. The goal is to help an agent recover missing or stale context
about React, Vite, MUI, Playwright and adjacent libraries without bloating the
repository or trusting model memory.

RAG here means:

1. **Retrieve** focused, relevant documentation from trusted sources.
2. **Ground** the implementation decision in those sources.
3. **Apply** the decision to the local codebase.
4. **Report** which external sources influenced the change.

## When To Trigger External Retrieval

Use external documentation when any of these signals appear:

- local source and docs do not explain the behavior;
- a library API, option or import style is uncertain;
- an error appears to come from a dependency, build tool, browser or test
  runner;
- the task touches current best practices for tests, accessibility, security,
  bundling, routing or React state;
- package versions matter;
- the agent is about to add a dependency, change config or alter a cross-library
  integration;
- the user explicitly asks for best practices, latest guidance or external
  docs.

Do not use external retrieval for routine edits where the repository already
contains enough context.

## Retrieval Order

1. Read local project context:
   - `AGENTS.md`
   - `docs/agentic/`
   - relevant project docs
   - relevant source files
   - `package.json` and `package-lock.json`
2. Run or consult Graphify for local structure and impact when the change is
   non-trivial.
3. Consult [external-doc-sources.json](external-doc-sources.json) to choose the
   authoritative documentation source.
4. Retrieve only the focused pages needed for the task.
5. Prefer official documentation for the exact library.
6. Use changelogs/release notes for version-specific behavior.
7. Use GitHub issues/discussions only when official docs do not answer.
8. Use community sources only as secondary evidence and label them as such.

## Local Library RAG CLI

The project includes a local, no-API-key retrieval helper for library
documentation. It uses the trusted source map in
`docs/agentic/external-doc-sources.json`, resolves installed package versions
from `package-lock.json`, stores fetched snapshots outside the repository, and
performs lexical search over the local cache.

Commands:

```bash
npm run rag:sources -- react
npm run rag:fetch -- --library React
npm run rag:fetch -- --library React --url https://react.dev/reference/react/useMemo
npm run rag:query -- "React useMemo dependencies" --library React
```

Cache location:

```text
~/.cache/react-dash-lib-rag
```

Override the cache for an isolated run:

```bash
REACT_DASH_LIB_RAG_CACHE=/tmp/react-dash-lib-rag npm run rag:query -- "MUI Data Grid valueFormatter"
```

Use this CLI when a task needs quick local consultation of library docs. Add
focused official URLs with `rag:fetch -- --library <name> --url <url>` when the
default seed page is too broad. The URL origin must already be listed as an
official source for that library.

The source map should track the project's actual libraries, while the CLI uses
the lockfile as the version authority. If a package is upgraded, rerun
`npm install` so `package-lock.json` changes with it, then refresh relevant RAG
cache entries with `npm run rag:fetch -- --library <name> --refresh`.

## Query Shape

Good retrieval queries include:

- library name;
- package version or major version;
- exact API/config/error text;
- the framework/runtime context.

Examples:

```text
Playwright webServer baseURL trace retries official docs
Vite MUI createTheme_default is not a function optimizeDeps official
MUI X Data Grid v6 valueFormatter official docs
React Router v6 protected route Navigate state official docs
```

## Source Boundaries

- Do not copy external documentation into this repository.
- Do not create a local vendor docs folder.
- Do not add docs crawlers, vector databases or API keys unless the user
  explicitly asks for a runtime RAG system.
- Do not store secrets for search, embedding or model providers in tracked
  files.
- Treat `VITE_*` values as public and unsuitable for provider secrets.

## How To Use Retrieved Context

When external docs influence a change:

- mention the source in the final handoff;
- link the official page;
- explain the local decision briefly;
- keep the implementation aligned with project constraints;
- add a small note to local docs only when the guidance becomes part of the
  project workflow.

## Project-Specific Examples

### Playwright

Use official Playwright docs when changing:

- `playwright.config.ts`;
- browser/device matrix;
- locators and assertions;
- traces, screenshots, videos or reporters;
- web server startup behavior.

The current local policy follows Playwright guidance for user-visible behavior,
isolation, locators, web-first assertions, traces and web server configuration.

### Vite And MUI

Use official Vite and MUI docs when changing:

- dependency optimization;
- MUI import style;
- Vite proxy;
- dev server behavior;
- build configuration.

This matters because Vite dev pre-bundling and MUI deep imports can produce
runtime-only failures that unit tests may not catch.

### React Expert Work

Before large React work:

1. use Graphify to identify local impact;
2. use local React expert skills;
3. retrieve external docs only for uncertain library APIs or best-practice
   decisions;
4. validate with Vitest, typecheck, build and Playwright.

## Handoff Template

When RAG was used, include:

```text
External docs consulted:
- <source title>: <url>

Decision taken:
- <short local decision>

Validation:
- <commands run>
```
