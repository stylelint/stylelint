# FAQ

## How do I lint within my text editor?

The stylelint community maintains a [handful of plugins](/docs/user-guide/complementary-tools.md#editor-plugins) for popular editors. Refer to their individual READMEs to get started.

## How do I lint from the command line?

First, install stylelint using the `-g` option:

```shell
npm install -g stylelint
```

Then refer to the [CLI usage examples](/docs/user-guide/cli.md) within the doc.

The CLI can also be used from within [npm run scripts](http://blog.keithcirkel.co.uk/how-to-use-npm-as-a-build-tool/) to use a non-global installation of stylelint.

## How do I use stylelint with gulp?

Use [`gulp-stylelint`](https://github.com/olegskl/gulp-stylelint).

## How do I lint using webpack?

Use [stylelint-webpack-plugin](https://github.com/vieron/stylelint-webpack-plugin).

## How do I lint using other task runners like grunt?

If there isn't a dedicated stylelint plugin for your task runner of choice, you can use stylelint as a PostCSS plugin and make use of PostCSS's [numerous](https://github.com/postcss/postcss#runners) task runner plugins.

There are example of using the PostCSS plugin within the [docs](/docs/user-guide/postcss-plugin.md).

## How do I lint SCSS, Less, or other non-standard syntax?

stylelint can *parse* any the following non-standard syntaxes: SCSS, Less and SugarSS. Refer to the [docs](/docs/user-guide/css-processors.md#parsing-non-standard-syntax) on how to configure stylelint to parse one of these syntaxes.

## How do I automatically fix stylistic warnings?

[stylefmt](https://github.com/morishitter/stylefmt) supports stylelint configuration files and can automatically fix a number of stylistic warnings.

## Can I use stylelint as a PostCSS plugin?

[Yes, you can](/docs/user-guide/postcss-plugin.md), but it limits your reporting options to [postcss-reporter](https://github.com/postcss/postcss-reporter/). We recommend using the CLI or Node API, instead, for better reporting.

## Should I lint before or after processing my stylesheets through PostCSS plugins or other processors?

We [recommend](/docs/user-guide/css-processors.md) linting your source files before any transformations.

## How should I lint my CSS that follows a BEM-like methodology?

You'll want to make use of the [`stylelint-selector-bem-pattern`](https://github.com/davidtheclark/stylelint-selector-bem-pattern) plugin.

You can also take advantage of `selector-*` rules to ban certain categories of selectors (e.g. id selectors) and control specificity.

If you're using SUITCSS, you'll probably want to use [their shareable config](https://github.com/suitcss/stylelint-config-suitcss).

## How do I manage conflicts between rules?

Each rule stands alone, so sometimes it's possible to configure rules such that they conflict with one another. For example, you could configure the `string-quotes` rule to `"single"`, but configure `font-family-name-quotes` to use `"double-where-recommended"`. Or turn on two conflicting blacklist and whitelist rules e.g. `unit-blacklist` and `unit-whitelist`.

It's your responsibility as the configuration author to resolve these conflicts.

## What is the difference between a plugin and a rule?

Rules focus on *standard css* and aim to be valuable to the majority of users. Whereas plugins are rules built by the community that support methodologies, toolsets, *non-standard* CSS features, or very specific use cases.

## Can I customise stylelint's messages?

Yes, you can either use the [`message` secondary option](/docs/user-guide/configuration.md#custom-messages) or [write your own formatter](/docs/developer-guide/formatters.md).
