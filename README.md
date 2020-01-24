# stylelint

[![NPM version](https://img.shields.io/npm/v/stylelint.svg)](https://www.npmjs.org/package/stylelint) [![Build Status](https://github.com/stylelint/stylelint/workflows/CI/badge.svg)](https://github.com/stylelint/stylelint/actions) [![NPM Downloads](https://img.shields.io/npm/dm/stylelint.svg)](https://npmcharts.com/compare/stylelint?minimal=true)

A mighty, modern linter that helps you avoid errors and enforce conventions in your styles.

## Features

It's mighty as it:

-   understands the **latest CSS syntax** including custom properties and level 4 selectors
-   extracts **embedded styles** from HTML, markdown and CSS-in-JS object & template literals
-   parses **CSS-like syntaxes** like SCSS, Sass, Less and SugarSS
-   has over **170 built-in rules** to catch errors, apply limits and enforce stylistic conventions
-   supports **plugins** so you can create your own rules or make use of plugins written by the community
-   automatically **fixes** some violations (*experimental feature*)
-   is **well tested** with over 15000 unit tests
-   supports **shareable configs** that you can extend or create
-   is **unopinionated** so that you can customize it to your exact needs
-   has a **growing community** and is used by [Facebook](https://code.facebook.com/posts/879890885467584/improving-css-quality-at-facebook-and-beyond/), [GitHub](https://github.com/primer/stylelint-config-primer) and [WordPress](https://github.com/ntwb/stylelint-config-wordpress/)

## Example output

![Example](https://github.com/stylelint/stylelint/raw/master/example.png?raw=true)

## Getting started

1\. Use [npm](https://docs.npmjs.com/about-npm/) to install stylelint and its [`standard configuration`](https://github.com/stylelint/stylelint-config-standard):

```shell
npm install -D stylelint stylelint-config-standard
```

2\. Create a `.stylelintrc.json` configuration file in the root of your project:

```json
{
  "extends": "stylelint-config-standard"
}
```

3\. Run stylelint on, for example, all the CSS files in your project:

```shell
npx stylelint "**/*.css"
```

This will lint your CSS for [possible errors](docs/user-guide/rules/list.md#possible-errors) and [stylistic issues](docs/user-guide/rules/list.md#stylistic-issues).

Now that you're up and running, you'll likely want [to customize](docs/user-guide/customize.md) how you configure and use stylelint.

## Contributors

Without the contributions from [all these fantastic people](https://github.com/stylelint/stylelint/graphs/contributors), stylelint would not exist. [Become a contributor](CONTRIBUTING.md).

## Backers

<a href="https://opencollective.com/stylelint#backers" target="_blank"><img src="https://opencollective.com/stylelint/backers.svg?width=890"></a>

Thank you to all our backers! [Become a backer](https://opencollective.com/stylelint#backer).

## Sponsors

<a href="https://opencollective.com/stylelint/sponsor/0/website" target="_blank"><img src="https://opencollective.com/stylelint/sponsor/0/avatar.svg"></a>

Support this project to show your logo here with a link to your website. [Become a sponsor](https://opencollective.com/stylelint#sponsor).

## License

[The MIT License](https://raw.githubusercontent.com/stylelint/stylelint/master/LICENSE).
