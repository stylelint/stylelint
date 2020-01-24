# Options

Options shared by the:

-   [CLI](usage/cli.md)
-   [Node.js API](usage/node-api.md)
-   [PostCSS plugin](usage/postcss-plugin.md)

## `configFile` | `--config`

Path to a JSON, YAML, or JS file that contains your [configuration object](configure.md).

Use this option if you don't want stylelint to search for a configuration file.

The path should be either absolute or relative to the directory that your process is running from (`process.cwd()`).

## `configBasedir` | `--config-basedir`

Absolute path to the directory that relative paths defining "extends" and "plugins" are _relative to_. Only necessary if these values are relative paths.

## `fix` | `--fix`

Automatically fix, where possible, violations reported by rules.

For CSS with standard syntax, stylelint uses [postcss-safe-parser](https://github.com/postcss/postcss-safe-parser) to fix syntax errors.

**Note:** This is an _experimental_ feature. It currently does not respect special comments for disabling stylelint within sources (e. g. `/* stylelint-disable */`). Autofixing is applied regardless of these comments.

## `formatter` | `--formatter, -f` / `--custom-formatter`

Specify the formatter to format your results.

Options are:

-   `compact`
-   `json` (default for Node API)
-   `string` (default for CLI)
-   `unix`
-   `verbose`

The `formatter` Node.js API option can also accept function, whereas the `--custom-formatter` CLI flag accepts a path to a JS file exporting one. The function in both cases must fit the signature described in the [Developer Guide](../developer-guide/formatters.md).

## `cache` | `--cache`

Store the info about processed files to only operate on the changed ones the next time you run stylelint. By default, the cache is stored in `./.stylelintcache` in `process.cwd()`.

Enabling this option can dramatically improve stylelint's speed because only changed files are linted.

**Note:** If you run stylelint with `cache` and then run stylelint without `cache`, stylelint deletes the `.stylelintcache` because we have to assume that that second command invalidated `.stylelintcache`.

## `cacheLocation` | `--cache-location`

Path to a file or directory for the cache location.

If a directory is specified, stylelint creates a cache file inside the specified folder. The name of the file is based on the hash of `process.cwd()` (e.g. `.cache_hashOfCWD`) so that stylelint can reuse a single location for a variety of caches from different projects.

**Note:** If the directory of `cacheLocation` does not exist, make sure you add a trailing `/` on \*nix systems or `\` on Windows. Otherwise, stylelint assumes the path to be a file.

## `maxWarnings` | `--max-warnings, --mw`

Set a limit to the number of warnings accepted.

It is useful when setting `defaultSeverity` to `"warning"` and expecting the process to fail on warnings (e.g. CI build).

For the CLI, the process exits with code `2` if the number of warnings exceeds this value.

For the Node.js API, the returned data contains a `maxWarningsExceeded` property if the number of found warnings exceeds the given limit. The value is an Object (e.g. `{ maxWarnings: 0, foundWarnings: 12 }`).

## `syntax` | `--syntax, -s`

Specify a syntax. Options:

-   `css`
-   `css-in-js`
-   `html`
-   `less`
-   `markdown`
-   `sass`
-   `scss`
-   `sugarss`

If you do not specify a syntax, stylelint automatically infer the syntaxes.

Only use this option if you want to force a specific syntax.

## `customSyntax` | `--custom-syntax`

Module name or path to a JS file exporting a [PostCSS-compatible syntax](https://github.com/postcss/postcss#syntaxes).

Note, however, that stylelint can provide no guarantee that core rules work with syntaxes other than the defaults listed for the `syntax` option above.

## `ignoreDisables` | `--ignore-disables, --id`

Ignore `styleline-disable` (e.g. `/* stylelint-disable block-no-empty */`) comments.

You can use this option to see what your linting results would be like without those exceptions.

## `reportNeedlessDisables` | `--report-needless-disables, --rd`

Produce a report to clean up your codebase, keeping only the stylelint-disable comments that serve a purpose.

For the CLI, the process exits with code `2` if needless disables are found.

For the Node.js API, `ignoreDisables` is also set to `true`, and the returned data contains a `needlessDisables` property, whose value is an array of objects, one for each source, with tells you which stylelint-disable comments are not blocking a lint violation.

Also, report errors for stylelint-disable comments that are not blocking a lint warning.

## `reportInvalidScopeDisables` | `--report-invalid-scope-disables, --risd`

Produce a report of the stylelint-disable comments that used for rules that don't exist within the configuration object.

For the CLI, the process exits with code `2` if invalid scope disables are found.

For the Node.js API, the returned data contains a `invalidScopeDisables` property, whose value is an array of objects, one for each source, with tells you which rule in `stylelint-disable <rule>` comment don't exist within the configuration object.

## `disableDefaultIgnores` | `--disable-default-ignores, --di`

Disable the default ignores. stylelint will not automatically ignore the contents of `node_modules`.

## `ignorePath` | `--ignore-path, -i`

A path to a file containing patterns describing files to ignore. The path can be absolute or relative to `process.cwd()`. By default, stylelint looks for `.stylelintignore` in `process.cwd()`.

## `codeFilename` | `--stdin-filename`

A filename to assign stdin input.

If using `code` to pass a source string directly, you can use `codeFilename` to associate that code with a particular filename.
