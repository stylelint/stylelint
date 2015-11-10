# The stylelint PostCSS Plugin

As with any other [PostCSS plugin](https://github.com/postcss/postcss#plugins), you can use stylelint's PostCSS plugin either with a PostCSS runner -- such as [`gulp-postcss`](https://github.com/postcss/gulp-postcss), [`grunt-postcss`](https://github.com/nDmitry/grunt-postcss) and [`postcss-loader`](https://github.com/postcss/postcss-loader) -- or with the PostCSS JS API directly.

## PostCSS version compatibility

* Versions `1.0.0+` of the linter are compatible with PostCSS `5.0.2+`.
* Versions `0.8.0 and below` of the linter are compatible with PostCSS `4.x`.

## Use a reporter

_The stylelint plugin registers warnings via PostCSS_. Therefore, you'll want to use it with a PostCSS runner that prints warnings (e.g. [`gulp-postcss`](https://github.com/postcss/gulp-postcss)) or another PostCSS plugin whose purpose is to format and print warnings (e.g. [`postcss-reporter`](https://github.com/postcss/postcss-reporter)).

## Options

The plugin accepts an options object as argument, with the following properties:

### `config`

A [stylelint configuration object](/docs/user-guide/configuration.md).

If no `config` is passed, stylelint will look for a `.stylelintrc` configuration file in [standard rc-file places](https://github.com/dominictarr/rc#standards).

### `configFile`

The path to a JSON or JS file (with a `.json` or `.js` extension) that contains your [stylelint configuration object](/docs/user-guide/configuration.md).

It should be either absolute or relative to the directory that your process is running from.
We'd recommend absolute.

### `configBasedir`

An absolute path to the directory that relative paths defining `extends` and `plugins` are *relative to*.

This is only necessary if you passed an object directly through the `config` property. If you used
`configFile`, this option is not necessary.

If the `config` object passed uses relative paths for `extends` or `plugins`, you are going to have to pass a `configBasedir`. If not, you do not need this.

### `configOverrides`

A partial stylelint configuration object whose properties will override the existing config object, whether that config was loaded via the `config` option or a `.stylelintrc` file.

The difference between the `configOverrides` and `config` options is this: If any `config` object is passed, stylelint does not bother looking for a `.stylelintrc` file and instead just uses whatever `config` object you've passed; but if you want to _both_ load a `.stylelintrc` file _and_ override specific parts of it, `configOverrides` does just that.

## Usage examples

Using the plugin with [`gulp-postcss`](https://github.com/postcss/gulp-postcss):

```js
gulp.task("css", function () {

  var postcss = require("gulp-postcss")
  var stylelint = require("stylelint")
  var reporter = require("postcss-reporter")

  return gulp.src("src/**/*.css")
    .pipe(postcss([
      stylelint({ /* your options */ }),
      reporter({ clearMessages: true }),
    ]))
})
```

Using the plugin with the PostCSS JS API:

```js
var fs = require("fs")
var postcss = require("postcss")
var stylelint = require("stylelint")
var reporter = require("postcss-reporter")

// CSS to be processed
var css = fs.readFileSync("input.css", "utf8")

postcss([
  stylelint({ /* your options */ }),
  reporter({ clearMessages: true }),
])
  .process(css, { from: "input.css" })
  .then()
  .catch(err => console.error(err.stack))
```
