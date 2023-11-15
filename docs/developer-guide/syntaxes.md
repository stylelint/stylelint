# Writing custom syntaxes

Custom syntaxes are [PostCSS](https://github.com/postcss/postcss) syntaxes written by the community to support other styling languages, e.g. SCSS, and containers, e.g. HTML, using the [`customSyntax` option](../user-guide/options.md#customsyntax).

To write one, familiarize yourself with PostCSS's [how to write custom syntax](https://postcss.org/docs/how-to-write-custom-syntax) guide. You can use one of the existing custom syntaxes from [Awesome Stylelint](https://github.com/stylelint/awesome-stylelint/#readme) for reference.

After publishing your custom syntax, we recommend creating a shared config that:

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

We recommended requiring the custom syntax until PostCSS v7 is no longer in circulation.
