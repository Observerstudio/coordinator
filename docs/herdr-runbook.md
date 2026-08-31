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

`send-text` then `send-keys enter` as **SEPARATE calls**. A long message arrives as
paste chunks and the trailing Enter gets absorbed — **ALWAYS read the pane afterwards**
to confirm the message shows in the transcript with the composer empty:

```bash
herdr pane read <id> --source recent-unwrapped --lines 120
```

Composer text (`❯ …`) can be ghost text, not input. If the transcript does not show
your message, resend — do not assume.

## Watching for completion

Monitors grep the pane for the sentinel (`herdr pane wait-output --match/--regex`, or
your own loop over `herdr pane read`):

- **EXCLUDE your own dispatch text from the pattern**, or it false-fires.
- Lanes stall randomly — nudge with "continue"; don't alert.

## Cross-tab etiquette

- Coordinators message coordinators only (and confirm submit).
- The Master coordinator may reply to other tabs' coordinator panes.
- Nobody touches another tab's lanes.
