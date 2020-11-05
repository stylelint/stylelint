# Command Line Interface (CLI)

You can use stylelint on the command line. For example:

```shell
npx stylelint "**/*.css"
```

Use `npx stylelint --help` to print the CLI documentation.

## Options

In addition to the [standard options](options.md), the CLI accepts:

### `--allow-empty-input, --aei`

The process exits without throwing an error when glob pattern matches no files.

### `--color, --no-color`

Force enabling/disabling of color.

### `--ignore-pattern, --ip`

Pattern of files to ignore (in addition to those in `.stylelintignore`).

### `--output-file, -o`

Path of file to write a report. stylelint outputs the report to the specified `filename` in addition to the standard output.

### `--print-config`

Print the configuration for the given path. stylelint outputs the configuration used for the file passed.

### `--quiet, -q`

Only register violations for rules with an "error"-level severity (ignore "warning"-level).

### `--stdin`

Accept stdin input even if it is empty.

### `--version, -v`

Show the currently installed version of stylelint.

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
- `2` - there was at least one rule violation or CLI flag error
- `78` - there was some problem with the configuration file
