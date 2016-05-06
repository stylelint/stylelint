# The stylelint Node API

The stylelint module includes a `lint()` function that provides the Node API.

```js
stylelint.lint(options)
  .then(function(resultObject) { .. });
```

## Options

Options is an object with the following properties.

Though both `files` and `code` are "optional", you *must* have one and *cannot* have both. All other options are optional.

### `code`

A CSS string to be linted.

### `codeFilename`

If using `code` to pass a source string directly, you can use `codeFilename` to associate that code with a particular filename.

This can be useful, for example, when making a text editor plugin that passes in code directly but needs to still use the configuration's `ignoreFiles` functionality to possibly ignore that code.

### `config`

A [stylelint configuration object](/docs/user-guide/configuration.md).

If no `config` or `configFile` is passed, stylelint will look for a `.stylelintrc` configuration file.

### `configBasedir`

An absolute path to the directory that relative paths defining `extends` and `plugins` are *relative to*.

If the `config` object passed uses relative paths for `extends` or `plugins`, you are going to have to pass a `configBasedir`. If not, you do not need this.

### `configFile`

The path to a JSON, YAML, or JS file  that contains your [stylelint configuration object](/docs/user-guide/configuration.md).

It should be either absolute or relative to the directory that your process is running from (`process.cwd()`). We'd recommend absolute.

### `configOverrides`

A partial stylelint configuration object whose properties will override the existing config object, whether that config was loaded via the `config` option or a `.stylelintrc` file.

The difference between the `configOverrides` and `config` options is this: If any `config` object is passed, stylelint does not bother looking for a `.stylelintrc` file and instead just uses whatever `config` object you've passed; but if you want to *both* load a `.stylelintrc` file *and* override specific parts of it, `configOverrides` does just that.

### `files`

A file glob, or array of file globs. Ultimately passed to [node-glob](https://github.com/isaacs/node-glob) to figure out what files you want to lint.

`node_modules` and `bower_components` are always ignored.

### `formatter`

Options: `"json"|"string"|"verbose"`, or a function. Default is `"json"`.

Specify the formatter that you would like to use to format your results.

If you pass a function, it must fit the signature described in the [Developer Guide](/docs/developer-guide/formatters.md).

### `syntax`

Options: `"scss"|"less"|"sugarss"`.

Specify a non-standard syntax that should be used to parse source stylesheets.

### `extractStyleTagsFromHtml`

Boolean. Enable extraction of CSS from `<style>` tags in HTML structures.

## The returned promise

`stylelint.lint()` returns a Promise that resolves with an object containing the following properties:

### `errored`

Boolean. If `true`, at least one rule with an "error"-level severity registered a warning.

### `output`

A string displaying the formatted warnings (using the default formatter or whichever you passed).

### `postcssResults`

An array containing all the [PostCSS LazyResults](https://github.com/postcss/postcss/blob/master/docs/api.md#lazyresult-class) that were accumulated during processing.

### `results`

An array containing all the stylelint result objects (the objects that formatters consume).

## Syntax errors

`stylelint.lint()` does not reject the Promise when your CSS contains syntax errors.
It resolves with an object (see [The returned promise](#the-returned-promise)) that contains information about the syntax error.

## Usage examples

If `myConfig` contains no relative paths for `extends` or `plugins`, I do not have to use `configBasedir`:

```js
stylelint.lint({
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
  });;
```

If `myConfig` *does* contain relative paths for `extends` or `plugins`, I *do* have to use `configBasedir`:

```js
stylelint.lint({
  config: myConfig,
  configBasedir: path.join(__dirname, "configs"),
  files: "all/my/stylesheets/*.css"
}).then(function() { .. });
```

Maybe I want to use a CSS string instead of a file glob, and I want to use the string formatter instead of the default JSON:

```js
stylelint.lint({
  code: "a { color: pink; }",
  config: myConfig,
  formatter: "string"
}).then(function() { .. });
```

Maybe I want to use my own custom formatter function and parse `.scss` source files:

```js
stylelint.lint({
  config: myConfig,
  files: "all/my/stylesheets/*.scss",
  formatter: function(stylelintResults) { .. },
  syntax: "scss"
}).then(function() { .. });
```

The same pattern can be used to read Less or [SugarSS](https://github.com/postcss/sugarss) syntax.
