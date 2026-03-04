# Skills — Quick Reference

## Available Skills

### `/qa-tester`
Turns Claude Code into a relentless autonomous QA agent.

**Invoke with:**
```
/qa-tester
```
or scope to a specific path:
```
/qa-tester src/components/GlobalNav
```

**What it does (3 phases):**

| Phase | Name | What happens |
|-------|------|-------------|
| 1 | ANALYZE | Detects stack, maps source vs test files, produces a Bug Risk Report |
| 2 | GENERATE | Writes unit, integration, E2E, and accessibility tests for all untested code |
| 3 | VALIDATE | Runs the suite in a loop — fixing failures and re-running until all gates are green |

**Exit condition:** The agent stops ONLY when:
- All tests pass (exit code 0)
- Coverage ≥80% lines, ≥75% branches, 100% critical paths
- 0 axe-core a11y violations
- 0 Critical / High / Medium issues

**Stuck loop:** If the same failure persists after 3 fix attempts, the agent produces a Diagnostic Escalation Report and surfaces it to you instead of looping forever.

---

## Frameworks Supported (auto-detected)

| Language | Runners |
|----------|---------|
| JavaScript / TypeScript | Jest, Vitest, Mocha, Playwright, Cypress, WebdriverIO |
| Python | pytest, unittest, Selenium, Playwright-python |
| Rust | cargo test |
| Go | go test |
| Java | JUnit (Maven / Gradle) |

---

## Quality Gates

| Severity | Threshold |
|----------|-----------|
| Critical | 0 |
| High (incl. a11y) | 0 |
| Medium | 0 or suppressed with justification |
| Low | ≤5 with notes |

---

## Key Rules (Loki Mode)
- Never deletes or skips failing tests
- Never uses `@ts-ignore` / `eslint-disable` to hide real bugs
- Never mocks away broken logic
- Makes minimum viable fixes only
- Does not ask questions mid-loop

---

## Adding More Skills
Place any `.md` file in this directory. Claude Code will pick it up as an invocable skill via `/<filename-without-extension>`.
