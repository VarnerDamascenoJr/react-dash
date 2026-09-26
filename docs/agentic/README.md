# Agentic Workspace

This directory contains project-specific guidance for AI agents. It is
tool-agnostic: the guidance can be used by Codex, Cursor, Claude, Copilot,
Devin or another assistant.

## What Lives Here

- [react-expert-skills.md](react-expert-skills.md): React expert capabilities
  for this dashboard.
- [graphify-development.md](graphify-development.md): how to use the local
  Graphify code graph in the development flow.
- [external-docs-rag.md](external-docs-rag.md): when and how agents should
  retrieve official external documentation.
- [external-doc-sources.json](external-doc-sources.json): machine-readable map
  of approved documentation sources for the current stack.

## Ground Rules

- Keep project facts in versioned docs.
- Keep generated Graphify data outside the repository.
- Keep API keys and provider secrets outside tracked files.
- Prefer fixture-first development for deterministic tests and demos.
- Use external documentation retrieval when local context is insufficient or
  best-practice guidance may have changed.
- Update this directory when the agent workflow changes.
