# Getting started

Stylelint is designed for CSS.

However, it can be used with [PostCSS syntaxes](https://github.com/postcss/postcss#syntaxes) that:

- parse CSS-like languages like SCSS, Less and SugarSS
- extract styles from HTML, JavaScript and Markdown

## Linting CSS

1\. Use [npm](https://docs.npmjs.com/about-npm/) to install Stylelint and its [standard configuration](https://github.com/stylelint/stylelint-config-standard):

```shell
npm install --save-dev stylelint stylelint-config-standard
```

2\. Create a `.stylelintrc.json` configuration file in the root of your project with the following content:

```json
{
  "extends": "stylelint-config-standard"
}
```

3\. Run Stylelint on all the CSS files in your project:

```shell
npx stylelint "**/*.css"
```

If you use a pretty printer alongside Stylelint, you should turn off any conflicting rules. For example, you can use [Prettier's shared config](https://github.com/prettier/stylelint-config-prettier) to do that:

```json
{
  "extends": ["stylelint-config-standard", "stylelint-config-prettier"]
}
```

## Linting everything else

You'll need to use a [PostCSS syntax](https://github.com/postcss/postcss#syntaxes). We recommend [extending](../user-guide/configure.md#extends) a shared config that includes the appropriate syntax for your preferred language or library. For example, you can extend the [stylelint-config-standard-scss shared config](https://www.npmjs.com/package/stylelint-config-standard-scss) to lint SCSS.

1\. Use [npm](https://docs.npmjs.com/about-npm/) to install Stylelint and the shared config:

```console
npm install --save-dev stylelint stylelint-config-standard-scss
```

2\. Create a `.stylelintrc.json` configuration file in the root of your project with the following content:

```json
{
  "extends": "stylelint-config-standard-scss"
}
```

3\. Run Stylelint on all the SCSS files in your project:

```shell
npx stylelint "**/*.scss"
```

This config includes the [postcss-scss syntax](https://github.com/postcss/postcss-scss), configures the [built-in rules](../user-guide/rules/list.md) for SCSS, and includes the [stylelint-scss plugin](https://www.npmjs.com/package/stylelint-scss) (a collection of rules specific to SCSS).

If you use Prettier alongside Stylelint, you should use their [SCSS shared config](https://github.com/prettier/stylelint-config-prettier-scss):

```json
{
  "extends": [
    "stylelint-config-standard-scss",
    "stylelint-config-prettier-scss"
  ]
}
```

If a shared config isn't available for your preferred language or library, then you can install the appropriate [PostCSS syntax](https://github.com/postcss/postcss#syntaxes) yourself and use the [`customSyntax` option](../user-guide/usage/options.md#customSyntax) to configure it.

For example, to lint [SugarSS](https://github.com/postcss/sugarss).

1\. Use [npm](https://docs.npmjs.com/about-npm/) to install Stylelint, its [standard configuration](https://github.com/stylelint/stylelint-config-standard) and the [sugarss syntax](https://www.npmjs.com/package/sugarss):

```shell
npm install --save-dev stylelint stylelint-config-standard sugarss
```

2\. Create a `.stylelintrc.json` configuration file in the root of your project with the following content:

```json
{
  "extends": "stylelint-config-standard",
  "customSyntax": "sugarss"
}
```

Other PostCSS syntaxes known to be compatible with Stylelint include:

- [postcss-html](https://www.npmjs.com/package/postcss-html)
- [postcss-less](https://www.npmjs.com/package/postcss-less)
- [postcss-sass](https://www.npmjs.com/package/postcss-sass)
- [sugarss](https://www.npmjs.com/package/sugarss)

If you lint more than one styling language, then you can use the [`overrides`](configure.md#overrides) property. For example, to lint both CSS and [SugarSS](https://github.com/postcss/sugarss) you can update your configuration object to include:

```json
{
  "extends": ["stylelint-config-standard"],
  "overrides": [
    {
      "files": ["**/*.sss"],
      "customSyntax": "sugarss",
      "rules": {
        "block-closing-brace-empty-line-before": null,
        "block-closing-brace-newline-after": null,
        "block-closing-brace-newline-before": null,
        "block-closing-brace-space-before": null,
        "block-opening-brace-newline-after": null,
        "block-opening-brace-space-after": null,
        "block-opening-brace-space-before": null,
        "declaration-block-semicolon-newline-after": null,
        "declaration-block-semicolon-space-after": null,
        "declaration-block-semicolon-space-before": null,
        "declaration-block-trailing-semicolon": null
      }
    }
  ]
}
```

Which will extend the [official standard config](https://github.com/stylelint/stylelint-config-standard), then use the `overrides` property to change the custom-syntax and turn off the rules that check braces and semicolons for SugarSS files.

You can then use Stylelint to lint both CSS and SugarSS files:

```console
npx stylelint "**/*.{css,sss}"
```

More [configs](https://github.com/stylelint/awesome-stylelint#configs) are listed in [awesome stylelint](https://github.com/stylelint/awesome-stylelint).

## Customize

You can further customize Stylelint to your specific needs.

### Your configuration

You can adapt your:

- [rules](configure.md#rules)
- [plugins](configure.md#plugins)

We recommend you add [more of the rules that enforce conventions](rules/list.md#enforce-conventions) to your configuration, e.g. [`unit-allowed-list`](../../lib/rules/unit-allowed-list/README.md) and [`selector-max-id`](../../lib/rules/selector-max-id/README.md). These are powerful rules that you can use to enforce non-stylistic consistency in your code.

You can add plugins written by the community to lint more things. For example, you may want to use the [stylelint-csstree-validator plugin](https://github.com/csstree/stylelint-validator) to validate property and value pairs.

You'll find more [plugins](https://github.com/stylelint/awesome-stylelint#plugins) listed in [awesome stylelint](https://github.com/stylelint/awesome-stylelint).

### Your usage

You don't have to use the [Command Line Interface](usage/cli.md); you can also use the:

- [Node API](usage/node-api.md)
- [PostCSS plugin](usage/postcss-plugin.md)

There are also integrations for [editors](integrations/editor.md), [task-runners](integrations/task-runner.md) and [others](integrations/other.md) too. Our [official extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint) is a popular choice that lets you see problems inline in your editor.
