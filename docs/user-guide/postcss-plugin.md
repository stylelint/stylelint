# The stylelint PostCSS Plugin

As with any other [PostCSS plugin](https://github.com/postcss/postcss#plugins), you can use stylelint's PostCSS plugin either with a PostCSS runner -- such as [`gulp-postcss`](https://github.com/postcss/gulp-postcss), [`grunt-postcss`](https://github.com/nDmitry/grunt-postcss) and [`postcss-loader`](https://github.com/postcss/postcss-loader) -- or with the PostCSS JS API directly.

## Options

The plugin accepts an options object as argument, with the following properties:

### `config`

A [stylelint configuration object](/docs/user-guide/configuration.md).

If no `config` is passed, stylelint will look for a `.stylelintrc` configuration file.

### `configFile`

The path to a JSON, YAML, or JS file  that contains your [stylelint configuration object](/docs/user-guide/configuration.md).

It should be either absolute or relative to the directory that your process is running from (`process.cwd()`). We'd recommend absolute.

### `configBasedir`

An absolute path to the directory that relative paths defining `extends` and `plugins` are *relative to*.

This is only necessary if you passed an object directly through the `config` property. If you used
`configFile`, this option is not necessary.

If the `config` object passed uses relative paths for `extends` or `plugins`, you are going to have to pass a `configBasedir`. If not, you do not need this.

### `configOverrides`

A partial stylelint configuration object whose properties will override the existing config object, whether that config was loaded via the `config` option or a `.stylelintrc` file.

The difference between the `configOverrides` and `config` options is this: If any `config` object is passed, stylelint does not bother looking for a `.stylelintrc` file and instead just uses whatever `config` object you've passed; but if you want to *both* load a `.stylelintrc` file *and* override specific parts of it, `configOverrides` does just that.

## Usage examples

We recommend you lint your CSS before applying any transformations. You can do this by either placing stylelint at the beginning of your plugin pipeline, using a plugin like [`postcss-import`](https://github.com/postcss/postcss-import) or [`postcss-easy-import`](https://github.com/TrySound/postcss-easy-import) to lint the your files before any transformations, or by creating a separate lint process that is independent of your build one.

You'll also need to use a reporter. *The stylelint plugin registers warnings via PostCSS*. Therefore, you'll want to use it with a PostCSS runner that prints warnings (e.g. [`gulp-postcss`](https://github.com/postcss/gulp-postcss)) or another PostCSS plugin whose purpose is to format and print warnings (e.g. [`postcss-reporter`](https://github.com/postcss/postcss-reporter)).

### Example A

Using the plugin with [`gulp-postcss`](https://github.com/postcss/gulp-postcss), and as a separate lint task:

```js
var postcss = require("gulp-postcss")
var reporter = require("postcss-reporter")
var stylelint = require("stylelint")

gulp.task("lint:css", function () {
  return gulp.src("src/**/*.css")
    .pipe(postcss([
      stylelint({ /* your options */ }),
      reporter({ clearMessages: true }),
    ]))
})
```

### Example B

Using the plugin within [`postcss-import`](https://github.com/postcss/postcss-import) or [`postcss-easy-import`](https://github.com/TrySound/postcss-easy-import), as part of the build task:

```js
var easyImport = require("postcss-easy-import")
var postcss = require("gulp-postcss")
var reporter = require("postcss-reporter")
var stylelint = require("stylelint")

gulp.task("build:css", function () {
  return gulp.src("src/main.css")
    .pipe(postcss([
      stylelint({ /* your options */ })
      easyImport({
        plugins: [
          stylelint({ /* your options */ })
        ]
      })
      /* other plugins... */
      reporter({ clearMessages: true })
    ]))
})
```

### Example C

Using the plugin with [`gulp-postcss`](https://github.com/postcss/gulp-postcss) and [`postcss-scss`](https://github.com/postcss/postcss-scss) to lint SCSS, and as part of the build task:

*Note: the stylelint PostCSS plugin, unlike the stylelint CLI and node API, doesn't have a `syntax` option. Instead, the syntax must be set within the [PostCSS options](https://github.com/postcss/postcss#options) as there can only be one parser/syntax in a pipeline.*

```js
var postcss = require("gulp-postcss")
var reporter = require("postcss-reporter")
var scss = require("postcss-scss")
var stylelint = require("stylelint")

gulp.task("build:scss", function () {
  return gulp.src("src/**/*.scss")
    .pipe(postcss([
      stylelint({ /* your options */ }),
      /* other plugins... */
      reporter({ clearMessages: true }),
    ], {
      syntax: scss
    }))
})
```

### Example D

Using the plugin with the PostCSS JS API:

```js
var fs = require("fs")
var postcss = require("postcss")
var reporter = require("postcss-reporter")
var stylelint = require("stylelint")

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

## PostCSS version compatibility

- Versions `1.0.0+` of the linter are compatible with PostCSS `5.0.2+`.
- Versions `0.8.0 and below` of the linter are compatible with PostCSS `4.x`.
