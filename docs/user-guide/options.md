# Options

Options shared by the:

- [CLI](cli.md)
- [Node.js API](node-api.md)
- [PostCSS plugin](postcss-plugin.md)

You can use some of these options in the [configuration object](./configure.md).

## `allowEmptyInput`

CLI flag: `--allow-empty-input, --aei`

Stylelint does not throw an error when glob pattern matches no files.

## `configFile`

CLI flag: `--config, -c`

Path to a JSON, YAML, or JS file that contains your [configuration object](./configure.md).

Use this option if you don't want Stylelint to search for a configuration file.

The path should be either absolute or relative to the directory that your process is running from (`process.cwd()`).

## `configBasedir`

CLI flag: `--config-basedir`

Absolute path to the directory that relative paths defining "extends", "plugins", and "customSyntax" are _relative to_. Only necessary if these values are relative paths.

## `fix`

CLI flag: `--fix`

Automatically fix, where possible, problems reported by rules.

Options are:

- `"lax"` (default) - uses [postcss-safe-parser](https://www.npmjs.com/package/postcss-safe-parser) to fix as much as possible, even when there are syntax errors
- `"strict"` - uses [PostCSS Parser](https://postcss.org/api/#postcss-parser) and only fixes problems when there are no syntax errors

> [!TIP]
> If you don't care about strictness now, we recommend using `--fix` without any option because `"strict"` may become the default in the future.

When using the Node.js API, the autofixed code is available as the value of the `code` property in the returned object.

When a rule relies on the deprecated [`context`](../developer-guide/rules.md#context)`.fix` and a source contains:

- a scoped disable comment, e.g. `/* stylelint-disable color-named */`, any problems reported by the scoped rule will not be automatically fixed anywhere in the source
- an unscoped disable comment, i.e. `/* stylelint-disable */`, the entirety of the source will not be automatically fixed for that rule

## `computeEditInfo`

CLI flag: `--compute-edit-info, --cei`

Compute edit information for autofixable rules.

The edit information will not be computed when:

- the [`fix` option](#fix) is enabled
- a rule's fix is disabled:
  - in the configuration object, e.g. `"rule-name": [true, { disableFix: true }]`
  - using configuration comments, e.g. `/* stylelint-disable rule-name */`
- another edit has already been computed for the same code region

See [Node.js API Warning details](./node-api.md#edit-info).

## `customSyntax`

CLI flag: `--custom-syntax`

Specify a custom syntax to use on your code.

There are many styling languages, ranging from CSS language extensions like SCSS to entirely different notations, e.g. CSS-in-JS objects.

These styling languages can be embedded within other languages too. For example:

- HTML `<style>` tags
- markdown fences
- JavaScript template literals

This option allows Stylelint to transform these into something that resembles CSS, which is the language that:

- underpins all the other styling languages
- is best understood by rules built into Stylelint

This option should be a string that resolves to a JS module that exports a [PostCSS-compatible syntax](https://github.com/postcss/postcss#syntaxes). The string can be a module name (like `my-module`) or a path to a JS file (like `path/to/my-module.js`).

If you want to lint two or more different languages, you can combine `customSyntax` with the [`overrides`](./configure.md#overrides) configuration property.

Using the Node.js API, the `customSyntax` option can also accept a [Syntax object](https://postcss.org/docs/how-to-write-custom-syntax#syntax). Stylelint treats the `parse` property as a required value. Also, Stylelint supports syntax modules written in ESM.

> [!NOTE]
> Stylelint can provide no guarantee that core rules work with custom syntaxes.

## `formatter`

CLI flags: `--formatter, -f` | `--custom-formatter`

Specify the formatter to format your results.

Options are:

- `compact` - generates output similar to ESLint's compact formatter
- `github` - generates messages via [workflow commands for GitHub Actions](https://docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions) (DEPRECATED)
- `json` (default for Node API) - generates [JSON](https://www.json.org) that can be consumed by another tool
- `string` (default for CLI) - generates human-readable strings
- `tap` - generates [Test Anything Protocol](http://testanything.org/) output
- `unix` - generates messages like a C compiler, so that tools like Emacs' _Compilation mode_ can hyperlink them
- `verbose` - extends `string` to include a list of checked files and a tally for each rule

The `formatter` Node.js API option can also accept a function or a `Promise` function, whereas the `--custom-formatter` CLI flag accepts a path (either a filesystem path or a dependency) to a JS file exporting one. The function in both cases must fit the signature described in the [Developer Guide](../developer-guide/formatters.md).

## `cache`

CLI flag: `--cache`

Store the results of processed files so that Stylelint only operates on the changed ones. By default, the cache is stored in `./.stylelintcache` in `process.cwd()`.

The following values are used as cache keys:

- Stylelint version
- Options

Enabling this option can dramatically improve Stylelint's speed because only changed files are linted.

> [!WARNING]
> Plugins version and implementation are not used as cache keys. We recommend that you delete the cache when updating plugins.

_If you run Stylelint with `cache` and then run Stylelint without `cache`, Stylelint deletes the `.stylelintcache` because we have to assume that the second command invalidated `.stylelintcache`._

## `cacheLocation`

CLI flag: `--cache-location`

Path to a file or directory for the cache location.

If a directory is specified, Stylelint creates a cache file inside the specified folder. The name of the file is based on the hash of `process.cwd()` (e.g. `.cache_hashOfCWD`) so that Stylelint can reuse a single location for a variety of caches from different projects.

_If the directory of `cacheLocation` does not exist, make sure you add a trailing `/` on \*nix systems or `\` on Windows. Otherwise, Stylelint assumes the path to be a file._

## `cacheStrategy`

CLI flag: `--cache-strategy`

Strategy for the cache to use for detecting changed files. Can be either "metadata" or "content".

The "content" strategy can be useful in cases where the modification time of your files changes even if their contents have not. For example, this can happen during git operations like "git clone" because git does not track file modification time.

## `maxWarnings`

CLI flags: `--max-warnings, --mw`

Set a limit to the number of warnings accepted.

It is useful when setting [`defaultSeverity`](./configure.md#defaultseverity) to `"warning"` and expecting the process to fail on warnings (e.g. CI build).

If the number of warnings exceeds this value, the:

- CLI process exits with code `2`
- Node.js API adds a [`maxWarningsExceeded`](node-api.md#maxwarningsexceeded) property to the returned data

## `disableDefaultIgnores`

CLI flags: `--disable-default-ignores, --di`

Disable the default ignores. Stylelint will not automatically ignore the contents of `node_modules`.

## `globbyOptions`

CLI flags: `--globby-options, --go`

Options passed to [globby](https://github.com/sindresorhus/globby). [More info](node-api.md#globbyoptions).

## `ignorePath`

CLI flags: `--ignore-path, -i`

Path to a file containing patterns that describe files to ignore. The path can be absolute or relative to `process.cwd()`. You can repeat the option to provide multiple paths. By default, Stylelint looks for `.stylelintignore` in `process.cwd()`.

## `ignoreDisables`

CLI flags: `--ignore-disables, --id`

Ignore `stylelint-disable` (e.g. `/* stylelint-disable block-no-empty */`) comments.

You can use this option to see what your linting results would be like without those exceptions.

## `reportDescriptionlessDisables`

CLI flags: `--report-descriptionless-disables, --rdd`

Report [configuration comments][1] without a description.

The following patterns are reported:

<!-- prettier-ignore -->
```css
/* stylelint-disable */
a {}
```

<!-- prettier-ignore -->
```css
/* stylelint-disable-next-line block-no-empty */
a {}
```

But, the following patterns (`stylelint-disable -- <description>`) are _not_ reported:

<!-- prettier-ignore -->
```css
/* stylelint-disable -- This problem is ignorable. */
a {}
```

<!-- prettier-ignore -->
```css
/* stylelint-disable-next-line block-no-empty -- This problem is ignorable. */
a {}
```

## `reportInvalidScopeDisables`

CLI flags: `--report-invalid-scope-disables, --risd`

Report [configuration comments][1] that don't match rules that are specified in the configuration object.

## `reportNeedlessDisables`

CLI flags: `--report-needless-disables, --rd`

Report [configuration comments][1] that don't actually match any lints that need to be disabled.

## `reportUnscopedDisables`

CLI flags: `--report-unscoped-disables, --rud`

Report [configuration comments][1] that aren't scoped to one or more rules.

## `validate`

CLI flags: `--validate, --no-validate`

Force enable/disable the validation of the rules' options. Default: `true`.
For example, your CI might be faster by skipping the validation if [`rules`](configure.md#rules) didn't change.
e.g.

```js
export default {
  // …
  validate: process.env["CI"] !== "true"
};
```

## `codeFilename`

CLI flag: `--stdin-filename`

A filename to assign the input.

If using `code` or `stdin` to pass a source string directly, you can use `codeFilename` to associate that code with a particular filename.

## `quiet`

CLI flag: `--quiet`

Only register problems for rules with an "error"-level severity (ignore "warning"-level).

## `quietDeprecationWarnings`

CLI flag: `--quiet-deprecation-warnings`

Ignore deprecation warnings.

> [!TIP]
> For Node.js 20.11.0+, you can disable individual deprecation warnings using the Node.js [`--disable-warning`](https://nodejs.org/api/cli.html#--disable-warningcode-or-type) mechanism, e.g.:
>
> ```shell
> NODE_OPTIONS='--disable-warning=stylelint:005' stylelint "**/*.css"
> ```

[1]: ../user-guide/ignore-code.md#parts-of-a-file
