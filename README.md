# stylelint [![NPM version](http://img.shields.io/npm/v/stylelint.svg)](https://www.npmjs.org/package/stylelint) [![Travis Build Status](https://img.shields.io/travis/stylelint/stylelint/master.svg?label=unix%20build)](https://travis-ci.org/stylelint/stylelint) [![AppVeyor Build Status](https://img.shields.io/appveyor/ci/MoOx/stylelint/master.svg?label=windows%20build)](https://ci.appveyor.com/project/MoOx/stylelint) [![Join the chat at https://gitter.im/stylelint/stylelint](https://img.shields.io/badge/gitter%20-join%20chat%20%E2%9E%9E-1dce73.svg)](https://gitter.im/stylelint/stylelint)

> Modern CSS linter.

## Features

* _Nearly a hundred rules_ - from stylistic rules, such as checking the spacing around the colon in declarations, to rules that catch subtle coding mistakes, such as invalid hex colors or [overriding shorthand properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Shorthand_properties#Tricky_edge_cases).
* _Support for the latest CSS syntax_ - including custom properties, range context for media features, calc() and nesting.
* _Completely unopinionated_ - only enable the rules you want and configure them with options to tailor the linter to your needs.
* _Shareable configs_ - if you don't want to craft your own config you can use a shareable config.
* _Support for plugins_ - it's easy to create your own rules and add them to the linter.
* _Options validator_ - so you can be confident that your config is valid.

## Example output

![Example](example.png?raw=true)

## Installation

```console
$ npm install -g stylelint
```

## Usage

If it's your first time using stylelint, you'll need to create a `.stylelintrc` file in your directory and add your configuration to it.

After that, you can run stylelint on any CSS file:

```console
stylelint test.css test2.css
```

## Configuration

You can either craft your own config or use a [pre-written one](#shareable-configs).

A crafted config will look something like:

```json
{
  "rules": {
    "color-no-invalid-hex": 2,
    "declaration-colon-space-before": [2, "never"],
    "indentation": [2, "tab"]
  }
}
```

The names `"color-no-invalid-hex"`, `"declaration-colon-space-before"` and `"indentation"` are the names of [rules](docs/rules.md) in stylelint. The number is the error level of the rule and can be one of the three values:

* `0` - turn the rule off
* `1` - turn the rule on as a warning (doesn't affect exit code)
* `2` - turn the rule on as an error (exit code will be 1)

## Guides

You'll find more detailed information on tailoring stylelint to your needs in our guides:

* [User guide](docs/user-guide.md) - Usage, configuration and complementary tools.
* [Developer guide](docs/developer-guide.md) - Contributing to stylelint and writing your own plugins & formatters.

## [Changelog](CHANGELOG.md)

## [Contributing](CONTRIBUTING.md)

## [License](LICENSE)
