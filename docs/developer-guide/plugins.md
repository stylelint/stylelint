# Writing plugins

```js
// Abbreviated example:

var stylelint = require("stylelint")

var myPluginRuleName = "foobar"
var myPluginRule = stylelint.createPlugin(myPluginRuleName, function(expectationKeyword, optionsObject) {
  return function(postcssRoot, postcssResult) {
    // ... some logic ...
    stylelint.utils.report({ .. })
  }
}
```

`stylelint.createPlugin(ruleName, ruleFunction)` ensures that your plugin will be setup properly alongside other rules.
*Make sure you document your plugin's rule name for users, because they will need to use it in their config.*

In order for your plugin rule to work with the standard configuration format, (e.g. `["tab", { hierarchicalSelectors: true }]`), `ruleFunction` should accept 2 arguments: the expectation keyword (e.g. `"tab"`) and, optionally, an options object (e.g. `{ hierarchicalSelectors: true }`).

`ruleFunction` should return a function that is essentially a little PostCSS plugin: it takes 2 arguments: the PostCSS Root (the parsed AST), and the PostCSS LazyResult.
You'll have to [learn about the PostCSS API](https://github.com/postcss/postcss/blob/master/docs/api.md).

A few of stylelint's internal utilities are exposed publicly in `stylelint.utils`, to help you write plugin rules.
For details about the APIs of these functions, please look at comments in the source code and examples in the standard rules.

- `report`: Report your linting warnings. *You'll want to use this: do not use `node.warn()` directly.* If you use `report`,
your plugin will respect disabled ranges and other possible future features of stylelint, so it will fit in better with the standard rules.
- `ruleMessages`: Tailor your messages to look like the messages of other stylelint rules. Currently, this means that the name of the rule is appended, in parentheses, to the end of the message.
- `styleSearch`: Search within CSS strings, and for every match found invoke a callback, passing a match object with details about the match. `styleSearch` ignores CSS strings (e.g. `content: "foo";`) and by default ignores comments. It can also be restricted to substrings within or outside of CSS functional notation.
- `validateOptions`: Help your user's out by checking that the options they've submitted are valid.

## Testing plugins

For testing your plugin, you might consider using the same rule-testing function that stylelint uses internally: [`stylelint-rule-tester`](https://github.com/stylelint/stylelint-rule-tester).
