# coordinator — a Claude Code skill

Claude acts as a **track coordinator**: it diagnoses, writes lane briefs, gates every PR with a
ten-item cold review, and merges, while implementation happens in lanes (OpenCode or Claude Code
panes it drives through herdr). One session per track; the coordinator writes no feature code.

## Install

```bash
npx skills add Observerstudio/coordinator
```

One command; works for Claude Code and other agents supported by [skills.sh](https://www.skills.sh/).

Without the skills CLI:

```bash
# macOS / Linux
git clone https://github.com/Observerstudio/coordinator ~/.claude/skills/coordinator

# Windows (PowerShell)
git clone https://github.com/Observerstudio/coordinator "$env:USERPROFILE\.claude\skills\coordinator"
```

Only `SKILL.md` and `docs/` are used at runtime; Claude Code picks up skills from `~/.claude/skills/`.

Update: `npx skills update`, or `git -C ~/.claude/skills/coordinator pull`.

## What is in here

| File | Purpose |
|---|---|
| `SKILL.md` | The skill: role, the gate, sentinel contract, one integration slot, pane discipline, OCH-as-ledger conventions, standing rules |
| `docs/onboarding.md` | Start here as a new coordinator |
| `docs/coordinator-playbook.md` | Full operating model with worked examples |
| `docs/lane-brief-template.md` | The exact brief format lanes receive, plus the fixture contract |
| `docs/review-rubric.md` | The ten-item cold-review scorecard and the metrics line |
| `docs/herdr-runbook.md` | Pane mechanics: split, boot, send/read, watch |

The skill triggers on coordinating multi-agent work, dispatching or briefing lanes, gating PRs, and
"act as coordinator". Product repos pin their own specifics in their agent docs (`CLAUDE.md`), which
the skill reads first.

Used with [OCH — Observer Coordination Hub](https://github.com/Observerstudio/observer-coordination-hub),
where claims, messages and knowledge live on a hub and the `och` plugin feeds them to every session.
