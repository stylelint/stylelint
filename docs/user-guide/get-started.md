# Getting started

You can lint:

- CSS files by using our standard config
- everything else by using extensions written by the community

## Linting CSS files

1\. Use [npm](https://docs.npmjs.com/about-npm/) to install Stylelint and its [standard configuration](https://www.npmjs.com/package/stylelint-config-standard):

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

_You should include quotation marks around file globs._

If you use a pretty printer alongside Stylelint, you should turn off any conflicting rules. For example, you can use [Prettier's shared config](https://www.npmjs.com/package/stylelint-config-prettier) to do that:

```shell
npm install --save-dev stylelint-config-prettier
```

```json
{
  "extends": ["stylelint-config-standard", "stylelint-config-prettier"]
}
```

## Linting everything else

You'll need to use a [custom syntax](usage/options.md#customsyntax) written by the community.

### Using a community shared config

We recommend [extending](../user-guide/configure.md#extends) a shared config that includes the appropriate syntax for your preferred language or library. For example, you can extend the [stylelint-config-standard-scss](https://www.npmjs.com/package/stylelint-config-standard-scss) shared config to lint [SCSS](https://sass-lang.com/).

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

_You should include quotation marks around file globs._

This config includes the [postcss-scss syntax](https://www.npmjs.com/package/postcss-scss), configures the [built-in rules](../user-guide/rules.md) for SCSS, and includes the [stylelint-scss plugin](https://www.npmjs.com/package/stylelint-scss) (a collection of rules specific to SCSS).

If you use Prettier alongside Stylelint, you should use their [shared config for SCSS](https://www.npmjs.com/package/stylelint-config-prettier-scss):

```json
{
  "extends": [
    "stylelint-config-standard-scss",
    "stylelint-config-prettier-scss"
  ]
}
```

Other shared configs include:

- [stylelint-config-html](https://www.npmjs.com/package/stylelint-config-html)
- [stylelint-config-recommended-vue](https://www.npmjs.com/package/stylelint-config-recommended-vue)

### Using a custom syntax directly

If a shared config isn't available for your preferred language or library, then you can install the appropriate custom syntax yourself and use the [`customSyntax` option](../user-guide/usage/options.md#customsyntax) to configure it.

For example, to lint the CSS inside of [Lit elements](https://lit.dev/).

1\. Use [npm](https://docs.npmjs.com/about-npm/) to install Stylelint, its [standard configuration](https://www.npmjs.com/package/stylelint-config-standard) and the [postcss-lit](https://www.npmjs.com/package/postcss-lit):

```shell
npm install --save-dev stylelint stylelint-config-standard postcss-lit
```

2\. Create a `.stylelintrc.json` configuration file in the root of your project with the following content:

```json
{
  "extends": "stylelint-config-standard",
  "customSyntax": "postcss-lit"
}
```

Other PostCSS syntaxes known to be compatible with Stylelint include:

- [postcss-markdown](https://www.npmjs.com/package/postcss-markdown)
- [postcss-less](https://www.npmjs.com/package/postcss-less)
- [postcss-sass](https://www.npmjs.com/package/postcss-sass)
- [sugarss](https://www.npmjs.com/package/sugarss)

### Using more than one custom syntax

You can use the [`overrides`](configure.md#overrides) property. For example, to lint CSS files and the CSS within Lit Elements you can update your configuration object to include:

```json
{
  "extends": ["stylelint-config-standard"],
  "overrides": [
    {
      "files": ["**/*.{js}"],
      "customSyntax": "postcss-lit"
    }
  ]
}
```

You can then use Stylelint to lint both CSS and JavaScript files:

```console
npx stylelint "**/*.{css,js}"
```

More [configs](https://github.com/stylelint/awesome-stylelint#configs) are listed in [awesome stylelint](https://github.com/stylelint/awesome-stylelint).

## Customize

You can further customize Stylelint to your specific needs.

### Your configuration

You can adapt your:

- [rules](configure.md#rules)
- [plugins](configure.md#plugins)

We recommend you add [more of the rules that enforce conventions](rules.md#enforce-non-stylistic-conventions) to your configuration, e.g. [`unit-allowed-list`](../../lib/rules/unit-allowed-list/README.md) and [`selector-max-id`](../../lib/rules/selector-max-id/README.md). These are powerful rules that you can use to enforce non-stylistic consistency in your code.

You can add plugins written by the community to lint more things. For example, you may want to use the [stylelint-csstree-validator plugin](https://www.npmjs.com/package/stylelint-csstree-validator) to validate property and value pairs.

You'll find more [plugins](https://github.com/stylelint/awesome-stylelint#plugins) listed in [awesome stylelint](https://github.com/stylelint/awesome-stylelint).

### Your usage

You don't have to use the [Command Line Interface](usage/cli.md); you can also use the:

- [Node API](usage/node-api.md)
- [PostCSS plugin](usage/postcss-plugin.md)

There are also integrations for [editors](integrations/editor.md), [task-runners](integrations/task-runner.md) and [others](integrations/other.md) too. Our [official extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint) is a popular choice that lets you see problems inline in your editor.
