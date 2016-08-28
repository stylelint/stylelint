# stylelint

[![NPM version](http://img.shields.io/npm/v/stylelint.svg)](https://www.npmjs.org/package/stylelint) [![Build Status](https://travis-ci.org/stylelint/stylelint.svg?branch=master)](https://travis-ci.org/stylelint/stylelint) [![Build status](https://ci.appveyor.com/api/projects/status/wwajr0886e00g8je/branch/master?svg=true)](https://ci.appveyor.com/project/stylelint/stylelint/branch/master) [![Coverage Status](https://coveralls.io/repos/github/stylelint/stylelint/badge.svg?branch=master)](https://coveralls.io/github/stylelint/stylelint?branch=master) [![NPM Downloads](https://img.shields.io/npm/dm/stylelint.svg)](https://www.npmjs.org/package/stylelint) [![Bountysource](https://www.bountysource.com/badge/tracker?tracker_id=9282518)](https://www.bountysource.com/trackers/9282518-stylelint?utm_source=9282518&utm_medium=shield&utm_campaign=TRACKER_BADGE)

A mighty, modern CSS linter that helps you enforce consistent conventions and avoid errors in your stylesheets.

## Features

-   **Over one hundred and fifty rules:** Including those that:
    -   **Catch errors**: e.g. invalid hex colors, indistinguishable colors, or overriding shorthand properties.
    -   **Enforce best practices**: e.g. keeping specificity low or disallowing vendor prefixes in your source code.
    -   **Control what languages features can be used**: e.g. whitelisting specific units, properties and functions, or disallowing certain selector types.
    -   **Enforce code style conventions**: e.g. checking the spacing around the colon in declarations or specifying patterns for class selectors.
-   **Support for the latest CSS syntax:** Including custom properties, range context for media features, calc() and nesting.
-   **Understands *CSS-like* syntaxes:** The linter is powered by [PostCSS](https://github.com/postcss/postcss), so it understands any syntax that PostCSS can parse, including SCSS, [SugarSS](https://github.com/postcss/sugarss), and *experimental support* for Less.
-   **Completely unopinionated:** Only enable the rules you want, and configure them with options that tailor the linter to your needs.
-   **Support for plugins:** It's easy to create your own rules and add them to the linter.
-   **Automatically fix some stylistic warnings:** By using [stylefmt](https://github.com/morishitter/stylefmt) which supports stylelint configuration files.
-   **Shareable configs:** If you don't want to craft your own config, you can extend a shareable config.
-   **Options validator:** So that you can be confident that your config is valid.
-   **Growing community**: Used by [Facebook](https://code.facebook.com/posts/879890885467584/improving-css-quality-at-facebook-and-beyond/), [Github](https://github.com/primer/stylelint-config-primer), [Wikimedia](https://github.com/wikimedia/stylelint-config-wikimedia), [GSA](https://github.com/18F/stylelint-rules/), and [WordPress](https://github.com/ntwb/stylelint-config-wordpress/) among others.

## Example output

![Example](https://github.com/stylelint/stylelint/raw/master/example.png?raw=true)

## Getting started

With stylelint, it's easy to start linting your CSS:

1.  Decide how you want to use stylelint:
    -   [via the stylelint CLI](/docs/user-guide/cli.md)
    -   [via a plugin for your build tool](/docs/user-guide/complementary-tools.md#build-tool-plugins) (gulp, webpack etc)
    -   [via a plugin for your text editor](/docs/user-guide/complementary-tools.md#editor-plugins) (atom, sublime text etc)
    -   [via the stylelint Node API](/docs/user-guide/node-api.md)
    -   [via the stylelint PostCSS plugin](/docs/user-guide/postcss-plugin.md)
2.  Create your [configuration object](/docs/user-guide/configuration.md) by either extending a shared config or crafting your own:
    -   To extend a shared config, we recommend using [`stylelint-config-standard`](https://github.com/stylelint/stylelint-config-standard). It includes over 80 of stylelint's rules with sensible defaults. (You can always override specific rules after extending the config.) We update the config with each new release of stylelint. Alternately, you can [search for](https://www.npmjs.com/browse/keyword/stylelint-config) a community config and [extend](/docs/user-guide/configuration.md#extends) that instead.
    -   To craft your own config, first [learn about how rules are named and how they work together](/docs/user-guide/about-rules.md), then either:
        -   Start small and only learn about [the rules](/docs/user-guide/rules.md) you want to turn on and enforce. *All of the rules are off by default*, and so you can start small, growing your config over time as you have a chance to explore more of the rules.
        -   Or copy-paste [this example configuration](/docs/user-guide/example-config.md), which lists all of stylelint's rules and their primary options. Then you can edit the options of each rule to your liking, and remove (or turn off with `null`) the rules that you don't care to enforce.
3.  Lint!

## Guides

You'll find more detailed information on using stylelint and tailoring it to your needs in our guides:

-   [User guide](docs/user-guide.md) - Usage, configuration, FAQ and complementary tools.
-   [Developer guide](docs/developer-guide.md) - Contributing to stylelint and writing your own plugins & formatters.

## Need help?

If you're looking for help or have a support question, then check out our [FAQ](docs/user-guide/faq.md) first. If the answer to your problem isn't there, then go to [stackoverflow](http://stackoverflow.com/questions/tagged/stylelint). stackoverflow is a huge Question and Answer community, and tagging your post there with "stylelint" will catch the stylelint team's attention.

If you think you've found a bug or if you have feature request, then create a [new GitHub issue](https://github.com/stylelint/stylelint/issues/new). Be sure to follow the issue template, answering each question, as this helps us greatly in understanding your problem or request.

Upgrading? Please read our [CHANGELOG](CHANGELOG.md) to learn what changes to expect in the latest version, whether that's new features, bug fixes, renamed rules, or whatever else.

## Help out

There is always a lot of work to do, and already well over 150 rules to maintain. So please help out in any way that you can:

-   Chime in on any open [issue](https://github.com/stylelint/stylelint/issues) or [pull request](https://github.com/stylelint/stylelint/pulls).
-   Create, enhance, and debug rules (see our guide to ["Working on rules"](docs/developer-guide/rules.md)).
-   Improve [documentation](docs/).
-   Add new tests to *absolutely anything*.
-   Work on [improving performance of rules](docs/developer-guide/benchmarks.md).
-   Open new issues about your ideas for making stylelint better, and pull requests to show us how your idea works.
-   Create or contribute to ecosystem tools, like the plugins for [Atom](https://github.com/AtomLinter/linter-stylelint) and [Sublime Text](https://github.com/kungfusheep/SublimeLinter-contrib-stylelint).

[License](https://raw.githubusercontent.com/stylelint/stylelint/master/LICENSE)
