# Global Nav Blind Test

A navigation accessibility blind test harness. Three mutually exclusive navigation designs (`Option_1`, `Option_2`, `Option_3`) are built from a single codebase and evaluated against identical accessibility criteria.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Development](#development)
- [Building](#building)
- [Testing](#testing)
- [Linting and Formatting](#linting-and-formatting)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Contributing](#contributing)

---

## Overview

This repository implements three navigation designs as separate Vite builds controlled by the `VITE_OPTION` environment variable. Each option runs on its own dev-server port for parallel comparison. The test harness validates keyboard navigation, ARIA semantics, skip links, and WCAG 2.0 AA compliance across all three options.

---

## Architecture

```
single vite.config.ts
  └─ VITE_OPTION=1  →  Option_1/Nav.tsx  (top bar + sidebar layout)
  └─ VITE_OPTION=2  →  Option_2/Nav.tsx  (side nav, hover-card flyouts)
  └─ VITE_OPTION=3  →  Option_3/Nav.tsx  (collapsible side nav, grouped sections)
```

The `@nav` path alias always resolves to the active option's directory. The build-time constant `__ACTIVE_OPTION__` is injected into every bundle so components can conditionally render layout differences.

---

## Prerequisites

| Tool | Required Version |
|------|-----------------|
| Node.js | ≥ 20.0.0 |
| npm | ≥ 10.0.0 |

Check your versions:

```bash
node -v
npm -v
```

> **Windows users:** The `dev:*` and `build:*` scripts use POSIX environment variable syntax (`VITE_OPTION=X vite`). Install [`cross-env`](https://github.com/kentcdodds/cross-env) and prefix commands with `cross-env` if running on Windows natively. Consider using WSL2 for a smoother experience.

---

## Quick Start

```bash
# 1. Clone and install
git clone <repo-url>
cd global-nav-blind-test
npm install

# 2. Copy environment template
cp .env.example .env.local

# 3. Start a dev server (pick one option)
npm run dev:1   # Option 1 → http://localhost:5171
npm run dev:2   # Option 2 → http://localhost:5172
npm run dev:3   # Option 3 → http://localhost:5173
```

---

## Development

Three dev servers can run simultaneously on different ports for side-by-side comparison:

```bash
# Terminal 1
npm run dev:1   # http://localhost:5171  — top nav + sidebar

# Terminal 2
npm run dev:2   # http://localhost:5172  — side nav, hover-card flyouts

# Terminal 3
npm run dev:3   # http://localhost:5173  — collapsible side nav, grouped sections
```

Each server uses Vite HMR. Changes to shared `src/` files hot-reload in all running servers simultaneously. Changes to `Option_X/` files hot-reload only in that option's server.

---

## Building

```bash
npm run build:1   # → dist/option-1/
npm run build:2   # → dist/option-2/
npm run build:3   # → dist/option-3/
```

Preview a production build locally:

```bash
npm run preview:1   # serves dist/option-1
npm run preview:2   # serves dist/option-2
npm run preview:3   # serves dist/option-3
```

---

## Testing

### Unit / Component Tests (Vitest)

```bash
npm test                 # watch mode (re-runs on file changes)
npm run test:ui          # browser-based test UI
npm run test:coverage    # single run with coverage report
```

Coverage thresholds (enforced, build fails below these):

| Metric | Threshold |
|--------|-----------|
| Lines | ≥ 80% |
| Branches | ≥ 75% |
| Functions | ≥ 75% |
| Statements | ≥ 80% |

Coverage reports are written to `coverage/` (HTML, JSON, LCOV).

### End-to-End Tests (Playwright)

```bash
# Install browser binaries — required once after cloning
npx playwright install

npm run test:e2e
```

Playwright runs three test projects in parallel — one per nav option — targeting ports 5171, 5172, and 5173. It starts the Vite dev servers automatically before the tests run.

HTML report is written to `playwright-report/`.

### Type Checking

```bash
npm run typecheck
```

---

## Linting and Formatting

```bash
npm run lint       # ESLint across src/ and all Option_X/
npm run format     # Prettier write across src/ and all Option_X/
```

---

## Environment Variables

See [`.env.example`](./.env.example) for the full list of supported variables with descriptions.

Copy it to `.env.local` for local overrides (`.env.local` is gitignored):

```bash
cp .env.example .env.local
```

The only variable required for local development is `VITE_OPTION`, which is set automatically by the `dev:*` and `build:*` npm scripts. You do not need to configure it manually.

---

## Project Structure

```
├── src/                        # Shared application shell
│   ├── App.tsx                 # Root component — layout switching per option
│   ├── main.tsx                # Entry point
│   ├── navCollapseContext.ts   # Collapse state context (Options 2 & 3)
│   ├── components/
│   │   └── Tooltip.tsx         # Shared tooltip (portal-based)
│   ├── icons/                  # Custom SVG icon components
│   ├── pages/
│   │   └── GenericPage.tsx     # Route catch-all page stub
│   ├── styles/
│   │   ├── global.css          # Reset + skip-link + focus ring styles
│   │   └── tokens.css          # Design tokens (colors, spacing, typography)
│   └── test/
│       └── setup.ts            # Vitest setup (jest-dom matchers)
├── Option_1/                   # Top nav + right sidebar layout
│   ├── Nav.tsx
│   └── nav.module.css
├── Option_2/                   # Left side nav with hover-card flyouts
│   ├── Nav.tsx
│   └── nav.module.css
├── Option_3/                   # Collapsible side nav with grouped sections
│   ├── Nav.tsx
│   └── nav.module.css
├── e2e/                        # Playwright E2E tests (add files here)
├── .claude/skills/             # Claude Code skills
│   └── qa-tester.md            # /qa-tester autonomous QA skill
├── .github/
│   ├── workflows/ci.yml        # GitHub Actions CI pipeline
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── ISSUE_TEMPLATE/
├── .vscode/                    # Shared VS Code workspace config
├── vitest.config.ts            # Vitest unit test config + coverage thresholds
├── playwright.config.ts        # 3 Playwright test projects (one per option)
├── vite.config.ts              # Port/alias/define config
└── tsconfig.json
```

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the contribution process, code style guide, and PR checklist.

All contributions must pass the QA gates defined in [CLAUDE.md](./CLAUDE.md) before merging.

The primary QA tool for this project is the `/qa-tester` Claude Code skill — run it on any new code before opening a PR.
