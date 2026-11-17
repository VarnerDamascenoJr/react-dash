# Documentation

Choose documents by the question you need to answer:

| Question | Document |
| --- | --- |
| How do I install and run the app? | [Project README](../README.md) |
| How is the application organized? | [Architecture and module map](architecture.md) |
| What do the analytics concepts mean? | [Domain](domain.md) |
| How do login, data loading and exports work? | [Flows](flows.md) |
| How do API integration and browser persistence work? | [Integrations and storage](integrations.md) |
| Where do shared code and TypeScript types belong? | [Coding conventions](coding-conventions.md) |
| How are translations maintained? | [Localization](localization.md) |
| Which checks must run? | [Testing and validation policy](testing.md) |
| How do I diagnose common problems? | [Troubleshooting](troubleshooting.md) |
| How do I prepare a demo? | [Demo checklist](demo-checklist.md) |
| What work remains? | [Active backlog](analytics-dashboard-backlog.md) |
| How should an AI assistant work here? | [Agent workflows](agentic/README.md) |
| Why were earlier changes planned? | [Historical planning snapshot](archive/analytics-dashboard-history.md) |

## Maintenance

Keep each rule in its owning document and link to it from callers. In
particular, validation requirements belong in [testing.md](testing.md), coding
rules in [coding-conventions.md](coding-conventions.md), and React expert
behavior in [agentic/react-expert-skills.md](agentic/react-expert-skills.md).

Use Markdown links relative to the file containing them. From this directory,
source links start with `../src/`; from `agentic/` or `archive/`, they start with
`../../src/`. Do not embed a developer's checkout path or editor-specific line
suffix in a link.

Run `npm run check:docs` after editing or moving documents or linked source
files. It checks inline Markdown links and Markdown heading fragments in the
project README, `AGENTS.md`, this directory and `.agents/skills/`, including
untracked local documents. It skips external URLs and fenced/inline code
examples; it does not fetch websites or validate reference-style or HTML links.

Keep active product facts aligned with source. Preserve historical records in
`archive/`, clearly marked as historical; they do not define current behavior
or validation requirements. Generated graphs and fetched library docs stay
outside the repository.
