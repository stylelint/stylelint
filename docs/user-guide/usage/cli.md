# Command Line Interface (CLI)

You can use Stylelint on the command line. For example:

```shell
npx stylelint "**/*.css"
```

Use `npx stylelint --help` to print the CLI documentation.

## Options

The CLI accepts:

### `--allow-empty-input, --aei`

The process exits without throwing an error when glob pattern matches no files.

### `--cache-location`

Path to a file or directory for the cache location. [More info](options.md#cacheLocation).

### `--cache`

Store the results of processed files so that Stylelint only operates on the changed ones. By default, the cache is stored in `./.stylelintcache` in `process.cwd()`. [More info](options.md#cache).

### `--color, --no-color`

Force enabling/disabling of color.

### `--config-basedir`

Absolute path to the directory that relative paths defining "extends" and "plugins" are _relative to_. Only necessary if these values are relative paths. [More info](options.md#configBasedir).

### `--config`

Path to a JSON, YAML, or JS file that contains your [configuration object](../configure.md). [More info](options.md#configFile).

### `--custom-syntax`

Specify a custom syntax to use on your code. [More info](options.md#customSyntax).

### `--disable-default-ignores, --di`

Disable the default ignores. Stylelint will not automatically ignore the contents of `node_modules`. [More info](options.md#disableDefaultIgnores).

### `--fix`

Automatically fix, where possible, problems reported by rules. [More info](options.md#fix).

### `--formatter, -f` | `--custom-formatter`

Specify the formatter to format your results. [More info](options.md#formatter).

### `--ignore-disables, --id`

Ignore `stylelint-disable` (e.g. `/* stylelint-disable block-no-empty */`) comments. [More info](options.md#ignoreDisables).

### `--ignore-path, -i`

A path to a file containing patterns describing files to ignore. The path can be absolute or relative to `process.cwd()`. By default, Stylelint looks for `.stylelintignore` in `process.cwd()`. [More info](options.md#ignorePath).

### `--ignore-pattern, --ip`

Pattern of files to ignore (in addition to those in `.stylelintignore`).

### `--max-warnings, --mw`

Set a limit to the number of warnings accepted. [More info](options.md#maxWarnings).

### `--output-file, -o`

Path of file to write a report. Stylelint outputs the report to the specified `filename` in addition to the standard output.

### `--print-config`

Print the configuration for the given path. Stylelint outputs the configuration used for the file passed.

### `--quiet, -q`

Only register problems for rules with an "error"-level severity (ignore "warning"-level). [More info](options.md#quiet).

### `--report-descriptionless-disables, --rdd`

Produce a report of the `stylelint-disable` comments without a description. [More info](options.md#reportDescriptionlessDisables).

### `--report-invalid-scope-disables, --risd`

Produce a report of the `stylelint-disable` comments that used for rules that don't exist within the configuration object. [More info](options.md#reportInvalidScopeDisables).

### `--report-needless-disables, --rd`

Produce a report to clean up your codebase, keeping only the `stylelint-disable` comments that serve a purpose. [More info](options.md#reportNeedlessDisables).

### `--stdin-filename`

A filename to assign the input. [More info](options.md#codeFilename).

### `--stdin`

Accept stdin input even if it is empty.

### `--version, -v`

Show the currently installed version of Stylelint.

## Usage examples

The CLI expects input as either a [file glob](https://github.com/sindresorhus/globby) or `process.stdin`. It outputs formatted results into `process.stdout`.

_Be sure to include quotation marks around file globs._

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
stylelint "foo/**/*.css" --customSyntax path/to/my-custom-syntax.js
```

### Example I - print on success

Ensure output on successful runs:

```shell
stylelint -f verbose "foo/**/*.css"
```

## Exit codes

The CLI can exit the process with the following exit codes:

- `1` - something unknown went wrong
- `2` - there was at least one rule problem or CLI flag error
- `78` - there was some problem with the configuration file
