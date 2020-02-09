# Node.js API

The stylelint module includes a `lint()` function that provides the Node.js API.

```js
stylelint.lint(options).then(function(resultObject) {
  /* .. */
});
```

## Options

In addition to the [standard options](options.md), the Node API accepts:

### `config`

A [configuration object](../configure.md).

stylelint does not bother looking for a `.stylelintrc` file if you use this option.

### `configOverrides`

A partial stylelint configuration object whose properties override the existing config object, whether stylelint loads the config via the `config` option or a `.stylelintrc` file.

### `code`

A CSS string to lint.

### `files`

A file glob, or array of [file globs](https://github.com/sindresorhus/globby).

Relative globs are considered relative to `globbyOptions.cwd`.

Though both `files` and `code` are "optional", you _must_ have one and _cannot_ have both.

### `globbyOptions`

The options that are passed with `files`.

For example, you can set a specific `cwd` manually. Relative globs in `files` are considered relative to this path. And by default, `cwd` will be set by `process.cwd()`.

For more detail usage, see [Globby Guide](https://github.com/sindresorhus/globby#options).

## The returned promise

`stylelint.lint()` returns a Promise that resolves with an object containing the following properties:

### `errored`

Boolean. If `true`, at least one rule with an "error"-level severity registered a violation.

### `output`

A string displaying the formatted violations (using the default formatter or whichever you passed).

### `postcssResults`

An array containing all the accumulated [PostCSS LazyResults](https://api.postcss.org/LazyResult.html).

### `results`

An array containing all the stylelint result objects (the objects that formatters consume).

## Syntax errors

`stylelint.lint()` does not reject the Promise when your CSS contains syntax errors.
It resolves with an object (see [The returned promise](#the-returned-promise)) that contains information about the syntax error.

## Usage examples

### Example A

If `myConfig` contains no relative paths for `extends` or `plugins`, you do not have to use `configBasedir`:

```js
stylelint
  .lint({
    config: myConfig,
    files: "all/my/stylesheets/*.css"
  })
  .then(function(data) {
    // do things with data.output, data.errored,
    // and data.results
  })
  .catch(function(err) {
    // do things with err e.g.
    console.error(err.stack);
  });
```

### Example B

If `myConfig` _does_ contain relative paths for `extends` or `plugins`, you _do_ have to use `configBasedir`:

```js
stylelint
  .lint({
    config: myConfig,
    configBasedir: path.join(__dirname, "configs"),
    files: "all/my/stylesheets/*.css"
  })
  .then(function() {
    /* .. */
  });
```

### Example C

Using a CSS string instead of a file glob, and the string formatter instead of the default JSON:

```js
stylelint
  .lint({
    code: "a { color: pink; }",
    config: myConfig,
    formatter: "string"
  })
  .then(function() {
    /* .. */
  });
```

### Example D

Using your own custom formatter function and parse `.scss` source files:

```js
stylelint
  .lint({
    config: myConfig,
    files: "all/my/stylesheets/*.scss",
    formatter: function(stylelintResults) {
      /* .. */
    },
    syntax: "scss"
  })
  .then(function() {
    /* .. */
  });
```

The same pattern can be used to lint Less, SCSS or [SugarSS](https://github.com/postcss/sugarss) syntax.
