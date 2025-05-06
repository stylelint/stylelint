# Bulk suppressions

Enabling a rule as `"error"` can be difficult when an established code-base already contains many violations that cannot be auto-fixed.
Stylelint lets you _suppress_ those legacy violations so the rule is enforced **only** for new code. You can then clear the backlog at your own pace.

> [!IMPORTANT]
> Only rules configured with severity `"error"` are suppressed.
> Violations reported as `"warning"` are **not** suppressed.

## Suppressions file

The first time you run Stylelint with `--suppress-all` (or `--suppress-rule`), the tool creates a file called `stylelint-suppressions.json` in the current working directory.
This JSON file records which rules are being ignored in which files, so that subsequent runs only report new problems.

> [!TIP]
> Commit the file. Keeping `stylelint-suppressions.json` in version control ensures every developer on the project shares the same baseline.

## Creating the suppressions file

After adding or promoting a rule to `"error"` in your configuration, capture the current violations and write a suppressions file with:

```bash
npx stylelint "**/*.css" --fix --suppress-all
```

This command:

1. Creates or updates `stylelint-suppressions.json` (or the path given by `--suppressions-location`) at the project root.
2. Removes auto-fixable problems (`--fix` is optional but recommended).
3. Mutes every remaining violation so subsequent runs start clean.

Commit the suppressions file so it’s shared with your team.

## Targeting specific rules

Want to mute only certain rules? Use `--suppress-rule` one or more times:

```bash
npx stylelint "**/*.css" --fix \
  --suppress-rule block-no-empty \
  --suppress-rule color-no-invalid-hex
```

Each flag adds or updates the counter for that rule in the suppressions file.

### Changing the location

You can keep the file elsewhere with `--suppressions-location`, but you **must supply the same flag every time you run Stylelint**, even during routine linting, so the tool can locate and maintain the file.

```bash
# Suppress existing errors and write the file into .github/
npx stylelint "**/*.css" \
  --suppress-all \
  --suppressions-location .github/stylelint-suppressions.json

# Later runs need the same flag
npx stylelint "**/*.css" \
  --suppressions-location .github/stylelint-suppressions.json
```

## Pruning obsolete suppressions

Fixing a muted problem leaves an _unused_ counter behind. On the next run Stylelint warns:

```bash
> npx stylelint "**/*.css"
There are suppressions left that do not occur anymore. Consider re-running the command with `--prune-suppressions`.
```

Clean things up with:

```bash
npx stylelint "**/*.css" --prune-suppressions
```

The command removes (or decrements) counters whose violations disappeared, keeping the file tidy.

---

For the full list of CLI flags, see the [Command-line interface](./cli.md) reference.
