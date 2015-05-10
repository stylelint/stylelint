# stylelint [![Travis Build Status](https://img.shields.io/travis/stylelint/stylelint.svg?label=unix build)](https://travis-ci.org/stylelint/stylelint) [![AppVeyor Build Status](https://img.shields.io/appveyor/ci/MoOx/stylelint.svg?label=windows build)](https://ci.appveyor.com/project/MoOx/stylelint) [![Join the chat at https://gitter.im/stylelint/stylelint](https://img.shields.io/badge/gitter%20-join%20chat%20%E2%9E%9E-1dce73.svg)](https://gitter.im/stylelint/stylelint)

> Modern CSS linter.

See [opened issues](https://github.com/stylelint/stylelint/issues) for status of the project.

### Installation

```console
$ npm install stylelint
```

### Usage

For now you must use it as a [PostCSS](https://github.com/postcss/postcss#usage) plugin directly

```js
var fs = require("fs")
var postcss = require("postcss")
var stylelint = require("stylelint")
var logWarnings = require("postcss-log-warnings")

// css to be processed
var css = fs.readFileSync("input.css", "utf8")

postcss()
  .use(
    stylelint({
      // config
    })
  )
  .use(
    logWarnings()
  )
  .process(css)
  .css
```

## [Changelog](CHANGELOG.md)

## [License](LICENSE)
