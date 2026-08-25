# Observer · Engineering Workflow

An interactive, one-page explainer of how work moves from idea to shipped at Observer —
emphasizing the split between **human judgment** (plan, decide, review) and **AI & CI**
(implementation, linking, automated checks).

**View it:** https://observerstudio.github.io/engineering-workflow/

It's a single self-contained `index.html` — no build, no dependencies. Open it locally
by double-clicking, or share the link above.

## Docs

The concrete workflow behind this page lives in [`docs/`](docs/) — start with
[`docs/onboarding.md`](docs/onboarding.md), which links the coordinator playbook (how a
Claude session runs a track through OpenCode lanes in herdr), the lane brief template,
and the herdr runbook.

## Editing
Everything lives in `index.html`. The 9 pipeline stages are defined in the `S` array near
the bottom of the file (title, lane, owner, description, quality gate, example). Lanes:
`human` (amber), `ai` (cyan), `both` (blend). Edit and commit — GitHub Pages redeploys
automatically.
