# Bulk suppressions

> [!WARNING]
> This feature is still **experimental**. It might change significantly.

Enabling a rule as `"error"` can be difficult when an established code-base already contains many violations that cannot be auto-fixed.
Stylelint lets you _suppress_ those legacy violations so the rule is enforced **only** for new code. You can then clear the backlog at your own pace.

> [!IMPORTANT]
> Only rules configured with severity `"error"` are suppressed.
> Violations reported as `"warning"` are **not** suppressed.

## CLI options

- `--suppress [<rule>]`: Suppress problems and record them in a suppressions file.
- `--suppress-location <path>`: Path to a suppressions file or directory. Defaults to `stylelint-suppressions.json`.

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

## Automatic pruning of obsolete suppressions

When you use `--suppress` or `--suppress=<rule>`, Stylelint automatically removes obsolete suppressions from the suppressions file. This ensures that the suppressions file always reflects the current state of your codebase.

For example, if you fix all violations for a rule in a file, running `--suppress` again will automatically remove that rule's entry from the suppressions file, keeping it clean and up to date.
