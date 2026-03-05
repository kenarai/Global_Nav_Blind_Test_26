## Summary

<!--
  Describe what changed and why.
  If this is an accessibility improvement, identify which option(s) are affected.
-->

## Type of Change

- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Accessibility improvement
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation / configuration update
- [ ] Chore / tooling / dependency update

## Options Affected

- [ ] Option 1 (top nav + sidebar)
- [ ] Option 2 (side nav with hover-card flyouts)
- [ ] Option 3 (collapsible side nav, grouped sections)
- [ ] Shared (`src/`) — affects all options

## QA Checklist

### Automated QA (run `/qa-tester` before opening this PR)

- [ ] `/qa-tester` completed with PASSED status
- [ ] `npm run lint` — zero ESLint errors
- [ ] `npm run typecheck` — zero TypeScript errors
- [ ] `npm run test:coverage` — all tests pass, coverage ≥ 80% lines / ≥ 75% branches
- [ ] `npm run test:e2e` — all Playwright tests pass for all affected options

### Quality Gates

- [ ] Critical issues: 0
- [ ] High issues: 0 (includes axe-core a11y violations)
- [ ] Medium issues: 0 (or each has a suppression comment with a ticket reference)
- [ ] Low issues: ≤ 5
- [ ] axe-core violations: 0 (WCAG 2.0 AA)

### Build Verification

- [ ] `npm run build:1` succeeds
- [ ] `npm run build:2` succeeds
- [ ] `npm run build:3` succeeds

### Accessibility Checklist (for UI changes)

- [ ] Skip link (`href="#main-content"`) is still the first focusable element
- [ ] All interactive elements have accessible names (`aria-label` or visible text)
- [ ] Keyboard navigation works: Tab, Shift+Tab, Enter, Escape
- [ ] Focus is not trapped in any component
- [ ] No `outline: none` without a replacement focus style

## Screenshots / Recordings

<!--
  For UI changes, include before/after screenshots or a screen recording.
  For accessibility changes, include axe-core output showing 0 violations.
-->

## Notes for Reviewer

<!--
  Anything the reviewer should pay special attention to.
  Known limitations, follow-up issues, or decisions that were considered and rejected.
-->
