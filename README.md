# stylelint

[![NPM version](http://img.shields.io/npm/v/stylelint.svg)](https://www.npmjs.org/package/stylelint) [![Build Status](https://travis-ci.org/stylelint/stylelint.svg?branch=master)](https://travis-ci.org/stylelint/stylelint) [![Build status](https://ci.appveyor.com/api/projects/status/wwajr0886e00g8je/branch/master?svg=true)](https://ci.appveyor.com/project/stylelint/stylelint/branch/master)

A mighty, modern CSS linter that helps you enforce consistent conventions and avoid errors in your stylesheets.

## Features

- **Over a hundred rules:** From stylistic rules (e.g. checking the spacing around the colon in declarations) to rules that catch subtle coding mistakes (e.g. invalid hex colors or [overriding shorthand properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Shorthand_properties#Tricky_edge_cases)).
- **Support for the latest CSS syntax:** Including custom properties, range context for media features, calc() and nesting.
- **Understands *CSS-like* syntaxes:** The linter is powered by [PostCSS](https://github.com/postcss/postcss), so it understands any syntax that PostCSS can parse, including SCSS.
- **Completely unopinionated:** Only enable the rules you want, and configure them with options that tailor the linter to your needs.
- **Shareable configs:** If you don't want to craft your own config, you can extend a shareable config.
- **Support for plugins:** It's easy to create your own rules and add them to the linter.
- **Options validator:** So that you can be confident that your config is valid.

## Example output

![Example](https://github.com/stylelint/stylelint/raw/master/example.png?raw=true)

## Quick start

With stylelint, it's easy to start linting your CSS:

1. Install stylelint: `npm install stylelint`.
2. Choose whether you want to craft your own config or extend a pre-written, shared config.

   - If you want to use a pre-written config, just find one and extend it. We recommend trying [`stylelint-config-standard`](https://github.com/stylelint/stylelint-config-standard), which includes around 60 of stylelint's rules with sensible defaults. (You can always override specific rules after extending a config.)
   - To craft your own from the ground up, just learn about [some rules](/docs/user-guide/rules.md). *All of the rules are off by default*, so you only have to learn about the rules you want to turn on and enforce. That way you can start small, growing your config over time as you have a chance to explore more of the rules. Alternately, copy-paste [this example configuration](/docs/user-guide/example-config.md), which lists all of stylelint's rules and their primary options, then remove (or turn off) the rules you don't want and edit the primary option of each rule to your liking.
3. Create your [configuration](/docs/user-guide/configuration.md), probably as a `.stylelintrc` file.
4. Decide whether to use the [CLI](/docs/user-guide/cli.md), [Node API](/docs/user-guide/node-api.md), or [PostCSS plugin](/docs/user-guide/postcss-plugin.md). Be sure to [specify the syntax](/docs/user-guide/css-processors.md#parsing-scss) if you're using SCSS.
5. Lint!

## Guides

You'll find more detailed information on using the linter and tailoring it to your needs in our guides:

- [User guide](docs/user-guide.md) - Usage, configuration and complementary tools.
- [Developer guide](docs/developer-guide.md) - Contributing to stylelint and writing your own plugins & formatters.

## Important Documents

- [Changelog](CHANGELOG.md)
- [Contributing Guidelines](CONTRIBUTING.md)
- [License](https://raw.githubusercontent.com/stylelint/stylelint/master/LICENSE)
