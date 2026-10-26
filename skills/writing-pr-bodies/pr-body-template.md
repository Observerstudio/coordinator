## What changes for the team

<3–6 sentences. What the operator sees differently, in the app's own labels. What stays the same.
What could go wrong and how we would notice.>

## What changed in the code

- `<file>`: <what and why; the seam it plugs into; the decision and who made it>
- …

## Gate (worktree on origin/<base> <sha>)

- RED before code: `<cmd>` → `<pasted summary line>`
- GREEN after: `<cmd>` → `<pasted summary line>`
- tsc --noEmit: `exit=<n>`
- eslint on touched files: `<result>`
- Integration `<file>`: written, not run — LANE-NEEDS-INTEGRATION-SLOT

## Does NOT change

- <invariant> — `git diff --stat origin/<base>` shows only: <files>

## Ponytail review

- <finding> → <fixed | kept: reason>

## Deploy order  <!-- only with a migration, seed change, repair script or env var -->

1. …

## Follow-ups  <!-- omit if none -->

- <case seen, left out, why>

Part of #<issue>.
