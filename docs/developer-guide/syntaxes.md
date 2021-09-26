# Writing custom syntaxes

Custom syntaxes are [PostCSS syntaxes](https://github.com/postcss/postcss#syntaxes) written by the community to support other styling languages or CSS-in-JS libraries using the [`customSyntax` option](../user-guide/usage/options.md#customSyntax)

To write one, familiarize yourself with PostCSS's [how to write custom syntax](https://github.com/postcss/postcss/blob/master/docs/syntax.md) guide.

Existing syntaxes that you can use for reference include:

- [postcss-scss](https://github.com/postcss/postcss-scss)
- [postcss-less](https://github.com/shellscape/postcss-less)

We recommend creating a shared-config that:

- extends the [standard config](https://github.com/stylelint/stylelint-config-standard)
- bundles your custom syntax
- turns off any incompatible built-in rules

For example:

```js
// stylelint-config-standard-my-syntax
module.exports = {
  extends: ["stylelint-config-recommended"],
  customSyntax: "postcss-your-syntax",
  rules: {
    "at-rule-no-unknown": null,
    ..
  }
};
```
