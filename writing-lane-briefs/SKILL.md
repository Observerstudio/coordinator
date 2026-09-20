---
name: writing-lane-briefs
description: Use when a coordinator is about to hand work to a lane (a pane, a subagent, a contractor with no session context) — writing a lane brief, a rework brief, or turning a spec/plan task into something a pane can execute unattended.
---

# Writing lane briefs

## Overview

A brief is a plan written for a stranger who will not ask questions. It merges three sources:
the coordinator lane contract (worktree, sentinel, fixture contract, `.feature` gate), the
plan disciplines of `superpowers:writing-plans` (bite-sized red→green steps, interfaces,
no placeholders) and `improve` plans (drift stamp, current-state excerpts, machine-checkable
done criteria, STOP conditions). **If a decision is not in the brief, the lane does not make it.**

Two parts, always: **What changes for the team** (plain English, becomes the PR body's first
section) then the technical brief. Never head the plain part "In plain English".

## Before writing (the coordinator's half — never skip)

1. `mem-search` the topic; `git log --grep=<issue>` and open PRs — done / in-flight / decided all look like "todo".
2. Read the sibling code you will name: the writer, its callers, its nearest test. A type says the shape, never the value.
3. Record `git rev-parse --short origin/<base>`; the brief stamps it.
4. Decide every reserved question yourself or with the operator. A brief with an open question is a LANE-BLOCKED waiting to happen. Two questions are ALWAYS the operator's, never yours: **any Arabic label with no precedent in `messages/ar.json`** (the app never coins a term — client-text rule 2026-09-17) and **any rule that changes money or holdings**. Ask before writing the brief; do not "flag it" inside the brief.
5. Write the `.feature` first (`LANE-ACCEPT-<issue>.feature`): one Scenario per acceptance criterion, domain words only. Item 1 of the gate is scored against it.

## Writing (fill `brief-template.md` — every section, even when short)

- **Pattern to copy** by path AND line range, in reading order. "Follow `x.ts:60-105`" beats "create a fixture".
- **Scope** names every writer and reader with `file:line`; **does NOT change** names the invariants and the tempting neighbours.
- **Fixture contract**: seeding file by line range; which rows the nature really needs; the shared-uniqueness helper and what it returns (ours reserves ONE day — dates come from its return value, never hand-picked); slug vs legacy enum; stored sign of any effect quoted from the DB; one actor per test; teardown that survives a failed setup.
- **Steps** are one action each with the command and the expected output. A correction feature is proved by a SEQUENCE (up-then-down ≠ down-then-up).
- **Done criteria** are commands with expected results, never "works correctly".
- **STOP conditions** name the specific assumptions that, if false, end the lane with LANE-BLOCKED + options.
- Per-task sentinel `LANE-DONE-<issue> — <branch> <sha> <summary>` (and `LANE-BLOCKED-<issue> — …`), never the bare `LANE-DONE` — the `<issue>` keeps the monitor's grep off the brief's own text, the `<branch> <sha>` is what the gate verifies. `LANE-NEEDS-INTEGRATION-SLOT` is a progress marker, not the final line.

## Rework and diagnosis briefs (folded in from superpowers)

- **Rework R1–R3** goes to the same lane in the same worktree with the failing output pasted verbatim and the fix named by file:line. **R4+** goes to a fresh lane on a more capable model — the same lane has stopped seeing it (subagent-driven-development).
- A rework brief quotes the reviewer's finding and says: **verify it against the code first; if it is wrong, answer with the evidence, do not implement it** (receiving-code-review). Second-reader claims have been wrong before.
- A bug brief either **carries the root cause** (file:line, the mechanism, the failing case) or is a **DIAG brief** that forbids any fix and ends with the cause and options (systematic-debugging). Never "find and fix".
- Every claim in the lane's report is **a pasted command output**, never "should", "seems", "passes locally" (verification-before-completion). The coordinator re-runs the touched files anyway; a claim without output is a LANE-BLOCKED.
- Independent tasks get **one lane each, in the same response**, only when they share no files and no fixtures; otherwise sequential (dispatching-parallel-agents). Two lane panes max.

## Lane toolkit — name the skills the lane loads, by path

Lanes (OpenCode / Codex panes) read `~/.agents/skills/<name>/SKILL.md` when the brief names it; they do not inherit the coordinator's skills. Every brief carries a **Skills to load** line, chosen from:

| Task shape | Lane loads |
|---|---|
| Every brief | `tdd` (red first), `verification-before-completion` (paste output, never "should"), `ponytail-review` (own diff before reporting) |
| Rework brief | `receiving-code-review` (verify the finding before implementing) |
| DIAG brief | `systematic-debugging` / `diagnosing-bugs` (root cause, no fix) |
| Prisma query or migration | `prisma-client-api`, `prisma-cli` |
| Screen or component | `frontend-design`, `vercel-react-best-practices`, `ux-copy` for any label — and the memory rule: match the sibling page, never `useEffect` |
| Domain vocabulary in names or copy | `domain-modeling`, repo `CONTEXT.md`; Arabic labels only from `messages/ar.json` |
| Module boundary or new service | `codebase-design` |

Never name a skill the lane cannot open — check `ls ~/.agents/skills/<name>` before writing the line.

## Standing rules the brief carries verbatim

No subagents. Never `scripts/ci-local*`, the full unit suite, whole-repo tsc, `next build`, or any
integration file — write them, print `LANE-NEEDS-INTEGRATION-SLOT`. `npx prisma generate` once
in the worktree. No `git add/commit/push` unless the brief says so; never amend or force-push.
Ponytail on; `/ponytail-review` on the own diff before reporting. Never `useEffect`. Any new
`season_id` relation → season-owned-fact registry. Any `createLedgerEntry` site → ledger-site
registry AND legacy-wallet-writer inventory. Client value imports from `server/services` that
reach Prisma break `next build` only — pure helpers stay Prisma-free.

## After writing — the stranger test

Read the brief as the lane: no session, no memory, only this file and the repo. Every path
resolves? Every number has a source? Every "should" has a command? Every decision made? If a
sentence starts with "as discussed" or "like before", the brief is broken.

## Dispatch

One brief → one lane → one worktree. Prompt is one line pointing at the file. Read back and
`grep -c <brief filename>` after every prompt; a prompt sent right after `/new` is lost. Arm a
Monitor on the per-task sentinel excluding your own dispatch text. Idle is not finished.

## Failures this skill exists to prevent

| Missing element | What it cost |
|---|---|
| Fixture contract by line range | 4 rework rounds on one test, zero feature defects (#1477) |
| Reservation helper semantics | hand-picked date outside the one-day window (#2224 (q)) |
| Stored sign quoted | negative consumed effects fixtured positive (#2092) |
| Per-task sentinel | generic sentinel matched the brief text, monitor false-fired |
| "No ci-local" rule | a lane ran the mirror beside the slot; random reds (2026-09-02) |
| Sibling-code read | `totalQuantity` vs `quantity` money bug in 4/4 plan tasks (2026-09-15) |
| Registry line | #1687 and Lane E both CI-red on season registry |
| Sequence test | one green decrease hid 3 defects incl. live bug #2195 |
