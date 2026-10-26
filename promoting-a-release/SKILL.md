---
name: promoting-a-release
description: Use when promoting one branch rung to the next (development → staging, staging → master/production), shipping a hotfix straight to master, or merging an upper rung back down after a hotfix. Rehearses the merge, migrations and build on copies first, so the real merge is a formality and no work is lost.
---

# promoting-a-release

A promotion is **rehearsed before it is real**. Every step runs against a copy first: a local trial merge, a fork of the target database, a local build. The GitHub merge comes last, once each rehearsal has passed its check. Work gets lost when a promotion carries a lower rung over content that lives only on the upper one, such as a hotfix or a fix made on staging. The **trial merge** in step 2 is the guarantee against that.

Read the repo's `docs/agents/promotion.md` first: it names the rungs, the commands, the database and the smoke check. When it is missing, say so out loud ("no promotion file; general steps only"), and run the steps with the repo's own scripts. A repo adopts the skill by copying [`templates/promotion.md`](../templates/promotion.md).

The skill rehearses and opens the PR. The merge itself is an outward action: confirm it with the human, as for any merge.

## Steps

`<head>` is the lower rung being promoted; `<base>` is the rung it goes into.

1. **Fetch both rungs.** `git fetch origin <base> <head>`. Done when both refs resolve.

2. **Trial merge: nothing on `<base>` is lost.** On a throwaway checkout:

   ```bash
   git checkout --detach origin/<base>
   git merge --no-commit --no-ff origin/<head>
   test "$(git write-tree)" = "$(git rev-parse origin/<head>^{tree})" && echo SAME-TREE
   git merge --abort
   ```

   Done when it prints `SAME-TREE`. On a conflict, or a different tree, `<base>` holds content `<head>` lacks:
   - Merge `<base>` **down** into `<head>` first, with a merge commit.
   - Resolve the conflict there and push. Then rerun this step.
   - `git log --oneline origin/<head>..origin/<base>` names what would have been lost.

   CI enforces the same check on every promotion PR ([`templates/branch-flow.yml`](../templates/branch-flow.yml)). Running it here finds the problem before the PR exists.

3. **Rehearse the tests on the merged result.** Merge `origin/<head>` into a local copy of `origin/<base>`, and run the promotion file's `## Commands` on it: type check, unit tests, and integration tests where the repo has them. Done when every command exits 0, with the output pasted.

4. **Rehearse the migrations on a fork of the target database.** Fork the `<base>` environment's database, using the provider named in the promotion file (e.g. `neon-postgres-branches`). Then run the migration status and deploy commands against the fork. Done when:
   - the status command reports no pending migrations on the fork;
   - the fork is deleted.

   A repo with no database states "no database" and moves on.

5. **Build as production builds.** Run the promotion file's build command (e.g. `next build`); unit-test CI often skips it. Done when it exits 0.

6. **Compare environment variables, by name.** List the variable **names** set on `<base>`'s environment and those the code reads. Compare names only; values stay where they are. Done when every name the code reads is set on `<base>`, or each missing one is listed for the human to set before the merge.

7. **Open the promotion PR.**
   - The head is the `<head>` branch itself; the base is `<base>`.
   - The body carries the rehearsal results from steps 2–6, each with the SHA it ran at, and the rollback plan from the promotion file.
   - Run `/merge-risk` and post its verdict.

   Done when the PR is open, CI is green, and the verdict is posted.

8. **Merge with a merge commit.** With the human's go: `gh pr merge <n> --merge --match-head-commit <the sha rehearsed>`. A merge commit keeps the lower rung's history matching what shipped. A branch that moved after the rehearsal goes back to step 2. Done when the PR shows MERGED.

9. **Smoke-check the deployed environment.** Run the promotion file's smoke check once the deploy finishes. Done when it passes. On a failure, run the rollback plan.

## Hotfix to master

A hotfix ships on a `hotfix/<slug>` branch straight to master, so it skips a rung. Run steps 2–9 with `<base>` = master. Then **merge master down** into staging, and staging into development, each with a merge commit. Done when the trial merge of each lower rung into the one above prints `SAME-TREE`. Until then, the next ordinary promotion carries those rungs over the hotfix.

## History changes

Corrections land as follow-up commits. A branch whose history must change goes to a new ref and a new PR, so the rehearsed SHA stays true.
