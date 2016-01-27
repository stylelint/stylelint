# The stylelint CLI

`stylelint --help` prints the CLI documentation.

The CLI outputs formatted results into `process.stdout`, which you can read with your human eyes or pipe elsewhere (e.g. write the information to a file).

## Usage examples

Looking for `.stylelintrc` and linting all `.css` files in the `foo` directory:  

```bash
stylelint foo/*.css
```

Looking for `.stylelintrc` and linting `stdin`:

```bash
echo "a { color: pink; }" | stylelint
```

Using `bar/mySpecialConfig.json` as config to lint all `.css` files in the `foo` directory, then writing the output to `myTestReport.txt`:

```bash
stylelint foo/*.css --config bar/mySpecialConfig.json > myTestReport.txt
```

Using `bar/mySpecialConfig.json` as config, with quiet mode on, to lint all `.css` files in the `foo` directory and any of its subdirectories and also all `.css` files in the `bar directory`, then writing the JSON-formatted output to `myJsonReport.json`:

```bash
stylelint foo/**/*.css bar/*.css -q -f json --config bar/mySpecialConfig.json > myJsonReport.json
```

The linter can parse the SCSS!

```bash
stylelint foo/**/*.scss --syntax scss
```

## Exit codes

The CLI can exit the process with the following exit codes:

- 1: Something unknown went wrong.
- 2: At least one rule with an "error"-level severity triggered at least one warning.
- 78: There was some problem with the configuration file.
- 80: A file glob was passed both it found no files.
