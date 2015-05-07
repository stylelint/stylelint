# stylelint [![Travis Build Status](https://img.shields.io/travis/stylelint/stylelint.svg)](https://travis-ci.org/stylelint/stylelint) [![AppVeyor Build Status](https://img.shields.io/appveyor/ci/stylelint/stylelint.svg)](https://travis-ci.org/stylelint/stylelint) [![Join the chat at https://gitter.im/stylelint/stylelint](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/stylelint/stylelint?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

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
