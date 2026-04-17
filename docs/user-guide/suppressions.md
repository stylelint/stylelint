# Bulk suppressions

> [!WARNING]
> This feature is **experimental**, and might change significantly.

Turning on a rule with the severity of `error` can be difficult when an established codebase already contains many problems that can't be auto-fixed. You can suppress those legacy problems so the rule is enforced only for new code, and then clear the backlog at your own pace.

## `--suppress [<rule>]`

Suppress problems that have the severity of `error` and record them in a file.

If no rule is specified, all problems are suppressed. Otherwise, only problems with the given rules are suppressed, e.g., `--suppress rule1 --suppress rule2`.

Subsequent runs without the `--suppress` flag will not report these problems, unless there are more problems for the same rule in the same file.

> [!TIP]
> We recommend committing the suppressions file to your repository and using the `--fix` option alongside the `--suppress`.

> [!NOTE]
> `--suppress` can't be combined with stdin input (e.g., piping code via `echo "..." | stylelint`).

## `--suppress-location <path>`

Path to a suppressions file or directory. Defaults to `stylelint-suppressions.json`.

If you specify a directory path, Stylelint will create a file named `stylelint-suppressions.json` in that directory.

> [!IMPORTANT]
> You must use `--suppress-location` on all subsequent runs, even when not using the `--suppress` flag.
