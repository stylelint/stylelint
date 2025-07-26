# Bulk suppressions

> [!WARNING]
> This feature is still **experimental**. It might change significantly.

Enabling a rule as `"error"` can be difficult when an established code-base already contains many violations that cannot be auto-fixed.
Stylelint lets you _suppress_ those legacy violations so the rule is enforced **only** for new code. You can then clear the backlog at your own pace.

> [!IMPORTANT]
> Only rules configured with severity `"error"` are suppressed.
> Violations reported as `"warning"` are **not** suppressed.

## Suppressions file

The first time you run Stylelint with `--suppress` (or `--suppress=<rule>`), the tool creates a file called `stylelint-suppressions.json` in the current working directory.
This JSON file records which rules are being ignored in which files.

If more violations are found for the same rule in the same file, Stylelint will report all of them. For example, if a file originally had 2 suppressed violations but now has 5, Stylelint will display all 5 violations.

> [!TIP]
> Commit the suppressions file to your repository so all team members share the same baseline.

## Creating the suppressions file

After adding or promoting a rule to `"error"` in your configuration, capture the current violations and write a suppressions file with:

```shell
stylelint "**/*.css" --fix --suppress
```

This command:

1. Creates or updates `stylelint-suppressions.json` (or the path given by `--suppress-location`) at the project root.
2. Removes auto-fixable problems (`--fix` is optional but recommended).
3. Mutes every remaining violation so subsequent runs start clean.

## Targeting specific rules

Want to mute only certain rules? Use `--suppress=<rule>` one or more times:

```shell
stylelint "**/*.css" --fix \
  --suppress=block-no-empty \
  --suppress=color-no-invalid-hex
```

Each flag adds or updates the counter for that rule in the suppressions file.

## Changing the location

You can keep the file elsewhere with `--suppress-location`, but you **must supply the same flag every time you run Stylelint**, even during routine linting, so the tool can locate and maintain the file.

If you specify a directory path, Stylelint will create a file named `stylelint-suppressions.json` in that directory. If you specify a file path, Stylelint will use that exact filename.

```shell
# Suppress existing errors and write the file into a subdirectory
stylelint "**/*.css" \
  --suppress \
  --suppress-location foo/

# Or specify a custom filename
stylelint "**/*.css" \
  --suppress \
  --suppress-location .stylelint-suppressions-foo.json

# Later runs need the same flag
stylelint "**/*.css" \
  --suppress-location .stylelint-suppressions-foo.json
```

## Pruning obsolete suppressions

Fixing a muted problem leaves an _unused_ counter behind. On the next run Stylelint warns:

```sh-session
$ stylelint "**/*.css"
There are suppressions left that do not occur anymore. Consider re-running the command with `--suppress-prune`.
```

### Why use --suppress-prune instead of --suppress?

While `--suppress` would update the suppressions file, it would also **add new violations** to the baseline, potentially hiding regressions. Use `--suppress-prune` to **only remove** obsolete suppressions without affecting new violations.

Clean things up with:

```shell
stylelint "**/*.css" --suppress-prune
```

The command removes (or decrements) counters whose violations disappeared, keeping the file tidy.
