# stylelint [![NPM version](http://img.shields.io/npm/v/stylelint.svg)](https://www.npmjs.org/package/stylelint) [![Travis Build Status](https://img.shields.io/travis/stylelint/stylelint/master.svg?label=unix%20build)](https://travis-ci.org/stylelint/stylelint) [![AppVeyor Build Status](https://img.shields.io/appveyor/ci/MoOx/stylelint/master.svg?label=windows%20build)](https://ci.appveyor.com/project/MoOx/stylelint) [![Join the chat at https://gitter.im/stylelint/stylelint](https://img.shields.io/badge/gitter%20-join%20chat%20%E2%9E%9E-1dce73.svg)](https://gitter.im/stylelint/stylelint)

> Modern CSS linter.

Supports the latest CSS syntax and features, including custom properties, range media features and calc().

### Installation

```console
$ npm install stylelint
```

### Usage

For now you must use the linter as a [PostCSS](https://github.com/postcss/postcss#usage) plugin directly. You can either use a [postcss runner](https://github.com/postcss/postcss#usage), like `grunt`, `gulp` or `webpack`. For example, using `gulp`:

```js
gulp.task("css", function () {

  var postcss = require("gulp-postcss")
  var stylelint = require("stylelint")
  var reporter = require("postcss-reporter")

  return gulp.src("src/**/*.css")
    .pipe(postcss([
      stylelint({
        // config
      }),
      reporter({
        clearMessages: true,
      })
    ]))
})
```

Or you can use the node API:

```js
var fs = require("fs")
var postcss = require("postcss")
var stylelint = require("stylelint")
var reporter = require("postcss-reporter")

// css to be processed
var css = fs.readFileSync("input.css", "utf8")

  postcss([
    stylelint({
      // config
    }),
    reporter(),
   ])
  .process(css, { from: file })
  .then()
  .catch(err => console.error(err.stack))
```

#### Configuring rules

[Rules](docs/rules.md) are configured within the `rules` key of the config. Each rule can be turned off or on:

* 0 - turn the rule off
* 2 - turn the rule on

```js
{
  "rules": {
    "rule-no-single-line": 0, // turn rule off
    "declaration-no-important": 2, // turn rule on
  }
}
```

Some rules require options. There are no default values, so each rule that requires options must be explicitly configured:

```js
{
  "rules": {
    "indentation": [2, "tab", {
      except: ["value"],
    }],
    "declaration-colon-space-before": [2, "never"],
    "number-leading-zero": [2, "always"],
  }
}
```

### Requirements

* node@0.12 or io.js@2
* node@0.10 with [babel-node](http://babeljs.io/docs/usage/cli/#babel-node)

## [Changelog](CHANGELOG.md)

## [Contributing](CONTRIBUTING.md)

## [License](LICENSE)
