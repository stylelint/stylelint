# Command Line Interface (CLI)

You can use stylelint on the command line.

```shell
stylelint "**/*.css"
```

Use `stylelint --help` to print the CLI documentation.

## Options

In addition to the [standard options](../options.md), the CLI accepts:

### `--allow-empty-input, --aei`

The process exits without throwing an error when glob pattern matches no files.

### `--color, --no-color`

Force enabling/disabling of color.

## `--ignore-pattern, --ip`

Pattern of files to ignore (in addition to those in `.stylelintignore`).

### `--output-file, -o`

Path of file to write a report. stylelint outputs the report to the specified `filename` in addition to the standard output.

### `--print-config`

Print the configuration for the given path. stylelint outputs the configuration used for the file passed.

### `--quiet, -q`

Only register violations for rules with an "error"-level severity (ignore "warning"-level).

### `--version, -v`

Show the currently installed version of stylelint.

## Usage examples

The CLI expects an input as either a [file glob](https://github.com/sindresorhus/globby) or `process.stdin`. It outputs formatted results into `process.stdout`.

Be sure to include quotation marks around file globs.

### Example A - recursive

Recursively linting all `.css` files in the `foo` directory:

```shell
stylelint "foo/**/*.css"
```

### Example B - stdin

Linting `stdin`:

```shell
echo "a { color: pink; }" | stylelint
```

### Example C - negation

Linting all `.css` files except those within `docker` subfolders, using negation in the input glob:

```shell
stylelint "**/*.css" "!**/docker/**"
```

### Example D - caching

Caching processed `.scss` files `foo` directory:

```shell
stylelint "foo/**/*.scss" --cache --cache-location "/Users/user/.stylelintcache/"
```

### Example E - writing a report

Linting all `.css` files in the `foo` directory, then writing the output to `myTestReport.txt`:

```shell
stylelint "foo/*.css" --config bar/mySpecialConfig.json --output-file myTestReport.txt
```

### Example F - multiple globs and specifying a config

Using `bar/mySpecialConfig.json` as config to lint all `.css` files in the `foo` directory and any of its subdirectories and also all `.css` files in the `bar directory`:

```shell
stylelint "foo/**/*.css" "bar/*.css" --config bar/mySpecialConfig.json
```

## Exit codes

The CLI can exit the process with the following exit codes:

-   1: Something unknown went wrong.
-   2: There was at least one rule violation or CLI flag error
-   78: There was some problem with the configuration file.
