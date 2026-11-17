
# Agentic Workspace

This directory contains project-specific guidance for AI agents. It is
tool-agnostic: the guidance can be used by Codex, Cursor, Claude, Copilot,
Devin or another assistant.

Start with [AGENTS.md](../../AGENTS.md) and the
[documentation index](../README.md). Read only the workflows relevant to the
task. These are project instructions, not definitions of separate subagents.

## What Lives Here

- [react-expert-skills.md](react-expert-skills.md): React expert capabilities
  for this dashboard.
- [graphify-development.md](graphify-development.md): how to use the local
  Graphify code graph in the development flow.
- [external-docs-rag.md](external-docs-rag.md): when and how agents should
  retrieve and query official external documentation.
- [external-doc-sources.json](external-doc-sources.json): machine-readable map
  of approved documentation sources for the current stack.

## Ground Rules

- Keep project facts in versioned docs.
- Keep generated Graphify data outside the repository.
- Keep API keys and provider secrets outside tracked files.
- Prefer fixture-first development for deterministic tests and demos.
- Use external documentation retrieval when local context is insufficient or
  best-practice guidance may have changed.
- Use `npm run rag:*` for local library documentation lookup before adding
  ad-hoc external research to a task.
- Update this directory when the agent workflow changes.

## Instruction Ownership

- [React expert guidance](react-expert-skills.md) owns the four React work modes.
  The [Codex expert skill](../../.agents/skills/react-dash-expert/SKILL.md)
  routes to this shared guidance.
- [Coding conventions](../coding-conventions.md) own shared-code and type rules.
- [Testing](../testing.md#validation-policy) owns validation requirements. The
  [Codex test skill](../../.agents/skills/react-front-test-runner/SKILL.md)
  executes that policy after frontend implementation.
- Historical plans under `docs/archive/` are reference material, not active
  agent instructions or evidence that a task is complete.

Keep the source map at `docs/agentic/external-doc-sources.json`:
`scripts/lib-rag.cjs` loads it from that exact path.

## Local Codex Configuration

Codex discovers the two project skills in `.agents/skills/`. The repository's
[config.toml](../../.codex/config.toml) keeps them explicitly enabled by name,
so the selectors remain portable across clones. See the
[official skill configuration guidance](https://learn.chatgpt.com/docs/build-skills#enable-or-disable-local-codex-skills).
