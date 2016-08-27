# The stylelint CLI

## Installation

stylelint is an [npm package](https://www.npmjs.com/package/stylelint). Install it using:

```console
npm install -g stylelint
```

## Usage

`stylelint --help` prints the CLI documentation.

The CLI outputs formatted results into `process.stdout`, which you can read with your human eyes or pipe elsewhere (e.g. write the information to a file).

### Examples

Looking for `.stylelintrc` and linting all `.css` files in the `foo` directory:  

```shell
stylelint "foo/*.css"
```

Looking for `.stylelintrc` and linting `stdin`:

```shell
echo "a { color: pink; }" | stylelint
```

Using `bar/mySpecialConfig.json` as config to lint all `.css` files in the `foo` directory, then writing the output to `myTestReport.txt`:

```shell
stylelint "foo/*.css" --config bar/mySpecialConfig.json > myTestReport.txt
```

Using `bar/mySpecialConfig.json` as config, with quiet mode on, to lint all `.css` files in the `foo` directory and any of its subdirectories and also all `.css` files in the `bar directory`, then writing the JSON-formatted output to `myJsonReport.json`:

```shell
stylelint "foo/**/*.css bar/*.css" -q -f json --config bar/mySpecialConfig.json > myJsonReport.json
```

Linting all the `.scss` files in the `foo` directory, using the `syntax` option:

```shell
stylelint "foo/**/*.scss" --syntax scss
```

The above can be slightly altered to read Less or SugarSS syntax: `--syntax less`, `--syntax sugarss`. Also, you may not need to provide a `--syntax` option: non-standard syntaxes can be automatically inferred from file extensions `.less`, `.scss`, and `.sss`.

## Syntax errors

The CLI informs you about syntax errors in your CSS.
It uses the same format as it uses for linting warnings.
The error name is `CssSyntaxError`.

## Exit codes

The CLI can exit the process with the following exit codes:

-   1: Something unknown went wrong.
-   2: At least one rule with an "error"-level severity triggered at least one warning.
-   78: There was some problem with the configuration file.
-   80: A file glob was passed, but it found no files.
