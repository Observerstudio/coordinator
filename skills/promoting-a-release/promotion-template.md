# Promotion

Lives at `docs/agents/promotion.md`: `promoting-a-release` reads only that path. Point at what the repo already has; copy none of it.

## Rungs

<e.g. `feature/*` → `development` → `staging` → `master`; the environment and URL of each rung>

## Commands

Run by step 3 on the merged result.

- Type check: <command>
- Unit tests: <command>
- Integration tests: <command, or "none">

## Database

- Provider and how to fork the target rung's database: <e.g. Neon branch from `env/staging` / production; or "no database">
- Migration status: <command>
- Migration deploy: <command>

## Build

<the production build command, e.g. `npm run build` (runs `next build`)>

## Environment

Where each rung's variable names are listed: <e.g. the hosting dashboard per environment, or a command>. Names only.

## Smoke check

<what proves the deployed rung works: a URL that loads, a page, a health endpoint>

## Rollback

<how to undo a bad promotion: redeploy the previous build, revert the merge commit, restore the database>
