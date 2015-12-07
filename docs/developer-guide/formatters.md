# Writing formatters

A formatter is a function that accepts *an array of these stylelint result objects* and outputs a string:

```js
// A stylelint result object
{
  source:  "path/to/file.css", // The filepath or PostCSS identifier like <input css 1>
  errored: true, // This is `true` if at least one rule with a severity of 2 triggered a warning
  warnings: [ // Array of rule violation warning objects, each like the following ...
    {
      line: 3,
      column: 12,
      rule: "block-no-empty",
      severity: 2,
      text: "You should not have an empty block (block-no-empty)"
    },
    ..
  ],
  deprecations: [ // Array of deprecation warning objects, each like the following ...
    {
      text: "Feature X has been deprecated and will be removed in the next major version.",
      reference: "http://stylelint.io/?/docs/feature-x.md"
    }
  ]
}
```
