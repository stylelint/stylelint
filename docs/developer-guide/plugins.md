# Writing plugins

```js
// Abbreviated example:

var stylelint = require("stylelint")

var myPluginRule = function(expectationKeyword, optionsObject) {
  return function(postcssRoot, postcssResult) {
    // ... some logic ...
    stylelint.utils.report({ .. })
  }
}
```

In order for your plugin rule to work with the standard configuration format, (e.g. `[2, "tab", { hierarchicalSelectors: true }]`), it should be a function that accepts 2 arguments: the expectation keyword (e.g. `"tab"`) and, optionally, an options object (e.g. `{ hierarchicalSelectors: true }`).

It should return a function that is essentially a little PostCSS plugin: it takes 2 arguments: the PostCSS Root (the parsed AST), and the PostCSS LazyResult.
You'll have to [learn about the PostCSS API](https://github.com/postcss/postcss/blob/master/docs/api.md).

A few of stylelint's internal utilities are exposed publicly in `stylelint.utils`, to help you write plugin rules.
For details about the APIs of these functions, please look at comments in the source code and examples in the standard rules.

- `report`: Report your linting warnings. *You'll want to use this: do not use `node.warn()` directly.* If you use `report`,
your plugin will respect disabled ranges and other possible future features of stylelint, so it will fit in better with the standard rules.
- `ruleMessages`: Tailor your messages to look like the messages of other stylelint rules. Currently, this means that the name of the rule is appended, in parentheses, to the end of the message.
- `styleSearch`: Search within CSS strings, and for every match found invoke a callback, passing a match object with details about the match. `styleSearch` ignores CSS strings (e.g. `content: "foo";`) and by default ignores comments. It can also be restricted to substrings within or outside of CSS functional notation.

## Testing plugins

For testing your plugin, you might consider using the same rule-testing function that stylelint uses internally: https://github.com/stylelint/stylelint-rule-tester.
