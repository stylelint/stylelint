# linebreak

Enforces a consistent linebreak style.

The `--fix` option on the [command line](../../../docs/user-guide/cli.md#autofixing-errors) can automatically fix all of the problems reported by this rule.

## Options

`string`: `"unix"|"windows"`

### `"unix"`

Requires LF (`\n`) linebreaks.

Lines with CRLF linebreaks are considered violations.

### `"windows"`

Requires CRLF (\r\n) linebreaks.

Lines with LF linebreaks are considered violations.
