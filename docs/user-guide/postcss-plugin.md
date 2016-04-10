# The stylelint PostCSS plugin

As with any other [PostCSS plugin](https://github.com/postcss/postcss#plugins), you can use stylelint's PostCSS plugin either with a PostCSS runner -- such as [`grunt-postcss`](https://github.com/nDmitry/grunt-postcss) -- or with the PostCSS JS API directly.

If a dedicated stylelint task runner plugin [is available](/docs/user-guide/complementary-tools.md) (e.g. `gulp-stylelint`) we recommend you use that rather than this plugin.

## Options

The plugin accepts an options object as argument, with the following properties:

### `config`

A [stylelint configuration object](/docs/user-guide/configuration.md).

If no `config` or `configFile` is passed, stylelint will look for a `.stylelintrc` configuration file.

### `configFile`

The path to a JSON, YAML, or JS file that contains your [stylelint configuration object](/docs/user-guide/configuration.md).

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

We recommend you lint your CSS before applying any transformations. You can do this by either:

- creating a separate lint task that is independent of your build one.
- using the [`plugins` option](https://github.com/postcss/postcss-import#plugins) of [`postcss-import`](https://github.com/postcss/postcss-import) or [`postcss-easy-import`](https://github.com/TrySound/postcss-easy-import) to lint the your files before any transformations.
- placing stylelint at the beginning of your plugin pipeline.

You'll also need to use a reporter. *The stylelint plugin registers warnings via PostCSS*. Therefore, you'll want to use it with a PostCSS runner that prints warnings (e.g. [`grunt-postcss`](https://github.com/nDmitry/grunt-postcss)) or another PostCSS plugin whose purpose is to format and print warnings (e.g. [`postcss-reporter`](https://github.com/postcss/postcss-reporter)).

### Example A

Using the plugin with [`grunt-postcss`](https://github.com/nDmitry/grunt-postcss), and as a separate lint task:

```js
grunt.initConfig({
  postcss: {
    // build task (this example uses postcss-import and autoprefixer)
    build: {
      options: {
        map: true,
        processors: [
          require("postcss-import"),
          require("autoprefixer")({browsers: "last 2 versions"})
        ]
      },
      // start at the entry file
      dist: {
        src: 'css/entry.css'
      }
    },
    // separate lint task
    lint: {
      options: {
        processors: [
          require("stylelint")({ /* your options */ }),
          require("postcss-reporter")({ clearMessages: true })
        ]
      },
      // lint all the .css files in the css directory
      dist: {
        src: 'css/**/*.css'
      }
    }
  }
})
```

### Example B

Using the plugin with [`grunt-postcss`](https://github.com/nDmitry/grunt-postcss), but within [`postcss-import`](https://github.com/postcss/postcss-import) (using the its `plugins` option) as part of the build task:

```js
grunt.initConfig({
  postcss: {
    // this example uses postcss-cssnext
    options: {
      map: true,
      processors: [
        require("postcss-import")({
          plugins: [
            require("stylelint")({ /* your options */ })
          ]
        }),
        require("postcss-cssnext")
        require("postcss-reporter")({ clearMessages: true })
      ]
    },
    // start at the entry file
    dist: {
      src: 'css/entry.css'
    }
  }
})
```

### Example C

Using the plugin to lint Less using the PostCSS JS API and [`postcss-less`](https://github.com/webschik/postcss-less).

*Note: the stylelint PostCSS plugin, unlike the stylelint CLI and node API, doesn't have a `syntax` option. Instead, the syntax must be set within the [PostCSS options](https://github.com/postcss/postcss#options) as there can only be one parser/syntax in a pipeline.*

```js
var fs = require("fs")
var less = require("postcss-less")
var postcss = require("postcss")
var reporter = require("postcss-reporter")
var stylelint = require("stylelint")

// CSS to be processed
var css = fs.readFileSync("input.css", "utf8")

postcss([
  stylelint({ /* your options */ }),
  reporter({ clearMessages: true }),
])
  .process(css, {
    from: "input.css",
    syntax: less
  })
  .then()
  .catch(err => console.error(err.stack))
```

The same pattern can be used to lint SCSS or [SugarSS](https://github.com/postcss/sugarss) syntax.
