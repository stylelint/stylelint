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
})
```

`stylelint.createPlugin(ruleName, ruleFunction)` ensures that your plugin will be setup properly alongside other rules. *Make sure you document your plugin's rule name for users, because they will need to use it in their config.*

In order for your plugin rule to work with the standard configuration format, (e.g. `["tab", { hierarchicalSelectors: true }]`), `ruleFunction` should accept 2 arguments: the expectation keyword (e.g. `"tab"`) and, optionally, an options object (e.g. `{ hierarchicalSelectors: true }`).

`ruleFunction` should return a function that is essentially a little PostCSS plugin: it takes 2 arguments: the PostCSS Root (the parsed AST), and the PostCSS LazyResult. You'll have to [learn about the PostCSS API](https://github.com/postcss/postcss/blob/master/docs/api.md).

## `stylelint.utils`

A few of stylelint's internal utilities are exposed publicly in `stylelint.utils`, to help you write plugin rules. For details about the APIs of these functions, please look at comments in the source code and examples in the standard rules.

- `report`: Report your linting warnings. *You'll want to use this: do not use `node.warn()` directly.* If you use `report`, your plugin will respect disabled ranges and other possible future features of stylelint, so it will fit in better with the standard rules.
- `ruleMessages`: Tailor your messages to look like the messages of other stylelint rules. Currently, this means that the name of the rule is appended, in parentheses, to the end of the message.
- `styleSearch`: Search within CSS strings, and for every match found invoke a callback, passing a match object with details about the match. `styleSearch` ignores CSS strings (e.g. `content: "foo";`) and by default ignores comments. It can also be restricted to substrings within or outside of CSS functional notation.
- `validateOptions`: Help your user's out by checking that the options they've submitted are valid.

## `stylelint.rules`

All of the rule functions are available at `stylelint.rules`. This allows you to build on top of existing rules for your particular needs.

A typical use-case is to build in more complex conditionals that the rule's options allow for. For example, maybe your codebase uses special comment directives to customize rule options for specific stylesheets. You could build a plugin that checks those directives and then runs the appropriate rules with the right options (or doesn't run them at all).

All rules share a common signature. They are a function that accepts two arguments: a primary option and a secondary options object. And that functions returns a function that has the signature of a PostCSS plugin, expecting a PostCSS root and result as its arguments.

Here's a simple example of a plugin that runs `color-hex-case` only if there is a special directive `@@check-color-hex-case` somewhere in the stylesheet:

```js
export default stylelint.createPlugin(ruleName, function (expectation) {
  const runColorHexCase = stylelint.rules["color-hex-case"](expectation)
  return (root, result) => {
    if (root.toString().indexOf("@@check-color-hex-case") === -1) return
    runColorHexCase(root, result)
  }
})
```

## Testing plugins

For testing your plugin, you might consider using the same rule-testing function that stylelint uses internally: [`stylelint-rule-tester`](https://github.com/stylelint/stylelint-rule-tester).

## Adding plugins to the list

Once your plugin is published, please send us a Pull Request to add your plugin to [the list](/docs/user-guide/plugins.md).
