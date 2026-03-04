# Global Nav Blind Test — QA Environment

## Project Purpose
This repository is a navigation accessibility test harness ("blind test") that validates global navigation components across different surfaces, states, and assistive technology contexts. Every contribution must be accompanied by passing tests.

## QA-First Mandate
All work in this repository defaults to QA mode. The primary skill for this project is `/qa-tester`. Run it on any new code before considering a task complete.

## Stack Auto-Detection
The QA skill automatically detects the tech stack from:
- `package.json` → Node.js/TypeScript (Jest, Vitest, Playwright, Cypress)
- `pyproject.toml` / `requirements.txt` → Python (pytest, Selenium, Playwright)
- `Cargo.toml` → Rust (cargo test)
- `go.mod` → Go (go test)
- `pom.xml` / `build.gradle` → Java (JUnit)

Do not override framework detection unless explicitly needed.

## Quality Gates (non-negotiable)
| Severity | Threshold |
|----------|-----------|
| Critical | 0 allowed |
| High     | 0 allowed |
| Medium   | 0 allowed (or suppressed with written justification) |
| Low      | ≤5 with notes |

No PR or commit should leave the repository with unresolved Critical/High/Medium issues.

## Accessibility Requirements
Because this is a navigation blind test, every UI component must:
- Pass axe-core or equivalent a11y audit with 0 violations
- Be fully keyboard-navigable
- Have ARIA labels and roles validated
- Be tested with screen-reader simulation patterns (where tooling allows)

## Invoking the QA Skill
```
/qa-tester [optional: path/to/file-or-directory]
```

The skill will execute a full Analyze → Generate → Validate loop autonomously.
See `.claude/skills/README.md` for details.
