# The gate comment

Every gate posts one comment in this shape, MERGE or CHANGES.

```
Gate — <sha> · review: <passed>/<total> pass · N/A=<n> · reworks=<k> · reviewer=<name> · second-reader=<none|1>
Verdict: MERGE | CHANGES
Findings: <open defects, each with file:line and the failing scenario; "none">
Nits: <taste, never blocking; "none">
Attacks: <per changed area: the strongest attack tried → outcome>
Standards touched: <rule> HELD · <rule> FAIL→fixed in <sha>
Standards not touched: <rules>
Reference used: <none | book/paper + section, recorded in <ADR or brief>>
Deletes: <what the PR removes, or "nothing, stated">
```

`Findings` and `Nits` stay apart: a finding blocks MERGE, a nit never does.

The `Standards touched` line makes the monthly "which standards caught what" report a grep. A
standard that never fires is either working or dead; the line tells you which.

## Metrics

`<total>` is the general checks plus the repo's extras. Record the score you actually gave, never a
rounded-up number. An N/A counts as passed for the line (`N/A=<n>` says so); an accepted FAIL still
lowers the score, so accepted gaps stay visible after the merge.

Track over time: reworks per PR (target ≤1), FAILs caught before merge vs after (a post-merge FAIL
becomes a recorded lesson), and second-reader count (target: rare).
