# Getting started

stylelint is geared towards linting CSS. However, you can [extend it](../about/vision#extensible) to lint other styling languages like SCSS and CSS-in-JS libaries like styled-components.

## Linting CSS

1\. Use [npm](https://docs.npmjs.com/about-npm/) to install stylelint and its [`standard configuration`](https://github.com/stylelint/stylelint-config-standard):

```shell
npm install --save-dev stylelint stylelint-config-standard
```

2\. Create a `.stylelintrc.json` configuration file in the root of your project with the following content:

```json
{
  "extends": "stylelint-config-standard"
}
```

3\. Run stylelint on all the CSS files in your project:

```shell
npx stylelint "**/*.css"
```

## Linting other styling languages or libraries

stylelint can be extended, using the [`customSyntax` option](usage/options.md#customSyntax), to:

- parse CSS-like syntaxes like SCSS, Sass, Less and SugarSS
- extract embedded styles from HTML, Markdown and CSS-in-JS object & template literals

We recommend installing and [extending](https://stylelint.io/user-guide/configure#extends) a shared-config written by the community that includes the appropriate [PostCSS syntax(es)](https://github.com/postcss/postcss#syntaxes) for you. For example, if you lint SCSS then you can use the [stylelint-config-standard-scss]() shared-config.

1\. Use [npm](https://docs.npmjs.com/about-npm/) to install stylelint and the config:

```console
npm install --save-dev stylelint stylelint-config-standard-scss
```

2\. Create a `.stylelintrc.json` configuration file in the root of your project with the following content:

```json
{
  "extends": ["stylelint-config-standard-scss"]
}
```

3\. Run stylelint on all the SCSS files in your project:

```shell
npx stylelint "**/*.scss"
```

The [stylelint-config-standard-scss]() shared-config extends stylelint to be compatible with SCSS. It configures the built-in rules for SCSS, and includes the [postcss-scss](https://github.com/postcss/postcss-scss) syntax and [stylelint-scss](https://github.com/kristerkari/stylelint-scss) plugin (a collection of rules specific to SCSS).

Other shared-configs that include an appropriate PostCSS syntax are:

- [stylelint-config-standard-styled-components] ???

If a shared-config isn't available for your choice of language or CSS-in-JS library, then you can install the appropriate PostCSS Syntax yourself. For example, to lint [SugarSS](https://github.com/postcss/sugarss):

1\. Use [npm](https://docs.npmjs.com/about-npm/) to install stylelint and the syntax:

```console
npm install --save-dev stylelint sugarss
```

2\. Create a `.stylelintrc.json` configuration file in the root of your project with the following content:

```json
{
  "customSyntax": "sugarss",
  "extends": "stylelint-config-standard"
}
```

PostCSS syntaxes known to be compatible with stylelint include:

- [postcss-scss](https://github.com/postcss/postcss-scss)
- [postcss-less](https://github.com/webschik/postcss-less)
- [postcss-sass](https://github.com/AleshaOleg/postcss-sass)
- [sugarss](https://github.com/postcss/sugarss)

If a PostCSS syntax doesn't exist for your choice of language or CSS-in-JS lribary, please consider creating it and sharing it with the community. It'll need to be compatible with version 8 of PostCSS.

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

Which will extend the [offical standard config](https://github.com/stylelint/stylelint-config-standard), then use the `overrides` property to set the custom-syntax and turn off the rules that check braces and semicolons for SugarSS files.

You can then use stylelint to lint both CSS and SugarSS files:

```console
npx stylelint "**/*.{css,sss}"
```

More [configs](https://github.com/stylelint/awesome-stylelint#configs) are listed in [awesome stylelint](https://github.com/stylelint/awesome-stylelint).

## Customize

Whether you're linting CSS or another styling language, you can further customize stylelint to your specific needs.

### Your configuration

To further customize your stylelint configuration, you can adapt your:

- [rules](configure.md#rules)
- [plugins](configure.md#plugins)

We recommend you add [rules that limit language features](rules/list.md#limit-language-features) to your configuration, e.g. [`unit-allowed-list`](../../lib/rules/unit-allowed-list/README.md), [`selector-class-pattern`](../../lib/rules/selector-class-pattern/README.md) and [`selector-max-id`](../../lib/rules/selector-max-id/README.md). These are powerful rules that you can use to enforce non-stylistic consistency in your code.

You can add plugins written by the community to lint more things. For example, you may want to use:

- [stylelint-order plugin](https://github.com/hudochenkov/stylelint-order) if you want to order things like properties
- [stylelint-csstree-validator plugin](https://github.com/csstree/stylelint-validator) if you want to validate property and value pairs

You'll find more [plugins](https://github.com/stylelint/awesome-stylelint#plugins) listed in [awesome stylelint](https://github.com/stylelint/awesome-stylelint).

### Your usage

You don't have to use the [Command Line Interface](usage/cli.md); you can also use the:

- [Node API](usage/node-api.md)
- [PostCSS plugin](usage/postcss-plugin.md)

There are also integrations for [editors](integrations/editor.md), [task-runners](integrations/task-runner.md) and [others](integrations/other.md) too. Our [offical extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint) is a popular choice that lets you see violations inline in your editor.
