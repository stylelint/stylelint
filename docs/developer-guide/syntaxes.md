# Writing custom syntaxes

Custom syntaxes are [PostCSS syntaxes](https://github.com/postcss/postcss#syntaxes) written by the community to support other styling languages or CSS-in-JS libraries using the [`customSyntax` option](../user-guide/usage/options.md#customSyntax)

To write one, familiarize yourself with PostCSS's [how to write custom syntax](https://github.com/postcss/postcss/blob/main/docs/syntax.md) guide.

Existing syntaxes that you can use for reference include:

- [postcss-scss](https://github.com/postcss/postcss-scss)
- [postcss-less](https://github.com/shellscape/postcss-less)

We recommend creating a shared-config that:

- extends the [standard config](https://github.com/stylelint/stylelint-config-standard)
- bundles your custom syntax
- turns off any incompatible built-in rules

For example, if you're creating a syntax for a CSS-in-JS library called "foo" then we recommend creating a shared-config called "stylelint-config-standard-foo" with the following content:

```json
{
  "extends": ["stylelint-config-standard"],
  "customSyntax": "postcss-foo",
  "rules": {
    "at-rule-no-unknown": null,
    ..
  }
}
```
