# Observer · Engineering Workflow

An interactive, one-page explainer of how work moves from idea to shipped at Observer —
emphasizing the split between **human judgment** (plan, decide, review) and **AI & CI**
(implementation, linking, automated checks).

**View it:** https://observerstudio.github.io/engineering-workflow/

## Install the coordinator skill

```bash
npx skills add Observerstudio/engineering-workflow
```

One command; works for Claude Code and 15+ other agents ([skills.sh](https://www.skills.sh/)). Full details and alternatives below.

It's a single self-contained `index.html` — no build, no dependencies. Open it locally
by double-clicking, or share the link above.

## Docs

The concrete workflow behind this page lives in [`docs/`](docs/) — start with
[`docs/onboarding.md`](docs/onboarding.md), which links the coordinator playbook (how a
Claude session runs a track through OpenCode lanes in herdr), the lane brief template,
and the herdr runbook.

## Editing
Everything lives in `index.html`. The 9 pipeline stages are defined in the `S` array near
the bottom of the file (title, lane, owner, description, quality gate, example). Lanes:
`human` (amber), `ai` (cyan), `both` (blend). Edit and commit — GitHub Pages redeploys
automatically.

---

## Installing as a Claude Code skill

This repo is also an installable [Claude Code](https://claude.ai/code) skill: `SKILL.md`
defines the **coordinator** skill — Claude acts as a track coordinator (diagnose, brief,
gate, merge) while OpenCode lanes do the implementation through herdr. The three
documents under [`docs/`](docs/) are its progressive-disclosure references.

**Via the skills CLI (recommended):**

```bash
npx skills add Observerstudio/engineering-workflow
```

**Via git clone:**

```bash
# macOS / Linux
git clone https://github.com/Observerstudio/engineering-workflow ~/.claude/skills/coordinator

# Windows (PowerShell)
git clone https://github.com/Observerstudio/engineering-workflow "$env:USERPROFILE\.claude\skills\coordinator"
```

Only `SKILL.md` and `docs/` are required at runtime. Claude Code picks up skills from
`~/.claude/skills/` automatically.

### Updating

```bash
# skills CLI
npx skills update            # or re-run: npx skills add Observerstudio/engineering-workflow

# git clone install
git -C ~/.claude/skills/coordinator pull
# Windows (PowerShell)
git -C "$env:USERPROFILE\.claude\skills\coordinator" pull
```

The skill triggers on coordinating multi-agent work, dispatching or briefing lanes,
gating PRs, and acting as track coordinator; product repos pin their own specifics in
their agent docs, which the skill reads first.
