---
name: react-front-test-runner
description: Run the required frontend validation flow after any React frontend implementation task, including changes to components, routes, styles, state, tests, build config, dependencies, or browser-facing behavior.
---

# React Front Test Runner

Use this skill after every React frontend implementation task before handoff,
including components, routes, styles, state, tests, build tooling, assets and
frontend dependencies.

Read and execute the [validation policy](../../../docs/testing.md#validation-policy).
It owns the full code-change baseline, additional checks by change type,
documentation-only checks and failure reporting. Read
[test strategy and coverage](../../../docs/testing.md#strategy) when choosing
focused regression tests, and [browser setup](../../../docs/testing.md#browser-setup)
when Playwright is unavailable.

Run every check required for the touched surface. Investigate in-scope failures;
report commands that could not run and their reasons. At handoff, state the
commands actually run and their outcomes, separating known warnings from
failures. Do not maintain a second command list in this skill.
