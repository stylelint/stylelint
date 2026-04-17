# Command Line Interface (CLI)

You can use Stylelint on the command line. For example:

```shell
stylelint "**/*.css"
```

_You should include quotation marks around file globs._

If you are using [npm scripts](https://docs.npmjs.com/cli/v8/using-npm/scripts), you'll need to escape the quotes:

```json
{
  "scripts": {
    "lint": "stylelint \"**/*.css\""
  }
}
```

Use `stylelint --help` to print the CLI documentation.

## Options

The CLI accepts:

### `--allow-empty-input, --aei`

The process exits without throwing an error when glob pattern matches no files. [More info](options.md#allowemptyinput).

### `--cache-location`

Path to a file or directory for the cache location. [More info](options.md#cachelocation).

### `--cache-strategy`

Strategy for the cache to use for detecting changed files. Can be either "metadata" or "content". [More info](options.md#cachestrategy).

### `--cache`

Store the results of processed files so that Stylelint only operates on the changed ones. By default, the cache is stored in `./.stylelintcache` in `process.cwd()`. [More info](options.md#cache).

### `--color, --no-color`

Force enabling/disabling of color.

### `--config-basedir`

Absolute path to the directory that relative paths defining "extends", "plugins", and "customSyntax" are _relative to_. Only necessary if these values are relative paths. [More info](options.md#configbasedir).

### `--config, -c`

Path to a JSON, YAML, or JS file that contains your [configuration object](./configure.md). [More info](options.md#configfile).

### `--custom-syntax`

Specify a custom syntax to use on your code. [More info](options.md#customsyntax).

### `--disable-default-ignores, --di`

Disable the default ignores. Stylelint will not automatically ignore the contents of `node_modules`. [More info](options.md#disabledefaultignores).

### `--fix`

Automatically fix, where possible, problems reported by rules. [More info](options.md#fix).

### `--compute-edit-info, --cei`

Compute edit information for fixable problems. [More info](options.md#computeeditinfo).

### `--formatter, -f` | `--custom-formatter`

Specify the formatter to format your results. [More info](options.md#formatter).

### `--globbyOptions, --go`

Options in JSON format passed to [globby](https://github.com/sindresorhus/globby). [More info](options.md#globbyoptions).

### `--ignore-disables, --id`

Ignore `stylelint-disable` (e.g. `/* stylelint-disable block-no-empty */`) comments. [More info](options.md#ignoredisables).

### `--ignore-path, -i`

Path to a file containing patterns that describe files to ignore. The path can be absolute or relative to `process.cwd()`. You can repeat the option to provide multiple paths. By default, Stylelint looks for `.stylelintignore` in `process.cwd()`. [More info](options.md#ignorepath).

### `--ignore-pattern, --ip`

Pattern of files to ignore (in addition to those in `.stylelintignore`).

### `--max-warnings, --mw`

Set a limit to the number of warnings accepted. [More info](options.md#maxwarnings).

### `--output-file, -o`

Path of file to write a report. Stylelint outputs the report to the specified `filename` in addition to `process.stderr`.

### `--print-config`

Print the configuration for the given input path. Globs are unsupported.

### `--quiet, -q`

Only register problems for rules with an "error"-level severity (ignore "warning"-level). [More info](options.md#quiet).

### `--quiet-deprecation-warnings`

Ignore deprecation warnings. [More info](options.md#quietdeprecationwarnings).

### `--report-descriptionless-disables, --rdd`

Produce a report of the `stylelint-disable` comments without a description. [More info](options.md#reportdescriptionlessdisables).

### `--report-invalid-scope-disables, --risd`

Produce a report of the `stylelint-disable` comments that used for rules that don't exist within the configuration object. [More info](options.md#reportinvalidscopedisables).

### `--report-needless-disables, --rd`

Produce a report to clean up your codebase, keeping only the `stylelint-disable` comments that serve a purpose. [More info](options.md#reportneedlessdisables).

### `--report-unscoped-disables, --rud`

Produce a report of the configuration comments that are not scoped to one or more rules. [More info](options.md#reportunscopeddisables).

### `--stdin-filename`

A filename to assign the input. [More info](options.md#codefilename).

### `--stdin`

Accept stdin input even if it is empty.

### `--suppress`

Suppress problems that have the severity of `error` and record them in a file. [More info](suppressions.md#--suppress-rule).

### `--suppress-location`

Path to a file or directory for the suppressions location. [More info](suppressions.md#--suppress-location-path).

### `--validate, --no-validate`

Force enable/disable the validation of the rules' options. [More info](options.md#validate).

### `--version, -v`

Show the currently installed version of Stylelint.

## Profile Rule Performance

The `TIMING` environment variable allows you to profile the performance of individual rules.

When `TIMING` is set to `all` or a positive integer (`n >= 1`), it displays the execution time of the longest-running rules upon linting completion. This includes both rule creation and execution time, as well as each rule's relative impact as a percentage of the total rule processing time.

```console
$ TIMING=10 stylelint "**/*.css"
╔════╤════════════════════════════════════════════════════╤═══════════╤══════════╗
║  # │ Rule                                               │ Time (ms) │ Relative ║
╟────┼────────────────────────────────────────────────────┼───────────┼──────────╢
║  1 │ no-descending-specificity                          │     1.154 │    19.3% ║
╟────┼────────────────────────────────────────────────────┼───────────┼──────────╢
║  2 │ no-duplicate-selectors                             │     0.357 │     6.0% ║
╟────┼────────────────────────────────────────────────────┼───────────┼──────────╢
║  3 │ length-zero-no-unit                                │     0.300 │     5.0% ║
╟────┼────────────────────────────────────────────────────┼───────────┼──────────╢
║  4 │ selector-type-no-unknown                           │     0.265 │     4.4% ║
╟────┼────────────────────────────────────────────────────┼───────────┼──────────╢
║  5 │ alpha-value-notation                               │     0.251 │     4.2% ║
╟────┼────────────────────────────────────────────────────┼───────────┼──────────╢
║  6 │ declaration-block-no-redundant-longhand-properties │     0.217 │     3.6% ║
╟────┼────────────────────────────────────────────────────┼───────────┼──────────╢
║  7 │ selector-class-pattern                             │     0.187 │     3.1% ║
╟────┼────────────────────────────────────────────────────┼───────────┼──────────╢
║  8 │ value-keyword-case                                 │     0.151 │     2.5% ║
╟────┼────────────────────────────────────────────────────┼───────────┼──────────╢
║  9 │ declaration-block-no-duplicate-custom-properties   │     0.146 │     2.4% ║
╟────┼────────────────────────────────────────────────────┼───────────┼──────────╢
║ 10 │ declaration-empty-line-before                      │     0.140 │     2.3% ║
╚════╧════════════════════════════════════════════════════╧═══════════╧══════════╝
```

You can adjust the number of results by setting a different value for `TIMING`.

For example:

- `TIMING=30` will show the top 30 rules.
- `TIMING=all` will display all rules.

## Usage examples

The CLI expects input as either a [file glob](https://github.com/sindresorhus/globby) or `process.stdin`. It outputs formatted results into `process.stderr`.

_You should include quotation marks around file globs._

### Example A - recursive

Recursively linting all `.css` files in the `foo` directory:

```shell
stylelint "foo/**/*.css"
```

### Example B - multiple file extensions

Linting all `.css`, `.scss`, and `.sass` files:

```shell
stylelint "**/*.{css,scss,sass}"
```

### Example C - stdin

Linting `stdin`:

```shell
echo "a { color: pink; }" | stylelint
```

### Example D - negation

Linting all `.css` files except those within `docker` subfolders, using negation in the input glob:

```shell
stylelint "**/*.css" "!**/docker/**"
```

### Example E - caching

Caching processed `.scss` files `foo` directory:

```shell
stylelint "foo/**/*.scss" --cache --cache-location "/Users/user/.stylelintcache/"
```

### Example F - writing a report

Linting all `.css` files in the `foo` directory, then writing the output to `myTestReport.txt`:

```shell
stylelint "foo/*.css" --output-file myTestReport.txt
```

### Example G - specifying a config

Using `bar/mySpecialConfig.json` as config to lint all `.css` files in the `foo` directory and any of its subdirectories:

```shell
stylelint "foo/**/*.css" --config bar/mySpecialConfig.json
```

### Example H - using a custom syntax

Recursively linting all `.css` files in the `foo` directory using a custom syntax:

```shell
stylelint "foo/**/*.css" --custom-syntax path/to/my-custom-syntax.js
```

### Example I - print on success

Ensure output on successful runs:

```shell
stylelint -f verbose "foo/**/*.css"
```

### Example J - print a config

Print a configuration used for the given input file:

```shell
stylelint test.css --print-config
```

### Example K - piping a report to another command

Use a report as input for another command through piping:

```shell
stylelint -f json "*.css" 2>&1 | jq '[.[] | .warnings | length] | add'
```

## Exit codes

The CLI can exit the process with the following exit codes:

- `1` - fatal error
- `2` - lint problem
- `64` - invalid CLI usage
- `78` - invalid configuration file
