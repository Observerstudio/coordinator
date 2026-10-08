# Review standards

Read by `pr-review` (author and gate) and by agents before they write code. Point at rules this repo
already has; copy none.

## Rules this repo already has

- <pointer: `AGENTS.md` "Hard rules">
- <pointer: `AGENTS.md` "Engineering standards">

## Extra checks

Scored on top of the general checks, same PASS / FAIL / N/A shape.

| Item | Evidence |
|------|----------|
| <check name> | <what proves it held> |

## Commands

Run by author mode on the touched files; paste the output.

- Type check: `<command>`
- Lint: `<command>`
- Unit tests by path: `<command>`

## When to run extras

<kind of change> → <extra skill or agent, e.g. `security-review` on auth changes>. None by default.
