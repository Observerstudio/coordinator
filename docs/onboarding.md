# Onboarding — your first session

This setup runs software work as **tracks**: a Claude Code session acts as the track
**coordinator** (it diagnoses, briefs, gates, merges, and talks to humans), and does
the implementation through **lanes** — OpenCode panes it spawns and drives inside its
own herdr tab. Every PR passes a human-review gate plus CI plus the coordinator's own
integration run before merge, and database-backed suites run **one at a time
machine-wide**.

The generic model is defined org-wide in the
[engineering-workflow docs](https://github.com/Observerstudio/engineering-workflow/tree/main/docs).
Your repo may add specifics in its own `docs/agents/` pages — read both.

## First-session checklist

1. Open Claude Code at the repo root → it loads the repo's agent guide (`CLAUDE.md`).
2. Read [docs/coordinator-playbook.md](coordinator-playbook.md) — the operating model.
3. Check the handoff file your predecessor named (it says what's in flight; if no one
   named one, ask in the team channel).
4. Verify herdr works: `herdr pane list`.

## The three documents

- [coordinator-playbook.md](coordinator-playbook.md) — roles, the PR gate, the
  integration slot, standing rules, evidence standards.
- [lane-brief-template.md](lane-brief-template.md) — the contract between a
  coordinator and a lane, with sentinel lines.
- [herdr-runbook.md](herdr-runbook.md) — spawn/boot/send/watch mechanics for lane
  panes.

## The five rules that bite hardest

1. **Gate everything.** Green checks are not readiness; unreviewed means unreviewed.
2. **Never force-push.** Amended history → fresh ref + new PR.
3. **One integration run** per machine at a time.
4. **Never over-engineer** — build what the spec asks, nothing around it.
5. **Verify premises on the production-shaped copy** before declaring blockers.

## Memory vs. repo

Your coordinator session should save durable lessons to its memory AND graduate
team-relevant ones into the repo's `docs/agents/` via PR. Memory is per-user; the repo
is the team's brain.

## Related Observer repos

- [command-skill](https://github.com/Observerstudio/command-skill) — writing briefs
  and instructions that agents execute cleanly.
- [orchestrate-skill](https://github.com/Observerstudio/orchestrate-skill) — the same
  philosophy applied to orchestrating agents across larger bodies of work.
