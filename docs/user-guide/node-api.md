# Node.js API

The Stylelint module includes a `lint()` function that provides the Node.js API.

```js
const result = await stylelint.lint(options);
```

## Options

In addition to the [standard options](options.md), the Node API accepts:

### `config`

A [configuration object](./configure.md).

Stylelint does not bother looking for a configuration file (e.g. `stylelint.config.js`) if you use this option.

### `code`

A string to lint.

### `cwd`

The directory from which Stylelint will look for files. Defaults to the current working directory returned by `process.cwd()`.

### `files`

A file glob, or array of [file globs](https://github.com/sindresorhus/globby).

Relative globs are considered relative to `globbyOptions.cwd`.

Though both `files` and `code` are "optional", you _must_ have one and _cannot_ have both.

### `globbyOptions`

The options that are passed with `files`.

For example, you can set a specific `cwd` to use when globbing paths. Relative globs in `files` are considered relative to this path. By default, `globbyOptions.cwd` will be set by `cwd`.

For more detail usage, see [Globby Guide](https://github.com/sindresorhus/globby#options).

## The returned promise

`stylelint.lint()` returns a `Promise` that resolves with an object containing the following properties:

### `code`

A string that contains the autofixed code, if the `fix` option is set to `true` and the `code` option is provided. Otherwise, it is `undefined`.

### `cwd`

The directory used as the working directory for the linting operation.

### `errored`

Boolean. If `true`, at least one rule with an "error"-level severity registered a problem.

### `output`

> [!WARNING]
> This property is deprecated and will be removed in the next major version. Use [`report`](#report) or [`code`](#code-1) instead. See [the migration guide](../migration-guide/to-16.md).

A string that contains either the:

- formatted problems (using the default formatter or whichever you passed)
- or the autofixed code, if the `fix` option is set to `true`

### `postcssResults`

An array containing all the accumulated [PostCSS LazyResults](https://postcss.org/api/#lazyresult).

### `report`

A string that contains the formatted problems (using the default formatter or whichever you passed).

### `results`

An array containing all the Stylelint result objects (the objects that formatters consume).

### `maxWarningsExceeded`

An object containing the maximum number of warnings and the amount found, e.g. `{ maxWarnings: 0, foundWarnings: 12 }`.

## Syntax errors

`stylelint.lint()` does not reject the `Promise` when your CSS contains syntax errors.
It resolves with an object (see [the returned promise](#the-returned-promise)) that contains information about the syntax error.

## Usage examples

### Example A

As `config` contains no relative paths for `extends` or `plugins`, you do not have to use `configBasedir`:

```js
try {
  const result = await stylelint.lint({
    config: { rules: "color-no-invalid-hex" },
    files: "all/my/stylesheets/*.css"
  });
  // do things with result.report, result.errored, and result.results
} catch (err) {
  // do things with err e.g.
  console.error(err.stack);
}
```

### Example B

If `myConfig` _does_ contain relative paths for `extends` or `plugins`, you _do_ have to use `configBasedir`:

```js
const result = await stylelint.lint({
  config: myConfig,
  configBasedir: url.fileURLToPath(new URL("configs", import.meta.url)),
  files: "all/my/stylesheets/*.css"
});
```

### Example C

Using a string code instead of a file glob, and the verbose formatter instead of the default JSON:

```js
const result = await stylelint.lint({
  code: "a { color: pink; }",
  config: myConfig,
  formatter: "verbose"
});

// do things with result.report
```

The report will be available as the value of the `report` property in the returned object.

### Example D

Using your own custom formatter function and parse `.css` source files:

```js
const result = await stylelint.lint({
  config: myConfig,
  files: "all/my/stylesheets/*.css",
  formatter: (results) => {
    /* .. */
  }
});
```

### Example E

Using a custom syntax:

```js
const result = await stylelint.lint({
  config: myConfig,
  files: "all/my/stylesheets/*.css",
  customSyntax: {
    parse(css, opts) {
      /* .. */
    },
    stringify(node, builder) {
      /* .. */
    }
  }
});
```

> [!NOTE]
> The `customSyntax` option also accepts a string. [Refer to the options documentation for details](./options.md#customsyntax).

### Example F

Using a string code and the `fix` option:

```js
const result = await stylelint.lint({
  code: "a { color: pink; }",
  config: { rules: { "hue-degree-notation": "angle" } },
  fix: true
});

// do things with result.code
```

The autofixed code will be available as the value of the `code` property in the returned object.

## Resolving the effective config for a file

If you want to find out what exact configuration will be used for a file without actually linting it, you can use the `resolveConfig()` function. Given a file path, it will return a `Promise` that resolves with the effective configuration object:

```js
const config = await stylelint.resolveConfig(filePath);

// config => {
//   rules: {
//     'color-no-invalid-hex': true
//   },
//   extends: [
//     'stylelint-config-standard',
//     'stylelint-config-css-modules'
//   ],
//   plugins: [
//     'stylelint-scss'
//   ],
//   …
// }
```

If a configuration cannot be found for a file, `resolveConfig()` will return a `Promise` that resolves to `undefined`.

You can also pass the following subset of the [options that you would normally pass to `lint()`](#options):

- `cwd`
- `config`
- `configBasedir`
- `customSyntax`
