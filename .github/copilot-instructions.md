# GitHub Copilot Instructions

## Project Overview

stylelint is a CSS linter built on [PostCSS](https://postcss.org/). It is written entirely in **ES Modules** (`.mjs` file extensions). No CommonJS (`require`/`module.exports`) is used anywhere in the codebase.

## Architecture

- **Rules**: `lib/rules/<rule-name>/index.mjs` — each rule has its own directory.
- **Formatters**: `lib/formatters/` — output formatters for lint results.
- **Tests**: `__tests__/` directories colocated with the source they test.
- **Test utilities**: `lib/testUtils/` — shared helpers for writing rule tests.
- **Standalone API**: `lib/standalone.mjs` — main entry point for Node.js API usage.

## Code Conventions

- Use **ES Modules** (`import`/`export`) exclusively. Never use `require()` or `module.exports`.
- All files use the `.mjs` extension.
- Use **Jest** for all tests.
- Follow the existing patterns in `lib/rules/` when adding or modifying rules.
- Use utilities from `lib/utils/` and `lib/testUtils/` where applicable.

## Testing Patterns

- Every rule must have tests in its `__tests__/` directory.
- Follow the existing structure: acceptance cases (`accept`) and rejection cases (`reject`).
- Run tests with `node --experimental-vm-modules node_modules/.bin/jest`.

## Commit Conventions

- Write clear, descriptive commit messages using the **imperative mood** (e.g. `Fix bug` not `Fixed bug`).
- Keep commits **focused and atomic** — one logical change per commit.
- Reference the relevant issue number in the commit message where applicable (e.g. `Fix foo (#1234)`).

## Push & Branching Rules

- **Never force push** (`git push --force`) to shared or protected branches.
- Always work on a **feature branch** and open a **Pull Request** for review.
- **Never push directly to `main`**.
- Branch names should be descriptive (e.g. `add-copilot-instructions`, `fix-rule-foo`).

## Contribution Guidelines

- Read [`CONTRIBUTING.md`](../CONTRIBUTING.md) before contributing.
- Follow the contributor guide in [`docs/contributor-guide/`](../docs/contributor-guide/).
- All new rules and changes to existing rules must include tests.
- Do not bypass the PR review process.

## References

- [User guide](../docs/user-guide/)
- [Contributor guide](../docs/contributor-guide/)
- [Developer guide](../docs/developer-guide/)
