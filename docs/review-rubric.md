# Cold-review rubric — one reviewer, one scorecard, every PR

The coordinator reviews. Not a fan-out of subagents: the review is the coordinator's own reading of
the diff at the exact head SHA, scored against the same ten items every time. A subagent is allowed
only as ONE second reader when the PR is over ~800 changed lines or touches money — never several
in parallel, never "one per dimension". Green CI is not a review; a review that only reads the PR
body is not a review either.

## The scorecard (report all ten, in this order, PASS / FAIL / N/A + one line of evidence)

| # | Item | What counts as evidence |
|---|------|-------------------------|
| 1 | **Spec match** | Every acceptance criterion of the issue maps to a change or a stated deferral. Name the AC that is missing, if any. |
| 2 | **Meaning, not just safety** | For any closed set of verdicts/classifications/statuses: one POSITIVE fixture per member exists and the healthy path asserts the *clean* verdict. (A negative control proves nothing about meaning — #1362.) |
| 3 | **Writes** | List the tables the change writes. Compare to what the ticket allows. Anything else = FAIL. Money paths only through the existing command/facade; new ledger readers registered in `ledger-site-registry.ts`. |
| 4 | **Idempotency is DB-decided** | Exactly-once comes from a unique index, a compare-and-set `updateMany … WHERE`, or a `clientRequestId` replay with input-hash conflict — not from a read-then-act alone. Say which. |
| 5 | **Season off the fact** | Any new season stamp is resolved from the entity/original leg, never from the actor's live season; fenced when correcting a closed book. |
| 6 | **Mutation controls bite** | The PR body pastes red output for each guard, and each control kills exactly the guard it claims. If a guard has a redundant sibling, say so (a single mutation can survive a redundant guard). |
| 7 | **Diff hygiene** | `git diff --numstat` per file is proportional to the change. Whole-file rewrites (CRLF loss, `prisma format`, reformatters) = FAIL. schema.prisma must be additive and small. |
| 8 | **Repo hard rules** | No `useEffect`; date-only in UI; counted Arabic nouns agree; plain Arabic labels; no client-prescribed mechanism promoted to a rule; no email/name passed on a commit command line. |
| 9 | **Migration & template** | Migration is hand-checked for live data (nullable → backfill → NOT NULL), DB-only DDL is allow-listed in `ci.yml`, and the PR says "rebuild the local integration template". |
| 10 | **What it deletes** | The PR names what it removes or corrects (a wrong comment, a dead test, a superseded guard). "Nothing" is acceptable only when stated. Ponytail is on for every lane (2026-08-29): run `/ponytail-review` against the PR diff as part of this item — an abstraction with one caller, a guard for a caller that does not exist, or a helper the stdlib already provides is a FAIL here. |

## Metrics to keep per PR (one line in the merge comment)

`review: <passed>/10 pass · N/A=<n> · reworks=<k> · reviewer=coordinator · second-reader=<none|1>`

Record the score you actually gave, never a rounded-up 10. An N/A item counts as passed for this
line (say so via `N/A=<n>`); an accepted FAIL — items 1, 6, 8 or 10, stated in the PR body and
accepted in the review comment — still lowers the score, and the point of the number is that the
accepted gaps stay visible after the merge.

Track over time: reworks per PR (target ≤1), FAILs caught before merge vs after (any post-merge FAIL
becomes a Bite in memory), and second-reader count (target: rare).

## When the score is not 10/10

- Any FAIL on items 2, 3, 4, 5 → **rework before gating**; these are the ones that ship wrong money or wrong meaning.
- FAIL on 7 or 9 → rework (cheap, and it protects every other branch).
- FAIL on 1, 6, 8, 10 → rework unless the gap is stated in the PR body and accepted in the review comment.

Then run the repo's own merge gate, if it has one (some keep a fail-closed `merge-gate` script; this
repo ships none). The gate is a separate step from the review and the rubric never replaces it: a
10/10 scorecard on a branch whose checks were never read is still an unreviewed merge.
