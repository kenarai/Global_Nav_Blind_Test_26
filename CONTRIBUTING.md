# Contributing to Global Nav Blind Test

Thank you for contributing. This document covers the full contribution workflow, code style requirements, and the quality gates that every PR must satisfy before merging.

## Table of Contents

- [Development Setup](#development-setup)
- [Branch and Commit Conventions](#branch-and-commit-conventions)
- [Code Style](#code-style)
- [Testing Requirements](#testing-requirements)
- [Quality Gates](#quality-gates)
- [The QA Tester Skill](#the-qa-tester-skill)
- [Pull Request Process](#pull-request-process)
- [Accessibility Requirements](#accessibility-requirements)

---

## Development Setup

```bash
git clone <repo-url>
cd global-nav-blind-test
npm install
cp .env.example .env.local
npm run dev:1   # or dev:2 / dev:3
```

See [README.md](./README.md) for the full quick-start guide and all development commands.

---

## Branch and Commit Conventions

### Branch Names

```
feature/<short-description>
fix/<short-description>
chore/<short-description>
docs/<short-description>
a11y/<short-description>
```

Do not include option numbers in branch names unless the change is isolated to a single option (e.g., `a11y/option-2-hover-card-focus`).

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(option-3): add keyboard trap guard to collapsible nav
fix(a11y): restore focus to trigger after flyout close in option-2
chore(ci): pin playwright browsers to 1.44
docs: add contributing guide
```

---

## Code Style

All style is enforced automatically — run the formatters before pushing.

### TypeScript

- Strict mode is enabled (`noUnusedLocals`, `noUnusedParameters`, strict type checking)
- Never use `any` — use `unknown` and narrow, or define a proper type
- Never use `@ts-ignore` to silence real type errors — fix the underlying issue
- Path aliases: use `@/` for `src/` imports and `@nav/` for the active option's exports

### React

- Functional components only
- Prefer named exports for components
- Keep components small — if a component exceeds ~100 lines, consider splitting
- Do not bypass accessibility features (skip links, ARIA attributes, focus management)

### CSS Modules

- One `.module.css` file per component
- Use design tokens from `src/styles/tokens.css` for all spacing, color, and typography values
- Never use inline `color` or `font-size` values that duplicate tokens
- Touch targets must be at minimum 44×44 px for all interactive elements

### Formatting (Prettier)

```bash
npm run format
```

Configuration in `.prettierrc`:

| Setting | Value |
|---------|-------|
| `singleQuote` | `true` |
| `semi` | `true` |
| `tabWidth` | `2` |
| `printWidth` | `100` |
| `trailingComma` | `"es5"` |
| `arrowParens` | `"avoid"` |

### Linting (ESLint)

```bash
npm run lint
```

All ESLint errors must be resolved. Never use `// eslint-disable` to suppress real issues. If a rule produces a false positive for a justified reason, add a suppression comment with a written explanation on the line above.

---

## Testing Requirements

Every code change must be accompanied by tests. The framework is **Vitest** for unit/component tests and **Playwright** for E2E.

### Coverage Targets

| Metric | Threshold |
|--------|-----------|
| Line coverage | ≥ 80% |
| Branch coverage | ≥ 75% |
| Function coverage | ≥ 75% |
| Critical paths (routing, nav state, a11y) | 100% |

### Running Tests

```bash
npm test                 # Vitest watch mode
npm run test:coverage    # Single run with coverage report
npm run test:e2e         # Playwright (all 3 nav options)
```

### Writing Tests

- Place unit tests adjacent to the source file: `Tooltip.test.tsx` next to `Tooltip.tsx`
- Use `@testing-library/react` render utilities and `@testing-library/user-event` for interactions
- Use `@testing-library/jest-dom` matchers (`toBeInTheDocument`, `toHaveAccessibleName`, etc.)
- Test components at the behavior level — avoid testing implementation details
- For accessibility, use `@axe-core/playwright` in E2E tests to assert 0 violations

---

## Quality Gates

These gates are non-negotiable. A PR cannot merge if any gate is red.

| Severity | Threshold |
|----------|-----------|
| Critical issues | 0 allowed |
| High issues (includes a11y violations) | 0 allowed |
| Medium issues | 0 allowed (or suppressed with a written ticket reference) |
| Low issues | ≤ 5, each noted |
| axe-core violations | 0 (WCAG 2.0 AA) |
| Line coverage | ≥ 80% |
| Branch coverage | ≥ 75% |

---

## The QA Tester Skill

This project uses an autonomous QA skill invokable via Claude Code:

```
/qa-tester
```

Or scoped to a specific file or directory:

```
/qa-tester Option_2/Nav.tsx
/qa-tester src/components/
```

The skill runs a three-phase loop:

1. **ANALYZE** — Detects the stack, maps source files to test coverage, produces a Bug Risk Report
2. **GENERATE** — Writes unit, integration, E2E, and accessibility tests for all untested code
3. **VALIDATE** — Executes the full suite in a loop, fixing failures autonomously, until all gates are green

The skill will not stop until all quality gates pass or it escalates with a Diagnostic Report after three stuck attempts.

**Run `/qa-tester` before opening a PR.** The CI pipeline runs the same checks and blocks merge on any failure.

See [`.claude/skills/qa-tester.md`](./.claude/skills/qa-tester.md) for the full skill specification.

---

## Accessibility Requirements

Because this is a navigation blind test, accessibility is a first-class requirement — not an afterthought.

Every UI contribution must:

1. Pass axe-core with **0 violations** at WCAG 2.0 AA
2. Be fully keyboard-navigable (Tab, Shift+Tab, Enter, Escape, arrow keys where appropriate)
3. Have correct ARIA labels, roles, and states on all interactive elements
4. Not remove or weaken the skip link (`href="#main-content"`) — it must remain the first focusable element
5. Maintain visible focus indicators — never use `outline: none` without a replacement focus style
6. Meet color contrast minimums (4.5:1 for normal text, 3:1 for large text and UI components)
7. Have touch targets ≥ 44×44 px

---

## Pull Request Process

1. Create a feature branch from `main`
2. Make changes and write tests covering new code
3. Run `/qa-tester` and confirm all gates are green
4. Run `npm run typecheck` and `npm run lint` locally
5. Open a PR — fill in the PR template completely
6. CI will run: `lint-typecheck` → `test` + `e2e` → `build:1` + `build:2` + `build:3`
7. All CI checks must pass before the PR can be merged
8. At least one reviewer approval is required

Do not force-push to `main`. Do not merge your own PR without review.
