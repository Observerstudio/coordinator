# Track state — `TRACK-STATE.md`

One file per track, in the repo's agent-docs area (e.g. `docs/agents/tracks/<track>.md`) or
the repo's handoff location. The coordinator updates it at every node of
[`graph.md`](graph.md) and reads it first at every session start. The handoff is a snapshot of
this file, not a separate essay. Keep it under two screens; move history to dated notes.

```markdown
# Track: <name>            updated: <YYYY-MM-DD HH:MM> by <coordinator session>

## need
<the client's words / the audit finding / the screenshot, one paragraph, dated>

## diagnosis
<what INVESTIGATE found, with the reference read and its section numbers; link the note>

## decision
<the human's call, dated, one line each; "reversible only by a new decision">

## plan
- [ ] <fix 1>  → issue #…   pile: fix | refactor
- [ ] <fix 2>  → issue #…

## briefs
| lane | brief file | worktree | branch | standards cited | dispatched |
|---|---|---|---|---|---|

## changes (sentinels)
| lane | sentinel | sha | PR | verified past base? |
|---|---|---|---|---|

## corrections
| lane | block / stall | option taken | round |
|---|---|---|---|

## verdicts
| PR | sha | rubric | standards | slot run | mutation | outcome | round |
|---|---|---|---|---|---|---|---|

## merged / promoted
| PR | merged into | promoted to (human) | prod check |
|---|---|---|---|

## lessons
- <date> <what bit> → memory: <slug> · note: <path> · rule: <S# / AGENTS.md line / none>

## open questions for the human
- <question> (blocking: yes/no)
```

Rules: append, do not rewrite history; a row per round so the ceilings in `graph.md` are
visible by counting; never put secrets, client names or production values that the repo
forbids.
