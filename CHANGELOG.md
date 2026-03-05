# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

---

## [0.1.0] — 2026-03-04

### Added

- Initial implementation of three mutually exclusive global navigation designs:
  - **Option 1**: Top navigation bar with expandable right sidebar (column layout)
  - **Option 2**: Left side nav rail with hover-card flyout panels (collapsible, 64px / 204px)
  - **Option 3**: Collapsible side nav with grouped sections and badge infrastructure
- Shared application shell (`src/`) with `BrowserRouter`, `NavCollapseContext`, and a `GenericPage` route catch-all
- Custom `Tooltip` component using `createPortal` for overflow-safe placement (Options 2 & 3)
- Custom SVG icon components: `ExpandNavIcon`, `CollapseNavIcon`
- Design token system (`src/styles/tokens.css`): color palette, spacing scale (1–12), typography, focus ring, z-index, nav dimensions
- Accessible focus styles and skip link (`href="#main-content"`) in `global.css`
- Three-way Vite build configuration: `VITE_OPTION=1|2|3` with per-option `outDir` and dev-server port assignment (5171/5172/5173)
- `@nav` path alias resolving to the active option's directory at build time
- `__ACTIVE_OPTION__` build-time constant injected into all bundles
- ESLint configuration with TypeScript, React, and React Hooks plugins
- Prettier configuration (`singleQuote`, `semi`, `tabWidth: 2`, `printWidth: 100`)
- QA skill: `/qa-tester` autonomous three-phase test loop (`.claude/skills/qa-tester.md`)
- CLAUDE.md QA mandate with accessibility requirements and quality gates
- Team onboarding files: `README.md`, `CONTRIBUTING.md`, `.editorconfig`, `.env.example`
- Test runner configs: `vitest.config.ts` (coverage v8, thresholds), `playwright.config.ts` (3 projects)
- VS Code shared workspace config: `settings.json`, `extensions.json`, `launch.json`
- GitHub Actions CI pipeline: lint → test → E2E → build matrix
- GitHub issue templates (bug report, feature request) and PR template

[Unreleased]: https://github.com/your-org/global-nav-blind-test/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/your-org/global-nav-blind-test/releases/tag/v0.1.0
