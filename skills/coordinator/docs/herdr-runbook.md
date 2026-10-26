# Herdr runbook — spawning and driving lanes

The mechanics of driving OpenCode lane panes with herdr, verified against herdr as
installed. Run all commands from inside your own herdr session (the `herdr` CLI talks
to the current session only). See [coordinator-playbook.md](coordinator-playbook.md)
for the operating model around these mechanics.

## Spawn a lane

```bash
herdr pane split <my-pane> --direction down --cwd <repo> --no-focus
```

- The new pane lands in the **TARGET's** tab — always split from your own pane.
- **ALWAYS** rename immediately, in the next command:

  ```bash
  herdr pane rename <id> "<label>"
  ```

- Resolve panes by label via `herdr pane get`, never by position. Parse pane ids from
  command output; sidebar order lies.

## Boot the agent

Send the boot text and Enter as separate calls, then wait:

```bash
herdr pane send-text <id> "opencode"
herdr pane send-keys <id> enter    # ~12s to boot
```

Before dispatching any work:

- **Check the model line.** Never GLM; pick the cheapest adequate model (the
  `/models` picker).
- `/new` between tasks on a reused pane — then send the brief pointer with `/ponytail full` on the
  same message (e.g. `/ponytail full — cd <worktree> and read LANE-BRIEF.md …`). For an OpenCode
  lane that command IS the activation: the plugin is installed via `opencode.json` and the command
  sets the mode for that session, so there is no extra step and no pasted rule text. (A repo that
  runs a Claude Code agent as a lane instead can activate the mode from a session-start hook; then
  the command is redundant, not required.)
- Close panes when a track ends.
- Two live lanes max per tab.

## Sending work

Once the agent is up (`herdr agent list` shows the pane), use `agent prompt`, not
`pane send-text`. One call submits text + Enter, honours bracketed paste, and waits for
the agent to settle:

```bash
herdr agent prompt <id> "/ponytail full — cd <worktree> and read LANE-BRIEF.md …" --wait --timeout 600000
herdr agent read <id> --source recent-unwrapped --lines 120
```

- `--wait` matches `idle`, `done` or `blocked` by default. Keep the default: an unfocused
  pane settles as `done`, so `--until idle` alone runs to the timeout (verified 2026-09-07).
- `agent_blocked` means the agent is sitting on an approval or question — read the pane and
  answer it, don't resubmit. `agent_prompt_stalled` means nothing changed within 5 s —
  read the pane; the text may not have landed.
- A brief still goes in a file; the prompt carries a one-line pointer.
- Composer text (`❯ …`) can be ghost text, not input. Never send a bare Enter at it — a
  ghost line does not submit. Prompt again instead.
- ALWAYS read back and confirm the transcript shows your text.

For a pane with no agent yet (booting, or a shell/hub pane), `pane send-text` then
`pane send-keys enter` as separate calls, then read back.

## Watching for completion

Settled is NOT finished — `LANE-DONE` is. Wait for the agent, then read the transcript:

```bash
herdr agent wait <id> --timeout 1800000      # idle|done|blocked
herdr agent read <id> --source recent-unwrapped --lines 120
```

- Grep the read-back for the sentinel and **EXCLUDE your own dispatch text** from the
  pattern, or it false-fires.
- Settled with no sentinel → the lane stalled; nudge with `agent prompt <id> "continue"`.
- `blocked` → an approval/question UI is up; read the pane and answer it.
- `pane wait-output --regex` still works when you want a raw output match without agent
  lifecycle interpretation.

## Cross-tab etiquette

- Coordinators message coordinators only (and confirm submit).
- The Master coordinator may reply to other tabs' coordinator panes.
- Nobody touches another tab's lanes.
