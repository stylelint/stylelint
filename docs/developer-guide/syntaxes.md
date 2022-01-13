# Writing custom syntaxes

Custom syntaxes are [PostCSS syntaxes](https://github.com/postcss/postcss#syntaxes) written by the community to support other styling languages and CSS-in-JS libraries using the [`customSyntax` option](../user-guide/usage/options.md#customSyntax).

To write one, familiarize yourself with PostCSS's [how to write custom syntax](https://github.com/postcss/postcss/blob/main/docs/syntax.md) guide.

Existing syntaxes that you can use for reference include:

- [postcss-scss](https://www.npmjs.com/package/postcss-scss)
- [postcss-less](https://www.npmjs.com/package/postcss-less)
- [postcss-html](https://www.npmjs.com/package/postcss-html)
- [postcss-lit](https://www.npmjs.com/package/postcss-lit)

The latter two use `Document` nodes, [introduced in PostCSS 8.3](https://github.com/postcss/postcss/releases/tag/8.3.0) to support files with multiple roots.

After publishing your custom syntax, we recommend creating a shared-config that:

- extends the [standard config](https://github.com/stylelint/stylelint-config-standard)
- bundles your custom syntax
- turns off any incompatible built-in rules

All within an `overrides` for the supported file extensions.

For example, if you're creating a custom syntax for a language called "foo" (which uses the file extension `.foo`), we recommend creating a shared-config called "stylelint-config-standard-foo" with the following content:

```js
module.exports = {
  overrides: [
    {
      files: ["*.foo", "**/*.foo"],
      customSyntax: require("postcss-foo"),
      extends: ["stylelint-config-standard"],
      rules: {
        "at-rule-no-unknown": null
        // ..
      }
    }
  ]
};
```

We recommended requiring the custom syntax until PostCSS@7 is no longer in circulation.
