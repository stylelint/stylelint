# FAQ

## How do I lint from the command line?

Refer to the [CLI section](/docs/user-guide/cli.md) of the docs.

The CLI can also be used from within [npm run scripts](http://blog.keithcirkel.co.uk/how-to-use-npm-as-a-build-tool/) to use a non-global installation of stylelint.

## How do I lint using Git pre-commit hooks?

[lint-staged](https://github.com/okonet/lint-staged) is a NodeJS script that supports running stylelint against Git staged files.

## How do I lint using my task runner of choice?

The stylelint community maintains a [handful of plugins](/docs/user-guide/complementary-tools.md#build-tool-plugins) for popular task runners, including ones for gulp, webpack, Broccoli and Grunt. Refer to their individual READMEs to get started.

If there isn't a dedicated stylelint plugin for your task runner of choice, you can use stylelint as a PostCSS plugin and make use of PostCSS's [numerous](https://github.com/postcss/postcss#runners) task runner plugins.

There are also examples of using the PostCSS plugin via the PostCSS JS API within the [docs](/docs/user-guide/postcss-plugin.md).

However, using stylelint as a PostCSS plugin limits your reporting options to [postcss-reporter](https://github.com/postcss/postcss-reporter/). We recommend using the stylelint CLI or Node API, instead, for better reporting.

## How do I lint within my text editor?

The stylelint community also maintains a [handful of plugins](/docs/user-guide/complementary-tools.md#editor-plugins) for popular editors. Refer to their individual READMEs to get started.

## How do I lint SCSS, Less, or other non-standard syntax?

stylelint can *parse* any the following non-standard syntaxes: SCSS, Less and SugarSS. Refer to the [docs](/docs/user-guide/css-processors.md#parsing-non-standard-syntax) on how to configure stylelint to parse one of these syntaxes.

## Should I lint before or after processing my stylesheets through PostCSS plugins or other processors?

We [recommend](/docs/user-guide/css-processors.md) linting your source files before any transformations.

## How do I lint styles within `<style>` tags?

stylelint can *extract and lint* any styles within `<style>` tags. This can be done via the [Node API](/docs/user-guide/node-api.md#extractStyleTagsFromHtml) and the [CLI](/docs/user-guide/cli.md).

## How do I automatically fix stylistic warnings?

[stylefmt](https://github.com/morishitter/stylefmt) supports stylelint configuration files and can automatically fix a number of stylistic warnings.

## How do I manage conflicts between rules?

Each rule stands alone, so sometimes it's possible to configure rules such that they conflict with one another. For example, you could turn on two conflicting blacklist and whitelist rules, e.g. `unit-blacklist` and `unit-whitelist`.

It's your responsibility as the configuration author to resolve these conflicts.

## What is the difference between a plugin and a rule?

Rules focus on *standard css* and aim to be valuable to the majority of users. Whereas plugins are rules and sets of rules built by the community that support methodologies, toolsets, *non-standard* CSS features, or very specific use cases.

## Can I customise stylelint's messages?

Yes, you can either use the [`message` secondary option](/docs/user-guide/configuration.md#custom-messages) or [write your own formatter](/docs/developer-guide/formatters.md).

## How should I lint my CSS that follows a BEM-like methodology?

You'll want to make use of the [stylelint-selector-bem-pattern](https://github.com/davidtheclark/stylelint-selector-bem-pattern) plugin.

You can also take advantage of `selector-*` rules to ban certain categories of selectors (e.g. id selectors) and control specificity.

If you're using SUITCSS, you'll probably want to use [their shareable config](https://github.com/suitcss/stylelint-config-suitcss).

## How do I change the default severity to "warning" so stylelint doesn't break my build?

Use the [`defaultSeverity`](/docs/user-guide/configuration.md#defaultSeverity) configuration option.
