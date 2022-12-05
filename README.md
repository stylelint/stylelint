# Stylelint

[![npm version](https://img.shields.io/npm/v/stylelint)](https://www.npmjs.com/package/stylelint)
[![Build Status](https://github.com/stylelint/stylelint/workflows/Testing/badge.svg)](https://github.com/stylelint/stylelint/actions/workflows/testing.yml?query=branch%3Amain)
[![npm downloads](https://img.shields.io/npm/dm/stylelint)](https://npmcharts.com/compare/stylelint?minimal=true)

A mighty, modern linter that helps you avoid errors and enforce conventions in your styles.

## Features

It's mighty as it:

- has over **100 built-in rules** for modern CSS syntax and features
- supports **plugins** so you can create your own rules
- automatically **fixes problems** where possible
- is **well tested** with over 15000 unit tests
- supports **shareable configs** that you can extend or create
- is **unopinionated** so that you can customize it to your exact needs
- **complements pretty printers** like Prettier
- has a **growing community** and is used by Google, GitHub and WordPress

And can be extended to:

- parse **CSS-like syntaxes** like SCSS, Sass, Less and SugarSS
- extract **embedded styles** from HTML, Markdown and CSS-in-JS object & template literals

## How it'll help you

It'll help you **avoid errors**, for example:

- invalid things, e.g. malformed hex colors and named grid areas
- unknown things, e.g. units and functions that aren't in the CSS specs
- valid things that are problematic, e.g. duplicated selectors and overridden properties

And **enforce conventions**, for example:

- what units, functions, at-rules etc are allowed
- consistent patterns for selector names, at-rule names, custom properties etc
- maximum specificity or maximum quantity of each selector type
- your preferred notation for color functions, font weight etc
- consistent empty lines before constructs

We recommend using Stylelint alongside a pretty printer like Prettier. Linters and pretty printers are complementary tools that work together to help you write consistent and error-free code that is well-formatted.

## Example output

![Example](example.png)

## Guides

- User guide
  - [Getting started](docs/user-guide/get-started.md)
  - [Configuration](docs/user-guide/configure.md)
  - [Rules](docs/user-guide/rules.md)
  - Usage
    - [CLI](docs/user-guide/usage/cli.md)
    - [Node.js API](docs/user-guide/usage/node-api.md)
    - [PostCSS plugin](docs/user-guide/usage/postcss-plugin.md)
    - [Options](docs/user-guide/usage/options.md)
  - Integrations
    - [Editor integrations](docs/user-guide/integrations/editor.md)
    - [Task runner integrations](docs/user-guide/integrations/task-runner.md)
    - [Other integrations](docs/user-guide/integrations/other.md)
  - [Ignoring code](docs/user-guide/ignore-code.md)
  - [Combining rules](docs/user-guide/combine.md)
  - [Using regex](docs/user-guide/regex.md)
  - [Errors & warnings](docs/user-guide/errors.md)
- Developer guide
  - [Working on rules](docs/developer-guide/rules.md)
  - [Writing plugins](docs/developer-guide/plugins.md)
  - [Writing custom syntaxes](docs/developer-guide/syntaxes.md)
  - [Writing custom formatters](docs/developer-guide/formatters.md)
  - [Writing system tests](docs/developer-guide/system-tests.md)
- Migration guide
  - [Migrating to 15.0.0](docs/migration-guide/to-15.md)
  - [Migrating to 14.0.0](docs/migration-guide/to-14.md)
- Maintainer guide
  - [Managing issues](docs/maintainer-guide/issues.md)
  - [Managing pull requests](docs/maintainer-guide/pull-requests.md)
  - [Performing releases](docs/maintainer-guide/releases.md)
- About
  - [Vision](docs/about/vision.md)
  - [Semantic versioning](docs/about/semantic-versioning.md)

## Contributors

Stylelint is maintained by volunteers. Without the code contributions from [all these fantastic people](https://github.com/stylelint/stylelint/graphs/contributors), Stylelint would not exist. [Become a contributor](CONTRIBUTING.md).

### Sponsors

<object data="https://opencollective.com/stylelint/sponsors.svg?width=420&button=false" type="image/svg+xml">
  <img src="https://opencollective.com/stylelint/sponsors.svg?width=840&button=false" />
</object>

Thank you to all our sponsors! [Become a sponsor](https://opencollective.com/stylelint).

### Backers

<object data="https://opencollective.com/stylelint/backers.svg?width=420&avatarHeight=48&button=false" type="image/svg+xml">
  <img src="https://opencollective.com/stylelint/backers.svg?width=840&avatarHeight=48&button=false" />
</object>

Thank you to all our backers! [Become a backer](https://opencollective.com/stylelint).

### Website hosting

[![Deploys by Netlify](https://www.netlify.com/img/global/badges/netlify-color-accent.svg)](https://www.netlify.com)

## License

[The MIT License](https://raw.githubusercontent.com/stylelint/stylelint/main/LICENSE).
