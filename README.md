# stylelint [![NPM version](http://img.shields.io/npm/v/stylelint.svg)](https://www.npmjs.org/package/stylelint) [![Travis Build Status](https://img.shields.io/travis/stylelint/stylelint/master.svg?label=unix%20build)](https://travis-ci.org/stylelint/stylelint) [![AppVeyor Build Status](https://img.shields.io/appveyor/ci/MoOx/stylelint/master.svg?label=windows%20build)](https://ci.appveyor.com/project/MoOx/stylelint) [![Join the chat at https://gitter.im/stylelint/stylelint](https://img.shields.io/badge/gitter%20-join%20chat%20%E2%9E%9E-1dce73.svg)](https://gitter.im/stylelint/stylelint)

> Modern CSS linter.

Supports the latest CSS syntax and features, including custom properties, range context for media features, calc() and nesting.

## Installation

```console
$ npm install stylelint
```

Currently, reported line numbers are only _approximate_, marking the beginning of the CSS node to which the warning relates. _See issue [#133](https://github.com/stylelint/stylelint/issues/133) for more details._

## Usage

You must, for now, use the linter as a [PostCSS plugin](https://github.com/postcss/postcss#usage). You can either use a PostCSS runner -- such as [`gulp-postcss`](https://github.com/postcss/gulp-postcss), [`grunt-postcss`](https://github.com/nDmitry/grunt-postcss) and [`postcss-loader`](https://github.com/postcss/postcss-loader) -- or you can use the PostCSS JS API directly.

The linter also _expects a config_. You can either craft your own config or use a [pre-written one](#shareable-configs).

An example of using [`gulp-postcss`](https://github.com/postcss/gulp-postcss) and crafting your own config:

```js
gulp.task("css", function () {

  var postcss = require("gulp-postcss")
  var stylelint = require("stylelint")
  var reporter = require("postcss-reporter")

  return gulp.src("src/**/*.css")
    .pipe(postcss([
      stylelint({ // an example config that has four rules
        "rules": {
          "color-no-invalid-hex": 2,
          "declaration-colon-space-before": [2, "never"],
          "indentation": [2, "tab"],
          "number-leading-zero": [2, "always"]
        }
      }),
      reporter({
        clearMessages: true,
      })
    ]))
})
```

An example of using the JS API and the [`stylelint-config-suitcss`](https://github.com/stylelint/stylelint-config-suitcss) config:

```js
var fs = require("fs")
var postcss = require("postcss")
var stylelint = require("stylelint")
var configSuitcss = require("stylelint-config-suitcss")
var reporter = require("postcss-reporter")

// css to be processed
var css = fs.readFileSync("input.css", "utf8")

  postcss([
    stylelint(configSuitcss), // using the pre-written SuitCSS config
    reporter(),
   ])
  .process(css, { from: "input.css" })
  .then()
  .catch(err => console.error(err.stack))
```

### With CSS processors

The linter supports current and future CSS syntax. This includes all standard CSS but also special features that use standard CSS syntactic structures, e.g. special at-rules, special properties, and special functions. Some CSS-*like* language extensions -- features that use non-standard syntactic structures -- are, as such, supported; however, since there are infinite processing possibilities, the linter cannot support everything.

You can run the linter before or after your css processors. Depending on which processors you use, each approach has caveats:

1. *Before*: Some plugins might enable a syntax that isn't compatible with the linter.
2. *After*: Some plugins might generate CSS that is invalid against your linter config, causing warnings that do not correspond to your original stylesheets.

*In both cases you can either turn off the incompatible linter rule, or stop using the incompatible plugin.* You could also approach plugin authors and request alternate formatting options that will make their plugin compatible with stylelint.

### Configuring rules

[Rules](docs/rules.md) are configured within the `rules` key of the config. The [user guide](docs/user-guide.md) contains details of how rules are named and how certain ones should be configured in unison.

#### Turning rules on and off

Like [ESLint](http://eslint.org/docs/user-guide/configuring#configuring-rules), each rule can be turned off or on:

* `0` - turn the rule off.
* ~~`1` - turn the rule on as a warning (does not affect exit code).~~
* `2` - turn the rule on ~~as an error (exit code is 1 when triggered)~~.

Severities are not yet implemented. _See issue [#26](https://github.com/stylelint/stylelint/issues/26) for more details._

An example of turning one rule off and another on:


```js
{
  "rules": {
    "rule-no-single-line": 0, // turn rule off
    "declaration-no-important": 2, // turn rule on
  }
}
```

Rules can be temporarily turned off by using special comments in your CSS. For example, you can either turn all the rules off:

```css
/* stylelint-disable */
a {}
/* stylelint-enable */
```

Or you can turn off individual rules:

```css
/* stylelint-disable selector-no-id, declaration-no-important  */
#id {
  color: pink !important;
}
/* stylelint-enable */
```

#### Configuring options

Only the `*-no-*` rules don't expect options. All the other rules must be explicitly configured as _there are no default values_.

An example of explicitly configuring the options for three rules:

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

#### Shareable configs

If you prefer to enforce a third-party styleguide (rather than craft your own config), you can use:

* [SuitCSS shareable config](https://github.com/stylelint/stylelint-config-suitcss)

You can also extend a shareable config file, starting with what's there and making your own modifications and additions:

```js
var assign = require("lodash.assign")
var configSuitcss = require("stylelint-config-suitcss")

// change indentation to tabs and turn off the number-leading-zero rule
var myConfig = {
  "rules": {
    "indentation": [2, "tab"],
    "number-leading-zero": 0,
  }
}

// merge the configs together
var config = {
  rules: assign(configSuitcss.rules, myConfig.rules)
}
```

### Plugin rules

#### Using plugin rules

To use a plugin rule, add a `"plugins"` property to your config.
The key is the rule's name; the value is the rule function itself.
Then, within the `"rules"` object, your can add settings for your plugin rule just like any standard rule.

```js
var myConfig = {
  plugins: {
    "special-rule": require("special-rule"),
  },
  rules: {
    // ...
    "special-rule": [ 2, "everything" ],
    // ...
  },
}
```

#### Creating plugin rules

```js
// Abbreviated example:

var stylelint = require("stylelint")

var myPluginRule = function(expectationKeyword, optionsObject) {
  return function(postcssRoot, postcssResult) {
    // ... some logic ...
    stylelint.utils.report({ .. })
  }
}
```

In order for your plugin rule to work with the standard configuration format, (e.g. `[2, "tab", { hierarchicalSelectors: true }]`), it should be a function that accepts 2 arguments: the expectation keyword (e.g. `"tab"`) and, optionally, an options object (e.g. `{ hierarchicalSelectors: true }`).

It should return a function that is essentially a little PostCSS plugin: it takes 2 arguments: the PostCSS Root (the parsed AST), and the PostCSS LazyResult.
You'll have to [learn about the PostCSS API](https://github.com/postcss/postcss/blob/master/docs/api.md).

A few of stylelint's internal utilities are exposed publicly in `stylelint.utils`, to help you write plugin rules.
For details about the APIs of these functions, please look at comments in the source code and examples in the standard rules.

- `report`: Report your linting warnings. *You'll want to use this: do not use `node.warn()` directly.* If you use `report`,
your plugin will respect disabled ranges and other possible future features of stylelint, so it will fit in better with the standard rules.
- `ruleMessages`: Tailor your messages to look like the messages of other stylelint rules. Currently, this means that the name of the rule is appended, in parentheses, to the end of the message.
- `styleSearch`: Search within CSS strings, and for every match found invoke a callback, passing a match object with details about the match. `styleSearch` ignores CSS strings (e.g. `content: "foo";`) and by default ignores comments. It can also be restricted to substrings within or outside of CSS functional notation.

## Complementary tools

The linter works well with:

* [postcss-bem-linter](https://github.com/postcss/postcss-bem-linter) - A BEM linter for CSS.
* [stylehacks](https://github.com/ben-eb/stylehacks) - Detect/remove browser hacks from CSS files.

## Requirements

* node@0.12 or io.js@2
* node@0.10 with [babel-node](http://babeljs.io/docs/usage/cli/#babel-node)

## [Changelog](CHANGELOG.md)

## [Contributing](CONTRIBUTING.md)

## [License](LICENSE)
