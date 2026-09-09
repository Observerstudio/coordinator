# The coordinator graph

The coordinator has always run a graph; this file declares it. Nodes do work, edges say what
runs next, one **state object** rides the edges, and three **routers** decide the path from a
table, not from mood. A route that is not in a table is not taken: it becomes a question to a
human. No framework, no runtime — the graph is a document the coordinator follows and a state
file it keeps current. (Vocabulary: nodes, edges, shared state, routers with labelled
conditional edges, fan-out/fan-in, a separate read-only verifier, dashed loop-backs, human
interrupts, checkpoints. Reference: any current graph-engineering primer; the test is "every
node does work a single loop could not, and the whole thing fits in one breath".)

## The graph

```
                state = { need, diagnosis, decision, briefs[], changes[], verdicts[], lessons[] }

 START ─► [PROBLEM] ─► (INVESTIGATE) ─► (PLAN) ─► [ISSUE] ─► [DECIDE] ─► ◇ ASSIGN
                                                                    a dev ◄─┴─► coordinator
                                                                      │             │
                                                                      │         (BRIEF)
                                                                      │       fan-out │ one brief per lane, one worktree per lane
                                                                      │     ⟨LANE⟩ ⟨LANE⟩ ⟨LANE⟩
                                                                      │       fan-in  │ exactly one sentinel line each
                                                                      │         ◇ SENTINEL
                                                                      │   BLOCKED ╌╌► (WATCH & CORRECT) ╌╌► same lane
                                                                      │   NEEDS-SLOT ╌╌► coordinator runs the slot
                                                                      │         │ DONE
                                                                      └──────►(COLD REVIEW)   separate, read-only verifier
                                                                                │
                                                                            ◇ VERDICT
                                              reject: rework ╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┴──► pass
                                              ╌╌► back to (BRIEF), finding appended     │
                                                                                  (MERGE → default integration branch)
                                                                                        │
                                                                                   [PROMOTE]   human; the ladder is a CI check
                                                                                        │
                                                                                   (LESSON) ─► CHECKPOINT: memory · dated note · rule
                                                                                        │
                                                                                       END  ╌╌► the next START reads the checkpoint

 [ ] human node (interrupt)   ( ) coordinator node   ⟨ ⟩ lane node   ◇ router   ── success   ╌╌ reject / blocked / loop-back
```

## Nodes, one line each

| Node | Owner | Does | Writes to state |
|---|---|---|---|
| PROBLEM | human | Names the need in the client's words, or an audit finding, or a screenshot. | `need` |
| INVESTIGATE | coordinator | Reads before acting: production-shaped data, code, memory, the reference. No code written. | `diagnosis` |
| PLAN | coordinator | Splits fixes from refactors, orders them, scopes each to one PR. | `plan` |
| ISSUE | human (or coordinator on the human's word) | One issue per need, need not mechanism. | `issues[]` |
| DECIDE | human | The consequential call, closed once, in writing. | `decision` |
| BRIEF | coordinator | One page per lane per `docs/lane-brief-template.md`, standards cited by number. | `briefs[]` |
| LANE | lane | One brief in, one change out, one sentinel line. Never delegates. | `changes[]` (via sentinel) |
| WATCH & CORRECT | coordinator | Reads the pane; answers the BLOCKED options; nudges a stalled lane. | `corrections[]` |
| COLD REVIEW | coordinator | Read-only verifier at the exact SHA: rubric ×10, standards, own slot run, mutation check on money paths. | `verdicts[]` |
| MERGE | coordinator | Squash into the repo's default integration branch. Never further. | `merged[]` |
| PROMOTE | human | Each rung of the branch ladder; production-side checks. | `promoted[]` |
| LESSON | coordinator + human | What bit, as a dated note, a memory entry, and — if it is a rule — AGENTS.md / the standards. | `lessons[]` |
| CHECKPOINT | system | The persisted state file + memory. The next START reads it first. | — |

## Routers — the only places the path branches

A router picks exactly one labelled edge. If no row matches, the answer is a question to the
human, never an improvised route.

### ◇ ASSIGN — who does the work

| Condition (first match wins) | Edge |
|---|---|
| Touches money or custody, or two or more modules, or needs the integration slot, or the human said "coordinate" | `coordinator` → BRIEF |
| A named developer owns the area and asked for it, or the change is UI copy / one file / no test contract | `a dev` → COLD REVIEW (the dev's PR still gets the same gate) |
| Neither | ask the human |

### ◇ SENTINEL — what a lane printed

| Line | Edge |
|---|---|
| `LANE-DONE — <branch> <sha> …` **and** `git log <base>..<branch>` shows that sha | → COLD REVIEW |
| `LANE-DONE` but no commit past base | treat as stalled → WATCH & CORRECT ("no commit; finish or print LANE-BLOCKED") |
| `LANE-BLOCKED — <what + options>` | → WATCH & CORRECT: pick an option or take it to the human; answer goes back to the SAME lane |
| `LANE-NEEDS-INTEGRATION-SLOT` | → coordinator takes the slot itself (never a lane) → result feeds COLD REVIEW |
| settled, no sentinel | nudge once ("continue"); a second silence → WATCH & CORRECT |
| anything else | not a sentinel; do not act on it |

### ◇ VERDICT — what the cold review found

| Outcome | Edge |
|---|---|
| Rubric 10/10, standards held, CI green, own slot run green, mutation check red on exactly the mutated case (money paths) | `pass` → MERGE |
| Any rubric item fails, or a fixture is wrong, or a test does not bite | `reject: rework` → BRIEF, with the finding appended to `verdicts[]`; the SAME lane gets it as a follow-up, never an amend |
| The finding is a design decision the brief reserved | `reject: decision` → DECIDE (human) |

## Bounded loop-backs

Dashed edges have ceilings. Hitting a ceiling routes to the human with the state file, not
round again.

| Edge | Ceiling | Then |
|---|---|---|
| reject → BRIEF on the **same finding** | 2 rounds | human decides: re-brief with a fixture contract by line range, or reassign |
| BLOCKED → same lane on the **same block** | 2 | human decides |
| nudge on a silent lane | 2 | kill and re-dispatch on a fresh worktree; old pane gets `/new` |
| lanes live per track | 2 (3 with the human's word) | do not dispatch; queue in state |
| one brief | exactly 1 lane, exactly 1 worktree | a failed-looking dispatch is still queued — never re-dispatch the same brief |

## Fan-out and fan-in

- BRIEF fans out only to lanes that share no files; if two briefs touch one file, they are one
  brief or they are sequential.
- Every lane has its own worktree from the integration branch and its own branch name.
- Fan-in is the sentinel line, nothing else. Idle is not finished.

## Checkpoint

LESSON writes to three places, in this order: the state file (`lessons[]`), the coordinator's
memory (per-user), and — when it is a rule — the repo (`AGENTS.md`, the standards note, or an
incident file) via PR. The next session's first act is to read the state file, then the
standards, then memory. A lesson that lives only in chat did not happen.

## What this is not

Not LangGraph, not an orchestrator, not agents calling agents. The graph is declared so the
coordinator can be checked against it and so a new coordinator inherits routes instead of
habits. If a node stops doing work a single loop could not, delete the node.
