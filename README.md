# stylelint

[![NPM version](https://img.shields.io/npm/v/stylelint.svg)](https://www.npmjs.org/package/stylelint) [![Build Status](https://travis-ci.org/stylelint/stylelint.svg?branch=master)](https://travis-ci.org/stylelint/stylelint) [![Build status](https://ci.appveyor.com/api/projects/status/wwajr0886e00g8je/branch/master?svg=true)](https://ci.appveyor.com/project/stylelint/stylelint/branch/master) [![NPM Downloads](https://img.shields.io/npm/dm/stylelint.svg)](https://npmcharts.com/compare/stylelint?minimal=true) [![Backers on Open Collective](https://opencollective.com/stylelint/backers/badge.svg)](#backers) [![Sponsors on Open Collective](https://opencollective.com/stylelint/sponsors/badge.svg)](#sponsors)

A mighty, modern linter that helps you avoid errors and enforce conventions in your styles.

## Features

It's mighty because it:

-   has over **160 built-in rules** to catch errors, apply limits and enforce stylistic conventions
-   understands the **latest CSS syntax** including custom properties and level 4 selectors
-   parses **CSS-like syntaxes** like SCSS, Sass, Less and SugarSS
-   extracts **embedded styles** from HTML, markdown and CSS-in-JS object & template literals
-   automatically **fixes** some violations (*experimental feature*)
-   supports **plugins** so you can create your own rules or make use of plugins written by the community
-   is **well tested** with over 10000 unit tests
-   supports **shareable configs** that you can extend or create your own of
-   is **unopinionated** so you can tailor the linter to your exact needs
-   has a **growing community** and is used by [Facebook](https://code.facebook.com/posts/879890885467584/improving-css-quality-at-facebook-and-beyond/), [GitHub](https://github.com/primer/stylelint-config-primer) and [WordPress](https://github.com/ntwb/stylelint-config-wordpress/)

## Example output

![Example](https://github.com/stylelint/stylelint/raw/master/example.png?raw=true)

## Getting started

It's easy to get started.

First, decide how you want to use stylelint:

-   [on the command line](docs/user-guide/cli.md)
-   [in your text editor](docs/user-guide/complementary-tools.md#editor-plugins), for example in VS Code
-   [in for your build tool](docs/user-guide/complementary-tools.md#build-tool-plugins), for example in webpack
-   [via the Node API](docs/user-guide/node-api.md)
-   [as a PostCSS plugin](docs/user-guide/postcss-plugin.md)

Then, create your [configuration object](docs/user-guide/configuration.md).

You can either extend a shared configuration or craft your own.

### Extend a shared configuration

It's the quickest way to get started. We suggest extending either:

-   [`stylelint-config-recommended`](https://github.com/stylelint/stylelint-config-recommended)
-   [`stylelint-config-standard`](https://github.com/stylelint/stylelint-config-standard)

The recommended one turns on the [possible error](docs/user-guide/rules.md#possible-errors) rules. The standard config builds on it by turning on over 60 of the [stylistic rules](docs/user-guide/rules.md#stylistic-issues) with sensible defaults. We update these configs with each release of stylelint, so it's easy to stay up to date.

However, you can use a community config, for example [`stylelint-config-recommended-scss`](https://github.com/kristerkari/stylelint-config-recommended-scss), if you use non-standard syntax like `@if`, `@extends` etc.

You can always override rules after extending any config. You may also want to add some rules that [limit language features](docs/user-guide/rules.md#limit-language-features) as these will be specific to your team and/or project.

### Craft your own config

Alternatively, you can [learn about the rules](docs/user-guide/about-rules.md) and then either:

-   start small and add only [the rules](docs/user-guide/rules.md) you want to turn on
-   copy, paste and adapt [this example configuration](docs/user-guide/example-config.md) which lists all of the rules and their primary options

## Guides

You'll find detailed information on customising stylelint in our guides:

-   [user guide](docs/user-guide.md) - how to use and configure stylelint
-   [developer guide](docs/developer-guide.md) - how to develop for stylelint

## Need help?

Read our [FAQ](docs/user-guide/faq.md) first. If the answer to your problem isn't there, then post it on [stackoverflow](https://stackoverflow.com/questions/tagged/stylelint).

Please create a [new issue](https://github.com/stylelint/stylelint/issues/new/choose) if you think you've found a bug or if you have feature request.

If you're upgrading, read our [CHANGELOG](CHANGELOG.md) to learn what changes to expect in the latest version.

## Help out

There is a lot of work to do. Please help out in any way. You can:

-   get involved in any open [issue](https://github.com/stylelint/stylelint/issues) or [pull request](https://github.com/stylelint/stylelint/pulls)
-   create, enhance and debug rules using our [working on rules](docs/developer-guide/rules.md) guide
-   improve the [documentation](docs/)
-   add new tests to *absolutely anything*
-   improve the [performance of rules](docs/developer-guide/rules.md#improving-the-performance-of-a-new-or-an-existing-rule)
-   open [new issues](https://github.com/stylelint/stylelint/issues/new/choose) about your ideas for making stylelint better
-   open [a pull request](https://github.com/stylelint/stylelint/compare) to show us how your idea works
-   create or contribute to [ecosystem tools](docs/user-guide/complementary-tools.md), for example the plugin for [VS Code](https://github.com/shinnn/vscode-stylelint)

If you're interested in the project vision, you can read our [VISION document](VISION.md).

## Semantic Versioning Policy

We have a [semantic versioning policy](docs/user-guide/semantic-versioning-policy.md). Any minor update may report more errors than the previous release. As such, we recommend using the tilde (`~`) in `package.json` e.g. `"stylelint": "~7.2.0"` to guarantee the results of your builds.

## License

[The MIT License](https://raw.githubusercontent.com/stylelint/stylelint/master/LICENSE).

## Contributors

This project exists thanks to all these people. [Contribute](CONTRIBUTING.md).
<a href="https://github.com/stylelint/stylelint/graphs/contributors"><img src="https://opencollective.com/stylelint/contributors.svg?width=890" /></a>

## Backers

Thank you to all our backers! [Become a backer](https://opencollective.com/stylelint#backer).

<a href="https://opencollective.com/stylelint#backers" target="_blank"><img src="https://opencollective.com/stylelint/backers.svg?width=890"></a>


## Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. [Become a sponsor](https://opencollective.com/stylelint#sponsor).

<a href="https://opencollective.com/stylelint/sponsor/0/website" target="_blank"><img src="https://opencollective.com/stylelint/sponsor/0/avatar.svg"></a>
