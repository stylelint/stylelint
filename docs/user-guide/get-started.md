# Getting started

You can quickly get started by extending a shared config.

## Linting CSS

You can extend our [standard config](https://www.npmjs.com/package/stylelint-config-standard) to lint CSS.

1\. Use [npm](https://docs.npmjs.com/about-npm/) and [our `init` tool](https://www.npmjs.com/package/create-stylelint) to install Stylelint and the config:

```shell
npm init stylelint
```

2\. Run Stylelint on all the CSS files in your project:

```shell
npx stylelint "**/*.css"
```

Once you're up and running, you can [customize](./customize.md) Stylelint.

## Linting CSS-like languages and CSS within containers

You can extend a community config to lint:

- CSS-like languages, e.g. SCSS, Sass and Less
- CSS within containers, e.g. in HTML, CSS-in-JS and Vue SFCs

For example, to lint SCSS you can extend the [SCSS community config](https://www.npmjs.com/package/stylelint-config-standard-scss). It includes the:

- [SCSS syntax](https://www.npmjs.com/package/postcss-scss) - a custom syntax to parse SCSS
- [SCSS plugin](https://www.npmjs.com/package/stylelint-scss) - a set of custom rules for SCSS

1\. Use [npm](https://docs.npmjs.com/about-npm/) to install Stylelint and the config:

```shell
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

You'll find more community configs in [Awesome Stylelint](https://github.com/stylelint/awesome-stylelint#readme).

### Using a custom syntax directly

If a shared config isn't available for your preferred language or container, you can install the appropriate custom syntax and use the [`customSyntax` option](../user-guide/options.md#customsyntax) yourself.

For example, to lint CSS inside of [Lit elements](https://lit.dev/).

1\. Use [npm](https://docs.npmjs.com/about-npm/) to install Stylelint, our [standard config](https://www.npmjs.com/package/stylelint-config-standard) and the [Lit custom syntax](https://www.npmjs.com/package/postcss-lit):

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

3\. Run Stylelint on all the JavaScript files in your project:

```shell
npx stylelint "**/*.js"
```

You'll find more custom syntaxes in [Awesome Stylelint](https://github.com/stylelint/awesome-stylelint#custom-syntaxes).

#### Using more than one custom syntax

If you want to lint more than one language or container, you can use the [`overrides`](configure.md#overrides) property.

For example, to lint CSS files and the CSS within Lit Elements you can update your configuration to:

```json
{
  "extends": ["stylelint-config-standard"],
  "overrides": [
    {
      "files": ["*.js"],
      "customSyntax": "postcss-lit"
    }
  ]
}
```

And then run Stylelint on both your CSS and JavaScript files:

```shell
npx stylelint "**/*.{css,js}"
```
